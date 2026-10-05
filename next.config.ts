import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optionnel : ignorer aussi les erreurs ESLint au build
    
};

export default nextConfig;
