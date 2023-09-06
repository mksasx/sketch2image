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
import "./assets/font_4165146_l9hicumxly/iconfont.css"
Vue.prototype.$axios = axios;
Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'lang' || key === 'lang2') {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val);

        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal);
  }
},
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  axios,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
