import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  let videoId: string | null = null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname.startsWith('/embed/')) {
        return url; // Already an embed link
      }
      videoId = urlObj.searchParams.get('v');
    }
  } catch (error) {
    // Not a valid URL, ignore
    return null;
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return null;
}
