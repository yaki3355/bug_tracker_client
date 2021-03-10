<template>
  <div class="form-horizontal">
    <fieldset>
      <div id="legend">
        <legend class="">New bug</legend>
      </div>

      <div class="control-group">
        <label class="control-label">Status</label>
        <div class="controls">
          <select
            class="browser-default custom-select"
            style="width: auto"
            v-model="status"
          >
            <option>Dev</option>
            <option>Test</option>
            <option>Prod</option>
          </select>
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Description</label>
        <div class="controls">
          <textarea
            v-model="description"
            placeholder=""
            class="input-xlarge"
          />
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Responsible</label>
        <div class="controls">
          <select
            class="browser-default custom-select"
            style="width: auto"
            v-model="responsible"
          >
            <option v-for="r in responsibles" :key="r.username">{{r.username}}</option>
          </select>
        </div>
      </div>

<div class="control-group">
        <label class="control-label">Comment</label>
        <div class="controls">
          <textarea
            v-model="comment"
            placeholder=""
            class="input-xlarge"
          />
        </div>
      </div>

      <div class="control-group">
        <div class="controls">
          <button
            class="btn btn-success"
            v-on:click="create"
            :disabled="createDisabled"
          >
            Create
          </button>
        </div>
      </div>

      <div class="control-group" v-show="showSpinner">
        <div class="controls">
          <div class="spinner-border text-primary"></div>
        </div>
      </div>

      <div class="alert alert-danger col-md-4" role="alert" v-if="error">
        {{ error }}
      </div>
    </fieldset>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Create",
  data: () => ({
    error: "",
    status: "",
    description: "",
    responsible: "",
    comment: "",
    showSpinner: false,
    createDisabled: false,
    responsibles: []
  }),
  created() {
    this.setResponsibles();
  },
  methods: {
    create() {
        const {status, description, responsible, comment} = this;

        if (!status || !description || !responsible)
            return this.error = 'Status, Description and Responsible are mandatory fields';
        
        this.error = '';
        this.createDisabled = true;
        this.showSpinner = true;

        setTimeout(() => {
            axios.post('bugs', {status, description, responsible, comment})
            .then(() => this.$router.push('/bugs_table'))
            .catch(err => {
                this.error = err.response.data;
                this.showSpinner = false;
                this.createDisabled = false;
            });
        }, 1000);
    },
    setResponsibles() {
      axios.get('users/names')
      .then(({data}) => this.responsibles = data)
      .catch(() => console.log('Error in setResponsibles'));
    }
  }
};
</script>
