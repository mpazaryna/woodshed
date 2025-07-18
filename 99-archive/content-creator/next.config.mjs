/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Environment variables that should be available to the client
  env: {
    // We don't expose the API key to the client for security reasons
  },
  // Explicitly configure environment variables
  serverRuntimeConfig: {
    // Will only be available on the server side
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Add webpack configuration to handle environment variables
  webpack: (config, { isServer }) => {
    // This makes sure environment variables are properly passed
    if (isServer) {
      // For server-side code
      config.plugins = config.plugins || [];
    }
    return config;
  },
}

export default nextConfig
