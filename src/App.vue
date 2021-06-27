<template>
  <div>
    <!-- 实现路由切换,缓存之前的组件,而不是直接销毁 -->
    <keep-alive include="Main,SearchResult">
      <!-- 路由的占位符 -->
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less" scoped>
</style>
