import Vue from "vue";
import Vuex from "vuex";
import setting from "./modules/setting";
import auth from "./modules/auth";

Vue.use(Vuex);
const modules = { modules: { setting, auth } };

export default new Vuex.Store(modules);
