import { z } from 'zod';

export const extraEdgeSuggestionsSchema = z.object({
  title: z.string(),
  description: z.string(),
});
export const ResultSchema = z.object({
  matchScore: z.number().min(0).max(100),
  skillsMatched: z.array(z.string()),
  missingSkills: z.array(z.string()),
  suggestions: z.array(z.string()),
  extraEdgeSuggestions: z.array(extraEdgeSuggestionsSchema),
});
