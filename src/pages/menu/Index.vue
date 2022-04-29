<template>
  <div class="fixed-height-wrapper">
    <table-wrapper @table:refresh="getMenuTree" v-if="checkPermission('menu:list')" @change="tableChange"
                   :data-source="menuTree"
                   :columns="columns" :pagination="pagination"
                   :row-class-name="tableRowClass" :loading="tableLoading">
      <template slot="header">
        <div ref="search" class="action-container">
          <a-button :loading="tableLoading" type="primary" @click.native="addRecord"
                    v-permission="'menu:add'" style="margin-right: 1em">添加
          </a-button>
        </div>
      </template>
      <template slot="icon" slot-scope="{data}">
        <template v-if="data">
          <a-icon :type="data" />
        </template>
        <span v-else>未设置</span>
      </template>
      <template slot="visible" slot-scope="{data}">
        <a-tag :color="(data.visible || data.menuType === 'F')?'blue':'red'">
          {{ (data.visible || data.menuType === 'F') ? '正常' : '隐藏' }}
        </a-tag>
      </template>
      <div class="operation-btns" slot="operate" slot-scope="data">
        <a v-permission='"menu:edit"' @click="editRecord(data)">
          <a-icon type="edit" />
          修改</a>
        <a-popconfirm v-permission='"menu:moveToStart"' title="确定移动至最前吗？" @confirm="moveToStart(data)">
          <a>
            <a-icon style="color: #1d8f20" type="vertical-align-top" />
          </a>
        </a-popconfirm>

        <a-popconfirm v-permission='"menu:moveUo"' title="确定上移一位吗？" @confirm="moveUp(data)">
          <a>
            <a-icon style="color: #1d8f20" type="up-square" />
          </a>
        </a-popconfirm>
        <a-popconfirm v-permission='"menu:moveDown"' title="确定下移一位吗？" @confirm="moveDown(data)">
          <a>
            <a-icon style="color: #efa828" type="down-square" />
          </a>
        </a-popconfirm>

        <a-popconfirm v-permission='"menu:moveToEnd"' title="确定移动至最后吗？" @confirm="moveToEnd(data)">
          <a>
            <a-icon style="color: #efa828" type="vertical-align-bottom" />
          </a>
        </a-popconfirm>
        <template>
          <a class="red-text" v-permission='"menu:delete"' @click="deleteRecord(data)">
            <a-icon type="delete" />
            删除</a>
        </template>
      </div>
    </table-wrapper>
    <a-modal okText="保存" :title="modalTitle" :visible="modalVisible" @ok="submitModal" @cancel="modalCancel"
             :maskClosable="false" width="50%" :confirmLoading="confirmLoading">
      <form>
        <a-form-model
          :model="modalForm" :rules="rules" ref="ruleForm" v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }">
          <a-form-model-item label="菜单名" prop="name">
            <a-input placeholder="请输入菜单名" v-model="modalForm.name" />
          </a-form-model-item>
          <a-form-model-item v-show="modalForm.menuType!=='F'" label="路由或外链" prop="path">
            <a-input placeholder="请输入路由或外联" v-model="modalForm.path" />
          </a-form-model-item>
          <a-form-model-item label="父级菜单" prop="parentId">
            <a-tree-select allowClear v-model="modalForm.parentId" placeholder="可选择父级菜单"
                           :replaceFields="{title:'name',key:'id',value:'id'}" :tree-data="menuTree"></a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="排序" prop="sequence">
            <a-input-number style="width:100%" placeholder="可输入排序" v-model="modalForm.sequence" />
          </a-form-model-item>
          <a-form-model-item label="菜单类型" prop="menuType">
            <a-radio-group :options="typeSelectList" v-model="modalForm.menuType" />
          </a-form-model-item>
          <a-form-model-item v-show="modalForm.menuType!=='F'" label="菜单图标代码">
            <a-input placeholder="可输入菜单图标代码" v-model="modalForm.icon" />
          </a-form-model-item>
          <a-form-model-item v-show="modalForm.menuType!=='F'" label="菜单展示">
            <a-radio-group :options="[{label:`显示`,value:true},{label:`隐藏`,value:false}]" v-model="modalForm.visible" />
          </a-form-model-item>
          <a-form-model-item v-show="modalForm.menuType === 'F'" label="权限标识">
            <a-input placeholder="可输入权限" v-model="modalForm.permission" />
          </a-form-model-item>
          <a-form-model-item label="备注">
            <a-input placeholder="可输入备注" v-model="modalForm.remark" />
          </a-form-model-item>
        </a-form-model>
      </form>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { columns, rules, menuTypeEnum } from './config';
