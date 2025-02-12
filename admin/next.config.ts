import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/medicalManagement",
        permanent: true, // ใช้ true ถ้าต้องการ redirect แบบถาวร
      },
    ];
  },
};

export default nextConfig;
