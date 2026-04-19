import type { ScoreResult } from '../../types/scoring.types.js';
import type { Explanation } from './types.js';
import { generateRuleBasedExplanation } from './rule-based.js';
import { generateLlmExplanation } from './llm.js';

export type { Explanation, ExplanationSource } from './types.js';

// Single entry point for the AI Explainability Layer.
//
// Architecture contract:
//  - Score + risk + metrics are produced by the deterministic rule engine
//    (scoring.service.ts). This function only produces the human-readable
//    *explanation* on top — never numbers.
//  - LLM is primary when ANTHROPIC_API_KEY is present.
//  - Rule-based text is the deterministic fallback: same inputs → same output.
//  - Always returns a populated Explanation (never null). The `source` field
//    tells the consumer which layer produced it.
export async function generateExplanation(result: ScoreResult): Promise<Explanation> {
  const llm = await generateLlmExplanation(result);
  if (llm) return llm;
  return generateRuleBasedExplanation(result);
}
