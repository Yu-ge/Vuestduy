import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入全局样式表
import './assets/css/global.css'

//导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 引入入阿里字体图标库
import './assets/fonts/iconfont.css'

// 引入 第三方表格插件
import ZKtable from 'vue-table-with-tree-grid'
// vue-table-with-tree-grid
Vue.component('tree-table',ZKtable)

// 公共组件
import coms from './common/com.vue'
Vue.component('aaa', coms)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
