<template>
  <div class="main-wrapper">
    <!-- <slot name="title">{{ options.title }}</slot> -->
    <super-modal ref="super-modal" :items="largestRowItems" @create="create" />
    <show-more ref="show-more" />
    <slot name="create">
      <div class="create-btn">
        <button class="create_btn-item" @click="createItemHandler">Add</button>
      </div>
    </slot>
    <table class="dream_table-main">
      <thead>
        <tr>
          <th
            v-for="item in largestRowItems"
            :key="item"
            :class="{ none: defaultHiddenItems.includes(item) }"
          >
            {{ item }}
          </th>
          <th class="table-actions">
            <button @click="sortBy('name')">Actions</button>
            <span @click="showHiddenItemsPopup">...</span>
            <hidden-items-popup
              ref="hidden-items"
              v-if="isHiddenByDefault || chosenHiddenItemsByDefault.length > 1"
              :items="
                hiddenItemsByDefault.length
                  ? hiddenItemsByDefault
                  : isHiddenByDefault
                  ? hiddenitems
                  : !isHiddenByDefault && chosenHiddenItemsByDefault.length > 1
                  ? chosenHiddenItemsByDefault
                  : defaultHiddenItems
              "
            />
          </th>
        </tr>
      </thead>
      <tbody class="main-table">
        <template v-if="allData.length">
          <tr v-for="(item, key) in allData" :key="key">
            <template>
              <td
                v-for="(i, key) in Object.keys(item)"
                :key="key"
                :class="{
                  'more_info-btn':
                    typeof item[i] === 'object' && item[i] !== null,
                  none: defaultHiddenItems.includes(i),
                }"
                class="dream-table-td"
              >
                <!-- if field is object show it in popup modal -->
                <template
                  v-if="typeof item[i] === 'object' && item[i] !== null"
                >
                  [Object object]
                  <button class="show_more-info" @click="showMoreHandler">
                    show more
                  </button>
                </template>
                <template
                  v-else-if="item[i] == null || typeof item[i] == undefined"
                >
                  <p>empty</p>
                </template>
                <template v-else>
                  <template v-if="image">
                    <img :src="image" alt="image" class="dream-image" />
                  </template>
                  <template v-else>
                    {{ item[i] }}
                  </template>
                </template>
              </td>
            </template>
            <td>
              <button @click="remove(item)">Remove</button>
            </td>
          </tr>
        </template>
        <template v-else-if="isLoading">
          <tr>
            <td colspan="100">
              <img :src="loaderImg" v-if="loaderImg" />
              <div class="loading" v-else>Loading...</div>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="3">No Data {{ errors }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
const axios = require("axios");

import SuperModal from "./super-modal.vue";
import ShowMore from "./show-more.vue";
import HiddenItemsPopup from "./HIddenItemsPopup";

export default /*#__PURE__*/ {
  name: "VueDreamTable", // vue component name

  props: [
    "baseURL",
    "method",
    "token",
    "getUrl",
    "createUrl",
    "title",
    "loaderImg",
    "dataName",
    "isHiddenByDefault",
    "hiddenItemsByDefault",
    "chosenHiddenItemsByDefault",
  ],
  // props: {
  //   options: {
  //     type: Object,
  //     required: true,

  //     baseURL: {
  //       type: String,
  //       default: "https://jsonplaceholder.typicode.com/",
  //     },

  //     method: {
  //       type: String,
  //       default: "GET",
  //     },

  //     token: {
  //       type: String,
  //       required: true,
  //     },

  //     getUrl: {
  //       type: String,
  //       default: () => "https://jsonplaceholder.typicode.com/users",
  //     },

  //     createUrl: {
  //       type: String,
  //       default: "https://jsonplaceholder.typicode.com/users",
  //     },

  //     title: {
  //       type: String,
  //       default: () => "Dream Table",
  //     },

  //     loaderImg: {
  //       type: String,
  //       required: false,
  //     },
  //   },
  // },

  components: {
    SuperModal,
    ShowMore,
    HiddenItemsPopup,
  },

  data() {
    return {
      allData: [],
      isLoading: false,
      image: "",
      errors: "",
      defaultHiddenItems: ["created_at", "updated_at"],
      hiddenitems: ["username", "email"],
    };
  },

  computed: {
    largestRowItems() {
      if (this.allData.length) {
        const uniqueItems = this.allData.reduce((a, b) => {
          // Object.assign(b, a);
          JSON.parse(JSON.stringify(b));
          return b;
        }, {});
        return Object.keys(uniqueItems);
      } else {
        return [];
      }
    },
  },

  methods: {
    showHiddenItemsPopup() {
      this.$refs["hidden-items"].show();
    },

    showMoreHandler() {
      this.$refs["show-more"].show();
    },

    create(a) {
      axios.post("http://localhost:3000/api/category", a).then(() => {
        this.getData();
      });
    },

    createItemHandler() {
      this.$emit("create", "ok");
      this.$refs["super-modal"].show(this.largestRowItems);
    },

    sortBy() {
      return "sortyBy";
    },

    remove() {
      return "remove";
    },

    getData() {
      this.isLoading = true;
      axios
        // .get("http://git.inoclouds.com:4111/user/projects")
        .get("https://jsonplaceholder.typicode.com/users")
        // .get("http://crm.masterpharm.am:6661/cli?branch_id=2")
        // .get("https://randomuser.me/api/")
        // .get("http://localhost:3000/api/category")
        // .get(
        //   "https://conduit.productionready.io/api/articles?limit=10&offset=0"
        // )
        .then((response) => {
          this.isLoading = false;
          // const dataname = this.dataName.join(".");
          this.allData = response.data;
        })
        .catch((err) => {
          console.log(err.message, "err");
          this.errors = err.message;
          this.isLoading = false;
        });
    },
  },

  mounted() {
    axios.interceptors.request.use((config) => {
      // const token = this.token;
      // const authorizationToken = token ? token : "";
      config.headers.Authorization =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjMxNDQ0NzQxLCJleHAiOjE2MzUwNDQ3NDF9.Bs5ftW2MVLalfZSxZdJ8DOpc44aUa22EN8HtrWdc2_oY95Rc4WGBaDrXKMIr46spW7YSN4Zxs661m6KXx-x-KQ";
      return config;
    });

    // setTimeout(() => {
    //   (function(window) {
    //     var errors = {};

    //     window.checkImage = function(url, success, failure) {
    //       var img = new Image(), // the
    //         loaded = false,
    //         errored = false;

    //       img.onload = function() {
    //         if (loaded) {
    //           return;
    //         }

    //         loaded = true;

    //         if (success && success.call) {
    //           success.call(img);
    //         }
    //       };

    //       img.onerror = function() {
    //         if (errored) {
    //           return;
    //         }

    //         errors[url] = errored = true;

    //         if (failure && failure.call) {
    //           failure.call(img);
    //         }
    //       };

    //       img.src = url;
    //       this.image = img.src;
    //       if (errors[url]) {
    //         img.onerror.call(img);
    //       }

    //       if (img.complete) {
    //         img.onload.call(img);
    //       }
    //     };
    //     window.checkImage("https://via.placeholder.com/600/92c952");
    //   })(this);
    // }, 5000);

    this.getData();
  },
};
</script>

<style scoped>
.main-wrapper {
  overflow: hidden;
}

.dream_table-main {
  font-family: arial, sans-serif;
  width: 100%;
  border-collapse: collapse;
}
table tbody {
}

table thead {
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

td {
}

tr:nth-child(even) {
  background-color: #dddddd;
}

.show_more-info {
  background-color: #4caf50;
  color: white;
  padding: 5px;
  border: none;
  font-size: 11px;
  border-radius: 5px;
  cursor: pointer;
}

.more_info-btn {
}

.create-btn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.create_btn-item {
  background: #dddddd;
  border: 1px solid black;
  padding: 4px 8px;
  cursor: pointer;
}

.dream-image {
  width: 50px;
  height: 50px;
}

.none {
  display: none;
}

.table-actions {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.table-actions span {
  cursor: pointer;
}
</style>
