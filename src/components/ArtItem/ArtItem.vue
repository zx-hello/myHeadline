<template>
  <div>
    <!-- 文章信息展示 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>文章的标题噢</span>
          <!-- 单张图片 -->
          <img
            v-lazy="article.cover.images[0]"
            alt=""
            class="thumb"
            v-if="article.cover.type === 1"
          />
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="article.cover.type === 3">
          <img
            v-lazy="item"
            alt=""
            class="thumb"
            v-for="(item, i) in article.cover.images"
            :key="i"
          />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span>
            {{ article.aut_name }}
            &nbsp;&nbsp;
            {{ article.comm_count }}评论 &nbsp;&nbsp;
            <!-- | ===> (管道符) -->
            {{ article.pubdate | dateFormat }}
          </span>
          <!-- 关闭按钮 -->
          <van-icon v-if="closable" name="cross" @click="show = !show" />
        </div>
      </template>
    </van-cell>

    <!-- 第一个层级 3个选项 -->
    <!-- get-container="body"这个属性是将这两个面板移除出van-pull-refresh组件内 -->
    <!-- 这样在这个面板内就不会出现还可以实现下拉刷新的bug了 -->
    <van-action-sheet get-container="body" v-model="show" cancel-text="取消">
      <!-- 第一级反馈面板 -->
      <div>
        <van-cell
          v-for="(item, i) in actions"
          :key="i"
          :title="item.name"
          clickable
          class="center-title"
          @click="onAction1Click(item)"
        />
      </div>
    </van-action-sheet>
    <!-- 第二个层级 9个选项 -->
    <van-action-sheet
      get-container="body"
      @cancel="onAction2Cancel"
      v-model="show2"
      cancel-text="返回"
    >
      <!-- 第二级反馈面板 -->
      <van-cell
        v-for="(item, i) in reports"
        :key="i"
        :title="item.label"
        clickable
        class="center-title"
        @click="reportArticle(item.type)"
      />
    </van-action-sheet>
  </div>
</template>

<script>
// 导入可选项 第二层级面板的数据
// 因为模板结构中只可以访问到data、props、computed中的数据，这里放到data中
import reports from '@/api/reports'
// 导入API接口
import { dislikeArticleApi, reportArticleApi } from '@/api/homeApi'
export default {
  name: 'ArtItem',
  props: {
    // 文章的信息对象
    article: {
      type: Object, // 数据类型
      required: true // 必填项
    },
    // 控制是否展示❌的小图标
    closable: {
      type: Boolean,
      // 默认值是 true 显示小图标
      default: true
    }
  },
  data () {
    return {
      // 控制第一个层级的展示于隐藏
      show: false,
      // 第一个面板的可选项列表
      actions: [
        { name: '不感兴趣' },
        { name: '反馈垃圾内容' },
        { name: '拉黑作者' }
      ],
      // 第二个面板的展示于隐藏
      show2: false,
      // 第二个面板的数据 存于api文件中的reports.js文件中
      reports: reports
    }
  },
  methods: {
    // 点击第一个面板的可选项
    async onAction1Click (item) {
      // console.log(item) // 得到name值 根据name值去判断
      if (item.name === '不感兴趣') {
        // 调用不感兴趣的API 且传id
        const { data: res } = await dislikeArticleApi(this.article.art_id)
        if (res.message === 'OK') {
          // console.log('不感兴趣的接口调用成功')
          this.$emit('remove_article', this.article.art_id)
        }
        // 且隐藏第一个面板
        this.show = false
      } else if (item.name === '反馈垃圾内容') {
        // 隐藏第一个面板，展示第二个面板
        this.show = false
        this.show2 = true
      } else if (item.name === '拉黑作者') {
        console.log('因为没有接口，所以假装拉黑了作者')
      }
    },
    // 点击第二个面板的返回，显示第一个面板，隐藏第二个面板
    onAction2Cancel () {
      this.show2 = false
      this.show = true
    },
    // 点击第二个面板里面的每一项
    async reportArticle (type) {
      const { data: res } = await reportArticleApi(this.article.art_id, type)
      if (res.message === 'OK') {
        // console.log('举报文章成功')
        this.$emit('remove_article', this.article.art_id)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.thumb {
  // 矩形黄金比例：0.618
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}

.center-title {
  text-align: center;
}
</style>
