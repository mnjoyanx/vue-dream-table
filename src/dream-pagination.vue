<template>
  <div>
    <sliding-pagination
      :current="
        paginationInfo.currentPage ? paginationInfo.currentPage : current
      "
      :total="totalPages"
      @page-change="pageChangeHandler"
    ></sliding-pagination>
  </div>
</template>

<script>
import SlidingPagination from "vue-sliding-pagination";

export default {
  name: "DreamPagination",

  props: {
    paginationInfo: {
      type: Object,
    },

    count: {
      required: false,
    },

    defaultPaginationPage: {
      required: false,
    },
  },

  components: {
    SlidingPagination,
  },

  data() {
    return {
      limit: 10,
      current: 1,
    };
  },

  watch: {
    defaultPaginationPage(newVal) {
      if (newVal) {
        this.current = 1;
      }
    },
  },

  computed: {
    totalPages() {
      if (this.count && this.paginationInfo.limit) {
        return Math.ceil(this.count / this.paginationInfo.limit[1]);
      }

      if (this.count && !this.paginationInfo.limit) {
        return Math.ceil(this.count / this.limit);
      }

      if (!this.count && !this.paginationInfo.limit[1]) {
        return Math.ceil(this.paginationInfo.count / this.limit);
      }
      return Math.ceil(
        this.paginationInfo.count / this.paginationInfo.limit[1]
      );
    },
  },

  methods: {
    pageChangeHandler(selectedPage) {
      this.current = selectedPage;
      const pageKey = this.paginationInfo.pageKey
        ? this.paginationInfo.pageKey
        : "page";

      const info = {
        currentPage: this.paginationInfo[pageKey]
          ? this.paginationInfo[pageKey]
          : this.current,
        [this.paginationInfo.limit[0]]:
          this.paginationInfo.limit[1] || this.limit,
      };

      this.$emit("paginate", info);
    },
  },
};
</script>

<style>
@import "~vue-sliding-pagination/dist/style/vue-sliding-pagination.css";

nav {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

ul li {
  cursor: pointer;
}

.c-sliding-pagination__list-element {
  width: 20px;
  font-size: 16px;
  text-align: center;
  background: white;
  color: black;
  border: 1px solid #ccc;
}

.c-sliding-pagination__list-element--active {
  background: #ccc;
  color: white;
}
</style>
