import moment from 'moment';

const menuTypeEnum = {
  'M': '目录',
  'C': '菜单',
  'F': '功能按钮'
};

const columns = [
  {
    title: '菜单名',
    dataIndex: 'name'
  },
  {
    title: '父级菜单',
    dataIndex: 'parentName',
    customRender(data) {
      return data
    }
  },
  {
    title: '排序',
    dataIndex: 'sequence',
    width: 50
  },
  {
    title: '菜单图标',
    dataIndex: 'icon',
    scopedSlots: {
      customRender: 'icon'
    },
    width: 80,
    align: 'center'
  },
  {
    title: '菜单类型',
    dataIndex: 'menuType',
    customRender(data) {
      return menuTypeEnum[data] || '-';
    },
    width: 80
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    customRender(data) {
      return data
    }
  },
  {
    title: '显示状态',
    dataIndex: 'visible',
    scopedSlots: {
      customRender: 'visible'
    },
    width: 80
  },
  {
    title: '路由或者外链',
    dataIndex: 'path'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    customRender(data) {
      return moment(data).format('YYYY-MM-DD HH:mm');
    }
  },
  {
    title: '操作',
    scopedSlots: {
      customRender: 'operate'
    }
  }
];

const rules = {
  name: [
    { required: true, trigger: 'change', message: '请输入菜单名' }
  ],
  path: [
    { required: true, trigger: 'change', message: '请输入路由或外链' }
  ]
};

export { columns, rules, menuTypeEnum };