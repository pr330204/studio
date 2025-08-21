"use client";

import { Clapperboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddMovieClick: () => void;
}

export function Header({ onAddMovieClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Clapperboard className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold font-headline">VideoHub</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button onClick={onAddMovieClick}>
            <Plus />
            Add Video
          </Button>
        </div>
      </div>
    </header>
  );
}
