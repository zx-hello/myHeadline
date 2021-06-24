<template>
  <div>
    <!-- Header 头部区域 -->
    <div class="search-header">
      <!-- 后退图标 -->
      <van-icon
        @click="$router.back()"
        name="arrow-left"
        color="orange"
        size="18"
        class="goback"
      />
      <!-- 搜索组件 -->
      <!-- @input="onInput" 监听input输入框的输入事件 -->
      <van-search
        v-model.trim="kw"
        placeholder="请输入搜索关键词"
        background="#07c160"
        shape="round"
        @input="onInput"
      />
    </div>

    <!-- 搜索建议 -->
    <div v-if="kw.length != 0" class="sugg-list">
      <!-- 在这里数据不可以使用插值表达式 因为插值表达式没有办法识别标签，使用v-html可以识别标签和样式 -->
      <div
        v-html="item"
        class="sugg-item"
        v-for="(item, i) in suggList"
        :key="i"
        @click="gotoSearchResult"
      ></div>
    </div>

    <!-- 搜索历史 -->
    <div v-else class="search-history">
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon @click="history = []" name="delete" class="search-icon" />
        </template>
      </van-cell>
      <!-- 历史列表 -->
      <div class="history-list">
        <span
          @click="gotoSearchResult"
          class="history-item"
          v-for="(tag, i) in history"
          :key="i"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getSuggListApi } from '../../api/searchApi'
export default {
  name: 'Search',
  data () {
    return {
      // 用户搜索的关键词
      kw: '',
      // 关闭延时器的ID
      timerId: null,
      // 根据搜索建议的列表数据
      suggList: [],
      // 搜索历史
      history: JSON.parse(localStorage.getItem('history')) || []
    }
  },
  // 在组件DOM渲染完成后，就立刻将输入框获取焦点
  // 而且尽量不要直接获取DOM元素，尽量 使用ref去获取DOM元素 但是可以偶尔使用
  // 因为有的时候ref获取DOM元素比较繁琐
  mounted () {
    // 获取DOM元素
    const inp = document.querySelector('input')
    // 获取焦点
    inp.focus()
  },
  watch: {
    // 使用watch去监视history的变化
    // 将搜索历史保存到本地
    history (val) {
      localStorage.setItem('history', JSON.stringify(val))
    }
  },
  methods: {
    // 触发了搜索框的输入事件
    onInput () {
      // 每次触发前，都清除之前的延时器
      clearTimeout(this.timerId)
      // 若输入的关键字为空字符串，则没有必要开启延时器
      if (this.kw.length === 0) {
        // 当输入框内是空时，清空之前所有的渲染的列表
        this.suggList = []
        return
      }
      // 防抖处理
      // 此处不可以使用function，而是使用箭头函数
      // function会有自己的this指向，且会改变，而箭头函数内的this指向不会改变
      this.timerId = setTimeout(() => {
        // console.log(this.kw)
        // 一定是在防抖函数内部调用 请求建议的列表
        this.initSuggList()
      }, 500)
    },
    // 调用接口，发送用户输入的数据，接收数据库返回的搜索建议
    async initSuggList () {
      const { data: res } = await getSuggListApi(this.kw)
      if (res.message === 'OK') {
        // 在此处调用hlightKeywords函数，对options中的每一项进行高亮处理
        this.hlightKeywords(res.data.options)
        this.suggList = res.data.options

        // 将搜索关键词存入到搜索历史中 history 且过滤数组中的每一项，不允许有重复的
        const newHistory = this.history.filter(item => item !== this.kw)
        newHistory.unshift(this.kw)
        this.history = newHistory
      }
    },
    // 对于用户输入的数据(每一项)，进行高亮处理  arr：表示需要进行循环的数组
    hlightKeywords (arr) {
      // 1.创建正则 对于用户的输入进行正则匹配
      const reg = new RegExp(this.kw, 'ig')
      // 2.循环arr中的每一项，进行高亮处理
      arr.forEach((item, i) => {
        // replace方法，第一个参数是正则，第二个参数可以是字符串或函数
        // val是正则进行匹配的每一项
        // 这里的item是字符串 是简单类型 所以不可以写成 item = item.replace 这样修改不了原数组的数据
        arr[i] = item.replace(reg, function (val) {
          return `<span style="color: tomato; font-weight: 700;">${val}</span>`
        })
      })
    },
    // 点击搜索建议或搜索历史，进入搜索页
    gotoSearchResult (e) {
      // e可以拿到点击的元素标签 再通过innerText获取其中的文本信息
      // e.target 和 e.currentTarget 的区别
      // e.target 用户点击的是哪个元素，e.target就指向的是哪个元素
      // e.currentTarget 表示当前【正在触发】事件的那个元素
      this.$router.push(`/search/${e.currentTarget.innerText}`)
    }
  }
}
</script>

<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #07c160;
  overflow: hidden;
  // 后退按钮
  .goback {
    padding-left: 14px;
  }
  // 搜索组件
  .van-search {
    flex: 1;
  }
}

// 搜索建议
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// 搜索历史
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
