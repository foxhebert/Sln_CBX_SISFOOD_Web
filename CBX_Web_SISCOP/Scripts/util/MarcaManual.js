var _varTablaMarcaManual;
var _varTablaDetMarcaManual;

var _codigo;
var _nombre;
var _fotoCheck;

var _fechaDefecto = ""

function CombosMarcaManual() {

    const { intIdMenu } = configEmpleadoInicial()

    $.post(
        '/Personal/ListarCombosPersonal',
        { intIdMenu, strEntidad: 'TGUNIDORG', intIdFiltroGrupo: 2, strGrupo: 'JERAR', strSubGrupo: '' },
        (response) => {
            $('#IntIDEmp2').empty();
            $('#IntIDEmp2').append('<option value="0" selected>Todos</option>');

            response.forEach(element => {
                $('#IntIDEmp2').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');
            });

        });

}

function traerDatosMarcaManual() {
    var Activos = $("#filtroActivo").val();
    var strFiltro = $('#filtroMarcaManual').val();
    var idEmp = $('#IntIDEmp2 option:selected').val();
    let filtrojer_ini = '2000-01-01 00:00:00';
    let filtrojer_fin = '2030-01-01 00:00:00';

    $.ajax({
        url: '/Asistencia/GetEmpleados',
        type: 'POST',
        data: {
            IntActivoFilter: Activos,
            strfilter: strFiltro,
            IntIdEmp: idEmp,
            dttfiltrofch1: filtrojer_ini,
            dttfiltrofch2: filtrojer_fin
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
            console.log(response);
            //datahorariogLobalAu = response

            if (typeof _varTablaMarcaManual !== 'undefined') {
                _varTablaMarcaManual.destroy();
            }


            _varTablaMarcaManual = $('#datatable-AusentismosCom').DataTable({
                data: response,
                columns: [
                    { data: 'strCoPersonal' },
                    { data: 'strNombres' },
                    { data: 'strNumDoc' },
                    { data: 'dttFechAsig' },
                    { data: 'strDesEmp' },

                    {
                        sortable: false,
                        "render": (data, type, item, meta) => {
                            let intIdPerHorario = item.intIdPerHorario;
                            let strNombres = item.strNombres;
                            let strFotoCheck = item.strFotoCheck;

                            return `<button class="btn btn-primary btn-xs"  onclick="Nuevamarca(${intIdPerHorario},'${strNombres}','${strFotoCheck}');"> Nuevo </button>
                                    <button class="btn btn-success btn-xs btn-edit"  onclick="VerDetMarcaManual('${intIdPerHorario}','${strNombres}');"><i class="fa fa-pencil"></i> Ver </button> `;
                        }
                    },
                    { data: 'intIdPerHorario' }

                ],
                lengthMenu: [10, 25, 50],
                order: [],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [
                    {
                        targets: [6],
                        visible: false,
                        searchable: false
                    },
                ],
                dom: 'lBfrtip',
            });
        },
        complete: function () {
            $.unblockUI();
        }
    });

}

function VerDetMarcaManual(intIdPersonal, strNombres) {
    validarSession()
    $('#EditAusent').hide();
    _codigo = intIdPersonal;
    _nombre = strNombres;

    $('#NombresG').html('<h3>Empleado : ' + strNombres + '</h3>');

    verHistoricoMarcaManual(intIdPersonal, strNombres);
}

