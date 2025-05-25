// lib/fetch-trailer.ts
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function fetchTrailerFromTmdbId(tmdbId: string): Promise<string | null> {
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=en-US`

  const response = await fetch(url)
  const data = await response.json()

  if (!data.results || !Array.isArray(data.results)) return null

  const trailer = data.results.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  )

  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
}
