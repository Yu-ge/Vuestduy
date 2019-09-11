import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import home from './components/home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/', redirect: '/login'
    },
    {
      path: '/login', component: login
    },
    {
      path: '/home', component: home
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径，form
  if (to.path === '/login') return next()
  // 获取token
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()
})

export default router
