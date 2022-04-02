<template>
  <div class="container">
    <p style="font-size: 4rem">{{ topic }}</p>
    <a-card
      :style="{
        width: `40rem`,
        minHeight: `46rem`,
        padding: `3.2rem`,
        boxShadow: `rgba(0,0,0,0.1) 0 0 10px`,
      }"
    >
      <a-form-model ref="ruleForm" :model="userForm" :rules="rules">
        <a-form-model-item prop="username">
          <a-input v-model="userForm.username" placeholder="请输入用户名" />
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
          />
        </a-form-model-item>
        <a-button type="primary" style="width: 100%" @click="login"
          >登录</a-button
        >
        <a-button type="primary" style="width: 100%" @click="register"
          >注册</a-button
        >
        <a-button @click="test">ceshi</a-button>
        <a-divider />
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import AuthSerivce from "services/auth";
import { setAuthToken, inspectTokenValidity } from "utils/token";

export default {
  name: "Login",
  data() {
    return {
      topic: "珠海市妇幼内容管理平台",
      userForm: {
        username: undefined,
        password: undefined,
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    test() {
      const b = inspectTokenValidity();
    },
    register() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          AuthSerivce.register(this.userForm).then(({ msg }) => {
            this.$message.success(msg || "注册成功！");
            this.$refs.ruleForm.resetFields();
          });
        }
      });
    },
    login() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          AuthSerivce.login(this.userForm).then(
            ({ data: { token, expires } }) => {
              setAuthToken(token, expires);
              // this.$router.push({
              //   name:"Dashboard"
              // })
              this.$router.push("/");
            },
            (err) => console.log(err)
          );
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: calc(((100vw - 40rem) / 2) - 3.2rem),
    calc(((100vw - 40rem) / 2) - 3.2rem), cover;
  background-position: left bottom, right bottom;
  background-image: url("~assets/left.svg"), url("~assets/right.svg");
}
</style>
