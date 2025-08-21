"use client";

import type { Movie } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/header";
import { AddMovieDialog } from "@/components/add-movie-dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, increment, serverTimestamp, query, orderBy } from "firebase/firestore";
import { MovieList } from "@/components/movie-list";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMovieOpen, setAddMovieOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const q = query(collection(db, "movies"), orderBy("votes", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const moviesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
      setMovies(moviesData);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filteredMovies = useMemo(() => {
    if (!searchQuery) {
      return movies;
    }
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [movies, searchQuery]);

  const handleVote = async (id: string, type: "up" | "down") => {
    const movieRef = doc(db, "movies", id);
    await updateDoc(movieRef, {
      votes: increment(type === "up" ? 1 : -1)
    });
  };

  const handleAddMovie = async (movie: Omit<Movie, "id" | "votes">) => {
    await addDoc(collection(db, "movies"), {
      ...movie,
      votes: 0,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header onAddMovieClick={() => setAddMovieOpen(true)} />
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <div className="container max-w-7xl">
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Watch Now</h1>
            <div className="max-w-md">
              <Input
                type="search"
                placeholder="Search videos..."
                className="w-full bg-muted/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-8 flex h-48 items-center justify-center rounded-lg border-2 border-dashed bg-muted/20 text-muted-foreground">
            Ad Placeholder (Top) - 728x90
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-4 animate-pulse">
                        <div className="w-full h-40 bg-muted rounded-md"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-full"></div>
                            <div className="h-4 bg-muted rounded w-2/3"></div>
                        </div>
                    </div>
                ))}
            </div>
          ) : (
            <MovieList 
                movies={filteredMovies} 
                onVote={handleVote} 
                onMovieSelect={setSelectedMovie}
                selectedMovieId={selectedMovie?.id}
            />
          )}
        </div>
      </main>
      <footer className="px-4 py-6 md:px-6 lg:px-8">
        <div className="container max-w-7xl">
          <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed bg-muted/20 text-muted-foreground">
            Ad Placeholder (Footer) - 728x90
          </div>
        </div>
      </footer>
      <AddMovieDialog
        isOpen={isAddMovieOpen}
        onOpenChange={setAddMovieOpen}
        onMovieAdded={handleAddMovie}
      />
    </div>
  );
}
