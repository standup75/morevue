<template>
  <div class="component" id="forgot">
    <h2>Forgot password</h2>
    <form @submit="submit">
      <div class="field">
        <label>email</label>
        <input type="text" name="email" placeholder="Enter email" v-model="email"/>
      </div>
      <button type="submit">Get new password</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'forgot',
    data() {
      return {
        email: '',
      };
    },
    notifications: {
      forgotSuccess: {
        message: 'New password requested, checkout your mailbox',
        type: 'success',
      },
      forgotError: {
        message: 'Email not found',
        type: 'error',
      },
    },
    methods: {
      submit() {
        this.$http.post('users/forgot', { email: this.email }).then(
          () => {
            this.$router.replace(this.$route.query.redirect || '/');
            this.forgotSuccess();
          },
          () => {
            this.forgotError();
          },
        );
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
