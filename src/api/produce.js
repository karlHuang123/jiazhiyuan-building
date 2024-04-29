import request from '@/utils/request'

export function getPlanList(params) {
    return request({
      url: '/admin/plan/list',
      method: 'get',
      params
    })
}

export function getPlanDetails(params) {
  return request({
    url: '/admin/plan/detail',
    method: 'get',
    params
  })
}

export function getTaskDetails(params) { //获取项目信息
  return request({
    url: '/admin/plan/project/task/info',
    method: 'get',
    params
  })
}

export function getTaskReviewDetails(params) { // 获取复查信息
  return request({
    url: '/admin/plan/project/review/info',
    method: 'get',
    params
  })
}

export function getPlanTypeList() {
  return request({
    url: '/admin/plan/type/options',
    method: 'get',
  })
}

export function getModelTypeList(params) {
  return request({
    url: '/admin/model/options',
    method: 'get',
    params
  })
}

export function getModelTypeTreeList(params) { // 根据检查体系查询及联下拉
  return request({
    url: '/admin/plan/add/query/by/check/sys',
    method: 'get',
    params
  })
}

export function getDeviceModelTypeTreeList(params) { // 根据模型体系查询及联下拉
  return request({
    url: '/admin/plan/add/query/by/device/model',
    method: 'get',
    params
  })
}

export function addPlan(data) {
  return request({
    url: '/admin/plan/add',
    method: 'post',
    data
  })
}

export function editPlan(data) {
  return request({
    url: '/admin/plan/edit',
    method: 'post',
    data
  })
}

export function editPlanTask(data) {
  return request({
    url: '/admin/plan/project/task/edit',
    method: 'post',
    data
  })
}

export function editPlanReview(data) {
  return request({
    url: '/admin/plan/project/review/edit',
    method: 'post',
    data
  })
}

export function deletePlan(data) {
  return request({
    url: '/admin/plan/batch/del',
    method: 'post',
    data
  })
}

export function rejectProject(data) {
  return request({
    url: '/admin/plan/project/reject',
    method: 'post',
    data
  })
}