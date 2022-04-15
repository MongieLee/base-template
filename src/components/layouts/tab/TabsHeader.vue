<template>
  <a-tabs :activeKey="activeKey" type="editable-card" hide-add :tabBarStyle="{background: `#f0f2f5`}">
    <a-tooltip placement="left" :title="lockText" slot="tabBarExtraContent">
      <a-icon theme="filled" @click="onLockClick" class="header-lock" :type="fixedTabs ? 'lock' : 'unlock'" />
    </a-tooltip>
    <a-tab-pane v-for="page in editableTabs" :key="page.key">
      <div slot="tab" @click="onClickItem(page)" class="tab" @contextmenu="evt => onContextmenu(page,evt)">
        <a-icon v-if="$route.fullPath == page.key" @click.stop="onRefresh(page)"
                :class="['icon-sync', {'hide': page.key !== activeKey && !page.loading}]"
                :type="page.loading ? 'loading' : 'sync'" />
        <div class="tabName">{{ page.title }}</div>
        <a-icon v-if="page.closable" @click.stop="onClose(page)" class="icon-close" type="close" />
      </div>
    </a-tab-pane>
  </a-tabs>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import { defaultActiveKey } from '@/store/modules/auth';

export default {
  name: 'TabsHeader',
  props: {
    tabsList: {
      type: Array,
      default: () => ([])
    }
  },
  created() {
    const { fullPath } = this.$route;
    this.changeActiveKey({ activeKey: fullPath });
  },
  watch: {
    $route(to) {
      if (to.path !== '/login') {
        this.changeActiveKey({ activeKey: to.fullPath });
        // store中不存在相同的key时才进行tab的添加
        if (this.editableTabs.findIndex(i => i.key === to.fullPath) < 0)
          this.setEditableTabs({
            tabs: [{
              title: to.meta.title,
              key: to.fullPath,
              loading: false,
              closable: true
            }
            ]
          });
      }
    }
  },
  data() {
    const panes = [
      { title: 'Tab 2', content: 'Content of Tab 2', key: '1' },
      { title: 'testLoading', content: 'Content of Tab 1', key: '2', loading: true },
      { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable: false }
    ];
    return {
      panes
    };
  },
  computed: {
    ...mapState('setting', ['fixedTabs']),
    ...mapState('auth', ['editableTabs', 'activeKey']),
    lockText() {
      return this.fixedTabs ? '点击解锁页头' : '点击锁定页头';
    }
  },
  methods: {
    // 是否锁定状态存储在store的setting[fixedTabs]中，默认为false
    // 修改store中的状态
    ...mapMutations('setting', ['changeTabsFixed']),
    ...mapMutations('auth', ['changeActiveKey', 'setEditableTabs']),
    // 监听右键事件
    onContextmenu({ key }, evt) {
      this.$emit('contextmenu', key, evt);
    },
    // 点击刷新icon
    onRefresh(page) {
      if (page.loading) return;
      this.$emit('refresh', page);
    },
    // 点击关闭icon
    onClose(page) {
      console.log(page);
      this.$emit('closePage', page);
    },
    // 点击锁定/解锁icon
    onLockClick() {
      this.changeTabsFixed({ status: !this.fixedTabs });
    },
    onClickItem(page) {
      console.log(page);
      this.$emit('clickPage', page);
    }
  }
};
</script>

<style lang="less" scoped>
.tab {
  margin: 0 -1.6rem;
  padding: 0 1.6rem;
  user-select: none;
  transition: all 0.2s;

  .icon-close {
    font-size: 12px;
    margin-left: 6px;
    margin-right: -4px !important;
    //color: @text-color-second;
    //&:hover{
    //  color: @text-color;
    //}
  }

  .tabName {
    display: inline-flex;
  }
}

.header-lock {
  font-size: 18px;
  cursor: pointer;
  //color: @primary-3;

  &:hover {
    //color: @primary-color;
  }
}
</style>