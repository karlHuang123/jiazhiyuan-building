import request from '@/utils/request'

export function reqLogin(data) {
  return request({
    url: '/admin/user/login',
    method: 'post',
    data
  })
}

export function reqLogout(data) {
  return request({
    url: '/logout',
    method: 'post',
    data
  })
}