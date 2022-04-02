import { getRequest, postRequest } from 'utils/request';

class MenuService {
  static getMenuTree() {
    return getRequest("/v1/menu/tree",);
  }
}

export default MenuService;
