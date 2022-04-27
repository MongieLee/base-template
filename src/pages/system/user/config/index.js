import moment from 'moment';

const columns = [
  {
    title: '序号',
    customRender(_, __, index) {
      return ++index;
    },
    width: 70,
    align: 'center'
  },
  {
    title: '账号',
    dataIndex: 'username'
  },
  {
    title: '头像',
    scopedSlots: {
      customRender: 'avatar'
    },
    dataIndex: 'avatar',
    width: '10%',
    align: 'center'
  },
  {
    title: '角色身份',
    dataIndex: 'roleNames',
    customRender(data) {
      return data ? data : '暂未分配角色';
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: {
      customRender: 'status'
    },
    width: '10%',
    align: 'center'
  },
  {
    title: '创建时间',
    customRender(data) {
      // 时区转换存在8小时误差
      return moment(data).add(8, 'hour').format('YYYY-MM-DD HH:mm');
    },
    dataIndex: 'createdAt'
  },
  {
    title: '操作',
    scopedSlots: {
      customRender: 'operate'
    },
    width: 220
  }
];

export { columns };
