<template>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
    <a class="navbar-brand">Bug tracker</a>
    <a v-if="this.$store.state.user" class="navbar-brand">Hi {{ this.$store.state.user.username }}</a>
    <ul v-if="this.$store.state.user" class="navbar-nav ml-auto mr-1">
      <router-link to="/bugs_table" class="navbar-brand">Bugs</router-link>
      <button class="btn btn-default btn-sm" v-on:click="logout">
        <span class="glyphicon glyphicon-log-out"></span> Log out
      </button>
    </ul>
    <ul v-else class="navbar-nav ml-auto mr-1">
      <router-link to="/" class="navbar-brand">Login</router-link>
      <router-link to="/register" class="navbar-brand">Register</router-link>
      <router-link to="/about" class="navbar-brand">About</router-link>
    </ul>
  </nav>
</template>

<script>
import axios from "axios";

export default {
  name: "Navbar",
  methods: {
    logout() {
      axios.get("logout").then(() => {
        this.$router.push("/");
      });
    },
  },
};
</script>