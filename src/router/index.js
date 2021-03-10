import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import About from '../views/About';
import Register from '../views/Register';
import BugsTable from '../views/BugsTable';
import CreateBug from '../views/BugActions/Create';
import EditBug from '../views/BugActions/Edit';
import store from '../store';
import axios from 'axios';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/bugs_table',
    name: 'bugs_table',
    component: BugsTable
  },
  {
    path: '/create_bug',
    name: 'create_bug',
    component: CreateBug
  },
  {
    path: '/edit_bug',
    name: 'edit_bug',
    component: EditBug
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  axios.get('is_logged_in')
  .then(({data}) => {
    if (data) return next();
    store.commit('LOGOUT');
    if (isProtectedRoute(to.name)) return next('/');
    next();
  })
  .catch(() => console.log('Error in beforeEach'));
});

export default router

function isProtectedRoute(name) {
  return ['bugs_table', 'create_bug', 'edit_bug'].includes(name);
}