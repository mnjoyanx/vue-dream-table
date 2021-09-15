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
      :dataName="['message']"
      :createRequestParam="'data'"
      @searchHandler="searchHandler"
      :deleteRequest="{
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'delete',
        deleteRequestParam: 'id',
      }"
      :filters="{
        search: {
          searchable: true,
          placeholder: 'Search',
          searchBy: 'name',
          key: 'search',
        },

        select: {
          selectable: true,
          placeholder: 'select',
          optionValue: ['one', 'two', 'three', 'four'],
          selectBy: 'name',
          key: 'filter',
          selected: 'three',
        },

        date: {
          dateFilter: true,
          dateBy: 'createdAt',
          key: 'between',
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
