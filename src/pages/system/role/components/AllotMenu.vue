<template>
  <div>
    <a-card title="分配资源权限" style="border-bottom: none">
      <a-button slot="extra" @click="$router.back()">返回</a-button>
      <a-tree
        @check="itemChecked"
        v-if="menuTree.length"
        v-model="checkedKeys" :replaceFields="{key:'id',title:'name'}"
        :checkable="true" defaultExpandAll
        :tree-data="menuTree"
        :selectable="false"
      />
      <a-divider></a-divider>
      <a-button @click="resetTree" :loading="loading" style="margin-right: 1rem">清空</a-button>
      <a-button @click="save" type="primary" :loading="loading">保存权限</a-button>
    </a-card>
  </div>
</template>

<script>
import MenuService from 'services/menu';
import RoleService from 'services/system/role';
import { mapState } from 'vuex';
import _ from 'lodash';

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
      finalSelectedList: [],
      xxx: []
    };
  },
  async created() {
    await this.getMenuTree();
    await this.getMenuByRoleId();
  },
  computed: {
    ...mapState('setting', ['contentHeight'])
  },
  methods: {
    async getMenuByRoleId() {
      const data = await RoleService.getMenusByRoleId(this.roleId);
      console.log(data);
      this.checkedKeys = (data);
      // this.finalSelectedList = data;
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
        if (treeIds.some(i => i === item.id)) {
          if (item.children.length) {
            this.cleanHalfParentId(item.children, treeIds);
          } else {
            this.xxx = [...this.xxx, item.id];
          }
        }
      });
      this.checkedKeys = this.xxx;
    },

    async getMenuTree() {
      this.menuTree = await MenuService.getMenuTree();
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

