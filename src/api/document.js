import request from '@/utils/request'

export function getDocumentList(params) { // 获取模版列表列表
    return request({
      url: '/admin/archive/list',
      method: 'get',
      params
    })
  }

export function addTemplate(data) { // 获取模版列表列表
    return request({
        url: '/admin/report/template/add',
        method: 'post',
        data
    })
}

export function getDocumentOptions() { // 获取文件类型
  return request({
    url: '/admin/archive/type/options',
    method: 'get'
  })
}

export function addDocument(data) { // 添加文件
  return request({
      url: '/admin/archive/add',
      method: 'post',
      data
  })
}

export function editDocument(data) { // 添加文件
  return request({
      url: '/admin/archive/edit',
      method: 'post',
      data
  })
}

export function deleteDocument(data) {
  return request({
    url: '/admin/archive/batch/del',
    method: 'post',
    data
  })
}