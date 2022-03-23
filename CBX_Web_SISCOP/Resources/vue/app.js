/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap')

window.Vue = require('vue')

window.EventBus = new Vue()

import './directives/main'
import {store} from './vuex/store'
import mixglobal from './mixins/global'
import Toasted from 'vue-toasted'
import { VLazyImagePlugin } from "v-lazy-image"
import VueLazyload from 'vue-lazyload'
import Waves from 'vue-waves-effect'
import * as VeeValidate from 'vee-validate'
import {ServerTable, ClientTable, Event} from 'vue-tables-2'
import Dropdown from 'hsy-vue-dropdown'
import JsonExcel from 'vue-json-excel'
import fileSaver from 'file-saver'
import xlsxStyle from 'xlsx-style'
import xlsx from 'xlsx'

Vue.use(Dropdown)
Vue.use(Toasted)
Vue.use(VLazyImagePlugin)
Vue.use(VueLazyload)
Vue.use(Waves)
Vue.use(ClientTable);
Vue.component('downloadExcel', JsonExcel)

//Vue.component('categoria', require('./components/Categoria.vue').default);
//Vue.component('lpn', require('./components/cuerpo.vue').default);
//Vue.component('lpn', require('./components/header.vue').default);

Vue.prototype.$fileSaver = fileSaver;
Vue.prototype.$xlsx = xlsx;
Vue.prototype.$xlsxStyle = xlsxStyle;

import './components'

Vue.mixin(mixglobal)

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */


const app = new Vue({
    el: '#app',
    store,
})