function verHistoricoMarcaManual(intIdPersonal, strNombres) {

    $('#NombresGE').html('<h3>Empleado : ' + strNombres + '</h3>');

    let dttfiltrofch1 = $('#campJerar').data('daterangepicker').startDate.format('YYYY/MM/DD')
    let dttfiltrofch2 = $('#campJerar').data('daterangepicker').endDate.format('YYYY/MM/DD')

    $.ajax({
        url: '/Asistencia/GetAsistencias',
        type: 'POST',
        data: {
            intIdPerHor: intIdPersonal,
            dttfiltrofch1,
            dttfiltrofch2
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
            console.log(response);

            if (typeof _varTablaDetMarcaManual !== 'undefined') {
                _varTablaDetMarcaManual.clear().draw()
                _varTablaDetMarcaManual.destroy();
            }

            _varTablaDetMarcaManual = $('#TablaAsistencia').DataTable({
                data: response,
                columns: [
                    { data: 'dttFechaHora', "width": "25%" },
                    { data: 'strMarcador', "width": "25%" },
                    { data: 'strTipoMarca', "width": "20%" },
                    {
                        sortable: false,
                        "width": "30%",
                        "render": (data, type, item, meta) => {
                            var intIdAsistencia = item.intIdAsistencia;
                            var dttFechaHora = item.dttFechaHora;

                            return `<button class="btn btn-success btn-xs btn-edit" onclick="EditarAusentismoDet('${intIdAsistencia}');"><i class="fa fa-pencil"></i> Editar </button> 
                                    <button class="btn btn-primary btn-xs btn-delete" dataid="${intIdAsistencia}" des_data="${dttFechaHora}"><i class="fa fa-trash-o"></i> Eliminar </button>`;
                        }
                    }
                ],
                lengthMenu: [10, 25, 50],
                order: [],
                responsive: true,
                language: _datatableLanguaje,
                dom: 'lBfrtip',
            });

            $('#TablaAsistencia tbody').on('click', 'tr button.btn-delete', function () {
                validarSession()
                var intIdAsistencia = $(this).attr("dataid");
                var strDesConcepto = $(this).attr("des_data");

                if (!isNaN(intIdAsistencia)) {

                    $('#EditHorAsig').hide();
                    $('#FormEditartAuse').hide();
                    $('#VerHist').show();
                    $('#AsigHor').hide();

                    swal({
                        title: "Eliminar Marca",
                        text: "¿Está seguro de eliminar la marca ''<strong>" + strDesConcepto + "</strong>'' ? ",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "No, cancelar",
                    }).then(function (isConfirm) {
                        $.post(
                            '/Asistencia/EliminarMarca',
                            { intIdAsistencia },
                            (response) => {
                                validarSession()
                                console.log(response);
                                if (response.type !== '') {
                                    var tipo = 'Eliminado!';
                                    if (response.type === 'error')
                                        tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                                    swal(tipo, response.message, response.type);

                                    if (response.type === 'success')

                                        verHistoricoMarcaManual(intIdPersonal, strNombres);

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


                    $('#btn-cancelHistorial_Edit').on('click', function () {
                        validarSession()
                        $('.form-hide-AusentisCom').show();
                        $('#FormEditartAuse').hide();
                        $('#VerHist').show();

                    });
                }

            });
        },
        complete: function () {
            $.unblockUI();
        }
    });

    //mostrar listado de historial de Ausentismos:
    $('.form-hide-AusentisCom').show();
    //  $('#EditAusent').hide();
    $('#FormEditartAuse').show(); //13.08.2020
    $('#VerHistAuse').show();
    $('#NuevoAuse').hide();

}

function limpiarFechas() {
    $("#dateEntrada").find("input").val("");
    $("#dateSalida").find("input").val("");
    $("#dateSalidaRe").find("input").val("");
    $("#dateEntradaRe").find("input").val("");
    $("#dateEntradaHE").find("input").val("");
    $("#dateSalidaHE").find("input").val("");
    $("#BitDiaSgt02").prop('checked', false)
    $("#BitDiaSgt03").prop('checked', false)
    $("#BitDiaSgt04").prop('checked', false)
    $("#BitDiaSgt05").prop('checked', false)
    $("#BitDiaSgt06").prop('checked', false)
    $("#BitDiaSgt02").attr("disabled", false);
    $("#BitDiaSgt03").attr("disabled", false);
    $("#BitDiaSgt04").attr("disabled", false);
    $("#BitDiaSgt05").attr("disabled", false);
    $("#BitDiaSgt06").attr("disabled", false);
    $("#dateEntrada").find("input").attr("disabled", false);
    $("#dateSalida").find("input").attr("disabled", false);
    $("#dateSalidaRe").find("input").attr("disabled", false);
    $("#dateEntradaRe").find("input").attr("disabled", false);
    $("#dateEntradaHE").find("input").attr("disabled", false);
    $("#dateSalidaHE").find("input").attr("disabled", false);
}

function cleanForm() {
    $(".div01").hide()
    $(".div02").hide()
    $(".div03").hide()
    $(".div04").hide()
    $(".div05").hide()
    $(".div06").hide()
}

function showHide() {
    $(".flatTipo").each(function (index) {
        if ($(this).is(':checked')) {
            $('.div' + $(this).attr('strCo')).show();
            $(".borderFechas2").show();
        } else {
            $('.div' + $(this).attr('strCo')).hide();
        }
    });
    if ($(".flatTipo:checked").length == 6) {
        $("#allTipos").prop('checked', true);
    } else {
        $("#allTipos").prop('checked', false);
    }

    if ($(".borderFechas2 .col-sm-6:visible").length == 0) {
        $(".borderFechas2").hide();
    } else {
        $(".borderFechas2").show();
    }
}

function MarcasAutomatica() {
    $.post(
        '/Asistencia/GetMarcasHorario',
        { intIdPersonal: _codigo },
        (response) => {

            if (response["HI"] != "") {
                $("#dateEntrada").find("input").val(response["HI"]);
                $("#dateEntrada").find("input").attr("disabled", true);
            }
            if (response["HS"] != "") {
                $("#dateSalida").find("input").val(response["HS"]);
                $("#dateSalida").find("input").attr("disabled", true);
                $("#BitDiaSgt02").prop('checked', false)
                $("#BitDiaSgt02").attr("disabled", true);
            }
            if (response["SD"] != "") {
                $("#dateSalidaRe").find("input").val(response["SD"]);
                $("#dateSalidaRe").find("input").attr("disabled", true);
                $("#BitDiaSgt03").attr("disabled", true);
                $("#BitDiaSgt03").prop('checked', false)
            }
            if (response["ID"] != "") {
                $("#dateEntradaRe").find("input").val(response["ID"]);
                $("#dateEntradaRe").find("input").attr("disabled", true);
                $("#BitDiaSgt04").attr("disabled", true);
                $("#BitDiaSgt04").prop('checked', false)
            }
            if (response["IE"] != "") {
                $("#dateEntradaHE").find("input").val(response["IE"]);
                $("#dateEntradaHE").find("input").attr("disabled", true);
                $("#BitDiaSgt05").attr("disabled", true);
                $("#BitDiaSgt05").prop('checked', false)
            }
            if (response["SE"] != "") {
                $("#dateSalidaHE").find("input").val(response["SE"]);
                $("#dateSalidaHE").find("input").attr("disabled", true);
                $("#BitDiaSgt06").attr("disabled", true);
                $("#BitDiaSgt06").prop('checked', false)
            }
        });
}

function EditarAusentismoDet(intIdAsistencia) {
    validarSession()
    $('#NombresGN').html('<h3>Empleado : ' + _nombre + '</h3>');
    $("#txtIdAsistencia").val(intIdAsistencia)
    $(".borderFechas").last().find('input.form-control').attr('fecha', '')
    $("#idMarcaOpcion").val(1)
    $("#BitDia").prop('checked', false)
    $.post(
        '/Asistencia/getAsistenciaXID',
        { intIdAsistencia },
        (response) => {
            console.log(response)
            _fechaDefecto = response.dttFechaHora
            $("#dateFecha").find("input").val(response.dttFechaHora)

            $("#BitFecha").prop('checked', false)
            if (response.intDiaSgt == 1) {
                $("#BitFecha").prop('checked', true)
            }

            if (response.intModomarca > 0) {
                $("#TituloEdit").html("Editar Marca")
            } else {
                $("#TituloEdit").html("Editar Marca Manual")
            }

            if (response.strCodTipoMarca == "01") {
                $(".divCheckFecha").hide()
            } else {
                $(".divCheckFecha").show()
            }

            $("#txtDireccion").val(response.strDireccion_marca)

            if (response.strRutaFoto == null) {
                $(".divRutaFoto").hide()
            } else {
                $(".divRutaFoto").show()

                $.ajax({
                    url: response.strRutaFoto,
                    type: 'HEAD',
                    error: function () {
                        //Imagen por defecto
                        $("#imgId").attr("src", '/DirEmpleadosRuta/descarga(1).jpg');
                    },
                    success: function () {
                        $("#imgId").attr("src", response.strRutaFoto);
                    }
                });

                //var req = new XMLHttpRequest();
                //req.open('GET', response.strRutaFoto, false);
                //req.send();
                //if (req.status == 404) {
                //    pic_list.hide();
                //} else {
                //    pic_list.show();
                //}
            }

            // Cargar Tipo
            $.post(
                '/Personal/ListarCombosPersonal',
                { intIdMenu: 0, strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'TGTIPOMARCA', strSubGrupo: '' },
                (res) => {
                    $('#IdTipo').empty();
                    $('#IdTipo').append('<option value="0" selected>Seleccione</option>');
                    res.forEach(element => {
                        $('#IdTipo').append('<option strCo="' + element.strextra1 + '" value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');
                    });
                    $('#IdTipo').val(response.intIdTipoMarca);
                    $("#txtTipo").html($('#IdTipo option:selected').html())
                });


            // Cargar Marcador
            $.post(
                '/Personal/ListarCombosPersonal',
                { intIdMenu: 0, strEntidad: 'TGMARCADOR', intIdFiltroGrupo: _codigo, strGrupo: 'TGMARCADOR', strSubGrupo: 'MARCA' },
                (res) => {
                    $('#IdMarcador').empty();
                    $('#IdMarcador').append('<option value="0" selected>Seleccione</option>');

                    res.forEach(element => {
                        $('#IdMarcador').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');
                    });
                    $('#IdMarcador').val(response.intIdMarcador);
                });

            // Cargar Motivo
            $.post(
                '/Personal/ListarCombosPersonal',
                { intIdMenu: 0, strEntidad: 'TGMOTIVO', intIdFiltroGrupo: 0, strGrupo: 'TGMOTIVO', strSubGrupo: '' },
                (res) => {
                    $('#IdMotivo').empty();
                    $('#IdMotivo').append('<option value="0" selected>Seleccione</option>');

                    res.forEach(element => {
                        $('#IdMotivo').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');
                    });
                    $('#IdMotivo').val(response.intIdMotivo);
                });
        });

    $('.form-hide-AusentisCom').show();
    $('#EditAusent').show();
    $('#FormEditartAuse').hide(); //13.08.2020
    $('#VerHistAuse').hide();
    $('#NuevoAuse').hide();

    $('#btn-cancelHistorial_Edit').on('click', function () {
        validarSession()
        $('#EditAusent').hide();
        $('#FormEditartAuse').hide();
        $('#VerHistAuse').show();
    });
}

function ActualizarAusentismos() {
    validarSession()
    var intIdAsistencia = $("#txtIdAsistencia").val();
    var IdMarcador = $('#IdMarcador').val();
    var IdMotivo = $('#IdMotivo').val();
    var IdTipo = $("#IdTipo").val();
    var codigo = $("#IdTipo").find("option:selected").attr('strco')

    var dateFecha = $("#dateFecha").find("input").val();

    var BitDia = 0
    if ($('#BitDia').is(":checked")) { BitDia = 1; }

    var BitFecha = 0
    if ($('#BitFecha').is(":checked")) { BitFecha = 1; }


    if (IdMarcador == 0) {

        new PNotify({
            title: 'Marcador',
            text: 'Seleccionar un marcador',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });

        return;
    }
    //if (IdMotivo == 0) {

    //    new PNotify({
    //        title: 'Motivo',
    //        text: 'Seleccionar un motivo',
    //        type: 'info',
    //        delay: 3000,
    //        styling: 'bootstrap3',
    //        addclass: 'dark'
    //    });

    //    return;
    //}

    if (IdTipo == 0) {

        new PNotify({
            title: 'Tipo de Marca',
            text: 'Seleccionar un tipo de marca',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });

        return;
    }

    if (dateFecha == "") {
        new PNotify({
            title: 'Tipo de Marca',
            text: 'No puede enviar tipo de marcas vacios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });

        return;
    }

    var tinIdTMarcacion = 1
    if (codigo == "02" || codigo == "03" || codigo == "06") {
        tinIdTMarcacion = 2
    }

    var fecha_v = $("#dateFecha").find("input").attr("fecha")
    var bitFlRepetido = 0
    var strRepetido = ""
    if (fecha_v != "") {
        bitFlRepetido = 1
        strRepetido = fecha_v
    }

    var Asistencia = {
        intIdAsistencia
        , intIdPersonal: _codigo
        , intIdMarcador: IdMarcador
        , intIdMotivo: IdMotivo
        , intIdTipoMarca: IdTipo
        , dttFechaHora: dateFecha
        , intDiaSgt: BitFecha
        , tinIdTMarcacion: tinIdTMarcacion
        , bitFlRepetido
        , strRepetido
    }

    console.log(Asistencia)

    $.post(
        '/Asistencia/ActualizarMarca',
        {
            objAsistencia: Asistencia
        },
        (response) => {
            console.log(response)
            if (response.type == 'success') {
                new PNotify({
                    title: 'Actualizar Marca Manual',
                    text: response.message,
                    type: response.type,
                    delay: 3000,
                    styling: 'bootstrap3'
                });
                $('#EditAusent').hide();
                $('#VerHistAuse').hide();

                $('.form-hide-AusentisCom').show();
                //  $('#EditAusent').hide();
                $('#FormEditartAuse').show(); //13.08.2020
                $('#VerHistAuse').show();

                verHistoricoMarcaManual(_codigo, _nombre);

            } else {
                new PNotify({
                    title: 'Actualizar Marca Manual',
                    text: response.message,
                    type: response.type,
                    delay: 3000,
                    styling: 'bootstrap3'
                });
            }
        }
    );

}

function descargarImagen() {

    var ruta = $("#imgId").attr("src")
    var lista = ruta.split("/")

    var link = document.createElement("a");
    link.download = lista[lista.length - 1];
    link.href = ruta;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

$("#IdTipo").change(function () {
    var codigo = $(this).find("option:selected").attr('strco')
    var texto = $('#IdTipo option:selected').html()
    let idMarcaOpcion = $("#idMarcaOpcion").val()
    $(".borderFechas").last().find('input.form-control').attr('fecha', '')
    $("#txtTipo").html(texto)
    $(".divFecha").show()
    $(".divCheckFecha").show()
    //$("#dateFecha").find("input").val("");
    $("#BitDia").prop('checked', false)
    $("#dateFecha").find("input").attr("disabled", false);
    if (codigo == "01") {
        $(".divCheckFecha").hide()
    } else if (codigo == "02" || codigo == "03" || codigo == "04" || codigo == "05" || codigo == "06") {
        $("#BitFecha").prop('checked', false)
        $("#BitFecha").attr("disabled", false);
    } else {
        $("#txtTipo").html("")
        $(".divFecha").hide()
    }
    if (idMarcaOpcion == 0) {
        MarcaOpcionFunc()
    }
})

$("#BitDiaNew").change(function () {
    $(".borderFechas2").first().find('input.form-control').attr('fecha', '')
    limpiarFechas()
    if ($(this).is(':checked')) {
        $("#idMarcaOpcionNew").val(1);
        $.post(
            '/Asistencia/GetUltimaMarca',
            { intIdPersonal: _codigo },
            (response) => {
                if (response["Fecha"] == null) {
                    new PNotify({
                        title: 'Marca Manual',
                        text: 'No existen marcas a repetir',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    $("#BitDiaNew").iCheck("unCheck")
                    return;
                } else {
                    console.log(response)
                    if (response["HI"] != "") {
                        $("#dateEntrada").find("input").val(moment().format('YYYY-MM-DD') + response["HI"].substring(10));
                        $("#dateEntrada").find("input").attr("disabled", true);
                        $("#dateEntrada").find("input").attr("fecha", response["Fecha"]);
                    }
                    if (response["HS"] != "") {
                        $("#dateSalida").find("input").val(moment().format('YYYY-MM-DD') + response["HS"].substring(10));
                        $("#dateSalida").find("input").attr("disabled", true);
                        if (response["Fecha"] == response["HS"].substring(0, 10)) {
                            $("#BitDiaSgt02").prop('checked', false)
                        } else {
                            $("#BitDiaSgt02").prop('checked', true)
                        }

                        $("#BitDiaSgt02").attr("disabled", true);
                        $("#dateSalida").find("input").attr("fecha", response["Fecha"]);
                    }
                    if (response["SD"] != "") {
                        $("#dateSalidaRe").find("input").val(moment().format('YYYY-MM-DD') + response["SD"].substring(10));
                        $("#dateSalidaRe").find("input").attr("disabled", true);
                        $("#BitDiaSgt03").attr("disabled", true);
                        if (response["Fecha"] == response["SD"].substring(0, 10)) {
                            $("#BitDiaSgt03").prop('checked', false)
                        } else {
                            $("#BitDiaSgt03").prop('checked', true)
                        }

                        $("#dateSalidaRe").find("input").attr("fecha", response["Fecha"]);
                    }
                    if (response["ID"] != "") {
                        $("#dateEntradaRe").find("input").val(moment().format('YYYY-MM-DD') + response["ID"].substring(10));
                        $("#dateEntradaRe").find("input").attr("disabled", true);
                        $("#BitDiaSgt04").attr("disabled", true);
                        if (response["Fecha"] == response["ID"].substring(0, 10)) {
                            $("#BitDiaSgt04").prop('checked', false)
                        } else {
                            $("#BitDiaSgt04").prop('checked', true)
                        }

                        $("#dateEntradaRe").find("input").attr("fecha", response["Fecha"]);
                    }
                    if (response["IE"] != "") {
                        $("#dateEntradaHE").find("input").val(moment().format('YYYY-MM-DD') + response["IE"].substring(10));
                        $("#dateEntradaHE").find("input").attr("disabled", true);
                        $("#BitDiaSgt05").attr("disabled", true);
                        if (response["Fecha"] == response["IE"].substring(0, 10)) {
                            $("#BitDiaSgt05").prop('checked', false)
                        } else {
                            $("#BitDiaSgt05").prop('checked', true)
                        }

                        $("#dateEntradaHE").find("input").attr("fecha", response["Fecha"]);
                    }
                    if (response["SE"] != "") {
                        $("#dateSalidaHE").find("input").val(moment().format('YYYY-MM-DD') + response["SE"].substring(10));
                        $("#dateSalidaHE").find("input").attr("disabled", true);
                        $("#BitDiaSgt06").attr("disabled", true);
                        if (response["Fecha"] == response["SE"].substring(0, 10)) {
                            $("#BitDiaSgt06").prop('checked', false)
                        } else {
                            $("#BitDiaSgt06").prop('checked', true)
                        }

                        $("#dateSalidaHE").find("input").attr("fecha", response["Fecha"]);
                    }
                }
            });
    }
})

$("#BitDia").change(function () {
    $(".borderFechas").last().find('input.form-control').attr('fecha', '')
    if ($(this).is(':checked')) {
        $("#idMarcaOpcion").val(1);
        $.post(
            '/Asistencia/GetUltimaMarca',
            { intIdPersonal: _codigo },
            (response) => {
                console.log(response)

                var codigo = $("#IdTipo option:selected").attr("strco")

                $("#dateFecha").find("input").val("");
                $("#dateFecha").find("input").attr("disabled", false);

                if (response["HI"] != "" && codigo == "01") {
                    $("#dateFecha").find("input").val(moment().format('YYYY-MM-DD') + response["HI"].substring(10));
                    $("#dateFecha").find("input").attr("disabled", true);
                    $("#dateFecha").find("input").attr("fecha", response["HI"].substring(0, 10));
                }
                if (response["HS"] != "" && codigo == "01") {
                    $("#dateFecha").find("input").val(moment().format('YYYY-MM-DD') + response["HS"].substring(10));
                    $("#dateFecha").find("input").attr("disabled", true);
                    $("#BitFecha").prop('checked', false)
                    $("#BitFecha").attr("disabled", true);
                    $("#dateFecha").find("input").attr("fecha", response["HS"].substring(0, 10));
                }
                if (response["SD"] != "" && codigo == "01") {
                    $("#dateFecha").find("input").val(moment().format('YYYY-MM-DD') + response["SD"].substring(10));
                    $("#dateFecha").find("input").attr("disabled", true);
                    $("#BitFecha").attr("disabled", true);
                    $("#BitFecha").prop('checked', false)
                    $("#dateFecha").find("input").attr("fecha", response["SD"].substring(0, 10));
                }
                if (response["ID"] != "" && codigo == "01") {
                    $("#dateFecha").find("input").val(moment().format('YYYY-MM-DD') + response["ID"].substring(10));
                    $("#dateFecha").find("input").attr("disabled", true);
                    $("#BitFecha").attr("disabled", true);
                    $("#BitFecha").prop('checked', false)
                    $("#dateFecha").find("input").attr("fecha", response["ID"].substring(0, 10));
                }
                if (response["IE"] != "" && codigo == "01") {
                    $("#dateFecha").find("input").val(moment().format('YYYY-MM-DD') + response["IE"].substring(10));
                    $("#dateFecha").find("input").attr("disabled", true);
                    $("#BitFecha").attr("disabled", true);
                    $("#BitFecha").prop('checked', false)
                    $("#dateFecha").find("input").attr("fecha", response["IE"].substring(0, 10));
                }
                if (response["SE"] != "" && codigo == "01") {
                    $("#dateFecha").find("input").val(moment().format('YYYY-MM-DD') + response["SE"].substring(10));
                    $("#dateFecha").find("input").attr("disabled", true);
                    $("#BitFecha").attr("disabled", true);
                    $("#BitFecha").prop('checked', false)
                    $("#dateFecha").find("input").attr("fecha", response["SE"].substring(0, 10));
                }
            });
    }
})

$('#idMarcaOpcionNew').change(function () {
    var codigo = $("#idMarcaOpcionNew").val()
    $("#BitDiaNew").prop("checked", false)
    if (codigo == 0) {
        MarcasAutomatica();
    } else {
        limpiarFechas()
    }
});

function getFechaTmp(fecha) {
    return _fechaDefecto.substr(0, 10) + fecha.substr(10)
}

function MarcaOpcionFunc() {
    $.post(
        '/Asistencia/GetMarcasHorario',
        { intIdPersonal: _codigo },
        (response) => {

            var codigo = $("#IdTipo option:selected").attr("strco")

            if (response["HI"] != "" && codigo == "01") {
                $("#dateFecha").find("input").val(getFechaTmp(response["HI"]));
                $("#dateFecha").find("input").attr("disabled", true);
            }
            if (response["HS"] != "" && codigo == "02") {
                $("#dateFecha").find("input").val(getFechaTmp(response["HS"]));
                $("#dateFecha").find("input").attr("disabled", true);
                $("#BitFecha").prop('checked', false)
                $("#BitFecha").attr("disabled", true);
            }
            if (response["SD"] != "" && codigo == "03") {
                $("#dateFecha").find("input").val(getFechaTmp(response["SD"]));
                $("#dateFecha").find("input").attr("disabled", true);
                $("#BitFecha").attr("disabled", true);
                $("#BitFecha").prop('checked', false)
            }
            if (response["ID"] != "" && codigo == "04") {
                $("#dateFecha").find("input").val(getFechaTmp(response["ID"]));
                $("#dateFecha").find("input").attr("disabled", true);
                $("#BitFecha").attr("disabled", true);
                $("#BitFecha").prop('checked', false)
            }
            if (response["IE"] != "" && codigo == "05") {
                $("#dateFecha").find("input").val(getFechaTmp(response["IE"]));
                $("#dateFecha").find("input").attr("disabled", true);
                $("#BitFecha").attr("disabled", true);
                $("#BitFecha").prop('checked', false)
            }
            if (response["SE"] != "" && codigo == "06") {
                $("#dateFecha").find("input").val(getFechaTmp(response["SE"]));
                $("#dateFecha").find("input").attr("disabled", true);
                $("#BitFecha").attr("disabled", true);
                $("#BitFecha").prop('checked', false)
            }
        });
}

$('#idMarcaOpcion').change(function () {
    var codigo = $("#idMarcaOpcion").val()
    $(".borderFechas").last().find('input.form-control').attr('fecha', '')
    $("#dateFecha").find("input").val("");
    $("#dateFecha").find("input").attr("disabled", false);

    $("#BitDia").prop("checked", false)
    if (codigo == 0) {
        MarcaOpcionFunc()
    } else {
        limpiarFechas()
        $("#dateFecha").find("input").val(_fechaDefecto);
        $("#dateFecha").find("input").attr("disabled", false);
        $("#BitFecha").prop('checked', false)
        $("#BitFecha").attr("disabled", false);
    }
});

$("#filtroMarcaManual").change(function () {
    validarSession()
    //let filtrojer_ini = $('#campJerar').data('daterangepicker').startDate.format('YYYY/MM/DD')
    //let filtrojer_fin = $('#campJerar').data('daterangepicker').endDate.format('YYYY/MM/DD')
    //traerDatosMarcaManual(filtrojer_ini, filtrojer_fin)
    traerDatosMarcaManual()
})

$("#IntIDEmp2").change(function () {
    validarSession()
    //let filtrojer_ini = $('#campJerar').data('daterangepicker').startDate.format('YYYY/MM/DD')
    //let filtrojer_fin = $('#campJerar').data('daterangepicker').endDate.format('YYYY/MM/DD')
    //traerDatosMarcaManual(filtrojer_ini, filtrojer_fin)
    traerDatosMarcaManual()
})

$('.range-datepicker').on('apply.daterangepicker', function (ev, picker) {
    validarSession()
    if (_codigo != null && _nombre != null) {
        verHistoricoMarcaManual(_codigo, _nombre);
    }
});

$("#filtroActivo").change(function () {
    validarSession()
    traerDatosMarcaManual()
})

$("#btn-cancelHistorial").on('click', function () {
    validarSession()
    $(".form-hide-AusentisCom").hide()
});

$('#btn-cancel-AusentismosCom').on('click', function () {
    validarSession()
    $('.form-hide-AusentisCom').hide();
});

//$('#btn-new-AusentisCom').on('click', function () {
function Nuevamarca(intIdPersona, strNombre, strFotoCheck) {
    validarSession()
    _codigo = intIdPersona;
    _nombre = strNombre;
    _fotoCheck = strFotoCheck;
    $(".borderFechas2").first().find('input.form-control').attr('fecha', '')
    $('.form-hide-AusentisCom').show();
    $('#VerHistAuse').hide();
    $('#FormEditartAuse').hide();
    $('#EditAusent').hide();

    cleanForm()

    $('#NombresGN').html('<h3>Empleado : ' + _nombre + '</h3>');
    $('#NuevoAuse').show();

    $("#BitDiaNew").prop('checked', false);
    $("#idMarcaOpcionNew").val(0)
    $(".borderFechas2").hide()

    // Cargar Tipo
    $.post(
        '/Personal/ListarCombosPersonal',
        { intIdMenu: 0, strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'TGTIPOMARCA', strSubGrupo: '' },
        (response) => {
            $('#chekeameTipoMarca').empty();
            $('#chekeameTipoMarca').append(`<li role="presentation"><label>` +
                '&nbsp;<input type="checkbox" id="allTipos" name="restore">&nbsp;Todos</label></li >');
            response.forEach(element => {
                $('#chekeameTipoMarca').append(`<li role="presentation" ><label>` +
                    '&nbsp;<input strCo="' + element.strextra1 + '" id="' + element.intidTipo + '"type="checkbox" class= "flatTipo" name="restore">&nbsp;' + element.strDeTipo +
                    '</label></li >');
                $(".div" + element.strextra1 + " input").attr("idTipo", element.intidTipo)

            });

            $('#allTipos').on('change', function () {
                _listaConcepto = []
                if ($('#allTipos').is(':checked')) {
                    $(".flatTipo").prop('checked', true);
                    $(".borderFechas2").show();
                } else {
                    $(".flatTipo").prop('checked', false);
                    $(".borderFechas2").hide();
                }
                showHide()
            });

            $(".flatTipo").on('click', function () {
                showHide()
            })

        });

    // Cargar Marcador
    $.post(
        '/Personal/ListarCombosPersonal',
        { intIdMenu: 0, strEntidad: 'TGMARCADOR', intIdFiltroGrupo: _codigo, strGrupo: 'TGMARCADOR', strSubGrupo: 'MARCA' },
        (response) => {
            $('#IdMarcadorNew').empty();
            $('#IdMarcadorNew').append('<option value="0" selected>Seleccione</option>');

            response.forEach(element => {
                $('#IdMarcadorNew').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');
            });

        });

    // Cargar Motivo
    $.post(
        '/Personal/ListarCombosPersonal',
        { intIdMenu: 0, strEntidad: 'TGMOTIVO', intIdFiltroGrupo: 0, strGrupo: 'TGMOTIVO', strSubGrupo: '' },
        (response) => {
            $('#IdMotivoNew').empty();
            $('#IdMotivoNew').append('<option value="0" selected>Seleccione</option>');

            response.forEach(element => {
                $('#IdMotivoNew').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');
            });

        });

    MarcasAutomatica()

};

$("#btn-save-change-AusentismosCom").click(function () {
    validarSession()
    var IdMarcadorNew = $('#IdMarcadorNew').val();
    var IdMotivoNew = $('#IdMotivoNew').val();

    var fechasVisibles = $(".borderFechas2").find("div.col-sm-6:visible").length;
    $(".borderFechas2 .col-sm-6:hidden").find("input").val("")

    var dateEntrada = $("#dateEntrada").find("input").val();
    var dateSalida = $("#dateSalida").find("input").val();
    var dateSalidaRe = $("#dateSalidaRe").find("input").val();
    var dateEntradaRe = $("#dateEntradaRe").find("input").val();
    var dateEntradaHE = $("#dateEntradaHE").find("input").val();
    var dateSalidaHE = $("#dateSalidaHE").find("input").val();

    var BitDiaNew = 0
    if ($('#BitDiaNew').is(":checked")) { BitDiaNew = 1; }

    dateEntrada = "0" + dateEntrada
    var BitDiaSgt02 = 0
    if ($('#BitDiaSgt02').is(":checked")) { BitDiaSgt02 = 1; }
    dateSalida = BitDiaSgt02 + dateSalida
    var BitDiaSgt03 = 0
    if ($('#BitDiaSgt03').is(":checked")) { BitDiaSgt03 = 1; }
    dateSalidaRe = BitDiaSgt03 + dateSalidaRe
    var BitDiaSgt04 = 0
    if ($('#BitDiaSgt04').is(":checked")) { BitDiaSgt04 = 1; }
    dateEntradaRe = BitDiaSgt04 + dateEntradaRe
    var BitDiaSgt05 = 0
    if ($('#BitDiaSgt05').is(":checked")) { BitDiaSgt05 = 1; }
    dateEntradaHE = BitDiaSgt05 + dateEntradaHE
    var BitDiaSgt06 = 0
    if ($('#BitDiaSgt06').is(":checked")) { BitDiaSgt06 = 1; }
    dateSalidaHE = BitDiaSgt06 + dateSalidaHE

    if (IdMarcadorNew == 0) {

        new PNotify({
            title: 'Marcador',
            text: 'Seleccionar un marcador',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });

        return;
    }
    //if (IdMotivoNew == 0) {

    //    new PNotify({
    //        title: 'Motivo',
    //        text: 'Seleccionar un motivo',
    //        type: 'info',
    //        delay: 3000,
    //        styling: 'bootstrap3',
    //        addclass: 'dark'
    //    });

    //    return;
    //}
    if (fechasVisibles == 0) {

        new PNotify({
            title: 'Tipo de Marca',
            text: 'Seleccione al menos 1 tipo de Marca',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });

        return;
    }

    var Asistencia = {
        intIdPersonal: _codigo
        , strFotoCheck: _fotoCheck
        , intTipoIngreso: '1'
        , intIdMarcador: IdMarcadorNew
        , intIdMotivo: IdMotivoNew
        , biFlMarcaForzada: 0
    }

    var fechas_val = $(".borderFechas2 .col-sm-6:visible").find(".input-group")
    var observado = false;
    fechas_val.each(function (index) {
        if ($(this).find("input").val() == "") {
            new PNotify({
                title: 'Tipo de Marca',
                text: 'No puede enviar tipo de marcas vacios',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3',
                addclass: 'dark'
            });
            observado = true;
            return false;
        }
    });
    if (observado) {
        return;
    }
    var fechas = []

    fechas.push(
        {
            key: "dateEntrada",
            value: dateEntrada,
            codigo: $("#dateEntrada input").attr("idtipo"),
            fecha: $("#dateEntrada input").attr("fecha")
        },
        {
            key: "dateSalida",
            value: dateSalida,
            codigo: $("#dateSalida input").attr("idtipo"),
            fecha: $("#dateSalida input").attr("fecha")
        },
        {
            key: "dateSalidaRe",
            value: dateSalidaRe,
            codigo: $("#dateSalidaRe input").attr("idtipo"),
            fecha: $("#dateSalidaRe input").attr("fecha")
        },
        {
            key: "dateEntradaRe",
            value: dateEntradaRe,
            codigo: $("#dateEntradaRe input").attr("idtipo"),
            fecha: $("#dateEntradaRe input").attr("fecha")
        },
        {
            key: "dateEntradaHE",
            value: dateEntradaHE,
            codigo: $("#dateEntradaHE input").attr("idtipo"),
            fecha: $("#dateEntradaHE input").attr("fecha")
        },
        {
            key: "dateSalidaHE",
            value: dateSalidaHE,
            codigo: $("#dateSalidaHE input").attr("idtipo"),
            fecha: $("#dateSalidaHE input").attr("fecha")
        }
    );
    console.log(fechas)
    $.post(
        '/Asistencia/Guardar',
        {
            objAsistencia: Asistencia,
            fechas
        },
        (response) => {
            console.log(response)
            if (response.type == 'success') {
                new PNotify({
                    title: 'Insertar Marca Manual',
                    text: response.message,
                    type: response.type,
                    delay: 3000,
                    styling: 'bootstrap3'
                });

                $("#btn-cancel-AusentismosCom").click()

                return;
            }
            else {
                if (response.objeto.length > 0) {

                    var html = "<div class='container'>";

                    response.objeto.forEach(element => {
                        html += `<div>
                        <span>${element.key} --> ${element.value}</span>
                        </div>`
                    });
                    html += "</div>"
                    //swal({
                    //    title: "Eliminar Papeleta de salida",
                    //    text: "¿Está seguro de eliminar la papeleta de salida ''<strong>" + strDesConcepto + "</strong>''   para la fecha  " + strfeca + "?",
                    //    type: "warning",
                    //    showCancelButton: true,
                    //    confirmButtonText: "Sí, eliminar",
                    //    cancelButtonText: "No, cancelar",
                    //})
                    swal({
                        title: 'Fechas observadas',
                        type: 'info',
                        html: html

                    })

                    return;
                } else {
                    new PNotify({
                        title: 'Registro Marca Manual',
                        text: response.objeto[0].strObservacion,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                    return;
                }
            }
        }
    );
})

$(document).ready(function () {

    CombosMarcaManual();

    //const fechaInicioAsigHor = moment().subtract(10, 'year').startOf('year').format('DD/MM/YYYY');
    //const fechaFinAsigHor = moment().subtract(0, "year").endOf("year").format('DD/MM/YYYY');
    //traerDatosMarcaManual(fechaInicioAsigHor, fechaFinAsigHor);
    traerDatosMarcaManual();
    //$('#campJerar').data('daterangepicker').setStartDate('03/01/2014');
    //$('#campJerar').data('daterangepicker').setEndDate('31/01/2014');

})
