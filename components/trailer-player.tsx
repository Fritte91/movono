import React, { useRef } from "react";

type Props = {
  youtubeTrailerUrl: string;
  title: string;
  thumbnailUrl: string;
  className?: string;
  onPlay?: () => void;
};

export const TrailerPlayer = ({
  youtubeTrailerUrl,
  title,
  thumbnailUrl,
  className = "",
  onPlay,
}: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedUrl = youtubeTrailerUrl.replace("watch?v=", "embed/") + "?autoplay=0&rel=0";

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        allow="autoplay; encrypted-media"
        allowFullScreen
        onLoad={onPlay}
        className="w-full h-full z-20 relative pointer-events-auto border-none"
      />
    </div>
  );
};
