import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    ignores: [
      "**/.next/**",
      "**/.wrangler/**",
      "**/.open-next/**",
      "**/cloudflare-env.d.ts",
      "**/next-env.d.ts",
    ],
  },
];

export default eslintConfig;
