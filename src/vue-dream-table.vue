<template>
  <div>
    <hello-vue
      :showPopupToCheckHiddenItems="true"
      :hiddenItemsByDefault="['username', 'password']"
      :allowAddNewItem="true"
      :actions="true"
      :deletable="true"
      :actionAsIcon="true"
      :addItemFields="['email', 'username']"
      :createRequestParam="'data'"
      :deleteRequest="{
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'delete',
        deleteRequestParam: 'id',
      }"
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
};
</script>

<style lang="scss" scoped></style>
