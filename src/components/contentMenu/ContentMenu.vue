<template>
  <a-menu class="content-menu" v-show="visible" @click="handleClick" :style="position" :selectedKeys="[]">
    <a-menu-item :key="item.key" v-for="item in itemList">
      <a-icon v-if="item.icon" :type="item.icon" />
      <span>{{ item.text }}</span>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  name: "ContentMenu",
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    itemList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      top: 0,
      left: 0,
      target: null
    };
  },
  computed: {
    position() {
      return {
        left: `${this.left}px`,
        top: `${this.top}px`
      };
    }
  },
  created() {
    window.addEventListener("click", this.closeMenu);
    window.addEventListener("contextmenu", this.setPosition);
  },
  beforeDestroy() {
    window.removeEventListener("click", this.closeMenu);
    window.removeEventListener("contextmenu", this.setPosition);
  },
  methods: {
    // 隐藏菜单
    closeMenu() {
      // 外部使用visible.sync来同步
      this.$emit("update:visible", false);
    },
    // 处理菜单的点击事件，组件会传入带点击菜单的key对象为参数{key:"xxx",...rest}
    handleClick({ key }) {
      // 触发select事件，让外部的使用者能够监听点击菜单
      // 传入key以及被右键的菜单
      this.$emit("select", key, this.target);
      this.closeMenu();
    },
    // 菜单右键事件
    setPosition(e) {
      // 获取并设置鼠标的x坐标和y坐标和被右键的dom
      this.top = e.clientY;
      this.left = e.clientX;
      this.traget = e.target;
    }
  }
};
</script>

<style lang="less" scoped>
.content-menu {
  border-radius: 4px;
  position: fixed;
  left: 100px;
  top: 200px;
  box-shadow: -4px 2px 16px 1px rgba(0, 0, 0, .15) !important;
  z-index: 1000;

  .ant-menu-item {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
