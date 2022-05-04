<template>
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
      <a-form-item label="头像">
        <a-upload list-type="picture-card" :show-upload-list="false" :before-upload="uploadAvatar"></a-upload>
      </a-form-item>
    </a-form-model>
  </form>
</template>

<script>
import { rules } from '../config';
import AuthService from 'services/auth';
import UserService from 'services/newsInfo/todayNews';

export default {
  name: 'Form',
  props: {
    editable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalForm: {
        username: undefined,
        password: undefined,
        verifyPassword: undefined
      },
      rules
    };
  },
  methods: {
    submitModal() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        try {
          let res;
          if (!this.modalForm.id) {
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
    uploadAvatar() {

    }
  }
};
</script>

<style scoped>

</style>
