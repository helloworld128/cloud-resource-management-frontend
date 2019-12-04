import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/theme.css'
import './style/characters.css'
import 'xterm/dist/xterm.css'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.use(codemirror)
Vue.config.productionTip = false
Vue.prototype.baseUrl = process.env.NODE_ENV==="production"?"https://tiantian.ga/api":"/api"
Vue.prototype.baseWS = process.env.NODE_ENV==="production"?"wss://tiantian.ga:30304/?id=":"ws://49.233.20.29:30304/?id="

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})