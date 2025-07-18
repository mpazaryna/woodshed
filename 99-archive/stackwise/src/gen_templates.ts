/**
 * @fileoverview Template Generator Module
 * 
 * This module handles the automatic generation of domain-specific templates
 * based on configuration files. It processes domain configurations and produces
 * structured templates that enforce consistent tag usage and domain rules.
 * 
 * @module templateGenerator
 */

import { join } from "https://deno.land/std@0.217.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.217.0/fs/walk.ts";
import { config } from "./config.ts";

/**
 * Generates templates for all domains based on their configuration files.
 * Walks through the configuration directory, processes each config.json file,
 * and generates corresponding templates in the output directory.
 * 
 * @async
 * @throws {Error} If there are issues accessing the filesystem or processing configs
 * @returns {Promise<void>}
 */
async function generateTemplates() {
  const configDir = config.directories.index;
  const templatesDir = config.directories.templates;

  console.log('Starting template generation...');

  try {
    await Deno.mkdir(templatesDir, { recursive: true });

    for await (const entry of walk(configDir, {
      includeDirs: false,
      match: [/config\.json$/],
    })) {
      console.log(`Found config file: ${entry.path}`);
      
      try {
        const configContent = await Deno.readTextFile(entry.path);
        const config = JSON.parse(configContent);
        
        console.log(`Processing domain: ${config.domain.name}`);

        const templateContent = generateTemplate(config);

        const templatePath = join(templatesDir, config.domain.name);
        await Deno.mkdir(templatePath, { recursive: true });

        const templateFilePath = join(templatePath, 'template.txt');
        await Deno.writeTextFile(templateFilePath, templateContent);
        
        console.log(`Generated template for ${config.domain.name} at ${templateFilePath}`);

      } catch (error) {
        console.error(`Error processing ${entry.path}:`, error);
        continue;
      }
    }

    console.log('Template generation complete!');
  } catch (error) {
    console.error('Error during template generation:', error);
  }
}

/**
 * Generates a domain-specific template based on configuration.
 * Handles both compute domains with language-specific requirements
 * and general domains with simple tag selection.
 * 
 * @param {Object} config - The domain configuration object
 * @returns {string} The generated template
 */
function generateTemplate(config: any): string {
  const isComputeDomain = config.domain.name.includes('compute');
  let template = `You are a tag analysis system for ${config.domain.name}.\n\n`;

  // Add context section
  template += `CONTEXT:\n`;
  if (isComputeDomain) {
    template += `You analyze user inputs to identify programming languages, frameworks, and relevant development practices.\n\n`;
  } else {
    template += `You analyze user inputs to identify relevant tags and categories.\n\n`;
  }

  // Add languages section for compute domains
  if (isComputeDomain && config.contextTypes?.languages) {
    template += `AVAILABLE LANGUAGES (Only these are supported):\n`;
    template += `${config.contextTypes.languages.map(l => `- ${l.name}`).join('\n')}\n\n`;
  }

  // Add categories if they exist
  if (config.contextTypes?.categories) {
    template += `TAG CATEGORIES:\n`;
    template += `${config.contextTypes.categories.map(c => `- ${c}`).join('\n')}\n\n`;
  }

  // Add tags section
  template += `AVAILABLE TAGS:\n`;
  if (isComputeDomain) {
    // Add generic tags
    template += `Generic Tags (can be used with any language):\n`;
    template += `${config.tagTypes.generic.tags.map(t => `- ${t.name}`).join('\n')}\n\n`;
    
    // Add language-specific tags
    if (config.tagTypes.language_specific) {
      template += `Language-Specific Tags (MUST be included when their language is detected):\n`;
      template += `${Object.entries(config.tagTypes.language_specific.tags)
        .map(([lang, tags]) => `${lang}:\n${tags.map(t => `  - ${t}`).join('\n')}`)
        .join('\n')}\n\n`;
    }
  } else {
    // Simple tag list for non-compute domains
    template += `${config.tagTypes.generic.tags.map(t => `- ${t.name}`).join('\n')}\n\n`;
  }

  // Add instructions
  template += `INSTRUCTIONS:\n`;
  if (isComputeDomain) {
    const languageExamples = Object.entries(config.tagTypes.language_specific.tags)
      .map(([lang, tags]) => `   For ${lang}: You must include ${tags.join(', ')}`)
      .join('\n');

    template += `1. First, carefully identify if the user's input mentions one of the supported programming languages listed above.

2. For inputs with a supported language:
   - You MUST include ALL language-specific tags for the detected language
   - Then add relevant generic tags for the task
   - Never omit language-specific tags when their language is detected

Required language-specific tag usage:
${languageExamples}

3. For inputs with an unsupported language or no language:
   - Set detectedLanguage to null
   - Use only generic tags
   - Do not include any language-specific tags

4. Select additional generic tags that capture:
   - Technical requirements
   - Architectural considerations
   - Best practices
   - Quality and maintenance aspects\n\n`;
  } else {
    template += `1. Analyze the user's input
2. Select relevant tags based on the content and requirements
3. Provide reasoning for tag selection\n\n`;
  }

  // Add response format
  template += `Respond in JSON format with:\n`;
  if (isComputeDomain) {
    template += `{
  "detectedLanguage": "the supported language detected (or null if none/unsupported)",
  "tags": ["selected", "tags"],
  "reasoning": "explanation of tag selection and language context"
}\n\n`;
  } else {
    template += `{
  "tags": ["selected", "tags"],
  "reasoning": "explanation of tag selection"
}\n\n`;
  }

  // Add reminders
  template += `Remember:\n`;
  if (isComputeDomain) {
    template += `- You MUST include ALL language-specific tags when their language is detected
- Only the languages listed above are supported
- Generic tags can be used with any language
- Language-specific tags are mandatory for their respective language
- Never mix language-specific tags from different languages
- Always include a clear explanation of language detection and tag selection in your reasoning
- If a language is not in the supported list, treat it as having no language (null)`;
  } else {
    template += `- Only select tags from the provided list
- Focus on the most relevant tags for the specific use case`;
  }

  return template;
}

await generateTemplates();