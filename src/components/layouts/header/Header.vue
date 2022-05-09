<template>
  <div class="wrapper">
    <div class="header-avatar">
      <a-icon @click="fullScreenHandler" style="font-size: 1.8rem"
              :type="fullscreenIconStatus?`fullscreen-exit`:`fullscreen`"></a-icon>
    </div>
    <a-dropdown class="lang header-item" :overlayStyle="{width:'380px'}" :trigger="['click']"
                v-model="notificationVisible"
                placement="bottomLeft">
      <div class="header-avatar">
        <a-badge count="5">
          <a-icon style="font-size:1.8rem"
                  type="bell"></a-icon>
        </a-badge>
      </div>
      <div slot="overlay"
           style=";background: white;margin-top: 2px;border-radius:3px;box-shadow: 0 0 2px 3px rgba(0,0,0,.1);">
        <a-tabs class="dropdown-tabs" :tabBarStyle="{textAlign: 'center'}" :style="{width: '100%'}">
          <a-tab-pane tab="消息通知" key="1">
            <a-list class="tab-pane">
              <a-list-item :class="{delete:item.IsDone}"
                           v-for="item in [{title:123,Title:'123'},{title:123,Title:'123'}]" :key="item.id">
                <a-list-item-meta :title="item.Title" :description="item.Remark">
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane tab="消息通知" key="2">
            <a-list class="tab-pane">
              <a-list-item :class="{delete:item.IsDone}" v-for="item in [{title:123,Title:'123'}]" :key="item.id">
                <a-list-item-meta :title="item.Title" :description="item.Remark">
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane tab="消息通知" key="3">
            <a-list class="tab-pane">
              <a-list-item :class="{delete:item.IsDone}" v-for="item in [{title:123,Title:'123'}]" :key="item.id">
                <a-list-item-meta :title="item.Title" :description="item.Remark">
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-dropdown>
    <a-dropdown>
      <div class="header-avatar">
        <span>{{ user && user.nickname }}</span>
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
import { mapActions, mapMutations, mapState } from 'vuex';
import { exitFullScreen, isFullScreen, openFullScreen } from 'utils/fullscreen';

export default {
  data() {
    return {
      fullscreenIconStatus: false,
      notificationVisible: false
    };
  },
  created() {
    // this.fetchUserInfo();
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    ...mapActions('auth', ['fetchUserInfo']),
    ...mapMutations('auth', ['clearCacheTabs']),
    logout() {
      this.$modal.confirm({
        title: '确定注销并退出系统吗?',
        okText: '确定',
        cancelText: '取消',
        closable:true,
        onOk: () => {
          clearAuthToken();
          this.clearCacheTabs();
          this.$router.push({ path: '/login' });
        }
      });
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

.tab-pane {
  overflow: auto;
  min-height: 150px;
  max-height: 290px;
}

.ant-list-item {
  padding: 12px 24px;
}
</style>
