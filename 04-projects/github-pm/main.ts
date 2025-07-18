/// <reference lib="deno.ns" />

// main.ts
import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";

// Configuration constants
const DAYS_LOOKBACK = 7;  // Number of days to look back for the report

// Interfaces
interface ProjectSummary {
  title: string;
  items: ProjectItem[];
  statusCounts: Record<string, number>;
}

interface AggregatedData {
  byProject: Record<string, ProjectSummary>;
  totalCounts: Record<string, number>;
  byRepo: Record<string, ProjectItem[]>;
}

interface FieldValue {
  name?: string;
  date?: string;
  text?: string;
  field?: {
    name?: string;
  };
}

interface Label {
  name: string;
}

interface Content {
  title?: string;
  url?: string;
  state?: string;
  number?: number;
  updatedAt?: string;
  labels?: {
    nodes: Label[];
  };
  repository?: {
    name?: string;
  };
}

interface ProjectItem {
  id?: string;
  fieldValues?: {
    nodes?: FieldValue[];
  };
  content?: Content;
}

interface ProjectData {
  user?: {
    projectV2?: {
      title?: string;
      items?: {
        nodes?: ProjectItem[];
      };
    };
  };
}

// GitHub API Client
class GitHubClient {
  constructor(private token: string) {}

  async queryGraphQL(query: string, variables: Record<string, unknown>): Promise<any> {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL Errors: ${JSON.stringify(data.errors)}`);
    }

    return data;
  }
}

// Anthropic API Client
class AnthropicClient {
  constructor(private apiKey: string) {}

  async createMessage(prompt: string): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }
}

// Main Project Summary Class
class GitHubProjectsSummary {
  private github: GitHubClient;
  private anthropic: AnthropicClient;
  private promptTemplate: string;
  private repoConfig: any;
  
  // GraphQL Queries
  private readonly PROJECT_QUERY = `
    query($username: String!, $number: Int!) {
      user(login: $username) {
        projectV2(number: $number) {
          title
          items(first: 100) {
            nodes {
              id
              fieldValues(first: 10) {
                nodes {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                    field {
                      ... on ProjectV2SingleSelectField {
                        name
                      }
                    }
                  }
                }
              }
              content {
                ... on Issue {
                  title
                  url
                  state
                  number
                  updatedAt
                  labels(first: 10) {
                    nodes {
                      name
                    }
                  }
                  repository {
                    name
                  }
                }
                ... on PullRequest {
                  title
                  url
                  state
                  number
                  updatedAt
                  labels(first: 10) {
                    nodes {
                      name
                    }
                  }
                  repository {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

 private readonly LIST_PROJECTS_QUERY = `
    query($username: String!) {
      user(login: $username) {
        projectsV2(first: 20, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            number
            title
            closed
            updatedAt
          }
        }
      }
    }
  `;

  constructor(githubToken: string, anthropicKey: string, private username: string) {
    this.github = new GitHubClient(githubToken);
    this.anthropic = new AnthropicClient(anthropicKey);
  }

  async initialize() {
    try {
      this.promptTemplate = await Deno.readTextFile('./config/prompt-template.md');
      const repoConfigText = await Deno.readTextFile('./config/repos.json');
      this.repoConfig = JSON.parse(repoConfigText);
    } catch (error) {
      console.error('Error loading configurations:', error);
      throw error;
    }
  }

  private getRepoDisplayName(repoName: string): string {
    const repo = this.repoConfig.repositories.find(r => r.name === repoName);
    return repo?.display || repoName;
  }

  private sortReposByPriority(repos: string[]): string[] {
    return repos.sort((a, b) => {
      const repoA = this.repoConfig.repositories.find(r => r.name === a);
      const repoB = this.repoConfig.repositories.find(r => r.name === b);
      return (repoA?.priority || 999) - (repoB?.priority || 999);
    });
  }

 async listProjects(): Promise<{ number: number; title: string }[]> {
    const response = await this.github.queryGraphQL(this.LIST_PROJECTS_QUERY, {
      username: this.username,
    });

    return response.data?.user?.projectsV2?.nodes
      ?.filter(project => project && !project.closed)
      || [];
  }

  private async getProjectData(projectNumber: number): Promise<ProjectData> {
    const variables = {
      username: this.username,
      number: projectNumber,
    };

    const response = await this.github.queryGraphQL(this.PROJECT_QUERY, variables);
    
    if (!response.data?.user?.projectV2) {
      throw new Error(`No project found with number ${projectNumber}`);
    }
    
    return response.data;
  }

  private isItemInDateRange(item: ProjectItem): boolean {
    if (!item?.content?.updatedAt) return false;
    const updatedAt = new Date(item.content.updatedAt);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - DAYS_LOOKBACK);
    return updatedAt >= cutoffDate;
  }

  private getItemStatus(item: ProjectItem): string {
    const statusField = item.fieldValues?.nodes?.find(
      f => f?.field?.name === "Status"
    );
    if (statusField?.name) {
      return statusField.name;
    }
    return item.content?.state || "No Status";
  }

  private getStatusCounts(items: ProjectItem[]): Record<string, number> {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      const status = this.getItemStatus(item);
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }

  private async getAllProjectsData(): Promise<AggregatedData> {
    const projects = await this.listProjects();
    const aggregatedData: AggregatedData = {
      byProject: {},
      totalCounts: {},
      byRepo: {}
    };

    for (const project of projects) {
      const projectData = await this.getProjectData(project.number);
      const items = projectData.user?.projectV2?.items?.nodes || [];
      const filteredItems = items.filter(item => this.isItemInDateRange(item));
      
      aggregatedData.byProject[project.title || ''] = {
        title: project.title || '',
        items: filteredItems,
        statusCounts: this.getStatusCounts(filteredItems)
      };

      const statusCounts = this.getStatusCounts(filteredItems);
      Object.entries(statusCounts).forEach(([status, count]) => {
        aggregatedData.totalCounts[status] = (aggregatedData.totalCounts[status] || 0) + count;
      });

      filteredItems.forEach(item => {
        const repoName = item?.content?.repository?.name;
        if (repoName) {
          aggregatedData.byRepo[repoName] = aggregatedData.byRepo[repoName] || [];
          if (!aggregatedData.byRepo[repoName].some(existing => 
            existing.content?.url === item.content?.url
          )) {
            aggregatedData.byRepo[repoName].push(item);
          }
        }
      });
    }

    return aggregatedData;
  }

  private formatAggregatedData(data: AggregatedData): string {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - DAYS_LOOKBACK);
    
    let formatted = `# Multi-Project Status Report\n`;
    formatted += `Report Period: Last ${DAYS_LOOKBACK} days (since ${cutoffDate.toLocaleDateString()})\n\n`;

    formatted += "## Overall Status\n";
    Object.entries(data.totalCounts).forEach(([status, count]) => {
      formatted += `- ${status}: ${count} items\n`;
    });
    formatted += "\n";

    for (const [projectTitle, projectData] of Object.entries(data.byProject)) {
      formatted += `## Project: ${projectTitle}\n`;
      
      formatted += "### Status Overview\n";
      Object.entries(projectData.statusCounts).forEach(([status, count]) => {
        formatted += `- ${status}: ${count} items\n`;
      });
      formatted += "\n";

      const byRepo: Record<string, Record<string, ProjectItem[]>> = {};
      projectData.items.forEach(item => {
        const repoName = item?.content?.repository?.name;
        if (!repoName) return;

        const status = this.getItemStatus(item);
        byRepo[repoName] = byRepo[repoName] || {};
        byRepo[repoName][status] = byRepo[repoName][status] || [];
        byRepo[repoName][status].push(item);
      });

      const repoNames = Object.keys(byRepo);
      const sortedRepoNames = this.sortReposByPriority(repoNames);

      for (const repo of sortedRepoNames) {
        formatted += `### ${this.getRepoDisplayName(repo)}\n`;
        const statusGroups = byRepo[repo];
        
        for (const [status, items] of Object.entries(statusGroups)) {
          formatted += `\n#### ${status}\n`;
          
          for (const item of items) {
            if (!item?.content?.title) continue;

            formatted += `- [${item.content.title}](${item.content.url})\n`;
            
            const labels = item.content?.labels?.nodes
              ?.filter(l => l?.name)
              .map(l => l.name)
              .join(", ");
            if (labels) {
              formatted += `  - Labels: ${labels}\n`;
            }

            if (item.content.updatedAt) {
              formatted += `  - Updated: ${new Date(item.content.updatedAt).toLocaleDateString()}\n`;
            }
          }
        }
        formatted += "\n";
      }
    }

    formatted += "## Work In Progress Overview\n";
    const sortedRepos = this.sortReposByPriority(Object.keys(data.byRepo));
    
    for (const repo of sortedRepos) {
      const items = data.byRepo[repo];
      const inProgressItems = items.filter(item => 
        this.getItemStatus(item).toLowerCase().includes('progress')
      );
      
      if (inProgressItems.length > 0) {
        formatted += `\n### ${this.getRepoDisplayName(repo)}\n`;
        inProgressItems.forEach(item => {
          if (!item?.content?.title) return;
          formatted += `- [${item.content.title}](${item.content.url})\n`;
        });
      }
    }

    return formatted;
  }

  async generateWeeklySummary(): Promise<string> {
    const aggregatedData = await this.getAllProjectsData();
    
    const prompt = this.promptTemplate
      .replace('{projectData}', this.formatAggregatedData(aggregatedData))
      .replace('{days}', String(DAYS_LOOKBACK))
      .replace('{startDate}', new Date(Date.now() - DAYS_LOOKBACK * 86400000).toLocaleDateString())
      .replace('{projectList}', Object.keys(aggregatedData.byProject).join(', '));

    const summary = await this.anthropic.createMessage(prompt);
    
    const today = new Date().toISOString().split('T')[0];
    const filename = `report-${today}.md`;
    const content = `${this.formatAggregatedData(aggregatedData)}\n\n## AI Generated Summary\n\n${summary}`;
    
    await Deno.writeTextFile(filename, content);
    console.log(`Report written to ${filename}`);

    return summary;
  }
}

// Main execution
async function main() {
  try {
    const env = await load();
    console.log("Loaded environment variables:", env);
    
    const githubToken = env["GITHUB_TOKEN"];
    const anthropicKey = env["ANTHROPIC_API_KEY"];
    const username = env["GITHUB_USERNAME"];

    if (!githubToken || !anthropicKey || !username) {
      console.error("Missing required environment variables");
      Deno.exit(1);
    }

    const summarizer = new GitHubProjectsSummary(githubToken, anthropicKey, username);
    await summarizer.initialize();

    console.log("Generating summary for all projects...");
    const summary = await summarizer.generateWeeklySummary();
    console.log("\nSummary:");
    console.log(summary);
  } catch (error) {
    console.error("Error generating summary:", error);
  }
}

if (import.meta.main) {
  main();
}