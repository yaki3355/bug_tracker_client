<template>
  <div class="form-horizontal">
    <fieldset>
      <div id="legend">
        <legend class="">Login</legend>
      </div>
      <div class="control-group">
        <label class="control-label" >Username</label>
        <div class="controls">
          <input
            type="text"
            v-model="username"
            placeholder=""
            class="input-xlarge"
          />
        </div>
      </div>

      <div class="control-group">
        <label class="control-label" >Password</label>
        <div class="controls">
          <input
            type="password"
            v-model="password"
            placeholder=""
            class="input-xlarge"
          />
        </div>
      </div>

      <div class="control-group">
        <div class="controls">
          <button class="btn btn-success" v-on:click="login" :disabled="loginDisabled">Login</button>
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
  name: 'Login',
  data: () => ({
    username: "",
    password: "",
    showSpinner: false,
    loginDisabled: false,
    error: ''
  }),
  methods: {
    login() {
      const { username, password } = this;

      if (!username || !password)
        return this.error = 'Fields must not be empty';

        this.error = '';
        this.loginDisabled = true;
        this.showSpinner = true;
        setTimeout(() => {
          axios.get('login', {params: {username, password}})
          .then(res => {
            this.$store.commit('LOGIN', {user: res.data});
            this.$router.push('/bugs_table');
          })
          .catch(err => {
            this.error = err.response.data
            this.showSpinner = false;
            this.loginDisabled = false;
          });
        }, 1000);
    }
  }
}
</script>