<template>
  <button @click="remove">Remove</button>
</template>

<script>
export default {
  name: "RemoveItem",

  methods: {
    remove() {
      this.$emit("remove");
    },
  },
};
</script>

<style lang="scss" scoped></style>
