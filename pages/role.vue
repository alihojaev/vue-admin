<template>
  <v-row>
    <v-dialog v-model="dialog" width="400px">
      <v-card>
        <v-card-text>

          <span class="text-h5 d-flex justify-center mt-2 mb-8">Роли администраторов</span>

          <custom-form
              :model="model"
              :fields="fields"
              @update:model="model = $event"
              v-model="valid"
          >

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
      <v-card>
        <v-card-text name="pageInfo" data-attribute="pageInfo">
          <card-header>Роли администраторов</card-header>
        </v-card-text>
        <v-card-text class="pt-0">
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
            <template v-slot:create-button>
              <v-btn color="primary" @click="() => {
                dialog = true
                model = {}
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
    total: 0,
    data: [],
    rules: rules,
    valid: false,
    permissions: [],
    dialog: false,
    nameExist: false,
    searchData: null,
    model: {},
    headers: [
      {title: 'Название', key: 'name'},
      {title: 'Описание', key: 'description'},
      {title: 'Создано', key: 'cdt'},
      {
        title: 'Доступов',
        key: 'permissions',
        value: item => item.permissions.length,
      },
      {title: '', key: 'actions', align: 'end', sortable: false},
    ],
    filterFields: [
      {type: 'string', value: "name", name: "Название", search: true},
      {type: 'string', value: "description", name: "Описание", search: true},
    ],
  }),
  // watch: {
  //   'model.name'(newVal) {
  //     this.searchByName(newVal)
  //   }
  // },
  methods: {
    async validateName(name) {
      return new Promise(resolve => {
        let search = {
          page: 0,
          size: 10,
          sort: "",
          rsql: `name%3Din%3D${name}`
        }


        http.api.role.findAllRsql(search.rsql, search.page, search.search, search.sort)
            .then(r => {
              if (r.content.length !== 0) {
                this.nameExist = true
                return resolve(`Название уже существует`)
              } else {
                return resolve(true)
              }
            }, () => {
              return resolve(true)
            }).catch(() => {
          return resolve(true)
        })
      })
    },
    remove(id) {
      http.api.role.delete(id)
          .then(() => {
            this.getData(this.searchData)
          })
    },
    edit(model) {
      this.model = {...model}
      this.dialog = true
    },
    save() {
      let data = this.model

      for (let i = 0; i < data.permissions.length; i++) {
        data.permissions[i].operationPermissions = 15
      }
      http.api.role.save(data)
          .then(() => {
            this.getData(this.searchData)
          })
    },
    getData(search) {
      this.dialog = false;
      this.model = {}
      this.searchData = search
      http.api.permission.list()
          .then(r => this.permissions = r)
      http.api.role.findAllRsql(search.rsql, search.page, search.search, search.sort)
          .then(r => {
            this.data = r.content
            this.total = r.total
          })
    }
  },
  computed: {
    fields() {
      return {
        name: {
          label: 'Название',
          type: String,
          rules: [this.rules.required],
        },
        description: {
          label: 'Описание',
          type: String,
        },
        permissions: {
          label: 'Доступы',
          type: Array,
          value: 'id',
          text: 'name.description',
          items: this.permissions,
          multiple: true,
          rules: [this.rules.required],
        }
      }
    }
  },
  mounted() {
    this.getData({
      page: 0,
      size: 10,
      sort: null,
      rsql: ''
    })
  }
}
</script>