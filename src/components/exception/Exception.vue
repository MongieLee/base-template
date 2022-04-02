<template>
  <a-result :status="type" :title="type" :sub-title="config[type].desc">
    <template #extra>
      <a-button type="primary" @click="backHome">
        返回
      </a-button>
    </template>
  </a-result>
</template>
<script>

import config from "./typeConfig";

export default {
  name: "Exception",
  data() {
    return {
      config
    };
  },
  props: {
    type: {
      type: String
    },
    backRoute: {
      type: String
    }
  },
  methods: {
    backHome() {
      this.$router.push(this.backRoute);
    }
  }
};
</script>