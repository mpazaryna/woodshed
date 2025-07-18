/**
 * Content Generation Module
 * Uses domain-specific prompts with Claude AI model
 */

import { join } from "https://deno.land/std@0.219.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { runPrompt, createOutputPath } from "./services/prompt_runner.ts";
import { DomainService, type DomainConfig } from "./services/domain_services.ts";

function exitWithError(message: string, code = 1): never {
  console.error(message);
  Deno.exit(code);
}

interface CreateInput {
  domain: string;
  concept: string;
  additionalSections?: string[];
}

async function main() {
  const domainService = new DomainService();
  const domains = await domainService.discoverDomains();
  const input: CreateInput = JSON.parse(await Deno.readTextFile("create.json"));
  const { domain, concept, additionalSections = [] } = input;

  if (!domain || !concept || !domainService.isValidDomain(domain, domains)) {
    exitWithError(`Invalid input configuration`);
  }

  try {
    const templateText = await domainService.buildFullPrompt(domain, additionalSections, domains);
    await ensureDir("logs");
    await Deno.writeTextFile("logs/create.log", templateText);

    const content = await runPrompt({
      input: concept,
      outputDir: "output", 
      promptPath: "logs/create.log",
      validator: (content) => content.length > 0
    });

    const outputDir = await createOutputPath(domain);
    const outputPath = join(outputDir, "created.md");
    await Deno.writeTextFile(outputPath, content);
    console.log("\n--- CONTENT GENERATED ---");
    console.log(`Content saved to: ${outputPath}`);
    
  } catch (error) {
    exitWithError(`Error: ${error}`);
  }
}

if (import.meta.main) {
  console.log("Running main function...");
  main().catch(error => {
    console.error("Unhandled error:", error);
    Deno.exit(1);
  });
}
