import routerMap from '../async/asyncRouteMap';

// 格式化路由
function formatRoutes(routes = []) {
  routes.forEach((route) => {
    const { path } = route;
    if (!path.startsWith('/') && path !== '*') {
      route.path = `/${path}`;
    }
  });
};

// 路由权限解析
function formatAuthority(routes, authorities = []) {
  routes.forEach(route => {
    const { meta } = route;
    const defaultAuthority = authorities[authorities.length - 1] || { permission: '*' };
    if (meta) {
      const { _authority } = meta;
      console.log('has meta');
      let authority = {};
      if (!meta.authority) {
        authority = defaultAuthority;
      } else if (typeof _authority === 'string') {
        authority.permission = _authority;
      } else if (typeof _authority === 'object') {
        authority = _authority;
        const { role } = authority;
        if (typeof role === 'string') {
          authority.role = [role];
        }
        if (!authority.permission && !authority.role) {
          authority = defaultAuthority;
        }
      }
      meta.authority = authority;
    } else {
      console.log('noe meta');
      route.meta = { defaultAuthority };
    }
    route.meta.authorities = authorities;
    if (route?.children?.length) {
      formatAuthority(route.children, [...authorities, route.meta.authority]);
    }
  });
  return routes
}

/**
 * 根据配置文件和路由映射表解析路由
 * @param routesConfig
 * @param routerMap
 * @returns {any[]}
 */
function parseRoutes(routesConfig) {
  const routes = [];
  routesConfig.map(route => {
    if (typeof route === 'string') {
      console.log("router 是 字符串");
      route = {
        routeKey: route
      };
    }
    route.router = routerMap[route.routeKey];
    console.log("---------");
    console.log(route);
    console.log(route.router);
    console.log("---------");
    if (!route.router) {
      throw new Error(`无法匹配到路由[${route.routeKey}],请检查配置`);
    }
    // 如果有子路由则进一步的解析
    // if (route.children?.length) {
    //   route.children = parseRoutes(route.children);
    // }
    routes.push(route.router);
    return routes;
  });
  return routes;
}


/**
 * 加载全局的前置及后置路由
 * @param guards
 * @param options
 */
function loadGuards(guards, options) {
  const { beforeEach, afterEach } = guards;
  const router = options;
  beforeEach.forEach(guard => {
    if (typeof guard === 'function') {
      router.beforeEach((to, from, next) => guard(to, from, next, options));
    }
  });

  afterEach.forEach(guard => {
    if (typeof guard === 'function') {
      router.afterEach((to, from, next) => guard(to, from, options));
    }
  });
}

export { formatRoutes, formatAuthority, parseRoutes };