<template>
  <div
    ref="layoutRef"
    :style="{ ...layoutStyle }"
    class="a-container"
  >
    <div :style="headerStyle" ref="header" class="layout-header">
      <div style="text-align: right; display: flex; align-items: center">
        <div style="flex: 1">
          <slot name="header" />
        </div>
        <div v-if="toolbarVisible">
          <a-button
            @click="handlerExport"
            style="margin-left: 0.5em"
            title="导出为Excel"
            size="small"
            ghost
            type="primary"
          >
            <a-icon type="export" />
          </a-button>
        </div>
      </div>
    </div>
    <a-table
      :childrenColumnName="childrenColumnName"
      :rowSelection="rowSelection"
      bordered
      :data-source="dataSource"
      :columns="columns"
      size="small"
      :rowKey="rowKey"
      :pagination="typeof pagination === false ? pagination :{ ...defaultPagination, ...pagination }"
      :scroll="{ y: tableHeight, ...scroll }"
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
export default {
  data() {
    return {
      cloneColumns: this.columns,
      defaultPagination: {
        showSizeChanger: true,
        size: 'small',
        showTotal: (total, range) => {
          return `当前${range[0]}-${range[1]}条，共 ${total} 条`;
        }
      },
      tableHeight: 0
    };
  },
  mounted() {
    setTimeout(() => {
      this.getListHeight(this.getParentEleHeight());
    });
    window.addEventListener('resize', this.watchWindowResize);
  },

  methods: {
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
      this.tableHeight = parentEleHeight - dValue - 39 - (this.dataSource.length ? 56.5 : 0); // 39是表头，56.5是分页高度
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
      let sibingEleHeight = 0;
      // 排除当前容器及注释的节点
      Array.from(ele.childNodes).filter((item) => item !== this.$refs.layoutRef && item.nodeType !== 8).forEach(node => {
        const computedStyle = window.getComputedStyle(node);
        const height = computedStyle.height.replace('px', '') - 0;
        const mTop = computedStyle.marginTop.replace('px', '') - 0;
        const mBottom = computedStyle.marginBottom.replace('px', '') - 0;
        sibingEleHeight += height + mTop + mBottom;
      });
      return ele.clientHeight - elePaddingLeft - elePaddingRight - sibingEleHeight;
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
</style>
