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
