/**
 * @fileoverview Content Generation Module
 * 
 * This module provides functionality for generating AI-powered content using domain-specific prompts
 * and the Claude AI model. It implements a structured approach to content generation by:
 * 
 * - Managing domain-specific prompt templates organized in directories
 * - Supporting modular prompt sections (base, requirements, creative, etc.)
 * - Handling configuration through JSON input
 * - Generating unique output directories for content
 * - Providing error handling and validation
 * 
 * The module is designed to work with Deno and requires an ANTHROPIC_API_KEY environment variable.
 * 
 * @module create
 */

import { PromptTemplate } from "npm:@langchain/core/prompts";
import { join } from "https://deno.land/std@0.219.0/path/mod.ts";
import { Section, DomainConfig } from "./types.ts";
import { crypto } from "https://deno.land/std/crypto/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { LLMServiceFactory } from "./services/llm_service.ts";
import { DomainService, type DomainConfig } from "./services/domain_services.ts";

/**
 * Exits the program with an error message
 * @param {string} message - Error message to display
 * @param {number} [code=1] - Exit code
 * @throws {never} Never returns, always exits the program
 */
function exitWithError(message: string, code = 1): never {
  console.error(message);
  Deno.exit(code);
}

/**
 * Creates unique output directory and file paths for generated content
 * @param {string} domain - Domain name
 * @param {string} concept - Content concept
 * @returns {Promise<{dirPath: string, filePath: string}>} Generated paths
 */
async function createOutputPath(domain: string, concept: string): Promise<{ dirPath: string, filePath: string }> {
  // Generate random ID (8 characters)
  const randomBytes = new Uint8Array(4);
  crypto.getRandomValues(randomBytes);
  const randomId = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 8);
  
  // Create directory path
  const dirPath = join("output", `${randomId}-${domain}`);
  
  // Ensure directory exists
  await ensureDir(dirPath);
  
  // Return both directory and file paths
  return {
    dirPath,
    filePath: join(dirPath, "created.md")
  };
}

/**
 * Input configuration for content creation
 * @interface CreateInput
 * @property {string} domain - Target domain
 * @property {string} concept - Content concept
 * @property {string[]} [additionalSections] - Optional additional prompt sections
 */
interface CreateInput {
  domain: string;
  concept: string;
  additionalSections?: string[];
}

/**
 * Main program execution function
 * Reads configuration, validates input, generates content, and saves output
 * @async
 * @throws {Error} If any step in the process fails
 */
async function main() {
  console.log("Starting program...");
  const domainService = new DomainService();
  const domains = await domainService.discoverDomains();
  
  // Read input from create.json
  let input: CreateInput;
  try {
    const jsonContent = await Deno.readTextFile("create.json");
    input = JSON.parse(jsonContent) as CreateInput;
  } catch (error) {
    exitWithError(`Error reading create.json: ${error}`);
  }

  const { domain, concept, additionalSections = [] } = input;
  
  if (!domain || !concept) {
    exitWithError(
      `Invalid create.json: domain and concept are required.\nAvailable domains: ${Object.keys(domains).join(", ")}`
    );
  }

  if (!isValidDomain(domain, domains)) {
    exitWithError(
      `Invalid domain: ${domain}\nAvailable domains: ${Object.keys(domains).join(", ")}`
    );
  }

  try {
    const templateText = await domainService.buildFullPrompt(domain, additionalSections, domains);
    const promptTemplate = PromptTemplate.fromTemplate(templateText);
    const formattedPrompt = await promptTemplate.format({ CONCEPT: concept });

    // Create logs directory and log the formatted prompt
    await ensureDir("logs");
    await Deno.writeTextFile("logs/create.log", formattedPrompt);

    // Simplified service creation
    const llmService = LLMServiceFactory.create("claude");
    const content = await llmService.generateContent(formattedPrompt);

    const { dirPath, filePath } = await createOutputPath(domain, concept);
    await Deno.writeTextFile(filePath, content);
    
    console.log("\n--- CONTENT GENERATED ---");
    console.log(`Output directory: ${dirPath}`);
    console.log(`Saved to: ${filePath}`);
    console.log("\nFirst few lines:");
    console.log(content.split('\n').slice(0, 5).join('\n'));
  } catch (error) {
    exitWithError(`Detailed error: ${error}`);
  }
}

/**
 * Entry point check and execution
 * Runs the main function if this is the main module
 */
if (import.meta.main) {
  console.log("Running main function...");
  main().catch(error => {
    console.error("Unhandled error:", error);
    Deno.exit(1);
  });
}