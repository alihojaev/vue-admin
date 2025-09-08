<template>
  <v-row>
    <v-dialog v-model="dialog" width="500px">
      <v-card>
        <v-card-text>

          <span class="text-h5 d-flex justify-center mt-2 mb-8">Настройки сотрудников</span>

          <custom-form
              :model="model"
              :fields="fields"
              @update:model="model = $event"
              v-model="valid"
          >

            <template v-slot:colorSelect>
              <v-color-picker
                  v-model="model.color"
                  hide-inputs
                  class="ma-2"
                  swatches-max-height="200px"
                  width="100%"
                  show-swatches
              ></v-color-picker>
            </template>
            <template v-slot:action>
              <div class="d-flex justify-center">
                <v-btn color="error" variant="tonal" class="mr-2" @click="dialog = false">отменить</v-btn>
                <v-btn :disabled="!valid" color="primary" variant="tonal" @click="save()">сохранить</v-btn>
              </div>
            </template>
          </custom-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-col cols="12" md="12">
      <v-card elevation="10" class="withbg">
        <v-card-text>

          <data-table
              :filter-fields="filterFields"
              :headers="headers"
              :data="data"
              :pagination-size="size"
              :pagination-total="total"
              density="comfortable"
              @updatePagination="getData($event)"
              @search="getData($event)"
          >
            <template v-slot:color="{ item }">
              <div :style="'height: 25px; width: 25px; border-radius: 50%; background-color:' + item.color"/>
            </template>
            <template v-slot:create-button>
              <v-btn color="primary" @click="() => {
                dialog = true
                this.model = {}
              }" flat variant="tonal">
                Добавить
              </v-btn>
            </template>
            <template v-slot:actions="{item}">
              <v-btn color="grey" variant="tonal" size="small">
                <icon name='tabler:dots' size="25"/>
                <v-menu activator="parent" location="left">
                  <v-list>
                    <v-list-item>
                      <div class="d-flex align-center grey-text" @click="edit(item)">
                        <icon name="fluent:edit-32-regular" size="20"/>
                        <p class="ml-2 text-16">Изменить</p>
                      </div>
                    </v-list-item>
                    <v-list-item>
                      <div class="d-flex align-center grey-text" @click="remove(item.id)">
                        <icon name="hugeicons:delete-01" size="20"/>
                        <p class="ml-2 text-16">Удалить</p>
                      </div>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>

            </template>
          </data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import DataTable from "~/components/table/DataTable.vue";
import CardHeader from "~/components/ui/CardHeader.vue";
import http from "~/plugins/http";
import CustomForm from "~/components/form/CustomForm.vue";
import rules from '~/components/form/rules.js'

export default {
  components: {DataTable, CardHeader, CustomForm},
  data: () => ({
    rules: rules,
    data: [],
    dialog: false,
    headers: [
      {title: '', key: 'color', width: '30px', sortable: false},
      {title: 'Имя', key: 'name'},
      {title: 'Фамилия', key: 'surname'},
      {title: 'Телефон', key: 'phone'},
      {title: 'Создано', key: 'cdt'},
      {title: '', key: 'test', align: 'end', sortable: false},
      {title: '', key: 'actions', align: 'end', sortable: false},
    ],
    total: 0,
    filterFields: [
      {type: 'string', value: "name", name: "Имя", search: true},
      {type: 'string', value: "surname", name: "Фамилия", search: true},
      {type: 'string', value: "phone", name: "Телефон", search: true},
      {type: 'string', value: "description", name: "Описание", search: true},
    ],
    valid: false,
    model: {},
    searchData: null,
    instruments: []
  }),
  computed: {
    fields() {
      return {
        name: {
          cols: 6,
          label: 'Имя',
          type: String,
          rules: [this.rules.required],
        },
        surname: {
          cols: 6,
          label: 'Фамилия',
          type: String,
          rules: [this.rules.required],
        },
        phone: {
          cols: 12,
          label: 'Телефон',
          type: String,
          rules: [this.rules.required],
        },
        instruments: {
          label: 'Инструменты',
          type: Array,
          value: 'id',
          text: 'name',
          items: this.instruments,
          multiple: true,
          rules: [this.rules.required],
        },
        chatId: {
          cols: 12,
          label: 'Telegram ID',
          type: String,
          rules: [this.rules.required],
        },
        color: {
          cols: 12,
          label: 'Цвет',
          type: String,
          rules: [this.rules.required],
        },
        colorSelect: {
          cols: 12,
        }
      }
    }
  },
  methods: {
    remove(id) {
      http.api.worker.delete(id)
          .then(() => {
            this.getData(this.searchData)
          })
    },
    edit(model) {
      this.model = {...model}
      this.dialog = true
    },
    save() {
      if (!!this.model.id) {
        http.api.worker.update(this.model.id, this.model)
            .then(() => {
              this.getData(this.searchData)
            })
      } else {
        http.api.worker.save(this.model)
            .then(() => {
              this.getData(this.searchData)
            })
      }
    },
    getData(search) {
      this.dialog = false;
      this.model = {}
      this.searchData = search

      http.api.worker.list(search.rsql, search.page, search.search, search.sort)
          .then(r => {
            this.data = r.content
            this.total = r.total
          })
    },
  },
  mounted() {
    http.api.instrument.listAll()
        .then(r => {
          this.instruments = r
        })
    this.getData({
      page: 0,
      size: 10,
      sort: null,
      rsql: ''
    })
  },
}
</script>