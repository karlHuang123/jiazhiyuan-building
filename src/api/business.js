import request from '@/utils/request'

export function getClientList(data) {
  return request({
    url: `/admin/client/list?currPage=${data.currPage}&pageSize=${data.pageSize}&keyword=${data.keyword}&clientType=${data.clientType}&creatorId=${data.creatorId}`,
    method: 'get'
  })
}

export function deleteClient(data) {
  return request({
    url: '/admin/client/batch/del',
    method: 'post',
    data
  })
}

export function addClient(data) {
  return request({
    url: '/admin/client/add',
    method: 'post',
    data
  })
}

export function editClient(data) {
  return request({
    url: '/admin/client/edit',
    method: 'post',
    data
  })
}

export function getContractList(data) {
  return request({
    url: `/admin/contract/list?currPage=${data.currPage}&pageSize=${data.pageSize}&keyword=${data.keyword}&clientType=${data.clientType}&creatorId=${data.creatorId}`,
    method: 'get'
  })
}

export function deleteContract(data) {
  return request({
    url: '/admin/contract/batch/del',
    method: 'post',
    data
  })
}

export function addContract(data) {
  return request({
    url: '/admin/contract/add',
    method: 'post',
    data
  })
}

export function editContract(data) {
  return request({
    url: '/admin/contract/edit',
    method: 'post',
    data
  })
}

export function getClientOptions() {
  return request({
    url: '/admin/client/type/options',
    method: 'get'
  })
}

export function getClientSelectOptions() { // 区别于上方，用来创建新合同时选择
  return request({
    url: '/admin/client/options',
    method: 'get'
  })
}

export function uploadFile(data) {
  return request({
    url: '/admin/file/upload',
    method: 'post',
    data
  })
}

export function downloadFile(fileName) {
  return request({
    url: `/admin/file/download?fileName=${fileName}`,
    method: 'get',
    responseType: 'blob'
  })
}

export function getCorrectPracticeList(params) { // 获取业务数据正确做法列表
  return request({
    url: '/admin/business/data/correct/practice/list',
    method: 'get',
    params
  })
}

export function deleteCorrectPractice(data) {
  return request({
    url: '/admin/business/data/correct/practice/batch/del',
    method: 'post',
    data
  })
}

export function getBusinessDataProbList(params) { // 获取业务数据综合问题列表
  return request({
    url: '/admin/business/data/problem/list',
    method: 'get',
    params
  })
}

export function deleteDataProblem(data) {
  return request({
    url: '/admin/business/data/problem/batch/del',
    method: 'post',
    data
  })
}

export function getProjectScore(params) { // 获取业务数据综合问题列表
  return request({
    url: '/admin/business/data/problem/project/score',
    method: 'get',
    params
  })
}

export function getPlanByProject(params) { // 根据计划ID获取项目列表
  return request({
    url: '/admin/plan/project/list',
    method: 'get',
    params
  })
}