<template>
  <div>
    <hello-vue
      @sortCallback="sortCallback"
      title="Title"
      :showPopupToCheckHiddenItems="true"
      :hiddenItemsByDefault="['created_at', 'updated_at']"
      :isLoad="true"
      loaderImg="http://217.23.2.205:6662/movies?pagination=1&page=1&limit=10&sort=id,desc"
      :allowAddNewItem="true"
      :actions="true"
      :editable="true"
      :deletable="true"
      :actionAsIcon="true"
      getUrl="http://crm.masterpharm.am:6661/settings"
      token="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjMyNTYxNzAxLCJleHAiOjE2MzI1NjUzMDF9.KdN15Vq9vkr96e5pZbFna1LvVYSYuji6abZ0UyaqVtCYsNy8Ry0Q7NtrQlEQBueo9OxZmsN-GILe8RQ7NpKHWg"
      :dataName="['message', 'rows']"
      :filters="{
        search: {
          searchable: true,
          placeholder: 'Search',
          searchBy: 'name',
        },

        select: {
          selectable: true,
          placeholder: 'select',
          optionValue: ['one', 'two', 'three', 'four'],
          selectBy: 'name',
          key: 'filter',
        },

        date: {
          dateFilter: true,
          dateBy: 'createdAt',
          key: 'between',
        },

        sort: {
          sortBy: 'id',
          sortOrder: 'desc',
          sortOrderData: {
            sort: 'id,desc',
          },
          key: 'sort',
        },

        pagination: {
          count: ['message', 'count'],
          limit: 4,
          initialQueryParams: {
            pagination: 1,
          },
        },
      }"
      @searchHandler="searchHandler"
      :deleteRequest="{
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'delete',
        deleteRequestParam: 'id',
      }"
      @showMoreHandler="showMore"
      @createHandler="createHandler"
      @editHandler="editHandler"
    />
  </div>
</template>

<script>
import HelloVue from "./ok.vue";
export default {
  name: "vue-dream-table",
  components: {
    HelloVue,
  },

  data() {
    return {
      // sortData: JSON.stringify({
      //   sort: { id: "desc" },
      // }),
      sortData: { sort: "id,desc" },
    };
  },

  methods: {
    sortCallback(data) {
      this.$set(this.sortData, "sort", data.join(","));
    },

    searchHandler(value) {
      console.log(value);
    },
    showMore(data) {
      console.log(data, "data show more");
    },

    createHandler(data) {
      console.log(data, "data create");
    },

    editHandler(data) {
      console.log(data, "data edit");
    },
  },
};
</script>

<style lang="scss" scoped></style>
