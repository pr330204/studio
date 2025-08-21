"use client";

import type { Movie } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/header";
import { MovieList } from "@/components/movie-list";
import { AddMovieDialog } from "@/components/add-movie-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMovieOpen, setAddMovieOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "movies"), (snapshot) => {
      const moviesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
      setMovies(moviesData);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const sortedAndFilteredMovies = useMemo(() => {
    const sorted = [...movies].sort((a, b) => b.votes - a.votes);
    if (!searchQuery) {
      return sorted;
    }
    return sorted.filter((movie) =>
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
    <div className="flex min-h-screen w-full flex-col">
      <Header onAddMovieClick={() => setAddMovieOpen(true)} />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                Community Watchlist
              </h1>
              <p className="text-muted-foreground">
                Vote for your favorite videos to watch next.
              </p>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search videos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {loading ? (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
                <h3 className="text-xl font-semibold tracking-tight">Loading videos...</h3>
             </div>
          ) : (
            <MovieList movies={sortedAndFilteredMovies} onVote={handleVote} />
          )}
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
