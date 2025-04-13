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
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-types": "off",
    "react-hooks/exhaustive-deps": "off",
    "no-var": "off",
    "@next/next/no-img-element": "off"
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