// 导入node中path模块去处理路径
const path = require('path')
// __dirname表示当前文件的绝对路径
const coverPath = path.join(__dirname, './src/cover.less')

module.exports = {
  /* 覆盖webpack的配置 */
  devServer: { // 自定义服务配置
    open: true,
    port: 8080
  },
  // true值的话 若有格式问题 只会给出警告，不会出现造成webpack打包失败
  lintOnSave: false, // 关闭eslint检查

  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        modifyVars: {
          // 直接覆盖变量, 可以直接改主体，但是每次都需要重新启动服务(不推荐)
          // 'nav-bar-background-color': 'tomato',
          // 或者可以通过 less 文件覆盖（文件路径为"绝对路径"）
          hack: `true; @import "${coverPath}";`
        }
      }
    }
  }

}
