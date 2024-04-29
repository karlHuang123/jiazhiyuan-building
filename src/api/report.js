import request from '@/utils/request'

export function getModuleList(params) { // 获取模版列表列表
    return request({
      url: '/admin/report/template/list',
      method: 'get',
      params
    })
  }


export function getTemplateOptionList() { // 获取模版选项列表
    return request({
        url: '/admin/report/template/type/options',
        method: 'get'
    })
}

export function addTemplate(data) { // 获取模版列表列表
    return request({
        url: '/admin/report/template/add',
        method: 'post',
        data
    })
}

export function editTemplate(data) { // 获取模版列表列表
    return request({
        url: '/admin/report/template/edit',
        method: 'post',
        data
    })
}

export function deleteTemplate(data) { // 删除模版列表列表
    return request({
        url: '/admin/report/template/batch/del',
        method: 'post',
        data
    })
}

export function getTemplateDetails(params) { // 获取模版列表列表
    return request({
      url: '/admin/report/template/config/info',
      method: 'get',
      params
    })
}

export function edieTemplateStyle(data) {
    return request({
        url: '/admin/report/template/config/edit',
        method: 'post',
        data
    })
}

export function generateReport(params) {
    return request({
      url: `/api/report_build`,
      method: 'get',
      params
    })
  }

  export function getClosedProject(params) {
    return request({
      url: `/admin/project/list/closed/options`,
      method: 'get',
      params
    })
  }