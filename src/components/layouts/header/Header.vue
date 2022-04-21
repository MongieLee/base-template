<template>
  <div class="wrapper">
    <div class="header-avatar">
      <a-icon @click="fullScreenHandler" style="font-size: 2.4rem"
              :type="fullscreenIconStatus?`fullscreen-exit`:`fullscreen`"></a-icon>
    </div>
    <a-dropdown>
      <div class="header-avatar">
        <span>{{ user && user.username }}</span>
        <a-avatar class="avatar" size="large" shape="circle" icon="user"
                  :src="user.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'" />
      </div>
      <a-menu class="avatar-menu" slot="overlay">
        <a-menu-item @click="logout">
          <a-icon type="poweroff" />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <HeaderAvatar v-if="test" />
  </div>
</template>

<script>
import HeaderAvatar from './HeaderAvatar.vue';
import { clearAuthToken } from 'utils/token';
import { mapActions, mapState } from 'vuex';
import { exitFullScreen, isFullScreen, openFullScreen } from 'utils/fullscreen';

export default {
  components: { HeaderAvatar },
  data() {
    return {
      test: false,
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
