var _tableReporte;
var dataPersonal;
var dataPersonal_tmp;
var _listaPeriodo = [];
var _listaGrupoLiq = [];
var _listaConcepto = [];
var _listaConceptoND = [];//AÑADIDO 09.09.2021
var _planilla = "";
var ValidaAlisoft = "";
var caminoCheck = false;


function BotonesEnable(bool) {
    var codigo = $('#cboReporte').children("option:selected").attr('strCo')

    if (bool == true) {
        if (codigo != "R11" || codigo != "" || codigo != null) {
            $("#cboGenerar").attr("disabled", true)
            $("#btnExcel").attr("disabled", true)
            $("#btnPdf").attr("disabled", true)
        } else {
            $("#cboGenerar").attr("disabled", false)
            $("#btnExcel").attr("disabled", false)
            $("#btnPdf").attr("disabled", false)
        }
    } else {
        $("#cboGenerar").attr("disabled", false)
        $("#btnExcel").attr("disabled", false)
        $("#btnPdf").attr("disabled", false)
    }
}


function CombosPeriodo() {
    var intIdMenu = 0

        $.post(
        '/Reportes/GetReportes',
        {
           strGrupo: 'REPORTE'
        },
        response => {
            $('#cboReporte').empty()
            $('#cboReporte').append('<option value="0">Seleccione</option>')
            response.forEach(element => {
                if (element.ListHijos.length > 0) {
                    $('#cboReporte').append('<option class="optionGroup" strCo="' + element.strCoReporte + '" value="' + element.intIdReporte + '">' + element.strDesReporte + '</option>')

                    element.ListHijos.forEach(e => {
                        $('#cboReporte').append(`<option class="optionChild" strCo="${e.strCoReporte}" value="${e.intIdReporte}">&nbsp;&nbsp;&nbsp;&nbsp;&bull;${e.strDesReporte}</option>`)
                    })

                } else {
                    $('#cboReporte').append('<option class="optionGroup" strCo="' + element.strCoReporte + '" value="' + element.intIdReporte + '">' + element.strDesReporte + '</option>')
                }
            })
        });

    $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
        {
            intIdMenu:0, strEntidad: 'TGUNIDORG', intIdFiltroGrupo: 2, strGrupo: 'JERAR', strSubGrupo: 'REPORTE',
        },
        response => {
            $('#cboUniOrg').empty()
            $('#cboUniOrg').append('<option value="0">Seleccione</option>')
            response.forEach(element => {
                $('#cboUniOrg').append('<option ruc="' + element.strextra1+'" value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })

            $('#cboUniOrg').change(function () {
                validarSession()
                $("#cboGenerar").attr("disabled", true)
                var intIdUniOrg = $(this).val()

                if (intIdUniOrg != 0) {
                    $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
                        {
                            intIdMenu:0, strEntidad: 'TGPLANILLAREGISTRO', intIdFiltroGrupo: intIdUniOrg, strGrupo: 'TGPLANILLAXUNIDAD', strSubGrupo: '',
                        },
                        response => {
                            $('#cboPlanilla').empty()
                            $('#cboPlanilla').append('<option value="0">Seleccione</option>')
                            if (response.length > 0) {
                                response.forEach(element => {
                                    $('#cboPlanilla').append('<option strCo="' + element.strextra1 + '" value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                                })
                                $("#cboPlanilla").attr("disabled", false)
                            } else {
                                $("#cboPlanilla").attr("disabled", true)
                            }
                            getEmpleados();//AÑADIDO 17.09.2021
                            $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
                                {
                                    intIdMenu: 0, strEntidad: 'TGCATEGORIA', intIdFiltroGrupo: intIdUniOrg, strGrupo: 'TGCATEGORIA', strSubGrupo: '',
                                },
                                response => {
                                    $('#cboCategoria').empty()
                                    $('#cboCategoria').append('<option value="0">Seleccione</option>')
                                    if (response.length > 0) {
                                        response.forEach(element => {
                                            $('#cboCategoria').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                                        })
                                        $("#cboCategoria").attr("disabled", false)
                                    } else {
                                        $("#cboCategoria").attr("disabled", true)
                                    }

                                });

                        });


                    $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
                        {
                            intIdMenu: 0, strEntidad: 'TGMARCADOR', intIdFiltroGrupo: intIdUniOrg, strGrupo: 'TGMARCADOR', strSubGrupo: 'REPORTE',
                        },
                        response => {
                            $('#cboMarcador').empty()
                            $('#cboMarcador').append('<option value="0" selected>Todos</option>')
                            response.forEach(element => {
                                $('#cboMarcador').append(`<option value="${element.intidTipo}">${element.strDeTipo}</option>`)
                            })
                        })

                } else {
                    $('#cboPlanilla').empty()
                    $('#cboPlanilla').append('<option value="0">Seleccione una Unid. Org.</option>')
                    $("#cboPlanilla").attr("disabled", true)
                    $('#cboCategoria').empty()
                    $('#cboCategoria').append('<option value="0">Seleccione una Unid. Org.</option>')
                    $("#cboCategoria").attr("disabled", true)
                    $('#cboMarcador').empty()
                    $('#cboMarcador').append('<option value="0">Seleccione una Unid. Org.</option>')
                    getEmpleados();//AÑADIDO 17.09.2021
                }

            })

        });
}

function allConceptos(element) {
    if (element.checked) {
        $(".flatConcepto").prop('checked', true);
    } else {
        $(".flatConcepto").prop('checked', false);
        _listaConcepto = []
    }
}

function getIdPeriodo() {
    return _listaPeriodo.map(function (x) {
        return x.id;
    })
}

function CheckDetCal(intIdPer) {
    if (dataPersonal_tmp == null) {
        return false;
    }

    if ($('#Chck' + intIdPer + '').is(':checked') == true) {
        if (dataPersonal_tmp.find(e => e.intIdPersonal == intIdPer)) {
            let position = dataPersonal_tmp.findIndex(e => e.intIdPersonal == intIdPer);
            if (!isNaN(position)) {
                dataPersonal.push(dataPersonal_tmp[position]);
            }
        }
    } else if ($('#Chck' + intIdPer + '').is(':checked') == false) {
        if (dataPersonal.find(e => e.intIdPersonal == intIdPer)) {
            let position = dataPersonal.findIndex(e => e.intIdPersonal == intIdPer);
            if (!isNaN(position)) {
                dataPersonal.splice(position, 1);
            }

        }
    }
}

function limpiarOpciones() {
    $(".divFecha").hide()
    //$(".divEstadoActivo").hide()
    $(".divMarcas").hide()
    $(".divPeriodo").hide()
    $(".divanio").hide()
    $(".divGrafico").hide()
    $("#txtNomReporte").html("")
    $(".divConcepto").hide()
    $(".divMarcador").hide()
    $('#MsjList').html('<label>Seleccione al menos un Empleado antes Generar un reporte  </label>');
}


function exportExcelPdf(adicional) {
    validarSession()
    var titulo_ = 'Reportes' 
    var intIdReporte = $("#cboReporte").val()

    if (intIdReporte == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione un Tipo de Reporte' }, titulo_)
        return;
    }
    var codigo = $("#cboReporte option:selected").attr('strCo')
    var Name_ = $("#cboReporte option:selected").text().trim().replace('•', ''); //añadido 19.08.2021

    var filtrojer_ini = $('#filtroFecha').data('daterangepicker').startDate.format('DD/MM/YYYY') + ' 00:00:00'
    var filtrojer_fin = $('#filtroFecha').data('daterangepicker').endDate.format('DD/MM/YYYY') + ' 23:59:59'

    if (dataPersonal == undefined) {
        messageResponseMix({ type: 'info', message: 'Debe seleccionar al menos un empleado' }, titulo_)
        return;
    }
    if (dataPersonal.length == 0) {
        messageResponseMix({ type: 'info', message: 'Debe seleccionar al menos un empleado' }, titulo_)
        return;
    }

    var lista = []
    if (dataPersonal.length >= 0) {
        dataPersonal.forEach(element => {
            lista.push(element.intIdPersonal)
        });
    }
    var lista2 = []
    if (_listaConcepto.length >= 0) {
        _listaConcepto.forEach(element => {
            lista2.push(element)
        });
    }
    if (_listaConceptoND.length >= 0) { //AÑADIDO 09.09.2021
        _listaConceptoND.forEach(element => {
            lista2.push(element)
        });
    }

    var marca = false
    if ($('#chkMarcas').is(":checked")) {
        marca = true
    }


    $.post('/Reportes/llenarListaEmpleados',
        { lista, lista2 },
        function (response) {

            if (codigo == "R01") {

                window.open('/Rep/Vista/RepResOficial.aspx?planilla=' + _planilla + '&marca=' + marca + '&filtrojer_ini=' + filtrojer_ini + '&filtrojer_fin=' + filtrojer_fin + adicional, '');

            } else if (codigo == "R02") {

                var estado = $("#cboEstadoActivo").val()
                window.open('/Rep/Vista/RepResDiario.aspx?estado=' + estado + '&marca=' + marca + '&filtrojer_ini=' + filtrojer_ini + '&filtrojer_fin=' + filtrojer_fin + adicional, '');
            } else if (codigo == "R03") {

                if ($("#cboPeriodo").val() == 0) {
                    new PNotify({
                        title: 'Periodo',
                        text: 'Seleccionar un periodo',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    return;
                }

                var intPeriodo = parseInt($("#cboPeriodo").val())
                var fecIni = $("#cboPeriodo option:selected").attr("fecini")
                var fecFin = $("#cboPeriodo option:selected").attr("fecFin")
                window.open('/Rep/Vista/RepResTotal.aspx?intPeriodo=' + intPeriodo + '&fecIni=' + fecIni + '&fecFin=' + fecFin + adicional, '');
            } else if (codigo == "R04" || codigo == "R05" || codigo == "R06" || codigo == "R07") {
                if ($("#cboPeriodo").val() == 0) {
                    messageResponseMix({ type: 'info', message: 'Seleccione un periodo de pago' }, titulo_)
                    return;
                }
                if ($("#cboGrafico").val() == 0) {
                    messageResponseMix({ type: 'info', message: 'Elija un tipo de Récord' }, titulo_)
                    return;
                }

                var intPeriodo = parseInt($("#cboPeriodo").val())
                var tipo = parseInt($("#cboGrafico").val())
                var fecIni = $("#cboPeriodo option:selected").attr("fecini")
                var fecFin = $("#cboPeriodo option:selected").attr("fecFin")
                var fecha = '&fecIni=' + fecIni + '&fecFin=' + fecFin
                if (codigo == "R04") {
                    var desEmpresa = $("#cboPeriodo option:selected").html();
                    window.open('/Rep/Vista/RepRecordFaltas.aspx?intPeriodo=' + intPeriodo + fecha + '&desEmpresa=' + desEmpresa + '&tipo=' + tipo + adicional, '');
                } else if (codigo == "R05") {
                    var desEmpresa = $("#cboUniOrg option:selected").html();
                    var desPeriodo = $("#cboPeriodo option:selected").html();
                    var desRuc = $("#cboUniOrg option:selected").attr("ruc");
                    window.open('/Rep/Vista/RepRecordPuntualidad.aspx?intPeriodo=' + intPeriodo + fecha + '&desEmpresa=' + desEmpresa + '&desPeriodo=' + desPeriodo + '&ruc=' + desRuc + '&tipo=' + tipo + adicional, '');
                } else if (codigo == "R06") {
                    window.open('/Rep/Vista/RepRecordTardanza.aspx?intPeriodo=' + intPeriodo + fecha + '&tipo=' + tipo + adicional, '');
                } else if (codigo == "R07") {
                    var desEmpresa = $("#cboUniOrg option:selected").html();
                    var desPeriodo = $("#cboPeriodo option:selected").html();
                    var desRuc = $("#cboUniOrg option:selected").attr("ruc");
                    window.open('/Rep/Vista/RepRecordGeneral.aspx?intPeriodo=' + intPeriodo + fecha + '&desEmpresa=' + desEmpresa + '&desPeriodo=' + desPeriodo + '&ruc=' + desRuc + '&tipo=' + tipo + adicional, '');
                }

            } else if (codigo == "R08") {
                if (_listaConcepto.length == 0) {
                    messageResponseMix({ type: 'info', message: 'Seleccione al menos una Variable de Ausencia' }, titulo_)
                    return;
                }
                window.open('/Rep/Vista/RepResAusencia.aspx?filtrojer_ini=' + filtrojer_ini + '&filtrojer_fin=' + filtrojer_fin + adicional, '');

            } else if (codigo == "R09") {
                var intMarcador = $("#cboMarcador").val()
                window.open('/Rep/Vista/RepAsistencias.aspx?intMarcador=' + intMarcador + '&filtrojer_ini=' + filtrojer_ini + '&filtrojer_fin=' + filtrojer_fin + adicional, '');
            }
        });
}

$("#txtAnio").change(function () {
    validarSession()
    var txtAnio = $('#txtAnio')

    if (!txtAnio[0].validity.valid) {
        messageResponseMix({ type: 'info', message: 'Seleccione un año valido' }, 'Reportes')
        $("#txtAnio").val("")
        return;
    }

    var intAnio = parseInt(txtAnio.val())
    var intIdPlanilla = $("#cboPlanilla").val()

    $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
        {
            intIdMenu: 0, strEntidad: 'TGPERIODO', intIdFiltroGrupo: intAnio, strGrupo: 'TGPERIODOXANIO', strSubGrupo: intIdPlanilla,
        },
        response => {
            $('#cboPeriodo').empty()
            $('#cboPeriodo').append('<option value="0">Seleccione</option>')
            response.forEach(element => {
                $('#cboPeriodo').append(`<option fecIni="${element.strextra1}" fecFin="${element.strextra2}" value="${element.intidTipo}">${element.strDeTipo}</option>`)
            })
        });
    
})

$("#cboCategoria").change(function () {
    var cboPlanilla = $("#cboPlanilla").val()
    if (cboPlanilla == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione una planilla' }, "Listado de Empleados")
        return;
    }
    validarSession()
    getEmpleados()
})

$("#filtroCalculo").change(function () {
    var cboUniOrg = $("#cboUniOrg").val()
    var cboPlanilla = $("#cboPlanilla").val()
    if (cboUniOrg == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione una Und. Organizacional' }, "Listado de Empleados")
        return;
    }

    if (cboPlanilla == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione una planilla' }, "Listado de Empleados")
        return;
    }
    validarSession()
    getEmpleados();
})

$('#cboPlanilla').on('change', function () {
    validarSession()
    var id = $('#cboPlanilla option:selected').val();
    _planilla = $('#cboPlanilla option:selected').html();
    $('#GrupoLiqui').attr('disabled', true);
    BotonesEnable(true); //añadido 09/06/2021
    $("#periodosCalculados").html('')
    if (id == 0) {
        $('#Periodo_Pago').attr('disabled', true);
        $('.btnPeriodo').attr('disabled', true);
        getEmpleados();//AÑADIDO 17.09.2021
        return;
    } else {
        $('#Periodo_Pago').attr('disabled', false);
        $('.btnPeriodo').attr('disabled', false);
        $("#btnCalcular").attr('disabled', true);
        dataPersonal = []
    }

    $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
        { intIdMenu: 0, strEntidad: 'TGGRUPOLIQPLANILLA', intIdFiltroGrupo: id, strGrupo: 'TGGRUPOLIQPLANILLA', strSubGrupo: '' },
        (response) => {
            $('#chekeameGruposLiquidacion').empty();
            if (response.length > 0) {
                response.forEach(element => {
                    $('#chekeameGruposLiquidacion').append(`<li role="presentation" ><label>` +
                        '&nbsp;<input id="' + element.intidTipo + '"type="checkbox" class= "flat" name="restore">&nbsp;' + element.strDeTipo +
                        '</label></li >');
                    //init_checkBox_styles();
                });
                $("#GrupoLiqui").attr('disabled', false)
            } else {
                $("#GrupoLiqui").attr('disabled', true)
            }


            $("input.flat").click(function () {
                validarSession()
                _listaGrupoLiq = []
                $("#chekeameGruposLiquidacion input.flat:checked").each(function (index) {
                    _listaGrupoLiq.push(parseInt($(this).attr('id')));
                });
                getEmpleados();
            });
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

    getEmpleados();
});

$(".columnHide").click(function () {
    var index = $(this)[0].id;
    if (typeof _tableReporte !== 'undefined') {
        var column = _tableReporte.column(index);

        // Toggle the visibility
        column.visible(!column.visible());
    }
})

$("#chkCesado").click(function () {
    var cboUniOrg = $("#cboUniOrg").val()
    var cboPlanilla = $("#cboPlanilla").val()
    if (cboUniOrg == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione una Und. Organizacional' }, "Listado de Empleados")
        return;
    }

    if (cboPlanilla == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione una planilla' }, "Listado de Empleados")
        return;
    }
    validarSession()
    getEmpleados()
})

$("#cboEstadoActivo").change(function () {
    var cboUniOrg = $("#cboUniOrg").val()
    var cboPlanilla = $("#cboPlanilla").val()
    if (cboUniOrg == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione una Und. Organizacional' }, "Listado de Empleados")
        return;
    }

    if (cboPlanilla == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione una planilla' }, "Listado de Empleados")
        return;
    }
    validarSession()
    getEmpleados()
})

$("#cboReporte").change(function () {
    validarSession()
    if ($(this).val() == 0) {
        limpiarOpciones()
    } else {
        limpiarOpciones()
        var codigo = $(this).children("option:selected").attr('strCo')
        BotonesEnable(false); //añadido 09/06/2021

        $("#txtNomReporte").html($(this).children("option:selected").html())
        if (codigo == "R01") {
            $(".divFecha").show()
            $(".divMarcas").show()
            $("#chkMarcas").prop('checked', false)
        } else if (codigo == "R02") {
            $(".divFecha").show()
            //$(".divEstadoActivo").show()
            $(".divMarcas").show()
            $("#chkMarcas").prop('checked', false)
        } else if (codigo == "R03") {
            $("#txtAnio").val(moment().format('YYYY'))
            $(".divPeriodo").show()
            $(".divanio").show()
            let intIdPlanilla = $("#cboPlanilla").val()
            $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
                {
                    intIdMenu: 0, strEntidad: 'TGPERIODO', intIdFiltroGrupo: moment().format('YYYY'), strGrupo: 'TGPERIODOXANIO', strSubGrupo: intIdPlanilla,
                },
                response => {
                    $('#cboPeriodo').empty()
                    $('#cboPeriodo').append('<option value="0">Seleccione</option>')
                    response.forEach(element => {
                        $('#cboPeriodo').append(`<option fecIni="${element.strextra1}" fecFin="${element.strextra2}" value="${element.intidTipo}">${element.strDeTipo}</option>`)
                    })
                });

        } else if (codigo == "R04" || codigo == "R05" || codigo == "R06" || codigo == "R07") {
            $("#txtAnio").val(moment().format('YYYY'))
            $(".divPeriodo").show()
            $(".divanio").show()
            $(".divGrafico").show()
            $('#cboPeriodo').empty()
            let intIdPlanilla = $("#cboPlanilla").val()
            $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
                {
                    intIdMenu: 0, strEntidad: 'TGPERIODO', intIdFiltroGrupo: moment().format('YYYY'), strGrupo: 'TGPERIODOXANIO', strSubGrupo: intIdPlanilla,
                },
                response => {
                    $('#cboPeriodo').empty()
                    $('#cboPeriodo').append('<option value="0">Seleccione</option>')
                    response.forEach(element => {
                        $('#cboPeriodo').append(`<option fecIni="${element.strextra1}" fecFin="${element.strextra2}" value="${element.intidTipo}">${element.strDeTipo}</option>`)
                    })
                });
        } else if (codigo == "R08") {
            $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
                {
                    intIdMenu: 0, strEntidad: 'TGCONCEPTO', intIdFiltroGrupo: 2, strGrupo: 'REPORTE', strSubGrupo: 'REPORTE',
                },
                response => {
                    _listaConcepto = []
                    $('#chekeameConcepto').empty();
                    $('#chekeameConcepto').append(`<li role="presentation"><label>` +
                        '&nbsp;<input type="checkbox" id="allConceptos" name="restore">&nbsp;Todos</label></li >');
                    if (response.length > 0) {
                        response.forEach(element => {
                            $('#chekeameConcepto').append(`<li role="presentation" ><label>` +
                                '&nbsp;<input id="' + element.intidTipo + '"type="checkbox" class= "flatConcepto" name="restore">&nbsp;' + element.strDeTipo +
                                '</label></li >');
                            //init_checkBox_styles();
                        });
                        $("#Concepto").attr('disabled', false)
                    } else {
                        $("#Concepto").attr('disabled', true)
                    }


                    $("input.flatConcepto").click(function () {
                        validarSession()
                        _listaConcepto = []
                        $("#chekeameConcepto input.flatConcepto:checked").each(function (index) {
                            _listaConcepto.push(parseInt($(this).attr('id')));
                        });
                        //getEmpleados();
                    });

                    $('#allConceptos').on('change', function () {
                        _listaConcepto = []
                        if ($('#allConceptos').is(':checked')) {
                            $(".flatConcepto").each(function (index) {
                                _listaConcepto.push(parseInt($(this).attr('id')));
                            });
                            $(".flatConcepto").prop('checked', true);
                        } else {
                            $(".flatConcepto").prop('checked', false);
                        }

                    });
                    $(".divFecha").show()
                    $(".divConcepto").show();
                });
        } else if (codigo == "R09") {
            var intidUniOrg = $("#cboUniOrg").val()
            $.post('/Personal/ListarCombos',  //{'/Proceso/ListarCombosProceso'
                {
                    intIdMenu: 0, strEntidad: 'TGMARCADOR', intIdFiltroGrupo: intidUniOrg, strGrupo: 'TGMARCADOR', strSubGrupo: 'REPORTE',
                },
                response => {
                    $('#cboMarcador').empty()
                    $('#cboMarcador').append('<option value="0" selected>Todos</option>')
                    response.forEach(element => {
                        $('#cboMarcador').append(`<option value="${element.intidTipo}">${element.strDeTipo}</option>`)
                    })
                })
            $(".divMarcador").show()
            $(".divFecha").show()
        }
        
    }
})

function getEmpleados() {
    var cboUniOrg = $("#cboUniOrg").val()
    var cboPlanilla = $("#cboPlanilla").val()
    var titulo_ = 'Reportes'
    //if (cboUniOrg == 0) {
    //    messageResponseMix({ type: 'info', message: 'Seleccione una Und. Organizacional' }, titulo_)
    //    return;
    //}

    //if (cboPlanilla == 0) {
    //    messageResponseMix({ type: 'info', message: 'Seleccione una planilla' }, titulo_)
    //    return;
    //}

    var filtroCalculo = $("#filtroCalculo").val()
    var cboCategoria = $("#cboCategoria").val()
    var estado = $("#cboEstadoActivo").val()
    var cesado = false
    if ($('#chkCesado').is(":checked")) {
        cesado = true
    }

    $.ajax({
        url: '/Reportes/ConsultaReporte',
        type: 'POST',
        data: {
            cboUniOrg, filtroCalculo, cboPlanilla, cboCategoria, cesado, estado, listGrupoLiq: _listaGrupoLiq
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
                message: 'Cargando...'
            });
        },
        success: function (response) {
            console.log(response)
            dataPersonal = []
            dataPersonal_tmp = response
            planilla = $('#cboPlanilla option:selected').html()
            $("#cboGenerar").attr("disabled", false)

            if ($.fn.dataTable.isDataTable('#TablaReporte')) {
                _tableReporte.destroy();
            }

            _tableReporte = $('#TablaReporte').DataTable({
                data: response,
                columns: [
                    {
                        sortable: false,
                        "render": (data, type, item, meta) => {
                            let intIdPersonal = item.intIdPersonal;
                            return `<input type="checkbox" class="HorInd"  id="Chck${intIdPersonal}" data_intIdPers="${intIdPersonal}"  onChange="CheckDetCal(${intIdPersonal})"/>`;
                        }
                    },
                    { data: 'strCoReg' },
                    { data: 'strNomCompleto' },
                    { data: 'strNumDoc' },
                    { data: 'strFotocheck' },
                    { data: 'strDesPlani' },
                    { data: 'strDesUniOrg' },
                    { data: 'strDesFis' },
                    { data: 'strDesGrupoLiq' },
                    { data: 'dttFecCese' },
                ],
                lengthMenu: [10, 25, 50],
                order: [],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [
                    {
                        targets: [0],
                        data: null,
                        defaultContent: '',
                        orderable: false,
                        className: 'select-checkbox'
                    },
                    {
                        targets: [4],//3
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [5],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [6],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [8],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [9],
                        visible: false,
                        searchable: false
                    }
                ],
                dom: 'lBfrtip',
            });

            $(".columnHide").prop("checked", false)
            $("#All_Calcular").iCheck('uncheck');
        },
        complete: function () {
            $.unblockUI();
        }

    });
}

