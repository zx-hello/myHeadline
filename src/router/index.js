import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入路由
import store from '../store/index'

// 导入登录的组件页面
// import Login from '@/views/Login/Login.vue'
// 路由懒加载 语法
const Login = () => import('@/views/Login/Login.vue')
// 导入主页Main
// import Main from '@/views/Main/Main.vue'
const Main = () => import('@/views/Main/Main.vue')

// 导入子路由组件
// import Home from '@/views/Main/Home.vue'
// import User from '@/views/Main/User.vue'
const Home = () => import('@/views/Main/Home.vue')
const User = () => import('@/views/Main/User.vue')

// 导入搜索的组件
// import Search from '@/views/Search/Search.vue'
const Search = () => import('@/views/Search/Search.vue')

// 导入搜索结果页
// import SearchResult from '@/views/Search/SearchResult.vue'
const SearchResult = () => import('@/views/Search/SearchResult.vue')

// 导入文章详情页
// import ArticleDetail from '../views/ArticleDetail/ArticleDetail.vue'
const ArticleDetail = () => import('../views/ArticleDetail/ArticleDetail.vue')

// 导入用户信息的编辑信息页面
// import UserEdit from '../views/UserEdit/UserEdit.vue'
const UserEdit = () => import('../views/UserEdit/UserEdit.vue')

// 导入小思同学的页面
// import Chat from '../views/Chat/Chat.vue'
const Chat = () => import('../views/Chat/Chat.vue')

// 解决vue-router内部报错的问题 不是程序员写的代码有问题而是包的内部有问题
// 1. 将 VueRouter 本身提供的 $router.push 方法转存到常量中
const originalPush = VueRouter.prototype.push
// 2. 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转；并通过 .catch 捕获错误
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  // 通过 .catch 捕获错误
  return originalPush.call(this, location).catch(err => err)
}

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
        name: 'home',
        // meta里面定义的数据是自定义的
        // 添加meta元信息 记录用户之前所停留的位置
        // isRecord: 是否记录(名字是任意起的)  top: 记录纵向位置
        meta: { isRecord: true, top: 0 }
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
    props: true,
    meta: { isRecord: true, top: 0 }
  },
  // 文章详情页的路由
  {
    path: '/article/:id',
    component: ArticleDetail,
    name: 'art-detail',
    // 开启路由传参
    props: true,
    meta: { isRecord: true, top: 0 }
  },
  // 编s辑用户信息的路由
  {
    path: '/user/edit',
    component: UserEdit,
    name: 'user-edit'
  },
  // 小思同学的路由
  {
    path: '/chat',
    component: Chat,
    name: 'chat'
  }
]

// 创建路由实例对象
const router = new VueRouter({
  routes
})

// 挂载前置导航守卫
router.beforeEach((to, from, next) => {
  /**
   *   判断用户访问的path地址是否为/user或/user/edit
   *   1.若用户需要访问的是这两个地址----> 应该判断是否登录状态
   *   2.判断用户是否登录----> 从vuex中读取token，若有值，证明登录，直接放行
   *    若没有token的值，则证明没有登录，强制用户跳转登录页
   */
  if (to.path === '/user' || to.path === '/user/edit') {
    // 访问有权限的页面
    const tokenStr = store.state.tokenInfo.token
    if (tokenStr) {
      // 证明有token 放行
      next()
    } else {
      // 访问的是有权限的页面 但是无token 强制跳转到登录页面
      // 用户访问有权限的页面，强制跳转到登录，
      // 登陆后，可以跳转到访问前那个页面中去
      next(`/login?pre=${to.fullPath}`)
    }
  } else {
    // 访问的是不需要权限的页面 直接放行
    next()
  }
})

// 全局后置导航钩子
router.afterEach((to, from) => {
  // 若当前的路由的元信息中，isRecord处于开启状态 有元信息
  if (to.meta.isRecord) {
    // 页面的渲染是异步的 让滚动条的赋值变成异步的 这样DOM渲染后才会执行
    // setTimeout(() => {
    //   // 将元信息中的top的值 设置为读取到的滚动条的位置
    //   window.scrollTo(0, to.meta.top)
    // }, 0)
    // 与延时器效果等同的是Vue的官方提供的nextTick
    Vue.nextTick(function () {
      window.scrollTo(0, to.meta.top)
    })
  }
})

export default router
