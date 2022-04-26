<template>
  <a-breadcrumb style="display:flex;align-items: center">
      <template v-for="(route) in routeRecords">
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
      return this.$route.matched;
    }
  }
};
</script>

<style scoped>

</style>
