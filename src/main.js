import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './utils/importComponents.js';
import 'ant-design-vue/dist/antd.less';
import './theme/index.less';
import 'nprogress/nprogress.css';
import { formatAuthority } from '@/router/helps/handlerRoutes';
import options from '@/router/async/config';
import 'animate.css'
import "./directives/inspectPermission"

// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false;


// console.log(formatAuthority(options.routes))
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');