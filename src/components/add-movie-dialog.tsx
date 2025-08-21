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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { checkMovieLinkAction } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import type { Movie } from "@/lib/types";

const formSchema = z.object({
  movieTitle: z.string().min(1, "Movie title is required."),
  movieLink: z.string().url("Please enter a valid URL."),
});

type AddMovieFormValues = z.infer<typeof formSchema>;

interface AddMovieDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMovieAdded: (movie: Omit<Movie, "id" | "votes">) => void;
}

export function AddMovieDialog({ isOpen, onOpenChange, onMovieAdded }: AddMovieDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<AddMovieFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      movieTitle: "",
      movieLink: "",
    },
  });

  const onSubmit = (values: AddMovieFormValues) => {
    startTransition(async () => {
      const result = await checkMovieLinkAction(values);
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        onMovieAdded({ title: values.movieTitle, url: values.movieLink });
        onOpenChange(false);
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Validation Failed",
          description: result.message,
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Movie</DialogTitle>
          <DialogDescription>
            Enter the movie title and a valid link. The link will be checked by AI.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="movieTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movie Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Social Network" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="movieLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movie URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/movie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Movie
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
