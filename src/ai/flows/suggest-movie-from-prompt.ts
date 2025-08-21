'use server';
/**
 * @fileOverview Suggests a movie title based on a user prompt.
 *
 * - suggestMovie - A function that takes a prompt and returns a movie title.
 * - SuggestMovieInput - The input type for the suggestMovie function.
 * - SuggestMovieOutput - The return type for the suggestMovie function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMovieInputSchema = z.object({
  prompt: z.string().describe('A description of the type of movie the user is interested in.'),
});
export type SuggestMovieInput = z.infer<typeof SuggestMovieInputSchema>;

const SuggestMovieOutputSchema = z.object({
  movieTitle: z.string().describe('The suggested movie title based on the prompt.'),
});
export type SuggestMovieOutput = z.infer<typeof SuggestMovieOutputSchema>;

export async function suggestMovie(input: SuggestMovieInput): Promise<SuggestMovieOutput> {
  return suggestMovieFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMoviePrompt',
  input: {schema: SuggestMovieInputSchema},
  output: {schema: SuggestMovieOutputSchema},
  prompt: `Based on the following description, suggest a movie title:

{{{prompt}}}`,
});

const suggestMovieFlow = ai.defineFlow(
  {
    name: 'suggestMovieFlow',
    inputSchema: SuggestMovieInputSchema,
    outputSchema: SuggestMovieOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
