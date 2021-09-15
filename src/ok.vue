<template>
  <div class="main-wrapper">
    <h2 v-if="title" class="dream_table-title">{{ title }}</h2>
    <div class="filter-main d-flex justify-between">
      <div class="d-flex">
        <search-bar
          v-if="filters.search.searchable"
          :searchParams="filters.search"
          @searchHandler="searchHandler"
        />
        <div class="date_range-picker">
          <div
            class="absolute_range-picker"
            v-if="pickerIsVisible"
            @click="pickerIsVisible = false"
          ></div>
          <div class="d-flex align-center">
            <date-range-picker
              v-model="dateRange"
              @select="changeDate"
              @toggle="toggleDate"
              :ranges="false"
              :auto-apply="true"
              :close-on-esc="true"
            />
            <span
              class="close_date-range"
              @click="clearDateValue"
              v-if="dateRange.startDate !== null"
              >&#x2715;</span
            >
          </div>
        </div>
        <div class="select-bar" v-if="filters.select.selectable">
          <select-bar :select="filters.select" @select="selectHandler" />
        </div>
      </div>
      <div class="create-btn" v-if="allowAddNewItem">
        <button class="create_btn-item" @click="createItemHandler">Add</button>
      </div>
    </div>
    <table class="dream_table-main">
      <thead>
        <tr v-if="largestRowItems.length">
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
            <div @click="sortBy('name')" v-if="actions"></div>
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
      <tbody class="main-table" :class="{ 'loading-wrapper': isLoading }">
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
                  <button
                    class="show_more-info"
                    @click="showMoreHandler(item, i)"
                  >
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
              <div
                class="edit_item-action"
                :class="{ 'action_is-visible': !editable || !actions }"
              >
                <edit-item @edit="edit(item)" :actionAsIcon="actionAsIcon" />
              </div>
              <div :class="{ 'action_is-visible': !deletable || !actions }">
                <remove-item
                  @remove="remove(item)"
                  :actionAsIcon="actionAsIcon"
                />
              </div>
            </td>
          </tr>
        </template>

        <template v-else-if="isLoading">
          <div class="loading-wrapper">
            <img :src="loaderImg" v-if="loaderImg" class="image-center" />
            <div class="loading" v-else>Loading...</div>
          </div>
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

