window._ = require('underscore');
// window._ = require('lodash');
window.Cookies = require('js-cookie');
window.moment = require('moment');
window.moment.locale('es',{
    relativeTime:{
        future: 'en %s',
        past: 'hace %s',
        s:  'unos segundos',
        ss: '%d segundos',
        m: 'un minuto',
        mm: '%d minutos',
        h: 'una hora',
        hh: '%d horas',
        d: 'un día',
        dd: '%d días',
        M: 'un mes',
        MM: '%d meses',
        y: 'un año',
        yy: '%d años'
    }
});

window.d3 = require("d3");

try {
    //window.$ = window.jQuery = require('jquery');
} catch (e) {}

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


Array.prototype.sumaTotal = function (prop) {
    var total = 0
    for ( var i = 0, _len = this.length; i < _len; i++ ) {
        total += this[i][prop]
    }
    return total
}
