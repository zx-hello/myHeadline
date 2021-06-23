// 封装和首页有关的接口API
import request from '@/utils/request'

// 获取用户频道列表数据的API
export const getUserChannelsApi = function () {
  return request.get('/v1_0/user/channels')
}

// 根据频道ID和时间戳请求文章列表数据的API
// id:是频道的ID  time:是时间戳 第一页是时间戳Date.now(),后面的页都是上次请求拿到的pre_timestamp
export const getArtListApi = function (id, time) {
  return request.get('/v1_0/articles', {
    // params指向的才是get请求方式的参数对象
    params: {
      channel_id: id, // 频道的ID
      timestamp: time // 时间戳
    }
  })
}

// 将文章设置为不感兴趣的接口
// id 为文章的id
export const dislikeArticleApi = function (id) {
  return request.post('/v1_0/article/dislikes', {
    target: id
  })
}

// 反馈文章垃圾内容的API接口 举报文章
export const reportArticleApi = function (target, type) {
  return request.post('/v1_0/article/reports', {
    target, // 要举报的文章的 Id
    type // 要举报的类型
  })
}

// 获取全部频道列表数据的接口API
export const getAllChannelApi = function () {
  return request.get('/v1_0/channels')
}

// 将用户自己新增的数据提交到数据库保存的接口API
// channels 是一个数组，格式： [ {id, seq} ]
// id --> 频道的id    seq --> 频道的序号(从1开始)
export const updateUserChannelApi = function (channels) {
  return request.put('/v1_0/user/channels', { channels })
}
