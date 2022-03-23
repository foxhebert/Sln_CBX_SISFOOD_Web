/*************** 2.1-Perfil Sisactivofijo *****************/
/**********************************************************/

//////////////////////////////////////////////////////////////////
//CONSTRUCTOR GUARDAR FERFIL
//////////////////////////////////////////////////////////////////
var listaDetallesPerfil = new Array();
var _varTablaPerfil;
let subMenuData = new Array();
class TT_TSPERFIL_MENU {
    constructor(intIdPerfM, intIdPerfil, intIdSoft, intIdMenu, bitFlEliminado) {
        this.intIdPerfM = intIdPerfM
        this.intIdPerfil = intIdPerfil
        this.intIdSoft = intIdSoft
        this.intIdMenu = intIdMenu
        this.bitFlEliminado = bitFlEliminado

    }
}

//////////////////////////////////////////////////////////////////
//INICIALIZACION CON DOCUMENT READY
//////////////////////////////////////////////////////////////////
$(document).ready(function () {
    TablaPerfil();
});

////////////////////////////////////////////////////////////////////
//// VALIDACION DE CARACTERES DE CAMPO CODIGO
////////////////////////////////////////////////////////////////////
//function validarCodigo(evt) {
//    //onkeypress = "validarCodigo(event)"  
//    var theEvent = evt || window.event;

//    // Handle paste
//    if (theEvent.type === 'paste') {
//        key = event.clipboardData.getData('text/plain');
//    } else {
//        // Handle key press
//        var key = theEvent.keyCode || theEvent.which;
//        key = String.fromCharCode(key);
//    }
//    var regex = /[0-9]|[a-z]|[A-Z]|\_|\-/; //Numeros, Letras ---> a-z,A-Z, _, - sin espacio
//    if (!regex.test(key)) {
//        theEvent.returnValue = false;
//        if (theEvent.preventDefault) theEvent.preventDefault();
//    }
//}

////////////////////////////////////////////////////////////////////
//// VALIDACION DE CARACTERES DE DESCRIPCION
////////////////////////////////////////////////////////////////////
//function validarDescripcion(evt) {
//    //onkeypress = "validarDescripcion(event)" 
//    var theEvent = evt || window.event;

//    // Handle paste
//    if (theEvent.type === 'paste') {
//        key = event.clipboardData.getData('text/plain');
//    } else {
//        // Handle key press
//        var key = theEvent.keyCode || theEvent.which;
//        key = String.fromCharCode(key);
//    }
//    var regex = /[0-9]|[a-z]|[A-Z]|\_|\-|\s/; //Numeros, Letras ---> a-z,A-Z, _, - con espacios
//    if (!regex.test(key)) {
//        theEvent.returnValue = false;
//        if (theEvent.preventDefault) theEvent.preventDefault();
//    }
//}

//////////////////////////////////////////////////////////////////
//LISTADO PRINCIPAL DE LOS PERFILES 
//////////////////////////////////////////////////////////////////
function TablaPerfil() {
    validarSession()
    var Descipción = $('#strBusquedaGeneral').val();
    var Activo = $('#bitActivoPerfil').val();

    $.post(
        '/Seguridad/GetTablaPerfil',
        { intActivo: Activo, strDescripcion: Descipción },
        //{ objSession: SesionMovi, intActivo: Activo, strDescripcion: Descipción },
        (response) => {
            console.log(response);

            if (typeof _varTablaPerfil !== 'undefined') {
                _varTablaPerfil.destroy();
            }
            _varTablaPerfil = $('#tablaPerfil').DataTable({
                data: response,
                columns: [

                    { data: 'intIdPerfil' },
                    { data: 'strCoPerfil' },
                    { data: 'strDesPerfil' },
                    { data: 'strTipoPerfil' },
                    { data: 'strFlActivo' },
                    {
                        sortable: false,
                        "render": (data, type, item, meta) => {
                            let intIdPerfil = item.intIdPerfil;
                            let strDesPerfil = item.strDesPerfil;
                            return `<button class="btn btn-success btn-xs btn-edit" dataid="${intIdPerfil}" ><i class="fa fa-pencil"></i> Editar </button> 
                                    <button class="btn btn-primary btn-xs btn-delete" dataid="${intIdPerfil}" des_data="${strDesPerfil}" data="${item}" ><i class="fa fa-trash-o"></i> Eliminar </button>`;
                        }
                    }

                ],
                lengthMenu: [10, 25, 50],
                order: [0, 'asc'],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [
                    {
                        targets: [0],
                        visible: false,
                        searchable: false
                    }
                ],
                dom: 'lBfrtip',
            });


            $('#tablaPerfil  tbody').on('click', 'tr button.btn-delete', function () {

                let intIdPerfil = $(this).attr("dataid")
                let Descripcion = $(this).attr("des_data")
                if (!isNaN(intIdPerfil)) {
                    intentEliminarPerfil(intIdPerfil, Descripcion)
                }

            });

        });

}

