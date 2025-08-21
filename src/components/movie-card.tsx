"use client";

import type { Movie } from "@/lib/types";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, PlayCircle, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface MovieCardProps {
  movie: Movie;
  onVote: (id: string, type: "up" | "down") => void;
}

export function MovieCard({ movie, onVote }: MovieCardProps) {
  const [isPlayerOpen, setPlayerOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/60 bg-card">
        <CardContent className="flex-grow p-0">
          <div className="aspect-video w-full bg-muted flex items-center justify-center relative group">
            <button
              onClick={() => setPlayerOpen(true)}
              aria-label="Play video"
              className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 bg-black/50"
            >
              <PlayCircle className="h-16 w-16 text-white" />
            </button>
             <iframe
              width="100%"
              height="100%"
              src={movie.url.replace('watch?v=', 'embed/').split('&')[0] + '?rel=0&showinfo=0&autohide=1'}
              title={`Trailer for ${movie.title}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full object-cover"
            ></iframe>
          </div>
        </CardContent>
        <CardHeader className="py-4">
            <div className="flex items-start justify-between gap-4">
                <CardTitle className="font-headline text-lg">{movie.title}</CardTitle>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onVote(movie.id, "up")}
                        aria-label="Upvote"
                    >
                        <ArrowUp />
                    </Button>
                    <span className="font-bold text-lg">{movie.votes}</span>
                     <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onVote(movie.id, "down")}
                        aria-label="Downvote"
                    >
                        <ArrowDown />
                    </Button>
                </div>
            </div>
        </CardHeader>
      </Card>

      <Dialog open={isPlayerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent className="max-w-4xl p-0">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={movie.url + '?autoplay=1'}
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
