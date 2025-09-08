<template>
  <div class="authentication">
    <v-container fluid class="pa-3">
      <v-row class="h-100vh d-flex justify-center align-center">
        <v-col cols="12" lg="4" xl="3" class="d-flex align-center">
          <v-card rounded="md" elevation="10" class="px-sm-1 px-0 withbg mx-auto" max-width="500">
            <v-card-item class="pa-8 pb-2">
              <v-row class="d-flex mb-3">
                <v-col cols="12">
                  <v-label class="mb-1">Username</v-label>
                  <v-text-field v-model="dto.username" variant="outlined" hide-details color="primary"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-label class="mb-1">Пароль</v-label>
                  <v-text-field v-model="dto.password" variant="outlined" type="password" hide-details color="primary"></v-text-field>
                </v-col>
                <v-col cols="12" class="mt-4">
                  <v-btn @click="login" color="primary" size="large" block flat>Войти</v-btn>
                </v-col>
              </v-row>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>



<script setup lang="ts">
import http from "../../plugins/http";
import nuxtStorage from "nuxt-storage/nuxt-storage";

const router = useRouter();
const dto = ref(
    {
      username: "",
      password: ""
    }
);

function login() {
  http.publicApi.auth.login(dto.value)
      .then(r => {
            nuxtStorage.localStorage.setData('token', r.token);
            http.api.cli.login(r.token)
            router.push("/")
          },
          err => {

          })
  ;
}


definePageMeta({
  layout: "blank",
});
</script>