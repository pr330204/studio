import type { Movie } from "@/lib/types";
import { MovieCard } from "./movie-card";

interface MovieListProps {
  movies: Movie[];
  onVote: (id: string, type: "up" | "down") => void;
  onMovieSelect: (movie: Movie) => void;
  selectedMovieId?: string;
}

export function MovieList({ movies, onVote, onMovieSelect, selectedMovieId }: MovieListProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
        <h3 className="text-lg font-semibold tracking-tight">No videos found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          onVote={onVote}
          onSelect={onMovieSelect}
          isSelected={movie.id === selectedMovieId}
        />
      ))}
    </div>
  );
}
