import { deleteRequest, getRequest, postRequest, putRequest } from 'utils/request';

const apiPath = {
  base: '/api/v1/menu', getMenuTree: '/api/v1/menu/tree'
};

class MenuService {
  static getMenuTree() {
    return getRequest(apiPath.getMenuTree);
  }

  static createMenu(data) {
    return postRequest(apiPath.base, data);
  }

  static async updateMenu(data) {
    return putRequest(apiPath.base + `/${data.id}`, data);
  }

  static deleteMenu(id){
    return deleteRequest(apiPath.base + `/${id}`);
  }
}

export default MenuService;
