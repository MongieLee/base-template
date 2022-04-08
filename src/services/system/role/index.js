import {deleteRequest, getRequest, postRequest, putRequest} from 'utils/request';

const apiPath = {
  base: '/api/v1/role',
  getList: '/api/v1/role/list',
  saveRoleMenus: "/api/v1/role/saveRoleMenus",
  getMenusByRoleId: "/api/v1/role/getRoleMenus",
};

class RoleService {
  static getList(params) {
    return getRequest(apiPath.getList, params);
  }

  static createRole(data) {
    return postRequest(apiPath.base, data);
  }

  static async updateRole(data) {
    return putRequest(apiPath.base, data);
  }

  static deleteRole(id) {
    return deleteRequest(apiPath.base + `/${id}`);
  }

  static saveRoleMenus(data) {
    return postRequest(apiPath.saveRoleMenus, data)
  }

  static getMenusByRoleId(roleId) {
    return getRequest(apiPath.getMenusByRoleId + `/${roleId}`)
  }
}

export default RoleService;
