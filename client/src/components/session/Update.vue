<template>
  <div class="component" id="update">
    <h2>Update profile</h2>
    <div class="field">
      <label>current password</label>
      <input type="password" name="current-password" placeholder="Enter password" v-model="currentPassword"/>
    </div>
    <div class="field">
      <label>password</label>
      <input type="password" name="password" placeholder="Enter new password" v-model="password"/>
    </div>
    <div class="field">
      <label>password confirmation</label>
      <input type="password" name="confirm-password" placeholder="Enter new password again" v-model="passwordConfirmation"/>
    </div>
    <button @click="submit">Update</button>
  </div>
</template>

<script>
  export default {
    name: 'updateProfile',
    data() {
      return {
        currentPassword: '',
        password: '',
        passwordConfirmation: '',
      };
    },
    notifications: {
      updateSuccess: {
        message: 'Password updated',
        type: 'success',
      },
      updateError: {
        message: 'Password update failed',
        type: 'error',
      },
    },
    methods: {
      submit() {
        if (!this.currentPassword || !this.password || !this.passwordConfirmation) {
          this.updateError({ message: 'Please fill out all the fields' });
        } else if (this.password !== this.passwordConfirmation) {
          this.updateError({ message: 'The new password and the password confirmation are not the same' });
        } else {
          this.$http.put('users', {
            password: this.currentPassword,
            newPassword: this.password,
          }).then(
            () => {
              this.$router.replace(this.$route.query.redirect || '/');
              this.updateSuccess();
            },
            () => {
              this.updateError();
            },
          );
        }
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
