import { GoogleGenAI, Type } from '@google/genai';
import { prompt } from './prompt';
import { ResultSchema } from '@/schemas/ResultSchema';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default async function generate(resumeText: string, jdText: string) {
  const finalprompt = prompt
    .replace('{RESUME_TEXT}', resumeText)
    .replace('{JD_TEXT}', jdText);

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [finalprompt],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            skillsMatched: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            extraEdgeSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                propertyOrdering: ['title', 'description'],
              },
            },
          },
          propertyOrdering: [
            'matchScore',
            'skillsMatched',
            'missingSkills',
            'suggestions',
            'extraEdgeSuggestions',
          ],
        },
      },
    });

    const text = (await result.text) as string;
    const validated = ResultSchema.parse(JSON.parse(text));
    // console.log(validated);

    return validated;
  } catch (error) {
    throw new Error(
      `Failed to generate key: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
