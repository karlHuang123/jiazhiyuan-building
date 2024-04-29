import request from '@/utils/request'

export function getCarList(data) {
    return request({
      url: `/admin/car/list?departmentId=${data.departmentId}&licenseNo=${data.licenseNo}&day=${data.day}`,
      method: 'get'
    })
}

export function getCarStat() {
    return request({
      url: '/admin/car/stat',
      method: 'get'
    })
}

export function switchVehicleStatus(data) {
  return request({
    url: '/admin/car/switch/state',
    method: 'post',
    data
  })
}

export function addVehicle(data) {
  return request({
    url: '/admin/car/add',
    method: 'post',
    data
  })
}

export function editVehicle(data) {
  return request({
    url: '/admin/car/edit',
    method: 'post',
    data
  })
}

export function deleteVehicle(data) {
  return request({
    url: '/admin/car/del',
    method: 'post',
    data
  })
}

export function getCarListByDate(data) {
  return request({
    url: `/admin/car/stat/list?startDate=${data.startDate}&endDate=${data.endDate}`,
    method: 'get',
    data
  })
}