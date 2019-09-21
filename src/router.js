import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import home from './components/home.vue'
import welcome from './components/welcome.vue'
import users from './components/user/users.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'
// 分类
import Cate from './components/goods/Cate.vue'
import goods from './components/goods/List.vue'
import Params from './components/goods/Params.vue'
import add from './components/goods/add.vue'
import orders from './components/order/order.vue'
import reports from './components/report/report.vue'
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
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: welcome },
        { path: '/users', component: users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/goods', component: goods },
        { path: '/params', component: Params },
        { path: '/goods/add', component: add },
        { path: '/orders', component: orders },
        { path: '/reports', component: reports },
      ]
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
