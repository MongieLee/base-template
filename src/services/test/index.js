import { postRequest, getRequest } from "utils/request";

class TestService {
  static list(data = { page: 1, pageSize: 20 }) {
    return getRequest("/v1/user/users", data).then(({ data }) => {
      return data;
    });
  }
}

export default TestService;