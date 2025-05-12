// lib/api/getMovieById.ts
import { Movie } from "../types";

export async function getMovieByIdFromAPI(imdbID: string): Promise<Movie | null> {
  const apiKey = process.env.OMDB_API_KEY || "e2253ed9";
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}&plot=full`
    );
    if (!res.ok) throw new Error("OMDb API request failed");
    const data = await res.json();
    if (data.Response === "False") {
      console.warn(`No OMDb data for IMDb ID ${imdbID}: ${data.Error}`);
      return null;
    }

    return {
      id: imdbID,
      title: data.Title || "Unknown",
      year: parseInt(data.Year) || new Date().getFullYear(),
      director: data.Director || "Unknown",
      cast: data.Actors ? data.Actors.split(", ").map((a: string) => a.trim()) : [],
      genre: data.Genre ? data.Genre.split(", ").map((g: string) => g.trim()) : [],
      plot: data.Plot || "No plot available",
      posterUrl: data.Poster || "/placeholder.svg?height=600&width=400",
      trailerUrl: undefined,
      runtime: parseInt(data.Runtime) || 0,
      ratings: {
        imdb: data.imdbRating ? parseFloat(data.imdbRating) : 0,
        rottenTomatoes: data.Ratings?.find((r: any) => r.Source === "Rotten Tomatoes")?.Value?.replace("%", "") * 1 || 0,
        metacritic: data.Metascore ? parseFloat(data.Metascore) : 0,
      },
      language: data.Language || "English",
      country: data.Country || "USA",
      similar: [],
      torrents: [],
      youtubeTrailerUrl: null,
      userRating: 0,
    };
  } catch (error) {
    console.error(`Error fetching movie ${imdbID}:`, error);
    return null;
  }
}