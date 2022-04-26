import UserService from 'services/system/user';
import { getToken, setToken } from 'utils/token';

const storageAuthKey = 'user_info';
const cache_tabs_key = 'cache_tabs';
export const defaultActiveKey = '/dashboard';

/**
 * 缓存tabs信息
 * @param tabs
 */
const cacheTabs = (tabs) => {
  localStorage.setItem(cache_tabs_key, JSON.stringify(tabs));
};

/**
 * 尝试从localStorage中获取tabs备份，如果有则使用，没有就加载默认页
 * @returns {any}
 */
const getInitTabs = () => {
  const defaultTabs = [{
    title: '数据看板',
    key: defaultActiveKey,
    loading: false,
    closable: false
  }];
  const tabs = localStorage.getItem(cache_tabs_key);
  try {
    // 防止tabs字符串反序列化报错
    if(tabs){
      return JSON.parse(tabs);
    }
    return defaultTabs;
  } catch {
    return defaultTabs;
  }
};


export default {
  namespaced: true,
  state: {
    tokenInfo: {
      token: undefined,
      refreshToken: undefined
    },
    user: {}, // 用户信息
    permissionCollection: [], // 用户角色权限集合
    activeKey: defaultActiveKey, // 默认高亮tab
    editableTabs: getInitTabs(), // tabs栏菜单
    isResolveRoute: false // 是否解析过路由
  },
  mutations: {
    setTokenInfo(state, tokenInfo) {
      state.tokenInfo = tokenInfo;
    },
    updateUser(state, user) {
      state.user = user;
    },
    updatePermissionCollection(state, { permissionCollection }) {
      state.permissionCollection = permissionCollection;
    },
    setEditableTabs(state, tabs) {
      state.editableTabs = [...state.editableTabs, ...tabs];
      cacheTabs(state.editableTabs);
    },
    changeResolveRouteStatus(state, { resolveStatus }) {
      sessionStorage.setItem('isResolveRoute', resolveStatus);
      state.isResolveRoute = resolveStatus;
    },
    changeActiveKey(state, { activeKey }) {
      state.activeKey = activeKey;
    },
    removeTab(state, { index }) {
      state.editableTabs.splice(index, 1);
      cacheTabs(state.editableTabs);
    },
    batchRemoveTabs(state, { begin, count }) {
      state.editableTabs.splice(begin, count);
      cacheTabs(state.editableTabs);
    }
  },
  actions: {
    async fetchUserInfo({ commit }) {
      const userInfo = await UserService.getUserInfo();
      setToken(storageAuthKey, JSON.stringify(userInfo));
      commit('updateUser', userInfo);
    }
  }
};