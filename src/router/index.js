import Vue from 'vue';
import VueRouter from 'vue-router';
import { inspectTokenValidity } from 'utils/token';
import { formatRoutes } from '@/router/helps/handlerRoutes';
import NProgress from 'nprogress';
import BaseLayout from '@/components/layouts/MainLayout.vue';
import EmptyView from 'components/EmptyView';

Vue.use(VueRouter);

// 隐藏顶部进度条的loading
NProgress.configure({ showSpinner: false });


const routes = [
  {
    path: '/',
    name: 'index',
    component: BaseLayout,
    redirect: '/dashboard',
    meta: { title: '首页' },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName:"dashboard"*/ 'pages/About.vue'),
        meta: { title: '仪表盘', icon: 'bug', keepAlive: true, permission: ['dashboard'] }
      },
      {
        path: '/system',
        name: 'system',
        component: EmptyView,
        redirect: '/system/menu',
        meta: { title: '系統管理', icon: 'bug', keepAlive: true, permission: ['system'] },
        children: [
          {
            path: '/system/menu',
            name: 'menu',
            component: () => import(/* webpackChunkName:"systemMenu" */ 'pages/menu/Index.vue'),
            meta: { title: '菜单管理', icon: 'bug', permission: ['system', 'menu'] }
          },
          {
            path: 'resource',
            name: 'resource',
            meta: { title: '资源管理' },
            component: () => import(/* webpackChunkName:"resource" */ 'pages/system/resource/Index.vue')
          },
          {
            path: 'resourceCategroy',
            name: 'resourceCategroy',
            meta: { title: '资源分类' },
            component: () => import(/* webpackChunkName:"resource-categroy" */ 'pages/system/resourceCategroy/Index.vue')
          },
          {
            path: '/system/role',
            name: 'role',
            component: () => import(/* webpackChunkName:"role" */ 'pages/system/role/Index.vue'),
            meta: { title: '角色管理', keepAlive: true, icon: 'bug', permission: ['system', 'role'] }
          },
          {
            path: 'allotMenu/:roleId',
            name: 'allotMenu',
            meta: { title: '分配菜单' },
            props: true,
            component: () => import(/* webpackChunkName:"allotMenu" */ 'pages/system/role/components/AllotMenu.vue')
          },
          {
            path: 'allotResource/:roleId',
            name: 'allotResource',
            meta: { title: '分配资源' },
            props: true,
            component: () => import(/* webpackChunkName:"allot-resource" */ 'pages/system/role/components/AllotResource.vue')
          },
          {
            path: '/system/user',
            name: 'user',
            meta: { title: '用户管理', keepAlive: true, icon: 'bug', permission: ['system', 'user'] },
            component: () => import(/* webpackChunkName:"user" */ 'pages/system/user/Index.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/login/index')
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName:"NotFound" */ 'pages/exception/404')
  },
  {
    path: '*',
    redirect: '404'
  }
];

const router = new VueRouter({
  routes
});
const startNprogress = () => {
  if (!NProgress.isStarted()) {
    NProgress.start();
    NProgress.inc();
  }
};

const nprogressEnd = () => {
  NProgress.done();
};
router.beforeEach((to, from, next) => {
  startNprogress();
  if (inspectTokenValidity()) {
    next();
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next({ name: 'Login', replace: true });
    }
  }
  nprogressEnd();
});

/**
 * 配置路由鉴权白名单，提供检测是否白名单函数
 * @type {{names: string[], paths: string[], includes(*): *}}
 */
const ignoreRoutes = {
  names: ['403', '404'],
  paths: ['/login'],
  includes(route) {
    return this.names.includes(route.name) || this.paths.includes(route.paths);
  }
};

/**
 * 根据配置项初始化路由实例
 * @param isAsync {boolean}
 * @returns {VueRouter}
 */
const initRouter = (isAsync) => {
  const options = isAsync ? require('./async/config').default : require('./baseConfig');
  formatRoutes(options.routes);
  return new VueRouter(options);
};

/**
 * 处理路由重复跳转消除掉警告
 */
const { push, replace } = VueRouter.prototype;
VueRouter.prototype.push = function(location) {
  push.call(this, location).catch(err => err);
};
VueRouter.prototype.replace = function(location) {
  replace.call(this, location).catch(err => err);
};

export default router;
export { routes, initRouter, ignoreRoutes };
