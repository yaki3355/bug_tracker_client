<template>
  <div class="form-horizontal">
    <fieldset>
      <div id="legend">
        <legend class="">Bug {{ bugId }}</legend>
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
        <label class="control-label">Created at</label>
        <div class="controls">
          <input
            type="text"
            v-model="data.createdAt"
            placeholder=""
            class="input-xlarge"
            disabled
          />
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Created by</label>
        <div class="controls">
          <input
            type="text"
            v-model="data.createdBy"
            placeholder=""
            class="input-xlarge"
            disabled
          />
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Updated at</label>
        <div class="controls">
          <input
            type="text"
            v-model="data.updatedAt"
            placeholder=""
            class="input-xlarge"
            disabled
          />
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Updated by</label>
        <div class="controls">
          <input
            type="text"
            v-model="data.updatedBy"
            placeholder=""
            class="input-xlarge"
            disabled
          />
        </div>
      </div>

      <div class="control-group">
        <div class="controls">
          <button
            class="btn btn-success"
            v-on:click="save"
            :disabled="saveDisabled"
          >
            Save
          </button>
        </div>
      </div>

      <div class="control-group" v-show="showSpinner" style="position: fixed">
        <div class="controls">
          <div class="spinner-border text-primary"></div>
        </div>
      </div>

      <div class="alert alert-danger col-md-4" role="alert" v-if="error" style="position: fixed">
        {{ error }}
      </div>
    </fieldset>
    <div
      class="control-group col-xs-6 pull-right"
      style="margin-top: -430px; margin-right: 150px"
    >
      <label class="control-label">Comments</label>
      <div class="controls">
        <textarea
          v-model="data.comments"
          placeholder=""
          class="input-xlarge"
          style="width: 350px; height: 400px"
          disabled
        />
      </div>
      <div class="control-group">
        <label class="control-label">Add comment</label>
        <div class="controls">
          <textarea v-model="comment" placeholder="" class="input-xlarge" style="width: 350px"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Edit",
  data: () => ({
    bugId: null,
    data: {},
    status: "",
    description: "",
    responsible: "",
    comment: "",
    saveDisabled: false,
    showSpinner: false,
    error: "",
    responsibles: []
  }),
  created() {
    this.bugId = this.$route.params.bugId;
    this.setData();
    this.setResponsibles();
  },
  methods: {
    setData() {
      axios.get(`bugs/${this.bugId}`)
      .then(({ data }) => {
        this.data = data;
        this.status = data.status;
        this.description = data.description;
        this.responsible = data.responsible;
        this.setComments();
      })
      .catch(() => console.log('Error in setData'));
    },
    setComments() {
      this.data.comments = this.data.comments
        .map((c) => `${c.createdAt}\r\n${c.createdBy}:\r\n${c.description}`)
        .join("\r\n\r\n");
    },
    save() {
        const {status, description, responsible, comment} = this;

        if (!status || !description || !responsible)
            return this.error = 'Status, Description and Responsible are mandatory fields';
        
        this.error = '';
        this.saveDisabled = true;
        this.showSpinner = true;

        setTimeout(() => {
            axios.put(`bugs/${this.bugId}`, {status, description, responsible, comment})
            .then(() => this.$router.push('/bugs_table'))
            .catch(err => {
                this.error = err.response.data;
                this.showSpinner = false;
                this.saveDisabled = false;
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
