import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入登录的组件页面
import Login from '@/views/Login/Login.vue'
// 导入主页Main
import Main from '@/views/Main/Main.vue'
// 导入子路由组件
import Home from '@/views/Main/Home.vue'
import User from '@/views/Main/User.vue'
// 导入搜索的组件
import Search from '@/views/Search/Search.vue'
// 导入搜索结果页
import SearchResult from '@/views/Search/SearchResult.vue'
// 导入文章详情页
import ArticleDetail from '../views/ArticleDetail/ArticleDetail.vue'
// 导入用户信息的编辑信息页面
import UserEdit from '../views/UserEdit/UserEdit.vue'
// 导入小思同学的页面
import Chat from '../views/Chat/Chat.vue'

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
  },
  // 搜索页
  {
    path: '/search',
    component: Search,
    name: 'search'
  },
  // 搜索结果页
  {
    // 动态创建路由的路径
    path: '/search/:kw',
    component: SearchResult,
    name: 'search-result',
    // props: true 表示当前路由开启props传参
    // 开启后，就可以在component指向的组件中，通过props来接收路由传来的参数
    props: true
  },
  // 文章详情页的路由
  {
    path: '/article/:id',
    component: ArticleDetail,
    name: 'art-detail',
    // 开启路由传参
    props: true
  },
  // 编s辑用户信息的路由
  {
    path: '/user/edit',
    component: UserEdit,
    name: 'user-edit'
  },
  // 小思同学的路由
  { path: '/chat', component: Chat, name: 'chat' }
]

const router = new VueRouter({
  routes
})

export default router
