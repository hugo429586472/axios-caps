module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
  },
  env: {
    browser: true,
    node: true
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
  ],
  rules: {
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // no-var
    'no-var': 'error',
    // 强制使用单引号
    'quotes': ['error', 'single'],
    // 禁止不必要的分号
    'no-extra-semi': 'error',
    // 空格2个(ignoreNodes解决eslint 的range报错)
    'indent': ['error', 2, {'SwitchCase': 1, "ignoredNodes": ["TemplateLiteral"]}],
    'linebreak-style': [0 ,'error', 'windows'],
    // 函数括号前需要间隔
    "space-before-function-paren": ["error", "always"],
    // 解决eslint 的range报错
    "template-curly-spacing": ["off"],
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    "init-declarations": ["never"],
    // "init-declarations": ["error", "never"],
    // vue
    'vue/no-v-html': 'off',
    'vue/no-unused-components': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': ['error', {
      html: {
        void: 'never',
        normal: 'never',
        component: 'always',
      },
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1,
    }],
    'vue/require-default-prop': 'off',
    'vue/html-closing-bracket-spacing': 'error',
  },
  // parserOptions: {
  //   parser: 'babel-eslint'
  // },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
}
