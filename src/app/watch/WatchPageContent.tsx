'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, collection, onSnapshot, updateDoc, increment, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Movie } from '@/lib/types';
import { Header } from '@/components/header';
import { AddMovieDialog } from '@/components/add-movie-dialog';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { MovieList } from '@/components/movie-list';
import { getYouTubeEmbedUrl } from '@/lib/utils';

export default function WatchPageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMovieOpen, setAddMovieOpen] = useState(false);

  useEffect(() => {
    if (!videoId) {
      setLoading(false);
      return;
    }

    const fetchMovie = async () => {
      setLoading(true);
      const docRef = doc(db, 'movies', videoId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMovie({ id: docSnap.id, ...docSnap.data() } as Movie);
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };

    fetchMovie();
  }, [videoId]);

  useEffect(() => {
    const q = query(collection(db, "movies"), orderBy("votes", "desc"), limit(10));
    const unsub = onSnapshot(q, (snapshot) => {
      const moviesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
      setSuggestedMovies(moviesData);
    });

    return () => unsub();
  }, []);

  const handleVote = async (id: string, type: "up" | "down") => {
    if(!movie) return;
    const movieRef = doc(db, "movies", id);
    const newVotes = movie.votes + (type === 'up' ? 1 : -1);
    await updateDoc(movieRef, {
      votes: increment(type === "up" ? 1 : -1)
    });
    setMovie(prev => prev ? {...prev, votes: newVotes } : null);
  };
  
  const embedUrl = useMemo(() => {
    if (movie?.url) {
      const url = getYouTubeEmbedUrl(movie.url);
      return url ? `${url}?autoplay=1&rel=0` : null;
    }
    return null;
  }, [movie?.url]);

  if (loading) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
            <Header onAddMovieClick={() => setAddMovieOpen(true)} />
            <div className="flex-1 lg:grid lg:grid-cols-3 lg:gap-8 p-4 md:p-6 lg:p-8">
                <div className="lg:col-span-2">
                    <div className="aspect-video bg-muted rounded-lg animate-pulse"></div>
                    <div className="h-8 w-3/4 bg-muted rounded mt-4 animate-pulse"></div>
                    <div className="h-6 w-1/4 bg-muted rounded mt-2 animate-pulse"></div>
                </div>
                <div className="mt-8 lg:mt-0">
                     <div className="flex flex-col gap-4">
                        {[...Array(5)].map((_, i) => (
                             <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-40 aspect-video bg-muted rounded-lg shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted rounded w-full"></div>
                                    <div className="h-4 bg-muted rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
             <AddMovieDialog isOpen={isAddMovieOpen} onOpenChange={setAddMovieOpen} onMovieAdded={() => {}} />
        </div>
    );
  }

  if (!movie) {
    return (
       <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
         <Header onAddMovieClick={() => setAddMovieOpen(true)} />
         <div className="flex-1 flex items-center justify-center">
            <p>Video not found.</p>
         </div>
         <AddMovieDialog isOpen={isAddMovieOpen} onOpenChange={setAddMovieOpen} onMovieAdded={() => {}} />
       </div>
    );
  }

  const otherMovies = suggestedMovies.filter(m => m.id !== movie.id);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header onAddMovieClick={() => setAddMovieOpen(true)} />
      <main className="flex-1 lg:grid lg:grid-cols-3 lg:gap-8 p-4 md:p-6 lg:p-8">
        <div className="lg:col-span-2">
          <div className="aspect-video overflow-hidden rounded-lg bg-black">
             {embedUrl && (
                <iframe
                  key={movie.id}
                  width="100%"
                  height="100%"
                  src={embedUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
             )}
          </div>
          <div className="py-4">
            <h1 className="text-xl font-bold">{movie.title}</h1>
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <p>Streamlined</p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleVote(movie.id, "up")}
                    aria-label="Upvote"
                    className="flex items-center gap-1.5 hover:bg-muted"
                  >
                    <ArrowUp className="h-4 w-4" />
                    {movie.votes}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleVote(movie.id, "down")}
                    aria-label="Downvote"
                     className="flex items-center gap-1.5 hover:bg-muted"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
            </div>
          </div>
        </div>
        <aside className="mt-8 lg:mt-0">
            <h2 className="text-lg font-semibold mb-4">Up next</h2>
            <MovieList movies={otherMovies} variant="list" />
        </aside>
      </main>
      <AddMovieDialog isOpen={isAddMovieOpen} onOpenChange={setAddMovieOpen} onMovieAdded={() => {}}/>
    </div>
  );
}
