// components/trailer-player.tsx
import { useRef, useState } from "react";
import { Play } from "lucide-react";

interface TrailerPlayerProps {
  youtubeTrailerUrl: string | null | undefined;
  title: string;
  thumbnailUrl: string;
  className?: string;
  onPlay?: () => void;
}

export function TrailerPlayer({ youtubeTrailerUrl, title, thumbnailUrl, className, onPlay }: TrailerPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Only create embedUrl if youtubeTrailerUrl is a valid string
  const embedUrl = youtubeTrailerUrl && typeof youtubeTrailerUrl === "string"
    ? youtubeTrailerUrl.replace("watch?v=", "embed/") + "?autoplay=1&rel=0"
    : null;

  const handlePlay = () => {
    setIsPlaying(true);
    if (onPlay) {
      onPlay();
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {embedUrl ? (
        <>
          {!isPlaying ? (
            <div className="relative w-full h-full cursor-pointer" onClick={handlePlay}>
              <img
                src={thumbnailUrl}
                alt={`${title} thumbnail`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-black" />
                  </div>
                  <p className="text-white text-lg font-semibold">
                    Watch Trailer
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </>
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