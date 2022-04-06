import Vue from 'vue';
import './importAntd';
import TableWrapper from 'components/tableWrapper/TableWrapper';
import ContentMenu from 'components/contentMenu/ContentMenu';
import wangEditor from 'components/WangEditor';
import SimpleBar from 'components/SimpleBar';
import * as echarts from 'echarts';
import WEditor from 'wangeditor';

Vue.prototype.$echarts = echarts;
Vue.prototype.$WEditor = WEditor;

Vue.component('table-wrapper', TableWrapper);
Vue.component('content-menu', ContentMenu);
Vue.component('w-editor', wangEditor);
Vue.component('simple-bar', SimpleBar);
