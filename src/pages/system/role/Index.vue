<template>
  <div class="container" :style="`height: calc(100vh - ${contentHeight}px)`">
    <table-wrapper @change="tableChange" :data-source="listData" :columns="columns" :pagination="pagination"
                   :loading="tableLoading">
      <template slot="header">
        <div ref="search" class="action-container">
          <a-button type="primary" @click="addRecord" style="margin-right: 1em">添加
          </a-button>
        </div>
      </template>
      <template slot="operate" slot-scope="data">
        <a @click="editRecord(data)">
          <a-icon type="edit"/>
          编辑</a>
        <simple-bar/>
        <a @click="allotMenu(data)">
          分配菜单</a>
        <simple-bar/>
        <a @click="allotMenu(data)">
          分配资源</a>
        <simple-bar/>
        <a class="red-text" @click="deleteRecord(data)">
          <a-icon type="delete"/>
          删除</a>
      </template>
    </table-wrapper>
    <a-modal okText="保存 " :title="modalTitle" :visible="modalVisible" @ok="submitModal" @cancel="modalCancel"
             :maskClosable="false" width="70%" :confirmLoading="confirmLoading">
      <form>
        <a-form-model :model="modalForm" :rules="rules" ref="ruleForm"
                      v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }">
          <a-form-model-item label="角色名称" prop="name">
            <a-input placeholder="请输入角色名称" v-model="modalForm.name"/>
          </a-form-model-item>
          <a-form-model-item label="角色编码" prop="code">
            <a-input placeholder="请输入角色编码" v-model="modalForm.code"/>
          </a-form-model-item>
          <a-form-model-item label="角色描述" prop="description">
            <a-textarea :rows="5" allow-clear placeholder="请输入角色描述" v-model="modalForm.description"/>
          </a-form-model-item>
        </a-form-model>
      </form>
    </a-modal>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {columns, rules} from './config';
import RoleService from 'services/system/role';
import _ from 'lodash';

const getOriginForm = () => ({
  name: undefined,
  code: undefined,
  description: undefined,
});
export default {
  name: 'Role',
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
    this.getList();
  },
  methods: {
    allotMenu({id: roleId}) {
      this.$router.push({
        name: "allotMenu",
        params: {roleId}
      })
    },
    async getList() {
      this.tableLoading = true;
      try {
        const {data: {records, total}} = await RoleService.getList({
          page: this.pagination.current,
          pageSize: this.pagination.pageSize
        });
        this.listData = records;
        this.pagination.total = total;
      } finally {
        this.tableLoading = false;
      }
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
            res = await RoleService.createRole(this.modalForm);
          } else {
            res = await RoleService.updateRole(this.modalForm);
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
      this.modalTitle = "编辑角色"
      this.modalVisible = true;
    },
    async deleteRecord({id, name}) {
      this.$modal.confirm({
        title: `确定要删除菜单【${name}】吗`,
        content: '该操作不可逆',
        onOk: () => {
          this.tableLoading = true;
          RoleService.deleteRole(id).then(res => {
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
      this.modalTitle = "新增角色";
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
