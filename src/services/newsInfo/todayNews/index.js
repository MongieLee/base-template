import {deleteRequest, getRequest, postRequest, putRequest} from 'utils/request';

const apiPath = {
  base: '/api/v1/todayNews',
  getList: '/api/v1/todayNews/list',
  publish: '/api/v1/todayNews/publish',
  cancelPublish: '/api/v1/todayNews/cancelPublish',
};

class TodayNewsService {
  static getList(params) {
    return getRequest(apiPath.getList, params);
  }

  static async createNews(data) {
    return postRequest(apiPath.base, data);
  }

  static async updateNews(data) {
    return putRequest(apiPath.base, data);
  }

  static deleteUser(id) {
    return deleteRequest(apiPath.base + `/${id}`);
  }

  static async publish(id) {
    return postRequest(apiPath.publish + `/${id}`);
  }

  static async cancelPublish(id) {
    return postRequest(apiPath.cancelPublish + `/${id}`);
  }
}

export default TodayNewsService;
