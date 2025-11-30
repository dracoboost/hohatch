/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  webpack: (config, {isServer}) => {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });

    if (!isServer) {
      config.externals.push({
        "rehype-img-size": "rehype-img-size",
      });
    }

    return config;
  },
};

export default nextConfig;
