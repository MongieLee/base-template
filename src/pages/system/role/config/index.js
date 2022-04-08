const columns = [
  {
    title: '序号',
    customRender(_, __, index) {
      return ++index;
    },
    width: 50,
    align: 'center'
  },
  {
    title: '资源名称',
    dataIndex: 'name'
  },
  {
    title: '资源地址',
    dataIndex: 'url'
  },
  {
    title: '资源描述',
    dataIndex: 'description'
  },
  {
    title: '所属分类',
    dataIndex: 'categroyName'
  },
  {
    title: '操作',
    scopedSlots: {
      customRender: 'operate'
    },
    width: 120
  }
];

const rules = {
  name: [
    { required: true, trigger: 'change', message: '请输入菜单名' }
  ],
  url: [
    { required: true, trigger: 'change', message: '请输入资源地址' }
  ],
  categroyId: [
    { required: true,trigger: 'change', message: '请选择资源所属分类' }
  ]
};

export { columns, rules };