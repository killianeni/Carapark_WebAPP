module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true
  },
  extends: [
    "plugin:vue/strongly-recommended",
    "eslint:recommended"
  ],
  rules: {
    "vue/max-attributes-per-line": ["warn", {
      "singleline": 4,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    "vue/html-self-closing": ["warn", {
      "html": {
        "void": "any",
        "normal": "always",
        "component": "always"
      },
      "svg": "always",
      "math": "always"
    }],
    "no-console": ["off"],
    "quotes": ["error", "single", { "allowTemplateLiterals": true }],
    "guard-for-in": "error",
    "quote-props": ["error", "as-needed"],
    "arrow-parens": ["warn", "as-needed"],
    "no-unneeded-ternary": ["error", { "defaultAssignment": true }],
    "prefer-const": "warn",
    "spaced-comment": "warn",
    "no-param-reassign": ["warn", { "props": false }],

    "getter-return": "off",
    "semi": [1, "always"],
    "consistent-return": "error"
  },
  parserOptions: {
    "ecmaFeatures": {
      "legacyDecorators": true
    },
    parser: "babel-eslint"
  }
};
