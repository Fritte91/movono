"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Torrent {
  url: string;
  hash: string;
  quality: string;
  size: string;
  seeds: number;
  peers: number;
}

export function YtsDownloads({ imdbId, title, handleTorrentDownload }: { imdbId: string; title: string; handleTorrentDownload?: (torrent: Torrent) => void }) {
  const [torrents, setTorrents] = useState<Torrent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTorrents() {
      setLoading(true);
      try {
        // First, try to get torrents from the database (if movie was already fetched before)
        const dbResponse = await fetch(`/api/movie/${imdbId}`);
        if (dbResponse.ok) {
          const dbData = await dbResponse.json();
          if (dbData.movie && dbData.movie.torrents && dbData.movie.torrents.length > 0) {
            setTorrents(dbData.movie.torrents);
            setLoading(false);
            return;
          }
        }

        // If no torrents in DB, fetch from YTS
        const res = await fetch(`/api/yts?imdb_id=${imdbId}`);
        const data = await res.json();
        
        if (data.torrents && data.torrents.length > 0) {
          setTorrents(data.torrents);
          
          // Save torrent data to database
          try {
            await fetch('/api/sync-movies', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                syncType: 'update_torrents',
                imdbId: imdbId,
                torrents: data.torrents
              })
            });
          } catch (error) {
            // Silently fail - this is just for enriching the database
          }
        } else {
          setTorrents([]);
        }
      } catch (err) {
        setTorrents([]);
      }
      setLoading(false);
    }
    fetchTorrents();
  }, [imdbId]);

  const createMagnetLink = (torrent: Torrent) => {
    const trackers = [
      'udp://tracker.opentrackr.org:1337/announce',
      'udp://tracker.coppersurfer.tk:6969/announce',
      'udp://tracker.openbittorrent.com:80/announce',
      'udp://p4p.arenabg.com:1337/announce',
      'udp://tracker.internetwarriors.net:1337/announce'
    ];
    
    const encodedTitle = encodeURIComponent(title);
    const trackerParams = trackers.map(tracker => `&tr=${encodeURIComponent(tracker)}`).join('');
    
    return `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodedTitle}${trackerParams}`;
  };

  const localTorrentDownload = (torrent: Torrent) => {
    toast.success(`Downloading ${title} in ${torrent.quality} (${torrent.size}).`);
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
                key={torrent.hash}
                onClick={() => (handleTorrentDownload ? handleTorrentDownload(torrent) : localTorrentDownload(torrent))}
                asChild
              >
                <a href={createMagnetLink(torrent)} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center w-full">
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