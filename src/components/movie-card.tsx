"use client";

import type { Movie } from "@/lib/types";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, PlayCircle, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

interface MovieCardProps {
  movie: Movie;
  onVote: (id: string, type: "up" | "down") => void;
}

export function MovieCard({ movie, onVote }: MovieCardProps) {
  const [isPlayerOpen, setPlayerOpen] = useState(false);
  const { user } = useAuth();
  const voteColor = movie.votes > 0 ? "text-green-500" : movie.votes < 0 ? "text-red-500" : "text-muted-foreground";

  return (
    <>
      <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
            <div className="flex items-start justify-between gap-4">
                <CardTitle className="font-headline text-xl">{movie.title}</CardTitle>
                <Badge variant={movie.votes > 20 ? "default" : "secondary"} className="flex gap-1 shrink-0 bg-accent text-accent-foreground">
                    <Star className="h-4 w-4" /> 
                    {movie.votes}
                </Badge>
            </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="aspect-video w-full rounded-md bg-muted flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-20 w-20 text-muted-foreground"
              onClick={() => user && setPlayerOpen(true)}
              aria-label="Play trailer"
              disabled={!user}
            >
              <PlayCircle className="h-16 w-16" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => user && onVote(movie.id, "down")}
            aria-label="Downvote"
            disabled={!user}
          >
            <ArrowDown />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => user && onVote(movie.id, "up")}
            aria-label="Upvote"
            disabled={!user}
          >
            <ArrowUp />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isPlayerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="p-4">
            <DialogTitle>{movie.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={movie.url}
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
