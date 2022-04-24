import { message } from 'ant-design-vue';
import axios from 'axios';
import { apiUrl } from './commonPath';
import { inspectTokenValidity, getToken, clearAuthToken } from 'utils/token';
import router from '@/router';
import store from '@/store';

const instance = axios.create({});

instance.defaults.baseURL = apiUrl;
instance.defaults.timeout = 3000;

const METHOD = {
  GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE'
};

/**
 * 重定向到登陆页面
 */
const redirectLogin = () => {
  clearAuthToken();
  return router.push({
    path: '/login', query: {
      // 将原本的路由信息传递给登陆页面，当登陆成功后，跳转回原来的页面
      redirect: encodeURIComponent(router.currentRoute.fullPath)
    }
  });
};

/**
 * 请求拦截器，每次请求前都会调用，主要校验token是否存在，如果存在，则每次请求都带上token
 */
instance.interceptors.request.use((config) => {
  if (inspectTokenValidity()) {
    config.headers.common['Authorization'] = `Bearer ${getToken('auth_token')}`;
  }
  return config;
});


let cacheRequest = [];
let noPermission = false;

/**
 * 响应拦截器，主要用于处理token过期
 */
// instance.interceptors.response.use((response) => {
//   return response;
// }, (error) => {
//   console.dir(error);
//   if (error.response) {
//     const { status } = error.response;
//     if (status === 401) {
//       if (!noPermission) {
//         message.error('登录已过期，请重新登录');
//         noPermission = true;
//         redirectLogin();
//       }
//     } else if (status === 403) {
//       message.error('您没有权限访问该页面');
//       noPermission = true;
//       redirectLogin();
//     } else if (status === 404) {
//       message.error('请求的资源不存在');
//     } else if (status >= 500) {
//       message.error('服务器内部错误');
//     }
//   } else {
//     message.error('网络错误');
//   }
//   return Promise.reject(error);
// });


const request = (url, config = {}) => {
  config = { url, ...config };
  return new Promise((resolve, reject) => {
    instance.request(config).then((res) => {
      const { data } = res;
      if (data.success && data.code === 200) {
        resolve(data);
      } else {
        message.error(data.msg || '请求失败');
        reject(data);
      }
    }, (err) => {

      reject(err);
    });
  });
};

const postRequest = (url, data, config = {}) => {
  const axiosConfig = {
    ...config, method: METHOD.POST, data
  };
  return request(url, axiosConfig);
};

const getRequest = (url, params = {}) => {
  const axiosConfig = {
    method: METHOD.GET, params
  };
  return request(url, axiosConfig);
};

const putRequest = (url, data) => {
  const axiosConfig = {
    method: METHOD.PUT, data
  };
  return request(url, axiosConfig);
};

const deleteRequest = (url, id) => {
  const axiosConfig = {
    method: METHOD.DELETE, params: {
      id
    }
  };
  return request(url, axiosConfig);
};

export { postRequest, getRequest, putRequest, deleteRequest };

export default request;