import HiddenItemsPopup from "./HIddenItemsPopup";
import EditItem from "./edit-item.vue";
import RemoveItem from "./remove-item.vue";
import SearchBar from "./search-bar";
import SelectBar from "./select-bar.vue";
import DateRangePicker from "vue2-daterange-picker";
//you need to import the CSS manually
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

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

    isLoad: {
      type: Boolean,
      default: false,
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

    actionAsIcon: {
      type: Boolean,
      default: () => false,
    },

    deleteRequest: {
      type: Object,
      required: false,
    },

    filters: {
      type: Object,
      default: () => {
        return {
          search: {
            searchable: true,
            placeholder: "Search",
            searchBy: "name",
          },
          select: {
            selectable: true,
            placeholder: "Select",
            optionValue: [],
          },

          date: {
            dateFilter: true,
            dateBy: "createdAt",
          },
        };
      },
    },

    // updatedRequest: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       crud: {
    //         uri: "hello update",
    //       },
    //     };
    //   },
    // },
  },

  components: {
    HiddenItemsPopup,
    EditItem,
    RemoveItem,
    SearchBar,
    SelectBar,
    DateRangePicker,
  },

  data() {
    return {
      allData: [],
      isLoading: false,
      image: "",
      errors: "",
      hiddenitems: ["created_at", "updated_at"],
      dateRange: {
        startDate: "2015-12-26",
        endDate: "2021-5-28",
      },
      pickerIsVisible: false,
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
    clearDateValue() {
      this.dateRange.startDate = null;
      this.dateRange.endDate = null;
      // const { date } = this.filters;

      // console.log(this.$route.query);
      // let param = JSON.parse(JSON.stringify(this.$route.query));
      // if (date.key) {
      //   console.log("oiiiiiiii", param[date.key]);

      //   delete param[date].key;
      //   console.log("oiiiiiiii", param[date.key]);
      // } else {
      //   delete param.dateBy;
      // }

      // // delete params[date.key];
      // this.$router.push({
      //   query: {
      //     path: this.$route.path,
      //     ...param,
      //   },
      // });
    },

    toggleDate() {
      this.pickerIsVisible = true;
    },

    changeDate() {
      const { date } = this.filters;
      let params = date.key
        ? {
            ...this.$route.query,
            [date.key]: JSON.stringify({
              [date.dateBy]: {
                from: this.dateRange.startDate,
                to: this.dateRange.endDate,
              },
            }),
          }
        : {
            ...this.$route.query,
            [date.dateBy]: {
              from: this.dateRange.startDate,
              to: this.dateRange.endDate,
            },
          };

      axios
        .get("http://git.inoclouds.com:4111/user/projects", {
          params,
        })
        .then((response) => {
          if (this.dataName) {
            const dataname = this.dataName.join(".");
            this.allData = response.data[dataname];
          } else {
            this.allData = response.data;
          }
        });

      this.$router.push({ query: params });
    },
    selectHandler(value) {
      const { select } = this.filters;
      let params = select.key
        ? {
            ...this.$route.query,
            [select.key]: JSON.stringify({ [select.selectBy]: value }),
          }
        : { ...this.$route.query, [select.selectBy]: value };

      if (!value) {
        delete params[select.key];
        this.$router.push({
          query: {
            path: this.$route.path,
            ...params,
          },
        });
      }

      this.$router.push({ query: params });

      axios
        .get("http://git.inoclouds.com:4111/user/projects", {
          params,
        })
        .then((response) => {
          if (this.dataName) {
            const dataname = this.dataName.join(".");
            this.allData = response.data[dataname];
          } else {
            this.allData = response.data;
          }
        });
    },

    searchHandler(value) {
      const { search } = this.filters;
      const params = search.key
        ? {
            ...this.$route.query,
            [search.key]: JSON.stringify({ [search.searchBy]: value }),
          }
        : { ...this.$route.query, [search.searchBy]: value };

      console.log(value, "vallall");
      if (!value) {
        delete params[search.key];
        this.$router.push({
          query: {
            path: this.$route.path,
            ...params,
          },
        });
      }
      this.$router.push({ query: params });

      axios
        .get("http://git.inoclouds.com:4111/user/projects", {
          params,
        })
        .then((response) => {
          if (this.dataName) {
            const dataname = this.dataName.join(".");
            this.allData = response.data[dataname];
          } else {
            this.allData = response.data;
          }
        });
    },

    changeVisibilityHandler(item) {
      if (this.hiddenitems.includes(item)) {
        this.hiddenitems = this.hiddenitems.filter((i) => i !== item);
      } else {
        this.hiddenitems.push(item);
      }
    },

    showHiddenItemsPopup() {
      this.$refs["hidden-items"].show();
    },

    showMoreHandler(item, i) {
      // this.$refs["show-more"].show();
      this.$emit("showMoreHandler", { data: item, item: i });
    },

    createItemHandler() {
      this.$emit("createHandler", this.largestRowItems);
    },

    sortBy() {
      return "sortyBy";
    },

    edit(item) {
      this.$emit("editHandler", item);
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
      if (this.isLoading) {
        this.isLoading = true;
      }
      axios
        .get("http://git.inoclouds.com:4111/user/projects")
        // .get(this.getUrl)
        // .get("http://crm.masterpharm.am:6661/cli?branch_id=2")
        // .get("https://randomuser.me/api/")
        // .get("http://localhost:3000/api/category")
        // .get(
        //   "https://conduit.productionready.io/api/articles?limit=10&offset=0"
        // )
        .then((response) => {
          this.isLoading = false;
          if (this.dataName) {
            const dataname = this.dataName.join(".");
            this.allData = response.data[dataname];
          } else {
            this.allData = response.data;
          }
        })
        .catch((err) => {
          this.errors = err.message;
          this.isLoading = false;
        });
    },
  },

  created() {
    if (this.$props.hiddenItemsByDefault.length) {
      this.hiddenitems = this.$props.hiddenItemsByDefault;
    }
    if (this.isLoad) {
      this.isLoading = this.isLoad;
    }
  },

  mounted() {
    axios.interceptors.request.use((config) => {
      // const token = this.token;
      // const authorizationToken = token ? token : "";
      // config.headers.Authorization =
      //   "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjMxNDQ0NzQxLCJleHAiOjE2MzUwNDQ3NDF9.Bs5ftW2MVLalfZSxZdJ8DOpc44aUa22EN8HtrWdc2_oY95Rc4WGBaDrXKMIr46spW7YSN4Zxs661m6KXx-x-KQ";
      config.headers.Authorization =
        this.token ||
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjMxNjQzOTk2LCJleHAiOjE2MzUyNDM5OTZ9.MPtXIAU_1R8iIe7gbRf1anAwCpUb6L734RCgbKfquUSFcopk4wXaG1bc291iLv96vgagQwnozW0SzyCLq-eBbQ";
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
.dream_table-title {
  text-align: left;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 0.5rem;
}
.main-wrapper {
  /* overflow: hidden; */
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

.align-center {
  align-items: center;
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
  width: 25%;
  margin-top: 30px;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
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

.action_is-visible {
  display: none;
}

.justify-between {
  justify-content: space-between;
}

.filter-main {
  margin-bottom: 10px;
}

.select-bar {
  margin-left: 10px;
}

.date_range-picker {
  margin-left: 10px;
}

.absolute_range-picker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

.close_date-range {
  color: gray;
  cursor: pointer;
  font-size: 20px;
  margin-left: 3px;
}
</style>
