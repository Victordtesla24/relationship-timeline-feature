module.exports = {
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "react/display-name": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-types": "off",
    "react-hooks/exhaustive-deps": "warn",
    "no-var": "warn",
    "@next/next/no-img-element": "off",
    "react/jsx-key": "error",
    "jsx-a11y/alt-text": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "ignorePatterns": [
    "node_modules/",
    ".next/",
    "out/",
    "public/",
    "coverage/"
  ],
  "overrides": [
    {
      "files": ["**/*.test.tsx", "**/*.test.ts", "**/tests/**/*"],
      "rules": {
        "@typescript-eslint/no-empty-function": "off",
        "no-console": "off"
      }
    }
  ]
} 