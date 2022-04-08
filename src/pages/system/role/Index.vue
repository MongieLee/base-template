<template>
  <div class="container" :style="`height: calc(100vh - ${contentHeight}px)`">
    <table-wrapper @change="tableChange" :data-source="listData" :columns="columns" :pagination="pagination"
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
        <a class="red-text" @click="deleteRecord(data)">
          <a-icon type="delete" />
          删除</a>
      </template>
    </table-wrapper>
    <a-modal okText="保存 " :title="modalTitle" :visible="modalVisible" @ok="submitModal" @cancel="modalCancel"
             :maskClosable="false" width="70%" :confirmLoading="confirmLoading">
      <form>
        <a-form-model :model="modalForm" :rules="rules" ref="ruleForm"
                      v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }">
          <a-form-model-item label="资源名称" prop="name">
            <a-input placeholder="请输入资源名称" v-model="modalForm.name" />
          </a-form-model-item>
          <a-form-model-item label="资源地址" prop="url">
            <a-input placeholder="请输入资源地址" v-model="modalForm.url" />
          </a-form-model-item>
          <a-form-model-item label="资源描述" prop="description">
            <a-input placeholder="请输入资源描述" v-model="modalForm.description" />
          </a-form-model-item>
          <a-form-model-item label="所属分类" prop="categroyId">
            <a-tree-select allowClear v-model="modalForm.categroyId" placeholder="可选择所属分类"
                           :replaceFields="{title:'name',key:'id',value:'id'}" :tree-data="menuTree" />
          </a-form-model-item>
        </a-form-model>
      </form>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { columns, rules } from './config';
import ResourceService from 'services/system/resource';
import _ from 'lodash';
import MenuService from 'services/menu';

const getOriginForm = () => ({
  name: undefined,
  url: undefined,
  description: undefined,
  categroyId: undefined
});
export default {
  name: 'Menu',
  data() {
    return {
      modalForm: getOriginForm(),
      rules,
      columns,
      listData: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 5
      },
      tableLoading: false,
      modalTitle: '弹窗',
      modalVisible: false,
      confirmLoading: false,
      menuTree: []
    };
  },
  computed: {
    ...mapState('setting', ['contentHeight'])
  },
  created() {
    this.getMenuTree();
    this.getList();
  },
  methods: {
    getMenuTree() {
      MenuService.getMenuTree().then(({ data }) => {
        this.menuTree = data;
      });
    },
    async getList() {
      this.tableLoading = true;
      try {
        const { data: { records, total } } = await ResourceService.getList({
          page: this.pagination.current,
          pageSize: this.pagination.pageSize
        });
        this.listData = records;
        this.pagination.total = total;
      } finally {
        this.tableLoading = false;
      }
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
            res = await ResourceService.createResource(this.modalForm);
          } else {
            res = await ResourceService.updateResource(this.modalForm);
          }
          this.$message.success(res.msg);
        } finally {
          this.confirmLoading = false;
          this.modalCancel();
          this.getList();
        }
      });
    },
    modalCancel() {
      // this.$refs.ruleForm.clearValidate();
      this.$refs.ruleForm.resetFields();
      // this.modalForm = getOriginForm();
      this.modalVisible = false;
    },

    editRecord(data) {
      this.modalForm = _.cloneDeep(data);
      this.modalVisible = true;
    },
    async deleteRecord({ id, name }) {
      this.$modal.confirm({
        title: `确定要删除菜单【${name}】吗`,
        content: '该操作不可逆',
        onOk: () => {
          this.tableLoading = true;
          ResourceService.deleteResource(id).then(res => {
            this.$message.success(res.msg);
            this.getList();
          });
        },
        onCancel: () => {
          this.$message.info('已取消删除操作');
        }
      });
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