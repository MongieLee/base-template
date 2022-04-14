<template>
  <div style="color:white">
    <a-menu v-if="menuTree && menuTree.length" theme="dark" mode="inline" @click="to"
            :defaultOpenKeys="openKeys" :selectedKeys="selectedKeys">
      <template v-for="menu in menuTree">
        <!--        {{menu.children.length}}-->
        <template v-if="menu.visible">
          <a-menu-item v-if="!menu.children.length" :key="menu.path">
            <a-icon :type="menu.icon || 'bug'" />
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

const linkReg = new RegExp(/^http(s)?:\/\/\w+/);

export default {
  name: 'MenuTree',
  components: { ChildMenu },
  created() {
    this.getMenuTree();
    this.getDefault();
  },
  data() {
    return {
      selectedKeys: [],
      openKeys: [],
      menuTree: []
    };
  },
  methods: {
    getDefault() {
      this.selectedKeys = [this.$route.path];
      const { matched } = this.$route;
      const index = matched.findIndex(i => i.path === this.$route.path);
      this.openKeys = matched.slice(0, index).reduce((p, n) => {
        if (n.path) p.push(n.path);
        return p;
      }, []);
    },
    async getMenuTree() {
      const jwtPayload = localStorage.getItem(__auth_token_key__).split('.')[1];
      const parse = JSON.parse(atob(jwtPayload));
      const userId = parse.userId;
      const { data } = await MenuService.getMenuTree();
      // const { data } = await RoleService.getUserMenus(userId)
      this.menuTree = data;
      const result = [];
      this.setPermissionKeys(data, result);
      console.log(result);
      console.log(this.$store);
      this.$store.commit('auth/updatePermissionCollection', { permissionCollection: result });
    },
    setPermissionKeys(list, result) {
      list.map(i => {
        if (i.children.length) {
          i.children.map(c => {
            if (c.permission) {
              result.push(c.permission);
            }
            if (c.children.length) {
              this.setPermissionKeys(c.children, result);
            }
          });
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