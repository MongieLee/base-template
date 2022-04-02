import NProgress from "nprogress";
import { message } from "ant-design-vue";
import { inspectTokenValidity } from "utils/token";

/**
 * start nprogress animation
 */
const startNprogress = () => {
  if (!NProgress.isStarted) {
    NProgress.start();
  }
};

const nprogressEnd = () => {
  NProgress.done();
};

const loginGuard = (to, from, next, options) => {
  if (inspectTokenValidity()) {
    message.warning("登录凭证已过期，请重新登录");
    next({ path: "/login" });
  } else {
    next();
  }
};

/**
 * authorization guard
 * @param to
 * @param from
 * @param next
 * @param options
 */
const authorityGuard = (to, from, next, options) => {
  function hasAuthority(to, permissions, roles) {
    return false;
  }

  if (!hasAuthority(to, permissions = 1, roles = 3)) {
    next({ name: "403" });
  } else {
    next();
  }
};


export default {
  beforeEach: [startNprogress, loginGuard],
  afterEach: [nprogressEnd]
};