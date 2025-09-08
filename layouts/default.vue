<template>
  <v-locale-provider>
    <v-app>
      <LayoutMain/>
      <v-main>
        <v-container fluid class="page-wrapper">
          <div class="maxWidth">
            <RouterView/>
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>

<script setup lang="ts">
import {RouterView} from 'vue-router';

const title = ref("schedule");
useHead({
  meta: [{content: title}],
  titleTemplate: (titleChunk) => {
    return titleChunk
        ? `${titleChunk} - schedule`
        : "schedule";
  },
});
</script>
