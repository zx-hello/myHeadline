import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 配置vant组件库
import Vant, { Lazyload } from 'vant'
// import 'vant/lib/index.css'
// 只有.less 文件才支持主体的定制
import 'vant/lib/index.less'

// rem适配包的导入 动态监听屏幕大小
import 'amfe-flexible'

// 导入 dayjs 的核心模块
import dayjs from 'dayjs'
// 导入计算【相对时间】的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入中文语言包
import zh from 'dayjs/locale/zh-cn'

// 配置“计算相对时间”的插件
dayjs.extend(relativeTime)
// 配置中文语言包
dayjs.locale(zh)

// 过滤器：本质上是个函数，第一个形参永远是待处理的数据{{待处理的数据|过滤器}}
// dateFormat(过滤器的名字) 需要写到插值表达式“|”右边的名字
// dt 参数是文章的发表时间
Vue.filter('dateFormat', dt => {
  // 调用 dayjs() 得到的是当前的时间
  // .to() 方法的返回值，是计算出来的“相对时间”
  return dayjs().to(dt)
})

Vue.use(Vant)

// 图片懒加载
// 将lazyload注册为全局自定义指令，注册号以后，所有组件都可以使用
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  // 路由
  router,
  // vuex
  store,
  render: h => h(App)
}).$mount('#app')
