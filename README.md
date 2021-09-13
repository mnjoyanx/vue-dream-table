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
      :loaderImg="loaderImg"
      :isHiddenByDefault="isHiddenByDefault"
      :hiddenItemsByDefault="hiddenItemsByDefault"
      :chosenHiddenItemsByDefault="chosenHiddenItemsByDefault"
      :token="token"
    />
</template>

<script>
import VueDreamTable froom "vue-dream-table";

export default {
    data() {
    return {
      title: "Posts",
      getUrl: "https://jsonplaceholder.typicode.com/users",
      createUrl: "https://jsonplaceholder.typicode.com/users",
      dataName: [],
      isHiddenByDefault: true,
      hiddenItemsByDefault: [],
      chosenHiddenItemsByDefault: [],
      token:
        "eyJhbGciOiJSUzI1NiIsInR5svcCI6IkpXVCJ9.sjv7weIl",
    };
  },
}
</script>
```

## Author

👤 **mnjoyan**

* Github: [@mnjoyanx](https://github.com/mnjoyanx)

## Show your support

Give a ⭐️ if this project helped you!

