<template>
  <div>
    <transition name="fade">
      <div class="super_modal-main" v-if="isVisible" @click="isVisible = false">
        <div class="super_modal-content" @click.stop>
          <div class="container-main">
            <p>title</p>
            <template v-if="fields.length">
              <div
                v-for="(item, key) in fields"
                :key="key"
                class="form_item-fields"
              >
                <label :for="item" class="form_items-label">
                  {{ item }}
                </label>
                <input
                  type="text"
                  class="form_items-input"
                  :value="initialItems[item]"
                  @input="changeValueHandler(item, $event)"
                  :id="item"
                />
              </div>
              <div class="form-action_btn">
                <button class="cancel-btn" @click="isVisible = false">
                  Cancel
                </button>
                <button class="create-btn" @click="createHandler">
                  Create
                </button>
              </div>
            </template>
            <template v-else>
              <p>Please choose items</p>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SuperModal",

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      isVisible: false,
      initialItems: {},
      fields: [],
    };
  },

  computed: {
    formItems() {
      return this.items;
    },
  },

  methods: {
    changeValueHandler(item, e) {
      this.initialItems[item] = e.target.value;
    },

    show(fields) {
      // property fields are titles of table
      this.isVisible = true;
      this.fields = fields;
      if (fields.length) {
        for (let item of fields) {
          this.initialItems[item] = "";
        }
      }
    },

    hide() {
      this.isVisible = false;
    },

    createHandler() {
      this.$emit("create", this.initialItems);
      this.hide();
    },
  },

  mounted() {
    console.log("mounte");
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.super_modal-main {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999 !important;
}

.super_modal-content {
  width: 500px;
  height: auto;
  background-color: white;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -10%);
}

.container-main {
  padding: 20px;
}

.form_item-fields {
  display: flex;
  flex-direction: column;
}

.form-action_btn {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}

.cancel-btn {
  background-color: white;
  border: 1px solid red;
  border-radius: 5px;
  padding: 4px 8px;
  color: red;
  cursor: pointer;
  margin-right: 4px;
}

.create-btn {
  background-color: white;
  border: 1px solid teal;
  border-radius: 5px;
  padding: 4px 8px;
  color: teal;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: red;
  color: white;
}

.create-btn:hover {
  background-color: teal;
  color: white;
}

.form_items-label {
  color: grey;
  margin-bottom: 3px;
}

.form_items-input {
  padding: 4px;
  margin-bottom: 7px;
}
</style>
