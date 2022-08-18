import Vue from "vue";
import VueRouter from "vue-router";
import IndexView from "@/views/IndexView.vue";

/**
 * @type {import('vue-router').RouteConfig[]}
 */
const routes = [
  {
    name: "home",
    path: "/",
    component: IndexView
  }
];

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

export default router;
