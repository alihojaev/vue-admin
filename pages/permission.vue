<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card>
        <v-card-text name="pageInfo" data-attribute="pageInfo">
          <card-header>Доступы пользователя</card-header>
        </v-card-text>
        <v-card-text class="pt-0">
          <data-table
              :headers="headers"
              :data="data"
              density="comfortable"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import DataTable from "~/components/table/DataTable.vue";
import CardHeader from "~/components/ui/CardHeader.vue";
import http from "~/plugins/http";

export default {
  components: {DataTable, CardHeader},
  data: () => ({
    data: [],
    headers: [
      { title: 'Название', value: 'name.value' },
      { title: 'Описание', key: 'name.description' },
      // {
      //   title: 'Full Name',
      //   key: 'fullName',
      //   value: item => `${item.name.first} ${item.name.last}`,
      // },
    ]
  }),
  mounted() {
    http.api.permission.list()
        .then(r => this.data = r)
  }
}
</script>
<script setup lang="ts">

</script>