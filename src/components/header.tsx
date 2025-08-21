"use client";

import { Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddMovieClick: () => void;
}

export function Header({ onAddMovieClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center">
        <div className="mr-4 flex items-center gap-3">
          <div className="bg-primary text-primary-foreground rounded-md p-2">
            <Play className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">Video App</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button onClick={onAddMovieClick} variant="outline" className="hidden sm:inline-flex">
            Go to Admin Page
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
