<template functional>
  <a-sub-menu :key="props.menu.path">
    <span slot="title">
      <a-icon :type="props.menu.icon || 'bug'" />
      <span>{{ props.menu.name }} {{ props.menu.menuTyp }}</span>
    </span>
    <template v-for="menu in props.menu.children">
      <template v-if="menu.visible">
        <a-menu-item :key="menu.path" v-if="!menu.children.length || menu.menuType=== 'C'">
          <a-icon :type="menu.icon || 'bug'" />
          <span>{{ menu.name }}</span>
        </a-menu-item>
        <ChildMenu v-else :key="menu.path" :menu="menu" />
      </template>
    </template>
  </a-sub-menu>
</template>

<script>
import { menuTypeEnum } from 'pages/menu/config';

export default {
  name: 'ChildMenu',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      menuTypeEnum
    };
  }
};
</script>