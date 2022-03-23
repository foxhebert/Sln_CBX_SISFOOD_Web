import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex);

import user from './modules/user'



export const store = new Vuex.Store({
    state: {
        name: 'Mexichem',
        isAuthenticaded: (window.MEXICHEM && MEXICHEM.isAuthenticated) ? true: false,
        profile: (window.MEXICHEM && MEXICHEM.profile) ? MEXICHEM.profile : [],
        csrfToken: '',
        placeholderimg:'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
    },
    mutations:{
        
    },
    modules: {
        user,
    }
})
