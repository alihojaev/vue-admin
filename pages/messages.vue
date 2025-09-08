<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card elevation="10" class="withbg">
        <span class="text-h4 d-flex justify-center mt-6 mb-3">Рассылка уведомлений</span>
        <v-card-text>
          <v-row>
            <v-col cols="8">
              <v-textarea
                  variant="outlined"
                  color="primary"
                  label="Ваше сообщение тут"
                  v-model="model.message"
                  hide-details
              />
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-end">
              <div style="width: 100%">
                <v-autocomplete
                    variant="outlined"
                    color="primary"
                    label="Сотрудники"
                    multiple
                    :items="workers"
                    item-title="name"
                    return-object
                    v-model="model.users"
                />
              </div>
              <v-spacer/>
              <v-btn
                  variant="tonal"
                  color="primary"
                  @click="sendMessage"
              >
                Отправить
              </v-btn>
            </v-col>
          </v-row>

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
    workers: [],
    dialog: false,
    model: {}
  }),
  methods: {
    sendMessage() {
      http.api.message.send(this.model)
          .then(() => {
            this.model = {}
          })
    },
  },
  mounted() {
    http.api.worker.listAll()
        .then(r => {
          this.workers = r
        })
  },
}
</script>