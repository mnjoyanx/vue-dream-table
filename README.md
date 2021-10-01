<h1 align="center">Welcome to vue-dream-table 👋</h1>
<mark>Spend few minutes to save hours</mark>
<p>
  <a href="https://www.npmjs.com/package/vue-dream-table" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/vue-dream-table.svg">
  </a>
  <a href="https://www.npmjs.com/package/vue-dream-table" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
</p>

> Vue js dream table is developed to make your life easier. 
  Only endpoint url and by configuring few options you can get high performanced 
  table with ton of functionality such as server side pagination, sorting, searching, and filtering.
  

### 🏠 [Homepage](https://www.npmjs.com/package/vue-dream-table)

### ✨ [Demo](https://www.npmjs.com/package/vue-dream-table)

## Install



```sh
npm install vue-dream-table
```

## Note 
```sh
  vue-dream-table package depends on vue-router... Please be sure that you have already installed it!
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
        dataName: ["data", "rows"],
        token:
          "eyJhbGciOviJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwveaviaWF0IjoxNjMyNjczODExLCJleHAiOjE2MzI2Nzc0MTF9ev.R8hZz-0qCXRnR04veev0-yeFr1MlpWT-iaxUxIsN9WCtW_LwdpdoUTQaX155tcvezKPdW8iLWvfYeGmHZqzfrp_nScArAev",
        title: "This is a title",
        isLoad: true,
        hiddenItemsByDefault: ["id"],
        capitalize: true,
        removeUnderScores: true,
        maxStrSize: 15,
        allowAddNewItem: true
      },
    };
  },
}
</script>
```

## Props

| Data  | Type | Required | Description | Default Values |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| getUrl  | string  | false | Get data url | "https://jsonplaceholder.typicode.com/users" |
| token  | string  | false | If your back-end needs token pass this prop | "" |
| isLoad  | boolean  | false | Show loader when request status is pending | false |
| loaderImg  | string  | false | Show loading as img |  |
| dataName  | array  | false | Path to get data // ["rows"] -> response.data.rows | [] |
| hiddenItemsByDefault  | array  | false | Hide table fields | [] |
| actions  | boolean  | false | Show or hide table actions | false |
| editable  | boolean  | false | Show or hide edit button. Visible if "actions" -> true | false |
| deletable  | boolean  | false | Show or delete button. Visible if "actions" -> true | false |
| actionAsIcon  | boolean  | false | Show action buttons as icon | false |
| capitalize  | boolean  | false | Capitalize table column names | false |
| removeUnderScores  | boolean  | false | Remove underscores from column names | false |
| maxStrSize  | number  | false | Split text | 25 |
| allowAddNewItem  | boolean  | false | Show Add button to. Return callback -> addNewItemHandler(data)  | false |



## Advanced
```sh
  <template>
    <vue-dream-table :options="options"  />
  </template>

  <script>
  import VueDreamTable from "vue-dream-table";

  export default {
    data() {
      return {
        options: {
           getUrl: "https://jsonplaceholder.typicode.com/users",
        dataName: ["data", "rows"],
        token:
          "eyJhbGciOviJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwveaviaWF0IjoxNjMyNjczODExLCJleHAiOjE2MzI2Nzc0MTF9ev.R8hZz-0qCXRnR04veev0-yeFr1MlpWT-iaxUxIsN9WCtW_LwdpdoUTQaX155tcvezKPdW8iLWvfYeGmHZqzfrp_nScArAev",
        title: "This is a title",
        isLoad: true,
        hiddenItemsByDefault: ["id"],
        capitalize: true,
        removeUnderScores: true,
        maxStrSize: 15,
        allowAddNewItem: true,
        actions: true,
        editable: true,
        deletable: true,
        deleteRequest: {
          url: "https://jsonplaceholder.typicode.com/posts",
          method: "delete",
          deleteRequestParam: "id",
        },

        filters: {
          search: {
            placeholder: "Search",
            searchBy: "name",
          },

          select: {
            selectBy: "key",
            optionValue: ["one", "two", "four"],
          },

          sort: {
            sortBy: "id",
            sortOrder: "desc",
            sortOrderByData: sortData,
          },

          pagination: {
            count: 100,
            limit: 10,
          },
        }
      }
    }
  }
  </script>
```

## Author

👤 **mnjoyan**



## CallBacks
```sh
<template>
    <vue-dream-table :options="options"
       @dataReceivedHandler="dataReceivedHandler"
       @getDataFailureHandler="getDataFailureHandler"
       @createdHandler="createdHandler"
       @mountedHandler="mountedHandler"
       @deleteHandler="deleteHandler"
       @deleteFailureHandler="deleteFailureHandler"
       @addNewItemHandler="addNewItemHandler"
       @showMoreHandler="showMoreHandler"
         />
</template>


<script>
  export default {
    methods: {
        dataReceivedHandler(data) {
          // data
        },

        getDataFailureHandler(err) {
          // err
        },

        createdHandler(data) {
          // data
        },

        mountedHandler() {
          // mounted
        },

        deleteHandler(data) {
          // data
        },

        deleteFailureHandler(err) {
          // err
        },

        addNewItemHandler(data) {
          // data
        },

        showMoreHandler(obj) {
          // obj
        }
    }
  }
</script>
```

## Show your support

Give a ⭐️ if this project helped you!

