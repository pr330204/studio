'use server';
/**
 * @fileOverview A flow for checking and saving movie links.
 *
 * - checkAndSaveMovieLink - A function that checks if a movie link is valid and saves it.
 * - CheckAndSaveMovieLinkInput - The input type for the checkAndSaveMovieLink function.
 * - CheckAndSaveMovieLinkOutput - The return type for the checkAndSaveMovieLink function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckAndSaveMovieLinkInputSchema = z.object({
  movieTitle: z.string().describe('The title of the movie.'),
  movieLink: z.string().url().describe('The URL of the movie source.'),
});
export type CheckAndSaveMovieLinkInput = z.infer<
  typeof CheckAndSaveMovieLinkInputSchema
>;

const CheckAndSaveMovieLinkOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the movie link is valid.'),
  message: z.string().describe('A message indicating the status of the link.'),
});
export type CheckAndSaveMovieLinkOutput = z.infer<
  typeof CheckAndSaveMovieLinkOutputSchema
>;

export async function checkAndSaveMovieLink(
  input: CheckAndSaveMovieLinkInput
): Promise<CheckAndSaveMovieLinkOutput> {
  return checkAndSaveMovieLinkFlow(input);
}

const checkAndSaveMovieLinkPrompt = ai.definePrompt({
  name: 'checkAndSaveMovieLinkPrompt',
  input: {schema: CheckAndSaveMovieLinkInputSchema},
  output: {schema: CheckAndSaveMovieLinkOutputSchema},
  prompt: `You are an AI assistant that validates movie links.

  Determine if the provided movie link for the movie "{{movieTitle}}" is valid and working.

  Respond with a JSON object indicating whether the link is valid and a message describing the status.

  Movie Title: {{movieTitle}}
  Movie Link: {{movieLink}}`,
});

const checkAndSaveMovieLinkFlow = ai.defineFlow(
  {
    name: 'checkAndSaveMovieLinkFlow',
    inputSchema: CheckAndSaveMovieLinkInputSchema,
    outputSchema: CheckAndSaveMovieLinkOutputSchema,
  },
  async input => {
    try {
      const {output} = await checkAndSaveMovieLinkPrompt(input);
      return output!;
    } catch (error: any) {
      console.error('Error checking movie link:', error);
      return {
        isValid: false,
        message: `An error occurred while checking the link: ${error.message}`,
      };
    }
  }
);
