<h1 align="center">Welcome to vue-dream-table 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/vue-dream-table" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/vue-dream-table.svg">
  </a>
  <a href="https://www.npmjs.com/package/vue-dream-table" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
</p>

> Your dream vue js table

### 🏠 [Homepage](https://www.npmjs.com/package/vue-dream-table)

### ✨ [Demo](https://www.npmjs.com/package/vue-dream-table)

## Install

```sh
npm install vue-dream-table
```

## Usage

```sh
<template>
<vue-dream-table
      :title="title"
      :getUrl="getUrl"
      :createUrl="createUrl"
      :dataName="dataName"
      :isLoad="isLoad"
      :loaderImg="loaderImg"
      :isHiddenByDefault="isHiddenByDefault"
      :allowAddNewItem="allowAddNewItem"
      :addItemsFields="addItemsFields"
      :createRequestParam="createRequestParam"
      :actions="actions"
      :deletable="deletable"
      :deleteRequest="deleteRequest"
      :actionAsIcon="actionAsIcon"
      @showMoreHandler="showMoreHandler"
      @createHandler="createHandler"
      @editHandler="editHandler"
    />
</template>

<script>
import VueDreamTable from "vue-dream-table";

export default {
    data() {
    return {
      title: 'Users',
      getUrl: 'https://jsonplaceholder.typicode.com/users',
      createUrl: 'https://jsonplaceholder.typicode.com/users',
      dataName: [],
      isHiddenByDefault: true,
      hiddenItemsByDefault: ['username', 'password'],
      isLoad: true,
      loaderImg: 'https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif',
      allowAddNewItem: true,
      addItemsFields: ['email', 'username'],
      createRequestParam: 'data', 
      actions: true,
      deletable: true,
      deleteRequest: {
        ur: 'https://jsonplaceholder.typicode.com/posts',
        method: 'delete',
        deleteRequestParam: 'id'
      },
      actionAsIcon: true,
    };
  },

  methods: {
    showMoreHandler(data) {
      // do smth
    },

    createHandler(data) {
      // do smth
    }

    editHandler(data) {
      // do smth
    }
  }
}
</script>
```

## Author

👤 **mnjoyan**

* Github: [@mnjoyanx](https://github.com/mnjoyanx)

## Show your support

Give a ⭐️ if this project helped you!

