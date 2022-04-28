<template>
  <div class="fixed-height-wrapper">
    <table-wrapper @change="tableChange" :data-source="listData" :columns="columns" :pagination="pagination"
                    :loading="tableLoading" @table:refresh="tableRefresh">
      <template slot="header">
        <div ref="search" class="action-container">
        </div>
        <div class="table-page-search-wrapper">
          <a-form ref="queryForm" layout="inline">
            <a-row :gutter="48">
              <a-col :md="6" :sm="24">
                <a-form-item label="账号">
                  <a-input v-model="queryForm.username" placeholder="可输入账号搜索" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="昵称">
                  <a-input v-model="queryForm.nickname" placeholder="可输入昵称搜索" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="创建时间">
                  <a-date-picker style="width: 100%" v-model="queryForm.createdAt" placeholder="可按照创建时间搜索" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-model-item label="用户角色" prop="roleIds">
                  <a-select placeholder="可按照角色搜索" :options="roleSelectList" allowClear
                            v-model="queryForm.roleId" />
                </a-form-model-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="账号状态">
                  <a-select allowClear placeholder="可按照账号状态搜索" :options="[{key:true,label:'正常'},{key:false,label:'禁用'}]"
                            v-model="queryForm.status" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="addRecord" style="margin-right: 1em">添加</a-button>
                <a-button type="primary" @click="getList">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQueryForm">重置</a-button>
              </span>
              </a-col>
            </a-row>
          </a-form>
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
          <a-form-model-item label="昵称" prop="nickname">
            <a-input placeholder="请输入昵称" v-model="modalForm.nickname" />
          </a-form-model-item>
          <a-form-model-item label="密码" prop="password">
            <a-input type="password" placeholder="请输入密码" v-model="modalForm.password" />
          </a-form-model-item>
          <a-form-model-item label="确认密码" prop="verifyPassword">
            <a-input type="password" placeholder="请输入确认密码" v-model="modalForm.verifyPassword" />
          </a-form-model-item>
          <a-form-model-item label="头像">
            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :before-upload="uploadAvatar"
            >
              <img style="height: 100%;width: 100%;" v-if="modalForm.avatar" alt="avatar" :src="modalForm.avatar">
              <div v-else>
                <a-icon :type="avatarLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传头像
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
import { columns } from './config';
import _ from 'lodash';
import MenuService from 'services/menu';
import UserService from 'services/system/user';
import AuthService from 'services/auth';
import FileService from 'services/file';
import RoleService from 'services/system/role';

const rules = {
  username: [
    { required: true, trigger: 'change', message: '请输入用户名' }
  ],
  password: [
    { required: true, trigger: 'change', message: '请输入密码' }
  ],
  verifyPassword: [
    { required: true, trigger: 'change', message: '请输入确认密码' }
  ]
};
const getOriginForm = () => ({
  username: undefined, // 用户名
  nickname: undefined, // 昵称
  password: undefined, // 密码
  verifyPassword: undefined, // 确认密码
  avatar: undefined // 头像
});

const getQueryForm = () => ({
  username: undefined, // 用户名
  nickname: undefined, // 昵称
  roleId: undefined, // 角色
  createdAt: null, // 创建时间
  status: undefined // 状态
});

export default {
  name: 'User',
  data() {
    return {
      queryForm: getQueryForm(),
      modalForm: getOriginForm(),
      columns,
      listData: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10
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
      },
      rules: {
        username: [
          { required: true, trigger: 'change', message: '请输入用户名' }
        ],
        nickname: [
          { required: true, trigger: 'change', message: '请输入昵称' }
        ],
        password: [
          { required: true, trigger: 'change', message: '请输入密码' }
        ],
        verifyPassword: [
          { required: true, trigger: 'change', message: '请输入确认密码' },
          {
            validator: (rule, value, callback) => {
              // 需要拿表达数据，所以需要写在组件内通过this获取
              if (value !== this.modalForm.password) {
                callback(new Error('两次输入的密码不一致'));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ]
      }
    };
  },
  computed: {
    ...mapState('setting', ['contentHeight'])
  },
  created() {
    this.getList();
    RoleService.getAll().then(roleList => {
      this.roleSelectList = roleList.map(i => ({ key: i.id, label: i.name }));
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
        const { records, total } = await UserService.getList({
          page: this.pagination.current,
          pageSize: this.pagination.pageSize
        });
        this.listData = records;
        this.pagination.total = total;
      } finally {
        this.tableLoading = false;
      }
    },
    tableChange({ current, pageSize }) {
      this.pagination.current = current;
      this.pagination.pageSize = pageSize;
      this.getList();
    },
    allotRole(data) {
      this.modalForm = _.cloneDeepWith(data);
      this.roleVisible = true;
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
      this.modalForm.avatar = res.path;
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
            await AuthService.register(this.modalForm);
            this.$message.success('注册成功');
          } else {
            await UserService.updateUser(this.modalForm);
            this.$message.success('修改成功');
          }
        } finally {
          this.confirmLoading = false;
          this.modalCancel();
          this.getList();
        }
      });
    },
    tableRefresh() {
      // this.$message.error(1)
      this.getList();
    },
    resetQueryForm() {
      this.queryForm = getQueryForm();
      this.getList();
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
          await UserService.deleteUser(id);
          this.$message.success('删除成功');
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


.avatar-uploader > .ant-upload {
  width: 300px;
  height: 300px;
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
