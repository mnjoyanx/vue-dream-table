<template>
  <div>
    <hello-vue
      getUrl="https://jsonplaceholder.typicode.com/posts"
      :showPopupToCheckHiddenItems="true"
      :hiddenItemsByDefault="['body']"
      :allowAddNewItem="true"
      :actions="true"
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
