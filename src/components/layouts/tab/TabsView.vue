<template>
  <div>
    <content-menu :item-list="list" :visible.sync="menuVisible" @select="onMenuSelect" />
    <TabsHeader @refresh="refresh" @clickPage="recoverPage" @contextmenu="onContextmenu" @closePage="closePage" />
    <aside></aside>
    <main :style="{height: `calc(100vh - ${contentHeight}px)`,overflow:`auto`}">
      <!--            <a-keep-alive :exclude-keys="excludeKeys">-->
      <!--      <transition name="slide-left" style="border: 1px solid red">-->
      <!--        <router-view re="tabContent" />-->
      <!--      </transition>-->
      <transition name="man">
        <router-view></router-view>
      </transition>
      <!--      <router-view ref="tabContent" />-->
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
        { text: '关闭左侧', key: 'closeLeft', icon: `vertical-left` },
        { text: '关闭右侧', key: 'closeRight', icon: `vertical-right` },
        { text: '关闭其他', key: 'closeOther', icon: `close` },
        { text: '刷新页面', key: 'refresh', icon: `sync` }
      ],
      currentPage: null
    };
  },
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
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
    ...mapMutations('auth', ['removeTab']),
    onMenuSelect(key, target, pageKey) {
      if (this[key]) {
        this[key](pageKey);
      }
    },
    closePage({ key, title, closable }) {
      const index = this.editableTabs.findIndex(i => i.key === key);
      const currentIndex = this.editableTabs.findIndex(i => this.$route.fullPath === i.key);
      this.removeTab({ index });
      const closeTargetIsLast = this.editableTabs.length - 1 === index;
      if (index === currentIndex) {
        // 相等则说明关闭的是当前页面就是要关闭的路由

      } else {

      }
      console.log(this.$route.fullPath);
      console.log(index);
      console.log(currentIndex);
      return;
      if (index >= 0) {
        console.log(index);
        this.removeTab({ index });
      }
    },
    closeLeft() {
      console.log('clseLeft');
    },
    closeRight() {
      console.log('closeRight');
    },
    closeOther() {
      console.log('closeOther');
    },
    refresh(page) {
      page.loading = true;
      this.currentPage = page;
      console.log('refresh');
      setTimeout(() => {
        page.loading = false;
        this.currentPage = null;
      }, 1000);
    },
    recoverPage({ key }) {
      this.$router.push(key);
    },
    onContextmenu(pageKey, e) {
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
.kuai-enter-active,
.kuai-leave-active {
  transition: all 0.3s;
}

.kuai-enter,
.kuai-leave-to {
  transform: translateX(100%);
}

/* 慢进慢出 */
.man-enter-active,
.man-leave-active {
  transition: all 0.5s;
}

.man-enter,
.man-leave-to {
  transform: translateX(100%);
}

/* 淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: all 1s;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
