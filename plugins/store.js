import eventsStore from "~/plugins/store/events";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(eventsStore);
});