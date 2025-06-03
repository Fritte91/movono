import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, ExternalLink, Search } from "lucide-react"
import Link from "next/link"

export default function GuidePage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/members"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">How to Download and Use Torrents</h1>
          <p className="text-muted-foreground mt-2">
            A step-by-step guide to downloading and using qBittorrent with Movono
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">What is qBittorrent?</h2>
            <Card>
              <CardContent className="p-6">
                <p className="mb-4">
                  qBittorrent is a free and open-source BitTorrent client that allows you to download files from the
                  BitTorrent network. It's the recommended client for downloading torrents from Movono due to its:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Clean, ad-free interface</li>
                  <li>Lightweight resource usage</li>
                  <li>Cross-platform availability (Windows, macOS, Linux)</li>
                  <li>Advanced features like sequential downloading and prioritization</li>
                  <li>Built-in search engine</li>
                </ul>
                <div className="flex justify-center">
                  <img
                    src="/images/guide/qbittorrent-interface.jpg"
                    alt="qBittorrent Interface"
                    className="rounded-lg border border-border"
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Step 1: Download qBittorrent</h2>
            <Card>
              <CardContent className="p-6">
                <p className="mb-4">
                  First, you'll need to download and install qBittorrent on your computer. Visit the official website
                  and download the appropriate version for your operating system.
                </p>
                <div className="flex justify-center mb-6">
                  <Button className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <a href="https://www.qbittorrent.org/download" target="_blank" rel="noopener noreferrer">
                      Visit qBittorrent Website
                    </a>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <h3 className="font-medium mb-2">Windows</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Download the installer and run it. Follow the installation wizard.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Download for Windows
                    </Button>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <h3 className="font-medium mb-2">macOS</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Download the DMG file, open it, and drag qBittorrent to your Applications folder.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Download for macOS
                    </Button>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <h3 className="font-medium mb-2">Linux</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use your package manager or download the appropriate package for your distribution.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Download for Linux
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Step 2: Install qBittorrent</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Windows Installation</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Double-click the downloaded installer file</li>
                      <li>If prompted by User Account Control, click "Yes" to allow the installation</li>
                      <li>Follow the installation wizard, accepting the license agreement</li>
                      <li>Choose your installation location or use the default</li>
                      <li>Select additional components if desired</li>
                      <li>Click "Install" to begin installation</li>
                      <li>Once completed, click "Finish" to launch qBittorrent</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">macOS Installation</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Open the downloaded DMG file</li>
                      <li>Drag the qBittorrent icon to the Applications folder</li>
                      <li>
                        If you get a security warning when first opening the app, right-click on the app icon and select
                        "Open"
                      </li>
                      <li>Click "Open" in the security dialog to confirm</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Linux Installation</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>
                        For Ubuntu/Debian:{" "}
                        <code className="bg-secondary px-2 py-1 rounded">sudo apt install qbittorrent</code>
                      </li>
                      <li>
                        For Fedora: <code className="bg-secondary px-2 py-1 rounded">sudo dnf install qbittorrent</code>
                      </li>
                      <li>
                        For Arch Linux:{" "}
                        <code className="bg-secondary px-2 py-1 rounded">sudo pacman -S qbittorrent</code>
                      </li>
                      <li>Or follow the instructions for your specific distribution</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Step 3: Configure qBittorrent (Recommended Settings)</h2>
            <Card>
              <CardContent className="p-6">
                <p className="mb-4">
                  Before you start downloading, it's a good idea to configure qBittorrent with optimal settings:
                </p>
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    <strong>Set Download Location</strong>
                    <p className="text-sm text-muted-foreground">
                      Go to Tools &gt; Options &gt; Downloads and set your preferred download location.
                    </p>
                  </li>
                  <li>
                    <strong>Configure Connection Limits</strong>
                    <p className="text-sm text-muted-foreground">
                      Go to Tools &gt; Options &gt; Connection and adjust the maximum number of connections according to
                      your internet speed.
                    </p>
                  </li>
                  <li>
                    <strong>Enable Sequential Downloading</strong>
                    <p className="text-sm text-muted-foreground">
                      This allows you to start watching videos before they're fully downloaded. Enable in the
                      right-click menu for a torrent.
                    </p>
                  </li>
                  <li>
                    <strong>Configure Speed Limits</strong>
                    <p className="text-sm text-muted-foreground">
                      Go to Tools &gt; Options &gt; Speed to set upload and download speed limits if needed.
                    </p>
                  </li>
                </ol>
                <div className="flex justify-center mt-6">
                  <img
                    src="/images/guide/qbittorrent-speed.jpg"
                    alt="qBittorrent Settings"
                    className="rounded-lg border border-border"
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Step 4: Downloading Torrents from Movono</h2>
            <Card>
              <CardContent className="p-6">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    <strong>Find a Movie on Movono</strong>
                    <p className="text-sm text-muted-foreground">
                      Browse or search for the movie you want to download on Movono.
                    </p>
                  </li>
                  <li>
                    <strong>Click the Download Button</strong>
                    <p className="text-sm text-muted-foreground">
                      On the movie detail page, click the "Download Torrent" button to download the .torrent file.
                    </p>
                    <div className="flex justify-center my-4">
                      <Button className="gap-2">
                        <Download className="h-4 w-4" />
                        Download Torrent
                      </Button>
                    </div>
                  </li>
                  <li>
                    <strong>Open the Torrent File</strong>
                    <p className="text-sm text-muted-foreground">
                      Once the .torrent file is downloaded, open it with qBittorrent. In most cases, your browser will
                      automatically open it with qBittorrent if it's set as the default application.
                    </p>
                  </li>
                  <li>
                    <strong>Confirm Download Settings</strong>
                    <p className="text-sm text-muted-foreground">
                      A dialog will appear in qBittorrent. Confirm the download location and other settings, then click
                      "OK" to start downloading.
                    </p>
                  </li>
                  <li>
                    <strong>Monitor Your Download</strong>
                    <p className="text-sm text-muted-foreground">
                      You can monitor the progress of your download in qBittorrent. The download speed will depend on
                      the number of seeders and your internet connection.
                    </p>
                  </li>
                </ol>
                <div className="flex justify-center mt-6">
                  <img
                    src="/images/guide/qbittorrent-download.jpg"
                    alt="qBittorrent Download Process"
                    className="rounded-lg border border-border"
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Step 5: Using Subtitles</h2>
            <Card>
              <CardContent className="p-6">
                <p className="mb-4">Many movies on Movono offer subtitle downloads. Here's how to use them:</p>
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    <strong>Download Subtitles</strong>
                    <p className="text-sm text-muted-foreground">
                      On the movie detail page, click the "Download Subtitles" button to download the subtitle file
                      (usually in .srt format).
                    </p>
                  </li>
                  <li>
                    <strong>Place Subtitle File in the Same Folder</strong>
                    <p className="text-sm text-muted-foreground">
                      Move the subtitle file to the same folder as your downloaded movie. Make sure it has the same name
                      as the video file (except for the extension).
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Example: If your movie is "Movie.mp4", name the subtitle file "Movie.srt"
                    </p>
                  </li>
                  <li>
                    <strong>Play with Your Media Player</strong>
                    <p className="text-sm text-muted-foreground">
                      Most media players (VLC, MPC-HC, etc.) will automatically detect and load the subtitle file if
                      it's in the same folder with the same name.
                    </p>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Slow Download Speeds</h3>
                    <ul className="list-disc pl-6">
                      <li>Check if there are enough seeders for the torrent</li>
                      <li>Try enabling DHT, PeX, and Local Peer Discovery in qBittorrent settings</li>
                      <li>Check if your ISP is throttling BitTorrent traffic</li>
                      <li>Try using a VPN service</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Torrent Won't Start</h3>
                    <ul className="list-disc pl-6">
                      <li>Make sure qBittorrent is not blocked by your firewall</li>
                      <li>Check if the torrent has seeders</li>
                      <li>Try restarting qBittorrent</li>
                      <li>Try downloading the .torrent file again</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Subtitle Issues</h3>
                    <ul className="list-disc pl-6">
                      <li>Make sure the subtitle file has the exact same name as the video file</li>
                      <li>Try a different media player like VLC which has good subtitle support</li>
                      <li>If subtitles are out of sync, use the subtitle delay feature in your media player</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Safety and Legal Considerations</h2>
            <Card>
              <CardContent className="p-6">
                <p className="mb-4">When using BitTorrent, it's important to be aware of the following:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Only download content that you have the legal right to access. Movono is a private community that
                    respects copyright laws.
                  </li>
                  <li>Consider using a VPN service to protect your privacy while downloading torrents.</li>
                  <li>Keep your qBittorrent client updated to ensure you have the latest security features.</li>
                  <li>Be cautious about the torrents you download from other sources outside of Movono.</li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Downloading?</h2>
          <p className="text-muted-foreground mb-6">
            Now that you know how to use qBittorrent with Movono, it's time to explore our vast collection of movies!
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/members">
              <Button size="lg">Browse Movies</Button>
            </Link>
            <Link href="/members/search">
              <Button variant="outline" size="lg">
                <Search className="h-4 w-4 mr-2" />
                Search Movies
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
