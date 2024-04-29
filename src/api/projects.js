import request from '@/utils/request'

export function getProjectList(params) {
    return request({
      url: `/admin/project/list`,
      method: 'get',
      params
    })
}

export function getProjectOptions() {
  return request({
    url: '/admin/project/type/options',
    method: 'get',
  })
}

export function getDangerousOptions() {
  return request({
    url: '/admin/project/dangerous/type/options',
    method: 'get',
  })
}

export function getSuperDangerousOptions() {
  return request({
    url: '/admin/project/super/dangerous/type/options',
    method: 'get',
  })
}

export function getProjectUsageOptions(data) {
  return request({
    url: `/admin/project/usage/type/options?projectType=${data.projectType}`,
    method: 'get',
  })
}

export function deleteProject(data) {
  return request({
    url: '/admin/project/batch/del',
    method: 'post',
    data
  })
}

export function addProject(data) {
  return request({
    url: '/admin/project/add',
    method: 'post',
    data
  })
}

export function editProject(data) {
  return request({
    url: '/admin/project/edit',
    method: 'post',
    data
  })
}

export function updateProject(data) {
  return request({
    url: '/admin/project/update/supervisor/info',
    method: 'post',
    data
  })
}

export function changeProject(data) {
  return request({
    url: '/admin/project/edit/supervisor/his',
    method: 'post',
    data
  })
}


export function getProjectHistory(data) {
  return request({
    url: `/admin/project/list/supervisor/his?projectId=${data.projectId}`,
    method: 'get',
  })
}

export function getDeviceSummary(data) {
  return request({
    url: `/admin/project/device/summary?projectId=${data.projectId}`,
    method: 'get',
  })
}

export function getDeviceTypeList(data) {
  return request({
    url: `/admin/project/device/list?projectId=${data.projectId}&type=${data.type}`,
    method: 'get',
  })
}

export function getDeviceSystemTypeList(deviceType) {
  return request({
    url: `/admin/project/device/system/options?deviceType=${deviceType}`,
    method: 'get',
  })
}

export function getDeviceQueryList(data) {
  return request({
    url: `/admin/project/device/query/options?deviceType=${data.deviceType}&deviceSystemType=${data.deviceSystemType}`,
    method: 'get',
  })
}

export function addDevice(data) {
  return request({
    url: '/admin/project/device/add',
    method: 'post',
    data
  })
}

export function deleteDevice(data) {
  return request({
    url: '/admin/project/device/del',
    method: 'post',
    data
  })
}

export function deleteDeviceByDate(data) {
  return request({
    url: '/admin/project/device/batch/del',
    method: 'post',
    data
  })
}

export function getFuzzyEvaluate(data) {
  return request({
    url: '/admin/project/evaluation/fuzzy/list',
    method: 'post',
    data
  })
}

export function getFuzzyScoreResult(params) {
  return request({
    url: '/admin/project/evaluation/fuzzy/cal/detail',
    method: 'get',
    params
  })
}

export function getCalcScoreResult(params) {
  return request({
    url: '/admin/project/evaluation/score/cal/detail',
    method: 'get',
    params
  })
}

export function getCalcScoreResultDetails(params) {
  return request({
    url: '/admin/project/evaluation/score/cal/sub/detail',
    method: 'get',
    params
  })
}

export function getCalcResult(params) {
  return request({
    url: '/admin/project/evaluation/score/list',
    method: 'get',
    params
  })
}
export function getProjectsByIds(data) {
  return request({
    url: '/admin/digital/map/project/detail/list',
    method: 'post',
    data
  })
}
export function getMapSettingList(data) {
  return request({
    url: '/admin/digital/map/setting/project/list',
    method: 'post',
    data
  })
}

export function editConfig(data) {
  return request({
    url: '/admin/digital/map/setting/project/edit',
    method: 'post',
    data
  })
}

export function uploadProjects(data) {
  return request({
    url: '/admin/project/import',
    method: 'post',
    data
  })
}

export function deleteHistory(data) {
  return request({
    url: '/admin/project/del/supervisor/his',
    method: 'post',
    data
  })
}
