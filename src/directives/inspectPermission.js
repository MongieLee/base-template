import Vue from 'vue';
import store from '../store/index';
import _ from 'lodash';
import router from '@/router';

/**
 * 检测目标dom元素是否有资源权限
 */
Vue.directive('permission', {
  inserted(el, binding, vnode) {
    const { value } = binding;
    const originDisplay = el.style.display
    el.classList.add('permission-hidden')
    setTimeout(() => {
      if (store.state.auth.permissionCollection.includes(value)) {
        // el.remove();
        el.classList.remove('permission-hidden')
      }
    }, 100);
  }
});