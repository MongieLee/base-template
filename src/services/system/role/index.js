import { deleteRequest, getRequest, postRequest, putRequest } from 'utils/request';

const apiPath = {
  base: '/api/v1/role',
  getList: '/api/v1/role/list',
  saveRoleMenus: '/api/v1/role/saveRoleMenus',
  getMenusByRoleId: '/api/v1/role/getRoleMenus',
  getMenusByUserInfo: '/api/v1/role/getMenusByUserInfo',
  getAll: '/api/v1/role/getAll',
  bindRoles: '/api/v1/role/bindRoles'
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
    return postRequest(apiPath.saveRoleMenus, data);
  }

  static getMenusByRoleId(roleId) {
    return getRequest(apiPath.getMenusByRoleId + `/${roleId}`);
  }

  getMenusByUserInfo() {
    return getRequest(apiPath.getMenusByUserInfo);
  }

  static getAll() {
    return getRequest(apiPath.getAll);
  }

  static bindRoles(data) {
    return postRequest(apiPath.bindRoles, data);
  }
}

export default RoleService;
