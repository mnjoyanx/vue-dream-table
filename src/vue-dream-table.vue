<template>
  <div>
    <!-- <slot name="title">{{ options.title }}</slot> -->
    <super-modal ref="super-modal" :items="largestRowItems" @create="create" />
    <show-more ref="show-more" />
    <slot name="create">
      <div class="create-btn">
        <button class="create_btn-item" @click="createItemHandler">Add</button>
      </div>
    </slot>
    <table>
      <thead>
        <tr>
          <th v-for="item in largestRowItems" :key="item">{{ item }}</th>
          <th>
            <button @click="sortBy('name')">Actions</button>
          </th>
        </tr>
      </thead>
      <tbody class="main-table">
        <template v-if="allData.length">
          <tr v-for="(item, key) in Object.values(allData)" :key="key">
            <td
              v-for="(i, key) in item"
              :key="key"
              :class="{ 'more_info-btn': typeof i === 'object' }"
            >
              <!-- if data includes object show it in popup modal -->
              {{ typeof i === "object" ? Object.values(i)[0] : i }}
              <button
                class="show_more-info"
                v-if="typeof i === 'object'"
                @click="showMoreHandler"
              >
                show more
              </button>
            </td>
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
            <td colspan="3">No Data</td>
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
  },

  data() {
    return {
      allData: [],
      isLoading: false,
    };
  },

  computed: {
    largestRowItems() {
      if (this.allData.length) {
        const uniqueItems = this.allData.reduce((a, b) => {
          Object.assign(b, a);
          return b;
        }, {});
        return Object.keys(uniqueItems);
      } else {
        return [];
      }
    },
  },

  methods: {
    showMoreHandler() {
      this.$refs["show-more"].show();
    },

    create(a) {
      axios.post(this.createUrl, { a }).then(() => {
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
        .get(this.getUrl)
        .then((response) => {
          this.isLoading = false;
          // const dataname = this.dataName.join(".");
          this.allData = response.data.message;
        })
        .catch((err) => {
          console.log(err, "errrrrr88");
          this.isLoading = false;
        });
    },
  },

  mounted() {
    axios.interceptors.request.use((config) => {
      const token = this.token;
      const authorizationToken = token ? token : "";
      config.headers.Authorization = authorizationToken;
      return config;
    });
    console.log("this token", this.token);
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err, "errrrrrrr");
      });
    this.getData();
  },
};
</script>

<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
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
  display: flex;
  justify-content: space-between;
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
</style>
