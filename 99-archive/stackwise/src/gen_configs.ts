/**
 * @file configure.ts
 * @description This module is responsible for generating domain-specific configuration files by analyzing primitive directory structures. 
 * It processes XML files within a specified directory, extracts relevant metadata, and organizes this data into structured JSON configuration files.
 * The configurations are grouped by domain and include information about applicable languages, categories, and tags.
 * 
 * The module utilizes Deno's standard library for file system operations and path manipulations. It is designed to be run as a script, 
 * which will traverse the directory structure, parse XML files, and output JSON configuration files to a specified directory.
 * 
 * @module configure
 */

import { walk } from "https://deno.land/std@0.217.0/fs/walk.ts";
import { join } from "https://deno.land/std@0.217.0/path/mod.ts";

/**
 * Represents the configuration for a specific domain.
 * @typedef {Object} DomainConfig
 * @property {Object} domain - Information about the domain.
 * @property {string} domain.name - The name of the domain.
 * @property {string} domain.version - The version of the domain configuration.
 * @property {string} domain.description - A description of the domain.
 * @property {string} domain.filterStrategy - The strategy used for filtering within the domain.
 * @property {Object} contextTypes - Contextual information related to the domain.
 * @property {LanguageContext[]} contextTypes.languages - An array of language contexts applicable to the domain.
 * @property {string[]} contextTypes.categories - An array of categories applicable to the domain.
 * @property {Object} tagTypes - Information about tags used within the domain.
 * @property {Object} tagTypes.generic - Generic tags applicable across all languages and frameworks.
 * @property {string} tagTypes.generic.description - Description of generic tags.
 * @property {GenericTag[]} tagTypes.generic.tags - An array of generic tags.
 * @property {Object} tagTypes.language_specific - Tags specific to certain languages.
 * @property {string} tagTypes.language_specific.description - Description of language-specific tags.
 * @property {Object} tagTypes.language_specific.rules - Rules governing the use of language-specific tags.
 * @property {boolean} tagTypes.language_specific.rules.allowGenericWithSpecific - Whether generic tags can be used with specific tags.
 * @property {boolean} tagTypes.language_specific.rules.requireLanguageMatch - Whether a language match is required for specific tags.
 * @property {Record<string, string[]>} tagTypes.language_specific.tags - A record of language-specific tags.
 * @property {Object} promptTemplate - Template information for generating prompts.
 * @property {string} promptTemplate.path - The file path to the prompt template.
 * @property {Record<string, string>} promptTemplate.variables - Variables used within the prompt template.
 * @property {Object} outputRules - Rules governing the output of the configuration.
 * @property {boolean} outputRules.includeGenericTags - Whether to include generic tags in the output.
 * @property {boolean} outputRules.includeLanguageTags - Whether to include language-specific tags in the output.
 * @property {boolean} outputRules.requireLanguageDetection - Whether language detection is required.
 * @property {boolean} outputRules.allowUnknownTags - Whether unknown tags are allowed.
 */
interface DomainConfig {
  domain: {
    name: string;
    version: string;
    description: string;
    filterStrategy: string;
  };
  contextTypes: {
    languages: LanguageContext[];
    categories: string[];
  };
  tagTypes: {
    generic: {
      description: string;
      tags: GenericTag[];
    };
    language_specific: {
      description: string;
      rules: {
        allowGenericWithSpecific: boolean;
        requireLanguageMatch: boolean;
      };
      tags: Record<string, string[]>;
    };
  };
  promptTemplate: {
    path: string;
    variables: Record<string, string>;
  };
  outputRules: {
    includeGenericTags: boolean;
    includeLanguageTags: boolean;
    requireLanguageDetection: boolean;
    allowUnknownTags: boolean;
  };
}

/**
 * Represents a language context within a domain configuration.
 * @typedef {Object} LanguageContext
 * @property {string} name - The name of the language.
 * @property {string[]} aliases - An array of aliases for the language.
 * @property {string[]} frameworks - An array of frameworks associated with the language.
 */
interface LanguageContext {
  name: string;
  aliases: string[];
  frameworks: string[];
}

/**
 * Represents a generic tag within a domain configuration.
 * @typedef {Object} GenericTag
 * @property {string} name - The name of the tag.
 * @property {string} description - A description of the tag.
 * @property {boolean} applicableToAll - Whether the tag is applicable to all contexts.
 */
interface GenericTag {
  name: string;
  description: string;
  applicableToAll: boolean;
}

/**
 * Asynchronously builds domain-specific configuration files by analyzing XML files in a directory structure.
 * The function processes each domain directory, extracts metadata from XML files, and generates JSON configuration files.
 * 
 * @async
 * @function configureBuilder
 * @returns {Promise<void>} A promise that resolves when the configuration build is complete.
 */
