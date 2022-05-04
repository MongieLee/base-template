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
    title: '标题',
    dataIndex: 'title'
  },
  {
    title: '封面图片',
    scopedSlots: {
      customRender: 'coverImg'
    },
    dataIndex: 'coverImg',
    width: '20%',
    align: 'center'
  },
  {
    title: '发布状态',
    dataIndex: 'isPublish',
    scopedSlots: {
      customRender: 'isPublish'
    },
    width: '10%',
    align: 'center'
  },
  {
    title: '发布人',
    dataIndex: 'publishedBy',
    customRender(data) {
      return data ? data : '-';
    }
  },
  {
    title: '发布时间',
    customRender(data) {
      // 时区转换存在8小时误差
      return data ? moment(data).add(8, 'hour').format('YYYY-MM-DD HH:mm') : '-';
    },
    dataIndex: 'publishedAt'
  },
  {
    title: '创建人',
    dataIndex: 'createdBy',
    customRender(data) {
      return data ? data : '-';
    }
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

const rules = {
  content: [
    {required: true, trigger: 'change', message: '请输入正文内容'},
    {
      validator(rule, value, callback) {
        if (value === '<p data-we-empty-p=""><br></p>') {
          callback(new Error('请输入正文内容'))
        } else {
          callback()
        }
      }, trigger: 'change', message: '请输入正文内容'
    },
  ],
    title: [
    {required: true, trigger: 'change', message: '请输入资讯标题'}
  ],
}

export {columns,rules};