import MenuService from 'services/menu';
import _ from 'lodash';

const typeSelectList = [];
for (let i in menuTypeEnum) {
  typeSelectList.push({
    label: menuTypeEnum[i],
    value: i
  });
}

const copyRules = _.cloneDeep(rules);
Reflect.deleteProperty(copyRules, 'path');

const getOriginForm = () => ({
  name: undefined, // 菜单名称
  path: undefined, // 路由或外链
  parentId: undefined, // 父级菜单ID
  remark: undefined, // 备注
  permission: undefined, // 权限标识
  sequence: undefined, // 当前层级排序
  icon: undefined, // 图标代码
  menuType: undefined, // 菜单类型
  visible: undefined // 是否显示
});

export default {
  watch: {
    'modalForm.menuType'(newValue) {
      if (newValue === 'F') {
        this.rules = copyRules;
      } else {
        this.rules = rules;
      }
    }
  },
  name: 'Menu',
  data() {
    return {
      menuTypeEnum,
      modalForm: getOriginForm(),
      rules,
      columns,
      menuTree: [],
      pagination: false,
      tableLoading: false,
      modalTitle: '弹窗',
      modalVisible: false,
      confirmLoading: false,
      typeSelectList
    };
  },
  computed: {
    ...mapState('setting', ['contentHeight']),
    ...mapState('auth', ['permissionCollection'])
  },
  created() {
    this.getMenuTree();
  },
  methods: {
    checkPermission(permission) {
      return this.permissionCollection.includes(permission);
    },
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
      MenuService.getMenuTree().then(data => {
        this.menuTree = this.handlerTreeChild(data);
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
          if (!this.modalForm.id) {
            await MenuService.createMenu(this.modalForm);
            this.$message.success('添加成功');
          } else {
            await MenuService.updateMenu(this.modalForm);
            this.$message.success('编辑成功');
          }
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

    editRecord(data) {
      this.modalForm = _.cloneDeep(data);
      this.modalVisible = true;
      this.modalTitle = '编辑菜单权限';
    },
    async deleteRecord({ id, name }) {
      this.$modal.confirm({
        title: `确定要删除菜单【${name}】吗`,
        content: '该操作不可逆',
        onOk: () => {
          this.tableLoading = true;
          MenuService.deleteMenu(id).then(res => {
            this.$message.success('删除成功');
            this.getMenuTree();
          });
        },
        onCancel: () => {
          this.$message.info('已取消删除操作');
        }
      });
    },
    async moveUp({ id }) {
      try {
        this.tableLoading = true;
        const { msg } = await MenuService.moveUp(id);
        await this.getMenuTree();
        this.$message.success(msg);
      } catch {
        this.tableLoading = false;
      }
    },
    async moveDown({ id }) {
      try {
        this.tableLoading = true;
        const { msg } = await MenuService.moveDown(id);
        await this.getMenuTree();
        this.$message.success(msg);
      } catch {
        this.tableLoading = false;
      }
    },
    async moveToStart({ id }) {
      try {
        this.tableLoading = true;
        const { msg } = await MenuService.moveToStar(id);
        await this.getMenuTree();
        this.$message.success(msg);
      } catch {
        this.tableLoading = false;
      }
    },
    async moveToEnd({ id }) {
      try {
        this.tableLoading = true;
        const { msg } = await MenuService.moveToEnd(id);
        await this.getMenuTree();
        this.$message.success(msg);
      } catch {
        this.tableLoading = false;
      }
    },
    addRecord() {
      this.modalVisible = true;
      this.modalTitle = '添加菜单权限';
    }
  }
};
</script>

<style lang="less" scoped>
.fuck {
  height: 100%;
  position: absolute;
}
</style>