import { EvaluationCriteria, EvaluationResult, ScoringReport } from '../types.ts';
import { escapeRegExp } from '../utils/file.ts';
import { LLMService } from "../services/llm_service.ts";

export function evaluateContent(
  content: string, 
  criteria: any, 
  llmService: LLMService
): ScoringReport {
  console.log("\nEvaluating content...");
  console.log(`Content length: ${content.length} characters`);
  
  const results: EvaluationResult[] = [];
  const scoringBreakdown: Record<string, { score: number; maxScore: number }> = {};
  const recommendations: string[] = [];

  console.log("\nChecking criteria sections:");
  for (const section of criteria) {
    console.log(`\nEvaluating section: ${section.section}`);
    let sectionScore = 0;
    const maxSectionScore = section.criteria.length * section.weight;

    for (const criterion of section.criteria) {
      try {
        const escapedCriterion = escapeRegExp(criterion);
        const patterns = [
          new RegExp(escapedCriterion, 'i'),
          ...criterion.split(' ')
            .filter(word => word.length > 2)
            .map(word => new RegExp(`\\b${escapeRegExp(word)}\\b`, 'i'))
        ];

        const found = patterns.some(pattern => pattern.test(content));
        let examples: string[] | undefined;
        
        if (found) {
          try {
            examples = content.match(new RegExp(`.{0,50}${escapedCriterion}.{0,50}`, 'gi'))?.slice(0, 2);
          } catch (error) {
            console.log(`  Warning: Could not extract examples for "${criterion}"`);
          }
        }

        results.push({ section: section.section, criterion, found, examples });

        if (found) {
          sectionScore += section.weight;
        } else {
          recommendations.push(`Consider adding elements for: ${criterion}`);
        }
      } catch (error) {
        console.error(`Error evaluating criterion: "${criterion}"`, error);
        results.push({ section: section.section, criterion, found: false });
      }
    }

    scoringBreakdown[section.section] = {
      score: sectionScore,
      maxScore: maxSectionScore
    };
  }

  const totalScore = Object.values(scoringBreakdown)
    .reduce((sum, section) => sum + section.score, 0);
  const maxPossibleScore = Object.values(scoringBreakdown)
    .reduce((sum, section) => sum + section.maxScore, 0);

  return {
    results,
    totalScore,
    maxPossibleScore,
    scoringBreakdown,
    recommendations: recommendations.slice(0, 10)
  };
} 