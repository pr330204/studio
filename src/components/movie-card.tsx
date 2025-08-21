"use client";

import type { Movie } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import Image from 'next/image';
import { getYouTubeThumbnail } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  onVote: (id: string, type: "up" | "down") => void;
  onSelect: (movie: Movie) => void;
  isSelected: boolean;
}

export function MovieCard({ movie, onVote, onSelect, isSelected }: MovieCardProps) {
  const thumbnailUrl = getYouTubeThumbnail(movie.url);

  return (
    <Card 
      className={`flex items-center gap-4 p-2 transition-all duration-200 cursor-pointer hover:bg-muted/60 ${isSelected ? 'bg-muted' : ''}`}
      onClick={() => onSelect(movie)}
    >
      <div className="w-32 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0 relative">
        {thumbnailUrl && (
          <Image 
            src={thumbnailUrl} 
            alt={`Thumbnail for ${movie.title}`}
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
      <CardContent className="flex-grow p-0 space-y-1">
        <p className="font-semibold leading-tight line-clamp-2">{movie.title}</p>
        <div className="flex items-center gap-1">
          <Button
              size="sm"
              variant="ghost"
              onClick={(e) => { e.stopPropagation(); onVote(movie.id, "up"); }}
              aria-label="Upvote"
              className="rounded-full p-1 h-7 w-7 hover:bg-green-500/10 text-green-500"
          >
              <ArrowUp className="h-4 w-4" />
          </Button>
          <span className="font-bold text-sm tabular-nums w-6 text-center">{movie.votes}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => { e.stopPropagation(); onVote(movie.id, "down"); }}
              aria-label="Downvote"
              className="rounded-full p-1 h-7 w-7 hover:bg-red-500/10 text-red-500"
          >
              <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
