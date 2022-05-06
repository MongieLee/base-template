import { deleteRequest, getRequest, postRequest, putRequest } from 'utils/request';

const apiPath = {
  base: '/api/v1/todayNews', // 基础接口
  getList: '/api/v1/todayNews/list', // 获取列表
  publish: '/api/v1/todayNews/publish', // 发布
  cancelPublish: '/api/v1/todayNews/cancelPublish', // 取消发布
  batchImport: '/api/v1/todayNews/batchImport', // 批量导入
  export: '/api/v1/todayNews/export' // 导出
};

class TodayNewsService {
  static getList(params) {
    return getRequest(apiPath.getList, params);
  }

  static createNews(data) {
    return postRequest(apiPath.base, data);
  }

  static updateNews(data) {
    return putRequest(apiPath.base, data);
  }

  static deleteUser(id) {
    return deleteRequest(apiPath.base + `/${id}`);
  }

  static publish(id) {
    return postRequest(apiPath.publish + `/${id}`);
  }

  static cancelPublish(id) {
    return postRequest(apiPath.cancelPublish + `/${id}`);
  }

  static batchImport(data) {
    return postRequest(apiPath.batchImport, data);
  }

  static export(params) {
    return getRequest(apiPath.export, params);
  }
}

export default TodayNewsService;
