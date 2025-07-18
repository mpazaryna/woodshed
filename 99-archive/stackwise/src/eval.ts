// eval.ts
import { join } from "https://deno.land/std/path/mod.ts";
import { ChatAnthropic } from "npm:@langchain/anthropic";
import { log, readFile, writeFile, ensureDirectory, getEnvVariable } from "./utils.ts";
import { domainConfigs, type DomainConfig } from "./domains/configs.ts";

class DomainEvaluator {
  private readonly domainConfig: DomainConfig;
  private readonly baseDir: string;
  private readonly model: ChatAnthropic;
  private templateCache: Map<string, string>;

  constructor(domainConfig: DomainConfig, baseDir: string = "./data") {
    this.domainConfig = domainConfig;
    this.baseDir = baseDir;
    this.model = new ChatAnthropic({
      modelName: "claude-3-sonnet-20240229",
      anthropicApiKey: getEnvVariable("ANTHROPIC_API_KEY"),
    });
    this.templateCache = new Map();
  }

  private get evalsDir(): string {
    return join(this.baseDir, "evals");
  }

  private get templatesDir(): string {
    return join(this.baseDir, "templates/eval");
  }

  async initialize(): Promise<void> {
    await ensureDirectory(this.evalsDir);
    await ensureDirectory(this.templatesDir);
    await log("Initializing evaluator...", "eval.log");
    await this.initializeTemplates();
  }

  private async initializeTemplates(): Promise<void> {
    try {
      // Loads the default template specified in the config
      const defaultTemplatePath = join(this.templatesDir, this.domainConfig.defaultTemplate);
      const defaultTemplate = await readFile(defaultTemplatePath);
      this.templateCache.set(this.domainConfig.defaultTemplate, defaultTemplate);

      // Loads all templates specified in templateMappings
      for (const templateFile of new Set(Object.values(this.domainConfig.templateMappings))) {
        const templatePath = join(this.templatesDir, templateFile);
        try {
          const templateContent = await readFile(templatePath);
          this.templateCache.set(templateFile, templateContent);
          await log(`Loaded template: ${templateFile}`, "eval.log");
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          await log(`WARNING: Failed to load template ${templateFile}: ${errorMessage}`, "eval.log");
        }
      }
    } catch (error) {
      await log(`ERROR: Failed to initialize templates: ${error}`, "eval.log");
      throw new Error("Failed to initialize templates");
    }
  }

  private async getTemplate(primitiveType: string): Promise<string> {
    let templateFile: string;
    
    // Special handling for principle-* types
    if (primitiveType.startsWith('principle-')) {
      templateFile = this.domainConfig.templateMappings['principle'];
    } else {
      templateFile = this.domainConfig.templateMappings[primitiveType];
    }

    // Falls back to default template if no mapping found
    if (!templateFile) {
      templateFile = this.domainConfig.defaultTemplate;
    }

    // Try to get template from cache
    let template = this.templateCache.get(templateFile);
    if (!template) {
      // Load template from file if not in cache
      try {
        const templatePath = join(this.templatesDir, templateFile);
        template = await readFile(templatePath);
        this.templateCache.set(templateFile, template);
      } catch (_error) {
        console.warn(`Failed to load template ${templateFile}, using default template`);
        template = this.templateCache.get(this.domainConfig.defaultTemplate);
        if (!template) {
          throw new Error("Default template not found");
        }
      }
    }

    return template;
  }

