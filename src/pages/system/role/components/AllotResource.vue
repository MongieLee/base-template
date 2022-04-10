<template>
  <a-card  title="分配菜单权限" style="border-bottom: none">
    <a-button slot="extra" @click="$router.back()">返回</a-button>
    <a-tree
        v-if="menuTree.length"
        v-model="checkedKeys" :replaceFields="{key:'id',title:'name'}"
        checkable defaultExpandAll
        :tree-data="menuTree"
    />
    <a-divider></a-divider>
    <a-button @click="resetTree" :loading="loading" style="margin-right: 1rem">清空</a-button>
    <a-button @click="save" type="primary" :loading="loading">保存权限</a-button>
  </a-card>
</template>

<script>
import MenuService from "services/menu";
import RoleService from "services/system/role"
import {mapState} from "vuex";

export default {
  name: "AllotMenu",
  props: {
    roleId: {
      type: [Number, String],
      required: true,
    }
  },
  data() {
    return {
      menuTree: [],
      checkedKeys: [],
      loading: false
    }
  },
  created() {
    console.log("allot menu")
    this.getMenuTree();
    this.getMenuByRoleId()
  },
  computed: {
    ...mapState('setting', ['contentHeight'])
  },
  methods: {
    async getMenuByRoleId() {
      const {data} = await RoleService.getMenusByRoleId(this.roleId)
      this.checkedKeys = data;
    },
    async getMenuTree() {
      const {data} = await MenuService.getMenuTree()
      this.menuTree = data;
    },
    async save() {
      this.loading = true;
      await RoleService.saveRoleMenus({
        roleId: this.roleId,
        roleMenus: this.checkedKeys
      })
      this.loading = false;
      this.$message.success("保存角色权限菜单成功!")
    },
    resetTree() {
      this.checkedKeys = []
    }
  }
}
</script>

