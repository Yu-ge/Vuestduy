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
// 登录接口
export const login_Api = params => {
    return axios.post('login', params)
}
// 获取home的导航菜单
export const menus_Api = params => {
    return axios.get('menus', params)
}
// 获取用户列表
export const userlist_Api = params => {
    return axios.get('users', { params: params })
}
// 用户状态改变
export const userstate_api = params => {
    return axios.put(`users/${params.uId}/state/${params.type}`)
}
//添加用户
export const adduser_api = params => {
    return axios.post('users', params)
}
// id查询用户信息
export const showuser_api = params => {
    return axios.get(`users/${params}`)
}
// i编辑用户提交
export const edituser_api = params => {
    return axios.put(`users/${params.id}`,{
        email:params.email,
        mobile:params.mobile
    })
}
// 根据id删除用户
export const deleteuser_api = params => {
    return axios.delete(`users/${params.id}`)
}
// 权限列表获取
export const getrightlist_api = params => {
    return axios.get(`rights/list`)
}
// 角色列表
export const getrolelist_api = params => {
    return axios.get(`roles`)
}
// 添加角色
export const addrole_api = params=>{
    return axios.post(`roles`,params)
}
// id查询角色信息
export const showrole_api = params => {
    return axios.get(`roles/${params}`)
}
// i编辑角色提交
export const editrole_api = params => {
    return axios.put(`roles/${params.id}`,{
        roleName:params.roleName,
        roleDesc:params.roleDesc
    })
}
// 根据id删除用户
export const deleterole_api = params => {
    return axios.delete(`roles/${params.id}`)
}
// 根据id删除用户
export const deleteright_api = params => {
    return axios.delete(`roles/${params.roleId}/rights/${params.rightId}`)
}
// 权限列表树形图获取
export const getrightstree_api = params => {
    return axios.get(`rights/tree`)
}
// 角色授权
export const postright_api = params => {
    return axios.post(`roles/${params.roleId}/rights`,{rids:params.rids})
}
// 查询角色
export const getroles_api = params=>{
    return axios.get(`roles`)
}
// 更新角色
export const putrole_api = params=>{
    return axios.put(`users/${params.id}/role`,{rid:params.rid})
}
// 获取商品分类数据列表
export const getcategories_api = params =>{
    return axios.get(`categories`,{
        params:params
    })
}
