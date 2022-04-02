<template functional>
  <a-sub-menu :key="props.menu.key">
    <span slot="title">
      <a-icon v-if="props.menu.icon" :type="props.menu.icon" />
      <span>{{ props.menu.name }}</span>
    </span>
    <template v-for="menu in props.menu.children">
      <a-menu-item :key="menu.key" v-if="!menu.children">
        <a-icon v-if="menu.icon" :type="menu.icon" />
        <span>{{ menu.name }}</span>
      </a-menu-item>
      <ChildMenu v-else :key="menu.key" :props="menu" />
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  name: "ChildMenu",
  props: {
    menu: {
      type: Object,
      required: true
    }
  }
};
</script>