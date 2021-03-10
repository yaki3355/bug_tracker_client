<template>
  <div class="container-xl">
    <div class="table-responsive">
      <div class="table-wrapper">
        <div class="table-title">
          <div class="row">
            <div class="col-sm-8">
              <h2><b>Bugs</b></h2>
            </div>
            <div class="col-sm-4">
              <div class="search-box">
                <i class="material-icons">&#xE8B6;</i>
                <input
                  type="search"
                  class="form-control"
                  placeholder="Search&hellip;"
                  v-model="inputSearch"
                />
              </div>
            </div>
          </div>
          <span>Select number of rows: </span>
          <select
            class="browser-default custom-select"
            style="width: auto"
            v-model="pageSize"
            v-on:change="pageSizeChange()"
          >
            <option>5</option>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <div class="checkbox">
            <label
              ><input type="checkbox" @click="myResponsibilityChange" />Under my
              responsibility only</label
            >
          </div>
          <div class="checkbox">
            <label
              ><input type="checkbox" @click="createdByMeChange" />Created by me
              only</label
            >
          </div>
        </div>
        <table class="table table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th v-on:click="sortBy('_id')">#<i class="fa fa-sort"></i></th>
              <th v-on:click="sortBy('status')">
                Status<i class="fa fa-sort"></i>
              </th>
              <th>Description</th>
              <th v-on:click="sortBy('responsible')">
                Responsible<i class="fa fa-sort"></i>
              </th>
              <th v-on:click="sortBy('createdBy')">
                Created by<i class="fa fa-sort"></i>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bug in filterBugs" :key="bug._id">
              <td>{{ bug._id }}</td>
              <td>{{ bug.status }}</td>
              <td>{{ bug.description }}</td>
              <td>{{ bug.responsible }}</td>
              <td>{{ bug.createdBy }}</td>
              <td>
                <a
                  href="#"
                  class="edit"
                  title="Edit"
                  data-toggle="tooltip"
                  v-on:click="editBug($event, bug._id)"
                  ><i class="material-icons">&#xE254;</i></a
                >
                <a
                  href="#"
                  class="delete"
                  title="Delete"
                  data-toggle="tooltip"
                  v-on:click="deleteBug(bug)"
                  ><i class="material-icons">&#xE872;</i></a
                >
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="button"
          class="btn btn-info add-new"
          v-on:click="createBug()"
        >
          <i class="fa fa-plus"></i>
        </button>
        <div class="clearfix">
          <div class="hint-text">
            Showing <b>{{ filterBugs.length }}</b> out of
            <b>{{ totalNBug }}</b> entries
          </div>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: pageNo <= 1 }">
              <a href="#" v-on:click="prevPage()"
                ><i class="fa fa-angle-double-left"></i
              ></a>
            </li>
            <li
              class="page-item"
              :class="{ active: pageNo === n }"
              v-for="n in getPageNoArr()"
              :key="n"
            >
              <a href="#" v-on:click="pageByIdx(n)">{{ n }}</a>
            </li>
            <li class="page-item" :class="{ disabled: pageNo >= totalNPage }">
              <a href="#" v-on:click="nextPage()"
                ><i class="fa fa-angle-double-right"></i
              ></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  </div>
</template>

<script>
import axios from "axios";
import ConfirmDialogue from "../components/ConfirmDialogue.vue";

export default {
  name: "BugsTable",
  components: { ConfirmDialogue },
  data: () => ({
    bugs: [],
    totalNBug: 0,
    inputSearch: "",
    pageSize: 5,
    pageNo: 1,
    totalNPage: 0,
    sortDir: 1,
    myResponsibility: false,
    createdByMe: false,
  }),
  created() {
    this.setBugs();
  },
  methods: {
    setBugs() {
      const skip = (this.pageNo - 1) * this.pageSize;

      axios
        .get(
          `bugs/${skip}/${this.pageSize}?myResponsibility=${this.myResponsibility}&createdByMe=${this.createdByMe}`
        )
        .then(({ data }) => (this.bugs = data))
        .catch(() => console.log('Error in setBugs'));

      this.setTotals();
    },
    setTotals() {
      axios
        .get(
          `bugs/total_num?myResponsibility=${this.myResponsibility}&createdByMe=${this.createdByMe}`
        )
        .then(({ data }) => {
          this.totalNBug = data;
          this.totalNPage = Math.ceil(this.totalNBug / this.pageSize);
        })
        .catch(() => console.log('Error in setTotals'));
    },
    sortBy(field) {
      this.bugs.sort(
        (b1, b2) => (b1[field] < b2[field] ? -1 : 1) * this.sortDir
      );
      this.sortDir *= -1;
    },
    getPageNoArr() {
      return Array.from({ length: this.totalNPage }, (_, i) => i + 1);
    },
    prevPage() {
      this.pageNo = this.pageNo - 1 || 1;
      this.setBugs();
    },
    nextPage() {
      this.pageNo += this.pageNo < this.totalNPage;
      this.setBugs();
    },
    pageByIdx(n) {
      this.pageNo = n;
      this.setBugs();
    },
    pageSizeChange() {
      this.pageNo = 1;
      this.setBugs();
    },
    myResponsibilityChange(e) {
      this.myResponsibility = e.target.checked;
      this.pageNo = 1;
      this.setBugs();
    },
    createdByMeChange(e) {
      this.createdByMe = e.target.checked;
      this.pageNo = 1;
      this.setBugs();
    },
    createBug() {
      this.$router.push("/create_bug");
    },
    editBug(e, bugId) {
      e.preventDefault();
      this.$router.push({ name: "edit_bug" , params: {bugId}});
    },
    async deleteBug(bug) {
      const {username, isAdmin} = this.$store.state.user;

      if (!isAdmin && bug.createdBy !== username)
        return await this.$refs.confirmDialogue.show({
          title: 'Not permitted',
          message: "You don't have permission to delete bug created by other"
        });

      const ok = await this.$refs.confirmDialogue.show({
        title: `Delete bug ${bug._id}`,
        message:
          "Are you sure you want to delete this bug? It cannot be undone.",
        okButton: "Delete"
      });

      if (!ok) return;

      axios.delete(`bugs/${bug._id}`)
      .then(() => {
         this.pageNo = 1;
         this.setBugs();
      })
      .catch(() => {
        console.log('Error in deleteBug');
      });
    }
  },
  computed: {
    filterBugs() {
      return this.bugs.filter((bug) =>
        Object.values(bug).some((v) =>
          String(v).toLowerCase().includes(this.inputSearch.toLowerCase())
        )
      );
    },
  },
};
</script>
