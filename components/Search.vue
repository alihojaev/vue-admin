<template>
  <span>
    <v-dialog v-model="dialog" width="400px">
      <v-card>
        <v-card-text class="d-flex justify-center">
          Добавить фильтр
        </v-card-text>
        <v-card-text class="py-0">
          <v-autocomplete
              label="Поле"
              :items="fields"
              item-title="name"
              variant="outlined"
              color="primary"
              return-object
              v-model="filterModel.field"
          />
          <v-radio-group v-model="filterModel.type" color="primary"
                         direction="horizontal"
                         density="compact"
                         v-if="!!filterModel?.field"
          >
                 <v-radio
                     v-for="item in filteredRsqlVariants"
                     :label="item.name" :value="item"/>
          </v-radio-group>
          <v-autocomplete
              v-if="!!filterModel?.type && filterModel.type.value === 'sort'"
              label="Сортировать"
              :items="sortVariants"
              item-title="name"
              variant="outlined"
              color="primary"
              return-object
              v-model="filterModel.sort"
          />
          <custom-form
              v-if="!!filterModel?.type"
              :model="filterModel"
              :fields="searchField"
              @update:model="filterModel = $event"
          />
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn variant="tonal" color="error" @click="dialog = !dialog">
            Отменить
          </v-btn>
          <v-btn variant="tonal" color="primary" @click="addFilter()">
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row class="mb-4">
       <v-col cols="12" md="12">
        <v-text-field
            clearable
            hide-details
            variant="outlined"
            color="primary"
            v-model="search"
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
      <v-col cols="12" md="12" class="py-0" v-if="showFilter">
        <span v-for="(item, i) in filters" class="mt-2" :key="item.value">
          <v-chip label variant="tonal" color="primary" class="mr-2 mt-2" v-if="item.type.value !== 'sort'">
          {{ item.field.name }} <span class="grey-text mx-2">{{ item.type.name.toLowerCase() }}</span> {{ item.value }}
            <template v-slot:close>
              <icon name="ci:close-md" @click="removeFilter(i)"/>
            </template>
        </v-chip>
          <v-chip label variant="tonal" color="primary" class="mr-2 mt-2" v-else>
          {{ item.field.name }} <span class="grey-text mx-2">сортировать</span> {{ item.sort.name.toLowerCase() }}
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
  props: {
    fields: {type: Array, required: true}
  },
  data: () => ({
    sortVariants: [
      {name: "От первого к последнему", value: "asc"},
      {name: "От последнего к первому", value: "desc"},
      {name: "Нет", value: null},
    ],
    filters: [],
    search: "",
    filterModel: {
    },
    stringRsql: [
      {value: "=in=", name: "Входит"},
      {value: "=out=", name: "Не ыходит"},
      {value: "=like=", name: "Содержит"},
      {value: "=ilike=", name: "Не содержит"},
    ],
    numberRsql: [
      {value: "==", name: "Равно"},
      {value: "!=", name: "Не равно"},
      {value: ">", name: "Больше"},
      {value: ">=", name: "Больше или равно"},
      {value: "<", name: "Меньше"},
      {value: "<=", name: "Меньше или равно"},
    ],
    dateRsql: [
      {value: "==", name: "Равно"},
      {value: "!=", name: "Не равно"},
      {value: ">", name: "Больше"},
      {value: ">=", name: "Больше или равно"},
      {value: "<", name: "Меньше"},
      {value: "<=", name: "Меньше или равно"},
      {value: "=in=", name: "Входит"},
      {value: "=out=", name: "Не входит"},
    ],
    rsqlVariants: [
      {value: "==", name: "Равно"},
      {value: "!=", name: "Не равно"},
      {value: ">", name: "Больше"},
      {value: ">=", name: "Больше или равно"},
      {value: "<", name: "Меньше"},
      {value: "<=", name: "Меньше или равно"},
      {value: "=in=", name: "Входит"},
      {value: "=out=", name: "Не входит"},
      {value: "=like=", name: "Содержит"},
      {value: "=ilike=", name: "Не содержит"},
      // {value: "sort", name: "Сортировать"},
    ],
    // fields: [
    //   {value: "name", name: "Название"},
    //   {value: "description", name: "Описание"},
    //   {value: "cdt", name: "Дата создания"},
    // ],
    showFilter: false,
    dialog: false,
  }),
  computed: {
    filteredRsqlVariants() {
      if (!!this.filterModel?.field?.type) {
        if (this.filterModel.field.type === 'string') return this.stringRsql
        if (this.filterModel.field.type === 'number') return this.numberRsql
        if (this.filterModel.field.type === 'date' || this.filterModel.field.type === 'date-time')
          return this.dateRsql
      }

      return this.rsqlVariants;
    },
    searchField() {
      let type = String;
      let time = false;

      if (!!this.filterModel?.field?.type) {
        if (this.filterModel.field.type === 'string') type = String;
        if (this.filterModel.field.type === 'number') type = Number;
        if (this.filterModel.field.type === 'date') type = Date;
        if (this.filterModel.field.type === 'date-time') {
          type = Date;
          time = true;
        }
      }

      return {
        value: {
          label: 'Значение',
          type: type,
          time: time
        },
      }
    }
  },
  methods: {
    searchData() {
      let search = this.createRsqlQuery()
      this.$emit("search", search)
    },
    removeFilter(index) {
      this.filters = this.filters.filter((_, i) => i !== index);
    },
    addFilter() {
      this.filters.push(this.filterModel)
      this.filterModel = {}
      this.dialog = false
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
