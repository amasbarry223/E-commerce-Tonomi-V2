/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Activer la vérification TypeScript
  },
  images: {
    unoptimized: false, // Activer l'optimisation des images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  // Configuration Turbopack pour éviter le warning sur les lockfiles multiples
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
