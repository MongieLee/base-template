import { message } from 'ant-design-vue';
import axios from 'axios';
import { apiUrl } from './commonPath';
import {
  __auth_refresh_token_key__, __auth_token_key__, clearAuthToken, getToken, inspectTokenValidity, setAuthToken
} from 'utils/token';
import router from '@/router';
import store from '@/store';

const instance = axios.create({});

instance.defaults.baseURL = apiUrl;
instance.defaults.timeout = 3000;

const METHOD = {
  GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE'
};

const GRANT_TYPE = {
  ACCESS_TOKEN: 'access_token', REFRESH_TOKEN: 'refresh_token'
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
    config.headers['Authorization'] = `Bearer ${getToken(__auth_token_key__)}`;
  }
  return config;
});


let cacheRequest = [];
let refreshing = false;

const refreshToken = () => {
  // 新建一个实例，没有拦截器
  return axios.create()({
    url: '/api/v1/auth/refreshToken', method: METHOD.POST, data: {
      grant_type: GRANT_TYPE.REFRESH_TOKEN, refresh_token: getToken(__auth_refresh_token_key__)
    }
  });
};

/**
 * 响应拦截器，主要用于处理token过期
 */
instance.interceptors.response.use((response) => {
  // 业务逻辑错误，success为false
  return !response.data.success ? response.data : response.data.data;
}, (error) => {
  // 如果非200状态，则会进入reject函数
  // 判断是否有响应体
  if (error.response) {
    const { status } = error.response;
    if (status === 401) {
      // 如果返回401，并且不存在refreshToken，则跳转到登陆页面
      if (!getToken(__auth_refresh_token_key__)) {
        redirectLogin();
        throw (new Error('登录失效，请重新登录'));
      }
      if (!refreshing) {
        refreshing = true; // 标记正在刷新
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新token失败');
          }
          const { token, expires, refresh_token } = res.data.data;
          setAuthToken(token, expires, refresh_token);
          cacheRequest.forEach(fn => fn());
          cacheRequest = [];
          return request(error.config).then(res => {
            return res;
          });
        }).catch(error => {
          store.commit('auth/updateUser', null);
          redirectLogin();
          return Promise.reject(error);
        }).finally(() => {
          refreshing = false; // 刷新完成
        });
      }
      // 如果正在刷新refresh_token，将请求缓存起来，等待刷新完成后再发起请求
      return new Promise(resolve => {
        // error.config就是拦截请求的配置
        cacheRequest.push(() => {
          resolve(request(error.config));
        });
      });
    }
  }
  return Promise.reject(error);
});


const request = (config = {}) => {
  return new Promise((resolve, reject) => {
    instance.request(config).then(data => {
      if (!data?.success) {
        resolve(data);
      } else {
        throw new Error(data.msg);
      }
    }).catch(error => {
      message.error(error.message || '请求失败');
      reject(error);
    });
  });
};


const postRequest = (url, data) => {
  return request({
    url, method: METHOD.POST, data
  });
};

const getRequest = (url, params) => {
  return request({
    url, method: METHOD.GET, params
  });
};

const putRequest = (url, data) => {
  return request({
    url, method: METHOD.PUT, data
  });
};

const deleteRequest = (url, params) => {
  return request({
    url, method: METHOD.DELETE, params
  });
};

export { postRequest, getRequest, putRequest, deleteRequest };

export default request;
