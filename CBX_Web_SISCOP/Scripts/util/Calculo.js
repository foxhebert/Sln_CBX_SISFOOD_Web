var _listaPeriodo = [];
var _listaGrupoLiq = [];
var _tableCalculoManual;
var _tablePeriodo;
var dataPeriodo = [];
var dataPeriodo_tmp = [];
var dataPersonal = [];
var dataPersonal_tmp = [];
var bitCerrado = false;
var flagCancelar = false;
var flagError = false;
var intIdProc = 0;
var strPeriodo = "";
var procesados_cant = 0;

var secondsToTime = function (s) {

function addZ(n) {
    return (n < 10 ? '0' : '') + n;
}

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return addZ(hrs) + 'h:' + addZ(mins) + ':m' + addZ(secs) + 's';
}

$(".columnHide").click(function () {
    var index = $(this)[0].id;
    if (typeof _tableCalculoManual !== 'undefined') {
        var column = _tableCalculoManual.column(index);

        // Toggle the visibility
        column.visible(!column.visible());
    }
})

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

function CheckDetPer(intIdPer) {
    if (dataPeriodo_tmp == null) {
        return false;
    }

    if ($('#Chck' + intIdPer + '').is(':checked') == true) {
        if (dataPeriodo_tmp.find(e => e.intIdPeriodo == intIdPer)) {
            let position = dataPeriodo_tmp.findIndex(e => e.intIdPeriodo == intIdPer);
            if (!isNaN(position)) {
                dataPeriodo.push(dataPeriodo_tmp[position]);
            }
        }
    } else if ($('#Chck' + intIdPer + '').is(':checked') == false) {
        if (dataPeriodo.find(e => e.intIdPeriodo == intIdPer)) {
            let position = dataPeriodo.findIndex(e => e.intIdPeriodo == intIdPer);
            if (!isNaN(position)) {
                dataPeriodo.splice(position, 1);
            }

        }
    }
}

