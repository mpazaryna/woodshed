import { writeTextFile, readTextFile } from "https://deno.land/std@0.208.0/fs/mod.ts";

const USER_PROMPT_PATH = './tmp/user.txt';
const AIC_OUTPUT_PATH = './data/tmp/aic.xml';

export async function generateComposition(prompt: string): Promise<string> {
  try {
    // Ensure tmp directory exists
    await Deno.mkdir('./tmp', { recursive: true });
    
    // Write the prompt to the file that aic.ts expects
    await Deno.writeTextFile(USER_PROMPT_PATH, prompt);

    // Execute aic.ts
    const process = Deno.run({
      cmd: ["deno", "run", "--allow-read", "--allow-write", "--allow-env", "--allow-net", "src/ai_compose.ts"],
      stdout: "piped",
      stderr: "piped",
    });

    const { code } = await process.status();
    const rawError = await process.stderrOutput();

    process.close();

    if (code !== 0) {
      const errorText = new TextDecoder().decode(rawError);
      throw new Error(`aic.ts execution failed: ${errorText}`);
    }

    // Read the generated XML
    const composition = await Deno.readTextFile(AIC_OUTPUT_PATH);
    return composition;

  } catch (error) {
    console.error('Error in AIC facade:', error);
    throw error;
  }
} 