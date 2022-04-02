const routerMap = {
  login: {
    component: () => import('@/pages/login'),
    authority: '*',
    path: '/login'
  },
  root: {
    component: () => import(/* webpackChunkName: "layout" */'@/pages/HomePage.vue'),
    authority: 'admin',
    path: '/'
  },
  one: {
    component: () => import('@/pages/test/one.vue'),
    authority: 'admin',
    path: '*'
  },
  two: {
    component: () => import('@/pages/test/two.vue'),
    authority: 'admin',
    path: '*'
  }
};

export default routerMap;
