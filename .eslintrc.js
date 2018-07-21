module.exports = {
  extends: ["standard", "prettier"],
  env: { jest: true },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "off",
    "spaced-comment": "off"
  }
};
