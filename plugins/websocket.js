export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const url = config.public.wsUrl || (process.env.NODE_ENV === 'production' ? '/' : 'ws://localhost:8081/ws');

  const socket = new WebSocket(url);

  // Инжектируем WebSocket в контекст Nuxt
  nuxtApp.provide('socket', socket);
});