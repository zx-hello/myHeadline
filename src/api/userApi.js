// 用户相关的API接口
import request from '../utils/request'

// 登录的API接口
// obj参数的格式 {mobile , code}
export const loginApi = function (obj) {
  return request.post('/v1_0/authorizations', obj)
}
