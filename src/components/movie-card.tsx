"use client";

import type { Movie } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, PlayCircle } from "lucide-react";
import Image from 'next/image';
import { getYouTubeThumbnail } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


interface MovieCardProps {
  movie: Movie;
  onVote: (id: string, type: "up" | "down") => void;
}

export function MovieCard({ movie, onVote }: MovieCardProps) {
  const thumbnailUrl = getYouTubeThumbnail(movie.url);

  return (
     <Dialog>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-lg">
        <DialogTrigger asChild>
          <button className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <PlayCircle className="h-16 w-16 text-white" />
            <span className="sr-only">Play {movie.title}</span>
          </button>
        </DialogTrigger>
        <div className="aspect-video overflow-hidden">
          <Image
            src={thumbnailUrl || "https://placehold.co/400x225.png"}
            alt={`Thumbnail for ${movie.title}`}
            width={400}
            height={225}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="flex-grow font-semibold leading-tight line-clamp-2">{movie.title}</h3>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); onVote(movie.id, "up"); }}
                aria-label="Upvote"
                className="rounded-full p-1 h-8 w-8 hover:bg-green-500/10 text-green-500"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg tabular-nums w-8 text-center">{movie.votes}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); onVote(movie.id, "down"); }}
                aria-label="Downvote"
                className="rounded-full p-1 h-8 w-8 hover:bg-red-500/10 text-red-500"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Video Player: {movie.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={movie.url.replace('watch?v=', 'embed/').split('&')[0] + '?autoplay=1&rel=0'}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
