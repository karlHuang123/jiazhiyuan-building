import request from '@/utils/request'

export function reqUserInfo(data) {
  return request({
    url: '/userInfo',
    method: 'post',
    data
  })
}

export function getUsers() {
  return request({
    url: '/admin/user/list',
    method: 'get'
  })
}

export function deleteUser(data) {
  return request({
    url: '/admin/user/del',
    method: 'post',
    data
  })
}

export function editUser(data) {
  return request({
    url: '/admin/user/edit',
    method: 'post',
    data
  })
}

export function reqValidatUserID(data) {
  return request({
    url: '/user/validatUserID',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/admin/user/add',
    method: 'post',
    data
  })
}

export function resetPassword(data) {
  return request({
    url: '/admin/user/reset/pass',
    method: 'post',
    data
  })
}

export function changeState(data) {
  return request({
    url: '/admin/user/modify/state',
    method: 'post',
    data
  })
}

export function getUsersOptions() {
  return request({
    url: '/admin/user/options',
    method: 'get'
  })
}