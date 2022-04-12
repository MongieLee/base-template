import moment from 'moment';

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
    title: '账号',
    dataIndex: 'username'
  },
  {
    title: '头像',
    scopedSlots: {
      customRender: 'avatar'
    },
    dataIndex: 'avatar'
  },
  {
    title: '角色身份',
    dataIndex: 'roleNames',
    customRender(data) {
      return data ? data : '暂未分配角色';
    }
  },
  {
    title: '创建时间',
    customRender(data) {
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

const rules = {
  username: [
    { required: true, trigger: 'change', message: '请输入用户名' }
  ],
  password: [
    { required: true, trigger: 'change', message: '请输入密码' }
  ],
  verifyPassword: [
    { required: true, trigger: 'change', message: '请输入确认密码' }
  ]
};

export { columns, rules };
