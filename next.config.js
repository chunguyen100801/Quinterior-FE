/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'placehold.co',
        protocol: 'https',
      },
      {
        hostname: 'firebasestorage.googleapis.com',
        protocol: 'https',
      },
      {
        hostname: 'loremflickr.com',
        protocol: 'https',
      },
      {
        hostname: 'datn-be.s3.amazonaws.com',
        protocol: 'https',
      },
      {
        hostname: 'datn-images.s3.amazonaws.com',
        protocol: 'https',
      },
      {
        hostname: 'image.lexica.art',
        protocol: 'https',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
    return config;
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
