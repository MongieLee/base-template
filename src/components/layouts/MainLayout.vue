<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null"
                    collapsible>
      <div class="logo">
        <img style="width: 32px" src="@/assets/biz-logo.png">
        <router-link to="/dashboard">
          <div class="system-name">珠海妇幼</div>
        </router-link>
      </div>
      <MenuTree :menu-tree="menuData" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        style="
          background: #fff;
          display: flex;
          justify-content: space-between;
          padding: 0 1rem;
        "
      >
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <a-breadcrumb style="border:1px solid red;display: flex;align-items: center">
          <a-breadcrumb-item href="">
            <a-icon type="home" />
          </a-breadcrumb-item>
          <a-breadcrumb-item href="">
            <a-icon type="user" />
            <span>Application List</span>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            Application
          </a-breadcrumb-item>
        </a-breadcrumb>
        <div>
          <Header />
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 24px 0',
          background: '#fff',
        }">
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

export default {
  name: 'HomePage',
  components: { Header, TabsView, Footer, MenuTree },
  data() {
    return {
      collapsed: false,
      routes: routes[0].children,
      breadcrumbPath: '',
      menuData: []
    };
  },
  created() {
    this.correctContentHeight({ height: 160 });
    this.getMenuTree()
  },
  computed: {
    menuWrapperWidth() {
      return `${this.collapsed ? 80 : 256}px`;
    }
  },
  methods: {
    ...mapMutations('setting', ['correctContentHeight']),
    async getMenuTree() {
      const { data } = await MenuService.getMenuTree();
      this.menuData = data;
    }
  }
};

</script>
<style lang="less">
#components-layout-demo-custom-trigger {
  height: 100vh;
  overflow: auto;
  min-width: 960px;
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

#components-layout-demo-custom-trigger .logo {
  height: 6.4rem;
  padding-left: 2.4rem;
  background: #053434;
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
