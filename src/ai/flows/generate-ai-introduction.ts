// Implemented the Genkit flow for generating personalized introductory messages for classmates using AI.
'use server';
/**
 * @fileOverview Generates a personalized introductory message for a classmate.
 *
 * - generateAiIntroduction - A function that generates an AI introduction.
 * - GenerateAiIntroductionInput - The input type for the generateAiIntroduction function.
 * - GenerateAiIntroductionOutput - The return type for the generateAiIntroduction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiIntroductionInputSchema = z.object({
  name: z.string().describe('The name of the classmate.'),
  description: z.string().describe('A detailed description of the classmate, including their background, interests, and experience.'),
});
export type GenerateAiIntroductionInput = z.infer<typeof GenerateAiIntroductionInputSchema>;

const GenerateAiIntroductionOutputSchema = z.object({
  introduction: z.string().describe('A personalized introductory message for the classmate.'),
});
export type GenerateAiIntroductionOutput = z.infer<typeof GenerateAiIntroductionOutputSchema>;

export async function generateAiIntroduction(input: GenerateAiIntroductionInput): Promise<GenerateAiIntroductionOutput> {
  return generateAiIntroductionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiIntroductionPrompt',
  input: {schema: GenerateAiIntroductionInputSchema},
  output: {schema: GenerateAiIntroductionOutputSchema},
  prompt: `You are an AI assistant tasked with generating a personalized introductory message for a classmate.

  Given the following information about the classmate, create a brief and engaging introduction that highlights their key attributes and interests.

  Name: {{{name}}}
  Description: {{{description}}}

  Introduction:`,
});

const generateAiIntroductionFlow = ai.defineFlow(
  {
    name: 'generateAiIntroductionFlow',
    inputSchema: GenerateAiIntroductionInputSchema,
    outputSchema: GenerateAiIntroductionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
