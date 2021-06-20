import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入登录的组件页面
import Login from '@/views/Login/Login.vue'
// 导入主页Main
import Main from '@/views/Main/Main.vue'
// 导入子路由组件
import Home from '@/views/Main/Home.vue'
import User from '@/views/Main/User.vue'

Vue.use(VueRouter)

// 路由规则
const routes = [
  // 登录页
  {
    path: '/login',
    component: Login,
    name: 'login' // 带有name属性的路由规则，是命名路由
  },
  // 主页
  {
    path: '/',
    component: Main,
    // 若通过children加载了默认子路由,则父路由规则不需要加name
    // name: 'main',
    children: [
      // path为''空字符串的路由规则,叫做默认子路由
      {
        path: '',
        component: Home,
        name: 'home'
      },
      // 子路由规则,不建议以/开头
      {
        path: 'user',
        component: User,
        name: 'user'
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
