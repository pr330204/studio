"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { suggestMovieAction } from "@/lib/actions";
import { Loader2, Wand2 } from "lucide-react";

const formSchema = z.object({
  prompt: z.string().min(10, "Please provide a more detailed description."),
});

type SuggestMovieFormValues = z.infer<typeof formSchema>;

interface SuggestMovieDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMovieSuggested: (title: string, url: string) => void;
}

export function SuggestMovieDialog({
  isOpen,
  onOpenChange,
  onMovieSuggested,
}: SuggestMovieDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [suggestedTitle, setSuggestedTitle] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<SuggestMovieFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = (values: SuggestMovieFormValues) => {
    setSuggestedTitle(null);
    startTransition(async () => {
      const result = await suggestMovieAction(values);
      if (result.success && result.movieTitle) {
        setSuggestedTitle(result.movieTitle);
        toast({
          title: "Movie Suggested!",
          description: `AI suggested: "${result.movieTitle}". You can now add it to your list.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Suggestion Failed",
          description: result.message,
        });
      }
    });
  };

  const handleAddToList = () => {
    if (suggestedTitle) {
      // Create a YouTube search URL for the trailer as a placeholder link
      const youtubeSearchUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(suggestedTitle + ' trailer')}`;
      onMovieSuggested(suggestedTitle, youtubeSearchUrl);
      form.reset();
      setSuggestedTitle(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
            form.reset();
            setSuggestedTitle(null);
        }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Suggest a Movie with AI</DialogTitle>
          <DialogDescription>
            Describe the kind of movie you want to watch, and AI will suggest one for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Movie Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'a mind-bending sci-fi movie with a surprising twist'"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {suggestedTitle && (
              <div className="rounded-md border bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">AI Suggestion:</p>
                <p className="text-lg font-semibold">{suggestedTitle}</p>
              </div>
            )}

            <DialogFooter>
              {suggestedTitle ? (
                <Button onClick={handleAddToList}>Add to List</Button>
              ) : (
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Suggest
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
