import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入登录的组件页面
import Login from '@/views/Login/Login.vue'
// 导入主页
import Main from '@/views/Main/Main.vue'

Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login' // 带有name属性的路由规则，是命名路由
  },
  {
    path: '/',
    component: Main
  }
]

const router = new VueRouter({
  routes
})

export default router
