module.exports = {
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["airbnb-base", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "indent": "off",
    "no-await-in-loop": "off",
    "no-restricted-syntax": "off",
    "linebreak-style": [0, "error"],
    "import/prefer-default-export": "off",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }],
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx", ".d.ts"]
      }
    }
  },
}
