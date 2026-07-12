import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin (and its native/gRPC-backed dependencies) must be loaded as
  // a real Node module at runtime, not bundled by the server compiler.
  // jose + jwks-rsa are called out explicitly too, since they were the exact
  // modules in the ERR_REQUIRE_ESM failure chain and must never be bundled.
  serverExternalPackages: ["firebase-admin", "jose", "jwks-rsa"],
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB request-body cap. Image uploads run
      // through the uploadImage Server Action and can be up to 5MB, so raise
      // the limit — otherwise larger photos are rejected before our code runs
      // and the UI just shows a generic "something went wrong".
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
