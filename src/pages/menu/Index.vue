<template>
  <div class="container" :style="`height: calc(100vh - ${contentHeight}px)`">
    <table-wrapper @change="tableChange" :data-source="menuTree" :columns="columns" :pagination="pagination"
                   :row-class-name="tableRowClass" :loading="tableLoading">
      <template slot="header">
        <div ref="search" class="action-container">
          <a-button type="primary" @click="addRecord" style="margin-right: 1em">添加
          </a-button>
        </div>
      </template>
      <template slot="operate" slot-scope="data">
        <a @click="editRecord(data)">
          <a-icon type="edit" />
          编辑</a>
        <simple-bar />
        <a-popconfirm title="确定移动至最前吗？" @confirm="moveToStart(data)">
          <a>
            <a-icon style="color: #1d8f20" type="vertical-align-top" />
          </a>
        </a-popconfirm>
        <simple-bar />
        <a-popconfirm title="确定上移一位吗？" @confirm="moveUp(data)">
          <a>
            <a-icon style="color: #1d8f20" type="up-square" />
          </a>
        </a-popconfirm>
        <simple-bar />
        <a-popconfirm title="确定下移一位吗？" @confirm="moveDown(data)">
          <a>
            <a-icon style="color: #efa828" type="down-square" />
          </a>
        </a-popconfirm>
        <simple-bar />
        <a-popconfirm title="确定移动至最后吗？" @confirm="moveToEnd(data)">
          <a>
            <a-icon style="color: #efa828" type="vertical-align-bottom" />
          </a>
        </a-popconfirm>
        <simple-bar />
        <a-dropdown :trigger="[`click`]">
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            更多
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a class="red-text" @click="deleteRecord(data)">
                <a-icon type="delete" />
                删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <template v-if="data.isRelease">
          <simple-bar />
          <a-icon style="color: #da7979" type="check" />
        </template>
      </template>
    </table-wrapper>
    <a-modal okText="保存 " :title="modalTitle" :visible="modalVisible" @ok="submitModal" @cancel="modalCancel"
             :maskClosable="false" width="70%" :confirmLoading="confirmLoading">
      <form>
        <a-form-model
          :model="modalForm"
          :rules="rules"
          ref="ruleForm"
          v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }"
        >
          <a-form-model-item label="菜单名" prop="name">
            <a-input placeholder="请输入菜单名" v-model="modalForm.name" />
          </a-form-model-item>
          <a-form-model-item label="路由或外链" prop="path">
            <a-input
              placeholder="请输入路由或外联"
              v-model="modalForm.path"
            />
          </a-form-model-item>
          <a-form-model-item label="父级菜单" prop="parentId">
            <a-tree-select allowClear v-model="modalForm.parentId" placeholder="可选择父级菜单"
                           :replaceFields="{title:'name',key:'id',value:'id'}" :tree-data="menuTree"></a-tree-select>
          </a-form-model-item>
        </a-form-model>
      </form>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { columns, rules } from './config';
import MenuService from 'services/menu';
import _ from 'lodash';

const getOriginForm = () => ({
  name: undefined,
  path: undefined,
  parentId: undefined
});
export default {
  name: 'Menu',
  data() {
    return {
      modalForm: getOriginForm(),
      rules,
      columns,
      menuTree: [],
      pagination: false,
      tableLoading: false,
      modalTitle: '弹窗',
      modalVisible: false,
      confirmLoading: false
    };
  },
  computed: {
    ...mapState('setting', ['contentHeight'])
  },
  created() {
    this.getMenuTree();
  },
  methods: {
    handlerTreeChild(tree) {
      return tree.map(item => {
        item?.children?.length ?
          this.handlerTreeChild(item.children) :
          Reflect.deleteProperty(item, 'children');
        return item;
      });
    },
    getMenuTree() {
      this.tableLoading = true;
      MenuService.getMenuTree().then(res => {
        console.log(res);
        this.menuTree = this.handlerTreeChild(res.data);
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    tableRowClass() {
    },
    tableChange() {
    },
    submitModal() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        try {
          let res;
          if (!this.modalForm.id) {
            res = await MenuService.createMenu(this.modalForm);
          } else {
            res = await MenuService.updateMenu(this.modalForm);
          }
          this.$message.success(res.msg);
        } finally {
          this.confirmLoading = false;
          this.getMenuTree();
          this.modalCancel();
        }
      });
    },
    modalCancel() {
      // this.$refs.ruleForm.clearValidate();
      this.$refs.ruleForm.resetFields();
      // this.modalForm = getOriginForm();
      this.modalVisible = false;
    },
    moveToEnd() {
    },
    moveToStart() {
    },
    editRecord(data) {
      this.modalForm = _.cloneDeep(data);
      this.modalVisible = true;
    },
    async deleteRecord({ id }) {
      this.$modal.confirm({
        title: '确定要删除所选菜单吗',
        content: '该操作不可逆',
        onOk: async (cancle) => {
          try {
            const res = await MenuService.deleteMenu(id);
            this.$message.success(res.msg);
          } finally {
            cancle()
            this.getMenuTree();
          }
        },
        onCancel() {
          console.log('Cancel');
        }
      });
    },
    moveUp() {
    },
    moveDown() {
    },
    addRecord() {
      this.modalVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  padding: 12px;
}

</style>