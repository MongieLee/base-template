import { deleteRequest, getRequest, postRequest, putRequest } from 'utils/request';

const apiPath = {
  base: '/api/v1/user',
  info: '/api/v1/user/info',
  getList: '/api/v1/user/list',
  changeStatus: '/api/v1/user/status'
};

class UserService {
  static getList(params) {
    return getRequest(apiPath.getList, params);
  }

  static getUserInfo() {
    return getRequest(apiPath.info);
  }

  static async updateUser(data) {
    return putRequest(apiPath.base, data);
  }

  static deleteUser(id) {
    return deleteRequest(apiPath.base + `/${id}`);
  }

  static async changeStatus(data) {
    return postRequest(apiPath.changeStatus, data);
  }
}

export default UserService;
