import Vue from 'vue';
import VueRouter from 'vue-router';
import { inspectTokenValidity } from 'utils/token';
import { formatRoutes } from '@/router/helps/handlerRoutes';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/about',
    component: () => import(/* webpackChunkName:"mainLayout" */ 'components/layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'About',
        meta: {
          title: '关于'
        },
        component: () => import(/* webpackChunkName:"about"*/ 'pages/About.vue')
      },
      {
        path: 'system',
        redirect: '/system/menu',
        meta: {
          title: '系统管理'
        },
        component: () => import(/* webpackChunkName:"emptyView" */ 'components/EmptyView'),
        children: [
          {
            path: 'menu',
            name: 'Menu',
            meta: {
              title: '菜单管理'
            },
            component: () => import(/* webpackChunkName:"menu" */ 'pages/menu/Index.vue')
          },
          {
            path: 'resource',
            name: 'resource',
            meta: {
              title: '资源管理'
            },
            component: () => import(/* webpackChunkName:"resource" */ 'pages/system/resource/Index.vue')
          },
          {
            path: 'role',
            name: 'role',
            meta: {
              title: '角色管理'
            },
            component: () => import(/* webpackChunkName:"resource" */ 'pages/system/role/Index.vue')
          },
          {
            path: 'user',
            name: 'user',
            meta: {
              title: '用户管理'
            },
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
    path: '*',
    component: () => import(/* webpackChunkName:"NotFound" */ 'pages/exception/404')
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (inspectTokenValidity()) {
    next();
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next({ name: 'Login', replace: true });
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
const { push, replace } = VueRouter.prototype;
VueRouter.prototype.push = function(location) {
  push.call(this, location).catch(err => err);
};
VueRouter.prototype.replace = function(location) {
  replace.call(this, location).catch(err => err);
};

export default router;
export { routes, initRouter, ignoreRoutes };
