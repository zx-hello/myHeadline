import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 配置vant组件库
import Vant from 'vant'
// import 'vant/lib/index.css'
// 只有.less 文件才支持主体的定制
import 'vant/lib/index.less'

// rem适配包的导入 动态监听屏幕大小
import 'amfe-flexible'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
