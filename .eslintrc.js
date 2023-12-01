module.exports = {
    env: {
        node: true,
        es2022: true,
    },
    parserOptions: {
        ecmaVersion: 2022,
    },
    rules: {
        "no-undef": "error",
        indent: ["error", 4, { SwitchCase: 1 }],
        "no-tabs": "off",
        semi: "off",
        quotes: ["error", "double"],
        "no-unused-vars": "error"
    }
}
