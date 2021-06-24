// 搜索组件的接口文件
import request from '../utils/request'

// 根据关键词请求搜索建议的API接口
// q: 指的是用户在输入框内输入的数据
export const getSuggListApi = function (q) {
  return request.get('/v1_0/suggestion', {
    params: { q }
  })
}

// 根据搜索的结果关键词和页码值请求搜索结果
// q:搜索关键字   page: 搜索页码
export const getSearchResultApi = function (q, page) {
  return request.get('/v1_0/search', { params: { q, page } })
}
