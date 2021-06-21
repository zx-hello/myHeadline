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
