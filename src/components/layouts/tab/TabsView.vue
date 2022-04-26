<template>
  <div>
    <content-menu :item-list="list" :visible.sync="menuVisible" @select="onMenuSelect" />
    <TabsHeader @refresh="refresh" @clickPage="recoverPage" @contextmenu="onContextmenu" @closePage="closePage" />
    <main :style="{minHeight: `calc(100vh - ${contentHeight}px)`,position:`relative`}" ref="mainEle">
      <transition v-if="!shuaxin"
                  enter-active-class="animate__animated animate__bounceInLeft page-toggle-enter-active"
                  leave-active-class="animate__animated animate__bounceOutRight page-toggle-leave-active">
        <router-view :key="$route.path" />
      </transition>
      <div v-else
           style="height: 100%;position: absolute;width: 100%;display: flex;justify-content: center;align-items: center;">
        <span>
          <a-spin size="large" tip="页面刷新中..." />
        </span>
      </div>
    </main>
  </div>
</template>

<script>
import TabsHeader from './TabsHeader';
import { mapMutations, mapState } from 'vuex';
import { defaultActiveKey } from '@/store/modules/auth';

export default {
  name: 'layoutView',
  components: { TabsHeader },
  data() {
    return {
      menuVisible: false,
      pageList: [],
      excludeKeys: [],
      list: [
        { text: '关闭左侧', key: 'closeLeft', icon: 'vertical-right' },
        { text: '关闭右侧', key: 'closeRight', icon: 'vertical-left' },
        { text: '关闭其他', key: 'closeOther', icon: 'close' }
        // { text: '刷新页面', key: 'refresh', icon: 'sync' }
      ],
      currentPage: null,
      shuaxin: false
    };
  },
  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        if (this.currentPage) {
          this.currentPage.loading = false;
          this.currentPage = null;
        }
      }
    }
  },
  computed: {
    ...mapState('setting', ['contentHeight']),
    ...mapState('auth', ['editableTabs'])
  },
  methods: {
    ...mapMutations('auth', ['removeTab', 'batchRemoveTabs']),
    onMenuSelect(key, pageKey) {
      console.log('click menu');
      if (this[key]) {
        this[key](pageKey);
      }
    },
    closePage({ key, title, closable }) {
      // 找到当前页面在tabs的下标
      const index = this.editableTabs.findIndex(i => i.key === key);
      // 找到当前页面的下标
      const currentIndex = this.editableTabs.findIndex(i => this.$route.path === i.key);
      this.removeTab({ index });
      // 如果关闭的当前页面，则跳转到上一个页面
      if (index === currentIndex) {
        // 相等则说明关闭的是当前页面就是要关闭的路由
        this.$router.push(this.editableTabs[index - 1].key);
      }
    },
    closeLeft(pageKey) {
      const index = this.editableTabs.findIndex(i => i.key === pageKey);
      // 0说明当前关闭左侧的是第一个，没有标签可以关闭
      // 1说明关闭的时候是第二个tab，而第一个设定是不能被关闭
      if (index === 0 || index === 1) {
        this.$message.warning('左侧已没有标签可以关闭了!');
      } else {
        console.log('应该关掉左侧所有的非第一个');
        // 要关闭多少个，-1的目的是排除第一个不能关闭的标签
        const closeNum = index - 1;
        this.batchRemoveTabs({ begin: 1, count: closeNum });
      }
    },
    closeRight(pageKey) {
      console.log('closeRight');
      const index = this.editableTabs.findIndex(i => i.key === pageKey);
      // 0说明当前关闭左侧的是第一个，没有标签可以关闭
      // 1说明关闭的时候是第二个tab，而第一个设定是不能被关闭
      if (index === this.editableTabs.length - 1) {
        this.$message.warning('右侧已没有标签可以关闭了!');
      } else {
        // console.log('应该关掉左侧所有的非第一个');
        // // 要关闭多少个，-1的目的是排除第一个不能关闭的标签
        const closeNum = this.editableTabs.length - index;
        this.batchRemoveTabs({ begin: index + 1, count: closeNum });
      }
    },
    closeOther(pageKey) {
      console.log('closeOther');
      const index = this.editableTabs.findIndex(i => i.key === pageKey);
      // 0说明当前关闭左侧的是第一个，没有标签可以关闭
      // 1说明关闭的时候是第二个tab，而第一个设定是不能被关闭
      if (index === 0 || index === 1) {
        this.$message.warning('没有标签可以关闭了!');
      } else {
        this.closeRight(pageKey);
        this.closeLeft(pageKey);
        // console.log('应该关掉左侧所有的非第一个');
        // // 要关闭多少个，-1的目的是排除第一个不能关闭的标签
        // const closeNum = this.editableTabs.length - index;
        // this.batchRemoveTabs({ begin: index + 1, count: closeNum });
      }
    },
    refresh(page) {
      this.shuaxin = true;
      page.loading = true;
      this.currentPage = page;
      console.log('refresh');
      setTimeout(() => {
        this.shuaxin = false;
        page.loading = false;
        this.currentPage = null;
      }, 1000);
    },
    recoverPage({ key }) {
      this.$router.push(key);
    },
    onContextmenu(pageKey, e) {
      console.log(pageKey);
      if (pageKey) {
        e.preventDefault();
        e._pagekey = pageKey;
        this.menuVisible = true;
      }
    }
  }
};
</script>

<style>
.page-toggle-enter-active {
  position: absolute;
  width: 100%;
  height: 100%;
}

.page-toggle-leave-active {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