//////////////////////////////////////////////////////////////////
//BOTON INTENTAR ELIMINAR FERFIL
//////////////////////////////////////////////////////////////////
function intentEliminarPerfil(intIdPerfil, Descripcion) {
    swal({
        title: "Eliminar Perfil",
        text: "¿Está seguro de eliminar el perfil ''<strong>" + Descripcion + "</strong>''?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaPerfil(intIdPerfil);
        } else {
            //swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}

//////////////////////////////////////////////////////////////////
//BOTON YES ELIMINAR FERFIL
//////////////////////////////////////////////////////////////////
function yesEliminaPerfil(intIdPerfil) {

    $.post(
        '/Seguridad/EliminarPerfil',
        { intIdPerfil: intIdPerfil },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    $('.form-hide-perfil').hide();
                    TablaPerfil();
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}

//////////////////////////////////////////////////////////////////
//CARGAR DATOS A EDITAR FERFIL 
//////////////////////////////////////////////////////////////////
function editarPerfil(intIdPerfil) {
    validarSession()
    $('#btn-guardar-change-perfil').hide();
    $('#btn-update-perfil').show();
    $('.form-hide-perfil').hide();

    //**************************************
    // CARGAR MENUS y SUBMENUS
    //**************************************
    $.post(
        '/Seguridad/ObtenerListadoSubMenus',
        { intActivo: 1, strDescripcion: '' },
        (response) => {


            var menusPADRES = '';
            var hijosPorPadre = '';
            subMenuData = response;
            response.forEach(element => {

                ///////////////////
                //MENUS
                ///////////////////
                //Segun la relacion de la bd se condiciona a los menus PADRE de la sigute manera
                if (element.strCoMenuRela == "") {
                    //***************************************************** 01
                    menusPADRES +=
                        '<li role="presentation"  id="' + element.intIdMenu + '"  class=""> ' +  //Todos los que que vienen en strCoMenuRela vacio son los padres
                        '<a  href="#menuId' + element.intIdMenu + '" aria-controls="home" role="tab" data-toggle="tab" aria-expanded="false">' +
                        element.strNomMenu +
                        '</a>' +
                        ' </li>'

                    $('#menuPadre').html(menusPADRES)

                    //***************************************************** 02
                    hijosPorPadre +=
                        '<div role="tabpanel" id="menuId' + element.intIdMenu + '" class="tab-pane">' +
                        '<div class="p-2">'

                    if (element.contador > 1) {

                        hijosPorPadre += '<div class="mb-3"  >' +
                            '<div class="icheck-material-blue">' +
                            //'<input type="checkbox" id="checkall' + element.intIdMenu + '"                                                    class="checbokmenuitem flatPadre"  onclick="checAllItems(menuPadre)" >' + //checAllItems(this.id)
                            '<input type="checkbox" id="checkall' + element.intIdMenu + '_' + element.strCoMenu + '_' + element.contador + '" class="checbokmenuitem flatPadre" validationpass_u="todosuncheck"  >' + //onclick="checAllItems_TODOS(event, this.id)"
                            '<label for="checkall' + element.intIdMenu + '_' + element.strCoMenu + '_' + element.contador + '" >Seleccionar Todos</label>' +
                            '</div>' +
                            '</div>'
                    }

                    hijosPorPadre += '<div id="' + element.strCoMenu + 'S"  class="mt-4 d-flex flex-wrap" >' +
                        //////////////////////////////////HIJOS
                        '</div>' +

                        '</div>' +
                        '</div>'

                    $('#divMenusHijos').html(hijosPorPadre);


                }


            });


            ///////////////////
            //SUBMENUS
            ///////////////////
            $.post(
                '/Seguridad/ObtenerListadoSubMenus',
                { intActivo: 1, strDescripcion: '' },
                (response) => {

                    response.forEach(element => {

                        if (element.strCoMenuRela !== "") {

                            var menuHijo = '';
                            menuHijo += '<div class="icheck-material-blue mr-3 mb-2 ' + element.strCoMenuRela + ' ">' + //.M00 para el checkear todos
                                //'<input type="checkbox" id="submenuid' + element.intIdMenu + '" class="flatHijo" onclick="checAllItems_UNOPORUNO(this.id)" >' + //value="[object Object]" //onclick="checkSelectAll(this.id)" 
                                '<input type="checkbox" id="' + element.strCoMenuRela + '_submenuid' + element.intIdMenu + '" class="flatHijo"  >' + //onclick="checAllItems_UNOPORUNO(this.id)"    value="[object Object]" //onclick="checkSelectAll(this.id)" 
                                '<label for="' + element.strCoMenuRela + '_submenuid' + element.intIdMenu + '">' +
                                element.strNomMenu +
                                '</label>' +
                                '</div>'

                            $('#' + element.strCoMenuRela + 'S').append(menuHijo);


                        }

                        ////////////////////////////////////////
                        //EL PRIMER MENU
                        ////////////////////////////////////////
                        $('#menuPadre li:first').trigger('click');
                        $("#1").last().addClass("active");
                        $("#1 a").attr("aria-expanded", "true");
                        $("#menuId1").addClass("active");


                    });


                    //////////////////////////////////////////////////////////////////////////////////
                    //1.4 SELECCIONAR SUBMENU POR SUBMENU UN POR UNO
                    //////////////////////////////////////////////////////////////////////////////////
                    $('.flatHijo').on('click', function () {
                        //Coge a todos los hijos o submenus
                        var intIdMenu_s = (this.id).split('_');
                        var cantSubMenusVisTot = $('.p-2 .mt-4').find("input[class='flatHijo']:visible");
                        var cantSubMenusVisChecked = $('.p-2 .mt-4').find("input[class='flatHijo']:visible:checked");
                        if (cantSubMenusVisTot.length == cantSubMenusVisChecked.length) {
                            $($('.p-2 .mb-3').find('input:visible')).prop('checked', true).attr('checked', 'checked');
                            $($('.p-2 .mb-3').find('input:visible')).attr('validationpass_u', 'todoscheck');
                        }
                        else {
                            $($('.p-2 .mb-3').find('input:visible')).prop('checked', false).removeAttr('checked');
                            $($('.p-2 .mb-3').find('input:visible')).attr('validationpass_u', 'todosuncheck');
                        }

                    });
                    //////////////////////////////////////////////////////////////////////////////////


                    //////////////////////////////////////////////////////////////////////////////////
                    //1.3 CHECKEAR Y DESCHECKEAR CON OPCION EL "Seleccionar Todos" OK
                    //////////////////////////////////////////////////////////////////////////////////
                    $('.flatPadre').on('click', function () {
                        //alert('this.id de la clase .flatPadre ---> ' + this.id);
                        var intIdMenu_s = (this.id).split('_');
                        var validationpass_u = $('#' + this.id + '').attr("validationpass_u");
                        //alert('validationpass_u --->' + validationpass_u);
                        //alert(intIdMenu_s);
                        var inputTodos = $(".p-2 .mt-4 .icheck-material-blue ").find("input[id^='" + intIdMenu_s[1] + "_submenuid']");

                        if (validationpass_u == 'todosuncheck') {

                            $(this).attr('validationpass_u', 'todoscheck')

                            for (var i = 0; i < inputTodos.length; i++) {

                                var intIdMenu_ = $(inputTodos[i]).attr('id');

                                //EL ID DEL SUBMENU DEL FOR
                                //alert('submenu ' + $('#' + intIdMenu_ + '').is(':checked'));

                                if ($('#' + intIdMenu_ + '').is(':checked') == false) {

                                    $('#' + intIdMenu_ + '').prop("checked", "checked");
                                }
                                else {
                                    //alert('si esta checeado dejarlo asi');
                                }

                            }

                        }

                        else {

                            $(this).attr('validationpass_u', 'todosuncheck')
                            for (var i = 0; i < inputTodos.length; i++) {
                                var intIdMenu_ = $(inputTodos[i]).attr('id');
                                //EL ID DEL SUBMENU DEL FOR
                                //alert('submenu ' + $('#' + intIdMenu_ + '').is(':checked'));
                                $('#' + intIdMenu_ + '').prop('checked', false).removeAttr('checked');
                            }

                        }

                    });
                    //////////////////////////////////////////////////////////////////////////////////


                    $.post(
                        '/Seguridad/ObtenerRegistroPerfil',
                        { IntIdPerfil: intIdPerfil },
                        (response) => {
                            console.log(response);
                            response.forEach(element => {
                                $('#txt_codigo_Perfil').val(element.strCoPerfil);
                                $('#txt_descripcion_Perfil').val(element.strDesPerfil);
                                $('#intidPerfil').val(intIdPerfil);

                                //var elementoSwitch = $('#switcher-c');
                                //if (element.bitFlActivo == false) {

                                //    changeSwitchery(elementoSwitch, false);

                                //}
                                //else if (element.bitFlActivo == true) {

                                //    changeSwitchery(elementoSwitch, true);

                                //}
                                //modificado 16.08.2021
                                if (element.bitFlActivo == true) {
                                    $('#11').html('<label id="_lbl_">Activo</label> <input type = "checkbox" id = "chk-activo-perf" class= "js-switch" checked /><script>switcheryLoad();</script >');
                                } else if (element.bitFlActivo == false) {
                                    $('#11').html('<label id="_lbl_">Inactivo</label> <input type = "checkbox" id = "chk-activo-perf" class= "js-switch" /><script>switcheryLoad();</script >');
                                }
                            });
                        });


                    $.post(
                        '/Personal/ListarCombosPersonal',//corregido para este proy ListarCombosPersonal_ 16.08.2021
                        { intIdMenu: 0, strEntidad: 'TGPERFIL_MENU_SIN_VUE', intIdFiltroGrupo: intIdPerfil, strGrupo: 'CHECK_SIN_VUE', strSubGrupo: '' },
                        (response) => {
                            response.forEach(element2 => {

                                if (element2.strDeTipo == "SI") {
                                    $('#' + element2.strCoMenuRela + '_submenuid' + element2.intidTipo + '').attr('checked', true);
                                }

                            });

                            var inputTodos = $(".p-2 .mb-3 .icheck-material-blue ").find('input[type="checkbox"]');
                            for (var i = 0; i < inputTodos.length; i++) {
                                var intIdMenu_ = $(inputTodos[i]).attr('id');
                                var intIdMenu_s = intIdMenu_.split('_');
                                var inputSubmenu = $(".p-2 .mt-4").find("input[id^='" + intIdMenu_s[1] + "_submenuid']");
                                var inputSubmenu_c = $(".p-2 .mt-4 ").find("input[id^='" + intIdMenu_s[1] + "_submenuid']:checked");
                                //Chequear "Todos"
;                                if (inputSubmenu_c.length == inputSubmenu.length) {
            
                                    $(inputTodos[i]).attr('validationpass_u', 'todoscheck')
                                    $(inputTodos[i]).prop("checked", "checked");

                                }

                            }
                            $('.form-hide-perfil').show();
                        });
                });
        });
}

//////////////////////////////////////////////////////////////////////
//////CAMBIAR EL SWITCH ACTIVO AL CARGAR UN EDITAR
//////////////////////////////////////////////////////////////////////
//function changeSwitchery(elemento, checked) {
//    if ((elemento.is(':checked') && checked == false) || (!elemento.is(':checked') && checked == true)) {
//        elemento.parent().find('.switchery').trigger('click');
//    }
//}

//////////////////////////////////////////////////////////////////
//BOTON EDITAR FERFIL
//////////////////////////////////////////////////////////////////
$('#tablaPerfil  tbody').on('click', 'tr button.btn-edit', function () {
    validarSession()
    //**************************************
    //CONTROLES MAXIMO CARACTERES 
    //**************************************
    $.post(
        '/Personal/ListarCaracteresMax',//'/Seguridad/getMaestroCaracteres',
        { strMaestro: 'TSPERFIL' },
        (response) => {
            response.forEach(element => {
                if (element.strColumnName == 'strCoPerfil') {
                    $('#' + element.strColumnName + '').empty();
                    $('#' + element.strColumnName + '').append('<label>Código (*)</label><input type = "text" class= "form-control" id = "txt_codigo_Perfil" placeholder = "Código" maxlength="' + element.intMaxLength + '" onkeypress="validarCodigoAll(event)" ><div id="notifry_error" style="background-color:#4CA4DE;color:white;text-align:center;"></div>');
                }
                else if (element.strColumnName == 'strDesPerfil') {
                    $('#' + element.strColumnName + '').empty();
                    $('.form-hide-Usuario').show();
                    $('#' + element.strColumnName + '').append('<label>Descripción (*)</label><input type = "text" class= "form-control" id = "txt_descripcion_Perfil" placeholder = "Descripción" maxlength="' + element.intMaxLength + '"  onkeypress="validarDescripcionAll(event)" ><div id="notifry_errordes" style="background-color:#4CA4DE;color:white;text-align:center;"></div>');
                    $("#txt_codigo_Perfil").keyup(function () {
                        $('#notifry_error').html('');
                        document.getElementById("txt_codigo_Perfil").style.borderColor = "#CCCCCC";
                    });
                    $("#txt_descripcion_Perfil").keyup(function () {
                        $('#notifry_errordes').html('');
                        document.getElementById("txt_descripcion_Perfil").style.borderColor = "#CCCCCC";
                    });

                }

            });
            let intIdPerfil = $(this).attr("dataid")
            if (!isNaN(intIdPerfil)) {
                editarPerfil(intIdPerfil)
            }
        });
});

//////////////////////////////////////////////////////////////////
//BOTON NUEVO FERFIL 
//////////////////////////////////////////////////////////////////
$('#btn_nuevo_perfil').on('click', function () {
    validarSession()
    $('.form-hide-perfil').hide();
    $('#divMenusHijos').html('');
    $('#11').html('<label id="_lbl_">Activo</label> <input type = "checkbox" id = "chk-activo-perf" class= "js-switch" checked /><script>switcheryLoad();</script >');//añadido 24.05.2021
    //$("#switcher-c").attr('checked', true);
    $('#txt_codigo_Perfil').val('');
    $('#txt_descripcion_Perfil').val('');
    $('#btn-guardar-change-perfil').show();
    $('#btn-update-perfil').hide();

    //****************************************************************
    // Validacion de longitud de Texto de los Input Maximo Caracteres  
    //****************************************************************
    $.post(
        '/Personal/ListarCaracteresMax',//'/Seguridad/getMaestroCaracteres',
        { strMaestro: 'TSPERFIL' },
        (response) => {
            response.forEach(element => {
                if (element.strColumnName == 'strCoPerfil') {
                    $('#' + element.strColumnName + '').empty();
                    $('#' + element.strColumnName + '').append('<label>Código (*)</label><input type = "text" class= "form-control" id = "txt_codigo_Perfil" placeholder = "Código" maxlength="' + element.intMaxLength + '" onkeypress = "validarCodigoAll(event)"><div id="notifry_error" style="background-color:#4CA4DE;color:white;text-align:center;"></div>');
                }
                else if (element.strColumnName == 'strDesPerfil') {
                    $('#' + element.strColumnName + '').empty();
                    $('.form-hide-Usuario').show();
                    $('#' + element.strColumnName + '').append('<label>Descripción (*)</label><input type = "text" class= "form-control" id = "txt_descripcion_Perfil" placeholder = "Descripción" maxlength="' + element.intMaxLength + '"  onkeypress = "validarDescripcionAll(event)" ><div id="notifry_errordes" style="background-color:#4CA4DE;color:white;text-align:center;"></div>');
                    $("#txt_codigo_Perfil").keyup(function () {
                        $('#notifry_error').html('');
                        document.getElementById("txt_codigo_Perfil").style.borderColor = "#CCCCCC";
                    });
                    $("#txt_descripcion_Perfil").keyup(function () {
                        $('#notifry_errordes').html('');
                        document.getElementById("txt_descripcion_Perfil").style.borderColor = "#CCCCCC";
                    });

                }

            });
        });


    //===============================================================================
    //::::::::: SEGUNDO PANEL (al selec boton Nuevo perfil)::::::::::
    //===============================================================================   
    var icv = 0;
    $.post(
        '/Seguridad/ObtenerListadoSubMenus',
        { intActivo: 1, strDescripcion: '' },
        (response) => {

            ///////////////////////////////
            var menusPADRES = '';
            var hijosPorPadre = '';
            //var menuHijo = '';
            subMenuData = response;
            response.forEach(element => {

                //Segun la relacion de la bd se condiciona a los menus PADRE de la sigute manera
                if (element.strCoMenuRela == "") {
                    //***************************************************** 01
                    menusPADRES +=
                        '<li role="presentation"  id="' + element.intIdMenu + '"  class=""> ' +  //Todos los que que vienen en strCoMenuRela vacio son los padres
                        '<a  href="#menuId' + element.intIdMenu + '" aria-controls="home" role="tab" data-toggle="tab" aria-expanded="false">' +
                        element.strNomMenu +
                        '</a>' +
                        ' </li>'

                    $('#menuPadre').html(menusPADRES)

                    //***************************************************** 02
                    hijosPorPadre +=
                        '<div role="tabpanel" id="menuId' + element.intIdMenu + '" class="tab-pane">' +
                        '<div class="p-2">'

                    if (element.contador > 1) {

                        hijosPorPadre += '<div class="mb-3"  >' +
                            '<div class="icheck-material-blue">' +
                            '<input type="checkbox" id="checkall' + element.intIdMenu + '_' + element.strCoMenu + '_' + element.contador + '" class="flatPadre" validationpass_u="todosuncheck"  >' + //onclick="checAllItems_TODOS(event, this.id)"
                            '<label for="checkall' + element.intIdMenu + '_' + element.strCoMenu + '_' + element.contador + '" >Seleccionar Todos</label>' +
                            '</div>' +
                            '</div>'
                    }

                    hijosPorPadre += '<div id="' + element.strCoMenu + 'S"  class="mt-4 d-flex flex-wrap" >' +
                        //////////////////////////////////HIJOS
                        '</div>' +

                        '</div>' +
                        '</div>'

                    $('#divMenusHijos').html(hijosPorPadre);
                }
            });


            ///////////////////////////////
            //SUBMENUS
            ///////////////////////////////
            $.post(
                '/Seguridad/ObtenerListadoSubMenus',
                { intActivo: 1, strDescripcion: '' },
                (response) => {

                    response.forEach(element => {

                        if (element.strCoMenuRela !== "") {

                            var menuHijo = '';
                            menuHijo += '<div class="icheck-material-blue mr-3 mb-2 ' + element.strCoMenuRela + ' ">' + //.M00 para el checkear todos
                                //'<input type="checkbox" id="submenuid' + element.intIdMenu + '" class="flatHijo" onclick="checAllItems_UNOPORUNO(this.id)" >' + //value="[object Object]" //onclick="checkSelectAll(this.id)" 
                                '<input type="checkbox" id="' + element.strCoMenuRela + '_submenuid' + element.intIdMenu + '" class="flatHijo"  >' + //onclick="checAllItems_UNOPORUNO(this.id)"      value="[object Object]" //onclick="checkSelectAll(this.id)" 
                                '<label for="' + element.strCoMenuRela + '_submenuid' + element.intIdMenu + '">' +
                                element.strNomMenu +
                                '</label>' +
                                '</div>'


                            $('#' + element.strCoMenuRela + 'S').append(menuHijo);

                            $('.form-hide-perfil').show();


                        }

                        ////////////////////////////////////////
                        //EL PRIMER MENU
                        ////////////////////////////////////////
                        $('#menuPadre li:first').trigger('click');
                        $("#1").last().addClass("active");
                        $("#1 a").attr("aria-expanded", "true");
                        $("#menuId1").addClass("active");

                    });


                    //////////////////////////////////////////////////////////////////////////////////
                    //1.4 SELECCIONAR SUBMENU POR SUBMENU UN POR UNO
                    //////////////////////////////////////////////////////////////////////////////////
                    $('.flatHijo').on('click', function () {
                        //Coge a todos los hijos o submenus
                        //alert('this.id de la clase .flatHijo ---> ' + this.id);
                        var intIdMenu_s = (this.id).split('_');
                        //alert(intIdMenu_s);
                        var cantSubMenusVisTot = $('.p-2 .mt-4').find("input[class='flatHijo']:visible");
                        //alert('cantSubMenusVisTot --->' + cantSubMenusVisTot.length);
                        var cantSubMenusVisChecked = $('.p-2 .mt-4').find("input[class='flatHijo']:visible:checked");
                        //alert('cantSubMenusChecked --->' + cantSubMenusVisChecked.length);

                        if (cantSubMenusVisTot.length == cantSubMenusVisChecked.length) {
                            //alert($('.p-2 .mb-3').find('input:visible').attr('id'));
                            $($('.p-2 .mb-3').find('input:visible')).prop('checked', true).attr('checked', 'checked');
                            $($('.p-2 .mb-3').find('input:visible')).attr('validationpass_u', 'todoscheck');
                        }
                        else {
                            //alert($('.p-2 .mb-3').find('input:visible').attr('id'));
                            $($('.p-2 .mb-3').find('input:visible')).prop('checked', false).removeAttr('checked');
                            $($('.p-2 .mb-3').find('input:visible')).attr('validationpass_u', 'todosuncheck');
                        }

                    });
                    //////////////////////////////////////////////////////////////////////////////////


                });


            //////////////////////////////////////////////////////////////////////////////////
            //1.3 CHECKEAR Y DESCHECKEAR CON OPCION EL "Seleccionar Todos" OK
            //////////////////////////////////////////////////////////////////////////////////
            $('.flatPadre').on('click', function () {
                //alert('this.id de la clase .flatPadre ---> ' + this.id);
                var intIdMenu_s = (this.id).split('_');
                var validationpass_u = $('#' + this.id + '').attr("validationpass_u");
                //alert('validationpass_u --->' + validationpass_u);
                //alert(intIdMenu_s);
                var inputTodos = $(".p-2 .mt-4 .icheck-material-blue ").find("input[id^='" + intIdMenu_s[1] + "_submenuid']");

                if (validationpass_u == 'todosuncheck') {

                    $(this).attr('validationpass_u', 'todoscheck')

                    for (var i = 0; i < inputTodos.length; i++) {

                        var intIdMenu_ = $(inputTodos[i]).attr('id');

                        //EL ID DEL SUBMENU DEL FOR
                        //alert('submenu ' + $('#' + intIdMenu_ + '').is(':checked'));

                        if ($('#' + intIdMenu_ + '').is(':checked') == false) {

                            $('#' + intIdMenu_ + '').prop("checked", "checked");
                        }
                        else {
                            //alert('si esta checeado dejarlo asi');
                        }

                    }

                }

                else {

                    $(this).attr('validationpass_u', 'todosuncheck')
                    for (var i = 0; i < inputTodos.length; i++) {
                        var intIdMenu_ = $(inputTodos[i]).attr('id');
                        //EL ID DEL SUBMENU DEL FOR
                        //alert('submenu ' + $('#' + intIdMenu_ + '').is(':checked'));
                        $('#' + intIdMenu_ + '').prop('checked', false).removeAttr('checked');
                    }

                }

            });
            //////////////////////////////////////////////////////////////////////////////////


        });



});

//////////////////////////////////////////////////////////////////
//BOTON GUARDAR FERFIL
//////////////////////////////////////////////////////////////////
$('#btn-guardar-change-perfil').on('click', function () {
    validarSession()
    var titulo_ = 'Nuevo Perfil'
    var _codigo = $('#txt_codigo_Perfil').val();
    var _desc = $('#txt_descripcion_Perfil').val();
    //var _activo = $('#switcher-c').is(':checked');
    var _activo = $('#chk-activo-perf').is(':checked');//añadido 16.08.2021

    if (_codigo === '') {
        messageResponseMix({ type: 'info', message: 'Ingrese un Código' }, titulo_)
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }
    if (_desc === '') {
        messageResponseMix({ type: 'info', message: 'Ingrese una Descripción' }, titulo_)
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }

    var Perfil = {
        strCoPerfil: _codigo,
        strDesPerfil: _desc,
        bitFlActivo: _activo,
    }


    var _check;
    $('.tab-content').each((index, item) => {
        _check = $("#divMenusHijos .mr-3 ").find('input:checked');//.find('input.Mens');
    });


    if (_check.length == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione por lo menos un Menú' }, titulo_)
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }

    listaDetallesPerfil = [];
    for (var i = 0; i < _check.length; i++) {

        var intIdMenuI = $(_check[i]).attr('id');
        var intIdMenuI_s = intIdMenuI.split('_');
        var intIdMenu = intIdMenuI_s[1].slice(9);

        if (intIdMenu !== 0) {
            //TENER EN CUENTA EL ID SOFT (sisactivo=6, sisfood=3)
            listaDetallesPerfil.push(new TT_TSPERFIL_MENU(0, 0, 4, intIdMenu, 0));

        }
    }


    $.post(
        '/Seguridad/InsertUpdatePerfil',
        { intTipoOperacion: 1, ObjPerfil: Perfil, listaDetallesPerfil: listaDetallesPerfil },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    messageResponseMix({ type: response.type, message: response.message }, titulo_)
                    $('.form-hide-perfil').hide();
                    TablaPerfil();
                } else {

                    if (response.type === 'codigo') {
                        var nomMantemiento = 'Perfil';
                        var campo = 'txt_codigo_Perfil';
                        var msj = response.message;
                        var response = "info";
                        var deta = 'notifry_error';
                        document.getElementById("txt_codigo_Perfil").style.borderColor = "#3498dbe0";

                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'descripcion') {

                            var nomMantemiento = 'Perfil';
                            var campo = 'txt_descripcion_Perfil';
                            var msj = response.message;
                            var response = "info";
                            var deta = 'notifry_errordes';
                            document.getElementById("txt_descripcion_Perfil").style.borderColor = "#3498dbe0";

                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        } else {
                            messageResponseMix({ type: response.type , message: response.message }, titulo_)
                        }

                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

});

//////////////////////////////////////////////////////////////////
//BOTON ACTUALIZAR FERFIL
//////////////////////////////////////////////////////////////////
$('#btn-update-perfil').on('click', function () {
    validarSession()
    var titulo_= 'Actualización de Perfil'
    var _codigo = $('#txt_codigo_Perfil').val();
    var _desc = $('#txt_descripcion_Perfil').val();
    //var _activo = $('#switcher-c').is(':checked');
    var _activo = $('#chk-activo-perf').is(':checked');//añadido 16.08.2021
    var _intidPerfil = $('#intidPerfil').val();

    if (_codigo === '') {
        messageResponseMix({ type: 'info', message: 'Ingrese un Código' }, titulo_)
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }
    if (_desc === '') {
        messageResponseMix({ type: 'info', message: 'Ingrese una Descripción' }, titulo_)
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }

    var Perfil = {
        strCoPerfil: _codigo,
        strDesPerfil: _desc,
        bitFlActivo: _activo,
        intIdPerfil: _intidPerfil,
    }

    var _check;
    $('.tab-content').each((index, item) => {
        _check = $("#divMenusHijos .mr-3 ").find('input:checked'); //.find('input.Mens');
    });
    if (_check.length == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione por lo menos un Menú' }, titulo_)
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }

    listaDetallesPerfil = [];
    for (var i = 0; i < _check.length; i++) {

        var intIdMenuI = $(_check[i]).attr('id');
        var intIdMenuI_s = intIdMenuI.split('_');
        var intIdMenu = intIdMenuI_s[1].slice(9);

        if (intIdMenu !== 0) {
            //TENER EN CUENTA EL ID SOFT (sisactivo=6, sisfood=3)
            listaDetallesPerfil.push(new TT_TSPERFIL_MENU(0, 0, 4, intIdMenu, 0));

        }
    }


    $.post(
        '/Seguridad/InsertUpdatePerfil',
        { intTipoOperacion: 2, ObjPerfil: Perfil, listaDetallesPerfil: listaDetallesPerfil },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    messageResponseMix({ type: response.type, message: response.message }, titulo_)
                    listaDetallesPerfil = [];
                    $('.form-hide-perfil').hide();
                    TablaPerfil();
                } else {

                    if (response.type === 'codigo') {
                        var nomMantemiento = 'Perfil';
                        var campo = 'txt_codigo_Perfil';
                        var msj = response.message;
                        var response = "info";
                        var deta = 'notifry_error';
                        document.getElementById("txt_codigo_Perfil").style.borderColor = "#3498dbe0";

                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'descripcion') {

                            var nomMantemiento = 'Perfil';
                            var campo = 'txt_descripcion_Perfil';
                            var msj = response.message;
                            var response = "info";
                            var deta = 'notifry_errordes';
                            document.getElementById("txt_descripcion_Perfil").style.borderColor = "#3498dbe0";

                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        } else {
                            messageResponseMix({ type: response.type, message: response.message }, titulo_)
                        }

                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

});

//////////////////////////////////////////////////////////////////
//BOTON CANCELAR FERFIL
//////////////////////////////////////////////////////////////////
$('#btn-cancel-perfil').on('click', function () {
    $('.form-hide-perfil').hide();
});

//////////////////////////////////////////////////////////////////
// FILTROS DEL LISTADO CON 02 CONTROLES
//////////////////////////////////////////////////////////////////
$('#bitActivoPerfil').on('change', function () {
    TablaPerfil();
});
$('#strBusquedaGeneral').change(function () {//modificado 16.08.2021
    TablaPerfil();
});

