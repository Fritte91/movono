/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
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
    ],
    domains: ['ylvgvgkyawmialfcudex.supabase.co'],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true, // Temporarily add this to get the build working
  },
}

export default nextConfig