function getCalculo() {

    validarSession()

    var intIdPlanilla = $('#cboPlanilla').val();
    var strFiltroCalculo = $("#buscarId").val();

    $.ajax({
        url: '/Proceso/GetListaPersonal',
        type: 'POST',
        data:
        {
            intIdPlanilla,
            strFiltroCalculo,
            listaGrupoLiq: _listaGrupoLiq
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
            $("#All_Calcular").prop('checked', false)
            dataPersonal_tmp = response
            $("#seleccionados").html("0")
            $("#total").html(dataPersonal_tmp.length)

            if ($.fn.dataTable.isDataTable('#TablaCalculo')) {
                _tableCalculoManual.destroy();
            }
                
            _tableCalculoManual = $('#TablaCalculo').DataTable({
                data: response,
                columns: [
                    {
                        sortable: false,
                        "render": (data, type, item, meta) => {
                            let intIdPersonal = item.intIdPersonal;  
                            return `<input type="checkbox" class="HorInd"  id="Chck${intIdPersonal}" data_intIdPers="${intIdPersonal}"  onChange="CheckDetCal(${intIdPersonal})"/>`;
                        }

                    },
                    { data: 'strCoPersonal' },
                    { data: 'strNomCompleto' },
                    { data: 'strNumDoc' },
                    { data: 'strFotocheck' },
                    { data: 'strDescripcion' },
                    { data: 'strDeTipo' },
                    { data: 'strDesGrupoLiq' },
                    { data: 'dttFecAdmin' },
                    { data: 'dttFecCese' },
                    {
                        sortable: false,
                        "render": (data, type, item, meta) => {
                            return ``;
                        }
                    },
                    { data: 'intDiasTrabajados' },
                    { data: 'intDiasFaltas' },
                    { data: 'intHorasAdicionales' },
                    { data: 'intFeriados' },
                    { data: 'intHorasFuera' },
                    { data: 'intTardanza' }
                ],
                lengthMenu: [10, 25, 50],
                order: [],
                responsive: true,
                language: {
                    lengthMenu: 'Mostrar _MENU_ Empleados',
                    info: 'Mostrar _START_ a _END_ de _TOTAL_ Empleados',
                    infoEmpty: 'No hay Empleados para mostrar',
                    search: 'Buscar: ',
                    sSearchPlaceholder: 'Criterio de búsqueda',
                    zeroRecords: 'No se encontraron registros coincidentes',
                    infoFiltered: '(Filtrado de _MAX_  Empleados en total)',
                    paginate: {
                        previous: 'Anterior',
                        next: 'Siguiente'
                    }
                },
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
                        targets: [4],
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
                        targets: [7],
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

            var allPagesCal = _tableCalculoManual.cells().nodes();

            $('#All_Calcular').on('change', function () {

                if ($('#All_Calcular').is(':checked')) {

                    dataPersonal = Array.from(dataPersonal_tmp)
                    //$(allPages).find('input[type="checkbox"]').iCheck('check');
                    $(allPagesCal).find('input[type="checkbox"]').prop('checked', true);
                } else {
                    dataPersonal = []
                    //$(allPages).find('input[type="checkbox"]').iCheck('uncheck');
                    $(allPagesCal).find('input[type="checkbox"]').prop('checked', false);

                }
                $("#seleccionados").html(dataPersonal.length)
            });
            $(".columnHide").prop("checked", false)
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

$(document).on('keyup', "#TablaCalculo_filter input", function (event) {
    validarSession()

    let texto = $(this).val()
    let selectFilter = _tableCalculoManual.rows({ search: 'applied' }).nodes().to$().find('input:checked').length
    if (!texto == "") {
        let totalFilter = _tableCalculoManual.rows({ order: 'index', search: 'applied' }).nodes().length
        $("#seleccionados").html(selectFilter)
        $("#total").html(totalFilter)
    } else {
        $("#seleccionados").html(selectFilter)
        $("#total").html(_tableCalculoManual.data().count())
    }

});

function calcularPeriodos() {
    _listaPeriodo.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.date) - new Date(b.date);
    }).reverse();
}

function CombosCalculo() {
    var intIdMenu = 0

    $.post(
        '/Proceso/ListarCombosProceso',
        {
            intIdMenu, strEntidad: 'TGUNIDORG', intIdFiltroGrupo: 2, strGrupo: 'JERAR', strSubGrupo: 'REPORTE',
        },
        response => {
            $('#cboUniOrg').empty()
            $('#cboUniOrg').append('<option value="0">Seleccione</option>')
            response.forEach(element => {
                $('#cboUniOrg').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })

            $('#cboUniOrg').change(function () {
                validarSession()
                var intIdUniOrg = $(this).val()
                if (intIdUniOrg != 0) {
                    $.post(
                        '/Proceso/ListarCombosProceso',
                        {
                            intIdMenu, strEntidad: 'TGPLANILLAREGISTRO', intIdFiltroGrupo: intIdUniOrg, strGrupo: 'TGPLANILLAXUNIDAD', strSubGrupo: '',
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

                        });

                }
            })

        });

    $.post(
        '/Proceso/ListarCombosProceso',
        {
            intIdMenu, strEntidad: 'TGPLANILLA', intIdFiltroGrupo: 0, strGrupo: 'TGPLANILLA', strSubGrupo: '',
        },
        response => {
            $('#cboPlanilla').empty()
            $('#cboPlanilla').append('<option value="0">Seleccione</option>')
            response.forEach(element => {
                $('#cboPlanilla').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })
        });

}

$('#cboPlanilla').on('change', function () {
    validarSession()

    var id = $('#cboPlanilla option:selected').val();
    $('#GrupoLiqui').attr('disabled', true);
    $("#periodosCalculados").html('')
    $("#periodosSeleccionados").html(0)
    if (id == 0 || !id) {
        $('#Periodo_Pago').attr('disabled', true);
        $('.btnPeriodo').attr('disabled', true);
        return;
    } else {
        $('#Periodo_Pago').attr('disabled', false);
        $('.btnPeriodo').attr('disabled', false);
        $("#btnCalcular").attr('disabled', true);
        dataPersonal = []
    }
    getCalculo()
    $.post(
        '/Proceso/ListarCombosProceso',
        { intIdMenu: 0, strEntidad: 'TGPERIODO', intIdFiltroGrupo: id, strGrupo: 'TGPERIODOXPLANILLA', strSubGrupo: '' },
        (response) => {
            $('#chekeamePeriodos').empty();
            if (response.length > 0) {
                response.forEach(element => {
                    $('#chekeamePeriodos').append(`<li role="presentation" ><label>` +
                        '&nbsp;<input nombre="' + element.strextra2 + '" fecha="' + element.strextra1 + '" id="' + element.intidTipo + '"type="checkbox" class= "flat" name="restore">&nbsp;' + element.strDeTipo +
                        '</label></li >');
                });
            } else {
                $("#Periodo_Pago").attr('disabled', true)
            }


            $("input.flat").on("click",function () {
                _listaPeriodo = [];
                if (_listaGrupoLiq.length > 0) {
                    _listaGrupoLiq = [];
                    getCalculo()
                }
                $("#chekeamePeriodos input.flat:checked").each(function (index) {
                    _listaPeriodo.push({ "id": parseInt($(this).attr('id')), "fecha": $(this).attr('fecha'), "nombre": $(this).attr('nombre')});
                });

                if (_listaPeriodo.length > 0) {
                    $.post(
                        '/Proceso/ListarGrupoLiqxPeriodo',
                        {
                            listaPeriodo: getIdPeriodo()
                        },
                        response2 => {
                            $('#chekeameGruposLiquidacion').empty()

                            if (response2.length == 0) {
                                $('#GrupoLiqui').attr('disabled', true);
                            } else {
                                response2.forEach(element => {
                                    $('#chekeameGruposLiquidacion').append(`<li role="presentation" ><label>` +
                                        '&nbsp;<input id="' + element.intIdGrupoLiq + '"type="checkbox" class="grupoLiqFlat" name="restore">&nbsp;' + element.strDesGrupoLiq +
                                        '</label></li >');
                                });
                                $('#GrupoLiqui').attr('disabled', false);

                                $("input.grupoLiqFlat").on("click", function () {
                                    validarSession()
                                    _listaGrupoLiq = [];
                                    dataPersonal=[]
                                    $("#chekeameGruposLiquidacion input.grupoLiqFlat:checked").each(function (index) {
                                        _listaGrupoLiq.push(parseInt($(this).attr('id')));
                                    });
                                    getCalculo()
                                })
                            }
                        });
                    $("#btnCalcular").attr('disabled', false);
                    $("#btnExportarReporte").attr('disabled', false);
                } else {
                    $('#chekeameGruposLiquidacion').empty()
                    $('#GrupoLiqui').attr('disabled', true);
                    $("#btnCalcular").attr('disabled', true);
                    $("#btnExportarReporte").attr('disabled', true);
                }
            });
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
        });
});

$("#buscarId").change(function () {
    validarSession()
    getCalculo()
})

function habilitarFiltros(){
    $("#cboPlanilla").attr('disabled', false);
    $('#Periodo_Pago').attr('disabled', false);
    //$('#GrupoLiqui').attr('disabled', false);
    $('#buscarId').attr('disabled', false);
    $(".btnCalculo").attr('disabled', false);
    $("#btnCalcular").attr('disabled', false);
}

$("#btnCalcular").click(function () {
    validarSession()
    var listPer = []
    dataPersonal.forEach(element => {
        listPer.push(element.intIdPersonal)
    });

    if (listPer.length == 0) {
        new PNotify({
            title: 'Cálculo Manual',
            text: 'Debe seleccionar al menos un Empleado',
            type: 'info',
            delay: 1000,
            styling: 'bootstrap3'
        });
        return;
    }

    $("#cboPlanilla").attr('disabled', true);
    $('#Periodo_Pago').attr('disabled', true);
    //$('#GrupoLiqui').attr('disabled', true);
    $('#buscarId').attr('disabled', true);
    $(".btnCalculo").attr('disabled', true);
    $("#btnCalcular").attr('disabled', true);
    $("#tiempo").html("--:--:--")

    var intIdPlanilla = $('#cboPlanilla option:selected').val();
    intIdProc = Math.floor((Math.random() * 9999) + 1);

    $("#loadingModal").modal({ backdrop: 'static', keyboard: false })  

    $("#tituloLoading").html($('#cboPlanilla option:selected').html())

    $('#loadingModal').on('hidden.bs.modal', function () {
        habilitarFiltros()
    });

    $("#cancelar").click(function () {
        flagCancelar = true;
    })

    var ajaxTime = new Date().getTime();

    calcularPeriodos()
    procesados_cant = 0;
    periodoTotal = _listaPeriodo.length;
    periodoIndex = 0

    $("#procesados").html("0/"+periodoTotal)

    function procesoCalcular(index) {
        $.ajax({
            type: "POST",
            url: "/Proceso/Calcular",
            //async: false,
            data: {
                intIdPeriodos: _listaPeriodo[index].id,
                listPersonal: listPer,
                intIdPlanilla: intIdPlanilla,
                intIdProc
            },
            beforeSend: function (response) {
                if (index == 0) {
                    $("#cancelar").attr('disabled', false) 
                    $("#message").html('')
                    $("#message").append('Se inició el proceso de cálculo de la planilla.')
                    $("#progresLoader").html("5%")
                    $("#progresLoader").width("5%")
                    $("#progresLoader").addClass('active')
                    $("#send").attr('disabled', true)
                    $("#btnExcelLoading").attr('disabled', true)
                    $("#grabar").hide()
                    flagCancelar = false
                    flagError = false
                    strPeriodo = ''
                }
                $("#message").append('\nSe inició el proceso de cálculo del periodo ' + (index+1) + ' : ' + $("#chekeamePeriodos input.flat#" + _listaPeriodo[index].id)[0].nextSibling.data+'.')
            },
            success: function (response) {
                if (response.type == 'success') {
                    periodoIndex++;
                    $("#procesados").html(periodoIndex + "/" + periodoTotal)
                    var cantidad = 0;
                    if (response.extramsg != "error") {
                        cantidad = parseInt(response.extramsg)
                    }
                    procesados_cant += cantidad;
                    $("#message").append('\nFinalizó el proceso de cálculo del periodo ' + (index + 1) + ' : ' + $("#chekeamePeriodos input.flat#" + _listaPeriodo[index].id)[0].nextSibling.data + ' .')
                    $("#message").append('\nTotal a procesar: ' + listPer.length + ' empleados.')
                    $("#message").append('\nProcesados correctamente: ' + response.extramsg + ' empleados.')
                    
                } else {
                    $("#message").append('\nOcurrio un error al realizar el cálculo, vuelva a intentarlo.')
                    flagError = true
                }
            },
            complete: function (response) {
                if (flagCancelar) {
                    $("#loadingModal").modal('hide')
                    strPeriodo = ''
                } else {
                    var porcentaje = Math.round(((index + 1) * 100) / _listaPeriodo.length, 2);
                    $("#progresLoader").html(porcentaje + "%")
                    $("#progresLoader").width(porcentaje + "%")
                    strPeriodo += $("#chekeamePeriodos input.flat#" + _listaPeriodo[index].id)[0].nextSibling.data + ', '
                    index++;
                    if (index < _listaPeriodo.length) {
                        procesoCalcular(index)
                    } else {
                        var totalTime = secondsToTime(new Date().getTime() - ajaxTime);
                        $("#tiempo").html(totalTime)
                        $("#btnExcelLoading").attr("intIdProc", intIdProc)
                        $("#message").append('\nEl proceso de cálculo de la planilla ha finalizado.')
                        $("#progresLoader").removeClass('active')
                        $("#send").attr('disabled', false)
                        $("#btnExcelLoading").attr('disabled', false)
                        $("#grabar").show()
                        $("#cancelar").attr('disabled', true)                        
                    }
                }
                //if (procesados_cant == 0) {
                //    $("#message").append('\nImportante: revisar horario y regla de negocio asignada a los empleados.')
                //    strPeriodo = ''
                //    $("#grabar").hide()
                //}
                if (flagError) {
                    strPeriodo = ''
                    $("#grabar").hide()
                }
            }
        });
    }

    procesoCalcular(0);
})

$(document).on('change', '#chekeamePeriodos .flat', function (event) {
    validarSession()
    $("#periodosSeleccionados").html($("#chekeamePeriodos .flat:checked").length)
})

$("#grabar").click(function () {
    validarSession()
    $("#loadingModal").modal('hide')
    var strFiltroCalculo = $("#buscarId").val();
    var intIdPlanilla = $("#cboPlanilla").val()
    $.ajax({
        type: "POST",
        url: "/Proceso/GuardarCalculo",
        data: { intIdProceso: intIdProc, strFiltroCalculo: strFiltroCalculo, intIdPlanilla: intIdPlanilla, listaGrupoLiq: _listaGrupoLiq },
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
                message: 'Grabando...'
            });
        },
        success: function (response) {
            new PNotify({
                title: 'Cálculo Manual',
                text: response.message,
                type: response.type,
                delay: 1000,
                styling: 'bootstrap3'
            });
            habilitarFiltros()
            $("#periodosCalculados").html(strPeriodo.slice(0, -2))
            if ($.fn.dataTable.isDataTable('#TablaCalculo')) {
                _tableCalculoManual.destroy();
            }

            _tableCalculoManual = $('#TablaCalculo').DataTable({
                data: response.objeto,
                columns: [
                    {
                        sortable: false,
                        "render": (data, type, item, meta) => {
                            let intIdPersonal = item.intIdPersonal;
                            let active = item.intDiasTrabajados == "" ? "" : "checked"

                            return `<input ${active} type="checkbox" class="HorInd"  id="Chck${intIdPersonal}" data_intIdPers="${intIdPersonal}"  onChange="CheckDetCal(${intIdPersonal})"/>`;

                        }

                    },
                    { data: 'strCoPersonal' },
                    { data: 'strNomCompleto' },
                    { data: 'strNumDoc' },
                    { data: 'strFotocheck' },
                    { data: 'strDescripcion' },
                    { data: 'strDeTipo' },
                    { data: 'strDesGrupoLiq' },
                    { data: 'dttFecAdmin' },
                    { data: 'dttFecCese' },
                    {
                        sortable: false,
                        "render": (data, type, item, meta) => {
                            let span = item.intDiasTrabajados == "" ? "" : `<span class="label label-success" style="font-size: small;">Correcto</span>`
                            return span;
                        }
                    },
                    { data: 'intDiasTrabajados' },
                    { data: 'intDiasFaltas' },
                    { data: 'intHorasAdicionales' },
                    { data: 'intFeriados' },
                    { data: 'intHorasFuera' },
                    { data: 'intTardanza' }
                ],
                lengthMenu: [10, 25, 50],
                //order: [],
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
                        targets: [4],
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
                        targets: [7],
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

            var allPagesCal = _tableCalculoManual.cells().nodes();

            $('#All_Calcular').on('change', function () {

                if ($('#All_Calcular').is(':checked')) {

                    dataPersonal = Array.from(dataPersonal_tmp)
                    //$(allPages).find('input[type="checkbox"]').iCheck('check');
                    $(allPagesCal).find('input[type="checkbox"]').prop('checked', true);
                } else {
                    dataPersonal = []
                    //$(allPages).find('input[type="checkbox"]').iCheck('uncheck');
                    $(allPagesCal).find('input[type="checkbox"]').prop('checked', false);

                }

            });

            $(".columnHide").prop("checked", false)

        },
        complete: function () {
            $.unblockUI();
            recalculoSelect()
            $("#seleccionados").html(dataPersonal.length)
            $("#total").html(_tableCalculoManual.data().count())
        }
    });
})

$(document).on('change', '.HorInd', function (event) {
    validarSession()
    let selectFilter = _tableCalculoManual.rows({ search: 'applied' }).nodes().to$().find('input:checked').length
    $("#seleccionados").html(selectFilter)
});

function recalculoSelect() {
    dataPersonal = []
    let a_select = $(_tableCalculoManual.cells().nodes()).find('input[type="checkbox"]:checked')
    a_select.toArray().forEach(x => {
        dataPersonal.push({ intIdPersonal: $(x).attr('data_intidpers') })
    })
}

$("#send").click(function () {
    validarSession()
    swal({
        title: 'Cálculo Manual',
        text: '¿Seguro que desea salir?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    }).then(function (isConfirm) {
        $("#loadingModal").modal('hide')
        $.post(
            '/Proceso/LimpiarTemporal',
            { intIdProceso: intIdProc },
            (response) => {
                habilitarFiltros()
                if (response.type == "info") {
                    new PNotify({
                        title: 'Cálculo Manual',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    return;
                }
            });
        }, function (dismiss) {
            
        })


})

$("#btnClose").click(function () {
    validarSession()
    $("#exampleModal").modal('hide')

})

$(".btnPeriodo").click(function () {
    validarSession()
    var id = $('#cboPlanilla option:selected').val();

    bitCerrado = false
    dataPeriodo = []

    if ($(this)[0].id == 1) {
        bitCerrado = true;
    }

    $("#All_Periodo").prop('checked', false)

    var planilla = $('#cboPlanilla option:selected').html()

    if (bitCerrado) {
        $("#txtPeriodo").html("Periodos Cerrados - Planilla: " + planilla)
        $("#btnPeriodo").html("Abrir")
        $("#btnPeriodo")[0].className = "btn btn-success"
    } else {
        $("#txtPeriodo").html("Periodos Abiertos - Planilla: " + planilla)
        $("#btnPeriodo").html("Cerrar")
        $("#btnPeriodo")[0].className = "btn btn-danger"
    }


    $.post(
        '/Proceso/getPeriodoxPlanilla',
        { intIdPlanilla: id, bitCerrado: bitCerrado },
        response => {
            console.log(response)

            dataPeriodo_tmp = response

            if (typeof _tablePeriodo !== 'undefined') {
                _tablePeriodo.destroy();
            }

            _tablePeriodo = $('#TablaPeriodo').DataTable({
                data: response,
                columns: [
                    {
                        sortable: false,
                        "render": (data, type, item, meta) => {
                            let intIdPeriodo = item.intIdPeriodo;

                            return `<input type="checkbox" class="HorInd"  id="Chck${intIdPeriodo}" onChange="CheckDetPer(${intIdPeriodo})"/>`;
                        }

                    },
                    { data: 'strCoPeriodo' },
                    { data: 'strDesPeriodo' },
                    { data: 'dttFeIniPerio' },
                    { data: 'dttFeFinPerio' },
                    { data: 'dttFeCiePerio' },
                    { data: 'strMesAnio' },
                    { data: 'strDesPlani' }
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
                        targets: [7],
                        visible: false,
                        searchable: false
                    }
                ],
                dom: 'lBfrtip',
            });

            var allPagesPer = _tablePeriodo.cells().nodes();

            $('#All_Periodo').on('change', function () {

                if ($('#All_Periodo').is(':checked')) {
                    dataPeriodo = dataPeriodo_tmp
                    $(allPagesPer).find('input[type="checkbox"]').prop('checked', true);
                } else {
                    dataPeriodo = []
                    $(allPagesPer).find('input[type="checkbox"]').prop('checked', false);

                }

            });

        });

})

$("#btnPeriodo").click(function () {
    validarSession()
    if (dataPeriodo.length == 0) {
        new PNotify({
            title: 'Cambio Periodo',
            text: 'Seleccionar al menos un periodo',
            type: 'info',
            delay: 1000,
            styling: 'bootstrap3'
        });
        return
    }

    var listPer = []
    dataPeriodo.forEach(element => {
        listPer.push(element.intIdPeriodo)
    });

    if (bitCerrado) {
        bitCerrado = false
    } else {
        bitCerrado = true
    }

    $.post(
        '/Proceso/updatePeriodo',
        { listPeriodos: listPer, bitCerrado: bitCerrado },
        response => {
            if (response.type == "success") {
                new PNotify({
                    title: 'Cambio de estado Periodo',
                    text: response.message,
                    type: response.type,
                    delay: 1000,
                    styling: 'bootstrap3'
                });

                $("#exampleModal #btnClose").click()

                var id = $('#cboPlanilla option:selected').val();

                $.post(
                    '/Proceso/ListarCombosProceso',
                    { intIdMenu: 0, strEntidad: 'TGPERIODO', intIdFiltroGrupo: id, strGrupo: 'TGPERIODOXPLANILLA', strSubGrupo: '' },
                    (response) => {
                        $('#chekeamePeriodos').empty();
                        response.forEach(element => {
                            $('#chekeamePeriodos').append(`<li role="presentation" ><label>` +
                                '<input id="' + element.intidTipo + '"type="checkbox" class= "flat" name="restore">' + element.strDeTipo +
                                '</label></li >');
                        });
                    });

            } else {
                new PNotify({
                    title: 'Cambio de estado Periodo',
                    text: response.message,
                    type: response.type,
                    delay: 1000,
                    styling: 'bootstrap3'
                });
            }
        });

})

$("#btnExcelLoading").click(function () {
    validarSession()
    var intIdProc = $("#btnExcelLoading").attr("intIdProc")
    var planilla = $('#cboPlanilla option:selected').html()
    window.open('/Proceso/exportExcel?intIdProceso=' + intIdProc + '&planilla=' + planilla, '_blank');
})

$("#btnExportarReporte").click(function () {
    calcularPeriodos()
    validarSession()
    var planilla = $('#cboPlanilla option:selected').html()
    $.post(
        '/Proceso/llenarListaPeriodos',
        { lista: _listaPeriodo },
        response => {

            let listNewPeriodo = _listaPeriodo.map(function (x) {
                return x.id;
            });

            $.post(
                '/Proceso/validarPeriodo',
                { lista: listNewPeriodo },
                response => {
                    if (parseInt(response) > 0) {
                        window.open('/Proceso/exportExcelReporte?planilla=' + planilla, '_blank');
                    } else {
                        swal('Calculo Manual', 'No existen datos calculados', 'info')
                    }
            });
        });
})

$(document).ready(function () {

    CombosCalculo()

    _tableCalculoManual = $('#TablaCalculo').DataTable({
        data: {},
        columns: [
            {
                sortable: false,
                "render": (data, type, item, meta) => {
                    let intIdPersonal = item.intIdPersonal;
                    return `<input type="checkbox" class="HorInd"  id="Chck${intIdPersonal}" data_intIdPers="${intIdPersonal}"  onChange="CheckDetCal(${intIdPersonal})"/>`;
                }

            },
            { data: 'strCoPersonal' },
            { data: 'strNomCompleto' },
            { data: 'strNumDoc' },
            { data: 'strFotocheck' },
            { data: 'strDescripcion' },
            { data: 'strDeTipo' },
            { data: 'strDesGrupoLiq' },
            { data: 'dttFecAdmin' },
            { data: 'dttFecCese' },
            {
                sortable: false,
                "render": (data, type, item, meta) => {
                    return ``;
                }
            },
            { data: 'intDiasTrabajados' },
            { data: 'intDiasFaltas' },
            { data: 'intHorasAdicionales' },
            { data: 'intFeriados' },
            { data: 'intHorasFuera' },
            { data: 'intTardanza' }
        ],
        lengthMenu: [10, 25, 50],
        order: [],
        responsive: true,
        language: {
            lengthMenu: 'Mostrar _MENU_ Empleados',
            info: 'Mostrar _START_ a _END_ de _TOTAL_ Empleados',
            infoEmpty: 'No hay Empleados para mostrar',
            search: 'Buscar: ',
            sSearchPlaceholder: 'Criterio de búsqueda',
            zeroRecords: 'No se encontraron registros coincidentes',
            infoFiltered: '(Filtrado de _MAX_  Empleados en total)',
            paginate: {
                previous: 'Anterior',
                next: 'Siguiente'
            }
        },
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
                targets: [4],
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
                targets: [7],
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

})
