<template>
  <div class="artlist">
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :disabled="finished"
    >
      <!-- <van-list>组件首次加载的时候，会自动触发一次 @load 事件 -->
      <!-- :immediate-check="false" 属性，即可防止首次加载时触发 load 事件 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <ArtItem
          v-for="item in artList"
          :key="item.id"
          :article="item"
          @remove_article="removeArticle"
        ></ArtItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 导入需要的API接口
import { getArtListApi } from '@/api/homeApi.js'
// 导入文章的Item项组件
import ArtItem from '../ArtItem/ArtItem.vue'

export default {
  name: 'Artlist',
  // 为文章列表组件，封装名为channelId的props
  // 表示要加载哪个频道下的文章列表数据
  props: {
    channelId: {
      type: Number,
      required: true
    }
  },
  components: {
    ArtItem
  },
  data () {
    return {
      // 存储文章的列表数据
      artList: [],
      // 时间戳，初始的默认值 调用API接口要传递的时间戳
      timestamp: Date.now(),

      // loading 表示是否正在进行上拉加载的请求
      //   每当触发 List 组件的上拉加载更多时，List 组件会自动把 loading 设为 true
      //   每当下一页的数据请求回来以后，需要程序员手动的把 loading 设为 false，
      //   否则：再次触发上拉加载更多时，不会发起请求！！
      loading: false,

      // finished 表示所有数据是否加载完毕
      //    false 表示还有下一页的数据
      //    true  表示所有数据都已加载完毕
      finished: false,

      // 是否正在进行下拉刷新的请求
      isLoading: false
    }
  },
  created () {
    // 没有传值，就默认是undefined，就是false，所以就不会执行下拉刷新的操作
    this.initArtList()
  },
  methods: {
    // isPullDown 是一个布尔值，若为true:表示用户执行了下拉刷新的动作
    async initArtList (isPullDown) {
      const { data: res } = await getArtListApi(this.channelId, this.timestamp)
      // console.log(res)
      if (res.message === 'OK') {
        // 为时间戳重新赋值
        this.timestamp = res.data.pre_timestamp
        // // 上拉加载更多时，应该是“旧数据”在前，“新数据”在后
        // this.artList = [...this.artList, ...res.data.results]
        // // 重置 loading 为 false，只有loading是false才会继续加载下一页的数据(若有下一页数据的时候)
        // this.loading = false

        // 判断是否为下拉刷新
        if (isPullDown) {
          // 下拉刷新
          //  “新数据”在前，“旧数据”在后
          this.artList = [...res.data.results, ...this.artList]
        } else {
          // 上拉加载更多
          //  “旧数据”在前，“新数据”在后
          this.artList = [...this.artList, ...res.data.results]
        }

        //  重置 isLoading 为 false，否则无法触发下一次下拉刷新效果
        this.isLoading = false
        //  重置 loading 为 false，否则无法发起下一次请求
        this.loading = false

        // 判断所有的数据是否已加载完毕
        if (res.data.pre_timestamp === null) {
          this.finished = true
        }
      }
    },
    // 加载更多的数据
    onLoad () {
      // console.log('触发了上拉加载更多')
      // 在load事件中，调用initArtList方法，加载下一页数据
      this.initArtList()
    },
    // 下拉刷新
    onRefresh () {
      // console.log('触发了下拉刷新')
      this.initArtList(true)
    },
    removeArticle (id) {
      this.artList = this.artList.filter(item => item.art_id !== id)
      // 判断length 这样当用户将一页的数据删除完了，也不会出现页面空白
      // 导致上拉加载不生效的问题
      if (this.artList.length < 10) {
        this.initArtList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
