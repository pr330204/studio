"use client";

import type { Movie } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/header";
import { MovieList } from "@/components/movie-list";
import { AddMovieDialog } from "@/components/add-movie-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMovieOpen, setAddMovieOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "movies"), (snapshot) => {
      const moviesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie)).sort((a,b) => b.votes - a.votes);
      setMovies(moviesData);
      if (!selectedMovie && moviesData.length > 0) {
        setSelectedMovie(moviesData[0]);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [selectedMovie]);

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
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header onAddMovieClick={() => setAddMovieOpen(true)} />
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <Input
                type="search"
                placeholder="Search videos..."
                className="h-12 flex-1 rounded-lg border-2 border-border/60 bg-muted/40 pl-5 text-base focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button size="lg" className="h-12">Search</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden mb-4">
                {selectedMovie ? (
                  <iframe
                    key={selectedMovie.id}
                    width="100%"
                    height="100%"
                    src={selectedMovie.url.replace('watch?v=', 'embed/').split('&')[0] + '?autoplay=1&rel=0'}
                    title={`Player for ${selectedMovie.title}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Select a video to start watching</p>
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold">{selectedMovie?.title}</h1>
              <p className="text-sm text-muted-foreground mt-2">Uses YouTube Data API v3 + Firebase</p>
            </div>
            
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Up Next</h2>
              {loading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 animate-pulse">
                    <div className="w-32 h-20 bg-muted rounded"></div>
                    <div className="space-y-2 flex-1">
                       <div className="h-4 bg-muted rounded w-3/4"></div>
                       <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                   <div className="flex items-center gap-4 animate-pulse">
                    <div className="w-32 h-20 bg-muted rounded"></div>
                    <div className="space-y-2 flex-1">
                       <div className="h-4 bg-muted rounded w-3/4"></div>
                       <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                   <div className="flex items-center gap-4 animate-pulse">
                    <div className="w-32 h-20 bg-muted rounded"></div>
                    <div className="space-y-2 flex-1">
                       <div className="h-4 bg-muted rounded w-3/4"></div>
                       <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <MovieList 
                  movies={filteredMovies.filter(m => m.id !== selectedMovie?.id)} 
                  onVote={handleVote} 
                  onMovieSelect={setSelectedMovie}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <AddMovieDialog
        isOpen={isAddMovieOpen}
        onOpenChange={setAddMovieOpen}
        onMovieAdded={handleAddMovie}
      />
    </div>
  );
}
