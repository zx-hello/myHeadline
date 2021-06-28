import Vue from 'vue'
import Vuex from 'vuex'
// 导入API接口 用户基本信息 用户编辑信息
import { getUserInfoApi, getUserProfileApi } from '@/api/userApi'
// 导入插件 自动保存数据到本地!!!!!!
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
/**
 * 人资后台管理项目，会大量使用vuex中的模块
 * 此项目，就不拆分模块啦
 */

/**
 * 为保证vuex中得state和localStroage中存储得数据保持同步
 * 只要调用了任何一个Mutation方法
 * 都应该调用localStroage.setItem()方法，将最新的数据源持久化存储到本地
 */

// // 初始化: 初始的不含任何数据的state对象
// let initState = {
//   // 若后面还有需要新增的全局共享的数据时，只要挂到这里即可
//   // 内包含 { token, refresh_token } 两个属性
//   tokenInfo: {},
//   // 用户的基本信息
//   userInfo: {},
//   // 用户编辑信息
//   userProfile: {}
// }

// // 读取localStorage中的数据
// const stateStr = localStorage.getItem('state')
// // 判断stateStr值的存在与否 是否为null 为null就为initState初始值为准
// if (stateStr) {
//   initState = JSON.parse(stateStr)
// }

export default new Vuex.Store({

  plugins: [createPersistedState()],
  // 给state赋初始值 1.有值就是存储的数据 2.无值就是初始化的空值
  state: {
    tokenInfo: {},
    userInfo: {},
    userProfile: {}
  },
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
      // 将数据存储到本地 此处是程序员手动自己保存数据
      // 但是我们使用插件(vuex-persistedstate)去自动保存
      // localStorage.setItem('state', JSON.stringify(state))
    },
    // 用户的信息 user.vue页面
    updateUserInfo (state, payload) {
      // 将actions中发送请求过来的数据存储到userInfo对象中
      state.userInfo = payload
      // 将得到的用户信息，进行本地存储
      // localStorage.setItem('state', JSON.stringify(state))
    },
    // 更新用户信息的操作
    updateUserProfile (state, payload) {
      state.userProfile = payload
      // localStorage.setItem('state', JSON.stringify(state))
    },
    // 清空本地的用户基本信息
    cleanState (state) {
      // 清空vuex中的数据
      state.tokenInfo = {}
      state.userInfo = {}
      state.userProfile = {}
      // 将清空的数据存储到本地
      // localStorage.setItem('state', JSON.stringify(state))
    }
  },
  // 异步的请求写在actions中
  actions: {
    // 初始化用户的基本信息
    async initUserInfo (ctx) {
      const { data: res } = await getUserInfoApi()
      // console.log(res)
      // 将数据存储到mutations中
      if (res.message === 'OK') {
        ctx.commit('updateUserInfo', res.data)
      }
    },
    // 初始化编辑用户的基本信息的请求
    async initUserProfile (ctx) {
      const { data: res } = await getUserProfileApi()
      if (res.message === 'OK') {
        // console.log(res)
        ctx.commit('updateUserProfile', res.data)
      }
    }
  },
  // getters本质是个计算属性
  getters: {
    // 在机器人聊天界面，渲染出用户的头像
    avatar (state) {
      // 若用户有头像，就使用用户自己的头像，若没有，就使用默认的头像
      return state.userInfo.photo || 'https://img.yzcdn.cn/vant/cat.jpeg'
    }
  },
  modules: {
  }
})
