import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import globalDispatch from "./mixins/global-dispatch";

Vue.config.productionTip = false;

Vue.mixin(globalDispatch);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
