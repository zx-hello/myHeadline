import axios from 'axios'
// 当组件当作API方法去使用，全局的引入就不起作用了，就需要单独引入
// 当作标签去使用，就不需要再额外的导入了
import { Toast } from 'vant'
// vuex模块 在js文件中直接导入文件模块，就可以获取到store的数据
import store from '@/store/index'
// console.log(store)

// 导入路由模块
import router from '../router/index'

const request = axios.create({
  baseURL: 'http://www.liulongbin.top:8000'
})

// 拦截器的挂载，一定要放到request实例创建后
// 由于我们在项目中是基于request实例对象发起的请求，因此，拦截器一定要挂载给request，而不是axios

// 请求拦截器
request.interceptors.request.use(
  // config是每次请求时候的配置选项
  function (config) {
    // 展示loading的效果
    Toast.loading({
      // 加载中是显示的文本内容
      message: '正在加载中...',
      // 展示的时长(ms)，值为0时，toast不会消失，默认值2000
      duration: 0
      // forbidClick: true // 禁止背景的点击(会严重影响用户体验)
    })
    // 添加token认证 从vuex中获取token值
    // 1. 获取 token 值
    const tokenStr = store.state.tokenInfo.token
    // 2. 判断 tokenStr 的值
    // 只有token值存在，才有必要挂载到请求头的Authorization属性中
    if (tokenStr) {
      // 3. 添加身份认证字段
      config.headers.Authorization = `Bearer ${tokenStr}`
    }
    return config
  },
  function (error) {
    // 对于请求错误做些什么
    // 隐藏loading效果
    Toast.clear()
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 隐藏loading效果
    Toast.clear()
    return response
  },
  async error => {
    Toast.clear()
    /**
     * 方案一： 只是判断了token  并没有判断refresh_token
     *       // 判断失败的status是否为401
     *       // 401---->token过期--->导致有权限的接口调用失败
     *       // console.dir(error) // error-->response-->status===401 证明token过期
     *       if (error.response.status === 401) {
     *       // 证明token过期了1.强制跳转到登录页面
     *       router.replace(`/login?pre=${router.currentRoute.fullPath}`)
     *       // 2.清空vuex和localStorage中的数据
     *       store.commit('cleanState')
     * }
     */

    // 方案二
    // 从vuex中获取refresh_token的值
    // 判断响应状态码是否为401
    const refreshToken = store.state.tokenInfo.refresh_token
    // 1.若有值，且状态码=401---> 执行换取token
    if (error.response.status === 401 && refreshToken) {
      // 使用try + catch去抓取错误
      try {
        // ----------这里表示只有token过期
        // 换取token-->发送请求
        // !!!!!注意 不能在这里直接使用request对象，去直接发送请求
        // 使用axios发送请求 因为request挂在了请求拦截器
        //     --> 其内部已经有了请求头了，其请求头是token
        // 但是我们换token需要的是refresh_token 但是axios没有拦截器 所以使用axios
        const { data: res } = await axios({
          method: 'PUT',
          // 此处的url必须是完整的url地址 因为没有提前配置过全局的路径
          url: 'http://www.liulongbin.top:8000/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        })
        // 拿到了换取的有效的token值
        console.log(res)
        // 1.将新token替换了旧的token
        store.commit('updateTokenInfo', { token: res.data.token, refresh_token: refreshToken })
        // 2.替换成功后，继续用户的操作
        // 请求的method url
        // console.dir(error) // error.config 内部包含了用户上一次失败请求时的地址等一切信息
        return request(error.config)
      } catch {
        // ---------catch中代表token和refresh_token都过期了
        // 清空本地存储的所有信息
        store.commit('cleanState')
        // 强制用户跳转到登录页
        router.replace(`/login?pre=${router.currentRoute.fullPath}`)
      }
    }
    return Promise.reject(error)
  }
)

export default request
