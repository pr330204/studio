"use client";

import type { Movie } from "@/lib/types";
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
    <div 
      className={`flex flex-col gap-2 transition-all duration-200 cursor-pointer group`}
      onClick={() => onSelect(movie)}
    >
      <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden flex-shrink-0 relative">
        {thumbnailUrl ? (
          <Image 
            src={thumbnailUrl} 
            alt={`Thumbnail for ${movie.title}`}
            layout="fill"
            objectFit="cover"
            className={`transition-transform duration-300 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
          />
        ) : (
          <div className="w-full h-full bg-muted"></div>
        )}
      </div>
      <div className="flex-grow space-y-1">
        <p className={`font-semibold leading-tight line-clamp-2 ${isSelected ? 'text-primary' : ''}`}>{movie.title}</p>
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
      </div>
    </div>
  );
}
