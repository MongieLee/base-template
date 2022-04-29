<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <!-- 侧边栏 -->
    <a-layout-sider style="box-shadow: 2px 0 3px 2px rgba(0,0,0,0.25);" v-model="collapsed" :trigger="null"
                    :collapsible="true" :width="256">
      <!-- 公司Logo和名称 -->
      <!--      <router-link style="overflow: hidden" to="/dashboard" class="logo-and-title">-->
      <!--        <img style="width: 44px" src="@/assets/biz-logo.png" alt="company">-->
      <!--        <h1 class="system-name">珠海百智科技</h1>-->
      <!--      </router-link>-->
      <div class="logo">
        <router-link to="/">
          <img width="32" src="@/assets/biz-logo.png" alt="logo" />
          <!-- <img width="32" src="@/assets/img/logo.png" /> -->
          <h1>珠海百智科技</h1>
        </router-link>
      </div>

      <!-- 菜单 -->
      <MenuTree :collapsed="collapsed" />
    </a-layout-sider>

    <!-- 头部及主题内容部分 -->
    <a-layout>
      <a-layout-header v-show="!fixedTabs"
                       style="box-shadow: 0 2px 8px rgba(0,0,0,0.25); background: #fff;display: flex;justify-content: space-between;padding: 0 1rem;">
        <div style="display: inline-flex;align-items: center;">
          <a-icon style="line-height: 0" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                  @click="() => (collapsed = !collapsed)" />
          <bread-crumb />
        </div>
        <Header />
      </a-layout-header>
      <a-layout-content style="margin: 10px 24px 0;display: flex;flex-direction: column;">
        <TabsView />
        <Footer />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import Header from 'components/layouts/header/Header.vue';
import Footer from 'components/layouts/footer/Footer';
import MenuTree from 'components/menu/MenuTree';

import TabsView from 'components/layouts/tab/TabsView';
import { mapMutations, mapState } from 'vuex';
import { routes } from '@/router';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';

export default {
  name: 'HomePage',
  components: { BreadCrumb, Header, TabsView, Footer, MenuTree },
  data() {
    return {
      collapsed: false,
      routes: routes[0].children,
      breadcrumbPath: ''
    };
  },
  computed: {
    ...mapState('setting', ['fixedTabs'])
  }
};
</script>
<style lang="less">
#components-layout-demo-custom-trigger {
  height: 100vh;
  overflow: auto;
  min-width: 1280px;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo-and-title {
  height: 6.4rem;
  padding-left: 2.4rem;
  //background: #053434;
  color: white;
  display: flex;
  align-items: center;

  .system-name {
    flex: 1;
    font-size: 2rem;
    color: #fff;
    margin-left: 1.2rem;
  }
}

.side-menu {
  min-height: 100vh;
  overflow-y: auto;
  z-index: 10;

}

.logo {
  height: 64px;
  //position: relative;
  line-height: 64px;
  padding-left: 24px;
  transition: all .3s;
  overflow: hidden;

  h1 {
    font-size: 20px;
    margin: 0 0 0 12px;
    display: inline-block;
    vertical-align: middle;
    color: white;
  }

  img {
    width: 32px;
    vertical-align: middle;
  }
}
</style>
