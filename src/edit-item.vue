<template>
  <div>
    <template v-if="actionAsIcon">
      <edit class="edit-icon" @click="edit" />
    </template>
    <template v-else>
      <button @click="edit">Edit</button>
    </template>
  </div>
</template>

<script>
import Edit from "vue-material-design-icons/FileEdit.vue";

export default {
  name: "EditItem",

  components: {
    Edit,
  },

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

.edit-icon {
  color: #2196f3;
  font-size: 15px;
  cursor: pointer;
}
</style>
