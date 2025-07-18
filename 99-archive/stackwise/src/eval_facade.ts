// evalFacade.ts
import { parse } from "https://deno.land/std/flags/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { DomainEvaluator } from "./eval.ts";
import { log } from "./utils.ts";
import { domainConfigs } from "./config.ts";

export class EvaluationFacade {
  private evaluator: DomainEvaluator;

  constructor(domainName: string = "compute") {
    const domainConfig = this.getDomainConfig(domainName);
    this.evaluator = new DomainEvaluator(domainConfig);
  }

  private getDomainConfig(domainName: string) {
    const config = domainConfigs[domainName];
    if (!config) {
      throw new Error(`Unknown domain: ${domainName}. Available domains: ${Object.keys(domainConfigs).join(", ")}`);
    }
    return config;
  }

  async initialize(): Promise<void> {
    await this.evaluator.initialize();
  }

  async evaluateContent(content: string): Promise<string> {
    const tempDir = await Deno.makeTempDir();
    const tempFile = join(tempDir, "temp.xml");
    
    try {
      await Deno.writeTextFile(tempFile, content);
      await this.evaluator.evaluateFile(tempFile);
      const evalResult = await Deno.readTextFile(`${tempFile}-eval.txt`);
      return evalResult;
    } finally {
      try {
        await Deno.remove(tempFile, { recursive: true });
        await Deno.remove(tempDir, { recursive: true });
      } catch (error) {
        console.warn(`Failed to cleanup temporary files: ${error}`);
      }
    }
  }

  async evaluateFile(filePath: string): Promise<void> {
    await this.evaluator.evaluateFile(filePath);
  }

  async evaluateDirectory(dirPath: string): Promise<void> {
    for await (const entry of Deno.readDir(dirPath)) {
      if (!entry.isFile || !entry.name.endsWith('.xml')) continue;
      
      const filePath = join(dirPath, entry.name);
      try {
        await this.evaluateFile(filePath);
      } catch (error) {
        await log(`ERROR: Failed to evaluate ${filePath}: ${error}`, "eval.log");
      }
    }
  }
}

// CLI implementation
async function main() {
  const args = parse(Deno.args, {
    string: ['domain', 'file', 'dir', 'content'],
    boolean: ['help', 'list-domains'],
    alias: {
      h: 'help',
      d: 'domain',
      f: 'file',
      c: 'content',
      l: 'list-domains'
    }
  });

  if (args.help) {
    console.log(`
Usage: deno run evalFacade.ts [options]

Options:
  -h, --help             Show this help message
  -l, --list-domains     List available domains
  -d, --domain <name>    Specify the domain (default: compute)
  -f, --file <path>      Evaluate a single file
  --dir <path>           Evaluate all XML files in a directory
  -c, --content <xml>    Evaluate XML content directly

Examples:
  deno run evalFacade.ts --file=./rules/principle.xml
  deno run evalFacade.ts --dir=./rules
  deno run evalFacade.ts --content="<principle-named-exports><rule>...</rule></principle-named-exports>"
  deno run evalFacade.ts --list-domains
    `);
    Deno.exit(0);
  }

  if (args["list-domains"]) {
    console.log("Available domains:");
    for (const [name, config] of Object.entries(domainConfigs)) {
      console.log(`  ${name}: ${config.description}`);
    }
    Deno.exit(0);
  }

  try {
    const facade = new EvaluationFacade(args.domain);
    await facade.initialize();

    if (args.content) {
      const result = await facade.evaluateContent(args.content);
      console.log(result);
    } else if (args.file) {
      await facade.evaluateFile(args.file);
    } else if (args.dir) {
      await facade.evaluateDirectory(args.dir);
    } else {
      console.error("Error: Must specify --file, --dir, or --content");
      Deno.exit(1);
    }
  } catch (error) {
    console.error("Error:", error.message);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}