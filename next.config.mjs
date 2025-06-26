/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'img.yts.mx', // or whatever domain serves your banner images
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com', // Added this to allow Amazon images
      },
      {
        protocol: 'https',
        hostname: 'imag.malavida.com',
      },
    ],
    domains: ['witpoqobiuvhokyjopod.supabase.co', 'image.tmdb.org'],
  },
}

export default nextConfig
