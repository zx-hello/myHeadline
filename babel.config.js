const prodPlugin = []
// 若条件成立 证明是发布模式 (根据条件去动态添加移除console的语句)
if (process.env.NODE_ENV === 'production') {
  // 向数组中添加一个发布阶段需要的插件
  prodPlugin.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  // 实现路由组件按需导入的 babel 插件 可以把路由懒加载的语法进行转换
  // 防止兼容问题
  plugins: ['@babel/plugin-syntax-dynamic-import', ...prodPlugin]
}
