import request from '@/utils/request-snipeit'

export function getList(params) {
  return request({
    url: '/hardware',
    method: 'get'
  })
}
