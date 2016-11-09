<style src="./styles/main.css" lang="css"></style>
<template>
  <div id="app">
    <h1>Morevue</h1>
    <nav>
      <div class="loggedInActions" v-if="isLoggedIn">
        <div @click="logout" class="fa fa-power-off"></div>
        <router-link to="/update" class="fa fa-user"></router-link>
      </div>
      <router-link to="/login" v-if="!isLoggedIn">Login</router-link>
      <router-link to="/signup" v-if="!isLoggedIn">Sign up</router-link>
      <router-link to="/comp1">Component 1</router-link>
      <router-link to="/comp2">Component 2</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'app',
    computed: mapGetters(['isLoggedIn']),
    methods: {
      logout() {
        this.$store.dispatch('logout');
        this.$router.replace('/');
      },
    },
  };
</script>

<style scoped>
  nav {
    background-color: #eee;
    padding: 20px;
  }
  nav * {
    display: inline-block;
    margin-right: 10px;
    color: #558;
    text-decoration: none;
    cursor: pointer;
  }
  nav *:hover {
    color: #88a;
  }
  .loggedInActions {
    float: right;
  }
</style>