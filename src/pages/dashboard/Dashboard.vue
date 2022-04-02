<template>
  <div class="container" :style="`height: calc(100vh - ${contentHeight}px)`">
    <table-wrapper
      @change="tablePageChange"
      :data-source="listData"
      :columns="columns"
      :pagination="pagination"
      :row-class-name="tableRowClass"
      :loading="loading"
    >
      <template slot="header">
        <div ref="search" class="action-container">
          <div class="action-item">
            <div>标题：</div>
            <a-input
              v-model="searchData.title"
              placeholder="可输入标题"
              style="width: 260px"
            />
          </div>
          <a-button style="margin-right: 1em" @click="search(true)"
          >查询
          </a-button
          >
          <a-button type="dashed" @click="resetSelect" style="margin-right: 1em"
          >重置
          </a-button
          >
          <a-button type="primary" @click="addRecord" style="margin-right: 1em"
          >添加
          </a-button
          >
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
            <a-menu-item v-if="data.topNum === 0">
              <template>
                <a-popconfirm title="确定置顶吗？" @confirm="topRecord(data)">
                  <a class="pink-text">
                    <a-icon type="pushpin" />
                    置顶</a
                  >
                </a-popconfirm>
              </template>
            </a-menu-item>
            <a-menu-item v-else>
              <a-popconfirm
                title="确定取消置顶吗？"
                @confirm="cancelTopRecord(data)"
              >
                <a class="pink-text">
                  <a-icon type="pushpin" />
                  取消置顶</a
                >
              </a-popconfirm>
            </a-menu-item>
            <a-menu-item v-if="!data.isRelease">
              <a-popconfirm title="确定发布吗？" @confirm="releaseRecord(data)">
                <a class="purple-text">
                  <a-icon type="cloud-upload" />
                  发布</a
                >
              </a-popconfirm>
            </a-menu-item>
            <a-menu-item v-else>
              <a-popconfirm
                title="确定取消发布吗？"
                @confirm="cancelReleaseRecord(data)"
              >
                <a class="purple-text">
                  <a-icon type="cloud-upload" />
                  取消发布</a
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
    <a-modal
      okText="保存 "
      :title="modalTitle"
      :visible="modalVisible"
      @ok="submitModal"
      @cancel="modalCancel"
      :maskClosable="false"
      width="70%"
    >
      <form>
        <a-form-model
          :model="modalForm"
          :rules="rules"
          ref="ruleForm"
          v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }"
        >
          <a-form-model-item label="账号" prop="username">
            <a-input placeholder="请输入账号" v-model="modalForm.username" />
          </a-form-model-item>
          <a-form-model-item label="密码" prop="password">
            <a-input
              placeholder="请输入密码"
              type="password"
              v-model="modalForm.password"
            />
          </a-form-model-item>
          <a-form-model-item label="确认密码" prop="confirmPassword">
            <a-input
              placeholder="请确认密码"
              type="password"
              v-model="modalForm.confirmPassword"
            />
          </a-form-model-item>
          <a-form-model-item label="人大动态内容" prop="content">
            <w-editor v-model="modalForm.content" @change="testChange" />
          </a-form-model-item>
        </a-form-model>
      </form>
    </a-modal>
  </div>
</template>

<script>
import { clearAuthToken } from "utils/token";
import TableWrapper from "components/tableWrapper/TableWrapper.vue";
import { tableColumns } from "./config";
import TestService from "services/test";
import { mapState } from "vuex";

function check(rule, value, cb) {
  console.log("rule:" + rule);
  console.log("value:" + value);
  const illegals = [`<p data-we-empty-p=""><br></p>`, undefined, null];
  if (illegals.includes(value)) {
    console.log("输入值不合法");
    return cb(new Error("输入值不合法"))
  }
  console.log("rule");
  console.log(rule);
  cb()
}
function test2(errmsg){
  console.log(`errmsg`);
  console.log(errmsg);
}
export default {
  components: { TableWrapper },
  name: "Home",
  data() {
    return {
      editor: null,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "change" }],
        content: [{ required: true, message: "请输入密码", trigger: "change" }],
        confirmPassword: [
          {
            validator: check,
            trigger: "blur"
          }
        ]
      },
      modalTitle: "增加",
      modalVisible: false,
      loading: false,
      columns: tableColumns,
      pagination: {
        current: 1,
        pageSize: 20
      },
      modalForm: {
        username: undefined,
        password: undefined,
        content: undefined
      },
      searchData: {},
      listData: [
        {
          id: 1,
          username: "test"
        }
      ],
      editorOptions: {}
    };
  },
  mounted() {
    this.getList();
    setTimeout(() => {
      // nprogress.start();
      setTimeout(() => {
        // nprogress.done();
      }, 2000);
    }, 1000);
  },
  methods: {
    testChange(e){
      console.log(2);
      console.log("testChange");
      this.$refs.ruleForm.validateField("content",test2)
    },
    handleImageAdded() {
    },
    submitModal() {
    },
    modalCancel() {
      this.modalVisible = false;
      this.editor.txt.clear();
    },
    tableRowClass() {
      return "test";
    },
    logout() {
      clearAuthToken();
      this.$router.push("/login");
    },
    tablePageChange() {
    },
    addRecord() {
      this.modalVisible = true;
      // this.$nextTick(() => {
      //   if (!this.editor) {
      //     this.editor = new this.$WEditor("#editor");
      //     this.editor.height = 500;
      //     this.editor.config.placeholder = '自定义 placeholder 提示文字';
      //     this.editor.config.customUploadImg = async function(resultFiles, insertImgFn) {
      //       const formData = new FormData();
      //       formData.append("FormFile", resultFiles[0]);
      //       formData.append("FileName",resultFiles[0].name)
      //       const res = await FileService.uploadFile(formData);
      //       insertImgFn(res.data.path)
      //     }
      //     this.editor.create();
      //   }
      // });
    },
    resetSelect() {
    },
    search() {
    },
    getList() {
      TestService.list().then(({ records, total }) => {
        this.pagination.total = total;
        this.listData = records;
      });
    }
  },
  computed: {
    ...mapState("setting", ["contentHeight"])
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
}
</style>
<style lang="less">
.test {
  // background: argb(rgba(231, 38, 157, 0.3));
}
</style>
