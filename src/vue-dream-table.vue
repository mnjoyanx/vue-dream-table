<template>
  <div>
    <hello-vue
      title="Title"
      :showPopupToCheckHiddenItems="true"
      :hiddenItemsByDefault="['username', 'password']"
      :isLoad="true"
      loaderImg="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
      :allowAddNewItem="true"
      :actions="true"
      :editable="true"
      :deletable="true"
      :actionAsIcon="true"
      getUrl="http://crm.masterpharm.am:6661/cli?branch_id=2"
      token="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjMxNzg4NjgyLCJleHAiOjE2MzUzODg2ODJ9.AooLp1rBn-CygYaaIpk8slVV-Un7RaPzMH3bGgrm4F1u6MUaZAJhxzv4QJXQdtrLBy9FmAHDTEgogHpjTgylQA"
      :dataName="['message', 'rows']"
      @searchHandler="searchHandler"
      :deleteRequest="{
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'delete',
        deleteRequestParam: 'id',
      }"
      :filters="{
        dataCount: 10,
        search: {
          searchable: true,
          placeholder: 'Search',
          searchBy: 'name',
          key: 'search',
          defaultSearchValue: 'ԱԼԻՆԱ',
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

        pagination: {
          limit: 5,
          key: ['message', 'count'],
          initialQueryParams: {
            pagination: 1,
          },
        },
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

  methods: {
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
