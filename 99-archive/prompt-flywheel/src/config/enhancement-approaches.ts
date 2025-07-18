import { EnhancementApproach } from '../types.ts';

export const enhancementApproaches: EnhancementApproach[] = [
  {
    name: "incremental",
    description: "Focus on improving one section at a time",
    promptTemplate: `Please enhance the following content focusing on these priority areas:

Priority Areas:
{priorityAreas}

Missing Criteria to Address:
{missingCriteria}

Original Content:
{originalContent}

Please provide the enhanced content while maintaining the original structure and addressing the missing criteria.`,
    successRate: 0,
    totalAttempts: 0,
    successfulImprovements: 0
  },
  {
    name: "comprehensive",
    description: "Holistic enhancement with verification",
    promptTemplate: `Please enhance this content comprehensively, focusing on all aspects that need improvement:

Current Scores:
{scores}

Areas Needing Improvement:
{priorityAreas}

Missing Requirements:
{missingCriteria}

Original Content:
{originalContent}

Please provide the complete enhanced version while maintaining the original structure.`,
    successRate: 0,
    totalAttempts: 0,
    successfulImprovements: 0
  }
]; 