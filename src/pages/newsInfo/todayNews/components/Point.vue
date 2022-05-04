<template>
  <span :class="['point',{'active':status}]"></span>
</template>

<script>
export default {
  props: {
    status: {
      type: Boolean,
      default: true
    }
  },
  name: 'Point'
};
</script>

<style lang="less" scoped>
.point {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background: #ee2727;
  border-radius: 50%;

  &.active {
    background: #53c24e;
  }
}
</style>