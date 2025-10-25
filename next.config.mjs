/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
  },
  webpack: (config) => {
    // Exclude SVGs from Next's default asset handling so SVGR can take over
    config.module.rules = config.module.rules.map((rule) => {
      // Top-level rule
      if (
        rule &&
        rule.test &&
        typeof rule.test.test === "function" &&
        rule.test.test(".svg")
      ) {
        return { ...rule, exclude: [/\.svg$/i, ...(rule.exclude || [])] };
      }
      // Rules inside oneOf
      if (rule && rule.oneOf) {
        rule.oneOf = rule.oneOf.map((one) => {
          if (
            one &&
            one.test &&
            typeof one.test.test === "function" &&
            one.test.test(".svg")
          ) {
            return { ...one, exclude: [/\.svg$/i, ...(one.exclude || [])] };
          }
          return one;
        });
      }
      return rule;
    });

    // Allow importing SVGs as React components and make them color-inherit
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            titleProp: true,
            svgProps: { fill: "currentColor", stroke: "currentColor" },
            svgo: true,
            svgoConfig: {
              plugins: [
                { name: "removeViewBox", active: false },
                {
                  name: "removeAttrs",
                  params: { attrs: "(fill|stroke)" },
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
