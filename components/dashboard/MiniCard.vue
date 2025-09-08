<template>
  <v-col cols="4">
    <div>
      <v-card elevation="10" class="withbg">
        <v-card-item>

          <div class="d-flex align-center">
            <div class="mr-4">
                <v-avatar color="primary" size="70">
                  <icon :name='icon' size="40" />
                </v-avatar>
            </div>
            <div>
              <div class="d-flex align-center justify-space-between pt-2">
                <v-card-title class="text-h5">{{header}}</v-card-title>
              </div>
              <v-row>
                <v-col cols="12" class="d-flex align-center">
                  <h3 class="text-h3 mb-1">{{count}}</h3>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-card-item>
      </v-card>
    </div>
  </v-col>
</template>

<script>
export default {
  props: {
    header: {type: String, default: 'Заголовок'},
    icon: {type: String, default: 'material-symbols-light:disabled-by-default-outline'},
    count: {type: Number, default: 0},
  }
}
</script>
<style scoped>

</style>