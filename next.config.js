/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["ik.imagekit.io"],
  },

  // Type-checking and linting run as their own steps (`npm run typecheck`,
  // `npm run lint`) instead of inside every build.
  //
  // They are not skipped — they are moved. `next build` ran a *cold* tsc every
  // time, and this project's type-check is pathologically slow: a compiler
  // trace attributes 463 of its 524 seconds to a single variance computation
  // on `@stitches/react`'s `CSS` type, which `@nextui-org/react@1.0.0-beta.13`
  // puts on every component's props. That made builds ~11 minutes; without
  // this phase they are ~2.5.
  //
  // Run `npm run typecheck` before shipping. It is incremental, so it costs
  // ~11s once warm. Remove these two options if NextUI v1 is ever replaced.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}

module.exports = nextConfig
