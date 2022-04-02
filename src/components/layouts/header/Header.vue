<template>
  <div>
    <a-dropdown>
      <div class="header-avatar">
        <span>{{user.username}}</span>
        <a-avatar class="avatar" size="large" shape="circle" icon="user"
                  :src="user.avatar" />
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
import HeaderAvatar from "./HeaderAvatar.vue";
import { clearAuthToken } from "utils/token";
import {mapActions,mapState} from 'vuex'
export default {
  components: { HeaderAvatar },
  data() {
    return {
      test: false,
    };
  },
  created(){
    this.fetchUserInfo();
  },
  computed:{
    ...mapState('auth',['user'])
  },
  methods: {
    ...mapActions('auth',['fetchUserInfo']),
    logout() {
      clearAuthToken();
      this.$router.push({ name: "Login" });
    },
  },
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
</style>
