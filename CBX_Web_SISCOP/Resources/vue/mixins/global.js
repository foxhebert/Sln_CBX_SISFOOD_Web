module.exports = {
    data(){
        return{
          
        }
    },
    methods: {
        getSubMenuIdMix(){
            if(localStorage.getItem('idsubmenu') && !isNaN(localStorage.getItem('idsubmenu'))){
                return Number(localStorage.getItem('idsubmenu'))
            }
            return 1;
        },
        configDataTableMix() {
            return{
                
                resizableColumns:false,
                
                alwaysShowPerPageSelect: true,
                perPage:10,
                perPageValues: [10,25,50],
                texts: {
                    count: "Mostrar {from} a {to} de {count}  Items|Mostrar {from} a {to} de {count}  Items|Mostrar {from} a {to} de {count}  Item",
                    first: 'Anterior',
                    last: 'Siguiente',
                    filter: "Buscar: ",
                    filterPlaceholder: "Criterio de búsqueda",
                    limit: "Mostrar:",
                    page: "Page:",
                    noResults: "No hay registros coincidentes",
                    filterBy: "Filter by {column}",
                    loading: 'Cargando...',
                    defaultOption: 'Select {column}',
                    columns: 'Columnas'
                },
                pagination: { edge: false, dropdown: false }
            }
        },
        mixtoastedshow(message, config = {}) {
            this.$toasted.show(message, {
                theme: config.theme ? config.theme : "toasted-theme-default",
                position: "bottom-left",
                duration: config.duration ? config.duration : 3000,
                className: config.type
                    ? "toasted-with-link toasted-dark-" + config.type
                    : "toasted-with-link",
                action: [
                    {
                        text: "Cerrar",
                        onClick: (e, toastObject) => {
                            toastObject.goAway(0);
                        }
                    }
                ]
            });
        },
        getFormDataMix(object) {
            const formData = new FormData();
            Object.keys(object).forEach(key => formData.append(key, object[key]));
            return formData;
        },
        dataTableDrawMix(){

        },
        dataTableLanguajeMix() {
           return{
                lengthMenu: [10, 25, 50],
                responsive: true,
                language: {
                    lengthMenu: 'Mostrar _MENU_',
                    info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                    infoEmpty: 'No hay Items para mostrar',
                    search: 'Buscar: ',
                    sSearchPlaceholder: 'Criterio de búsqueda',
                    zeroRecords: 'No se encontraron registros coincidentes',
                    infoFiltered: '(Filtrado de _MAX_  Items en total)',
                    paginate: {
                        previous: 'Anterior',
                        next: 'Siguiente'
                    }
                },
                dom: 'lBfrtip',
           }
        },
        isNumberKeyMix(evt) {
            var element=evt.target.value;
            var charCode = (evt.which) ? evt.which : event.keyCode
            if (charCode > 31 && (charCode < 48 || charCode > 57) && !(charCode == 46 || charCode == 8))
                evt.preventDefault();
            else {
                var len = element.length;
                var index = element.indexOf('.');
                if (index > 0 && charCode == 46) {
                    evt.preventDefault();
                }
                if (index > 0) {
                    var CharAfterdot = (len + 1) - index;
                    if (CharAfterdot > 3) {
                        evt.preventDefault();
                    }
                }
            }
            return true;
        },
        eliminarObjetosDuplicadosMix(arr, prop) {
            var nuevoArray = [];
            var lookup  = {};
        
            for (var i in arr) {
                lookup[arr[i][prop]] = arr[i];
            }
        
            for (i in lookup) {
                nuevoArray.push(lookup[i]);
            }
        
            return nuevoArray;
        },
        eliminarEspaciosBlancoMix(str){
            if(str=='' || str == null){
                return str;
            }
            return str.toString().replace(/ /g, "")
        },
        forEachObjectMix(collection, callback, scope) {
            if (Object.prototype.toString.call(collection) === '[object Object]') {
                for (var prop in collection) {
                    if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                        callback.call(scope, collection[prop], prop, collection);
                    }
                }
            } else {
                for (var i = 0, len = collection.length; i < len; i++) {
                    callback.call(scope, collection[i], i, collection);
                }
            }
        },
        isArrayObjectMix(data){
            return (Object.prototype.toString.call(data) === '[object Array]')
        }
    }
};
