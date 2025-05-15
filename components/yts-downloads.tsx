"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function YtsDownloads({ imdbId, title }: { imdbId: string; title: string }) {
  const [torrents, setTorrents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchTorrents() {
      setLoading(true);
      try {
        const res = await fetch(`/api/yts?imdbId=${imdbId}`);
        const data = await res.json();
        setTorrents(data.torrents || []);
      } catch (err) {
        setTorrents([]);
      }
      setLoading(false);
    }
    fetchTorrents();
  }, [imdbId]);

  const handleTorrentDownload = (torrent: any) => {
    toast({
      title: "Download started",
      description: `Downloading ${title} in ${torrent.quality} (${torrent.size}).`,
    });
  };

  if (loading) {
    return <div className="animate-pulse text-center py-4">Loading download options...</div>;
  }

  if (!torrents.length) {
    return <p className="text-muted-foreground">No download options available.</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {torrents.map((torrent) => (
        <Button
          key={torrent.url}
          variant="default"
          size="lg"
          className="flex items-center gap-2 w-full transition-transform duration-200 hover:scale-105 hover:shadow-md"
          onClick={() => handleTorrentDownload(torrent)}
          asChild
          aria-label={`Download ${title} in ${torrent.quality}`}
        >
          <a href={torrent.url} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" />
            <span className="flex items-center gap-2">
              <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                {torrent.quality}
              </span>
              ({torrent.size}, Seeds: {torrent.seeds})
            </span>
          </a>
        </Button>
      ))}
    </div>
  );
} 