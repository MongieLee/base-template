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
};

export default routerMap;
