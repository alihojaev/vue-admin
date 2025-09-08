<template>
  <span>
    <v-dialog v-model="dialog" width="400px">
      <v-card>
        <v-card-text class="d-flex justify-center">
          Добавить фильтр
        </v-card-text>
        <v-card-text class="py-0">
          <v-autocomplete
              label="Фильтр"
              :items="fields"
              item-title="name"
              variant="outlined"
              color="primary"
              return-object
              v-model="filterModel.field"
          />
          <custom-form
              :model="filterModel"
              :fields="searchField"
              @update:model="filterModel = $event"
          />
          <!--          <v-text-field-->
          <!--              v-if="!filterModel?.type"-->
          <!--              label="Значение"-->
          <!--              variant="outlined"-->
          <!--              color="primary"-->
          <!--              v-model="filterModel.value"-->
          <!--          />-->
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn variant="tonal" color="error" @click="dialog = !dialog">
            Отменить
          </v-btn>
          <v-btn variant="tonal" color="primary" @click="addFilter()" :disabled="!filterModel.value">
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row class="">
       <v-col cols="12" md="12">
        <v-text-field
            clearable
            hide-details
            variant="outlined"
            color="primary"
            v-model="search"
            @keyup.enter="handleEnter"
            hint="For example, flowers or used cars"
            label="Поиск">
          <template v-slot:clear>
             <icon name="material-symbols-light:close" height="30" width="30" @click="search = ''"/>
          </template>
          <template v-slot:prepend-inner>
            <icon name="carbon:search" height="25" width="25"/>
          </template>
          <template v-slot:append-inner>
            <v-btn variant="tonal" color="primary" @click="showFilter = !showFilter">
              фильтр
              <icon name="octicon:filter-16" class="ml-1"/>
            </v-btn>
            <v-btn variant="tonal" color="primary" class="ml-2" @click="searchData()">
              искать
              <icon name="ic:twotone-navigate-next" height="20" width="20"/>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="12" class="pb-3 mt-n6" v-if="showFilter">
        <span v-for="(item, i) in filters" class="mt-2" :key="item.value">
          <v-chip label variant="tonal" color="primary" class="mr-2 mt-2" v-if="item.type.value !== 'sort'">
          {{ `${item.field.name}: ${item.value}` }}
            <template v-slot:close>
              <icon name="ci:close-md" @click="removeFilter(i)"/>
            </template>
        </v-chip>
          <v-chip label variant="tonal" color="primary" class="mr-2 mt-2" v-else>
          {{ item.field.name }} {{ item.sort.name.toLowerCase() }}
            <template v-slot:close>
              <icon name="ci:close-md"/>
            </template>
        </v-chip>
        </span>
        <v-chip class="mt-2" label variant="tonal" color="primary" @click="dialog = !dialog">
          <span class="mr-2" v-if="filters.length === 0">Добавить условие</span>
         <icon name="mingcute:add-line" height="15`" width="15"/>
        </v-chip>
      </v-col>
    </v-row>


  </span>
</template>

<script>

import CustomForm from "~/components/form/CustomForm.vue";

export default {
  components: {CustomForm},
  props: {},
  data: () => ({
    fields: [
      {type: 'string', value: "worker.name", name: "Преподаватель", search: true},
      {type: 'string', value: "student.name", name: "Студент", search: true},
      {type: 'string', value: "instrument.name", name: "Инструмент", search: true},
      {type: 'string', value: "cabinet.name", name: "Кабинет", search: true},
      {type: 'string', value: "session.name", name: "Тип занятия", search: false},
    ],
    sortVariants: [
      {name: "От первого к последнему", value: "asc"},
      {name: "От последнего к первому", value: "desc"},
      {name: "Нет", value: null},
    ],
    filters: [],
    search: "",
    filterModel: {},
    stringRsql: [
      {value: "=in=", name: "Входит"},
      {value: "=out=", name: "Не ыходит"},
      {value: "=like=", name: "Содержит"},
      {value: "=ilike=", name: "Не содержит"},
    ],
    showFilter: false,
    dialog: false,
  }),
  computed: {
    filteredRsqlVariants() {
      return this.stringRsql
    },
    searchField() {
      return {
        value: {
          label: 'Значение',
          type: String,
        },
      }
    }
  },
  methods: {
    handleEnter() {
      this.searchData()
    },
    searchData() {
      let search = this.createRsqlQuery()
      this.$emit("search", search)
    },
    removeFilter(index) {
      this.filters = this.filters.filter((_, i) => i !== index);
      this.searchData()
    },
    addFilter() {
      let filter = this.filterModel
      filter.type = {value: "=like=", name: "Содержит"};
      this.filters.push(this.filterModel)
      this.filterModel = {}
      this.dialog = false
      this.searchData()
    },
    createRsqlQuery() {
      let rsqlParts = [];
      let sortPart = '';

      this.filters.forEach(filter => {
        let field = filter.field.value;
        let operator = filter.type.value;

        if (operator === 'sort') {
          let sortOrder = filter.sort.value === 'asc' ? '' : '-';
          sortPart = `${sortOrder}${field}`;
        } else {
          let value = filter.value;
          rsqlParts.push(`${field}${operator}${
              (operator === '=like=' || operator === '=ilike=') ? ('*' + value + '*') : value
          }`);
        }
      });

      let rsqlQuery = rsqlParts.join(';');
      let finalQuery = sortPart ? `${rsqlQuery}&sort=${sortPart}` : rsqlQuery;


      let fields = []

      for (let i = 0; i < this.fields.length; i++) {
        if (this.fields[i].search) {
          fields.push(this.fields[i])
        }
      }

      const createRsqlQuery = (fields, searchValue) => {
        const expressions = fields.map(field => `${field.value}=like=*${searchValue}*`);
        return expressions.join(',');
      };

      const searchValue = this.search; // значение, которое нужно вставить в выражение
      const searchRsqlQuery = createRsqlQuery(fields, searchValue);

      let fq = ''
      if (!!searchValue) fq = `${searchRsqlQuery}${!!finalQuery ? (',' + finalQuery) : ''}`
      else fq = `${finalQuery}`

      fq = fq.replaceAll(/ /g, "%20")
      fq = encodeURIComponent(fq)
      return fq
    },
  },
  created() {
    let fields = this.fields

    for (let i = 0; i < fields.length; i++) {
      if (fields[i].type === String) {
      }
    }
  }
}
</script>

<style scoped>
.grey-text {
  color: #ccc !important;
}
</style>
