import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import globalDispatch from "../plugins/global-dispatch";
import "../plugins/bus";

Vue.config.productionTip = false;

Vue.use(globalDispatch);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
