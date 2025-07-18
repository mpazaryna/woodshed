import { parse } from "https://deno.land/std@0.210.0/flags/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { MarkdownParser } from "./utils/parser.ts";

// Interfaces
interface Story {
  id: string;
  title: string;
  overview: StoryOverview;
  journey: Journey;
  keyElements: KeyElements;
}

interface StoryOverview {
  id: string;
  genre: string;
  theme: string;
  tone: string;
  targetAudience: string;
  storyLength: string;
}

interface Journey {
  id: string;
  act1: Act;
  act2: Act;
  act3: Act;
}

interface Act {
  id: string;
  name: string;
  percentage: number;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  subsections: Subsection[];
}

interface Subsection {
  id: string;
  title: string;
  bulletPoints: string[];
}

interface KeyElements {
  id: string;
  characterArcs: string[];
  thematicElements: string[];
  pacingPoints: string[];
  antiClicheChecklist: string[];
}

class StoryParser extends MarkdownParser {
  async parseMarkdown(filePath: string): Promise<Story> {
    const content = await Deno.readTextFile(filePath);
    return this.parseFile(filePath, (sections) => {
      return {
        id: this.generateId(),
        title: 'A Prismatic Journey',
        overview: this.parseOverview(this.findSection(sections, 'Story Overview')),
        journey: this.parseJourney(this.findSection(sections, 'The Journey')),
        keyElements: this.parseKeyElements(this.findSection(sections, 'Key Elements'))
      };
    });
  }

  private parseOverview(section: string | undefined): StoryOverview {
    if (!section) throw new Error('Story Overview section not found');
    
    const lines = section.split('\n').filter(line => line.startsWith('*'));
    return {
      id: this.generateId(),
      genre: this.extractValue(lines[0]),
      theme: this.extractValue(lines[1]),
      tone: this.extractValue(lines[2]),
      targetAudience: this.extractValue(lines[3]),
      storyLength: this.extractValue(lines[4])
    };
  }

  private parseJourney(section: string | undefined): Journey {
    if (!section) throw new Error('Journey section not found');
    
    const acts = section.split('\n### ').filter(act => act.trim());
    
    return {
      id: this.generateId(),
      act1: this.parseAct(acts.find(a => a.includes('Act 1')), 'Act 1', 30),
      act2: this.parseAct(acts.find(a => a.includes('Act 2')), 'Act 2', 40),
      act3: this.parseAct(acts.find(a => a.includes('Act 3')), 'Act 3', 30)
    };
  }

  private parseAct(actContent: string | undefined, name: string, percentage: number): Act {
    if (!actContent) throw new Error(`Act ${name} not found`);
    
    const sections = actContent.split('\n#### ')
      .filter(section => section.trim())
      .map(section => {
        const [title, ...content] = section.split('\n');
        return {
          id: this.generateId(),
          title: title.trim(),
          subsections: this.parseSubsections(content.join('\n'))
        };
      });
    
    return {
      id: this.generateId(),
      name,
      percentage,
      sections
    };
  }

  private parseSubsections(content: string): Subsection[] {
    const subsections = content.split('\n* ').filter(sub => sub.trim());
    
    return subsections.map(sub => ({
      id: this.generateId(),
      title: sub.split('\n')[0].trim(),
      bulletPoints: sub.split('\n-').slice(1).map(point => point.trim())
    }));
  }

  private parseKeyElements(section: string | undefined): KeyElements {
    if (!section) throw new Error('Key Elements section not found');
    
    const elements = section.split('\n### ').filter(elem => elem.trim());
    
    return {
      id: this.generateId(),
      characterArcs: this.extractBulletPoints(elements.find(e => e.includes('Character Arcs'))),
      thematicElements: this.extractBulletPoints(elements.find(e => e.includes('Thematic Elements'))),
      pacingPoints: this.extractBulletPoints(elements.find(e => e.includes('Pacing Points'))),
      antiClicheChecklist: this.extractBulletPoints(elements.find(e => e.includes('Anti-Cliché Checklist')))
    };
  }
}

// CLI handling
if (import.meta.main) {
  const flags = parse(Deno.args, {
    string: ['dir'],
    alias: {
      d: 'dir',
    },
  });

  if (!flags.dir) {
    console.error('Please provide an output directory');
    console.error('Usage: deno run --allow-read --allow-write story_parser.ts -d <output-directory>');
    console.error('Example: deno run --allow-read --allow-write story_parser.ts -d ed4a0e5d-hero');
    Deno.exit(1);
  }

  try {
    const inputPath = join('output', flags.dir, 'created.md');
    const outputPath = join('output', flags.dir, 'created-graphql.json');

    // Verify input file exists
    try {
      await Deno.stat(inputPath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.error(`Input file not found: ${inputPath}`);
        Deno.exit(1);
      }
      throw error;
    }

    const parser = new StoryParser();
    const story = await parser.parseMarkdown(inputPath);
    await parser.writeOutput(outputPath, story);
    
    console.log(`Successfully parsed story structure to ${outputPath}`);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    Deno.exit(1);
  }
}

export { StoryParser };