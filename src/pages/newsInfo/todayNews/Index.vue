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
                <a-form-item label="标题">
                  <a-input v-model="queryForm.title" placeholder="可输入标题搜索" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="发布状态">
                  <a-select allowClear placeholder="可按照账号状态搜索"
                            :options="[{key:true,label:'已发布'},{key:false,label:'未发布'}]"
                            v-model="queryForm.isPublish" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="昵称">
                  <a-input v-model="queryForm.nickname" placeholder="可输入昵称搜索" />
                </a-form-item>
              </a-col>
              <a-col :md="10" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="addRecord" style="margin-right: 1em">添加</a-button>
                <a-button style="margin-right: 1em" type="primary" @click="getList">查询</a-button>
                <a-upload style="margin-right: 1em" :beforeUpload="batchImport" :fileList="[]">
                  <a-button> <a-icon type="upload" />导入数据</a-button>
                </a-upload>
                <a-button style="margin-right: 1em" type="primary" @click="exportData">导出</a-button>
                <a-button @click="resetQueryForm">重置</a-button>
              </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </template>
      <template slot="isPublish" slot-scope="{data}">
        <a-tag :color="data?`green`:`pink`">{{ data ? '已发布' : '未发布' }}</a-tag>
      </template>
      <template slot="coverImg" slot-scope="{data}">
        <img style="width: 60px" v-if="data" alt="封面" :src="data" />
        <span v-else>-</span>
      </template>
      <template slot="operate" slot-scope="data">
        <a @click="editRecord(data)">
          编辑
        </a>
        <simple-bar />
        <a v-if="data.isPublish" @click="cancelPublishRecord(data)">
          取消发布
        </a>
        <a v-else @click="publishRecord(data)">
          发布
        </a>
        <simple-bar />
        <a class="red-text" @click="deleteRecord(data)">
          <a-icon type="delete" />
          删除</a>
      </template>
    </table-wrapper>
    <a-modal okText="保存 " :dialogStyle="{top:`10px`}" :title="modalTitle + `今日资讯`" :visible="modalVisible"
             @ok="submitModal"
             @cancel="modalCancel"
             :maskClosable="false" width="80%" :confirmLoading="confirmLoading">
      <form>
        <a-form-model :model="modalForm" :rules="rules" ref="ruleForm"
                      v-bind="{ labelCol: { span: 3 }, wrapperCol: { span: 19 } }">
          <a-form-model-item label="资讯标题" prop="title">
            <a-input placeholder="请输入资讯标题" v-model="modalForm.title" />
          </a-form-model-item>
          <a-form-model-item label="封面图片" style="margin-bottom: -100px">
            <a-upload list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
                      :before-upload="uploadAvatar">
              <img class="hover-upload" v-if="modalForm.coverImg" alt="封面图片" :src="modalForm.coverImg">
              <div class="hover-upload" v-else>
                <a-icon :type="avatarLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传封面
                </div>
              </div>
            </a-upload>
          </a-form-model-item>
          <a-form-model-item label="正文内容" prop="content">
            <w-editor v-if="modalVisible" :w-height="470" v-model="modalForm.content" @change="editorChange" />
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
import UserService from 'services/newsInfo/todayNews';
import AuthService from 'services/auth';
import FileService from 'services/file';
import RoleService from 'services/system/role';
import TodayNewsService from 'services/newsInfo/todayNews';
import { downloadFile } from 'utils/common';

const getOriginForm = () => ({
  title: undefined, // 标题
  content: undefined, // 内容
  coverImg: undefined // 封面
});

const getQueryForm = () => ({
  title: undefined, // 标题
  isPublish: undefined, // 是否发布
  createdStar: null, // 创建起始时间
  createdEnd: null // 创建结束时间
});

export default {
  name: 'TodayNews',
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
      rules
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
    editorChange(e) {
      console.log(e);
      // this.$refs.ruleForm.validateField("content",test2)
    },
    getMenuTree() {
      MenuService.getMenuTree().then(({ data }) => {
        this.menuTree = data;
      });
    },
    async getList() {
      this.tableLoading = true;
      try {
        const { records, total } = await TodayNewsService.getList({
          page: this.pagination.current,
          pageSize: this.pagination.pageSize,
          ...this.queryForm
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
    async publishRecord({ id }) {
      try {
        this.tableLoading = true;
        await TodayNewsService.publish(id);
        this.getList();
      } finally {
        this.tableLoading = false;
      }
    },
    async cancelPublishRecord({ id }) {
      try {
        this.tableLoading = true;
        await TodayNewsService.cancelPublish(id);
        await this.getList();
      } catch {
        this.tableLoading = false;
      }
    },
    async exportData() {
      const {path} = await TodayNewsService.export();
      downloadFile(path, '新闻列表.xlsx');
    },
    onChange(date, [star, end]) {
      this.queryForm.createdStar = star;
      this.queryForm.createdEnd = end;
    },
    roleModalFromCancel() {
      this.roleVisible = false;
      this.modalForm = getOriginForm();
    },
    async batchImport(file) {
      const formData = new FormData;
      formData.append('FormFile', file);
      const res = await TodayNewsService.batchImport(formData);
      console.log(res);
      this.$message.success('导入成功');
      await this.getList();
      return Promise.reject();
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
      this.avatarLoading = false;
      this.modalForm.coverImg = res.path;
      return Promise.reject();
    },
    submitModal() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        try {
          if (!this.modalForm.id) {
            await TodayNewsService.createNews(this.modalForm);
            this.$message.success('创建成功');
          } else {
            await TodayNewsService.updateNews(this.modalForm);
            this.$message.success('修改成功');
          }
        } finally {
          this.confirmLoading = false;
          this.modalCancel();
          await this.getList();
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
    async deleteRecord({ id, title }) {
      this.$modal.confirm({
        title: `确定要删除标题为【${title}】的资讯吗`,
        content: '该操作不可逆',
        onOk: async () => {
          this.tableLoading = true;
          await UserService.deleteUser(id);
          this.$message.success('删除成功');
          await this.getList();
        },
        onCancel: () => {
          this.$message.info('已取消删除操作');
        }
      });
    },
    addRecord() {
      this.modalVisible = true;
      this.modalTitle = '创建';
    }
  }
};
</script>

<style lang="less" scoped>
::v-deep .avatar-uploader > .ant-upload {
  //width: 26rem;
  //display: inline-flex;
  //height: 13rem;

  //> .ant-upload {
  //  > div {
  //    height: 100%;
  //    display: flex;
  //    justify-content: center;
  //    align-items: center;
  //    flex-direction: column;
  //  }
  //}
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.hover-upload {
  cursor: pointer;
}
</style>
