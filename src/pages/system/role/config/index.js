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
<<<<<<< HEAD
    title: '角色名称',
    dataIndex: 'name'
  },
  {
    title: '角色编码',
    dataIndex: 'code'
  },
  {
    title: '角色描述',
    dataIndex: 'description'
  },
  {
=======
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
>>>>>>> origin/main
    title: '操作',
    scopedSlots: {
      customRender: 'operate'
    },
<<<<<<< HEAD
    width: 320
=======
    width: 120
>>>>>>> origin/main
  }
];

const rules = {
  name: [
<<<<<<< HEAD
    { required: true, trigger: 'change', message: '请输入角色名称' }
  ],
  code: [
    { required: true, trigger: 'change', message: '请输入角色编码' }
  ],
};

export { columns, rules };
=======
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
>>>>>>> origin/main
