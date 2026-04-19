export type ExplanationSource = 'llm' | 'rule-based';

export interface Explanation {
  insight: string;
  suggestions: string[];
  source: ExplanationSource;
  model?: string;
  generatedAt: string;
}
