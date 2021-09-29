<template>
  <div>
    <vue-dream-table :options="options" @sortCallback="sortCallback" />
  </div>
</template>

<script>
import VueDreamTable from "./ok.vue";
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
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjMyOTAxMTA0LCJleHAiOjE2MzI5MDQ3MDR9.HlEHM-mFZY72JkPs33xP4Nuq3iIhfTG8ZkSrZzIKAhtRYfafnQ_CS1l49lQfGnJ9dQkgDBQO1yX3VEqXYb031g",
        dataName: ["message", "rows"],
        filters: {
          search: {
            searchBy: "name",
            key: "search",
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
