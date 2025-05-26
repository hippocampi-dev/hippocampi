/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // webpack: (config) => {
  //   config.resolve.fallback = {
  //     fs: false,
  //     net: false,
  //     tls: false,
  //     child_process: false,
  //   };
  //   return config;
  // },
  images: {
    domains: [
      // Current domains
      'images.unsplash.com',
      'rlurtkitmuskcxsokskb.supabase.co',
      'jbntzomzylpmbukwqrds.supabase.co',
      // Common image hosting services
      'res.cloudinary.com',
      'i.imgur.com',
      'imgur.com',
      'picsum.photos',
      'media.giphy.com',
      // Storage services
      'storage.googleapis.com',
      's3.amazonaws.com',
      // Stock photo sites
      'images.pexels.com',
      'images.pixabay.com',
      'img.freepik.com',
      'www.istockphoto.com',  // iStock Photo
      // Social media
      'www.shutterstock.com',
      'pbs.twimg.com', // Twitter
      'media.licdn.com', // LinkedIn
      'scontent.xx.fbcdn.net', // Facebook
      'cdn.dribbble.com',
      // Other common CDNs
      'cdn.sanity.io',
      'cdn.contentful.com',
      'images.ctfassets.net', // Contentful
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "g1qjabzyxmxpdcdy.public.blob.vercel-storage.com",
        port: '',
      },
      // Add patterns for various domains
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net', // Azure Blob Storage
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google user content (including photos)
      },
      {
        protocol: 'https',
        hostname: '*.wp.com', // WordPress
      },
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com', // GitHub user content
      },
    ],
  },
};

export default config;
