// components/trailer-player.tsx
import { useRef } from "react";

interface TrailerPlayerProps {
  youtubeTrailerUrl: string | null;
  title: string;
  thumbnailUrl: string;
  className?: string;
}

export function TrailerPlayer({ youtubeTrailerUrl, title, thumbnailUrl, className }: TrailerPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Only create embedUrl if youtubeTrailerUrl is a valid string
  const embedUrl = youtubeTrailerUrl && typeof youtubeTrailerUrl === "string"
    ? youtubeTrailerUrl.replace("watch?v=", "embed/") + "?autoplay=0&rel=0"
    : null;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {embedUrl ? (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      ) : (
        <div className="relative w-full h-full">
          <img
            src={thumbnailUrl}
            alt={`${title} thumbnail`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-white text-lg font-semibold">
              Trailer not available for {title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}