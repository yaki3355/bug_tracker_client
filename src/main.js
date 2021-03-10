import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

createApp(App).use(router).use(store).mount('#app');
