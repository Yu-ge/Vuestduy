// 配置请求路径
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios
// axios.interceptors.request.use(config=>{
//   console.log(config);

// })
// 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
    // console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须 return config
    return config
})
//登录接口
export const login_Api = params => {
    return axios.post('login', params)
}
//获取home的导航菜单
export const menus_Api = params => {
    return axios.get('menus', params)
}
//获取用户列表
export const userlist_Api = params => {
    return axios.get('users', {params:params})
}