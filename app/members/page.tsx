import { MovieSlider } from "@/components/movie-slider"
import { popularMovies, newReleases, topRated, allMovies } from "@/lib/movie-data"
import { upcomingMovies } from "@/lib/upcoming-movies-data"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown } from "lucide-react"
import Link from "next/link"
import { genres } from "@/lib/movie-data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NewsPreview } from "@/components/news-preview"

export default function MembersPage() {
  return (
    <div className="pb-20">
      <section className="relative h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-90 z-10 hero-gradient"></div>
          <img
            src="/placeholder.svg?height=1080&width=1920"
            alt="Featured movie"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-20">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-sm font-medium rounded-md">
              Featured
            </span>
            <h1 className="text-4xl font-bold">Inception</h1>
            <p className="text-gray-300">
              A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task
              of planting an idea into the mind of a C.E.O.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-2 py-1 bg-secondary text-xs rounded-full">Action</span>
              <span className="px-2 py-1 bg-secondary text-xs rounded-full">Adventure</span>
              <span className="px-2 py-1 bg-secondary text-xs rounded-full">Sci-Fi</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/members/movie/1">
                <Button size="lg" className="group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5 transition-transform group-hover:scale-125"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                  </svg>
                  Watch Trailer
                </Button>
              </Link>
              <Link href="/members/movie/1">
                <Button size="lg" variant="outline">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Welcome to Movono</h2>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Browse Genres
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] max-h-[400px] overflow-y-auto">
                  {genres.map((genre) => (
                    <DropdownMenuItem key={genre} asChild>
                      <Link href={`/members/movies?genre=${genre}`} className="cursor-pointer">
                        {genre}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/members/search">
                <Button variant="outline" className="gap-2">
                  <Search className="h-4 w-4" />
                  Advanced Search
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-12">
            <MovieSlider title="Popular Movies" movies={popularMovies} />
            <MovieSlider title="Coming Soon" movies={upcomingMovies} />
            <MovieSlider title="New Releases" movies={newReleases} />

            {/* Add News Preview Section */}
            <NewsPreview />

            <MovieSlider title="Top Rated" movies={topRated} />
            <MovieSlider
              title="Action"
              movies={allMovies.filter((movie) => movie.genre.includes("Action")).slice(0, 10)}
            />
            <MovieSlider
              title="Adventure"
              movies={allMovies.filter((movie) => movie.genre.includes("Adventure")).slice(0, 10)}
            />
            <MovieSlider
              title="Sci-Fi"
              movies={allMovies.filter((movie) => movie.genre.includes("Sci-Fi")).slice(0, 10)}
            />
            <MovieSlider
              title="Drama"
              movies={allMovies.filter((movie) => movie.genre.includes("Drama")).slice(0, 10)}
            />
            <MovieSlider
              title="Crime"
              movies={allMovies.filter((movie) => movie.genre.includes("Crime")).slice(0, 10)}
            />
            <MovieSlider
              title="Thriller"
              movies={allMovies.filter((movie) => movie.genre.includes("Thriller")).slice(0, 10)}
            />
            <MovieSlider title="Your Favorites" movies={popularMovies.slice(0, 5)} />
          </div>
        </section>
      </div>
    </div>
  )
}