async function configureBuilder() {
  const primitivesDir = './data/primitives';
  const configDir = './data/idx';
  const groupedConfigs = new Map<string, DomainConfig>();

  console.log('Starting configuration build...');

  try {
    // First, get the top-level domains
    for await (const domainEntry of Deno.readDir(primitivesDir)) {
      if (!domainEntry.isDirectory) continue;
      
      const domain = domainEntry.name;
      const domainPath = `${primitivesDir}/${domain}`;
      
      console.log(`Processing domain: ${domain}`);

      // Process files in subdirectories
      for await (const file of walk(domainPath, { 
        exts: ['.xml'],
        includeDirs: false,
        skip: [new RegExp(`^${domainPath}/[^/]+\\.xml$`)]
      })) {
        console.log(`Analyzing file: ${file.path}`);
        
        const pathParts = file.path.split('/');
        const primitivesIndex = pathParts.indexOf('primitives');
        const topLevelDomain = pathParts[primitivesIndex + 1];
        
        // Determine groupKey based on the path (matching indexer.ts logic)
        let groupKey;
        if (topLevelDomain === 'system') {
          const subDomain = pathParts[primitivesIndex + 2];
          groupKey = `system/${subDomain}`;
        } else if (topLevelDomain === 'user') {
          const username = pathParts[primitivesIndex + 2];
          groupKey = `user/${username}`;
        } else {
          groupKey = topLevelDomain;
        }

        // Initialize config for this group if it doesn't exist
        if (!groupedConfigs.has(groupKey)) {
          groupedConfigs.set(groupKey, {
            domain: {
              name: groupKey,
              version: "1.0",
              description: `${groupKey} domain configuration`,
              filterStrategy: "language-specific"
            },
            contextTypes: {
              languages: [],
              categories: []
            },
            tagTypes: {
              generic: {
                description: "Tags that apply across all languages and frameworks",
                tags: []
              },
              language_specific: {
                description: "Tags that are specific to certain languages",
                rules: {
                  allowGenericWithSpecific: true,
                  requireLanguageMatch: true
                },
                tags: {}
              }
            },
            promptTemplate: {
              path: `prompts/${groupKey}.txt`,
              variables: {
                AVAILABLE_TAGS: "{{tags}}",
                LANGUAGE_CONTEXT: "{{language}}",
                FRAMEWORK_CONTEXT: "{{framework}}"
              }
            },
            outputRules: {
              includeGenericTags: true,
              includeLanguageTags: true,
              requireLanguageDetection: true,
              allowUnknownTags: false
            }
          });
        }

        const config = groupedConfigs.get(groupKey)!;
        
        // Extract category from path
        const category = pathParts[primitivesIndex + 3] || 'uncategorized';
        if (!config.contextTypes.categories.includes(category)) {
          config.contextTypes.categories.push(category);
        }

        // Parse XML content
        const content = await Deno.readTextFile(file.path);
        const categoryMatch = content.match(/<category>([^<]+)</);
        const tagsMatch = content.match(/<tags>(.*?)<\/tags>/s);
        
        if (categoryMatch && !config.contextTypes.categories.includes(categoryMatch[1])) {
          config.contextTypes.categories.push(categoryMatch[1]);
        }

        // Process tags
        if (tagsMatch) {
          const tags = tagsMatch[1].match(/<tag>([^<]+)<\/tag>/g)?.map(t => t.replace(/<\/?tag>/g, '')) || [];
          
          console.log(`Found tags: ${tags.join(', ')}`);
          
          // Analyze tags to determine if language specific
          tags.forEach(tag => {
            if (tag.endsWith('-specific')) {
              const language = tag.replace('-specific', '');
              if (!config.tagTypes.language_specific.tags[language]) {
                config.tagTypes.language_specific.tags[language] = [];
              }
              if (!config.tagTypes.language_specific.tags[language].includes(tag)) {
                config.tagTypes.language_specific.tags[language].push(tag);
              }

              // Add language to contextTypes if not exists
              const languageExists = config.contextTypes.languages.some(l => l.name === language);
              if (!languageExists) {
                config.contextTypes.languages.push({
                  name: language,
                  aliases: [language],
                  frameworks: []
                });
              }
            } else {
              // Check if tag already exists in generic tags
              const tagExists = config.tagTypes.generic.tags.some(t => t.name === tag);
              if (!tagExists) {
                config.tagTypes.generic.tags.push({
                  name: tag,
                  description: `Generic tag for ${tag}`,
                  applicableToAll: true
                });
              }
            }
          });
        }
      }
    }

    // Write configurations following indexer pattern
    for (const [groupKey, config] of groupedConfigs) {
      const configPath = join(configDir, groupKey);
      await Deno.mkdir(configPath, { recursive: true });
      
      const outputPath = join(configPath, 'config.json');
      await Deno.writeTextFile(
        outputPath,
        JSON.stringify(config, null, 2)
      );
      
      console.log(`Created configuration for ${groupKey} at ${outputPath}`);
    }

    console.log('\nConfiguration build complete!');
  } catch (error) {
    console.error('Error during configuration build:', error);
  }
}

await configureBuilder();