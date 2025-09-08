<template>
  <v-navigation-drawer left elevation="0" app class="leftSidebar" v-model="sDrawer">
    <div class="pt-2  d-flex justify-center align-center">
      <div class="text-center ma-2">
        <v-snackbar
            :timeout="3000"
            v-model="snackbar"
            color="error"
            elevation="0"
            height="60"
            style="margin-left: -250px;"
        >
          {{
            allErrorMessages.length > 0 ? allErrorMessages[0].message : "Сообщение"
          }}
          <template v-slot:actions>
            <v-btn
                color="pink"
                variant="text"
                @click="snackbar = false"
            >
              <icon name='codicon:close' size="25"/>
            </v-btn>
          </template>
        </v-snackbar>
      </div>
      <NuxtLink to="/" class="text-h5 font-weight-bold text-uppercase">
        schedule
      </NuxtLink>
    </div>
    <div>
      <perfect-scrollbar class="scrollnavbar">
        <v-list class="pa-6 pt-0">
          <template v-for="menu in menus">
            <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold">
              {{ menu.screen.description }}
            </v-list-subheader>
            <v-list-item
                v-for="item in menu.permissions"
                :to="item.view"
                rounded
                class="mb-1"
                active-color="primary"
                :target="item.type === 'external' ? '_blank' : ''"
            >
              <template v-slot:prepend>
                <icon :name="item.icon" size="20"/>
              </template>
              <v-list-item-title>{{ item.description }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </perfect-scrollbar>
    </div>

  </v-navigation-drawer>
  <v-app-bar elevation="0" height="70" id="appBar">
    <div class="d-flex align-center justify-end w-100">
      <div>
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn class="profileBtn custom-hover-primary" variant="text" v-bind="props" icon>
              <v-avatar size="35">
                <img src="/images/users/avatar-1.jpg" height="35" alt="user"/>
              </v-avatar>
            </v-btn>
          </template>
          <v-sheet rounded="md" width="200" elevation="10" class="mt-2">
            <v-list class="py-0" lines="one" density="compact">
              <v-list-item value="item1" active-color="primary">
                <template v-slot:prepend>
                  <UserIcon stroke-width="1.5" size="20"/>
                </template>
                <v-list-item-title class="pl-4 text-body-1">Мой профиль</v-list-item-title>
              </v-list-item>
            </v-list>
            <div class="pt-4 pb-4 px-5 text-center">
              <v-btn to="/auth/login" color="primary" variant="outlined" block>Выйти</v-btn>
            </div>
          </v-sheet>
        </v-menu>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
import http from "~/plugins/http";
import {BellRingingIcon} from "vue-tabler-icons";
import {mapGetters} from "vuex";

export default {
  components: {BellRingingIcon},
  data: () => ({
    sDrawer: false,
    menus: [],
    snackbar: false,
    text: `Hello, I'm a snackbar`,
    hideNavigationDrawer: false,
  }),
  computed: {
    ...mapGetters(['allErrorMessages']),
  },
  mounted() {
    http.api.menu.menu()
        .then(r => {
          this.menus = r

          if (r.length !== 1 && r[0].permissions.length !== 1) {
            this.sDrawer = true
          }
        })
  },
  watch: {
    allErrorMessages: {
      immediate: true, // Срабатывает сразу при монтировании компонента
      deep: true, // Для отслеживания изменений внутри массива (если нужно)
      handler(newVal, oldVal) {
        this.snackbar = false
        if (newVal.length > 0) {
          this.snackbar = true

        }
      },
    },
  },
}
</script>
