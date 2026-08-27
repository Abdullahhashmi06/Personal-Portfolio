import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Exclude @huggingface/transformers from the server bundle.
   * The package is 119 MB and causes Vercel serverless functions to
   * crash at module-load time when statically bundled.
   * It is loaded dynamically at runtime from node_modules instead.
   */
  serverExternalPackages: ["@huggingface/transformers"],
};

export default nextConfig;
