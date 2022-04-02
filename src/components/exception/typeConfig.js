const STATUS = {
  FORBIDDEN: "403",
  NOTFOUND: "404",
  SERVICE_ERROR: "500"
};

const config = {
  [STATUS.FORBIDDEN]: {
    img: "https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg",
    title: STATUS.FORBIDDEN,
    desc: "抱歉，你无权访问该页面"
  },
  [STATUS.NOTFOUND]: {
    img: "https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg",
    title: STATUS.NOTFOUND,
    desc: "抱歉，你访问的页面不存在或仍在开发中"
  },
  [STATUS.SERVICE_ERROR]: {
    img: "https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg",
    title: STATUS.SERVICE_ERROR,
    desc: "抱歉，服务器出错了"
  }
};

export default config;
export { STATUS };