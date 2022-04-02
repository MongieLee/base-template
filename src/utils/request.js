import { message } from 'ant-design-vue';
import axios from 'axios';
import { apiUrl } from './commonPath';
import { inspectTokenValidity, getToken } from 'utils/token';

const instance = axios.create({});

instance.defaults.baseURL = apiUrl;
instance.defaults.timeout = 6000;

const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

instance.interceptors.request.use((config) => {
  if (inspectTokenValidity()) {
    config.headers.common['Authorization'] = `Bearer ${getToken('auth_token')}`;
  }
  return config;
});


const request = (url, config = {}) => {
  config = { url, ...config };
  return new Promise((resolve, reject) => {
    instance.request(config).then(
      (res) => {
        const { data } = res;
        if (data.success && data.code === 200) {
          resolve(data);
        } else {
          message.error(data.msg || '请求失败');
          reject(data);
        }
      },
      (err) => {
        message.error(err.message || '网络异常！请联系管理员');
        resolve(err);
      }
    );
  });
};

const postRequest = (url, data, config = {}) => {
  const axiosConfig = {
    ...config,
    method: METHOD.POST,
    data
  };
  return request(url, axiosConfig);
};

const getRequest = (url, params = {}) => {
  const axiosConfig = {
    method: METHOD.GET,
    params
  };
  return request(url, axiosConfig);
};

const patchRequest = () => {
};
const deleteRquest = () => {
};

export { postRequest, getRequest, patchRequest, deleteRquest };

export default request;
