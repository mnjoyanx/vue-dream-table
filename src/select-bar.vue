<template>
  <div>
    <select
      name=""
      id=""
      class="select_bar-select"
      placeholder="evve"
      @change="changeOptionValueHandler"
    >
      <option value=""></option>
      <option
        :value="item"
        v-for="(item, key) in select.optionValue"
        :key="key"
        :selected="
          select.selected
            ? item == select.optionValue[select.selected]
            : key == -1
        "
      >
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "SelectBar",

  props: {
    select: {
      type: Object,
      required: false,
    },
  },

  methods: {
    changeOptionValueHandler(event) {
      this.$emit("select", event.target.value);
    },
  },
};
</script>

<style scoped>
.select_bar-select {
  height: 32px;
  font-size: 14px;
  line-height: 30px;
  color: #333;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
  outline: 0;
}

.select_bar-select:hover {
  background-color: #f5f5f5;
}

.select_bar-select:focus {
  outline: 0;
}
</style>
