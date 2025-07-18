export interface SectionScore {
  score: number;
  maxScore: number;
}

export interface EvaluationResult {
  totalScore: number;
  maxPossibleScore: number;
  scoringBreakdown: Record<string, SectionScore>;
  recommendations: string[];
  results: Array<{
    section: string;
    criterion: string;
    found: boolean;
    examples: string[];
  }>;
}

export interface DetailedBreakdown {
  [section: string]: {
    met: number;
    total: number;
    details: Array<{
      criterion: string;
      met: boolean;
      examples: string[];
    }>;
  };
}

export interface EvaluationCriteria {
  section: string;
  criteria: string[];
  weight: number;
}

export interface EnhancementPattern {
  criterion: string;
  domain: string;
  section: string;
  successfulExamples: Array<{
    content: string;
    improvement: number;
    approach: string;
  }>;
  failedAttempts: Array<{
    content: string;
    approach: string;
  }>;
}

export interface DomainPatterns {
  patterns: EnhancementPattern[];
  metadata: {
    lastUpdated: string;
    totalPatterns: number;
  };
}

export interface PatternStorage {
  [domain: string]: DomainPatterns;
}

export interface EnhancementApproach {
  name: string;
  description: string;
  promptTemplate: string;
  successRate: number;
  totalAttempts: number;
  successfulImprovements: number;
}

export interface DomainConfig {
  path: string;
  sections: Section[];
}

export interface Section {
  name: string;
  required: boolean;
}

export type Domain = string; 