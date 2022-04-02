<template>
  <div>
    <content-menu :item-list="list" :visible.sync="menuVisible" @select="onMenuSelect" />
    <TabsHeader @contextmenu="onContextmenu" />
    <aside></aside>
    <main>
      <!--      <a-keep-alive :exclude-keys="excludeKeys">-->
      <!--        <router-view re="tabContent" />-->
      <!--      </a-keep-alive>-->
      <router-view ref="tabContent" />
    </main>
  </div>
</template>

<script>
import TabsHeader from "./TabsHeader";

export default {
  name: "layoutView",
  components: { TabsHeader },
  data() {
    return {
      menuVisible: false,
      pageList: [],
      excludeKeys: [],
      list: [
        { text: "关闭左侧", key: "closeLeft", icon: `vertical-left` },
        { text: "关闭右侧", key: "closeRight", icon: `vertical-right` },
        { text: "关闭其他", key: "closeOther", icon: `close` },
        { text: "刷新页面", key: "refresh", icon: `sync` }
      ]
    };
  },
  methods: {
    onMenuSelect(key, target, pageKey) {
      if (this[key]) {
        this[key](pageKey);
      }
    },
    closeLeft() {
      console.log("clseLeft");
    },
    closeRight() {
      console.log("closeRight");
    },
    closeOther() {
      console.log("closeOther");
    },
    refresh() {
      console.log("refresh");
    },
    onContextmenu(pageKey, e) {
      if (pageKey) {
        e.preventDefault();
        e._pagekey = pageKey;
        this.menuVisible = true;
      }
    }
  }
};
</script>

<style scoped>

</style>