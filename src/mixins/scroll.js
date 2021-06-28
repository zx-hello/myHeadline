export default {
  activated () {
    // 为window对象 绑定scroll事件监听
    window.addEventListener('scroll', this.scrollHandler)
  },
  deactivated () {
    // 为window对象 移除scroll事件监听
    window.removeEventListener('scroll', this.scrollHandler)
  },
  methods: {
    // 方案二：
    // 滚动条的滚动事件监听处理函数
    scrollHandler () {
      this.$route.meta.top = window.scrollY
    }
  }
}
