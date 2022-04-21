<template>
  <div class="container2">
    <table-wrapper @change="tableChange" :data-source="listData" :columns="columns" :pagination="pagination"
                   :row-class-name="tableRowClass" :loading="tableLoading">
      <template slot="header">
        <div ref="search" class="action-container">
          <a-button type="primary" @click="addRecord" style="margin-right: 1em">添加</a-button>
        </div>
      </template>
      <template slot="avatar" slot-scope="{data}">
        <a-avatar
          :src="data || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'"></a-avatar>
      </template>
      <template slot="status" slot-scope="{data}">
        <a-tag :color="data?`green`:`red`">{{ data ? '正常' : '封号' }}</a-tag>
      </template>
      <template slot="operate" slot-scope="data">
        <a @click="changeStatus(data)">
          {{ data.status ? '封号' : '启用' }}</a>
        <simple-bar />
        <a @click="allotRole(data)">
          分配角色</a>
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
          <a-form-model-item label="用户名" prop="username">
            <a-input placeholder="请输入用户名" v-model="modalForm.username" />
          </a-form-model-item>
          <a-form-model-item label="密码" prop="password">
            <a-input type="password" placeholder="请输入密码" v-model="modalForm.password" />
          </a-form-model-item>
          <a-form-model-item label="确认密码" prop="verifyPassword">
            <a-input placeholder="请输入确认密码" v-model="modalForm.verifyPassword" />
          </a-form-model-item>
          <a-form-model-item label="头像">
            <a-upload class="avatar-uploader" :show-upload-list="false" :before-upload="uploadAvatar">
              <img v-if="modalForm.avatar" alt="avatar" :src="modalForm.avatar">
              <div v-else>
                <a-icon :type="avatarLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  Upload
                </div>
              </div>
            </a-upload>
          </a-form-model-item>
        </a-form-model>
      </form>
    </a-modal>

    <a-modal okText="保存" title="分配角色" :visible="roleVisible" @ok="allotRoles" @cancel="roleModalFromCancel"
             :maskClosable="false" width="70%" :confirmLoading="confirmLoading">
      <form>
        <a-form-model :model="modalForm" :rules="rules" ref="roleForm"
                      v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }">
          <a-form-model-item label="角色（可多选）" prop="roleIds">
            <a-select :options="roleSelectList" v-model="modalForm.roleIds" mode="multiple" />
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
import AuthService from 'services/auth';
import FileService from 'services/file';
import RoleService from 'services/system/role';

const getOriginForm = () => ({
  username: undefined,
  password: undefined,
  verifyPassword: undefined
});
export default {
  name: 'User',
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
      menuTree: [],
      avatarLoading: false,
      roleVisible: false,
      roleSelectList: [],
      roleForm: {
        roleIds: []
      }
    };
  },
  computed: {
    ...mapState('setting', ['contentHeight'])
  },
  created() {
    this.getList();
    RoleService.getAll().then(res => {
      this.roleSelectList = res.data.map(i => ({ key: i.id, label: i.name }));
    });
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
    allotRole(data) {
      this.modalForm = _.cloneDeepWith(data);
      this.roleVisible = true;
      console.log(data);
    },
    async allotRoles() {
      const { id: userId } = this.modalForm;
      const data = {
        userId,
        roleIds: this.modalForm.roleIds
      };
      try {
        await RoleService.bindRoles(data);
        this.$message.success('分配角色成功');
        this.getList();
      } finally {
        this.roleModalFromCancel();
      }
    },
    roleModalFromCancel() {
      this.roleVisible = false;
      this.modalForm = getOriginForm();
    },
    async uploadAvatar(file) {
      console.log(file);
      const allowFileTypes = ['image/jpeg', 'image/png'];
      if (!allowFileTypes.includes(file.type)) {
        this.$message.error('请上传jpg或png格式的图片');
        return;
      }
      this.avatarLoading = true;
      const res = await FileService.uploadFile(FileService.getFormData(file));
      console.log(res);
      this.avatarLoading = false;
      this.modalForm.avatar = res.data.path;
      return Promise.reject();
    },
    submitModal() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        try {
          let res;
          if (!this.modalForm.id) {
            Reflect.deleteProperty(this.modalForm, 'verifyPassword');
            res = await AuthService.register(this.modalForm);
          } else {
            res = await UserService.updateUser(this.modalForm);
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
    async deleteRecord({ id, username }) {
      this.$modal.confirm({
        title: `确定要删除用户【${username}】吗`,
        content: '该操作不可逆',
        onOk: async () => {
          this.tableLoading = true;
          const { msg } = await UserService.deleteUser(id);
          this.$message.success(msg);
          this.getList();
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
.container2 {
  height: 100%;
  position: absolute;
  background-color: #fff;
  padding: 1.2rem;
}

.avatar-uploader {
  border: 1px solid red;
}

.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
