"use client";

import type { Movie } from "@/lib/types";
import Image from 'next/image';
import Link from 'next/link';
import { getYouTubeThumbnail } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MovieCardProps {
  movie: Movie;
  variant?: 'list' | 'grid';
}

export function MovieCard({ movie, variant = 'grid' }: MovieCardProps) {
  const thumbnailUrl = getYouTubeThumbnail(movie.url);
  const channelLetter = movie.title ? movie.title.charAt(0).toUpperCase() : 'U';

  if (variant === 'list') {
    return (
       <Link href={`/watch?v=${movie.id}`} className="flex gap-3 group">
          <div className="w-40 aspect-video overflow-hidden rounded-lg shrink-0">
             <Image
                src={thumbnailUrl || "https://placehold.co/160x90.png"}
                alt={`Thumbnail for ${movie.title}`}
                width={160}
                height={90}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                data-ai-hint="video thumbnail"
             />
          </div>
          <div>
             <h3 className="font-semibold leading-snug line-clamp-2 text-sm">{movie.title}</h3>
             <p className="text-xs text-muted-foreground mt-1">Streamlined</p>
             <p className="text-xs text-muted-foreground">{movie.votes} votes</p>
          </div>
       </Link>
    );
  }

  return (
    <Link href={`/watch?v=${movie.id}`} className="group">
        <div className="aspect-video overflow-hidden rounded-lg">
          <Image
            src={thumbnailUrl || "https://placehold.co/400x225.png"}
            alt={`Thumbnail for ${movie.title}`}
            width={400}
            height={225}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
            data-ai-hint="video thumbnail"
          />
        </div>
        <div className="flex gap-3 mt-3">
           <Avatar className="h-9 w-9">
               <AvatarImage src="https://placehold.co/36x36.png" data-ai-hint="logo" />
               <AvatarFallback>{channelLetter}</AvatarFallback>
           </Avatar>
           <div className="flex-grow">
              <h3 className="font-semibold leading-snug line-clamp-2">{movie.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">Streamlined</p>
              <p className="text-sm text-muted-foreground">{movie.votes} votes</p>
           </div>
        </div>
    </Link>
  );
}
