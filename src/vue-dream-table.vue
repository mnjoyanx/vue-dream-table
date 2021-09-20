<template>
  <div>
    <hello-vue
      title="Title"
      :showPopupToCheckHiddenItems="true"
      :hiddenItemsByDefault="['image', 'age']"
      :isLoad="true"
      loaderImg="http://217.23.2.205:6662/movies?pagination=1&page=1&limit=10&sort=id,desc"
      :allowAddNewItem="true"
      :actions="true"
      :editable="true"
      :deletable="true"
      :actionAsIcon="true"
      getUrl="http://217.23.2.205:6662/movies?pagination=1&page=1&limit=10&sort=id,desc"
      token="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6ImFkbWluIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsImlhdCI6MTYzMjEyMjU4MywiZXhwIjoxNjMyMTI2MTgzfQ.MvaY2K2Qs26Fa6mabk_r4kfnS43JHEXWfpl4F6p0jZ0dMwXyLDwAaXfxC4NaDeQLDjCGmpkgtw8HNoHEZmiPhg"
      :dataName="['message', 'rows']"
      :maxStrSize="15"
      :filters="{
        dataCount: 10,
        search: {
          searchable: true,
          placeholder: 'Search',
          searchBy: 'name',
          defaultSearchValue: 'Leanne Graham',
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
          key: ['message'],
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
