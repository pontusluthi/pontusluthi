/**
 * pontusluthi.se — the umbrella site.
 *
 * It owns the domain and stitches in independent Next.js "zones" (separate
 * Vercel projects) under path prefixes via rewrites. Each project stays its
 * own repo/deploy. Add a project = deploy its zone, add a rewrite pair here.
 *
 * Set CITY_COMPARATOR_ZONE in the Vercel project env to the city-comparator
 * deployment's production URL (defaults to the conventional vercel.app alias).
 *
 * @type {import('next').NextConfig}
 */
const cityComparator =
  process.env.CITY_COMPARATOR_ZONE ||
  "https://city-comparator-web-pontusluthis-projects.vercel.app";

const nextConfig = {
  async rewrites() {
    return [
      { source: "/city-comparator", destination: `${cityComparator}/city-comparator` },
      {
        source: "/city-comparator/:path*",
        destination: `${cityComparator}/city-comparator/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
