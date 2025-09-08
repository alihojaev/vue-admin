<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup>
import http from "~/plugins/http";
import nuxtStorage from "nuxt-storage/nuxt-storage";

const router = useRouter();

onMounted(() => {
  http.api.user.current()
      .then(r => {
            nuxtStorage.localStorage.setData('user', r);
      },
      e => {
        if (e.status === 401 || e.status === 403) {
          router.push("/auth/login")
        }
      })
});
</script>