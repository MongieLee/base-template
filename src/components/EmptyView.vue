<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__bounceInLeft page-toggle-enter-active"
      leave-active-class="animate__animated animate__bounceOutRight page-toggle-leave-active">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'EmptyView'
};
</script>
