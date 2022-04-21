<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <!-- 侧边栏 -->
    <a-layout-sider style="box-shadow: 2px 0 3px 2px rgba(0,0,0,0.25);" v-model="collapsed" :trigger="null" :collapsible="true" :width="256">
      <!-- 公司Logo和名称 -->
      <router-link to="/dashboard" class="logo-and-title">
        <img style="width: 32px" src="@/assets/biz-logo.png" alt="company">
        <div class="system-name">珠海百智科技</div>
      </router-link>
      <!-- 菜单 -->
      <MenuTree :collapsed="collapsed" />
    </a-layout-sider>

    <!-- 头部及主题内容部分 -->
    <a-layout>
      <a-layout-header
        style="box-shadow: 0 2px 8px rgba(0,0,0,0.25); background: #fff;display: flex;justify-content: space-between;padding: 0 1rem;">
        <div style="display: inline-flex;align-items: center;">
          <a-icon style="line-height: 0" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                  @click="() => (collapsed = !collapsed)" />
          <bread-crumb />
        </div>
        <div>
          <Header />
        </div>
      </a-layout-header>
      <a-layout-content :style="{margin: '10px 24px 0'}">
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
import { mapMutations } from 'vuex';
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
  created() {
    this.correctContentHeight({ height: 144 });
  },
  methods: {
    ...mapMutations('setting', ['correctContentHeight'])
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
    font-size: 2rem;
    color: #fff;
    margin-left: 1.2rem;
  }
}
</style>
