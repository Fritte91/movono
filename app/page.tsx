import { Button } from "@/components/ui/button"
import { Film, Play } from "lucide-react"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 fixed w-full z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">Movono</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <section className="relative h-[80vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-90 z-10 hero-gradient"></div>
            <img
              src="/placeholder.svg?height=1080&width=1920"
              alt="Movie collage"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="container relative z-20">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your Exclusive <span className="gradient-text">Film</span> Community
              </h1>
              <p className="text-xl text-gray-300">
                Join Movono for premium access to high-quality film torrents, detailed information, and a community of
                film enthusiasts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="group">
                  <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-125" />
                  Join Now
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="gradient-text">Premium Features</span> For Film Enthusiasts
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-lg border border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Film className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Extensive Library</h3>
                <p className="text-muted-foreground">
                  Access thousands of high-quality films across all genres and eras.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg shadow-lg border border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Detailed Information</h3>
                <p className="text-muted-foreground">
                  Comprehensive details, ratings, and reviews for every film in our database.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg shadow-lg border border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Community Ratings</h3>
                <p className="text-muted-foreground">
                  Rate films and see what other members think about your favorite movies.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-12">Ready to Join?</h2>
            <Link href="/signup">
              <Button size="lg" className="animate-pulse-glow">
                Create Your Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
