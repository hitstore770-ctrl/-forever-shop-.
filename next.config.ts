import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin (and its native/gRPC-backed dependencies) must be loaded as
  // a real Node module at runtime, not bundled by the server compiler.
  // Without this, the admin Server Actions and the image-upload action throw
  // "Failed to load external module firebase-admin" at runtime on Vercel.
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
