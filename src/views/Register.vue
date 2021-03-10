<template>
  <div class="form-horizontal">
    <fieldset>
      <div id="legend">
        <legend class="">Register</legend>
      </div>
      <div class="control-group">
        <label class="control-label">Username</label>
        <div class="controls">
          <input type="text" class="input-xlarge" v-model="username" />
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Password</label>
        <div class="controls">
          <input type="password" class="input-xlarge" v-model="password" />
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Password (Confirm)</label>
        <div class="controls">
          <input
            type="password"
            class="input-xlarge"
            v-model="password_confirm"
          />
        </div>
      </div>

      <div class="control-group">
        <div class="controls">
          <button
            class="btn btn-success"
            v-on:click="register"
            :disabled="registerDisabled"
          >
            Register
          </button>
        </div>
      </div>

      <div class="control-group" v-show="showSpinner">
        <div class="controls">
          <div class="spinner-border text-primary"></div>
        </div>
      </div>

      <div class="alert alert-danger col-md-4" role="alert" v-if="error">
        {{error}}
      </div>
    </fieldset>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Register",
  data: () => ({
    username: "",
    password: "",
    password_confirm: "",
    showSpinner: false,
    registerDisabled: false,
    error: ''
  }),
  methods: {
    register() {
      const { username, password, password_confirm } = this;

      if (!username || !password || !password_confirm)
        return this.error = 'Fields must not be empty';

      if (password !== password_confirm)
        return this.error = 'Password (Confirm) not match';

        this.error = '';
        this.registerDisabled = true;
        this.showSpinner = true;
        setTimeout(() => {
            axios.post('register', {username, password})
            .then(() => this.$router.push('/'))
            .catch(err => {
                this.error = err.response.data
                this.showSpinner = false;
                this.registerDisabled = false;
            });
        }, 1000);
    }
  }
};
</script>