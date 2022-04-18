<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <!-- 侧边栏 -->
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible :width="256">
      <!-- 公司Logo和名称 -->
      <router-link to="/dashboard" class="logo-and-title">
        <img style="width: 32px" src="@/assets/biz-logo.png">
        <div class="system-name">珠海妇幼</div>
      </router-link>
      <!-- 菜单 -->
      <MenuTree :collapsed="collapsed" />
    </a-layout-sider>

    <!-- 头部及主题内容部分 -->
    <a-layout>
      <a-layout-header style="background: #fff;display: flex;justify-content: space-between;padding: 0 1rem;">
        <div style="display: inline-flex;align-items: center;">
          <a-icon style="line-height: 0" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                  @click="() => (collapsed = !collapsed)" />
          <bread-crumb />
        </div>
        <div>
          <Header />
        </div>
      </a-layout-header>
      <a-layout-content :style="{margin: '24px 24px 0'}">
        <!--        <a-layout-content :style="{margin: '24px 24px 0',background: '#fff',}">-->
        <TabsView />
      </a-layout-content>
      <a-layout-footer style="padding:0">
        <Footer />
      </a-layout-footer>
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
import MenuService from 'services/menu';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { __auth_token_key__ } from 'utils/token';
import RoleService from 'services/system/role';

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
    this.correctContentHeight({ height: 160 });
  },
  computed: {
    menuWrapperWidth() {
      return `${this.collapsed ? 80 : 256}px`;
    }
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
