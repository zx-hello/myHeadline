<template>
  <div>
    <!-- 实现Home和User组件的缓存
        但是也存在一定的问题 User.vue组件也会被缓存
        导致用户修改头像后 并没有立即更新的问题
        解决方法：在activated和deactivated 生命周期函数中
                  监听组件的激活和缓存状态
    -->
    <keep-alive>
      <!-- Home 和 User 的子路由占位符 -->
      <router-view></router-view>
    </keep-alive>
    <!-- 底部的 TabBar -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Main'
}
</script>

<style lang="less" scoped></style>
