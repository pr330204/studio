"use client";

import type { Movie } from "@/lib/types";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, PlayCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MovieCardProps {
  movie: Movie;
  onVote: (id: string, type: "up" | "down") => void;
}

export function MovieCard({ movie, onVote }: MovieCardProps) {
  const [isPlayerOpen, setPlayerOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-border/60 bg-card group">
        <CardContent className="flex-grow p-0">
          <div className="aspect-video w-full bg-muted flex items-center justify-center relative">
             <button
              onClick={() => setPlayerOpen(true)}
              aria-label="Play video"
              className="absolute inset-0 z-10 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 bg-black/60"
            >
              <PlayCircle className="h-20 w-20 text-white/90 transform transition-transform group-hover:scale-110" />
            </button>
             <iframe
              width="100%"
              height="100%"
              src={movie.url.replace('watch?v=', 'embed/').split('&')[0] + '?rel=0&showinfo=0&autohide=1&controls=0'}
              title={`Trailer for ${movie.title}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            ></iframe>
          </div>
        </CardContent>
        <CardHeader className="py-4">
            <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-lg font-semibold">{movie.title}</CardTitle>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onVote(movie.id, "up")}
                        aria-label="Upvote"
                        className="rounded-full p-2 h-9 w-9 hover:bg-green-500/10 text-green-500"
                    >
                        <ArrowUp className="h-5 w-5" />
                    </Button>
                    <span className="font-bold text-lg tabular-nums w-8 text-center">{movie.votes}</span>
                     <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onVote(movie.id, "down")}
                        aria-label="Downvote"
                        className="rounded-full p-2 h-9 w-9 hover:bg-red-500/10 text-red-500"
                    >
                        <ArrowDown className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </CardHeader>
      </Card>

      <Dialog open={isPlayerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent className="max-w-4xl p-0 border-0">
          <DialogHeader>
            <DialogTitle className="sr-only">{`Player for ${movie.title}`}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={movie.url.replace('watch?v=', 'embed/').split('&')[0] + '?autoplay=1&rel=0'}
              title={`Trailer for ${movie.title}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
