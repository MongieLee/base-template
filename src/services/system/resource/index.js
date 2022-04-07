import { deleteRequest, getRequest, postRequest, putRequest } from 'utils/request';

const apiPath = {
  base: '/api/v1/resource',
  getList: '/api/v1/resource/list'
};

class ResourceService {
  static getList(params) {
    return getRequest(apiPath.getList, params);
  }

  static createResource(data) {
    return postRequest(apiPath.base, data);
  }

  static async updateResource(data) {
    return putRequest(apiPath.base, data);
  }

  static deleteResource(id) {
    return deleteRequest(apiPath.base + `/${id}`);
  }
}

export default ResourceService;
