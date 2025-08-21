"use client";

import type { Movie } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/header";
import { MovieCard } from "@/components/movie-card";
import { AddMovieDialog } from "@/components/add-movie-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, ArrowUp } from "lucide-react";

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
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header onAddMovieClick={() => setAddMovieOpen(true)} />
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                <Input
                  type="search"
                  placeholder="Search videos..."
                  className="h-12 flex-1 rounded-lg border-2 border-border/60 bg-muted/40 pl-5 text-base focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button size="lg" className="h-12">Search</Button>
              </div>
              <div className="flex gap-4">
                <Select>
                  <SelectTrigger className="w-[180px] h-12 bg-muted/40 border-2 border-border/60">
                    <SelectValue placeholder="Relevance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
                 <Select>
                  <SelectTrigger className="w-[180px] h-12 bg-muted/40 border-2 border-border/60">
                    <SelectValue placeholder="Any length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any length</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
             <div>
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
              <h1 className="text-xl font-bold">{selectedMovie?.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">Uses YouTube Data API v3 + Firebase</p>
            </div>
            
            <div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2 animate-pulse">
                      <div className="w-full h-40 bg-muted rounded-lg"></div>
                      <div className="space-y-2">
                         <div className="h-4 bg-muted rounded w-3/4"></div>
                         <div className="h-4 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMovies.map((movie) => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                      onVote={handleVote} 
                      onSelect={setSelectedMovie}
                      isSelected={movie.id === selectedMovie?.id}
                    />
                  ))}
                </div>
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
