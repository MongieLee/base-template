const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    width: 50
  },
  {
    title: '菜单名',
    dataIndex: 'name'
  },
  {
    title: '父级菜单',
    dataIndex: 'pid',
  },
  {
    title: '路由或者外链',
    dataIndex: 'path'
  }
];

const rules = {};
export { columns, rules };