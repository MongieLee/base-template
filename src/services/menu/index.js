import { deleteRequest, getRequest, postRequest, putRequest } from 'utils/request';

const apiPath = {
  base: '/api/v1/menu',
  getMenuTree: '/api/v1/menu/tree',
  moveUp: '/api/v1/menu/moveUp/',
  moveDown: '/api/v1/menu/moveDown/',
  moveToStar: '/api/v1/menu/moveToStar/',
  moveToEnd: '/api/v1/menu/moveToEnd/'
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

  static deleteMenu(id) {
    return deleteRequest(apiPath.base + `/${id}`);
  }

  static moveUp(id) {
    return postRequest(apiPath.moveUp + id);
  }

  static moveDown(id) {
    return postRequest(apiPath.moveDown + id);
  }

  static moveToStar(id) {
    return postRequest(apiPath.moveToStar + id);
  }

  static moveToEnd(id) {
    return postRequest(apiPath.moveToEnd + id);
  }
}

export default MenuService;
