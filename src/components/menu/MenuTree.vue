<template>
  <div style="color:white">
    <a-menu theme="dark" mode="inline" @click="to" :selectedKeys="selectedKeys">
      <template v-for="menu in menuTree">
        <a-menu-item v-if="!menu.children" :key="menu.key">
          <a-icon :type="menu.icon" v-if="menu.icon" />
          <span>{{ menu.name }}</span>
        </a-menu-item>
        <child-menu :key="menu.key" v-else :menu="menu" />
      </template>
    </a-menu>
  </div>
</template>

<script>
import ChildMenu from "components/menu/ChildMenu";

const reg = new RegExp(/^http(s)?:\/\/\w+/);

export default {
  name: "MenuTree",
  components: { ChildMenu },
  props: {
    menuTree: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedKeys: []
    };
  },
  methods: {
    to({ key, _, keyPath }) {
      if (reg.test(key)) {
        window.open(key);
      } else {
        key = keyPath.length > 1 ? keyPath.join("") : key;
        this.$router.push(key);
        this.selectedKeys = [key];
      }
    }
  }
};
</script>

<style scoped>

</style>