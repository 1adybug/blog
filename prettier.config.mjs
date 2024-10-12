/**
 * @type {import("prettier").Options}
 */
const config = {
  semi: false,
  tabWidth: 2,
  arrowParens: "avoid",
  printWidth: 160,
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-lint-md"],
}

export default config
