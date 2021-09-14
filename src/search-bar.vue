<template>
  <div>
    <input
      type="text"
      class="search_bar-input"
      v-model="searchValue"
      @input="changeSearchValueHandler"
    />
    {{ searchParams }}
  </div>
</template>

<script>
export default {
  name: "SearchBar",

  props: {
    searchParams: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      searchValue: "",
    };
  },

  methods: {
    changeSearchValueHandler() {
      this.$emit("searchHandler", this.searchValue);
    },
  },
};
</script>

<style scoped>
.search_bar-input {
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
}

.search_bar-input:focus {
  outline: none;
  border: 1px solid blue;
}

.search_bar-input::placeholder {
  color: #ccc;
}
</style>
