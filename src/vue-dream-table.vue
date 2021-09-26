<template>
  <div>
    <hello-vue :actions="false" :options="opt" @sortCallback="sortCallback" />
  </div>
</template>

<script>
import HelloVue from "./ok.vue";
const sortData = {
  sort: "id,desc",
};
export default {
  name: "vue-dream-table",
  components: {
    HelloVue,
  },

  data() {
    return {
      opt: {
        getUrl: "http://crm.masterpharm.am:6661/users",
        token:
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjMyNjY5Mzk5LCJleHAiOjE2MzI2NzI5OTl9.DOXul9T38odTeLiKovhnGw4_XUqzljEUQO-A_mtsRrl83WCCfVr1LwmIF5tYAErPxCafbCQVSChGCQLoGWGAcQ",
        isLoad: true,
        title: "This is title",
        loaderImg:
          "https://cdn0.vox-cdn.com/thumbor/boePMUx1_Onqf1-PW0LDjhmdeHM=/0x64:867x552/1600x900/cdn0.vox-cdn.com/uploads/chorus_image/image/50029937/loadingicon.0.jpg",
        dataName: ["message", "rows"],
        hiddenItemsByDefault: ["id"],
        showPopupToCheckHiddenItems: true,
        actions: true,

        allowAddNewItem: true,
        editable: true,
        deletable: true,
        actionAsIcon: true,
        maxStrSize: 15,
        deleteRequest: {
          url: "https://jsonplaceholder.typicode.com/posts",
          method: "delete",
          deleteRequestParam: "id",
        },

        filters: {
          search: {
            searchable: true,
            placeholder: "Search",
            searchBy: "name",
            key: "search",
          },

          select: {
            selectable: true,
            placeholder: "select",
            optionValue: ["one", "two", "three", "four"],
            selectBy: "name",
            key: "filter",
          },

          date: {
            dateFilter: true,
            dateBy: "createdAt",
            key: "between",
          },

          sort: {
            sortBy: "id",
            sortOrder: "desc",
            sortOrderByData: sortData,
            key: "sort",
          },

          pagination: {
            count: ["message", "count"],
            // key: 500, // pagination count
            limit: 10,
            initialQueryParams: {
              pagination: 1,
            },
          },
        },
      },
    };
  },

  methods: {
    sortCallback(data) {
      // this.$set(this.sortData, "sort", data.join(","));
      sortData.sort = data.join(",");
    },
  },
};
</script>

<style lang="scss" scoped></style>
