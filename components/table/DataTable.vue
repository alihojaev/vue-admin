<template>
  <span>
    <v-data-table
        :no-data-text="$store.state.noDataText"
        :density="density"
        :page.sync="page"
        :headers="headers"
        :items="data"
        :items-per-page="size"
        v-model:sort-by="sortBy"
    >
       <template v-slot:item.color="{item}">
            <slot name="color" v-bind="{ item: item }"/>
        </template>
      <template v-slot:top>
       <search :fields="filterFields"
               @search="searchData($event)"
       />
      </template>
      <template v-slot:item.actions="{item}">
        <slot name="actions" v-bind="{ item: item }"/>
      </template>
      <template v-slot:header.actions>
         <slot name="create-button"/>
      </template>
      <template v-slot:bottom>
        <v-row
            class="mt-2 mx-1"
            align="center"
            justify="center"
            v-if="showFooter"
        >
            <span class="v-btn__content pagination-text">Показано</span>
          <span class="pa-0 ml-1 d-flex pagination-text" style="cursor: pointer">
             <span class="v-btn__content">{{ size }}</span>
            <icon name='material-symbols-light:keyboard-arrow-down' class="pagination-icon" size="25"/>
            <v-menu activator="parent">
              <v-list>
                <v-list-item
                    v-for="(item, index) in itemsPerPageArray"
                    :key="index" :value="item">
                  <v-list-item-title @click="size = item">{{ item }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
           </span>
          <span
              class="v-btn__content pagination-text">, {{ page * size - size + 1 }} - {{ page * size > paginationTotal ? paginationTotal : page * size }} из {{ paginationTotal }}</span>
          <v-spacer/>
          <v-pagination
              size="40"
              color="grey"
              :total-visible="5"
              :length="paginationLength"
              v-model="page"></v-pagination>
        </v-row>
      </template>
      <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    </v-data-table>
  </span>
</template>

<script>
import Search from "~/components/Search.vue";

export default {
  components: {Search},
  props: {
    density: {type: String, default: 'default'},
    numberOfPages: {type: Number, default: 10},
    headers: {type: Array, required: true},
    data: {type: Array, required: true},
    height: {type: Number, default: 1000},
    showActions: {type: Boolean, default: false},
    filterFields: {type: Array, default: []},

    paginationSize: {type: Number, default: 1},
    paginationTotal: {type: Number, default: 0},
  },
  data: () => ({
    itemsPerPageArray: [10, 20, 30],
    search: '',
    filter: {},
    sortDesc: false,
    sortBy: [],
    page: 1,
    size: 10,
    items: [],
    totalSize: 0,
    paginationLength: 1,
  }),
  methods: {
    searchData(rsql) {
      this.search = rsql
      this.$emit("search", {
        page: this.page - 1,
        size: this.size,
        sort: this.sortQuery,
        rsql: rsql
      })
    },
    updatePagination(page, size, sort) {
      const data = {
        page: page - 1,
        size: size,
        sort: sort,
        rsql: this.search
      }
      this.$emit("updatePagination", data)
    },
    createSortQuery(sort) {
      let query = ''
      let sortBy = !!sort ? sort : this.sortBy
      for (let i = 0; i < sortBy.length; i++) {
        query = `${sortBy[i].key},${sortBy[i].order}`
      }
      return query
    }
  },
  computed: {
    showFooter() {
      return true
    },
    sortQuery(sort) {
      return this.createSortQuery(sort);
    }
  },
  watch: {
    paginationTotal(newVal) {
      this.paginationLength = Math.ceil(newVal / this.size)
    },
    page(newVal) {
      this.updatePagination(newVal, this.size, this.sortQuery)
    },
    size(newVal) {
      this.updatePagination(this.page, newVal, this.sortQuery)
      this.paginationLength = Math.ceil(this.paginationTotal / newVal)
    },
    sortBy(newVal) {
      this.updatePagination(this.page, this.size, this.createSortQuery(newVal))
    },
    data() {
      this.paginationLength = Math.ceil(this.paginationTotal / this.size)
    }
  },
  created() {
    this.totalSize = this.paginationTotal
  }
}
</script>

<style scoped>
.pagination-icon {
  margin-top: 3px;
  margin-left: -5px;
  margin-right: -5px;
}

.pagination-text {
  color: #7f7f7f;
}
</style>