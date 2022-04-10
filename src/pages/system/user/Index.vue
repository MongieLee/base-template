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
      <template slot="avatar" slot-scope="{data}">
        <a-avatar
          :src="data || 'https://img1.baidu.com/it/u=4054175603,836973543&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=422'"></a-avatar>
      </template>
      <template slot="operate" slot-scope="data">
        <point :status="data.status" />
        <a @click="changeStatus(data)">
          {{ data.status ? '封号' : '启用' }}</a>
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
          <a-form-model-item label="用户名" prop="name">
            <a-input placeholder="请输入用户名" v-model="modalForm.name" />
          </a-form-model-item>
          <a-form-model-item label="密码" prop="password">
            <a-input type="password" placeholder="请输入密码" v-model="modalForm.password" />
          </a-form-model-item>
          <a-form-model-item label="确认密码" prop="verifyPassword">
            <a-input placeholder="请输入确认密码" v-model="modalForm.verifyPassword" />
          </a-form-model-item>
        </a-form-model>
      </form>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { columns, rules } from './config';
import _ from 'lodash';
import MenuService from 'services/menu';
import UserService from 'services/system/user';
import Point from './components/Point';

const getOriginForm = () => ({
  username: undefined,
  password: undefined,
  verifyPassword: undefined
});
export default {
  name: 'Menu',
  components: { Point },
  data() {
    return {
      modalForm: getOriginForm(),
      rules,
      columns,
      listData: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20
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
        const { data: { records, total } } = await UserService.getList({
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
            res = await UserService.createResource(this.modalForm);
          } else {
            res = await UserService.updateResource(this.modalForm);
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
          UserService.deleteResource(id).then(res => {
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
    },
    async changeStatus({ status, username, id: userId }) {
      this.tableLoading = true;
      try {
        await UserService.changeStatus({ status: status ? 0 : 1, userId });
        this.$message.success(`用户【${username}】状态已设为${status ? '禁用' : '启用'}`);
        this.getList();
      } catch {
        this.tableLoading = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  padding: 12px;
}
</style>
