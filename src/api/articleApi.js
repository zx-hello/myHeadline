// 文章详情相关的API接口
import request from '../utils/request'

// 获取文章详情的接口
// id:文章的id
export const getArticleInfo = function (id) {
  return request.get(`/v1_0/articles/${id}`)
}

// 为文章关注作者的API接口
// target:文章作者的ID
export const followUserApi = function (target) {
  return request.post('/v1_0/user/followings', { target })
}

// 取消关注作者
// id: 文章作者的ID
export const unFollowUserApi = function (id) {
  return request.delete(`/v1_0/user/followings/${id}`)
}

// 点赞文章
// target 文章的ID
export const likeArticleApi = function (target) {
  return request.post('/v1_0/article/likings', { target })
}

// 取消点赞文章
// id: 文章的id
export const dislikeArticleApi = function (id) {
  return request.delete(`/v1_0/article/likings/${id}`)
}

// 根据文章ID请求文章下评论的接口
export const getCmListApi = function (source, offset) {
  return request.get('/v1_0/comments', {
    params: {
      // a 表示获取文章下的评论
      type: 'a',
      // 文章的ID
      source,
      // 获取文章的数据的偏移量 就是页数
      offset
    }
  })
}

// 点赞评论
// 评论点赞的 API
// target 评论的ID
export const addLikeCmtApi = target => {
  return request.post('/v1_0/comment/likings', { target })
}

// 取消点赞评论
// id评论的ID
export const delLikeCmtApi = id => {
  return request.delete(`/v1_0/comment/likings/${id}`)
}

// 发表评论
// target 是文章的ID   content 是评论的内容
export const publishCommentApi = function (target, content) {
  return request.post('/v1_0/comments', { target, content })
}
