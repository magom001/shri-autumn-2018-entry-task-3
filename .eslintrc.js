module.exports = {
  extends: "airbnb-base",
  env: {
    jest: true
  },
  rules: {
    "func-names": 0,
    "object-shorthand": 0,
    "arrow-parens": 0,
    "implicit-arrow-linebreak": 0,
    "import/prefer-default-export": "off",
    "comma-dangle": ["error", "never"],
    quotes: 0,
    semi: [2, "always"],
    "space-before-function-paren": 0,
    "class-methods-use-this": 0,
    "nonblock-statement-body-position": 0,
    "operator-linebreak": 0,
    "no-continue": 0
  }
};
