"use client";

import { Play, Plus, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";


interface HeaderProps {
  onAddMovieClick: () => void;
  onSearch?: (query: string) => void;
}

export function Header({ onAddMovieClick, onSearch }: HeaderProps) {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isWatchPage = pathname === '/watch';

  const handleSearchToggle = () => {
    if (isSearchVisible) {
      onSearch?.("");
    }
    setSearchVisible(!isSearchVisible);
  };

  if (isWatchPage) {
     return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-lg">
          <div className="container flex h-16 max-w-7xl items-center mx-auto px-4">
             <div className="mr-4 flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground rounded-md p-2">
                  <Play className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold hidden sm:inline">Streamlined</span>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-2">
               <Button onClick={onAddMovieClick}>
                <Plus className="mr-2 h-4 w-4" />
                Add Video
              </Button>
            </div>
          </div>
        </header>
     )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 max-w-7xl items-center mx-auto px-4">
        <div className={`mr-4 flex items-center gap-3 ${isSearchVisible ? 'hidden sm:flex' : 'flex'}`}>
           <div className="bg-primary text-primary-foreground rounded-md p-2">
             <Play className="h-6 w-6" />
           </div>
           <span className="text-2xl font-bold">Streamlined</span>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
            <div className={`flex-1 mx-auto max-w-md ${isSearchVisible ? 'block' : 'hidden'} sm:block`}>
                <div className="relative">
                    {isSearchVisible && <Button size="icon" variant="ghost" className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 sm:hidden" onClick={handleSearchToggle}><ArrowLeft/></Button>}
                    <Input 
                        type="search" 
                        placeholder="Search videos..."
                        className={`w-full bg-muted/40 ${isSearchVisible ? 'pl-10 sm:pl-3' : ''}`}
                        onChange={(e) => onSearch?.(e.target.value)}
                    />
                </div>
            </div>
           
            <Button size="icon" variant="ghost" className="sm:hidden rounded-full" onClick={handleSearchToggle}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>
            
            <Button onClick={onAddMovieClick} className="hidden sm:inline-flex">
              <Plus className="mr-2 h-4 w-4" />
              Add Video
            </Button>
            <Button onClick={onAddMovieClick} size="icon" className="sm:hidden rounded-full">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add Video</span>
            </Button>
        </div>
      </div>
    </header>
  );
}
