<template>
  <div class="component" id="login">
    <h2>Login</h2>
    <form @submit="submit">
      <div class="field">
        <label>email</label>
        <input type="text" name="email" placeholder="Enter email" v-model="email"/>
      </div>
      <div class="field">
        <label>password</label>
        <input type="password" name="password" placeholder="Enter password" v-model="password"/>
      </div>
      <button type="submit">Login</button>
      <router-link to="/forgot">I forgot my password</router-link>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        password: '',
        email: '',
      };
    },
    notifications: {
      loginSuccess: {
        message: 'You\'re logged in!',
        type: 'success',
      },
      loginError: {
        message: 'Log in failed',
        type: 'error',
      },
    },
    methods: {
      submit() {
        this.$store.dispatch('login', {
          password: this.password,
          email: this.email,
        }).then(
          () => {
            this.$router.replace(this.$route.query.redirect || '/');
            this.loginSuccess({ message: `You're logged in as ${this.$store.state.session.user}` });
          },
          () => {
            this.loginError();
          },
        );
      },
    },
  };
</script>

<style scoped>
  button {
    margin-right: 20px;
  }
  .component a {
    font-size: 11px;
    font-weight: bold;
    color: #88d;
    letter-spacing: 1px;
    margin-bottom: 3px;
  }
</style>
