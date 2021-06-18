// 是eslint的配置文件
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  // 自定义的语法规则
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // "space-before-function-paren": ["error", "always"],// 方法的形参之前必须保留一个空格
    // "space-before-function-paren": ["error", "never"],// 则不允许在方法的形参之前保留任何空格
  }
}
