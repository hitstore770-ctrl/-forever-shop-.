import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin (and its native/gRPC-backed dependencies) must be loaded as
  // a real Node module at runtime, not bundled by the server compiler.
  // jose + jwks-rsa are called out explicitly too, since they were the exact
  // modules in the ERR_REQUIRE_ESM failure chain and must never be bundled.
  // Without this, the admin Server Actions and the image-upload action throw
  // "Failed to load external module firebase-admin" at runtime on Vercel.
  serverExternalPackages: ["firebase-admin", "jose", "jwks-rsa"],
};

export default nextConfig;
