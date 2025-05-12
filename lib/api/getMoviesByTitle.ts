// lib/api/getMoviesByTitle.ts
import { getMovieByIdFromAPI } from "./getMovieById";
import { Movie } from "../types";

export async function getMoviesByTitle(titles: string[]): Promise<Movie[]> {
  const apiKey = process.env.OMDB_API_KEY || "e2253ed9";

  try {
    const fetches = titles.map(async (title) => {
      const omdbRes = await fetch(
        `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`
      );
      if (!omdbRes.ok) {
        console.error(`OMDb API request failed for title: ${title}`);
        return null;
      }
      const movie = await omdbRes.json();
      if (movie.Response === "False") {
        console.warn(`OMDb movie not found for title: ${title}`);
        return null;
      }
      return await getMovieByIdFromAPI(movie.imdbID);
    });

    const movies = await Promise.all(fetches);
    return movies.filter((movie): movie is Movie => movie !== null);
  } catch (error) {
    console.error("Error fetching movies by title:", error);
    return [];
  }
}