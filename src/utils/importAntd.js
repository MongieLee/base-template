import Vue from 'vue';
import {
  Button,
  DatePicker,
  Input,
  ConfigProvider,
  Layout,
  Menu,
  Icon,
  Breadcrumb,
  FormModel,
  Card,
  Divider,
  message,
  Dropdown,
  Avatar,
  Table,
  Modal,
  Result,
  Tabs,
  Tooltip,
  TreeSelect,
  Popconfirm,
  Tree,
  Upload,
  InputNumber,
  Select
} from 'ant-design-vue';

Vue.use(Modal); // use [Vue.component] won't register directive and throw directive Error
Vue.prototype.$modal = Modal;

const { Sider, Header, Content, Footer } = Layout;
const { Item: BreadcrumbItem } = Breadcrumb;
const { Item: MenuItem, SubMenu } = Menu;
const { Item: FormModelItem } = FormModel;
const { TabPane } = Tabs;
const { TextArea } = Input;
Vue.prototype.$message = message;

const components = [Select, BreadcrumbItem, Button, DatePicker, Input, ConfigProvider, Icon, Layout, Menu, Sider, Header, Content, Footer, Breadcrumb, MenuItem, SubMenu, FormModel, FormModelItem, Card, Divider, Dropdown, Avatar, Table, Result, Tabs, TabPane, Tooltip, TreeSelect, Popconfirm, TextArea, Tree, Upload, InputNumber
];

export const batchImport = (components) => {
  for (let component of components) {
    Vue.component(component.name, component);
  }
};

batchImport(components);
