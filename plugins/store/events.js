import { createStore } from "vuex";

const eventsStore = createStore({
    state() {
        return {
            // data table
            itemsPerPage: [],
            noDataText: "Нет данных для отображения",
            errorMessages: []
        };
    },
    mutations: {
        increment(state) {
            state.count++;
        },
        addErrorMessage(state, error) {
            state.errorMessages.unshift(error);
        },
    },
    actions: {
        addErrorMessage({ commit }, error) {
            commit('addErrorMessage', error);
        },
    },
    getters: {
        allErrorMessages(state) {
            return state.errorMessages;
        },
        errorMessagesByStatus: (state) => (status) => {
            return state.errorMessages.filter(error => error.status === status);
        },
    },
});

export default eventsStore;