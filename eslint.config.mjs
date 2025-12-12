import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Next.js & TS preset
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom rules override
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off", // ⛔️ Disable img warning
      "@typescript-eslint/no-explicit-any": "off", // (optional) if you're using `any`
      "@typescript-eslint/no-unused-vars": "off", // (optional) if you're using `any`
      "@typescript-eslint/react-hooks/rules-of-hooks": "off", // (optional) if you're using `any`
      "@typescript-eslint/no-unused-expressions": "off", // (optional) if you're using `any` 
    },
  },
];
