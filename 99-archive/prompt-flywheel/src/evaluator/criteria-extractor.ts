import { EvaluationCriteria } from '../types.ts';

export function extractCriteria(promptContents: string[]): EvaluationCriteria[] {
  console.log("\nExtracting evaluation criteria...");
  const criteria: EvaluationCriteria[] = [];

  promptContents.forEach((content, index) => {
    console.log(`\nAnalyzing content block ${index + 1}:`);

    // Extract numbered requirements
    if (content.includes("should include:")) {
      const section = content.split("\n")[0].trim();
      const requirements = content.match(/\d+\.\s+([^\n]+)/g) || [];
      if (requirements.length > 0) {
        console.log(`- Found ${requirements.length} numbered requirements in section: ${section}`);
        criteria.push({
          section,
          criteria: requirements.map(r => r.replace(/^\d+\.\s+/, '')),
          weight: 1
        });
      }
    }

    // Extract creative directives
    if (content.includes("CREATIVE IMPERATIVES:")) {
      const items = content.match(/\*\s+([^\n]+)/g) || [];
      if (items.length > 0) {
        console.log(`- Found ${items.length} creative directives`);
        criteria.push({
          section: "Creative Elements",
          criteria: items.map(i => i.replace(/^\*\s+/, '')),
          weight: 1.5
        });
      }
    }

    // Extract formatting requirements
    if (content.includes("FORMATTING REQUIREMENTS:")) {
      const items = content.match(/-\s+([^\n]+)/g) || [];
      if (items.length > 0) {
        console.log(`- Found ${items.length} formatting requirements`);
        criteria.push({
          section: "Formatting",
          criteria: items.map(i => i.replace(/^-\s+/, '')),
          weight: 0.5
        });
      }
    }
  });

  console.log(`\nTotal criteria sections extracted: ${criteria.length}`);
  return criteria;
} 