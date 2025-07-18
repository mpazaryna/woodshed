import { join } from "https://deno.land/std@0.219.0/path/mod.ts";

export async function readPromptSections(domain: string, includeAdvanced: boolean): Promise<string[]> {
  console.log(`\nReading prompt sections for domain: ${domain}`);
  console.log(`Including advanced sections: ${includeAdvanced}`);
  
  const sections = ['base', 'requirements', 'structure', 'creative'];
  if (includeAdvanced) sections.push('advanced');
  
  const contents: string[] = [];
  console.log("\nAttempting to read sections:");
  for (const section of sections) {
    try {
      const filepath = join("prompts", domain, `${section}.txt`);
      console.log(`- Reading ${filepath}...`);
      const content = await Deno.readTextFile(filepath);
      console.log(`  ✓ Found ${section}.txt (${content.length} characters)`);
      contents.push(content);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.log(`  ✗ ${section}.txt not found`);
      } else {
        console.error(`  ✗ Error reading ${section}.txt:`, error);
        throw error;
      }
    }
  }
  
  console.log(`\nSuccessfully read ${contents.length} section(s)`);
  return contents;
} 