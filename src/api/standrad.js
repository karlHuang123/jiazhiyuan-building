import request from '@/utils/request'

export function getLayerList(params) {
    return request({
      url: '/admin/hierarchy/system/list',
      method: 'get',
      params
    })
}

export function deleteLayer(data) {
  return request({
    url: '/admin/hierarchy/system/del',
    method: 'post',
    data
  })
}

export function addLayer(data) {
  return request({
    url: '/admin/hierarchy/system/add',
    method: 'post',
    data
  })
}

export function editLayer(data) {
  return request({
    url: '/admin/hierarchy/system/edit',
    method: 'post',
    data
  })
}

export function getModelList(params) {
    return request({
      url: '/admin/model/list',
      method: 'get',
      params
    })
}

export function getExpertList(params) {
    return request({
      url: '/admin/expert/list',
      method: 'get',
      params
    })
}

export function addExpert(data) { // 添加专家
  return request({
    url: '/admin/expert/add',
    method: 'post',
    data
  })
}

export function editExpert(data) { // 编辑专家
  return request({
    url: '/admin/expert/edit',
    method: 'post',
    data
  })
}

export function deleteExpert(data) { // s删除专家
  return request({
    url: '/admin/expert/batch/del',
    method: 'post',
    data
  })
}

export function getTreeList(params) { // 获取树型接口
  return request({
    url: '/admin/hierarchy/system/tree',
    method: 'get',
    params
  })
}

export function getTreeListByModelId(params) { // 获取树型接口
  return request({
    url: '/admin/model/modelTree',
    method: 'get',
    params
  })
}

export function getProbList(data) {
  return request({
    url: '/admin/problem/list',
    method: 'post',
    data
  })
}

export function addModel(data) { // 添加模型
  return request({
    url: '/admin/model/add',
    method: 'post',
    data
  })
}

export function editModel(data) { // 编辑模型
  return request({
    url: '/admin/model/edit',
    method: 'post',
    data
  })
}

export function getMembershipList(data) { // 获取隶属度
  return request({
    url: '/admin/expert/membership/list',
    method: 'post',
    data
  })
}

export function editMembership(data) { // 编辑隶属度
  return request({
    url: '/admin/expert/membership/edit',
    method: 'post',
    data
  })
}

export function getMatrix(params) { // 矩阵查询
  return request({
    url: '/admin/expert/query/score/matrix',
    method: 'get',
    params
  })
}

export function getMatrixTree(params) { // 矩阵树形结构查询
  return request({
    url: '/admin/expert/tree',
    method: 'get',
    params
  })
}

export function editMatrix(data) { // 编辑打分矩阵
  return request({
    url: '/admin/expert/edit/score/matrix',
    method: 'post',
    data
  })
}

export function addProbs(data) { // 添加问题
  return request({
    url: '/admin/problem/add',
    method: 'post',
    data
  })
}

export function editProbs(data) { // 编辑问题
  return request({
    url: '/admin/problem/edit',
    method: 'post',
    data
  })
}

export function deleteProbs(data) { // 添加问题
  return request({
    url: '/admin/problem/batch/del',
    method: 'post',
    data
  })
}

export function deleteModel(data) {
  return request({
    url: '/admin/model/del',
    method: 'post',
    data
  })
}


export function syncModel(data) { // 同步模型
  return request({
    url: '/admin/model/sync',
    method: 'post',
    data
  })
}

export function publishModel(data) { // 同步模型
  return request({
    url: '/admin/model/publish',
    method: 'post',
    data
  })
}

export function cloneModel(data) { // 同步模型
  return request({
    url: '/admin/model/clone',
    method: 'post',
    data
  })
}