<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="userInfo.photo" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username">{{ userInfo.name }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userInfo.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userInfo.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ userInfo.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell
        @click="$router.push({ name: 'user-edit' })"
        icon="edit"
        title="编辑资料"
        is-link
      />
      <van-cell icon="chat-o" title="人工智障" is-link />
      <van-cell @click="goback" icon="warning-o" title="退出登录" is-link />
    </van-cell-group>
  </div>
</template>

<script>
// 调用(vuex)store/index.js文件中的actions方法 调用用户的基本信息
import { mapActions, mapState, mapMutations } from 'vuex'
// 使用vant组件中的提示弹窗，局部引入
import { Dialog } from 'vant'
export default {
  name: 'User',
  // 发送请求 请求用户基本的信息
  created () {
    this.initUserInfo()
  },
  // 获取用户信息的数组
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // 存储用户基本信息的操作
    ...mapActions(['initUserInfo']),
    // 清空数据的操作
    ...mapMutations(['cleanState']),
    // 退出登录
    async goback () {
      // 询问是否退出
      const confirmResult = await Dialog.confirm({
        title: '提示',
        message: '确定要退出吗？'
      }).catch((err) => {
        // on cancel 捕获错误
        console.log(err) // 得到的是cancel
        return err
      })
      // 得到的是个promise对象 所有要使用async和await
      // console.log(confirmResult)
      // 加上async和await后得到的是个字符串
      // 判断若用户点击的是取消 不执行任何操作
      if (confirmResult === 'cancel') return console.log('用户点击了取消')
      // 若用户点击的是确定，则清空本地存储的数据
      this.cleanState()
      // 跳转到登录界面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.user-container {
  .user-card {
    background-color: #07c160;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #07c160;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
