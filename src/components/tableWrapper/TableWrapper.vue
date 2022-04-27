<template>
  <div ref="layoutRef" :style="layoutStyle" class="a-container">
    <div :style="headerStyle" ref="header" class="layout-header">
      <slot name="header" />
      <div v-if="showOperation" class="operation-bar">
        <a-tooltip @click="$emit('table:refresh')" class="table-icon" placement="top" title="刷新">
          <a-icon style="font-size: 18px" type="reload" />
        </a-tooltip>
        <a-tooltip class="table-icon" placement="top" title="密度">
          <a-dropdown :trigger="['click']">
            <a-icon style="font-size: 18px" type="ordered-list" />
            <a-menu @click="sizeChange" slot="overlay">
              <a-menu-item key="default">
                <a>宽松</a>
              </a-menu-item>
              <a-menu-item key="middle">
                <a>中等</a>
              </a-menu-item>
              <a-menu-item key="small">
                <a>紧密</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-tooltip>
        <a-tooltip class="table-icon" placement="top" title="列展示">
          <a-dropdown v-model="columnConfigVisible" :trigger="['click']" placement="bottomRight">
            <a-icon style="font-size: 18px" type="setting" />
            <div slot="overlay" style="background: white;box-shadow: 0 0 2px 1px rgba(0,0,0,0.2);border-radius: 4px;">
              <div
                style="width:160px;padding: 6px 12px;border-bottom: 1px solid #dcd8d8;display: flex;justify-content: space-between">
                <a-checkbox v-model="everyChecked" @change="allColumnChange">列展示</a-checkbox>
                <a @click="resetColumnConfiguration">重置</a></div>
              <div style="padding: 6px 12px;">
                <div v-for="(item,index) in cloneColumns" :key="index">
                  <a-checkbox v-model="item.checked"> {{ item.title }}</a-checkbox>
                </div>
              </div>
            </div>
          </a-dropdown>
        </a-tooltip>
      </div>
    </div>
    <a-table
      :childrenColumnName="childrenColumnName"
      :rowSelection="rowSelection"
      bordered
      :data-source="dataSource"
      :columns="columnConfiguration"
      :size="customSize"
      :rowKey="rowKey"
      :pagination="typeof pagination === false ? pagination :{ ...defaultPagination, ...pagination }"
      :loading="loading"
      @change="paginationChange"
      :rowClassName="rowClassName"
      :customRow="customRow"
    >
      <template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
        <slot v-if="slot === 'operate'" :name="slot" v-bind="scope" />
        <slot v-else :name="slot" :data="scope" />
      </template>
    </a-table>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  data() {
    return {
      cloneColumns: _.cloneDeep(this.columns).map(i => {
        i.checked = true;
        return i;
      }),
      defaultPagination: {
        showSizeChanger: true,
        size: 'small',
        showTotal: (total, range) => {
          return `当前${range[0]}-${range[1]}条，共 ${total} 条`;
        }
      },
      tableHeight: 0,
      customSize: 'small',
      columnConfigVisible: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.getListHeight(this.getParentEleHeight());
    });
    window.addEventListener('resize', this.watchWindowResize);
  },
  computed: {
    everyChecked: {
      get() {
        return this.cloneColumns.every(i => i.checked);
      },
      set(value) {
        return value;
        // return this.cloneColumns.every(i => i.checked);
      }
    },
    columnConfiguration() {
      return this.cloneColumns.filter(i => i.checked);
    }
  },
  methods: {
    allColumnChange(a) {
      if (a.target.checked) {
        this.cloneColumns = this.cloneColumns.map(i => {
          i.checked = true;
          return i;
        });
      } else {
        this.cloneColumns = this.cloneColumns.map(i => {
          i.checked = false;
          return i;
        });
      }
    },
    resetColumnConfiguration() {
      this.cloneColumns = this.cloneColumns.map(i => {
        i.checked = true;
        return i;
      });
    },
    sizeChange({ key }) {
      this.customSize = key;
    },
    paginationChange(pagination, filters, sorter, { currentDataSource }) {
      this.$emit('change', pagination, filters, sorter, { currentDataSource });
    },
    // resize回调函数
    watchWindowResize() {
      this.getListHeight(this.getParentEleHeight());
    },
    // 获取父元素高度
    getParentEleHeight() {
      const layoutStyle = Object.keys(this.layoutStyle);
      let parentEleHeight;
      // 判断是否有设定高度
      if (layoutStyle.some((key) => key === 'height')) {
        parentEleHeight = this.getContentHeight(this.$refs.layoutRef);
      } else {
        parentEleHeight = this.getContentHeight(
          this.$refs.layoutRef.parentElement
        );
      }
      console.log(parentEleHeight);
      return parentEleHeight;
    },
    // 获取表格高度
    getListHeight(parentEleHeight) {
      const dom = this.$refs.layoutRef.querySelector('.ant-table');
      let dValue = 0;
      const headerStyles = window.getComputedStyle(this.$refs.header);
      dValue += headerStyles.marginTop.replace('px', '') - 0;
      dValue += headerStyles.marginBottom.replace('px', '') - 0;
      dValue += headerStyles.height.replace('px', '') - 0;
      dom.style.minHeight = parentEleHeight - dValue - 56.5 + 'px'; // 强行拉高表格
      dom.style.borderRight = `1px solid #e8e8e8`; // 处理表格👉边框缺失
      setTimeout(() => {
        dom
          .querySelector('.ant-table-body')
          .classList.add('tbody-bottom-border');
      });
      this.tableHeight = parentEleHeight - dValue - 39 - (this.dataSource.length ? 56.5 : 0);
      // dValue是header插槽的高度，39为表头高度，56.5为分页组件高度
    },
    // 获取元素的内容区域高度
    getContentHeight(ele) {
      const node = window.getComputedStyle(ele);
      const elePaddingLeft = node.paddingTop.replace('px', '') - 0;
      const elePaddingRight = node.paddingBottom.replace('px', '') - 0;
      console.log(node);
      console.log(elePaddingLeft, elePaddingRight);
      console.log(ele.childNodes);
      console.log(ele.childNodes[1] === this.$refs.layoutRef);
      let siblingsEleHeight = 0;
      // 排除当前容器及注释的节点
      Array.from(ele.childNodes).filter((item) => item !== this.$refs.layoutRef && item.nodeType !== 8).forEach(node => {
        const computedStyle = window.getComputedStyle(node);
        const height = computedStyle.height.replace('px', '') - 0;
        const mTop = computedStyle.marginTop.replace('px', '') - 0;
        const mBottom = computedStyle.marginBottom.replace('px', '') - 0;
        siblingsEleHeight += height + mTop + mBottom;
      });
      return ele.clientHeight - elePaddingLeft - elePaddingRight - siblingsEleHeight;
    }
  },
  props: {
    // y、x轴滚动设置
    scroll: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 数据源
    dataSource: {
      type: Array,
      default: () => []
    },
    // 列配置
    columns: {
      type: Array,
      default: () => []
    },
    // 容器内联样式
    layoutStyle: {
      type: Object,
      default: () => ({})
    },
    // 头部容器内联样式
    headerStyle: {
      type: Object,
      default: () => ({})
    },
    // 唯一key
    rowKey: {
      type: String,
      default: () => 'id'
    },
    // 分页配置
    pagination: {
      type: [Object, Boolean],
      default: () => ({
        showSizeChanger: true,
        size: 'small',
        showTotal: (total, range) =>
          `当前${range[0]}-${range[1]}条，共 ${total} 条`
      })
    },
    // 表格行样式名
    rowClassName: {
      type: Function
    },
    // 表格行设置
    customRow: {
      type: Function
    },
    // 工具栏是否隐藏显示
    toolbarVisible: {
      type: Boolean,
      default: () => false
    },
    // 导出按钮回调
    exportCallback: {
      type: Function
    },
    // 选择功能配置
    rowSelection: {
      type: Object
    },
    // 指定树形结构的列名
    childrenColumnName: {
      type: String
    },
    // 是否显示辅助操作栏
    showOperation: {
      type: Boolean,
      default: () => true
    },
    autoCalculateHeight: {
      type: Boolean,
      default: () => true
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.watchWindowResize);
  }
};
</script>

<style lang="less" scoped>

.a-container {
  overflow: hidden;
  background: @global-content-bg-color;

  .layout-header {
    overflow: hidden;
  }
}

.table-icon {
  &:hover {
    cursor: pointer;
    //color: primary-color;
    color: #1890ff;
  }
}

.operation-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 40px;

  & > :not(:first-child) {
    margin-left: 24px;
  }

  margin-right: 4px;
}
</style>
