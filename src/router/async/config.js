import { parseRoutes } from '@/router/helps/handlerRoutes';

const asyncRoutes = [
  // 'login',
  // 'root',
  {
    routeKey: 'root',
    children: [
      'one',
      'two'
    ]
  }
];

const options = {
  routes: parseRoutes(asyncRoutes)
};

export default options;