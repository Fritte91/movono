"use client";

import { Button } from "@/components/ui/button";

export default function GuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">How to Download Movies</h1>
      
      <div className="space-y-12">
        {/* Step 1: Download qBittorrent */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Step 1: Download qBittorrent</h3>
          <p className="text-gray-300">
            First, you'll need to download qBittorrent, a free and open-source BitTorrent client. It's one of the most popular and user-friendly torrent clients available.
          </p>
          <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gray-800">
            <img
              src="/images/guide/qbittorrent-interface.jpg"
              alt="qBittorrent Interface"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <a href="https://www.qbittorrent.org/download" target="_blank" rel="noopener noreferrer">
                Download qBittorrent
              </a>
            </Button>
          </div>
        </div>

        {/* Step 2: Configure qBittorrent */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Step 2: Configure qBittorrent</h3>
          <p className="text-gray-300">
            After installing qBittorrent, you'll need to configure it for optimal performance. Here are the recommended settings:
          </p>
          <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gray-800">
            <img
              src="/images/guide/qbittorent-speed.jpg"
              alt="qBittorrent Speed Settings"
              className="w-full h-full object-cover"
            />
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Set your download speed limit based on your internet connection</li>
            <li>Enable DHT, PeX, and LSD for better peer discovery</li>
            <li>Configure your port forwarding if you're behind a router</li>
            <li>Set up your download and temporary folders</li>
          </ul>
        </div>

        {/* Step 3: Download Movies */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Step 3: Download Movies</h3>
          <p className="text-gray-300">
            Now you're ready to download movies. Here's how to do it:
          </p>
          <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gray-800">
            <img
              src="/images/guide/qbittorrent-download.jpg"
              alt="qBittorrent Download Interface"
              className="w-full h-full object-cover"
            />
          </div>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Click the "Add Torrent Link" button in qBittorrent</li>
            <li>Paste the magnet link or .torrent file from our site</li>
            <li>Choose your download location</li>
            <li>Click "Download" to start</li>
          </ol>
        </div>

        {/* Step 4: Download Subtitles */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Step 4: Download Subtitles</h3>
          <p className="text-gray-300">
            For the best viewing experience, you'll need to download subtitles. We recommend using SubDL.com:
          </p>
          <div className="bg-secondary/20 p-4 rounded-lg">
            <p className="text-gray-300 mb-2">
              You will be redirected to SubDL.com, a dedicated subtitle website. Please note:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Look for English subtitles that match your movie's quality (e.g., 1080p, 2160p)</li>
              <li>Make sure the subtitle file name matches your movie file name</li>
              <li>We apologize for any pop-up ads on SubDL.com - they help keep the service free</li>
              <li>Always scan downloaded subtitle files with your antivirus before using them</li>
            </ul>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <a href="https://subdl.com" target="_blank" rel="noopener noreferrer">
                Go to SubDL.com
              </a>
            </Button>
          </div>
        </div>

        {/* Note about images */}
        <div className="text-sm text-gray-400 italic">
          Note: All screenshots are sourced from Malavida.com and are used for educational purposes only.
        </div>
      </div>
    </div>
  );
} 