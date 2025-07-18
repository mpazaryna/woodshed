// types.ts
export interface DomainCategory {
  name: string;
  description: string;
  weight: number;
}

export interface DomainConfig {
  name: string;
  description: string;
  categories: DomainCategory[];
  defaultTemplate: string;
  templateMappings: Record<string, string>;
}

export interface Issue {
  text: string;
  files: Set<string>;
  count: number;
  variations: Set<string>;
  isPositive: boolean;
}

export interface CategoryAnalysis {
  totalIssues: number;
  issues: Map<string, Issue>;
  files: Set<string>;
  improvements: Issue[];
  gaps: Issue[];
}

export interface AnalysisReport {
  domain: string;
  totalFilesAnalyzed: number;
  categories: Map<string, CategoryAnalysis>;
  timestamp: string;
  fileAliases: Map<string, string>;
}