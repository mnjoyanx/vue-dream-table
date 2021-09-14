<template>
  <div class="main-wrapper">
    <h2 v-if="title" class="dream_table-title">{{ title }}</h2>
    <super-modal ref="super-modal" @create="create" />
    <show-more ref="show-more" />
    <div class="create-btn" v-if="allowAddNewItem">
      <button class="create_btn-item" @click="createItemHandler">Add</button>
    </div>
    <table class="dream_table-main">
      <thead>
        <tr>
          <th
            v-for="item in largestRowItems"
            :key="item"
            :class="{
              none: hiddenitems.includes(item),
            }"
          >
            {{ item }}
          </th>
          <th class="table-actions">
            <div @click="sortBy('name')" v-if="actions">Actions</div>
            <div
              :class="{
                'hidden_items-popup': !showPopupToCheckHiddenItems,
                'show_hidden-items': showPopupToCheckHiddenItems,
              }"
            >
              <span @click="showHiddenItemsPopup" class="show_hidden-items"
                >...</span
              >
              <hidden-items-popup
                ref="hidden-items"
                :items="
                  hiddenItemsByDefault.length
                    ? hiddenItemsByDefault
                    : hiddenitems
                "
                @changeVisibility="changeVisibilityHandler"
              />
            </div>
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
                  none: hiddenitems.includes(i),
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
            <td class="d-flex">
              <div class="edit_item-action" v-if="editable">
                <edit-item @edit="edit(item)" :actionAsIcon="actionAsIcon" />
              </div>
              <div v-if="deletable">
                <remove-item
                  @remove="remove(item)"
                  :actionAsIcon="actionAsIcon"
                />
              </div>
            </td>
          </tr>
        </template>
        <template v-else-if="isLoading">
          <tr>
            <td colspan="100">
              <img :src="loaderImg" v-if="loaderImg" class="image-center" />
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
import EditItem from "./edit-item.vue";
import RemoveItem from "./remove-item.vue";

export default {
  name: "VueDreamTable",

  props: {
    token: {
      type: String,
      required: false,
    },

    getUrl: {
      type: String,
      default: () => "https://jsonplaceholder.typicode.com/users",
    },

    createUrl: {
      type: String,
      default: () => "https://jsonplaceholder.typicode.com/users",
    },

    title: {
      type: String,
      required: false,
    },

    loaderImg: {
      type: String,
      required: false,
    },

    dataName: {
      type: Array,
      default: () => [],
    },

    isHiddenByDefault: {
      type: Boolean,
      default: () => true,
    },

    hiddenItemsByDefault: {
      type: Array,
      default: () => ["created_at", "updated_at"],
    },

    showPopupToCheckHiddenItems: {
      type: Boolean,
      default: () => true,
    },

    chosenHiddenItemsByDefault: {
      type: Array,
      required: false,
    },

    actions: {
      type: Boolean,
      default: () => false,
    },

    allowAddNewItem: {
      type: Boolean,
      default: () => false,
    },

    editable: {
      type: Boolean,
      default: () => false,
    },

    deletable: {
      type: Boolean,
      default: () => true,
    },

    addItemFields: {
      type: Array,
      default: () => [],
      required: false,
    },

    createRequestParam: {
      type: String,
      required: false,
    },

    actionAsIcon: {
      type: Boolean,
      default: () => false,
    },

    deleteRequest: {
      type: Object,
      required: false,
    },
  },

  components: {
    SuperModal,
    ShowMore,
    HiddenItemsPopup,
    EditItem,
    RemoveItem,
  },

  data() {
    return {
      allData: [],
      isLoading: false,
      image: "",
      errors: "",
      hiddenitems: ["created_at", "updated_at"],
    };
  },

  computed: {
    largestRowItems() {
      if (this.allData.length) {
        const uniqueItems = this.allData.reduce((a, b) => {
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
    changeVisibilityHandler(item) {
      if (this.hiddenitems.includes(item)) {
        this.hiddenitems = this.hiddenitems.filter((i) => i !== item);
      } else {
        this.hiddenitems.push(item);
      }

      console.log(this.hiddenitems, 9999999);
    },

    showHiddenItemsPopup() {
      this.$refs["hidden-items"].show();
    },

    showMoreHandler() {
      this.$refs["show-more"].show();
    },

    create(data) {
      axios
        .post(
          this.createUrl,
          this.createRequestParam ? { [this.createRequestParam]: data } : data
        )
        .then(() => {
          this.getData();
        });
    },

    createItemHandler() {
      this.$refs["super-modal"].show(
        this.addItemFields.length ? this.addItemFields : this.largestRowItems
      );
    },

    sortBy() {
      return "sortyBy";
    },

    edit(item) {
      return "edit";
    },

    remove(item) {
      this.deleteRequest.method = this.deleteRequest.method.toUpperCase();
      if (this.deleteRequest.method === "DELETE") {
        axios
          .delete(
            this.deleteRequest.url +
              "/" +
              item[this.deleteRequest.deleteRequestParam]
          )
          .then(() => {
            this.getData();
          })
          .catch((err) => {
            this.errors = err;
          });
      } else {
        axios
          .post(this.deleteRequest.url, {
            [this.deleteRequest.deleteRequestParam]:
              item[this.deleteRequest.deleteRequestParam],
          })
          .then(() => {
            this.getData();
          })
          .catch((err) => {
            this.errors = err;
          });
      }
    },

    getData() {
      this.isLoading = true;
      axios
        // .get("http://git.inoclouds.com:4111/user/projects")
        .get(this.getUrl)
        // .get("http://crm.masterpharm.am:6661/cli?branch_id=2")
        // .get("https://randomuser.me/api/")
        // .get("http://localhost:3000/api/category")
        // .get(
        //   "https://conduit.productionready.io/api/articles?limit=10&offset=0"
        // )
        .then((response) => {
          this.isLoading = false;
          if (this.dataName.length) {
            const dataname = this.dataName.join(".");
            this.allData = response.data[dataname];
          } else {
            this.allData = response.data;
          }
        })
        .catch((err) => {
          console.log(err.message, "err");
          this.errors = err.message;
          this.isLoading = false;
        });
    },
  },

  created() {
    if (this.$props.hiddenItemsByDefault.length) {
      this.hiddenitems = this.$props.hiddenItemsByDefault;
    }
    console.log("created", this.$props.hiddenItemsByDefault);
  },

  mounted() {
    console.log(this.hiddenItemsByDefault, "defa");
    axios.interceptors.request.use((config) => {
      // const token = this.token;
      // const authorizationToken = token ? token : "";
      // config.headers.Authorization =
      //   "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjMxNDQ0NzQxLCJleHAiOjE2MzUwNDQ3NDF9.Bs5ftW2MVLalfZSxZdJ8DOpc44aUa22EN8HtrWdc2_oY95Rc4WGBaDrXKMIr46spW7YSN4Zxs661m6KXx-x-KQ";
      config.headers[this.headerAuthorizationType] = this.token || "";
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

    console.log(this.$props, "props");
    this.getData();
  },
};
</script>

<style scoped>
.dream_table-title {
  text-align: left;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 0.5rem;
}
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

.d-flex {
  display: flex;
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

.image-center {
  text-align: center;
}

.hidden_items-popup {
  display: none;
}

.show_hidden-items {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

.edit_item-action {
  margin-right: 5px;
}
</style>
