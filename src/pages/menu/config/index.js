const columns = [
  {
    title: '菜单名',
    dataIndex: 'name'
  },
  {
    title: '父级菜单',
    dataIndex: 'parentName',
    customRender(data) {
      return data ? data : '-';
    }
  },
  {
    title: '路由或者外链',
    dataIndex: 'path'
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

export { columns, rules };