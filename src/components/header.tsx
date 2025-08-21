"use client";

import { Clapperboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddMovieClick: () => void;
}

export function Header({ onAddMovieClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center">
        <div className="mr-4 flex items-center">
          <Clapperboard className="h-8 w-8 text-primary" />
          <span className="ml-3 text-2xl font-bold">Streamlined</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button onClick={onAddMovieClick} size="lg" className="rounded-full">
            <Plus className="mr-2 h-5 w-5" />
            Add Video
          </Button>
        </div>
      </div>
    </header>
  );
}
