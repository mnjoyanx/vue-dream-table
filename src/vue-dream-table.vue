<template>
  <div class="main-wrapper">
    <h2 v-if="options.title" class="dream_table-title">{{ options.title }}</h2>
    <div class="filter-main d-flex justify-between">
      <div class="d-flex">
        <search-bar
          v-if="
            options.filters &&
              options.filters.search &&
              Object.keys(options.filters && options.filters.search).length
          "
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
                  options.filters.date &&
                  Object.keys(options.filters.date).length
              "
              >&#x2715;</span
            >
          </div>
        </div>
        <div
          class="select-bar"
          v-if="
            options.filters &&
              options.filters.select &&
              Object.keys(options.filters.select).length
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
              <span @click="sortHandler(item)" class="dream_table-th">
                {{ item | capitalize | removeUnderscores }}
                <span v-if="sortOrderData === 'desc' && sortByData === item"
                  >&#8648;</span
                >
                <span v-if="sortOrderData === 'asc' && sortByData === item"
                  >&#8650;</span
                >
              </span>
            </th>
            <th
              class="table-actions"
              :class="{
                none:
                  !options.actions || (!options.editable && !options.deletable),
              }"
            >
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
                      {{ item[i] | maxStringSize(options.maxStrSize || 15) }}
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
// import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
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
      if (this.options.filters) {
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
            sortQueries = JSON.parse(sort.sortOrderByData);
          }
        } else {
          sortQueries = { [this.sortByData]: this.sortOrderData };
        }
        const params = {
          ...this.defaultQueryParams,
          ...sortQueries,
        };
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
      }
    },
    paginate(info) {
      if (this.options.filters) {
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
      }
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
      if (this.options.filters) {
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
      }
    },
    selectHandler(value) {
      if (this.options.filters) {
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
      }
    },
    searchHandler(value) {
      if (this.options.filters) {
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
      }
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
      if (this.deleteRequest) {
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
      }
    },
    getData() {
      if (this.isLoading) {
        this.isLoading = true;
      }
      let params = { ...this.$route.query };
      if (
        this.options.filters &&
        this.options.filters.pagination &&
        Object.keys(this.options.filters.pagination).length
      ) {
        let initialQueries;
        if (this.options.filters.pagination.initialQueryParams) {
          initialQueries = this.options.filters.pagination.initialQueryParams;
        }
        const paginationInfo = {
          limit: this.options.filters.pagination.limit || 10,
          page: this.options.filters.pagination.page || 1,
          ...initialQueries,
        };
        params = { ...this.$route.query, ...paginationInfo };
      }
      if (
        this.options.filters &&
        this.options.filters.search &&
        Object.keys(this.options.filters.search).length
      ) {
        if (this.options.filters.search.defaultSearchValue) {
          this.defaultSearchValueData = this.options.filters.search.defaultSearchValue;
          const defaultSearch = this.options.filters.search.key
            ? {
                [this.options.filters.search.key]: JSON.stringify({
                  [this.options.filters.search.searchBy]: this.options.filters
                    .search.defaultSearchValue,
                }),
              }
            : {
                [this.options.filters.search.searchBy]: this.options.filters
                  .search.defaultSearchValue,
              };
          params = { ...params, ...defaultSearch };
        }
      }
      if (
        this.options.filters &&
        this.options.filters.select &&
        Object.keys(this.options.filters.select).length
      ) {
        if (this.options.filters.select.selected) {
          const defaultSelected = this.options.filters.select.key
            ? {
                [this.options.filters.select.key]: JSON.stringify({
                  [this.options.filters.select.selectBy]: this.options.filters
                    .select.optionValue[select.selected],
                }),
              }
            : {
                [this.options.filters.select.selectBy]: this.options.filters
                  .select.optionValue[this.options.filters.select.selected],
              };
          params = { ...params, ...defaultSelected };
        }
      }
      axios
        .get(this.options.getUrl, { params })
        // .get(this.getUrl)
        // .get("http://crm.masterpharm.am:6661/cli?branch_id=2")
        // .get("https://randomuser.me/api/")
        // .get("http://localhost:3000/api/category")
        // .get(
        //   "https://conduit.productionready.io/api/articles?limit=10&offset=0"
        // )
        .then((response) => {
          this.isLoading = false;
          if (this.options.filters && this.options.filters.pagination) {
            if (this.options.filters.pagination.key) {
              if (this.options.filters.pagination.count) {
                console.error(
                  `Please pass one of these fields 'count' or 'key' to get data count`
                );
                throw new Error();
              }
              let dataClone = JSON.parse(JSON.stringify(response.data));
              for (
                let i = 0;
                i < this.options.filters.pagination.key.length;
                i++
              ) {
                dataClone = dataClone[this.options.filters.pagination.key[i]];
              }
              this.count = dataClone;
            }
          }
          if (this.options.dataName) {
            let dataClone = JSON.parse(JSON.stringify(response.data));
            for (let i = 0; i < this.options.dataName.length; i++) {
              dataClone = dataClone[this.options.dataName[i]];
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
    if (this.options.filters) {
      for (let i in this.options.filters) {
        if (this.options.filters[i] instanceof Object) {
          if (!Object.keys(this.options.filters[i]).length) {
            console.error(`Please pass filters in ${i}`);
            throw new Error();
          }
        }
      }
    }
    if (this.options.hiddenItemsByDefault) {
      this.hiddenitems = this.options.hiddenItemsByDefault;
    }
    if (this.options.isLoad) {
      this.isLoading = this.options.isLoad;
    }
    if (this.options.filters && this.options.filters.pagination) {
      if (
        !this.options.filters.pagination.key &&
        !this.options.filters.pagination.count
      ) {
        console.error("Please pass required parameter count or key!");
        throw new Error();
      }
    }
    if (this.options.filters && this.options.filters.sort) {
      if (
        !this.options.filters.sort.sortOrderData &&
        (!this.options.filters.sort.sortBy ||
          !this.options.filters.sort.sortOrder)
      ) {
        console.error("Please pass required parameter!");
        throw new Error();
      } else if (this.options.filters.sort.sortOrderData) {
        // return callback
        this.sortOrderedData = this.options.filters.sort.sortOrderData;
      } else {
        this.sortOrderData = this.options.filters.sort.sortOrder;
        this.sortByData = this.options.filters.sort.sortBy;
      }
    }
  },
  mounted() {
    const { token } = this.options;
    axios.interceptors.request.use((config) => {
      console.log(config.params, "config params");
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
  width: 100%;
  overflow-x: scroll;
}
.dream_table-main {
  font-family: arial, sans-serif;
  width: 100%;
  overflow-x: scroll;
  border-collapse: collapse;
}
td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
th {
  white-space: nowrap;
  min-width: 75px;
}
tr:nth-child(even) {
  background-color: #dddddd;
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 15px;
}
::-webkit-scrollbar {
  height: 13px;
}
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
  margin: 0 auto;
  display: flex;
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
  width: 100px;
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
.actions-table {
  height: 100%;
  border: none;
  border-top: 1px solid #dddddd;
}
.dream_table-th {
  cursor: pointer;
}
</style>
