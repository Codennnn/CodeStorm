import { createSecureHeaders } from 'next-secure-headers'

/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/Codennnn',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [{ source: '/(.*)', headers: createSecureHeaders() }]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
    ],
  },
}
