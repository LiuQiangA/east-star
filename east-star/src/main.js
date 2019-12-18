// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'jquery'
import store from './store'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

// vue-plyr
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
Vue.use(VuePlyr)

// 单独页面设置meta
import Meta from 'vue-meta'
Vue.use(Meta)

// 自定义的全局变量
import myGlobal from "@/config/global";
Vue.prototype.myGlobal = myGlobal;

//导入请求框架
import api from './api';
//使用api
Vue.use(api)
Vue.use(MintUI)

// 解决低版本安卓不支持vue
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()

// vant
import 'vant/lib/index.css';
import {
  PullRefresh,
  List,
} from 'vant'
Vue.use(PullRefresh).use(List)

// 移动端控制台调试
import Vconsole from 'vconsole';
if (process.env.NODE_ENV != "production"){
  var vConsole = new Vconsole();
}
export default vConsole;


Vue.config.productionTip = false

//导入样式
import 'normalize.css'

import '@/assets/less/common.css'

import Bridge from "@/config/bridge.js";
Vue.prototype.$bridge = Bridge

import BScroll from 'better-scroll';
Vue.prototype.$BScroll = BScroll;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
