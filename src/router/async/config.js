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

console.log(`parseRoutes(asyncRoutes)`);
console.log(parseRoutes(asyncRoutes));

const options = {
  routes: parseRoutes(asyncRoutes)
};

export default options;