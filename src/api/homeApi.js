// 封装和首页有关的接口API
import request from '@/utils/request'

// 获取用户频道列表数据的API
export const getUserChannelsApi = function () {
  return request.get('/v1_0/user/channels')
}
