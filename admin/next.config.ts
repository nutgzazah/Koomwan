import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["koomwan-storage.5f04fd0f03b8aa2c313105f3c2a3c704.r2.cloudflarestorage.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/medicalManagement",
        permanent: true,
      },
    ];
  },
  env: {
    BASE_URL: "http://localhost:8080", // Define BASE_URL globally
  },
};

export default nextConfig;
