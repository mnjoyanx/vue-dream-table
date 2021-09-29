<template>
  <div>
    <vue-dream-table :options="options" @sortCallback="sortCallback">
    </vue-dream-table>
  </div>
</template>

<script>
import VueDreamTable from "./ok.vue";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

const sortData = {
  sort: "id,desc",
};
export default {
  name: "",

  components: {
    VueDreamTable,
  },

  methods: {
    sortCallback(sort) {
      console.log(sort);
      if (sort.length) {
        sortData.sort = sort.join(",");
      } else {
        delete sortData.sort;
      }
    },
  },

  data() {
    return {
      options: {
        getUrl: "http://crm.masterpharm.am:6661/settings",
        token:
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjMyOTE4Mjc4LCJleHAiOjE2MzI5MjE4Nzh9.HC92qAurt6RW5i6yGA37-VVO4QvmqF6Y37hWwE7ZL79kIGA47hTQIEgwHu6L-NkkcVyYRaF4J_0Vhq0AokaJ1w",
        dataName: ["message", "rows"],
        filters: {
          search: {
            searchBy: "name",
            key: "search",
          },

          date: {
            dateBy: "createdAt",
            key: "between",
            startDateKey: "from",
            endDateKey: "to",
          },

          select: {
            selectBy: "key",
            key: "filter",
            placeholder: "Psvlskdm",
            optionValue: ["one", "two", "delay", "four"],
          },

          sort: {
            sortBy: "id",
            sortOrder: "desc",
            sortOrderByData: sortData,
            key: "sort",
          },

          pagination: {
            key: ["message", "count"],
            limit: 2,
            initialQueryParams: {
              pagination: 1,
            },
          },
        },
      },
    };
  },
  computed: {},
  mounted() {
    console.log("mounted");
  },
};
</script>
<style scoped></style>
