import type { InnovationField, InnovationLevel } from '@/lib/innovation';

type ScoreInput = {
  field: InnovationField;
  level: InnovationLevel;
  question: string;
  answer: string;
};

export type InnovationScore = { points: number; feedback: string };

const stopWords = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'how', 'in', 'is', 'it', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'we', 'what', 'with', 'would', 'you', 'your']);
const practicalTerms = /\b(first|next|then|plan|create|build|use|track|measure|test|review|schedule|train|support|provide|collect|improve|reduce|implement|prioritize)\b/gi;
const reasoningTerms = /\b(because|therefore|so that|which means|for example|by doing|if|while|instead)\b/gi;
const constructiveTerms = /\b(improve|support|fair|inclusive|safe|accessible|sustainable|collaborate|help|protect|practical|clear)\b/gi;

function countMatches(value: string, pattern: RegExp) {
  return value.match(pattern)?.length ?? 0;
}

function keywords(value: string) {
  return new Set(value.toLowerCase().match(/[a-z]{4,}/g)?.filter((word) => !stopWords.has(word)) ?? []);
}

export async function scoreInnovationAnswer(input: ScoreInput): Promise<InnovationScore> {
  const normalized = input.answer.trim();
  const wordCount = normalized.match(/\b[\w'-]+\b/g)?.length ?? 0;
  const questionKeywords = keywords(`${input.field} ${input.question}`);
  const answerKeywords = keywords(normalized);
  const keywordOverlap = [...answerKeywords].filter((word) => questionKeywords.has(word)).length;

  const relevance = keywordOverlap >= 3 ? 2 : keywordOverlap >= 1 ? 1 : 0;
  const practicalSteps = countMatches(normalized, practicalTerms) >= 3 ? 2 : countMatches(normalized, practicalTerms) >= 1 ? 1 : 0;
  const clearReasoning = countMatches(normalized, reasoningTerms) >= 2 && /[.!?]/.test(normalized) ? 2 : countMatches(normalized, reasoningTerms) >= 1 ? 1 : 0;
  const detail = wordCount >= 100 ? 2 : wordCount >= 45 ? 1 : 0;
  const constructiveTone = countMatches(normalized, constructiveTerms) >= 1 ? 1 : 0;
  const points = Math.min(10, Math.max(1, 1 + relevance + practicalSteps + clearReasoning + detail + constructiveTone));

  const strongest = [
    relevance === 2 && 'strong relevance to the challenge',
    practicalSteps === 2 && 'clear practical actions',
    clearReasoning === 2 && 'well-connected reasoning',
    detail === 2 && 'useful supporting detail',
    constructiveTone === 1 && 'a constructive tone',
  ].filter(Boolean) as string[];
  const improvement = [
    relevance < 2 && 'connect the idea more directly to the scenario',
    practicalSteps < 2 && 'add clear action steps',
    clearReasoning < 2 && 'explain why the approach would work',
    detail < 2 && 'include more practical detail',
    constructiveTone < 1 && 'frame the outcome in a constructive way',
  ].find(Boolean);

  return {
    points,
    feedback: strongest.length
      ? `Strengths: ${strongest.slice(0, 2).join(' and ')}.${improvement ? ` To improve, ${improvement}.` : ''}`
      : `To improve, ${improvement ?? 'add a clearer, more practical response'}.`,
  };
}
