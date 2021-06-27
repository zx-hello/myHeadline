<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="人工智障"
    ></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(item, i) in list" :key="i">
        <!-- 左侧是机器人 -->
        <div class="chat-item left" v-if="item.name === 'xs'">
          <van-image
            fit="cover"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="chat-pao">{{ item.msg }}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{ item.msg }}</div>
          <van-image fit="cover" round :src="avatar" />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word" placeholder="说点什么...">
        <template #button>
          <span @click="send()" style="font-size: 12px; color: #999">
            提交
          </span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
// 映射vuex中的方法
import { mapGetters } from 'vuex'
// 按需导入 io 方法：调用 io('url') 方法，即可创建 websocket 连接的实例
import { io } from 'socket.io-client'
// 用于接收io()方法创建的socket实例
let socket = null
export default {
  name: 'Chat',
  data () {
    return {
      // 用户输入的聊天内容
      word: '',
      // 所有的聊天消息【机器人和用户的消息都存放于此】
      // 1. 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
      list: []
    }
  },
  // 刚进入到人工智障的页面就可以创建连接了
  created () {
    // 创建客户端webSocket实例
    socket = io('ws://www.liulongbin.top:9999')
    // 建立连接
    socket.on('connect', () => console.log('connect: websocket 连接成功！'))
    // 关闭连接的事件
    socket.on('disconnect', () => console.log('disconnect: websocket 连接关闭！'))
    // 接收到消息
    // msg就是服务器给客户端发送的消息
    // 服务器 ----> 客户端
    socket.on('message', msg => {
      // console.log(msg)
      // 将接收到的消息存储到list数组中
      this.list.push({ name: 'xs', msg })
    })
  },
  watch: {
    // 监听list数组的变化
    list () {
      // 监听到list数据变化后,等DOM更新完毕,再执行滚动到底部的操作
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  computed: {
    // 渲染用户的头像
    ...mapGetters(['avatar'])
  },
  methods: {
    // 提交按钮的点击事件处理函数
    send () {
      // 如果输入的聊天内容为空，则 return 出去
      if (!this.word) return

      // 客户端----> 服务器发送的消息
      // 向服务器发送消息
      socket.emit('send', this.word)

      // 将用户发送的消息追加到数组中
      this.list.push({ name: 'me', msg: this.word })
      // 用户发送成功后,清空输入框
      this.word = ''
    },
    // 自动滚动到页面底端
    scrollToBottom () {
      // 获取到所有的聊天的Item项
      const chatItem = document.querySelectorAll('.chat-item')
      // 获取到最后一项对应的DOM元素
      const lastItem = chatItem[chatItem.length - 1]
      // scrollIntoView() Web API 接口
      // 子元素自己调用scrollIntoView()方法
      lastItem.scrollIntoView({
        // smooth表示平滑的滚动
        behavior: 'smooth',
        // 定义垂直方向的对其 (end表示元素的底端将和其所在的滚动区的可视区域的底端对齐)
        block: 'end'
      })
    }
  },
  beforeDestroy () {
    // 关闭连接
    socket.close()
    // 销毁webSocket实例对象
    socket = null
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
