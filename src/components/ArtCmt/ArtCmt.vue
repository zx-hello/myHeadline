<template>
  <div>
    <!-- 评论列表 -->
    <van-list
      class="cmt-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多评论了"
      :immediate-check="false"
      @load="onLoad"
    >
      <!-- 评论的 Item 项 -->
      <div v-for="item in cmtList" :key="item.total_count" class="cmt-item">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="item.aut_photo" alt="" class="avatar" />
            <span class="uname">{{ item.aut_name }}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon
              @click="disLikeComment(item)"
              v-if="item.is_liking"
              name="like"
              size="16"
              color="red"
            />
            <van-icon
              @click="likeComment(item)"
              v-else
              name="like-o"
              size="16"
              color="gray"
            />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">
          {{ item.content }}
        </div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{ item.pubdate | dateFormat }}</div>
      </div>
    </van-list>

    <!-- 底部添加评论区域 - 1 -->
    <div v-if="isShowBox1" class="add-cmt-box van-hairline--top">
      <van-icon name="arrow-left" size="18" @click="$router.back()" />
      <div @click="showBox2" class="ipt-cmt-div">发表评论</div>
      <div class="icon-box">
        <van-badge :content="totalCount" :max="99">
          <van-icon @click="gotoCmtList" name="comment-o" size="20" />
        </van-badge>
        <van-icon name="star-o" size="20" />
        <van-icon name="share-o" size="20" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div v-else class="cmt-box van-hairline--top">
      <textarea
        v-model.trim="iptValue"
        ref="iptCmt"
        @blur="hideBox2"
        placeholder="友善评论、理性发言、阳光心灵"
      ></textarea>
      <van-button
        type="default"
        :disabled="iptValue.length === 0"
        @click="onPublish"
        >发布</van-button
      >
    </div>
  </div>
</template>

<script>
// 按需导入API接口
import { getCmListApi, publishCommentApi, addLikeCmtApi, delLikeCmtApi } from '../../api/articleApi'
// 导入popmotion包 实现平滑滚动的功能
import { animate } from 'popmotion'
export default {
  name: 'ArtCmt',
  props: {
    // 父组件 ArticleDetail.vue通过属性绑定，传递过来的文章ID
    // 接收到ArtId后就可以请求文章下的评论数据了
    artId: {
      // 自定义属性，若有多种属性类型，可以通过数组来定义
      type: [Number, String],
      // 必填项
      required: true
    }
  },
  data () {
    return {
      // 偏移量，表示请求第一页的评论数据 默认值是null
      offset: null,
      // 评论的列表数据
      cmtList: [],
      // 总评论的条数
      totalCount: 0,
      // 是否正在请求上拉加载的数据
      loading: true,
      // 所有数据是否加载完毕了
      finished: false,
      // 是否展示评论区域1（如果值为 true 则展示评论区域1；如果值为 false 则展示评论区域2）
      isShowBox1: true,
      // 用户输入评论的内容
      iptValue: ''
    }
  },
  created () {
    this.initCmtList()
  },
  methods: {
    // 初始化文章的评论列表数据
    async initCmtList () {
      const { data: res } = await getCmListApi(this.artId, this.offset)
      // console.log(res)
      if (res.message === 'OK') {
        // 偏移量的赋值
        this.offset = res.data.last_id
        // 评论的列表数据
        this.cmtList = [...this.cmtList, ...res.data.results]
        // 评论的总条数
        this.totalCount = res.data.total_count

        // 将 loading 重置为 false
        this.loading = false

        // 当last_id 等于end_id就说明评论数据已经没有下一页数据了
        if (res.data.last_id === res.data.end_id) {
          // console.log('没有下一页的数据了！')
          this.finished = true
        }
      }
    },
    // 上拉加载
    onLoad () {
      this.initCmtList()
    },
    // 点击展示评论2的盒子 隐藏评论1的盒子
    showBox2 () {
      this.isShowBox1 = false
      // 让textarea获取焦点
      // this.$nextTick把回调函数延迟执行
      // this.$nextTick在DOM更新完成后，才会执行内部的回调函数
      this.$nextTick(() => {
        this.$refs.iptCmt.focus()
      })
    },
    // 展示评论1的盒子 隐藏评论2的盒子
    hideBox2 () {
      // 添加延迟，使得失去焦点的事件在点击事件后，这样就可以立刻获得用户输入的数据
      // 过后焦点才失去，盒子2才会消失
      setTimeout(() => {
        this.isShowBox1 = true
        this.iptValue = ''
      }, 100)
    },
    // 点击发布按钮，发布评论
    async onPublish () {
      // console.log(this.iptValue)
      // 若评论内容为空 不发送请求
      if (this.iptValue.length === 0) return
      const { data: res } = await publishCommentApi(this.artId, this.iptValue)
      // console.log(res)
      if (res.message === 'OK') {
        this.$toast.success('发表评论成功！')
        // 将用户的成功评论添加到评论区的头部(第一条)
        this.cmtList.unshift(res.data.new_obj)
        // 在客户端浏览器让评论的条数显示也立刻增加1
        this.totalCount += 1
        // 清空文本框的内容
        this.iptValue = ''
      }
    },
    // 点击评论的小图标，直接平滑滚到到评论区
    gotoCmtList () {
      // 实现滚动动画
      animate({
        // 滚动条当前的位置
        from: window.scrollY,
        // 目标位置（文章信息区域的高度）
        to: document.querySelector('.article-container').offsetHeight,
        /**
         * 只要值发生变化，就触发onUpdate这个函数
         * 调用window.scrollTo(x, y)来让滚动条滚动到目标位置
         * (x, y)  x 表示横向滚动的距离   y 表示纵向滚动的距离
         */
        onUpdate: latest => window.scrollTo(0, latest)
      })
    },
    // 喜欢(❤ ω ❤)评论
    async likeComment (item) {
      const { data: res } = await addLikeCmtApi(item.com_id)
      // console.log(res)
      if (res.message === 'OK') {
        this.$toast.success('♥成功！')
        item.is_liking = true
      }
    },
    // 取消喜欢评论
    async disLikeComment (item) {
      const res = await delLikeCmtApi(item.com_id)
      // console.log(res)
      if (res.status === 204) {
        this.$toast.success('成功取消(❤ ω ❤)')
        item.is_liking = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

// 底部发表评论的样式
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
