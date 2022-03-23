import Vue from 'vue'

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))
Vue.component('example-component', require('./components/ExampleComponent.vue').default);

// global 
Vue.component('search-input', require('./components/global/InputSearch.vue').default);

Vue.component('loading-general', require('./components/global/loadingGeneral.vue').default);
Vue.component('table-loading', require('./components/global/tableLoader.vue').default);

Vue.component('breadcrumb', require('./components/global/breadcrumb.vue').default);
Vue.component('select-estado', require('./components/global/selectActivo.vue').default);
Vue.component('select-tipo', require('./components/global/selectTipo.vue').default);
Vue.component('select-cliente', require('./components/global/selectCliente.vue').default);
Vue.component('select-cliente-input', require('./components/global/selectClienteImput.vue').default);
Vue.component('select-centro-almacen', require('./components/global/selectCentroAlmacen.vue').default);

Vue.component('select-empresa', require('./components/global/selectEmpresa.vue').default);
Vue.component('select-perfil-input', require('./components/global/selectPerfilInput.vue').default);
Vue.component('select-perfil-event', require('./components/global/selectPerfilEvent.vue').default);
Vue.component('limit-table', require('./components/global/limitTable.vue').default);
Vue.component('select-tienda-event', require('./components/global/selectTiendaEvent.vue').default);
Vue.component('select-estado-folio-event', require('./components/global/selectEstadoFolioEvent.vue').default);
Vue.component('select-cliente-depen-event', require('./components/global/selectClienteDependienteEvent.vue').default);
Vue.component('select-tienda-depen-event', require('./components/global/selectTiendaDependienteEvent.vue').default);
// clientes 
Vue.component('cliente-header', require('./components/cliente/header.vue').default);
Vue.component('cliente-cuerpo', require('./components/cliente/cuerpo.vue').default);

// Tienda 
Vue.component('tienda-header', require('./components/tienda/header.vue').default);
Vue.component('tienda-cuerpo', require('./components/tienda/cuerpo.vue').default);

// Tienda 
Vue.component('almacenamiento-header', require('./components/calmacenamiento/header.vue').default);
Vue.component('almacenamiento-cuerpo', require('./components/calmacenamiento/cuerpo.vue').default);

// Motivo 
Vue.component('motivo-header', require('./components/motivo/header.vue').default);
Vue.component('motivo-cuerpo', require('./components/motivo/cuerpo.vue').default);

// Perfil 
Vue.component('perfil-header', require('./components/perfil/header.vue').default);
Vue.component('perfil-cuerpo', require('./components/perfil/cuerpo.vue').default);

// Usuario
Vue.component('usuario-header', require('./components/usuario/header.vue').default);
Vue.component('usuario-cuerpo', require('./components/usuario/cuerpo.vue').default);

// Usuario
Vue.component('folio-header', require('./components/folio/header.vue').default);
Vue.component('folio-cuerpo', require('./components/folio/cuerpo.vue').default);

// Lpn
Vue.component('lpn-header', require('./components/lpn/header.vue').default);
Vue.component('lpn-cuerpo', require('./components/lpn/cuerpo.vue').default);

//multiople combo

Vue.component('select-multiple-tienda-event', require('./components/global/multipleSelectTienda.vue').default);
Vue.component('select-multiple-cliente-event', require('./components/global/multipleSelectCliente.vue').default);
Vue.component('select-multiple-centroal-event', require('./components/global/multipleSelectCentroAlmacen.vue').default);
