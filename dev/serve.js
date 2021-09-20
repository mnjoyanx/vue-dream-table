import Vue from "vue";
import Dev from "./serve.vue";
import { removeUnderscores } from "../src/filters";
import { dateFilter } from "../src/filters";
import { capitalize } from "../src/filters";
import { maxStringSize } from "../src/filters";

import VueRouter from "vue-router";

Vue.use(VueRouter);

Vue.filter("removeUnderscores", removeUnderscores);
Vue.filter("dateFilter", dateFilter);
Vue.filter("capitalize", capitalize);
Vue.filter("maxStringSize", maxStringSize);

const router = new VueRouter({
  mode: "history",
});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Dev),
  router,
}).$mount("#app");
