/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Keep @react-pdf on Node's resolver — avoids slow/broken webpack bundles in dev API routes.
    serverComponentsExternalPackages: [
      "@react-pdf/renderer",
      "@react-pdf/layout",
      "@react-pdf/pdfkit",
      "@react-pdf/font",
      "@react-pdf/render",
    ],
  },
};

module.exports = nextConfig;
