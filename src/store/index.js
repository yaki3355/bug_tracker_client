import {createStore} from 'vuex';
import vuexPersistedstate from 'vuex-persistedstate';

const store = createStore({
    plugins:[vuexPersistedstate()],
    state: {
        user: null
    },
    mutations: {
        LOGIN: (state, {user}) => state.user = user,
        LOGOUT: state => state.user = null
    }
});

export default store;