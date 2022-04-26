<template>
  <div class="wrapper">
    <div class="header-avatar">
      <a-icon @click="fullScreenHandler" style="font-size: 2.2rem"
              :type="fullscreenIconStatus?`fullscreen-exit`:`fullscreen`"></a-icon>
    </div>
    <a-dropdown trigger="click">
      <div class="header-avatar">
        <a-badge count="5">
          <a-icon style="font-size: 2.2rem"
                  type="bell"></a-icon>
        </a-badge>
      </div>
      <div slot="overlay" style="background: white;padding: 0 2rem 1rem;box-shadow: 1px 0 1px 1px rgba(0,0,0,0.1)" >
        <a-tabs default-active-key="1" >
          <a-tab-pane key="1" tab="Tab 1">
            Content of Tab Pane 1
          </a-tab-pane>
          <a-tab-pane key="2" tab="Tab 2" force-render>
            Content of Tab Pane 2
          </a-tab-pane>
          <a-tab-pane key="3" tab="Tab 3">
            Content of Tab Pane 3
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-dropdown>
    <a-dropdown>
      <div class="header-avatar">
        <span>{{ user && user.username }}</span>
        <a-avatar class="avatar" size="large" shape="circle" icon="user"
                  :src="user && user.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'" />
      </div>
      <a-menu class="avatar-menu" slot="overlay">
        <a-menu-item @click="$router.push({name:'userInfo'})">
          <a-icon type="user" />
          <span>个人中心</span>
        </a-menu-item>
        <a-menu-item @click="logout">
          <a-icon type="poweroff" />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { clearAuthToken } from 'utils/token';
import { mapActions, mapState } from 'vuex';
import { exitFullScreen, isFullScreen, openFullScreen } from 'utils/fullscreen';

export default {
  data() {
    return {
      fullscreenIconStatus: false
    };
  },
  created() {
    this.fetchUserInfo();
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    ...mapActions('auth', ['fetchUserInfo']),
    logout() {
      clearAuthToken();
      this.$router.push({ name: 'Login' });

    },
    inspectFullscreenEnabled() {
      return (document);
    },
    fullScreenHandler() {
      if (isFullScreen()) {
        this.fullscreenIconStatus = false;
        exitFullScreen();
      } else {
        this.fullscreenIconStatus = true;
        openFullScreen();
        console.log(2);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.header-avatar {
  padding: 0 1.2rem;
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.025);
  }

  .avatar {
    margin-right: 1rem;
    margin-left: 1rem;
  }
}

.avatar-menu {
  width: 15rem;
}

.wrapper {
  display: flex;
}
</style>
