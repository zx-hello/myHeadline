// 用于vant组件库的rem布局适配
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // 根节点的 font-size值, rem计算的基准值
      propList: ['*'] // 要处理的属性列表，* 代表所有属性(通配符),
    }
  }
}
