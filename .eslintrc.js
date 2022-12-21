module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:vue/vue3-recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "no-console": process.env.NODE_ENV === "production" ? ["error", { allow: ["error", "warn"] }] : "off", //生产模式不允许使用log
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off", //生产默认不允许使用debugger
    "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: ".*", args: "none" }], //变量声明未使用
    "@typescript-eslint/no-explicit-any": "off", // 允许ts使用any
  },
};
