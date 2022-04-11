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
    title: '分类名称',
    dataIndex: 'name'
  },
  {
    title: '排序',
    dataIndex: 'sequence'
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
    { required: true, trigger: 'change', message: '请输入分类名称' }
  ]
};

export { columns, rules };