<template>
  <div>
    <template v-if="actionAsIcon">
      <img
        src="./public/images/delete.png"
        alt="remove"
        class="remove-icon"
        @click="remove"
      />
    </template>
    <template v-else>
      <button @click="remove">Remove</button>
    </template>
  </div>
</template>

<script>
export default {
  name: "RemoveItem",

  props: {
    actionAsIcon: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    remove() {
      this.$emit("remove");
    },
  },
};
</script>

<style scoped>
.remove-icon {
  cursor: pointer;
}
</style>
