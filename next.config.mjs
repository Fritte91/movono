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
  },
}

export default nextConfig
