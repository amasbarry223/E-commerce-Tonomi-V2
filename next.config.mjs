/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Activer la vérification TypeScript
  },
  images: {
    unoptimized: false,
    // Ajouter d'autres hostnames (CDN, uploads) dans remotePatterns si besoin.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        // Domaine Supabase du projet (pour les images Storage)
        hostname: 'gpkofgikanxyywqagwsv.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
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
