<template>
  <Exception :type="type" :back-route="routePath" />
</template>

<script>
import Exception from "components/exception/Exception";
import { STATUS } from "components/exception/typeConfig";

export default {
  name: "CustomException",
  components: { Exception },
  data() {
    return {
      type: STATUS.NOTFOUND,
      routePath: "/dashboard"
    };
  }
};
</script>
