import { parse as parseXML } from "https://deno.land/x/xml/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { log } from "./utils.ts";

const OUTPUT_DIR = "./data/chopper";

// Function to ensure output directory exists
async function ensureOutputDirectory() {
    try {
        await Deno.mkdir(OUTPUT_DIR, { recursive: true });
        await log(`Created output directory: ${OUTPUT_DIR}`, "chopper.log");
    } catch (error) {
        if (!(error instanceof Deno.errors.AlreadyExists)) {
            await log(`ERROR: Failed to create output directory: ${error}`, "chopper.log");
            throw error;
        }
    }
}

// Function to parse XML data
async function parseXMLFile(filePath: string) {
    try {
        const xmlData = await Deno.readTextFile(filePath);
        await log(`Successfully read XML file: ${filePath}`, "chopper.log");
        return parseXML(xmlData);
    } catch (error) {
        await log(`ERROR: Failed to parse XML file ${filePath}: ${error}`, "chopper.log");
        throw error;
    }
}

// Function to extract meta information
function extractMeta(xmlDoc: any) {
    const meta = xmlDoc.template.meta;
    return {
        id: meta.id || '',
        name: meta.name || '',
        tags: Array.isArray(meta.tags.tag) ? meta.tags.tag : [meta.tags.tag],
        author: meta.metadata.author || '',
        created: meta.metadata.created || '',
        modified: meta.metadata.modified || '',
    };
}

// Function to create markdown content
function createMarkdownContent(meta: any, content: any): string {
    const frontMatter = [
        '---',
        `name: ${meta.name}`,
        `id: ${meta.id}`,
        `description: ${content.description || ''}`,
        `category: ${content.category || 'Uncategorized'}`,
        `author: ${meta.author}`,
        `created: ${meta.created}`,
        `modified: ${meta.modified}`,
        `tags: [${meta.tags.map((tag: string) => `"${tag}"`).join(', ')}]`,
        '---',
        '',
        `# ${meta.name}`,
        ''
    ];

    // Convert content object to markdown
    const contentStr = serializeToMarkdown(content);
    return [...frontMatter, contentStr, ''].join('\n');
}

// Function to serialize content to markdown
function serializeToMarkdown(obj: any, depth: number = 0): string {
    if (typeof obj === 'string') {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => serializeToMarkdown(item, depth)).join('\n\n');
    }
    
    if (typeof obj === 'object') {
        let result = '';
        for (const [key, value] of Object.entries(obj)) {
            if (key.startsWith('@') || ['description', 'category'].includes(key)) continue;
            
            // Get attributes if any
            const attrs = Object.entries(obj)
                .filter(([k]) => k.startsWith('@'))
                .map(([k, v]) => `${k.slice(1)}: ${v}`)
                .join(', ');
            
            // Special handling for principles section
            if (key === 'principles') {
                result += '\n## Principles\n\n';
                if (Array.isArray(value.principle)) {
                    for (const principle of value.principle) {
                        result += `### ${principle['@name'] || 'Unnamed Principle'}\n\n`;
                        if (Array.isArray(principle.rule)) {
                            principle.rule.forEach((rule: any) => {
                                if (typeof rule === 'string') {
                                    result += `- ${rule}\n`;
                                } else if (rule.subrule) {
                                    result += `- ${rule['#text'] || ''}\n`;
                                    const subrules = Array.isArray(rule.subrule) ? rule.subrule : [rule.subrule];
                                    subrules.forEach((subrule: string) => {
                                        result += `  - ${subrule}\n`;
                                    });
                                }
                            });
                        } else if (principle.rule) {
                            result += `- ${principle.rule}\n`;
                        }
                        result += '\n';
                    }
                }
                continue;
            }

            // Special handling for practices section
            if (key === 'practices') {
                result += '\n## Practices\n\n';
                if (Array.isArray(value.category)) {
                    for (const category of value.category) {
                        result += `### ${category['@name']}\n\n`;
                        if (Array.isArray(category.practice)) {
                            category.practice.forEach((practice: string) => {
                                result += `- ${practice}\n`;
                            });
                        } else if (category.practice) {
                            result += `- ${category.practice}\n`;
                        }
                        if (Array.isArray(category.dependency)) {
                            category.dependency.forEach((dep: string) => {
                                result += `- ${dep}\n`;
                            });
                        } else if (category.dependency) {
                            result += `- ${category.dependency}\n`;
                        }
                        result += '\n';
                    }
                }
                continue;
            }

            // Special handling for guidelines section
            if (key === 'guidelines') {
                result += '\n## Guidelines\n\n';
                if (Array.isArray(value.guideline)) {
                    value.guideline.forEach((guideline: string) => {
                        result += `- ${guideline}\n`;
                    });
                } else if (value.guideline) {
                    result += `- ${value.guideline}\n`;
                }
                result += '\n';
                continue;
            }

            // Default handling for other sections
            const title = key.charAt(0).toUpperCase() + key.slice(1)
                .replace(/-/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .trim();

            if (depth === 0) {
                result += `\n## ${title}`;
                if (attrs) {
                    result += ` (${attrs})`;
                }
                result += '\n\n';
            } else {
                result += `${'#'.repeat(depth + 2)} ${title}`;
                if (attrs) {
                    result += ` (${attrs})`;
                }
                result += '\n\n';
            }
            
            if (Array.isArray(value)) {
                if (key === 'elements' || key === 'steps' || key === 'errors' || key === 'rule' || key === 'practice') {
                    result += value.map(item => `- ${serializeToMarkdown(item, depth + 1)}`).join('\n');
                } else {
                    result += value.map(item => serializeToMarkdown(item, depth + 1)).join('\n\n');
                }
            } else if (typeof value === 'object' && value !== null) {
                result += serializeToMarkdown(value, depth + 1);
            } else {
                result += serializeToMarkdown(value, depth + 1);
            }
            
            result += '\n\n';
        }
        return result.trim();
    }
    
    return String(obj);
}

