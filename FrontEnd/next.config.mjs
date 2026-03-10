/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "happy-home-developers.s3.ap-south-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    const springApiUrl = process.env.SPRING_API_URL ?? "http://localhost:8080"
    return [
      {
        source: "/backend/:path*",
        destination: `${springApiUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
