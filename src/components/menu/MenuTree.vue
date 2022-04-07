<template>
  <div style="color:white">
    <a-menu v-if="menuTree && menuTree.length" theme="dark" mode="inline" @click="to" :selectedKeys="selectedKeys">
      <template v-for="menu in menuTree">
        <a-menu-item v-if="!menu.children.length" :key="menu.path">
          <a-icon :type="menu.icon || 'bug'" />
          <span>{{ menu.name }}</span>
        </a-menu-item>
        <child-menu :key="menu.path" v-else :menu="menu" />
      </template>
    </a-menu>
  </div>
</template>

<script>
import ChildMenu from 'components/menu/ChildMenu';

const linkReg = new RegExp(/^http(s)?:\/\/\w+/);

export default {
  name: 'MenuTree',
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
      if (linkReg.test(key)) {
        window.open(key);
      } else {
        key = keyPath.length > 1 ? keyPath.reverse().join('') : key;
        this.$router.push(key);
        this.selectedKeys = [keyPath[keyPath.length - 1]];
      }
    }
  }
};
</script>

<style scoped>

</style>