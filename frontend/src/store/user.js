import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null,
    token: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
    },
  },
  actions: {
    login({ commit }, { user, token }) {
      commit('SET_USER', user);
      commit('SET_TOKEN', token);
    },
    logout({ commit }) {
      commit('LOGOUT');
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },
});

export default store;
