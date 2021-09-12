<template>
  <div>
    <div class="popup-fixed" v-if="isVisible" @click="isVisible = false"></div>
    <div @click.stop class="popup-content" v-if="isVisible">
      <div class="main-container">
        <div class="popup-header">
          <div v-for="(item, key) in items" :key="key">
            <label :for="item">
              <input type="checkbox" :id="item" /> {{ item }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HiddenItemsPopup",

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      isVisible: false,
    };
  },

  methods: {
    show() {
      this.isVisible = true;
    },

    hide() {
      this.isVisible = false;
    },
  },
};
</script>

<style scoped>
.popup-fixed {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

.popup-content {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  width: 200px;
  height: 250px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.main-container {
  padding: 10px;
}
</style>
