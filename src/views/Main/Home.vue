<template>
  <div class="home_container">
    <!-- 头部区域 插槽 -->
    <van-nav-bar fixed>
      <!-- 左侧的插槽 -->
      <template #left>
        <img src="../../assets/toutiao_logo.png" class="logo" alt="logo" />
      </template>
      <!-- 右侧的插槽 -->
      <template #right>
        <!-- 修改颜色样式在cover.less  -->
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <!-- 导航 列表选择区域 -->
    <!-- v-model="active" 绑定当前激活标签对应的索引值，默认情况下启用第一个标签  -->
    <van-tabs v-model="active" sticky offset-top="1.22667rem">
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        {{ item.name }} --- {{ item.id }}
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
// 导入接口
import { getUserChannelsApi } from '../../api/homeApi'
export default {
  name: 'Home',
  data () {
    return {
      // 标签页的激活项
      active: 0,
      // 用户的频道列表数据
      channels: []
    }
  },
  created () {
    this.initUserChannels()
  },
  methods: {
    // 初始化用户频道列表的数据
    async initUserChannels () {
      // { data: res }解构出data且重命名为res
      const { data: res } = await getUserChannelsApi()
      console.log(res)
      if (res.message === 'OK') {
        // 若数据获取成功 将数据存储到data中,供渲染模板使用
        this.channels = res.data.channels
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  padding-top: 46px;
  padding-bottom: 50px;
}
.logo {
  height: 80%;
}
</style>
