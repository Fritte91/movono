"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <div className="mt-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="w-full gap-2">
            <Download className="h-4 w-4" />
            Download Torrent
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {torrents.length > 0 ? (
            torrents.map((torrent) => (
              <DropdownMenuItem
                key={torrent.url}
                onClick={() => handleTorrentDownload(torrent)}
                asChild
              >
                <a href={torrent.url} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center w-full">
                  <span>{torrent.quality} ({torrent.size})</span>
                  <span className="text-xs text-muted-foreground">Seeds: {torrent.seeds}</span>
                </a>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No torrents available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 