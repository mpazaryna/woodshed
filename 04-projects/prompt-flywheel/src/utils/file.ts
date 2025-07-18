import { join } from "https://deno.land/std@0.219.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.219.0/fs/mod.ts";

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getEvalDir(filename: string): string {
  const baseFilename = filename.split('/').pop() || filename;
  const dirName = baseFilename.replace('.md', '');
  return join("output/eval", dirName);
}

// Export the ensureDir function directly from std/fs
export { ensureDir as ensureOutputDir }; 