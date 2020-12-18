module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    plugins: [
        "@typescript-eslint",
        "prettier",
        "sort-imports-es6-autofix"
    ],
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "react": {
            "version": "detect",
        },
        "import/resolver": {
            typescript: {},
        },
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
    ],
    rules: {
        "react/jsx-filename-extension": [
            "error",
            { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        ],
        "sort-imports-es6-autofix/sort-imports-es6": ["error", {
            "ignoreCase": false,
            "ignoreMemberSort": false,
            "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
        }],
        "quotes": ["error", "double"],
        "sort-imports": ["off"],
        "linebreak-style": ["error", "windows"],
        "react/jsx-wrap-multilines": ["off"],
        "react/prop-types": ["off"],
        "@typescript-eslint/explicit-module-boundary-types": ["off"],
        "@typescript-eslint/no-explicit-any": ["off"],
        "no-case-declarations": ["off"],        
    },
};
