<template>
  <v-row>
    <v-dialog v-model="dialog" width="400px">
      <v-card>
        <v-card-text>
          <span class="text-h5 d-flex justify-center mt-2 mb-8">Настройки пользователя</span>
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
    <v-dialog v-model="updatePasswordDialog" width="400px">
      <v-card>
        <v-card-text>
          <span class="text-h5 d-flex justify-center mt-2 mb-8">Сменить пароль</span>
          <custom-form
              :model="passwordModel"
              :fields="fieldsPassword"
              @update:model="passwordModel = $event"
              v-model="valid"
          >

            <template v-slot:action>
              <div class="d-flex justify-center">
                <v-btn color="error" variant="tonal" class="mr-2" @click="updatePasswordDialog = false">отменить</v-btn>
                <v-btn :disabled="!valid" color="primary" variant="tonal" @click="savePassword()">сохранить</v-btn>
              </div>
            </template>
          </custom-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-col cols="12" md="12">
      <v-card>
        <v-card-text name="pageInfo" data-attribute="pageInfo">
          <card-header>Настройки пользователей</card-header>
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
                      <div class="d-flex align-center grey-text" @click="editPassword(item)">
                        <icon name="solar:password-linear" size="20"/>
                        <p class="ml-2 text-16">Сменить пароль</p>
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
import rules from "~/components/form/rules";

export default {
  components: {DataTable, CardHeader, CustomForm},
  data: () => ({
    data: [],
    roles: [],
    rules: rules,
    dialog: false,
    updatePasswordDialog: false,
    valid: false,
    model: {},
    passwordModel : {},
    total: 0,
    filterFields: [
      {type: 'string', value: "username", name: "Username", search: true},
    ],
    headers: [
      {title: 'id', key: 'id'},
      {title: 'Username', key: 'username'},
      {title: 'Тип', key: 'type.description'},
      {
        title: 'Ролей',
        key: 'roles',
        value: item => item.authRoles.length,
      },
      {title: '', key: 'actions', align: 'end', sortable: false},
    ]
  }),
  methods: {
    async validateUsername(name) {
      let model = this.model;
      if (!!model?.id && model.username !== name) {
        return new Promise(resolve => {
          let search = {
            page: 0,
            size: 10,
            sort: "",
            rsql: `username%3Din%3D${name}`
          }


          http.api.user.getUsers(search.rsql, search.page, search.search, search.sort)
              .then(r => {
                if (r.content.length !== 0) {
                  this.nameExist = true
                  return resolve(`Username уже существует`)
                } else {
                  return resolve(true)
                }
              }, () => {
                return resolve(true)
              }).catch(() => {
            return resolve(true)
          })
        })
      } else return true
    },
    remove(id) {
      http.api.user.delete(id)
          .then(() => {
            this.getData(this.searchData)
          })
    },
    editPassword(model) {
      this.passwordModel = {...model}
      this.updatePasswordDialog = true
    },
    edit(model) {
      this.model = {...model}
      this.dialog = true
    },
    savePassword() {
      let data = this.passwordModel
      this.updatePasswordDialog = false

      http.api.user.updatePassword(data)
          .then(() => {
            this.getData(this.searchData)
          })
    },
    save() {
      let data = this.model
      http.api.user.save(data)
          .then(() => {
            this.getData(this.searchData)
          })
    },
    getData(search) {
      this.dialog = false;
      this.model = {}
      this.searchData = search
      http.api.role.list()
          .then(r => this.roles = r)
      http.api.user.getUsers(search.rsql, search.page, search.search, search.sort)
          .then(r => {
            this.data = r.content
            this.total = r.total
          })
    }
  },
  computed: {
    fieldsPassword() {
      return {
        password: {
          label: 'Пароль',
          type: String,
          rules: [this.rules.required],
        },
      }
    },
    fields() {
      let f = {
        username: {
          label: 'Username',
          type: String,
          rules: [value => this.validateUsername(value), this.rules.required],
        },
      }

      if (!this.model?.id) {
        f.password = {
          label: 'Пароль',
          type: String,
          rules: [this.rules.required],
        }
      }
      if (!this.model?.type?.value || this.model.type.value === 'ADMIN') {
        f.authRoles = {
          label: 'Доступы',
          type: Array,
          value: 'id',
          text: 'name',
          items: this.roles,
          multiple: true,
          rules: [this.rules.required],
        }
      }

      return f
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