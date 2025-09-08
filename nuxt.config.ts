export default defineNuxtConfig({
  ssr: false,

  typescript: {
      shim: false
  },

  build: {
      transpile: ["vuetify"],
  },

  vite: {
      define: {
          "process.env.DEBUG": false,
      },
  },

  plugins: [
      './plugins/http/index.js',
      './plugins/store.js',
      './plugins/websocket.js',
  ],

  modules: ['nuxt-icon'],

  nitro: {
      serveStatic: true,
  },

  devServerHandlers: [],
  hooks: {},
  compatibilityDate: '2025-01-24',
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || '',
    }
  }
})