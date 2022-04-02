import Vue from "vue";
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
} from "ant-design-vue";

Vue.use(Modal); // use [Vue.component] won't register directive and throw directive Error

const { Sider, Header, Content, Footer } = Layout;
const { Item: BreadcrumbItem } = Breadcrumb;
const { Item: MenuItem, SubMenu } = Menu;
const { Item: FormModelItem } = FormModel;
const { TabPane } = Tabs;

Vue.prototype.$message = message;

const components = [
  BreadcrumbItem,
  Button,
  DatePicker,
  Input,
  ConfigProvider,
  Icon,
  Layout,
  Menu,
  Sider,
  Header,
  Content,
  Footer,
  Breadcrumb,
  MenuItem,
  SubMenu,
  FormModel,
  FormModelItem,
  Card,
  Divider,
  Dropdown,
  Avatar,
  Table,
  Result,
  Tabs,
  TabPane,
  Tooltip,
];

export const batchImport = (components) => {
  for (let component of components) {
    Vue.component(component.name, component);
  }
};

batchImport(components);
