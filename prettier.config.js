/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: "avoid",
  printWidth: 100,
  semi: false,
  singleQuote: true,
  trailingComma: "es5",
  plugins: [
    require("prettier-plugin-tailwindcss"),
    require("tailwindcss-react-aria-components"),
  ],
};
