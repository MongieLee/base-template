import Vue from 'vue';
import store from '../store/index';

/**
 * 检测目标dom元素是否有资源权限
 */
Vue.directive('permission', {
  inserted(el, binding, vnode) {
    const { value } = binding;
    const { permissionCollection } = store.state.auth;
    // if (!permissionCollection.includes(value)) {
    //   el.style.display = 'none';
    // } else {
    //   el.style.display = 'block';
    // }
  }
});