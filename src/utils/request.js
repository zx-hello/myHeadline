import axios from 'axios'
// 当组件当作API方法去使用，全局的引入就不起作用了，就需要单独引入
// 当作标签去使用，就不需要再额外的导入了
import { Toast } from 'vant'
import store from '@/store/index'

const request = axios.create({
  baseURL: 'http://www.liulongbin.top:8000'
})

// 拦截器的挂载，一定要放到request实例创建后
// 由于我们在项目中是基于request实例对象发起的请求，因此，拦截器一定要挂载给request，而不是axios

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    // 展示loading的效果
    Toast.loading({
      // 加载中是显示的文本内容
      message: '正在加载中...',
      // 展示的时长(ms)，值为0时，toast不会消失，默认值2000
      duration: 0
      // forbidClick: true // 禁止背景的点击(会严重影响用户体验)
    })
    // 添加token认证
    // 1. 获取 token 值
    const tokenStr = store.state.tokenInfo.token
    // 2. 判断 tokenStr 的值是否为空
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
  error => {
    Toast.clear()
    return Promise.reject(error)
  }
)

export default request
