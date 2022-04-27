<template>
  <div class="fixed-height-wrapper">
    <table-wrapper @change="tableChange" :data-source="listData" :columns="columns" :pagination="pagination"
                   :row-class-name="tableRowClass" :loading="tableLoading">
      <template slot="header">
        <div ref="search" class="action-container">
          <div class="action-item">
            <div>分类名称：</div>
            <a-input v-model="searchForm.name" placeholder="可输入资源名称" style="width:200px;" />
          </div>
          <a-button type="primary" @click="search" style="margin-right: 1em">查询</a-button>
          <a-button type="primary" @click="reset" style="margin-right: 1em">重置</a-button>
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
          <a-form-model-item label="分类名称" prop="name">
            <a-input placeholder="请输入分类名称" v-model="modalForm.name" />
          </a-form-model-item>
          <a-form-model-item label="排序" prop="url">
            <a-input-number :min="0" placeholder="输入排序" v-model="modalForm.sequence" />
          </a-form-model-item>
        </a-form-model>
      </form>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { columns, rules } from './config';
import ResourceCategroyService from 'services/system/resourceCategroy';
import _ from 'lodash';

const getOriginForm = () => ({
  name: undefined,
  url: undefined,
  description: undefined,
  categroyId: undefined
});
const getSearchForm = () => ({
  name: undefined,
  sequence: undefined
});

export default {
  name: 'ResourceCategroy',
  data() {
    return {
      searchForm: getSearchForm(),
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
    search() {
      this.pagination.current = 1;
      this.getList();
    },
    categroyManage() {
      console.log(1);
      this.$router.push({
        name: 'categroyManage'
      });
    },
    reset() {
      this.searchForm = getSearchForm();
      this.pagination.current = 1;
      this.getList();
    },
    async getList() {
      this.tableLoading = true;
      try {
        const { records, total } = await ResourceCategroyService.getList({
          page: this.pagination.current,
          pageSize: this.pagination.pageSize,
          ...this.searchForm
        });
        this.listData = records;
        this.pagination.total = total;
      } finally {
        this.tableLoading = false;
      }
    },
    tableRowClass() {
    },
    tableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getList();
    },
    submitModal() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        try {
          let res;
          if (!this.modalForm.id) {
            await ResourceCategroyService.createResourceCategroy(this.modalForm);
            this.$message.success('创建成功');
          } else {
            await ResourceCategroyService.updateResourceCategroy(this.modalForm);
            this.$message.success('修改成功');
          }
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
          ResourceCategroyService.deleteResourceCategroy(id).then(res => {
            this.$message.success('删除成功');
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
  padding: 0 12px 12px;
}
</style>