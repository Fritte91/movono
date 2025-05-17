import { DetailedMovie } from "@/app/members/movie/[id]/page";

// You will need to configure your TMDB API key
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function getMovieFromTmdbById(tmdbId: number): Promise<DetailedMovie | null> {
  if (!TMDB_API_KEY) {
    console.error("TMDB API key is not configured.");
    return null;
  }

  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,release_dates`);
    
    if (!response.ok) {
      console.error(`Error fetching movie from TMDB: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();

    // Find the official trailer (or the first available video if no official trailer)
    const trailer = data.videos?.results?.find(
      (video: any) => video.site === 'YouTube' && video.type === 'Trailer' && video.official
    ) || data.videos?.results?.find((video: any) => video.site === 'YouTube' && video.type === 'Trailer');

    // Find the director and cast (limit to first 5 cast members)
    const director = data.credits?.crew?.find((person: any) => person.job === 'Director')?.name;
    const cast = data.credits?.cast?.slice(0, 5).map((person: any) => person.name);

    // Find the US release date to extract year
    const releaseDateUS = data.release_dates?.results?.find((country: any) => country.iso_3166_1 === 'US');
    const year = releaseDateUS?.release_dates?.[0]?.release_date ? new Date(releaseDateUS.release_dates[0].release_date).getFullYear() : (data.release_date ? new Date(data.release_date).getFullYear() : undefined);

    // Map TMDB data to DetailedMovie format
    const detailedMovie: DetailedMovie = {
      id: `tmdb-${data.id}`, // Prefix with tmdb- to differentiate
      title: data.title,
      posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/original${data.poster_path}` : '/placeholder.svg',
      youtubeTrailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      year: year,
      runtime: data.runtime,
      language: data.spoken_languages?.map((lang: any) => lang.english_name), // Using English names for languages
      country: data.production_countries?.map((country: any) => country.name), // Using production countries
      genre: data.genres?.map((genre: any) => genre.name),
      plot: data.overview,
      director: director,
      writer: undefined, // TMDB API doesn't easily provide writers in main movie details, would need separate calls
      cast: cast,
      awards: undefined, // Not available in this TMDB endpoint
      metascore: undefined, // Not available in TMDB, primarily for Metacritic
      imdbVotes: undefined, // Not available in TMDB, primarily for IMDb
      type: "movie", // Assuming all are movies for now
      dvd: undefined, // Not available
      boxOffice: undefined, // Not directly available in this endpoint
      production: data.production_companies?.map((company: any) => company.name).join(", "),
      website: undefined, // Not directly available
      ratings: {
        imdb: data.vote_average ? parseFloat(data.vote_average.toFixed(1)) : undefined,
        rottenTomatoes: undefined, // Not available in TMDB
        metacritic: undefined, // Not available in TMDB
      }, // TMDB has vote_average, not imdb, rottenTomatoes, metacritic
      userRating: undefined, // This is user-specific and not from TMDB
      torrents: [], // Not available from TMDB
      tmdbId: data.id,
    };

    return detailedMovie;

  } catch (error) {
    console.error('Error in getMovieFromTmdbById:', error);
    return null;
  }
} 