import { getRequest, postRequest } from 'utils/request';

export const tokenGrantType = {
  access_token: 'access_token',
  refresh_token: 'refresh_token'
};

class AuthService {
  static login(data) {
    return postRequest('/api/v1/auth/login', { tokenGrantType: tokenGrantType.access_token, ...data });
  }

  static register(data) {
    return postRequest('/api/v1/auth/register', data);
  }

  static getUserInfo() {
    return getRequest('/api/v1/user/info');
  }
}

export default AuthService;
