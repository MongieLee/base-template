<template>
  <div style="color:white;">
    <a-menu v-if="menuTree && menuTree.length" theme="dark" mode="inline" @click="to"
            :openKeys="openKeys" :selectedKeys="selectedKeys" @update:openKeys="changeOpen">
      <!-- collapsed ? [] : openKeys"的作用是取消收缩时会弹出子级菜单的默认行为，openKeys为空便不会再展开 -->
      <template v-for="menu in menuTree">
        <!--        {{menu.children.length}}-->
        <template v-if="menu.visible">
          <a-menu-item v-if="!menu.children.length || menu.menuType === menuTypeEnum.C" :key="menu.path">
            <a-icon :type="menu.icon || 'none'" />
            <span>{{ menu.name }}</span>
          </a-menu-item>
          <child-menu :key="menu.path" v-else :menu="menu" />
        </template>
      </template>
    </a-menu>
  </div>
</template>

<script>
import ChildMenu from 'components/menu/ChildMenu';
import { __auth_token_key__ } from 'utils/token';
import MenuService from 'services/menu';
import { menuTypeEnum } from 'pages/menu/config';
import RoleService from 'services/system/role';
import AuthService from 'services/auth';

// 正则匹配是否外链
const linkReg = new RegExp(/^http(s)?:\/\/\w+/);

export default {
  name: 'MenuTree',
  components: { ChildMenu },
  props: {
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  created() {
    this.getMenuTree();
    this.getSelectedAndOpeKeys();
  },
  data() {
    return {
      selectedKeys: [],
      openKeys: [],
      cacheOpenKeys: [],
      menuTree: [],
      menuTypeEnum
    };
  },
  watch: {
    $route() {
      // route变化则更新高亮菜单和展开的父级菜单
      this.getSelectedAndOpeKeys();
    },
    collapsed(newValue) {
      // 收缩时，清空所有展开的菜单
      // 展开时，恢复之前的展开菜单
      if (newValue) {
        this.cacheOpenKeys = this.openKeys;
        this.openKeys = [];
      } else {
        this.openKeys = this.cacheOpenKeys;
      }
    }
  },
  methods: {
    getSelectedAndOpeKeys() {
      this.selectedKeys = [this.$route.path];
      const { matched } = this.$route;
      const index = matched.findIndex(i => i.path === this.$route.path);
      this.openKeys = matched.slice(0, index).reduce((p, n) => {
        if (n.path) p.push(n.path);
        return p;
      }, []);
    },
    async getMenuTree(values) {
      const jwtPayload = localStorage.getItem(__auth_token_key__).split('.')[1];
      const parse = JSON.parse(atob(jwtPayload));
      const userId = parse.userId;
      // const  data = await MenuService.getMenuTree();
      const data = await RoleService.getUserMenus(userId);
      // TODO 接口暂时没有返回权限ID
      const { roleId } = await AuthService.getUserInfo();
      // if (!roleId) {
      //   this.handlerUserNotRole();
      //   return;
      // }
      this.menuTree = data;
      const result = [];
      this.setPermissionKeys(data, result);
      this.$store.commit('auth/updatePermissionCollection', result);
    },
    changeOpen(openKeys) {
      this.openKeys = openKeys;
    },
    handlerUserNotRole() {
      console.log(this.$notification);
      this.$notification.warning({
        message: '权限提示',
        description: '当前用户没有设置角色，系统仅显示默认面板，如需要请联系管理员'
      });
      // 如果没有角色，则只展示数据看板
      this.menuTree = [{
        icon: 'bug',
        menuType: 'C',
        name: '数据看板',
        path: '/dashboard',
        visible: true,
        children: []
      }];
    },
    setPermissionKeys(list, result) {
      list.forEach(item => {
        console.log(item);
        if (item.children.length) {
          this.setPermissionKeys(item.children, result);
        } else {
          if (item.permission) {
            result.push(item.permission);
          }
        }
      });
    },
    to({ key }) {
      if (linkReg.test(key)) {
        window.open(key);
      } else {
        this.$router.push(key);
        this.selectedKeys = [key];
      }
    }
  }
};
</script>

<style scoped>

</style>