import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extending Next.js configurations
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add custom rules
  {
    rules: {
      // Disable specific TypeScript rules globally
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },

  // Add overrides for specific files or directories
  {
    files: ["**/tailwind.config.ts", "**/*.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off", // Allow require() in config files
    },
  },
  {
    files: ["**/components/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Warn instead of error for `any`
      "react-hooks/exhaustive-deps": "off", // Disable hook dependency warnings
    },
  },
];

export default eslintConfig;
