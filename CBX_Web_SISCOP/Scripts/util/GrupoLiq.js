var _varTablaGrupo;

// Switchery (Activo/Inactivo) //copiado 24.05.2021
function switcheryLoad() {

    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });

    }

}


$(document).ready(function () {
    CombosGrupoLiq()
    getTableGrupoLiq()

    var txtCod = 'strCoGrupoLiq';
    var txtdes = 'strDesGrupoLiq';

    $.post(
        '/Organizacion/ListarCaracteresMax',
        { strMaestro: 'TGGRUPOLIQ' },
        (response) => {
            response.forEach(element => {
                if (element.strColumnName == txtCod) {
                    $('#ValCode').children("input").attr('maxlength', element.intMaxLength);
                } if (element.strColumnName == txtdes) {
                    $('#Valdes').children("input").attr('maxlength', element.intMaxLength);
                }

            });
        });

})

function getTableGrupoLiq() {

    var cboUniOrg = $("#cboUniOrg").val()
    var cboPlanilla = $("#cboPlanilla").val()
    var filtroGrupoLiq = $("#filtroGrupoLiq").val()
    var filtroActivo = $("#filtroActivo").val()
    var periodoFiltroId = $("#periodoFiltroId").val()

    $.ajax({
        url: '/Proceso/ListarGrupoLiq',
        type: 'POST',
        data:
        {
            filtroUniOrg: cboUniOrg,
            filtroPlanilla: cboPlanilla,
            filtroGrupoLiq: filtroGrupoLiq,
            filtroActivo: filtroActivo,
            filtroPeriodo: periodoFiltroId
        },
        beforeSend: function () {
            $.blockUI({
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .5,
                    color: '#fff'
                },
                message: 'Procesando...'
            });
        },
        success: function (response) {
            console.log(response)

            if (typeof _varTablaGrupo !== 'undefined') {
                _varTablaGrupo.destroy();
            }

            _varTablaGrupo = $('#datatable-GrupoLiq').DataTable({
                data: response,
                columns: [
                    { data: 'strCoGrupoLiq' },
                    { data: 'strDesGrupoLiq' },
                    { data: 'strDesPeriodo' },
                    { data: 'strDesPlani' },//añadido 04/08/2021
                    { data: 'strDesUO' },//añadido 04/08/2021
                    { data: 'strEstadoActivo' },
                    {
                        sortable: false,
                        "render": (data, type, item, meta) => {
                            var intIdGrupoLiq = item.intIdGrupoLiq;
                            var strDesGrupoLiq = item.strDesGrupoLiq;

                            return `<button class="btn btn-success btn-xs btn-edit" onclick="editarGrupoLiq('${intIdGrupoLiq}');"><i class="fa fa-pencil"></i> Editar </button> 
                                    <button class="btn btn-primary btn-xs btn-delete" dataid="${intIdGrupoLiq}" des_data="${strDesGrupoLiq}"><i class="fa fa-trash-o"></i> Eliminar </button>`;
                        }
                    }
                ],
                lengthMenu: [10, 25, 50],
                order: [],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [],
                dom: 'lBfrtip',
            });

            $('#datatable-GrupoLiq tbody').on('click', 'tr button.btn-delete', function () {
                validarSession()
                var intIdGrupoLiq = $(this).attr("dataid");
                var strDesGrupoLiq = $(this).attr("des_data");

                if (!isNaN(intIdGrupoLiq)) {

                    swal({
                        title: "Eliminar Grupo de Liquidación",
                        text: "¿Está seguro de eliminar el Grupo de liquidación ''<strong>" + strDesGrupoLiq + "</strong>'' ?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "No, cancelar",
                    }).then(function (isConfirm) {
                        validarSession()
                        $.post(
                            '/Proceso/EliminaGrupoLiq',
                            { intIdGrupoLiq: intIdGrupoLiq },
                            (response) => {
                                if (response.type !== '') {
                                    var tipo = 'Eliminado!';
                                    if (response.type === 'error')
                                        tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                                    swal(tipo, response.message, response.type);

                                    if (response.type === 'success') {
                                        $('.form-hide-grupoliq').hide();
                                        getTableGrupoLiq();
                                    }
                                }
                            }
                        ).fail(function (result) {
                            alert('ERROR ' + result.status + ' ' + result.statusText);
                        });
                    }, function (dismiss) {
                        if (dismiss == 'cancel') {
                            //swal("Cancelado", "La Operación fue cancelada", "error");
                        }
                    });

                }

            });
        },
        complete: function () {
            $.unblockUI();
        }

    });
}
function CamposAdicionalesGrupoLiq(dato) {

    $.post(
        '/Organizacion/CamposAdicionales',//'/Proceso/ListarCamposAdicionales',
        { strEntidad: 'TGGRUPOLIQ' },
        (response) => {
            console.log(response);
            $('#containerCampos').empty();
            response.forEach(element => {
                $('#containerCampos').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="' + element.strTitulo.replace("(*)", "") + '" maxlength="255"/>' + '</div></div>');
            });
            if (dato != null) {
                $('#strGrupoLiqCampo1').val(dato.strGrupoLiqCampo1)
                $('#strGrupoLiqCampo2').val(dato.strGrupoLiqCampo2)
                $('#strGrupoLiqCampo3').val(dato.strGrupoLiqCampo3)
                $('#strGrupoLiqCampo4').val(dato.strGrupoLiqCampo4)
                $('#strGrupoLiqCampo5').val(dato.strGrupoLiqCampo5)
            }
        });
}

