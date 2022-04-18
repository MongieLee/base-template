<template>
  <a-breadcrumb style="display:flex;align-items: center">
      <template v-for="(route) in routeRecords">
        <a-breadcrumb-item v-if="route.meta.title" :key="route.path">
          {{ route.meta.title }}
          <!--        <router-link v-if="index!==(routeRecords.length-1)" :to="route.path">-->
          <!--          {{ route.meta.title }}-->
          <!--        </router-link>-->
          <!--        <template v-else>-->
          <!--          {{ route.meta.title }}-->
          <!--        </template>-->
        </a-breadcrumb-item>
      </template>
  </a-breadcrumb>
</template>

<script>

export default {
  name: 'BreadCrumb',
  computed: {
    routeRecords() {
      console.log(`this.$route.matched`);
      console.log(this.$route.matched);
      return this.$route.matched;
    }
  }
};
</script>

<style scoped>

</style>
