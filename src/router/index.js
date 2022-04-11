import Vue from 'vue';
import VueRouter from 'vue-router';
import {inspectTokenValidity} from 'utils/token';
import {formatRoutes} from '@/router/helps/handlerRoutes';
import NProgress from 'nprogress';
NProgress.configure({ showSpinner: false })
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import(/* webpackChunkName:"mainLayout" */ 'components/layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'About',
        component: () => import(/* webpackChunkName:"about"*/ 'pages/About.vue')
      },
      {
        path: 'system',
        meta: {title: "系統管理"},
        redirect: '/system/menu',
        component: () => import(/* webpackChunkName:"emptyView" */ 'components/EmptyView'),
        children: [
          {
            path: 'menu',
            name: 'Menu',
            meta: {title: "菜單管理"},
            component: () => import(/* webpackChunkName:"menu" */ 'pages/menu/Index.vue')
          },
          {
            path: 'resource',
            name: 'resource',
            meta: {title: "資源管理"},
            component: () => import(/* webpackChunkName:"resource" */ 'pages/system/resource/Index.vue')
          },
          {
            path: 'resourceCategroy',
            name: 'resourceCategroy',
            meta: {title: "資源分类"},
            component: () => import(/* webpackChunkName:"resource-categroy" */ 'pages/system/resourceCategroy/Index.vue')
          },
          {
            path: 'role',
            name: 'role',
            meta: {title: "角色管理"},
            component: () => import(/* webpackChunkName:"resource" */ 'pages/system/role/Index.vue')
          },
          {
            path: "allotMenu/:roleId",
            name: "allotMenu",
            meta: {title: "分配菜單"},
            props: true,
            component: () => import(/* webpackChunkName:"allotMenu" */ "pages/system/role/components/AllotMenu.vue")
          },
          {
            path: "allotResource/:roleId",
            name: "allotResource",
            meta: {title: "分配資源"},
            props: true,
            component: () => import(/* webpackChunkName:"allot-resource" */ "pages/system/role/components/AllotResource.vue")
          },
          {
            path: 'user',
            name: 'user',
            meta: {title: "用戶管理"},
            component: () => import(/* webpackChunkName:"resource" */ 'pages/system/user/Index.vue')
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
    path: '*',
    component: () => import(/* webpackChunkName:"NotFound" */ 'pages/exception/404')
  }
];

const router = new VueRouter({
  routes
});
const startNprogress = () => {
  console.log(NProgress.isStarted);
  if (!NProgress.isStarted()) {
    console.log(1);
    NProgress.start();
    NProgress.inc()
  }
};

const nprogressEnd = () => {
  console.log(2);
  NProgress.done();
};
router.beforeEach((to, from, next) => {
  startNprogress()
  if (inspectTokenValidity()) {
      next();
      nprogressEnd();
  } else {
    if (to.path === '/login') {
      next();
    } else {
        next({name: 'Login', replace: true});
    }
  }
});

/**
 * setting ignore routes
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
 * initial router instance from configuration
 * @param isAsync {boolean}
 * @returns {VueRouter}
 */
const initRouter = (isAsync) => {
  const options = isAsync ? require('./async/config').default : require('./baseConfig');
  formatRoutes(options.routes);
  return new VueRouter(options);
};

/**
 * handler repeat jump of route
 */
const {push, replace} = VueRouter.prototype;
VueRouter.prototype.push = function (location) {
  push.call(this, location).catch(err => err);
};
VueRouter.prototype.replace = function (location) {
  replace.call(this, location).catch(err => err);
};

export default router;
export {routes, initRouter, ignoreRoutes};