function editarGrupoLiq(intIdGrupoLiq) {
    validarSession()
    cleanForm()
    $.post(
        '/Proceso/ObtenerGrupoLiqPorsuPK',
        {
            intIdGrupoLiq: intIdGrupoLiq,
        },
        (response) => {
            console.log(response)

            $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
                {
                    intIdMenu: 0, strEntidad: 'TGPERIODO', intIdFiltroGrupo: response.intIdPlanilla, strGrupo: 'TGPERIODO', strSubGrupo: '',
                },
                response2 => {
                    $('#periodoId').empty()
                    $('#periodoId').append('<option value="0">Seleccione</option>')
                    response2.forEach(element => {
                        if (element.intidTipo == response.intIdPeriodo) {
                            $('#periodoId').append('<option selected value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                        } else {
                            $('#periodoId').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                        }
                    })
                });

            $.post('/Personal/ListarCombos', {  //{'/Proceso/ListarCombosProceso'
                intIdMenu: 0, strEntidad: 'TGPLANILLA', intIdFiltroGrupo: response.intIdUniOrg, strGrupo: 'TGPLANILLA', strSubGrupo: '',
            }, response3 => {
                $('#planillaId').empty()
                $('#planillaId').append('<option value="0">Seleccione</option>')
                response3.forEach(element => {
                    if (element.intidTipo == response.intIdPlanilla) {
                        $('#planillaId').append('<option selected value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                    } else {
                        $('#planillaId').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                    }
                })
            }).fail(function (result) {
                alert('ERROR ' + result.status + ' ' + result.statusText)
            })

            $.post('/Organizacion/getUnidxJerarquia', { IntIdJerOrg: response.intIdJerOrg }, response4 => {
                $('#unidadOrgId').empty();
                $('#unidadOrgId').attr('disabled', false);
                //$('#unidadOrgId').append('<option value="0">Seleccione</option>') 
                response4.forEach(element => {
                    if (element.intIdUniOrg == response.intIdUniOrg) {
                        $('#unidadOrgId').append('<option selected value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>')
                    } else {
                        $('#unidadOrgId').append('<option value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>')
                    }
                })
            }).fail(function (result) {
                alert('ERROR ' + result.status + ' ' + result.statusText)
            })

            //modificado 23.08.2021
            $.post(
                //'/Proceso/ListarCombosProceso',
                //{
                //    intIdMenu: 0, strEntidad: 'TGJERARQORG', intIdFiltroGrupo: 0, strGrupo: 'DEPEN', strSubGrupo: '',
                //},
                '/Personal/ListarCombos',
                {
                    intIdMenu: 0,
                    strEntidad: 'TGJERARQORG',
                    intIdFiltroGrupo: 0,
                    strGrupo: 'DEPEN_MAESTROS',
                    strSubGrupo: '',
                },
                response5 => {
                    $('#dependenciaJerId').empty()
                    if (response5.length > 1) {
                        $('#dependenciaJerId').append('<option value="0">Seleccione</option>')
                    }

                    response5.forEach(element => {
                        if (element.intidTipo == response.intIdJerOrg) {
                            $('#dependenciaJerId').append('<option selected value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                        } else {
                            $('#dependenciaJerId').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                        }
                    })
                })


            if (response.bitFlActivo == true) {
                $('#11').html('<label id="_lbl_">Activo</label> <input type = "checkbox" id = "chk-activo-grupliq" class= "js-switch" checked /><script>switcheryLoad();</script >');
            } else if (response.bitFlActivo == false) {
                $('#11').html('<label id="_lbl_">Inactivo</label> <input type = "checkbox" id = "chk-activo-grupliq" class= "js-switch" /><script>switcheryLoad();</script >');
            }

            $("#grupoLiqId").val(response.intIdGrupoLiq)
            $("#btn-save-change-grupoliq").val("Actualizar")
            $("#btn-save-change-grupoliq").removeClass();
            $("#btn-save-change-grupoliq").addClass("btn");
            $("#btn-save-change-grupoliq").addClass("btn btn-success");
            $('#codigoId').val(response.strCoGrupoLiq)
            $('#descripcionId').val(response.strDesGrupoLiq)

            $('#periodoId').val(response.intIdPeriodo)

            var objDatos = {
                strGrupoLiqCampo1: response.strGrupoLiqCampo1,
                strGrupoLiqCampo2: response.strGrupoLiqCampo2,
                strGrupoLiqCampo3: response.strGrupoLiqCampo3,
                strGrupoLiqCampo4: response.strGrupoLiqCampo4,
                strGrupoLiqCampo5: response.strGrupoLiqCampo5
            }

            CamposAdicionalesGrupoLiq(objDatos)
            $('.form-hide-grupoliq').show();
        });
}

function cleanForm() {
    $(".notifry_error").html("")
    $('#codigoId').val("")
    $('#descripcionId').val("")
    $('#periodoId').val(0)
    $("#unidadOrgId").val(0)
    $("#planillaId").val(0)
}
function CombosGrupoLiq() {
    var intIdMenu = 0

    $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
        {
            strEntidad: 'TGUNIDORG', intIdFiltroGrupo: 0, strGrupo: 'JERAR', strSubGrupo: 'FILTRO',//modificado 08.09.2021
        },
        response => {
            $('#cboUniOrg').empty()
            //$('#cboUniOrg').append('<option value="0">Todos</option>')
            response.forEach(element => {
                $('#cboUniOrg').append('<option ruc="' + element.strextra1 + '" value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })
            $("#cboPlanilla").attr("disabled", true)
            $("#periodoFiltroId").attr("disabled", true)
        });
}

$('#btn-new-grupoliq').on('click', function () {
    validarSession()
    cleanForm()
    $("#btn-save-change-grupoliq").val("Guardar")
    $("#btn-save-change-grupoliq").removeClass();
    $("#btn-save-change-grupoliq").addClass("btn");
    $("#btn-save-change-grupoliq").addClass("btn btn-primary");
    $("#grupoLiqId").val('')
    $('.form-hide-grupoliq').show();
    CamposAdicionalesGrupoLiq()
    $('#11').html('<label id="_lbl_">Activo</label> <input type = "checkbox" id = "chk-activo-grupliq" class= "js-switch" checked /><script>switcheryLoad();</script >');

    $('#unidadOrgId').attr('disabled', true);

    //modificado 23.08.2021
    $.post(
        //'/Proceso/ListarCombosProceso',
        //{
        //    intIdMenu: 0, strEntidad: 'TGJERARQORG', intIdFiltroGrupo: 0, strGrupo: 'DEPEN', strSubGrupo: '',
        //},
        '/Personal/ListarCombos',
        {
            intIdMenu: 0,
            strEntidad: 'TGJERARQORG',
            intIdFiltroGrupo: 0,
            strGrupo: 'DEPEN_MAESTROS',
            strSubGrupo: '',
        },
        response2 => {
            $('#dependenciaJerId').empty()
            if (response2.length > 1) {
                $('#dependenciaJerId').append('<option value="0">Seleccione</option>')
            }
            response2.forEach(element => {
                $('#dependenciaJerId').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })
        })

});
$('#btn-save-change-grupoliq').on('click', function () {
    validarSession()
    var tipoOperacion = 1;
    var grupoLiqId = $("#grupoLiqId").val()
    var titulo = ""
    if (grupoLiqId == "") {
        tipoOperacion = 1
        titulo = "Nuevo Grupo de Liquidación"
    } else {
        tipoOperacion = 2
        titulo = "Actualización de Grupo de Liquidación"
    }

    var activoId = $('#chk-activo-grupliq').is(':checked');//añadido 24.05.2021

    var codigoId = $('#codigoId').val()
    var descripcionId = $('#descripcionId').val()
    var planillaId = $('#planillaId').val()
    var periodoId = $('#periodoId').val()

    var dependenciaJerId = $('#dependenciaJerId').val()
    var unidadOrgId      = $('#unidadOrgId').val()






    if ($('#strGrupoLiqCampo1').val() == null) {
        var _camp1 = null;
    } else {
        var _camp1 = $('#strGrupoLiqCampo1').val();
    } if ($('#strGrupoLiqCampo2').val() == null) {
        var _camp2 = null;
    } else {
        var _camp2 = $('#strGrupoLiqCampo2').val();
    } if ($('#strGrupoLiqCampo3').val() == null) {
        var _camp3 = null;
    } else {
        var _camp3 = $('#strGrupoLiqCampo3').val();
    } if ($('#strGrupoLiqCampo4').val() == null) {
        var _camp4 = null;
    } else {
        var _camp4 = $('#strGrupoLiqCampo4').val();
    } if ($('#strGrupoLiqCampo5').val() == null) {
        var _camp5 = null;
    } else {
        var _camp5 = $('#strGrupoLiqCampo5').val();
    }



    if (dependenciaJerId == 0 || dependenciaJerId == undefined || dependenciaJerId == '') {
        messageResponseMix({ type: 'info', message: 'Seleccione una Dependecncia' }, titulo)//modificado 04/08/2021
        return;
    }

    if (unidadOrgId == 0 || unidadOrgId == undefined || unidadOrgId == '') {
        messageResponseMix({ type: 'info', message: 'Seleccione una Unidad Organizacional' }, titulo)//modificado 04/08/2021
        return;
    }

    if (codigoId == "") {
        messageResponseMix({ type: 'info', message: 'El Código es obligatorio' }, titulo)//modificado 04/08/2021
        return;
    }
    if (descripcionId == "") {
        messageResponseMix({ type: 'info', message: 'La descripción es obligatoria' }, titulo)//modificado 04/08/2021
        return;
    }
    if (planillaId == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione una planilla' }, titulo)//modificado 04/08/2021
        return;
    }
    if (periodoId == 0 ) {
        messageResponseMix({ type: 'info', message: 'Seleccione un periodo' }, titulo)//modificado 04/08/2021
        return;
    }



    var datosGrupoLiq = {
        intIdGrupoLiq: grupoLiqId
        , strCoGrupoLiq: codigoId
        , strDesGrupoLiq: descripcionId
        , intIdPeriodo: periodoId
        , strGrupoLiqCampo1: _camp1
        , strGrupoLiqCampo2: _camp2
        , strGrupoLiqCampo3: _camp3
        , strGrupoLiqCampo4: _camp4
        , strGrupoLiqCampo5: _camp5
        , bitFlActivo: activoId
    }

    console.log(datosGrupoLiq)
    console.log("tipoOP -> " + tipoOperacion)

    $.post(
        '/Proceso/IUGrupoLiq',
        {
            objDatos: datosGrupoLiq,
            intTipoOperacion: tipoOperacion
        },
        (response) => {
            if (response.type == 'success') {
                messageResponseMix({ type: response.type, message: response.message }, titulo)//modificado 04/08/2021
                $("#btn-cancel-grupoliq").click()
                getTableGrupoLiq();
                return;
            }
            else {
                var list = response.message.split("|")
                if (list.length = 2) {
                    var nomMantemiento = 'Grupo Liquidación';
                    var campo = list[1];
                    var msj = list[0];
                    var response = 'info';
                    var deta = 'notifry_error';
                    INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                } else {
                    messageResponseMix({ type: response.type, message: response.message }, titulo)//modificado 04/08/2021
                }
                return;
            }
        }
    );
});
$('#btn-cancel-grupoliq').on('click', function () {
    validarSession()
    $('.form-hide-grupoliq').hide();
});


$('#cboUniOrg').change(function () {
    validarSession()
    var intIdUniOrg = $(this).val()
    var intIdMenu = 0

    if (intIdUniOrg > 0) {
        $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
            {
                intIdMenu: 0, strEntidad: 'TGPLANILLAREGISTRO', intIdFiltroGrupo: intIdUniOrg, strGrupo: 'TGPLANILLAXUNIDAD', strSubGrupo: '',
            },
            response => {
                $('#cboPlanilla').empty()
                $('#cboPlanilla').append('<option value="0">Todos</option>')
                if (response.length > 0) {
                    response.forEach(element => {
                        $('#cboPlanilla').append('<option strCo="' + element.strextra1 + '" value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                    })
                    $("#cboPlanilla").attr("disabled", false)
                } else {
                    $("#cboPlanilla").attr("disabled", true)
                }
                getTableGrupoLiq()
            });

    } else {
        $('#cboPlanilla').empty()
        $('#cboPlanilla').append('<option value="0" selected>Seleccione una U.Org.</option>')
        $("#cboPlanilla").attr("disabled", true)
        $('#periodoFiltroId').empty()
        $('#periodoFiltroId').append('<option value="0" selected>Seleccione una Planilla</option>')
        $("#periodoFiltroId").attr("disabled", true)
        getTableGrupoLiq()
    }

})
$("#cboPlanilla").change(function () {
    validarSession()
    var intIdMenu = 0
    let id = $(this).val()
    if (id == '0') {
        $('#periodoFiltroId').empty()
        $('#periodoFiltroId').append('<option value="0">Seleccione una Planilla</option>')
        $("#periodoFiltroId").attr("disabled", true)
        getTableGrupoLiq()
    } else {
        $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
            {
                intIdMenu: 0, strEntidad: 'TGPERIODO', intIdFiltroGrupo: id, strGrupo: 'TGPERIODO', strSubGrupo: '',
            },
            response => {
                $('#periodoFiltroId').empty()

                if (response.length > 0) {
                    if (response.length > 1) { $('#periodoFiltroId').append('<option value="0">Todos</option>') }

                    response.forEach(element => {
                        $('#periodoFiltroId').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                    })
                    $("#periodoFiltroId").attr("disabled", false)
                } else {
                    $('#periodoFiltroId').append('<option value="0">Sin Periodos</option>')
                    $("#periodoFiltroId").attr("disabled", true)
                }
                getTableGrupoLiq()
            });
    }
})
$('#dependenciaJerId').change(function () {
    let idDependencia = $(this).val()
    if (idDependencia == '0') {
        $('#unidadOrgId').empty()
        $('#unidadOrgId').attr('disabled', true);
        //$('#unidadOrgId').append('<option value="0">Seleccione</option>')
    }
    else{
    $.post('/Organizacion/getUnidxJerarquia', { IntIdJerOrg: idDependencia }, response => {
        $('#unidadOrgId').empty()
        $('#unidadOrgId').attr('disabled',false);
        //$('#unidadOrgId').append('<option value="0">Seleccione</option>')
        response.forEach(element => {
            $('#unidadOrgId').append('<option value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>')
        })
    }).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText)
        })
    }
})
$('#unidadOrgId').change(function () {
    var intIdMenu = 0
    let idUnidad = $(this).val()
    if (idUnidad == '0') {
        $('#planillaId').empty()
        $('#planillaId').append('<option value="0">Seleccione</option>')
    }
    $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
        {
            intIdMenu: intIdMenu, strEntidad: 'TGPLANILLAREGISTRO', intIdFiltroGrupo: idUnidad, strGrupo: 'TGPLANILLAXUNIDAD', strSubGrupo: ''
        }, response => {
            $('#planillaId').empty()
            $('#planillaId').append('<option value="0">Seleccione</option>')
            response.forEach(element => {
                $('#planillaId').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
            })
        }).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText)
        })
})
$('#planillaId').change(function () {
    var intIdMenu = 0
    var intIdPlanilla = $("#planillaId").val()
    $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
        {
            intIdMenu: 0, strEntidad: 'TGPERIODO', intIdFiltroGrupo: intIdPlanilla, strGrupo: 'TGPERIODO', strSubGrupo: '',
        },
        response => {
            $('#periodoId').empty()
            $('#periodoId').append('<option value="0">Seleccione</option>')
            response.forEach(element => {
                $('#periodoId').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })
        });
})

$("#filtroActivo, #filtroGrupoLiq, #periodoFiltroId").change(function () {
    validarSession()
    getTableGrupoLiq()
})


