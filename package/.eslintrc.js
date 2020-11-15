module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "standard"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": { //0: off, 1:warn, 2:error
        "semi": "off",
        "no-multiple-empty-lines": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "error",
        "react/prop-types": "off",//since is defined by typescript types
        "indent": "off",
        "quotes": "off",
        "spaced-comment": "off",
        "curly": "off",
        "padded-blocks": "off",
        "operator-linebreak": "off",
        "@typescript-eslint/no-use-before-define": "warn",
        "camelcase": "warn",
        "multiline-ternary": "off"
    },
    "settings": {
        "react": {
            "version": "^16.14.0",
        }
    }
};
