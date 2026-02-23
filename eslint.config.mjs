/** Configuration ESLint 9 (flat config) — évite la référence circulaire avec eslint-config-next. */
import nextConfig from "eslint-config-next/core-web-vitals"
import tsConfig from "eslint-config-next/typescript"

/** @type { import("eslint").Linter.FlatConfig[] } */
const config = [
  ...nextConfig,
  ...tsConfig,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      "next-env.d.ts",
      "scripts/**",
    ],
  },
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]

export default config
