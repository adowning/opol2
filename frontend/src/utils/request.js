import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['Accept'] = 'application/json',
    config.headers['Content-Type'] = 'application/json',
    config.headers['Authorization'] = `Bearer ${getToken()}`
    
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
