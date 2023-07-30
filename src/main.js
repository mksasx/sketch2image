import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import ElementUI from 'element-ui'
import "tailwindcss/tailwind.css"
// 加载 element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css';
import "./assets/font_4165146_1gq1z9ylkot/iconfont.css"
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  axios,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
