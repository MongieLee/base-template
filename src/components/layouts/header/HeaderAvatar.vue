<template>
  <a-dropdown>
    <div class="header-avatar">
      <span>{{ user && user.username }}</span>
      <a-avatar class="avatar" size="large" shape="circle"
                :src="user && user.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'" />
    </div>
    <a-menu class="avatar-menu" slot="overlay">
      <a-menu-item @click="logout">
        <a-icon type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapState('settings', ['user'])
  },
  methods: {
    ...mapActions('auth', ['fetUserInfo', 'logout'])
  }
};
</script>

<style lang="less" scoped>

</style>