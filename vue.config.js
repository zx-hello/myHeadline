// 导入node中path模块去处理路径
const path = require('path')
// __dirname表示当前文件的绝对路径
const coverPath = path.join(__dirname, './src/cover.less')

// npm run serve ----> development
// npm run build ----> production
// process.env.NODE_ENV 是一个环境变量
// 通过这个变量去判断运行环境
console.log(process.env.NODE_ENV)

const obj = {
  // import 时的包名称: window 全局的成员名称
  'highlight.js': 'hljs',
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  vant: 'vant',
  dayjs: 'dayjs',
  'socket.io-client': 'io',
  popmotion: 'popmotion'
}

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
  },

  // 打包的配置
  publicPath: './',
  // 增强 vue-cli 的 webpack 配置项
  configureWebpack: {
    // 打包优化,将这些包全都排除在打包配置项外面
    // 但是在index.html文件中,自己引入了网络上的这些包的网络在线地址
    externals: process.env.NODE_ENV === 'development' ? {} : obj
  },

  // 通过来修改webpack的配置
  chainWebpack: config => {
    // config.plugin('html') 作用: 拿到html-webpack-plugin插件的当前配置项
    // 通过 .tap() 方法 可以修改插件的配置项
    // 在 .tap(fn) 方法中 接收一个function回调 在这个回调中修改
    // 在 .tap() 的function回调中 args就是当前的配置项
    // 最终修改完后,一定要ruturn修改后的最新的配置项
    config.plugin('html').tap(args => {
      // console.log(args)   // 得到一个数组,内部有title这个属性
      args[0].title = '头条'
      // 根据当前的编译模式动态为mode赋值 mode是一个自己的自定义属性
      // npm run serve ---->mode的值是 development
      // npm run build ---->mode的值是 production
      args[0].mode = process.env.NODE_ENV
      return args
    })
  }
}
