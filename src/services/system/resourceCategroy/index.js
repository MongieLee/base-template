import { deleteRequest, getRequest, postRequest, putRequest } from 'utils/request';

const apiPath = {
  base: '/api/v1/resourceCategroy',
  getList: '/api/v1/resourceCategroy/list',
  getAll: '/api/v1/resourceCategroy/getAll'
};

class ResourceCategroyService {
  static getList(params) {
    return getRequest(apiPath.getList, params);
  }

  static createResourceCategroy(data) {
    return postRequest(apiPath.base, data);
  }

  static async updateResourceCategroy(data) {
    return putRequest(apiPath.base, data);
  }

  static deleteResourceCategroy(id) {
    return deleteRequest(apiPath.base + `/${id}`);
  }

  static getAll() {
    return getRequest(apiPath.getAll);
  }
}

export default ResourceCategroyService;
