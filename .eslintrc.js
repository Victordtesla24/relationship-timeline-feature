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
    "@typescript-eslint/no-explicit-any": "off",
    "react/display-name": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-non-null-assertion": "off"
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
        "@typescript-eslint/no-empty-function": "off"
      }
    }
  ]
} 