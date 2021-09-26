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
    <vue-dream-table :options="options"  />
</template>

<script>
import VueDreamTable from "vue-dream-table";

export default {
    components: {
      VueDreamTable,
    },

    data() {
    return {
      options: {
        getUrl: "https://jsonplaceholder.typicode.com/users",
        token:
          "eyJhbGciOviJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwveaviaWF0IjoxNjMyNjczODExLCJleHAiOjE2MzI2Nzc0MTF9ev.R8hZz-0qCXRnR04veev0-yeFr1MlpWT-iaxUxIsN9WCtW_LwdpdoUTQaX155tcvezKPdW8iLWvfYeGmHZqzfrp_nScArAev",
        title: "This is title",
        isLoad: true,
        hiddenItemsByDefault: ["id"],
        actions: true,
        maxStrSize: 25,
      },
    };
  },
}
</script>
```

## Author

👤 **mnjoyan**


<h2>Props info</h2>

| Data  | Type | Required | Description | Default Values |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| getUrl  | string  | false | Get data url | "https://jsonplaceholder.typicode.com/users" |
| token  | string  | false | If your back-end needs token pass this prop | "" |
| isLoad  | boolean  | false | Show loader when request status is pending | false |
| loaderImg  | string  | false | Show loading as img |  |
| dataName  | array  | false | Path to get data // ["rows"] -> response.data.rows | [] |
| hiddenItemsByDefault  | array  | false | Hide table fields | [] |
| actions  | boolean  | false | Show or hide table actions | false |
| maxStrSize  | number  | false | Split text | 15 |


## Show your support

Give a ⭐️ if this project helped you!

