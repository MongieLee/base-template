<template>
  <div class="container" :style="`height: calc(100vh - ${contentHeight}px)`">
    <table-wrapper
      @change="tableChange"
      :data-source="menuTree"
      :columns="columns"
      :pagination="pagination"
      :row-class-name="tableRowClass"
      :loading="tableLoading"
      key="id"
    >
      <template slot="header">
        <div ref="search" class="action-container">
          <a-button type="primary" @click="addRecord" style="margin-right: 1em">添加
          </a-button>
        </div>
      </template>
      <template slot="action" slot-scope="data">
        <a @click.stop="editRecord(data)">
          <a-icon type="edit" />
          编辑</a
        >
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
              <a-popconfirm title="确定删除吗？" @confirm="deleteRecord(data)">
                <a class="red-text">
                  <a-icon type="delete" />
                  删除</a
                >
              </a-popconfirm>
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
             :maskClosable="false" width="70%">
      <form>
        <a-form-model
          :model="modalForm"
          :rules="rules"
          ref="ruleForm"
          v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }"
        >
          <a-form-model-item label="菜单名" prop="name">
            <a-input placeholder="请输入账号" v-model="modalForm.username" />
          </a-form-model-item>
          <a-form-model-item label="路由或外链" prop="path">
            <a-input
              placeholder="请输入密码"
              type="password"
              v-model="modalForm.password"
            />
          </a-form-model-item>
          <a-form-model-item label="父级菜单" prop="confirmPassword">
            <a-input
              placeholder="请确认密码"
              type="password"
              v-model="modalForm.confirmPassword"
            />
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

const getOriginForm = () => ({
  name: undefined,
  path: undefined,
  pId: undefined
});
export default {
  name: 'Menu',
  data() {
    return {
      modalForm: getOriginForm(),
      rules,
      columns,
      menuTree: [{}],
      pagination: {},
      tableLoading: false,
      modalTitle: '弹窗',
      modalVisible: false
    };
  },
  computed: {
    ...mapState('setting', ['contentHeight'])
  },
  created(){
    this.getMenuTree()
  },
  methods: {
    getMenuTree(){
      MenuService.getMenuTree().then(res=>{
        console.log(res);
        this.menuTree = res.data
      })
    },
    tableRowClass() {
    },
    tableChange() {
    },
    submitModal() {
    },
    modalCancel() {
    },
    moveToEnd() {
    },
    moveToStart() {
    },
    editRecord() {
    },
    deleteRecord() {
    },
    moveUp() {
    },
    moveDown() {
    },
    addRecord() {
    }
  }
};
</script>

<style lang="less" scoped>
.container{
  padding: 12px;
}

</style>