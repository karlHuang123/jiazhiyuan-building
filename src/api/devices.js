import request from '@/utils/request'

export function getDevicesList(params) {
    return request({
      url: '/admin/device/list',
      method: 'get',
      params
    })
  }

  export function addDevice(data) {
    return request({
      url: '/admin/device/add',
      method: 'post',
      data
    })
  }

  export function editDevice(data) {
    return request({
      url: '/admin/device/edit',
      method: 'post',
      data
    })
  }

  export function deleteDevice(data) {
    return request({
      url: '/admin/device/batch/del',
      method: 'post',
      data
    })
  }

  export function uploadDevices(data) {
    return request({
      url: '/admin/device/import',
      method: 'post',
      data
    })
  }