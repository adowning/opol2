import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

const snipeToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImFkYzIyNzAzNGM0MDZjOTIxZTcyMWQ0ZjZjMzg0MWUzZTUwNWZlNmY2NDVkNzgyY2E4YzVlNGZhZDhiNzA5YmMxZDVjYTBlOGVmOWRmY2VhIn0.eyJhdWQiOiIxIiwianRpIjoiYWRjMjI3MDM0YzQwNmM5MjFlNzIxZDRmNmMzODQxZTNlNTA1ZmU2ZjY0NWQ3ODJjYThjNWU0ZmFkOGI3MDliYzFkNWNhMGU4ZWY5ZGZjZWEiLCJpYXQiOjE1MTc0Mjk4NzgsIm5iZiI6MTUxNzQyOTg3OCwiZXhwIjoxNTQ4OTY1ODc4LCJzdWIiOiI0Iiwic2NvcGVzIjpbXX0.vOm9l2lC1eR2PK4O46-gtOcJIwC8297cHB55Y-vXyewhUW4r07zOS4vBkSrudpCgiD5C6kNBUS2nCvtWjn8Nr-xn9Z0Q3OrjsSPB1KCrviI8NjiKBpFoUhBGi65-FMbGxtkeKt-GFdXS8DfhAk1JYXlG3_yK4KaFi6A7JwAeIJ9BSFM5sAr-FRzGEO25Ff-8sTcY1T2RhClCRNh1Am_wvffjZIyC-eIBNJUS0riuVsjpzVW-CVdJCkCh4ULCsg7U2XBJ8D-xQghlmg9wR2c2nDKzwH5BfAIbyeGZTSiUXN2ncg8KOPwfo99PkHoMYIpuVGk-ryh7UwCCZsb7sa-GM23nKsbgsrzRCBgzsxy3FxcfBPA-D-PgM4syXUGdda6_oZQwzJ8TD72GQKyKwGSUJKsDpNH9v5aSAzHCM6tt1tgwmM9mE7ZVLSvAVi4N9Ls1Q3lNEsNMhpH_ZG8Nwiv_CobEv13VYhcdoiIk3QJHlA9__P0uOsksqu_B1i3f0HSo5skYP4t9TilMM5_LVercUcfa8aGtCu3f-bP2Reo4CADA1mUbtMK4IUHb9ZONoU8XwoNKroGGMUPuqMvU8y99RoiV7PHviTvUkADboq-T1dvoHC09o5zrNiVaeSNDQJiYqTG_2ws_mScYMyJyEksTc1FH-KrLMcw5NrsQNc4dRsI'
const service = axios.create({
  baseURL: 'http://168.235.96.46:8080/api/v1', // api的base_url
  timeout: 15000 // 请求超时时间
  
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['Accept'] = 'application/json',
    // config.headers['Content-Type'] = 'application/json',
    config.headers['Authorization'] = `Bearer ${snipeToken}`
    
    // 'Accept': 'application/json', // eslint-disable-line quote-props
    // 'Content-Type': 'application/json',
    // // 'Authorization': `Bearer ${localStorage.getItem('strapiJwt')}`, // eslint-disable-line quote-props
    // 'Authorization': `Bearer ${token}`, // eslint-disable-line quote-props
  }
  console.log(config)
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const res = response.data
    console.log(res)
    // if (res.code !== 20000) {
      if (!res.jwt && !res.id) {
      Message({
        message: res.data,
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: illegal token; 50012: other client login; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('You have been logged out, you can cancel the stay on the page, or re-login', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      console.log(response.data)
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
