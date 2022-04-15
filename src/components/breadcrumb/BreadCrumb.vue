<template>
  <a-breadcrumb style="display:flex;align-items: center">
    <a-breadcrumb-item>
      <a-icon type="home"/>
    </a-breadcrumb-item>
    <template v-for="route in routeRecords">
      <a-breadcrumb-item v-if="route.meta.title" :key="route.path">
        {{ route.meta.title }}
      </a-breadcrumb-item>
    </template>

  </a-breadcrumb>
</template>

<script>

export default {
  name: 'BreadCrumb',
  computed: {
    routeRecords() {
      console.log(this.$route.matched);
      return this.$route.matched;
    }
  },
  created() {
    console.log('???');
  }
};
</script>

<style scoped>

</style>
