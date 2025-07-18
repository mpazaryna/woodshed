/**
 * @module prep_ab
 * @description A/B test preparation system for story framework primitives.
 * This module prepares files for A/B testing by organizing original and improved versions
 * of story framework primitives into separate directories. It handles content extraction,
 * cleanup, and manifest generation for test tracking.
 * 
 * @requires deno/std/flags
 * @requires deno/std/fs
 * @requires deno/std/yaml
 */

// prep_ab.ts
import { parse } from "https://deno.land/std/flags/mod.ts";
import { walk } from "https://deno.land/std/fs/mod.ts";
import { parse as parseYaml } from "https://deno.land/std/yaml/mod.ts";

/**
 * @interface FileContent
 * @description Represents the structure of a markdown file with frontmatter.
 * Used to separate and manage YAML frontmatter and main content sections.
 */
interface FileContent {
  /** @property {string} frontmatter - YAML frontmatter containing metadata */
  frontmatter: string;
  /** @property {string} content - Main content body of the markdown file */
  content: string;
}

/**
 * @function extractContent
 * @description Extracts and separates YAML frontmatter from markdown content.
 * Expects files to be formatted with frontmatter between '---' delimiters.
 * 
 * @param {string} fileContent - Raw content of the markdown file
 * @returns {FileContent} Separated frontmatter and content
 * @throws {Error} If file format is invalid or missing frontmatter
 */
function extractContent(fileContent: string): FileContent {
  const parts = fileContent.split('---\n').filter(Boolean);
  if (parts.length < 2) {
    throw new Error('Invalid file format: missing frontmatter');
  }
  return {
    frontmatter: parts[0],
    content: parts.slice(1).join('---\n').trim()
  };
}

/**
 * @function extractCleanContent
 * @description Extracts and cleans the improved content from AI-generated responses.
 * Handles multiple content formats and removes unnecessary markers and formatting.
 * 
 * @param {string} improvedContent - Raw improved content from AI response
 * @returns {string} Cleaned and formatted content
 * @throws {Error} If content markers cannot be found
 */
