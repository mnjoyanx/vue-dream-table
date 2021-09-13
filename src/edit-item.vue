<template>
  <button @click="edit">Edit</button>
</template>

<script>
export default {
  name: "EditItem",

  methods: {
    edit() {
      this.$emit("edit");
    },
  },
};
</script>

<style lang="scss" scoped></style>
