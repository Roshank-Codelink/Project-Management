/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // Enable static exports if needed
  // output: 'export',
}

module.exports = nextConfig
