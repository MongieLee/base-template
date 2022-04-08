import { getRequest, postRequest } from 'utils/request';

class UserService {
  static getUserInfo(){
    return getRequest("/api/v1/user/info")
  }
}

export default UserService;
