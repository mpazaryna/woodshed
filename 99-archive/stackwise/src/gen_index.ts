/**
 * @file indexer.ts
 * @description This module scans primitive directories for XML files across different domains,
 *              extracts relevant information, and generates domain-aware JSON indexes.
 * @module indexer
 */

import { walk } from "https://deno.land/std@0.217.0/fs/walk.ts";
import { config } from "./config.ts";
import { log } from "./utils.ts";

interface PrimitiveFile {
  name: string;
  description: string;
  category: string;
  tags: string[];
  path: string;
  domain: string;
}

async function indexer() {
  const primitivesDir = config.directories.primitives;
  const indexDir = config.directories.index;
  const groupedPrimitives = new Map<string, PrimitiveFile[]>();

  await log('Starting primitive index build...', 'indexer.log');

  try {
    // First, get the top-level domains
    for await (const domainEntry of Deno.readDir(primitivesDir)) {
      if (!domainEntry.isDirectory) continue;
      
      const domain = domainEntry.name;
      const domainPath = `${primitivesDir}/${domain}`;

      // Process files in subdirectories
      for await (const file of walk(domainPath, { 
        exts: ['.xml'],
        includeDirs: false,
        skip: [new RegExp(`^${domainPath}/[^/]+\\.xml$`)]
      })) {
        await log(`Found file: ${file.path}`, 'indexer.log');
        const content = await Deno.readTextFile(file.path);
        
        const templateMatch = content.match(/<template name="([^"]+)"/);
        if (templateMatch) {
          const pathParts = file.path.split('/');
          const primitivesIndex = pathParts.indexOf('primitives');
          const topLevelDomain = pathParts[primitivesIndex + 1];
          
          // Determine groupKey and domain based on the path
          let groupKey, fileDomain;
          if (topLevelDomain === 'system') {
            const subDomain = pathParts[primitivesIndex + 2];
            groupKey = `system/${subDomain}`;
            fileDomain = `system/${subDomain}`;
          } else if (topLevelDomain === 'user') {
            const username = pathParts[primitivesIndex + 2];
            groupKey = `user/${username}`;
            fileDomain = `user/${username}`;
          } else {
            const subDomain = pathParts.slice(primitivesIndex + 2, primitivesIndex + 4).join('/');
            groupKey = topLevelDomain;
            fileDomain = `${topLevelDomain}/${subDomain}`;
          }

          const descriptionMatch = content.match(/<description>([^<]+)</);
          const categoryMatch = content.match(/<category>([^<]+)</);
          const tagsMatch = content.match(/<tags>(.*?)<\/tags>/s);
          
          const name = templateMatch[1];
          const description = descriptionMatch ? descriptionMatch[1] : '';
          const category = categoryMatch ? categoryMatch[1] : '';
          const tags = tagsMatch 
            ? tagsMatch[1].match(/<tag>([^<]+)<\/tag>/g)?.map(t => t.replace(/<\/?tag>/g, '')) || []
            : [];
          
          await log(`Parsed template: ${name}`, 'indexer.log');
          
          const primitive: PrimitiveFile = {
            name,
            description,
            category,
            tags,
            domain: fileDomain,
            path: file.path.replace(primitivesDir + '/', '')
          };

          if (!groupedPrimitives.has(groupKey)) {
            groupedPrimitives.set(groupKey, []);
          }
          groupedPrimitives.get(groupKey)?.push(primitive);
        }
      }
    }

    // Create index files (now one per top-level domain or subdomain for system)
    for (const [groupKey, primitives] of groupedPrimitives) {
      const targetIndexPath = `${indexDir}/${groupKey}`;
      
      const meta = {
        filename: 'index.json',
        version: '1.0',
        generated: new Date().toISOString(),
        count: primitives.length,
        domain: groupKey
      };

      const output = {
        meta,
        primitives
      };

      await Deno.mkdir(targetIndexPath, { recursive: true });
      await Deno.writeTextFile(
        `${targetIndexPath}/index.json`,
        JSON.stringify(output, null, 2)
      );
      
      await log(`Created index for ${groupKey} with ${primitives.length} primitives`, 'indexer.log');
    }
    
    await log('\nIndex build complete!', 'indexer.log');
  } catch (error) {
    console.error('Error during indexing:', error);
    await log(`ERROR: ${error}`, 'indexer.log');
  }
}

await indexer();