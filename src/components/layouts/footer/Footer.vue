<template>
  <div class="footer-container">
    <span>Copyright</span>
    <a-icon type="copyright" />
    <span>{{ copyright }}</span>
  </div>
</template>

<script>
import globalConfig from "configs/mainConfiguration";

export default {
  name: 'Footer',
  data() {
    return {
      copyright: globalConfig.copyright
    };
  }
};
</script>

<style lang="less" scoped>
.footer-container {
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;

  i {
    margin-left: 0.4rem;
    margin-right: 0.4rem;
  }
}
</style>