$('#All_Calcular').on('change', function () {
    var allPagesCal = _tableReporte.cells().nodes();

    if ($('#All_Calcular').is(':checked')) {
        dataPersonal_tmp.forEach(e => {
            dataPersonal.push(e)
        })
        //$(allPages).find('input[type="checkbox"]').iCheck('check');
        $(allPagesCal).find('input[type="checkbox"]').prop('checked', true);
    } else {
        dataPersonal = []
        //$(allPages).find('input[type="checkbox"]').iCheck('uncheck');
        $(allPagesCal).find('input[type="checkbox"]').prop('checked', false);

    }

});

$(document).ready(function () {

    CombosPeriodo()

    _tableReporte = $('#TablaReporte').DataTable({
        data: {},
        columns: [
            {
                sortable: false,
                "render": (data, type, item, meta) => {
                    let intIdPersonal = item.intIdPersonal;
                    return `<input type="checkbox" class="HorInd"  id="Chck${intIdPersonal}" data_intIdPers="${intIdPersonal}"  onChange="CheckDetCal(${intIdPersonal})"/>`;
                }
            },
            { data: 'strFotocheck' },
            { data: 'strNomCompleto' },
            { data: 'strNumDoc' },
            { data: 'strCoReg' },
            { data: 'strDesPlani' },
            { data: 'strDesUniOrg' },
            { data: 'strDesFis' },
            { data: 'strDesGrupoLiq' },
            { data: 'dttFecCese' },
        ],
        lengthMenu: [10, 25, 50],
        order: [],
        responsive: true,
        language: _datatableLanguaje,
        columnDefs: [
            {
                targets: [0],
                data: null,
                defaultContent: '',
                orderable: false,
                className: 'select-checkbox'
            },
            {
                targets: [3],
                visible: false,
                searchable: false
            },
            {
                targets: [5],
                visible: false,
                searchable: false
            },
            {
                targets: [6],
                visible: false,
                searchable: false
            },
            {
                targets: [8],
                visible: false,
                searchable: false
            },
            {
                targets: [9],
                visible: false,
                searchable: false
            }
        ],
        dom: 'lBfrtip',
    });
    $('#MsjList').html('<label>Seleccione al menos un Empleado antes Generar un reporte  </label>');
})

$("#cboGenerar").click(function () {
    var desRuc = $("#cboUniOrg option:selected").attr("ruc");
    if (desRuc != "") {
        exportExcelPdf("")
    } else {
        messageResponseMix({ type: 'info', message: 'Registre el RUC de la Empresa seleccionada antes de Generar Reporte' }, 'Unid. Organizacional sin RUC')
        return;
    }

})

$("#btnExcel").click(function () {
    var desRuc = $("#cboUniOrg option:selected").attr("ruc");
    if (desRuc != "") {
        exportExcelPdf("&excel=1")
    } else {
        messageResponseMix({ type: 'info', message: 'Registre el RUC de la Empresa seleccionada antes de Exportar Excel' }, 'Unid. Organizacional sin RUC')
        return;
    }
})

$("#btnPdf").click(function () {
    var desRuc = $("#cboUniOrg option:selected").attr("ruc");
    if (desRuc != "") {
        exportExcelPdf("&pdf=1")
    } else {
        messageResponseMix({ type: 'info', message: 'Registre el RUC de la Empresa seleccionada antes de Exportar PDF' }, 'Unid. Organizacional sin RUC')
        return;
    }
})
