import { ScoringReport } from '../types.ts';

export function generateMarkdownReport(
  filename: string,
  domain: string,
  report: ScoringReport,
  detailedBreakdown: Record<string, any>
): string {
  const date = new Date().toLocaleString();
  
  let markdown = `# Content Evaluation Report\n\n`;
  markdown += `## Overview\n`;
  markdown += `- **Content**: ${filename}\n`;
  markdown += `- **Domain**: ${domain}\n`;
  markdown += `- **Evaluation Date**: ${date}\n`;
  markdown += `- **Overall Score**: ${report.totalScore}/${report.maxPossibleScore} (${((report.totalScore/report.maxPossibleScore)*100).toFixed(1)}%)\n\n`;
  
  markdown += `## Section Breakdown\n`;

  Object.entries(detailedBreakdown).forEach(([section, data]: [string, any]) => {
    const scores = report.scoringBreakdown[section];
    const percentage = ((scores.score/scores.maxScore)*100).toFixed(1);
    
    markdown += `\n### ${section}\n`;
    markdown += `- Score: ${scores.score}/${scores.maxScore} (${percentage}%)\n\n`;
    markdown += `#### Requirements\n`;

    data.details.forEach((detail: any) => {
      markdown += `- ${detail.met ? "✓" : "✗"} ${detail.criterion}\n`;
      if (detail.met && detail.examples && detail.examples.length > 0) {
        markdown += `  - Example: "${detail.examples[0].trim()}"\n`;
      }
    });
  });

  if (report.recommendations.length > 0) {
    markdown += `\n## Recommendations for Improvement\n\n`;
    report.recommendations.forEach(rec => markdown += `- ${rec}\n`);
  }

  markdown += `\n## Evaluation Details\n\n`;
  markdown += `- Generated using prompt evaluation tool\n`;
  markdown += `- Total criteria evaluated: ${report.results.length}\n`;
  markdown += `- Criteria met: ${report.results.filter(r => r.found).length}\n`;
  markdown += `- Weights applied:\n`;
  markdown += `  - Formatting requirements: 0.5x\n`;
  markdown += `  - Basic requirements: 1.0x\n`;
  markdown += `  - Creative elements: 1.5x\n`;

  return markdown;
} 