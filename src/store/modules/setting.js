export default {
  namespaced: true,
  state: {
    contentHeight: 0,
    multiPage: true, // tab是否多标签页
    fixedTabs: false,
    lockHeader: false,
  },
  mutations: {
    correctContentHeight(state, { height }) {
      state.contentHeight = height;
    },
    changeTabsFixed(state, { status }) {
      state.fixedTabs = status;
    },
    changeLockHeader(state, { status }) {
      state.lockHeader = status;
    },
  },
};
