// 用户相关的API接口
import request from '../utils/request'

// 登录的API接口
// obj参数的格式 {mobile , code}
export const loginApi = function (obj) {
  return request.post('/v1_0/authorizations', obj)
}

// 请求用户基本信息的API
export const getUserInfoApi = function () {
  return request.get('/v1_0/user')
}

// 请求用户修改基本信息的接口API
export const getUserProfileApi = function () {
  return request.get('/v1_0/user/profile')
}

// 部分修改简介信息接口API
/**
 * data 接收name或者birthday
 * 格式 {name: 'xxx'} 或{birthday: '2021-01-01'}
 */
export const updateUserProfileApi = function (data) {
  return request.patch('/v1_0/user/profile', data)
}

// 用户修改头像
// fd: 用户提交的头像数据 formData格式
export const updateUserAvatarApi = function (fd) {
  return request.patch('/v1_0/user/photo', fd)
}
