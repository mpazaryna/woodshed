// chopper.ts
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

// Function to create XML content with meta
function createXMLContent(meta: any, section: string, content: any) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<template>
  <meta>
    <id>${meta.id}</id>
    <name>${meta.name}</name>
    <tags>
    ${meta.tags.map((tag: string) => `  <tag>${tag}</tag>`).join('\n    ')}
    </tags>
    <metadata>
      <author>${meta.author}</author>
      <created>${meta.created}</created>
      <modified>${meta.modified}</modified>
    </metadata>
  </meta>
  ${content}
</template>`;
}

// Function to serialize XML content
function serializeContent(obj: any): string {
    if (typeof obj === 'string') {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => serializeContent(item)).join('\n    ');
    }
    
    if (typeof obj === 'object') {
        let result = '';
        for (const [key, value] of Object.entries(obj)) {
            if (key.startsWith('@')) continue;
            
            const attrs = Object.entries(obj)
                .filter(([k]) => k.startsWith('@'))
                .map(([k, v]) => `${k.slice(1)}="${v}"`)
                .join(' ');
                
            if (Array.isArray(value)) {
                result += value.map(item => {
                    if (typeof item === 'string') {
                        return `<${key}>${item}</${key}>`;
                    }
                    return `<${key}${attrs ? ' ' + attrs : ''}>\n    ${serializeContent(item)}\n</${key}>`;
                }).join('\n    ');
            } else {
                result += `<${key}${attrs ? ' ' + attrs : ''}>${serializeContent(value)}</${key}>`;
            }
        }
        return result;
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
    const fileName = join(OUTPUT_DIR, `${sectionName}.xml`);
    const xmlContent = createXMLContent(meta, sectionName, serializeContent({[sectionName]: content}));
    
    try {
        await Deno.writeTextFile(fileName, xmlContent);
        console.log(`Created ${fileName}`);
        await log(`Created primitive section file: ${fileName}`, "chopper.log");
    } catch (error) {
        await log(`ERROR: Failed to write section file ${fileName}: ${error}`, "chopper.log");
        throw error;
    }
}

// Main function to split the XML
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