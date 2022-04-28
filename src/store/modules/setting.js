export default {
  namespaced: true,
  state: {
    contentDifferenceHeight: 142, // 142为视窗-头部-内边距-tabs高度-底部
    multiPage: true, // tab是否多标签页
    fixedTabs: false,
    lockHeader: false,
  },
  mutations: {
    setContentDifferenceHeight(state,  height ) {
      state.contentDifferenceHeight = height;
    },
    changeTabsFixed(state, { status }) {
      state.fixedTabs = status;
    },
    changeLockHeader(state, { status }) {
      state.lockHeader = status;
    },
  },
};
