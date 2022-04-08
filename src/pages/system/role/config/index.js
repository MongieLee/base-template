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
    title: '操作',
    scopedSlots: {
      customRender: 'operate'
    },
    width: 320
  }
];

const rules = {
  name: [
    { required: true, trigger: 'change', message: '请输入角色名称' }
  ],
  code: [
    { required: true, trigger: 'change', message: '请输入角色编码' }
  ],
};

export { columns, rules };
