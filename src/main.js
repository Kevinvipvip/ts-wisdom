import Vue from 'vue'
import App from './App.vue'
import router from './router'
import config from './config'
import utils from './utils'
import axios from 'axios'

Vue.config.productionTip = false;

Vue.prototype.config = config;
Vue.prototype.utils = utils;
Vue.prototype.$axios = axios;

// 引入vant样式
import 'vant/lib/index.css';
import './vant-import' // 引入需要的vant组件

// 设置1rem是屏幕的1/10宽
window.onresize = setHtmlFontSize;

function setHtmlFontSize() {
  const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  const htmlDom = document.getElementsByTagName('html')[0];
  htmlDom.style.fontSize = htmlWidth / 10 + 'px'
}

setHtmlFontSize();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
