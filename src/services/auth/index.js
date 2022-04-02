import { getRequest, postRequest } from 'utils/request';

class AuthService {
  static login(data = { username: undefined, password: undefined }) {
    return postRequest("/v1/auth/login",data);
  }

  static register(data = { username: undefined, password: undefined }) {
    return postRequest("/v1/auth/register",data);
  }

  static getUserInfo(){
    return getRequest("/vi/user/info")
  }
}

export default AuthService;
