import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 人资后台管理项目，会大量使用vuex中的模块
// 此项目，就不拆分模块啦

// 为保证vuex中得state和localStroage中存储得数据保持同步
// 只要调用了任何一个Mutation方法
// 都应该调用localStroage.setItem()方法，将最新的数据源持久化存储到本地

// 初始化: 初始的不含任何数据的state对象
let initState = {
  // 若后面还有需要新增的全局共享的数据时，只要挂到这里即可
  // 内包含 { token, refresh_token } 两个属性
  tokenInfo: {}
}

// 读取localStorage中的数据
const stateStr = localStorage.getItem('state')
// 判断stateStr值的存在与否 是否为null 为null就为initState初始值为准
if (stateStr) {
  initState = JSON.parse(stateStr)
}

export default new Vuex.Store({
  // 给state赋初始值 1.有值就是存储的数据 2.无值就是初始化的空值
  state: initState,
  // 用于存储token
  // 对象中会包含两个属性 { token, refresh_token }
  // tokenInfo: {}
  mutations: {
    // 更新 tokenInfo 数据的方法
    // payload的格式为 { token, refresh_token }
    updateTokenInfo (state, payload) {
      // 把提交过来的 payload 对象，作为 tokenInfo 的值
      state.tokenInfo = payload
      // 测试 state 中是否有数据
      // console.log(state)
      // 将数据存储到本地
      localStorage.setItem('state', JSON.stringify(state))
    }
  },
  actions: {
  },
  modules: {
  }
})