  private async parseXmlContent(content: string): Promise<{
    primitiveType: string;
    content: string;
  }> {
    // Look for principle-* elements anywhere in the content
    const principleMatch = content.match(/<(principle-[a-zA-Z-]+)[^>]*>/);
    if (principleMatch) {
      return {
        primitiveType: principleMatch[1],
        content: content
      };
    }

    // Look for other known primitive types
    const knownTypes = Object.keys(this.domainConfig.templateMappings);
    for (const type of knownTypes) {
      const typeRegex = new RegExp(`<(${type})[^>]*>`);
      const match = content.match(typeRegex);
      if (match) {
        return {
          primitiveType: match[1],
          content: content
        };
      }
    }

    // If we still haven't found a match, warn and use the root element
    const rootMatch = content.match(/<(\w+(-\w+)*)[^>]*>/);
    if (rootMatch) {
      console.warn(`No recognized primitive type found, defaulting to root element: ${rootMatch[1]}`);
      return {
        primitiveType: rootMatch[1],
        content: content
      };
    }

    throw new Error("Could not determine primitive type from XML content");
  }

  private extractPrimitiveContent(content: string): string {
    // Extract content from principle-* elements
    const principleMatch = content.match(/<principle-[a-zA-Z-]+[^>]*>([\s\S]*?)<\/principle-[a-zA-Z-]+>/);
    if (principleMatch) {
      const ruleMatch = principleMatch[1].match(/<rule[^>]*>([\s\S]*?)<\/rule>/);
      return ruleMatch ? ruleMatch[1].trim() : principleMatch[1].trim();
    }

    // Try known primitive types
    const knownTypes = Object.keys(this.domainConfig.templateMappings);
    for (const type of knownTypes) {
      const typeRegex = new RegExp(`<${type}[^>]*>([\s\S]*?)<\/${type}>`);
      const match = content.match(typeRegex);
      if (match) {
        // Extract rule content if it exists
        const ruleMatch = match[1].match(/<rule[^>]*>([\s\S]*?)<\/rule>/);
        return ruleMatch ? ruleMatch[1].trim() : match[1].trim();
      }
    }

    // Fallback to any content between tags
    const contentMatch = content.match(/<[^>]+>([\s\S]*)<\/[^>]+>/);
    return contentMatch ? contentMatch[1].trim() : content;
  }

  private buildEvaluationPrompt(
    template: string,
    content: string
  ): string {
    return `${template}

Content to evaluate:
${content}

Provide a detailed evaluation focusing on the content and effectiveness of the rules/guidance.`;
  }

  private formatEvaluation(content: string): string {
    const cleanContent = content
      .replace(/^"/, '')
      .replace(/"$/, '')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .trim();

    return `Evaluation Results
==================
${cleanContent}`;
  }

  private async generateEvaluation(
    primitiveType: string,
    content: string
  ): Promise<string> {
    const template = await this.getTemplate(primitiveType);
    const prompt = this.buildEvaluationPrompt(template, content);
    const response = await this.model.invoke(prompt);
    return this.formatEvaluation(JSON.stringify(response.content));
  }

  async evaluateFile(filePath: string): Promise<void> {
    const fileName = filePath.split("/").pop() || "";
    
    try {
      await log(`Evaluating ${fileName}`, "eval.log");
      
      const fileContent = await readFile(filePath);
      const { primitiveType, content } = await this.parseXmlContent(fileContent);
      const primitiveContent = await this.extractPrimitiveContent(content);
      
      await log(`Detected primitive type: ${primitiveType}`, "eval.log");
      
      const templateFile = primitiveType.startsWith('principle-') 
        ? this.domainConfig.templateMappings['principle']
        : this.domainConfig.templateMappings[primitiveType] || this.domainConfig.defaultTemplate;
      
      await log(`Using template: ${templateFile}`, "eval.log");
      
      const evaluation = await this.generateEvaluation(primitiveType, primitiveContent);
      const outputPath = join(this.evalsDir, `${fileName}-eval.txt`);
      await writeFile(outputPath, evaluation);
      
      await log(`Evaluation complete: ${outputPath}`, "eval.log");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      await log(`ERROR evaluating ${fileName}: ${errorMessage}`, "eval.log");
      console.error("Detailed error:", errorStack || errorMessage);
      throw error;
    }
  }

}

export { DomainEvaluator };