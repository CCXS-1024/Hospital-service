import axios from 'axios'
import { getToken } from './storage'

const instance = axios.create({
  timeout: 8000,
  baseURL: '/api',
})

instance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token !== null) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default instance
