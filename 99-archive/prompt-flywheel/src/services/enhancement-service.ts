import { LLMService } from "./llm_service.ts";
import { EvaluationResult, EnhancementApproach } from '../types.ts';

export class EnhancementService {
  constructor(private llmService: LLMService) {}

  async enhanceContent(
    content: string,
    evaluation: EvaluationResult,
    approach: EnhancementApproach,
    domain: string
  ): Promise<string> {
    console.log(`\nEnhancing content using ${approach.name} approach...`);
    
    const prompt = this.buildPrompt(content, evaluation, approach, domain);
    console.log("Sending enhancement request to Claude...");
    
    return await this.llmService.generateContent(prompt);
  }

  private buildPrompt(
    content: string,
    evaluation: EvaluationResult,
    approach: EnhancementApproach,
    domain: string
  ): string {
    const priorityAreas = this.getPriorityAreas(evaluation);
    const missingCriteria = this.getMissingCriteria(evaluation);

    return approach.promptTemplate
      .replace("{priorityAreas}", priorityAreas.map(([section, scores]) => 
        `${section}: ${scores.score}/${scores.maxScore}`).join('\n'))
      .replace("{missingCriteria}", missingCriteria.join('\n'))
      .replace("{originalContent}", content)
      .replace("{scores}", Object.entries(evaluation.scoringBreakdown)
        .map(([section, scores]) => 
          `${section}: ${scores.score}/${scores.maxScore}`).join('\n'))
      .replace("{improvements}", evaluation.recommendations.join('\n'))
      .replace("{focusAreas}", priorityAreas.map(([section]) => section).join(', '))
      .replace("{verifications}", missingCriteria
        .map(mc => `- Verify: ${mc}`).join('\n'));
  }

  private getPriorityAreas(evaluation: EvaluationResult): Array<[string, { score: number; maxScore: number }]> {
    return Object.entries(evaluation.scoringBreakdown)
      .sort(([,a], [,b]) => (a.score/a.maxScore) - (b.score/b.maxScore))
      .slice(0, 2);
  }

  private getMissingCriteria(evaluation: EvaluationResult): string[] {
    return Object.entries(evaluation.detailedBreakdown)
      .flatMap(([section, data]: [string, any]) => {
        return data.details
          .filter((detail: any) => !detail.met)
          .map((detail: any) => `[${section}] ${detail.criterion}`);
      });
  }
} 