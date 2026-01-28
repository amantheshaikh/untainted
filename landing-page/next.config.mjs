/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
  images: {
  },
}

export default nextConfig
// Force rebuild Tue Jan 27 22:31:20 IST 2026
