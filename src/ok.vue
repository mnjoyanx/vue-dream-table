<template>
  <div class="main-wrapper">
    <h2 v-if="options.title" class="dream_table-title">{{ options.title }}</h2>
    <div class="filter-main d-flex justify-between">
      <div class="d-flex">
        <search-bar
          v-if="Object.keys(options.filters && options.filters.search).length"
          :searchParams="options.filters.search"
          :defaultSearchValueData="options.filters.search.defaultSearchValue"
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
              v-if="
                options.filters &&
                  options.filters.date &&
                  Object.keys(options.filters.date).length
              "
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
              v-if="
                dateRange.startDate !== null &&
                  options.filters &&
                  Object.keys(options.filters.date).length
              "
              >&#x2715;</span
            >
          </div>
        </div>
        <div
          class="select-bar"
          v-if="
            options.filters.select && Object.keys(options.filters.select).length
          "
        >
          <select-bar
            :select="options.filters.select"
            @select="selectHandler"
          />
        </div>
      </div>
      <div class="create-btn" v-if="options.allowAddNewItem">
        <button class="create_btn-item" @click="createItemHandler">Add</button>
      </div>
    </div>
    <div class="table_scroll-x">
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
              <span @click="sortHandler(item)" class="dram_table-th">
                {{ item | capitalize | removeUnderscores }}
                <span v-if="sortOrderData === 'desc' && sortByData === item"
                  >&#8648;</span
                >
                <span v-if="sortOrderData === 'asc' && sortByData === item"
                  >&#8650;</span
                >
              </span>
            </th>
            <th class="table-actions" :class="{ none: !options.actions }">
              <div @click="sortBy('name')">Actions</div>
              <div
                :class="{
                  'hidden_items-popup': !options.showPopupToCheckHiddenItems,
                  'show_hidden-items': options.showPopupToCheckHiddenItems,
                }"
              >
                <span @click="showHiddenItemsPopup" class="show_hidden-items"
                  >...</span
                >
                <hidden-items-popup
                  ref="hidden-items"
                  :items="
                    options.hiddenItemsByDefault
                      ? options.hiddenItemsByDefault
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
                  <template v-if="typeof item[i] === 'object' && item[i]">
                    <button
                      class="show_more-info"
                      @click="showMoreHandler(item, i)"
                    >
                      show more
                    </button>
                  </template>

                  <template v-else-if="!item[i]">
                    <template v-if="item[i] == 0">
                      0
                    </template>
                    <template v-else-if="item[i] == false">
                      false
                    </template>
                    <template v-else>
                      N/A
                    </template>
                  </template>
                  <template v-else>
                    <template v-if="typeof item[i] === 'string'">
                      {{ item[i] | maxStringSize(options.maxStrSize) }}
                    </template>
                    <template v-else>
                      {{ item[i] }}
                    </template>
                  </template>
                </td>
              </template>
              <td
                class="d-flex actions-table"
                :class="{
                  none:
                    (!options.editable && !options.deletable) ||
                    !options.actions,
                }"
              >
                <div
                  class="edit_item-action"
                  :class="{
                    'action_is-visible': !options.editable || !options.actions,
                  }"
                >
                  <edit-item
                    @edit="edit(item)"
                    :actionAsIcon="options.actionAsIcon"
                  />
                </div>
                <div
                  :class="{
                    'action_is-visible': !options.deletable || !options.actions,
                  }"
                >
                  <remove-item
                    @remove="remove(item)"
                    :actionAsIcon="options.actionAsIcon"
                  />
                </div>
              </td>
            </tr>
          </template>

          <template v-else-if="isLoading">
            <div class="loading-wrapper">
              <img
                :src="options.loaderImg"
                v-if="options.loaderImg"
                class="image-center"
              />
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

    <template
      v-if="
        options.filters &&
          options.filters.pagination &&
          Object.keys(options.filters.pagination).length
      "
    >
      <dream-pagination
        :paginationInfo="options.filters.pagination"
        :count="count"
        :defaultPaginationPage="defaultPaginationPage"
        @paginate="paginate"
      />
    </template>
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
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import DreamPagination from "./dream-pagination.vue";
export default {
  name: "VueDreamTable",
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  components: {
    HiddenItemsPopup,
    EditItem,
    RemoveItem,
    SearchBar,
    SelectBar,
    DateRangePicker,
    DreamPagination,
  },
  data() {
    return {
      allData: [],
      lorem:
        "lorem sdvksmdvsmd vs dvsodvmsodv sdvkmsldkvmsdv sdvkmsdmvsdvmsdvsdvmsdvv",
      isLoading: false,
      image: "",
      errors: "",
      hiddenitems: ["created_at", "updated_at"],
      dateRange: {
        startDate: "2015-12-26",
        endDate: "2021-5-28",
      },
      pickerIsVisible: false,
      count: null,
      defaultQueryParams: null,
      defaultSearchValueData: "",
      defaultPaginationPage: null,
      sortByData: "",
      sortOrderData: "",
      isSorted: false,
      sortIsClicked: false,
      defaultSortData: [],
      sortOrderedData: "",
      defaultGetUrl: "https://jsonplaceholder.typicode.com/users",
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
    sortHandler(item) {
      const { getUrl, dataName, filters } = this.options;
      const { pagination, sort } = filters;
      let sortQueries;
      if (this.sortByData !== item) {
        this.sortOrderData = "desc";
        this.sortByData = item;
        this.sortIsClicked = true;
        if (sort.sortOrderByData) {
          this.$emit("sortCallback", [item, this.sortOrderData]);
        }
      } else {
        if (this.sortOrderData === "desc" && this.sortIsClicked) {
          this.sortOrderData = "asc";
          this.sortIsClicked = true;
          if (sort.sortOrderByData) {
            this.$emit("sortCallback", [item, this.sortOrderData]);
          }
        } else if (this.sortOrderData === "asc" && this.sortIsClicked) {
          this.sortIsClicked = false;
          this.sortOrderData = "";
          if (sort.sortOrderByData) {
            if (this.sortOrderData === "") {
              const params = {
                ...this.defaultQueryParams,
              };
              delete params.sort;
              this.$router.push({
                query: {
                  path: this.$route.path,
                  ...params,
                },
              });
            }
            // this.$emit("sortCallback", [item, " "]);
          }
        } else {
          this.sortIsClicked = true;
          this.sortOrderData = "desc";
          if (sort.sortOrderByData) {
            this.$emit("sortCallback", [item, this.sortOrderData]);
          }
        }
      }
      if (sort.sortOrderByData) {
        if (this.sortOrderData === "") {
          delete sortQueries.sort;
          sortQueries = {
            ...this.defaultQueryParams,
          };
        }
        if (typeof sort.sortOrderByData === "object") {
          sortQueries = { ...sort.sortOrderByData };
        } else {
          console.log("else");
          sortQueries = JSON.parse(sort.sortOrderByData);
        }
      } else {
        sortQueries = { [this.sortByData]: this.sortOrderData };
      }
      const params = {
        ...this.defaultQueryParams,
        ...sortQueries,
      };
      console.log(params, 7777);
      if (this.sortOrderData === "") {
        delete params[this.sortByData];
        this.$router.push({
          query: {
            path: this.$route.path,
            ...params,
          },
        });
      }
      this.$router.push({ query: params });
      axios
        .get(getUrl, {
          params,
        })
        .then((response) => {
          if (pagination && Object.keys(pagination).length) {
            if (pagination.key) {
              if (pagination.count) {
                console.error(
                  `Please pass one of these fields 'count' or 'key' to get data count`
                );
                throw new Error();
              }
              let dataClone = JSON.parse(JSON.stringify(response.data));
              for (let i = 0; i < pagination.key.length; i++) {
                dataClone = dataClone[pagination.key[i]];
              }
              this.count = dataClone;
            }
          }
          if (dataName) {
            let dataClone = JSON.parse(JSON.stringify(response.data));
            for (let i = 0; i < dataName.length; i++) {
              dataClone = dataClone[dataName[i]];
            }
            this.allData = dataClone;
          } else {
            this.allData = response.data;
          }
        });
    },
    paginate(info) {
      const { getUrl, dataName, filters } = this.options;
      const { pagination } = filters;
      this.defaultPaginationPage = null;
      const params = {
        ...this.defaultQueryParams,
        page: info.currentPage,
        limit: info.limit,
      };
      if (pagination.initialQueryParams) {
        for (let key in pagination.initialQueryParams) {
          params[key] = pagination.initialQueryParams[key];
        }
      }
      axios
        .get(getUrl, { params })
        .then((response) => {
          if (dataName) {
            let dataClone = JSON.parse(JSON.stringify(response.data));
            for (let i = 0; i < dataName.length; i++) {
              dataClone = dataClone[dataName[i]];
            }
            this.allData = dataClone;
          } else {
            this.allData = response.data;
          }
        })
        .catch((err) => {
          this.errors = err;
        });
      this.$router.push({ query: params });
    },
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
      const { dataName, filters } = this.options;
      const { date } = filters;
      let params = date.key
        ? {
            ...this.$route.query,
            [date.key]: JSON.stringify({
              [date.dateBy]: {
                from: this.dateRange.startDate, // from will be come from props for example "fromDateKey" //TODO
                to: this.dateRange.endDate, // to will be come from props for example "startDateKey"  //TODO
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
        .get(this.getUrl, {
          params,
        })
        .then((response) => {
          if (dataName) {
            let dataClone = JSON.parse(JSON.stringify(response.data));
            for (let i = 0; i < dataName.length; i++) {
              dataClone = dataClone[dataName[i]];
            }
            this.allData = dataClone;
          } else {
            this.allData = response.data;
          }
        });
      this.$router.push({ query: params });
    },
    selectHandler(value) {
      const { dataName, filters } = this.options;
      const { select, pagination } = filters;
      this.defaultPaginationPage = 1;
      if (this.defaultQueryParams.page) {
        this.defaultQueryParams.page = 1;
      }
      let params = select.key
        ? {
            ...this.defaultQueryParams,
            [select.key]: JSON.stringify({ [select.selectBy]: value }),
          }
        : { ...this.defaultQueryParams, [select.selectBy]: value };
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
        .get(this.getUrl, {
          params,
        })
        .then((response) => {
          if (pagination && Object.keys(pagination).length) {
            if (pagination.key) {
              if (pagination.count) {
                console.error(
                  `Please pass one of these fields 'count' or 'key' to get data count`
                );
                throw new Error();
              }
              let dataClone = JSON.parse(JSON.stringify(response.data));
              for (let i = 0; i < pagination.key.length; i++) {
                dataClone = dataClone[pagination.key[i]];
              }
              this.count = dataClone;
            }
          }
          if (dataName) {
            let dataClone = JSON.parse(JSON.stringify(response.data));
            for (let i = 0; i < dataName.length; i++) {
              dataClone = dataClone[dataName[i]];
            }
            this.allData = dataClone;
          } else {
            this.allData = response.data;
          }
        });
    },
    searchHandler(value) {
      const { getUrl, dataName, filters } = this.options;
      const { search, pagination } = filters;
      this.defaultPaginationPage = 1;
      if (this.defaultQueryParams.page) {
        this.defaultQueryParams.page = 1;
      }
      const params = search.key
        ? {
            ...this.defaultQueryParams,
            [search.key]: JSON.stringify({ [search.searchBy]: value }),
          }
        : { ...this.defaultQueryParams, [search.searchBy]: value };
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
        .get(getUrl, {
          params,
        })
        .then((response) => {
          console.log(response, "res");
          if (pagination && Object.keys(pagination).length) {
            if (pagination.key) {
              if (pagination.count) {
                console.error(
                  `Please pass one of these fields 'count' or 'key' to get data count`
                );
                throw new Error();
              }
              let dataClone = JSON.parse(JSON.stringify(response.data));
              for (let i = 0; i < pagination.key.length; i++) {
                dataClone = dataClone[pagination.key[i]];
              }
              this.count = dataClone;
            }
          }
          if (dataName) {
            let dataClone = JSON.parse(JSON.stringify(response.data));
            for (let i = 0; i < dataName.length; i++) {
              dataClone = dataClone[dataName[i]];
            }
            this.allData = dataClone;
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
      console.log(this.hiddenitems, "okkkk");
    },
    showHiddenItemsPopup() {
      this.$refs["hidden-items"].show();
    },
    showMoreHandler(item, i) {
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
      // TODO add delete request callback
      const { deleteRequest } = this.options;
      deleteRequest.method = deleteRequest.method.toUpperCase();
      if (deleteRequest.method === "DELETE") {
        axios
          .delete(
            deleteRequest.url + "/" + item[deleteRequest.deleteRequestParam]
          )
          .then(() => {
            this.getData();
          })
          .catch((err) => {
            this.errors = err;
          });
      } else {
        axios
          .post(deleteRequest.url, {
            [deleteRequest.deleteRequestParam]:
              item[deleteRequest.deleteRequestParam],
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
      const { getUrl, dataName, filters } = this.options;
      const { pagination, search, select } = filters;
      if (this.isLoading) {
        this.isLoading = true;
      }
      let params = { ...this.$route.query };
      if (pagination && Object.keys(pagination).length) {
        let initialQueries;
        if (pagination.initialQueryParams) {
          initialQueries = pagination.initialQueryParams;
        }
        const paginationInfo = {
          limit: pagination.limit || 10,
          page: pagination.page || 1,
          ...initialQueries,
        };
        params = { ...this.$route.query, ...paginationInfo };
      }
      if (search && Object.keys(search).length) {
        if (search.defaultSearchValue) {
          this.defaultSearchValueData = search.defaultSearchValue;
          console.log(this.defaultSearchValueData, "97");
          const defaultSearch = search.key
            ? {
                [search.key]: JSON.stringify({
                  [search.searchBy]: search.defaultSearchValue,
                }),
              }
            : { [search.searchBy]: search.defaultSearchValue };
          params = { ...params, ...defaultSearch };
        }
      }
      if (select && Object.keys(select).length) {
        if (select.selected) {
          const defaultSelected = select.key
            ? {
                [select.key]: JSON.stringify({
                  [select.selectBy]: select.optionValue[select.selected],
                }),
              }
            : {
                [select.selectBy]: select.optionValue[select.selected],
              };
          params = { ...params, ...defaultSelected };
        }
      }
      axios
        .get(getUrl, { params })
        // .get(this.getUrl)
        // .get("http://crm.masterpharm.am:6661/cli?branch_id=2")
        // .get("https://randomuser.me/api/")
        // .get("http://localhost:3000/api/category")
        // .get(
        //   "https://conduit.productionready.io/api/articles?limit=10&offset=0"
        // )
        .then((response) => {
          this.isLoading = false;
          if (pagination) {
            if (pagination.key) {
              if (pagination.count) {
                console.error(
                  `Please pass one of these fields 'count' or 'key' to get data count`
                );
                throw new Error();
              }
              let dataClone = JSON.parse(JSON.stringify(response.data));
              for (let i = 0; i < pagination.key.length; i++) {
                dataClone = dataClone[pagination.key[i]];
              }
              this.count = dataClone;
            }
          }
          if (dataName) {
            let dataClone = JSON.parse(JSON.stringify(response.data));
            for (let i = 0; i < dataName.length; i++) {
              dataClone = dataClone[dataName[i]];
            }
            this.allData = dataClone;
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
    const { isLoad, hiddenItemsByDefault, filters } = this.options;
    const { pagination, sort } = filters;
    console.log(filters, "fffififfifii");
    if (filters) {
      for (let i in filters) {
        if (filters[i] instanceof Object) {
          if (!Object.keys(filters[i]).length) {
            console.error(`Please pass filters in ${i}`);
            throw new Error();
          }
        }
      }
    }
    if (hiddenItemsByDefault) {
      this.hiddenitems = hiddenItemsByDefault;
    }
    if (isLoad) {
      this.isLoading = isLoad;
    }
    if (filters && pagination) {
      if (!pagination.key && !pagination.count) {
        console.error("Please pass required parameter count or key!");
        throw new Error();
      }
    }
    if (filters && sort) {
      if (!sort.sortOrderData && (!sort.sortBy || !sort.sortOrder)) {
        console.error("Please pass required parameter!");
        throw new Error();
      } else if (sort.sortOrderData) {
        // return callback
        this.sortOrderedData = sort.sortOrderData;
      } else {
        this.sortOrderData = sort.sortOrder;
        this.sortByData = sort.sortBy;
      }
    }
  },
  mounted() {
    const { token } = this.options;
    axios.interceptors.request.use((config) => {
      this.defaultQueryParams = config.params;
      config.headers.Authorization = token || "";
      return config;
    });
    this.getData();
  },
};
</script>

<style>
.main-wrapper {
  width: 90%;
  margin: 0 auto;
}
.dream_table-title {
  text-align: left;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 0.5rem;
}
.table_scroll-x {
  /* overflow: hidden; */
  width: 100%;
  overflow-x: scroll;
}
.dream_table-main {
  font-family: arial, sans-serif;
  width: 100%;
  overflow-x: scroll;
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
th {
  white-space: nowrap;
  min-width: 75px;
}
tr:nth-child(even) {
  background-color: #dddddd;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}
/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 15px;
}
::-webkit-scrollbar {
  height: 13px;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #777;
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
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 70px;
  height: 32px;
  cursor: pointer;
}
.create_btn-item:hover {
  border: 1px solid #60a5fa;
}
.dream-image {
  width: 50px;
  height: 50px;
}
.none {
  display: none !important;
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
  display: none !important;
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
  margin-left: -18px;
  z-index: 9999;
}
.vue-daterange-picker {
  font-size: 16px;
  width: 235px;
}
div.reportrange-text {
  border-radius: 5px !important;
}
/* .max_str-size {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
} */
.actions-table {
  height: 100%;
  border: none;
  border-top: 1px solid #dddddd;
}
.dram_table-th {
  cursor: pointer;
}
</style>
