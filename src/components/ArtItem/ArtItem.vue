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
          <van-icon name="cross" />
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'ArtItem',
  props: {
    // 文章的信息对象
    article: {
      type: Object, // 数据类型
      required: true // 必填项
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
</style>
