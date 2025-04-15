/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: '/service-worker.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/'
          },
          //
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      }
    ];
  },
 /* webpack: (config, { isServer }) => {
    // Ajout du support pour les service workers
    if (!isServer) {
      config.output.publicPath = '/_next/';
    }
    return config;
  }*/
};

module.exports = nextConfig;
