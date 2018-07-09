module.exports = {
  extends: ["standard", "prettier"],
  env: { jest: true },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error"
  }
};
