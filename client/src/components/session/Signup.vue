<template>
  <div class="component" id="signup">
    <h2>Signup</h2>
    <form @submit="submit">
      <div class="field">
        <label>email</label>
        <input type="text" name="email" placeholder="Enter email" v-model="email"/>
      </div>
      <div class="field">
        <label>password</label>
        <input type="password" name="password" placeholder="Enter password" v-model="password"/>
      </div>
      <div class="field">
        <label>password confirmation</label>
        <input type="password" name="confirm-password" placeholder="Enter password again" v-model="passwordConfirmation"/>
      </div>
      <button type="submit">Signup</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'signup',
    data() {
      return {
        password: '',
        passwordConfirmation: '',
        email: '',
      };
    },
    notifications: {
      signupSuccess: {
        message: 'You\'re logged in!',
        type: 'success',
      },
      signupError: {
        message: 'Sign up failed',
        type: 'error',
      },
    },
    methods: {
      submit() {
        if (this.password !== this.passwordConfirmation) {
          this.signupError({ message: 'The new password and the password confirmation are not the same' });
        } else {
          this.$store.dispatch('signup', {
            password: this.password,
            email: this.email,
          }).then(
            () => {
              this.$router.replace(this.$route.query.redirect || '/');
              this.signupSuccess({ message: `You're now signed up and logged in as ${this.$store.state.session.user}` });
            },
            () => {
              this.signupError();
            },
          );
        }
      },
    },
  };
</script>

<style scoped>
</style>
