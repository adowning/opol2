import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/auth/local',
    method: 'post',
    data: {
      "identifier":"ash@andrewscarpetcleaning.com",
      "password": "asdfasdf"
    }
  })
}

export function getInfo(id) {
  return request({
    url: '/user/'+id,
    method: 'get',
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
