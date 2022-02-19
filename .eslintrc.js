module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'plugin:react/recommended',
        'prettier',
        'plugin:@typescript-eslint/recommended', // TypeScript rules
        'plugin:react/recommended', // React rules
        'plugin:react-hooks/recommended', // React hooks rules
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended' // Accessibility rules
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        '@typescript-eslint/no-unused-vars': ['error'],
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/jsx-fragments': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'react/jsx-props-no-spreading': 'off',
        '@typescript-eslint/explicit-function-return-type': [
            'warn',
            {
                allowExpressions: true,
                allowConciseArrowFunctionExpressionsStartingWithVoid: true
            }
        ],
        'react/jsx-filename-extension': [
            1,
            { extensions: ['.ts', '.tsx', 'js', 'jsx'] }
        ]
    },
    settings: {
        react: {
            version: 'latest'
        }
    }
};