function extractCleanContent(improvedContent: string): string {
  // Find the content after content markers
  const contentMarkers = [
    '# SIMPLIFIED CONTENT',
    '# MODULARIZED CONTENT',
    '# FLEXIBLE CONTENT'
  ];

  for (const marker of contentMarkers) {
    const markerIndex = improvedContent.indexOf(marker);
    if (markerIndex !== -1) {
      let content = improvedContent.slice(markerIndex + marker.length).trim();
      
      // Remove markdown code block markers if present
      content = content.replace(/^```markdown\n/, '').replace(/```$/, '').trim();
      
      // Split by markdown headers and take the last meaningful section
      const sections = content.split(/^#\s+/m);
      let cleanContent = sections[sections.length - 1];
      if (sections.length > 1) {
        cleanContent = '# ' + cleanContent; // Restore the header marker
      }
      
      // Clean any remaining YAML frontmatter blocks
      while (cleanContent.includes('---')) {
        const start = cleanContent.indexOf('---');
        const end = cleanContent.indexOf('---', start + 3);
        if (end === -1) break;
        cleanContent = cleanContent.slice(end + 3).trim();
      }

      // Log for verification
      console.log('\nExtracted clean content:');
      console.log('------------------------');
      console.log(cleanContent.substring(0, 200) + '...');
      console.log('------------------------');
      
      return cleanContent;
    }
  }

  throw new Error('Could not find content marker in improved file');
}

/**
 * @async
 * @function main
 * @description Main execution function that orchestrates the A/B test preparation process.
 * - Processes original and improved versions of primitives
 * - Organizes files into A/B test directories
 * - Maintains original frontmatter
 * - Generates test manifest
 * 
 * Command line options:
 * --dir: Target directory (must be under 'primitives/')
 * 
 * Directory structure created:
 * - candidates/a/ - Original versions
 * - candidates/b/ - Improved versions
 * - test-manifest.json - Test tracking information
 * 
 * @throws {Error} If directory structure is invalid or file operations fail
 */
async function main() {
  const args = parse(Deno.args, {
    string: ['dir'],
    default: { dir: '.' }
  });

  // Extract the relative path after "primitives/"
  const pathMatch = args.dir.match(/primitives\/(.+)/);
  if (!pathMatch) {
    console.error("Directory must be under a 'primitives' folder");
    Deno.exit(1);
  }
  const relativePath = pathMatch[1];

  const improveBaseDir = `./data/improve/${relativePath}`;
  const candidatesBaseDir = `./data/candidates/${relativePath}`;

  // Ensure candidates directory exists
  await Deno.mkdir(candidatesBaseDir, { recursive: true });
  
  // Track which files we've processed
  const processedFiles = new Set<string>();

  console.log(`\nPreparing A/B test candidates for ${relativePath}...`);

  // First pass: Process original files
  for await (const entry of walk(args.dir, { exts: ['.md'] })) {
    if (entry.isFile && !entry.path.includes('-analysis')) {
      const filename = entry.path.split('/').pop()!;
      const baseFilename = filename.replace('.md', '');
      processedFiles.add(baseFilename);

      console.log(`\nProcessing original file: ${filename}`);

      try {
        const content = await Deno.readTextFile(entry.path);
        const { frontmatter, content: originalContent } = extractContent(content);

        // Write original version to candidates/a
        const originalPath = `${candidatesBaseDir}/a/${filename}`;
        await Deno.mkdir(`${candidatesBaseDir}/a`, { recursive: true });
        await Deno.writeTextFile(originalPath, `---\n${frontmatter}---\n\n${originalContent}`);
        console.log(`Written original version to ${originalPath}`);
      } catch (error) {
        console.error(`Error processing original file ${filename}:`, error);
      }
    }
  }

  // Second pass: Process improved files
  for await (const entry of walk(improveBaseDir, { exts: ['.md'] })) {
    if (entry.isFile) {
      const improvedFilename = entry.path.split('/').pop()!;
      const baseFilename = improvedFilename.replace(/-improved.*\.md$/, '');
      
      if (!processedFiles.has(baseFilename)) {
        continue; // Skip if we don't have an original version
      }

      console.log(`\nProcessing improved file: ${improvedFilename}`);

      try {
        // Read the original file to get its frontmatter
        const originalPath = `${args.dir}/${baseFilename}.md`;
        const originalContent = await Deno.readTextFile(originalPath);
        const { frontmatter } = extractContent(originalContent);

        // Read and extract clean content from improved version
        const improvedContent = await Deno.readTextFile(entry.path);
        const cleanContent = extractCleanContent(improvedContent);

        // Write improved version to candidates/b
        const improvedPath = `${candidatesBaseDir}/b/${baseFilename}.md`;
        await Deno.mkdir(`${candidatesBaseDir}/b`, { recursive: true });
        
        // Double-check content doesn't start with frontmatter
        const finalContent = cleanContent.startsWith('---') ? 
          cleanContent.replace(/^---\n[\s\S]+?\n---\n/, '') : 
          cleanContent;
          
        await Deno.writeTextFile(improvedPath, `---\n${frontmatter}---\n\n${finalContent}`);
        console.log(`Written improved version to ${improvedPath}`);
      } catch (error) {
        console.error(`Error processing improved file ${improvedFilename}:`, error);
      }
    }
  }

  // Generate a test manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    test_path: relativePath,
    versions: {
      a: "Original version",
      b: "Improved version"
    },
    files: Array.from(processedFiles)
  };

  const manifestPath = `${candidatesBaseDir}/test-manifest.json`;
  await Deno.writeTextFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nGenerated test manifest at ${manifestPath}`);
}

if (import.meta.main) {
  main();
}

// usage
//deno run --allow-read --allow-write srcprep_ab.ts --dir ./data/primitives/system/story/three-act