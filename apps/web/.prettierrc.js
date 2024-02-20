const basePrettierConfig = require("@repo/prettier-config")

module.exports = {
  ...basePrettierConfig,
  plugins: ["prettier-plugin-tailwindcss"],
};
