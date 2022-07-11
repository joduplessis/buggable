module.exports = {
    parser: 'babel-eslint',
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
            modules: true,
            arrowFunctions: true,
            classes: true,
            spread: true,
        },
    },
    rules: {
        'semi': 0,
        'no-var': 1,
        'prettier/prettier': 'error',
    },
}
