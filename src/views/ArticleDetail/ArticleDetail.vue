<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ article.title }}</h1>

      <!-- 用户信息 -->
      <van-cell
        center
        :title="article.aut_name"
        :label="article.pubdate | dateFormat"
      >
        <template #icon>
          <!-- 头像 -->
          <img :src="article.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <!-- 是否关注了作者 -->
            <van-button
              @click="unfolloweUser"
              v-if="article.is_followed"
              type="info"
              size="mini"
              >已关注
            </van-button>
            <van-button
              @click="followUser"
              v-else
              icon="plus"
              type="info"
              size="mini"
              plain
              >关注
            </van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="article.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          @click="dislikeArticle"
          v-if="article.attitude === 1"
          icon="good-job"
          type="danger"
          size="small"
          >已点赞
        </van-button>
        <van-button
          @click="likearticle"
          v-else
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          >点赞
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
// 获取文章的接口
import { getArticleInfo, followUserApi, unFollowUserApi, likeArticleApi, dislikeArticleApi } from '../../api/articleApi'
// 提示的信息
import { Toast } from 'vant'
export default {
  name: 'Article-Detail',
  // 接收路由router/index.js内传来的参数
  props: ['id'],
  data () {
    return {
      // 文章的详细对象
      article: {}
    }
  },
  created () {
    this.initArticleInfo()
  },
  methods: {
    // 获取文章信息的请求
    async initArticleInfo () {
      const { data: res } = await getArticleInfo(this.id)
      // console.log(res)
      if (res.message === 'OK') {
        this.article = res.data
      }
    },
    // 关注作者
    async followUser () {
      const { data: res } = await followUserApi(this.article.aut_id)
      if (res.message === 'OK') {
        Toast.success('关注成功')
        // 手动将关的is_followed改为true 证明已经关注过了
        // 方法二可以再次请求服务器，但是这样会增加请求次数
        this.article.is_followed = true
      }
    },
    // 取消关注作者
    async unfolloweUser () {
      // 这一次不支持使用解构，因为服务器没有返回的响应体
      const res = await unFollowUserApi()
      // console.log(res)
      // 所以使用返回的响应值
      if (res.status === 204) {
        Toast.success('取关成功！')
        this.article.is_followed = false
      }
    },
    // 点赞文章
    async likearticle () {
      const { data: res } = await likeArticleApi(this.article.art_id)
      // console.log(res)
      if (res.message === 'OK') {
        Toast.success('成功👍！')
        // 修改文章点赞状态
        this.article.attitude = 1
      }
    },
    // 取消点赞文章
    async dislikeArticle () {
      // 这里不需要解构，因为没有响应体
      const res = await dislikeArticleApi(this.article.art_id)
      if (res.status === 204) {
        Toast.success('取消👍！')
        this.article.attitude = -1
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
