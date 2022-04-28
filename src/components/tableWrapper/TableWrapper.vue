<template>
  <div ref="layoutRef" :style="layoutStyle" class="a-container">
    <div :style="headerStyle" ref="header" class="layout-header">
      <slot name="header" />
      <!-- 刷新 表格大小 控制列 -->
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

    <!-- 实际表格区域 -->
    <a-table
      :childrenColumnName="childrenColumnName"
      :rowSelection="rowSelection"
      bordered
      :data-source="dataSource"
      :columns="columnConfiguration"
      :size="customSize"
      :rowKey="rowKey"
      :scroll="scrollConfig"
      :pagination="typeof pagination === 'boolean' ? pagination :{ ...defaultPagination, ...pagination }"
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

const pxConvertNumber = (str) => Number(str.replace('px', ''));

export default {
  name: 'TableWrapper',
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
  computed: {
    scrollConfig() {
      return Reflect.ownKeys(this.scroll).keys().length === 0
        ? false
        : ({ ...this.scroll });
    },
    everyChecked: {
      get() {
        return this.cloneColumns.every(record => record.checked);
      },
      set(value) {
        return value;
      }
    },
    columnConfiguration() {
      return this.cloneColumns.filter(i => i.checked);
    }
  },
  methods: {
    allColumnChange(e) {
      this.cloneColumns.forEach(i => i.checked = e.target.checked);
    },
    resetColumnConfiguration() {
      this.cloneColumns.forEach(i => i.checked = true);
    },
    // 更改表格尺寸
    sizeChange({ key }) {
      this.customSize = key;
      // this.getContentHeight();
    },
    // 分页页码及页数变更时触发提交一个事件供外部接收回调
    paginationChange(pagination, filters, sorter, { currentDataSource }) {
      this.$emit('change', pagination, filters, sorter, { currentDataSource });
    },
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
  beforeDestroy() {
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
