<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo">珠海妇幼</div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item @click="to(menu)" v-for="menu in routes" :key="menu.path">
          <a-icon type="user" />
          <span>{{ menu.name }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        style="
          background: #fff;
          display: flex;
          justify-content: space-between;
          padding: 0 0 0 1rem;
        "
      >
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <div>
          <Header />
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import Header from 'components/layouts/header/Header.vue';
import { mapMutations } from 'vuex';
import { routes } from '@/router';

export default {
  name: 'HomePage',
  components: { Header },
  data() {
    return {
      collapsed: false,
      routes: routes[0].children
    };
  },
  created() {
    this.correctContentHeight({ height: 160 });
  },
  methods: {
    ...mapMutations('setting', ['correctContentHeight']),
    to(menu) {
      this.$router.push(menu.path);
    }
  }
};

</script>
<style lang="less">
#components-layout-demo-custom-trigger {
  height: 100vh;
  overflow: auto;
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
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
