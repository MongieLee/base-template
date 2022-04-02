import { getRequest, postRequest } from 'utils/request';

class UserService {
  static getUserInfo(){
    return getRequest("/v1/user/info")
  }
}

export default UserService;
