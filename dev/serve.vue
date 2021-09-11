<script>
import Vue from 'vue';
import VueDreamTable from '@/vue-dream-table.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VueDreamTable
  }
});
</script>

<template>
  <div id="app">
    <vue-dream-table />
  </div>
</template>
