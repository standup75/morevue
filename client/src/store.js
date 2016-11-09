import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const sessionModule = {
  state: {
    user: '',
  },
  getters: {
    isLoggedIn: state => !!state.user.length,
  },
  mutations: {
    setUser: (state, userEmail) => { state.user = userEmail || ''; },
  },
  actions: {
    isLoggedInUser: ({ state }, { user }) => state.user && state.user === user,
    logout: ({ commit }) => {
      Vue.http.post('logout').then(() => commit('setUser', ''));
    },
    loginCheck: ({ commit }) => new Promise((resolve) => {
      Vue.http.get('users/current').then((response) => {
        if (response.body && response.body.email && response.body.id) {
          commit('setUser', response.body.email);
          resolve();
        } else {
          commit('setUser', '');
          resolve();
        }
      });
    }),
    login: ({ commit }, { email, password }) => new Promise((resolve, reject) => {
      Vue.http.post('login', { email, password }).then(
        (response) => {
          if (response.body && response.body.email && response.body.id) {
            commit('setUser', response.body.email);
            resolve();
          } else {
            reject('bad response');
          }
        },
        (error) => {
          reject(error);
        });
    }),
    signup: ({ commit }, { email, password }) => new Promise((resolve, reject) => {
      Vue.http.post('users', { email, password }).then(
        (response) => {
          if (response.body && response.body.email && response.body.id) {
            commit('setUser', response.body.email);
            resolve();
          } else {
            reject('bad response');
          }
        },
        (error) => {
          reject(error);
        });
    }),
  },
};

export default new Vuex.Store({
  modules: {
    session: sessionModule,
  },
});
