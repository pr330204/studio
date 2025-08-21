"use client";

import type { Movie } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/header";
import { AddMovieDialog } from "@/components/add-movie-dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, increment, serverTimestamp, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { getYouTubeThumbnail } from "@/lib/utils";
import Image from "next/image";

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
      if (!selectedMovie && moviesData.length > 0) {
        setSelectedMovie(moviesData[0]);
      } else if (selectedMovie) {
        // refresh selected movie data
        const updatedSelectedMovie = moviesData.find(m => m.id === selectedMovie.id);
        if (updatedSelectedMovie) {
          setSelectedMovie(updatedSelectedMovie);
        } else {
          setSelectedMovie(moviesData[0] || null);
        }
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
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header onAddMovieClick={() => setAddMovieOpen(true)} />
      <main className="flex-1 lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12 px-4 py-6 md:px-6 lg:px-8">
        <div className="lg:col-span-8 xl:col-span-9">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="w-full aspect-video bg-muted rounded-xl"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </div>
          ) : selectedMovie ? (
            <div>
              <div className="aspect-video w-full overflow-hidden rounded-xl border">
                <iframe
                  key={selectedMovie.id}
                  width="100%"
                  height="100%"
                  src={selectedMovie.url.replace('watch?v=', 'embed/').split('&')[0] + '?autoplay=1&rel=0'}
                  title={selectedMovie.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{selectedMovie.title}</h1>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVote(selectedMovie.id, "up")}
                      className="gap-2"
                    >
                      <ArrowUp className="h-4 w-4" />
                      <span>Upvote</span>
                    </Button>
                    <span className="font-bold text-xl tabular-nums w-10 text-center">{selectedMovie.votes}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVote(selectedMovie.id, "down")}
                       className="gap-2"
                    >
                      <ArrowDown className="h-4 w-4" />
                       <span>Downvote</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center aspect-video">
                <h3 className="text-lg font-semibold tracking-tight">No videos available</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a video to get started.
                </p>
              </div>
          )}
        </div>
        <aside className="mt-8 lg:mt-0 lg:col-span-4 xl:col-span-3">
           <div className="sticky top-20 space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Up Next</h2>
                <Input
                  type="search"
                  placeholder="Search videos..."
                  className="w-full bg-muted/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="w-32 h-18 bg-muted rounded-md"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-full"></div>
                                <div className="h-4 bg-muted rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex max-h-[calc(100vh-15rem)] flex-col gap-4 overflow-y-auto">
                    {filteredMovies.map((movie) => (
                      <button 
                        key={movie.id} 
                        onClick={() => setSelectedMovie(movie)}
                        className="flex items-start gap-4 text-left rounded-lg p-2 hover:bg-muted transition-colors w-full"
                      >
                         <div className="relative w-32 shrink-0">
                          <Image
                            src={getYouTubeThumbnail(movie.url) || "https://placehold.co/128x72.png"}
                            alt={movie.title}
                            width={128}
                            height={72}
                            className="rounded-md object-cover aspect-video"
                          />
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold leading-tight line-clamp-2">{movie.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{movie.votes} votes</p>
                        </div>
                      </button>
                    ))}
                </div>
            )}
            </div>
        </aside>
      </main>
      <AddMovieDialog
        isOpen={isAddMovieOpen}
        onOpenChange={setAddMovieOpen}
        onMovieAdded={handleAddMovie}
      />
    </div>
  );
}