// First, let's add a type interface for the principle structure
interface Principle {
    '@name'?: string;
    [key: string]: unknown;
}

// Update the processPrimitiveSection function signature
async function processPrimitiveSection(meta: any, sectionName: string, content: unknown) {
    const fileName = join(OUTPUT_DIR, `${sectionName}.md`);
    const markdownContent = createMarkdownContent(meta, {[sectionName]: content});
    
    try {
        await Deno.writeTextFile(fileName, markdownContent);
        console.log(`Created ${fileName}`);
        await log(`Created primitive section file: ${fileName}`, "chopper.log");
    } catch (error) {
        await log(`ERROR: Failed to write section file ${fileName}: ${error}`, "chopper.log");
        throw error;
    }
}

// Main function to split the XML into markdown files
async function splitXML(xmlDoc: any) {
    const meta = extractMeta(xmlDoc);
    const primitive = xmlDoc.template.primitive;
    
    // Check if primitive is defined
    if (!primitive) {
        const error = 'The "primitive" section is missing in the XML document.';
        console.error('Error:', error);
        await log(`ERROR: ${error}`, "chopper.log");
        return;
    }
    
    await log(`Starting to process primitive sections`, "chopper.log");
    
    // Process each section in primitive
    for (const [sectionName, content] of Object.entries(primitive)) {
        if (sectionName === 'principles') {
            // Type assert content to handle unknown type
            const contentObj = content as { principle?: Principle | Principle[] };
            
            // Ensure principles is an array
            const principles = Array.isArray(contentObj.principle) 
                ? contentObj.principle 
                : contentObj.principle ? [contentObj.principle] : [];
            
            for (const principle of principles) {
                // Add null check for @name property
                const principleName = principle['@name']
                    ? principle['@name'].toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    : 'unnamed-principle';
                    
                await log(`Processing principle: ${principleName}`, "chopper.log");
                await processPrimitiveSection(meta, `principle-${principleName}`, principle);
            }
        } else {
            await log(`Processing section: ${sectionName}`, "chopper.log");
            await processPrimitiveSection(meta, sectionName, content);
        }
    }
}

// Main execution
async function main() {
    try {
        console.log('Starting XML processing...');
        await log('Starting XML processing...', "chopper.log");
        
        await ensureOutputDirectory();
        const filePath = './data/import/fastapi-python-cursor-rules-5vow08.xml';
        
        console.log('Reading file:', filePath);
        await log(`Reading file: ${filePath}`, "chopper.log");
        
        const xmlDoc = await parseXMLFile(filePath);
        await splitXML(xmlDoc);
        
        console.log('XML processing complete');
        await log('XML processing complete', "chopper.log");
    } catch (error) {
        console.error('Error processing XML:', error);
        await log(`ERROR processing XML: ${error}`, "chopper.log");
        
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Stack trace:', error.stack);
            await log(`Error details: ${error.message}`, "chopper.log");
            await log(`Stack trace: ${error.stack}`, "chopper.log");
        }
    }
}

// Only add the catch handler if this is the main module
if (import.meta.main) {
    main().catch(async (error) => {
        console.error('Fatal error:', error);
        await log(`FATAL ERROR: ${error}`, "chopper.log");
        Deno.exit(1);
    });
} 