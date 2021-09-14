import Vue from "vue";
import Dev from "./serve.vue";

import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Dev),
  router,
}).$mount("#app");
