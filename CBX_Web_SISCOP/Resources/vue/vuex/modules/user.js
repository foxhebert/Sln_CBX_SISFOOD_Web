import Vue from 'vue';

const state = {
    userInfo: (window.MEXICHEM && MEXICHEM.session) ? MEXICHEM.session : {}
}

const getters = {

}

const actions = {}

const mutations = {
    
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
