module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        'plugin:jsx-a11y/recommended'
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        'react/jsx-no-undef': 'error',
        // JSX rules
        'react/jsx-indent': ['error', 2],
        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-no-target-blank': 'error',
        'react/jsx-one-expression-per-line': 'error',
        'react/self-closing-comp': 'error'
    }
}
