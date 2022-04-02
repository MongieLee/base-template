import UserService from 'services/user';
import { getToken, setToken } from 'utils/token';

const storageAuthKey = '__user_info__';


export default {
  namespaced: true,
  state: {
    user: JSON.parse(getToken(storageAuthKey) || 'null')
  },
  mutations: {
    updateUser(state, { user }) {
      state.user = user;
    }
  },
  actions: {
    async fetchUserInfo({ commit }) {
      const result = await UserService.getUserInfo();
      setToken(storageAuthKey,JSON.stringify(result.data))
      commit('updateUser', { user: result.data });
      console.log(result);
    }
  }
};