import Vue from 'vue'
import App from './App.vue'
import router from './router'
import config from './config'
import utils from './utils'
import axios from 'axios'
// 隐秘文件挂载全局使用
import secret from './secret'
// 百度地图
import BaiduMap from 'vue-baidu-map';

Vue.use(BaiduMap, { ak: secret.baidu_map_ak });
Vue.config.productionTip = false;

Vue.prototype.config = config;
Vue.prototype.utils = utils;
Vue.prototype.$axios = axios;

// 引入vant样式
import 'vant/lib/index.css';
import './vant-import' // 引入需要的vant组件

import Router from 'vue-router'

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
};

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
