<template>
  <div class="container">
    <a-card
      :style="{width: `460px`,minHeight: `46rem`,padding: `3.2rem`,boxShadow: `rgba(0,0,0,0.1) 0 0 10px`,}">
      <div style="display: flex;align-items: center;justify-content: center">
        <img width="50" src="@/assets/biz-logo.png" alt="company's log" />
        <span style="margin-left: 1rem;font-size: 2.8rem;font-weight: bold">{{ topic }}</span>
      </div>
      <p style="text-align: center;font-size: 1.4rem;color:#848587;">珠海百智科技</p>
      <a-form-model @submit.prevent="onSubmit" ref="ruleForm" :model="userForm" :rules="rules">
        <a-form-model-item prop="username">
          <a-input v-model="userForm.username" size="large" placeholder="请输入用户名">
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input v-model="userForm.password" size="large" type="password" placeholder="请输入密码">
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-model-item>
        <a-button htmlType="submit" :loading="loginLoading" type="primary" style="width: 100%;height: 40px">
          登录
        </a-button>
        <!--        <a-button type="primary" style="width: 100%" @click="register">注册</a-button>-->
        <a-divider />
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import AuthService from 'services/auth';
import { setAuthToken } from 'utils/token';
import { mapMutations } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      loginLoading: false,
      topic: '中后台基础系统模板',
      userForm: {
        username: undefined,
        password: undefined
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    ...mapMutations('auth', ['setTokenInfo']),
    register() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          await AuthService.register(this.userForm);
          this.$message.success('注册成功，去登陆吧！');
          this.$refs.ruleForm.resetFields();
        }
      });
    },
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          try {
            this.loginLoading = true;
            // const { data: { token, expires } = await AuthService.login(this.userForm);
            const { token, expires, refresh_token } = await AuthService.login(this.userForm);
            console.log(token, expires, refresh_token);
            this.setTokenInfo({ token, refresh_token });
            setAuthToken(token, expires, refresh_token);
            this.$router.push(this.$route.query.redirect ? decodeURIComponent(this.$route.query.redirect) : '/');
          } catch (e) {
            this.$message.error(e.message);
            this.loginLoading = false;
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20vh;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: calc(((100vw - 40rem) / 2) - 3.2rem),
  calc(((100vw - 40rem) / 2) - 3.2rem), cover;
  background-position: left bottom, right bottom;
  background-image: url("~assets/left.svg"), url("~assets/right.svg");
}
</style>
