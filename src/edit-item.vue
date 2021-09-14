<template>
  <div>
    <template v-if="actionAsIcon">
      icon
    </template>
    <template v-else>
      <button @click="edit">Edit</button>
    </template>
  </div>
</template>

<script>
export default {
  name: "EditItem",

  props: {
    actionAsIcon: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    edit() {
      this.$emit("edit");
    },
  },
};
</script>

<style scoped>
.edit-icon {
  cursor: pointer;
}
</style>
