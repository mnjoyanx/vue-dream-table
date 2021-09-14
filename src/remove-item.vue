<template>
  <div>
    <template v-if="actionAsIcon">
      <trash class="trash-icon" @click="remove" />
      <i class="fa fa-user" />
    </template>
    <template v-else>
      <button @click="remove">Remove</button>
    </template>
  </div>
</template>

<script>
import Trash from "vue-material-design-icons/TrashCan.vue";

export default {
  name: "RemoveItem",

  components: {
    Trash,
  },

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
.trash-icon {
  color: red;
  cursor: pointer;
  font-size: 15px;
}
</style>
