<template>
  <a-card title="分配资源权限" style="border-bottom: none">
    <a-button slot="extra" @click="$router.back()">返回</a-button>
    <a-tree
      @check="itemChecked"
      v-if="menuTree.length"
      v-model="checkedKeys" :replaceFields="{key:'id',title:'name'}"
      checkable defaultExpandAll
      :tree-data="menuTree"
      :selectable="false"
    />
    <a-divider></a-divider>
    <a-button @click="resetTree" :loading="loading" style="margin-right: 1rem">清空</a-button>
    <a-button @click="save" type="primary" :loading="loading">保存权限</a-button>
  </a-card>
</template>

<script>
import MenuService from 'services/menu';
import RoleService from 'services/system/role';
import { mapState } from 'vuex';

export default {
  name: 'AllotMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      menuTree: [],
      checkedKeys: [],
      loading: false,
      finalSelectedList: []
    };
  },
  async created() {
    await this.getMenuTree();
    await this.getMenuByRoleId();
    console.log(this.$route);
  },
  computed: {
    ...mapState('setting', ['contentHeight'])
  },
  methods: {
    async getMenuByRoleId() {
      const { data } = await RoleService.getMenusByRoleId(this.roleId);
      this.checkedKeys = data;
      this.finalSelectedList = data;
      console.log(`this.menuTree`);
      console.log(this.menuTree);
      console.log(this.checkedKeys);
      // this.menuTree.forEach(item => {
      //   let index;
      //   if ((index = this.checkedKeys.findIndex(i => i === item.id)) > 0) {
      //     console.log(item.children.map(value => value.id).every(i => this.checkedKeys.includes(i)));
      //     if (!item.children.map(value => value.id).every(i => this.checkedKeys.includes(i))) {
      //       console.log('需要删除父级id');
      //       this.checkedKeys.splice(index, 1);
      //     }
      //   }
      // });
      this.cleanHalfParentId();
      console.log(`this.menuTree`);
    },
    /**
     * antd Tree组件的回显规则是，如果给了父级id，则会将所有子级选中，由于后端返回的菜单id数组中，即使没有全选子级也会返回父级id
     * 需要对数据进行清洗，把不符合规则的父级id剔除进行复原的回显操作
     * 1. 递归菜单树
     * 2. 如果当前遍历菜单在回显的菜单id数组中，并且有子级则进行清洗处理
     *    - 如果当前遍历菜单有子级并且子级id并不是全部都在回显的菜单id数组中，需要从回显id数组中剔除
     *    - 如果有一项子级，且子级的id在回显id数组中，子级也存在子级。则需要从回显id数组中剔除
     * @param source
     * @param treeIds
     */
    cleanHalfParentId(source = this.menuTree, treeIds = this.checkedKeys) {
      source.forEach(item => {
        let index;
        if ((index = treeIds.findIndex(i => i === item.id)) > 0 && item.children.length) {
          if (!item.children.map(value => value.id).every(i => treeIds.includes(i))) {
            this.checkedKeys.splice(index, 1);
            console.log(`父级id${item.id + item.name}被删除了`);
          }
          if (item.children.length === 1 && treeIds.includes(item.children[0].id)
            && item.children[0].children.length) {
            this.checkedKeys.splice(treeIds.findIndex(i => i === item.id), 1);
            console.log(`父级id${item.id + item.name}被删除了`);
          }
          this.cleanHalfParentId(item.children);
        }
      });
    },

    async getMenuTree() {
      const { data } = await MenuService.getMenuTree();
      this.menuTree = data;
    },
    async save() {
      this.loading = true;
      try {
        await RoleService.saveRoleMenus({
          roleId: this.roleId,
          roleMenus: this.finalSelectedList
        });
        this.$message.success('保存角色权限菜单成功!');
      } finally {
        this.loading = false;
        this.finalSelectedList = [];
      }
    },
    resetTree() {
      this.checkedKeys = [];
    },
    itemChecked(checkedKeys, { halfCheckedKeys }) {
      // 存到数据中时需要将未全选的父级节点的id一并传入
      // halfCheckedKeys中如果非全选则会有值，否则为空数组
      this.finalSelectedList = [...checkedKeys, ...halfCheckedKeys];
    }
  }
};
</script>

<style scoped>

</style>

