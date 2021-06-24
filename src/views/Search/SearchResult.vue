<template>
  <div class="search-result-container">
    <!-- 点击实现后退效果 -->
    <van-nav-bar
      title="搜索结果"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多数据了"
      @load="onLoad"
      :immediate-check="false"
    >
      <!-- 循环渲染文章的Item组件 -->
      <!-- artItem在封装的时候，可以封装出一个自定义属性closable，用来指定是否展示 ❌(叉号) 的小图标 -->
      <!-- true表示显示❌ -->
      <!-- false表示不展示❌ -->
      <ArtItem
        v-for="item in artList"
        :key="item.art_id"
        :article="item"
        :closable="false"
      ></ArtItem>
    </van-list>
  </div>
</template>

<script>
// 导入接口API
import { getSearchResultApi } from '@/api/searchApi'
// 导入文章Item项组件 实现复用
import ArtItem from '@/components/ArtItem/ArtItem.vue'
export default {
  name: 'SearchResult',
  // 通过在路由index.js文件中,开启了props，传过来的参数
  props: ['kw'],
  components: {
    ArtItem
  },
  data () {
    return {
      // 页码数，默认请求第一页
      page: 1,
      // 请求的结果数组 文章的列表数据
      artList: [],
      // 是否正在进行上拉加载数据
      loading: false,
      // 是否所有的数据都加载完成
      finished: false
    }
  },
  created () {
    this.initSearchResult()
  },
  methods: {
    // 发送请求，
    async initSearchResult () {
      const { data: res } = await getSearchResultApi(this.kw, this.page)
      // console.log(res)
      if (res.message === 'OK') {
        // 拼接数据 [旧数据，新数据]
        this.artList = [...this.artList, ...res.data.results]
        // loading设置为false 这样才可以进行下一次的下拉加载
        this.loading = false
        // 当已经加载全部数据的时候
        if (res.data.results.length === 0) {
          this.finished = true
        }
      }
    },
    // 上拉加载更多页
    onLoad () {
      // 每请求一次，就让页码+1
      this.page += 1
      // 调用方法，发送请求
      this.initSearchResult()
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
