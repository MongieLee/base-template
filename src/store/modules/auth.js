import UserService from 'services/system/user';
import { getToken, setToken } from 'utils/token';

const storageAuthKey = '__user_info__';


export default {
  namespaced: true,
  state: {
    user: JSON.parse(getToken(storageAuthKey) || 'null'),
    permissionCollection: []
  },
  mutations: {
    updateUser(state, { user }) {
      state.user = user;
    },
    updatePermissionCollection(state, { permissionCollection }) {
      console.log("run");
      state.permissionCollection = permissionCollection;
    }
  },
  actions: {
    async fetchUserInfo({ commit }) {
      const { data } = await UserService.getUserInfo();
      setToken(storageAuthKey, JSON.stringify(data));
      commit('updateUser', { user: data });
    }
  }
};