import request from '@/utils/request'

export function getDepartmentList() {
  return request({
    url: '/admin/department/list',
    method: 'get'
  })
}

export function addDept(data) {
  return request({
    url: '/admin/department/add',
    method: 'post',
    data
  })
}

export function editDept(data) {
  return request({
    url: '/admin/department/edit',
    method: 'post',
    data
  })
}

export function deleteDept(data) {
  return request({
    url: '/admin/department/del',
    method: 'post',
    data
  })
}