import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VueNotifications from 'vue-notifications';
import notie from 'notie';
import App from './App';
import Login from './components/session/Login';
import Signup from './components/session/Signup';
import Forgot from './components/session/Forgot';
import Update from './components/session/Update';
import Comp1 from './components/Comp1';
import Comp2 from './components/Comp2';
import store from './store';

// Setup notifications
function toast({ type, message, timeout }) {
  return notie.alert(type, message, timeout / 1000);
}
const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast,
};

Vue.use(VueNotifications, options);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.http.options.root = 'http://localhost:3000';
Vue.http.options.credentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  store,
  router: new VueRouter({
    routes: [
      { path: '/login', component: Login },
      { path: '/signup', component: Signup },
      { path: '/forgot', component: Forgot },
      { path: '/update', component: Update },
      { path: '/comp1', component: Comp1 },
      { path: '/comp2', component: Comp2 },
    ],
  }),
  created() {
    this.$store.dispatch('loginCheck');
  },
  components: { App },
});
