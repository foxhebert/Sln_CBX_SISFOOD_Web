/*
    JavaScript Empleado
    ===================

    1. Listado de datos en DataTable
    2. Registro de empleados
    3. Editar empleados
    3. Eliminar Empleado
*/

function configEmpleadoInicial() {
    const intIdMenu = localStorage.getItem('idsubmenu') && !isNaN(localStorage.getItem('idsubmenu')) ? Number(localStorage.getItem('idsubmenu')) : 1
    const formatoFecha = 'DD/MM/YYYY'
    const dataTableId = 'TablaPersonal'
    const tituloNuevoRegistro = 'Registro Empleado'
    const tituloEliminarRegistro = 'Eliminar Empleado'
    const rangeDateInicial = {
        startDate: moment().subtract(10, 'year'),
        endDate: moment(),
    }

    return {
        intIdMenu,
        formatoFecha,
        dataTableId,
        tituloNuevoRegistro,
        tituloEliminarRegistro,
        rangeDateInicial,
    }
}

/*
   =====INICIO==> Inicializar controles
*/

$(document).ready(function() {
    if ($('#filtroFechaRangeEmpleado').length) {
        const { rangeDateInicial } = configEmpleadoInicial()
        init_daterangepicker_custom('filtroFechaRangeEmpleado', rangeDateInicial)
    }
    $.fn.inputFilter = function(inputFilter) {
        return this.on('input keydown keyup mousedown mouseup select contextmenu drop', function() {
            if (inputFilter(this.value)) {
                this.oldValue = this.value
                this.oldSelectionStart = this.selectionStart
                this.oldSelectionEnd = this.selectionEnd
            } else if (this.hasOwnProperty('oldValue')) {
                this.value = this.oldValue
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
            } else {
                this.value = ''
            }
        })
    }
})

/*
   =====FIN==> Inicializar controles
*/

function messageResponseMix(data, title) {
    if (data.type === 'success') {
        new PNotify({
            title: title,
            text: data.message,
            type: 'success',
            delay: 3000,
            styling: 'bootstrap3',
        })
    } else if (data.type === 'error') {
        new PNotify({
            title: title,
            text: data.message,
            type: 'error',
            delay: 3000,
            styling: 'bootstrap3',
        })
    } else if (data.type === 'info') {
        new PNotify({
            title: title,
            text: data.message,
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark',
        })
    } else if (data.type === 'infoc') {
        new PNotify({
            title: title,
            text: data.message,
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
        })
    } else {
        new PNotify({
            title: title,
            text: data.message,
            type: 'error',
            delay: 3000,
            styling: 'bootstrap3',
        })
    }
}

function getDateRangePickerEmpleado() {
    const { formatoFecha } = configEmpleadoInicial()
    const idRange = '#filtroFechaRangeEmpleado'
    const fechaInicio = $(idRange)
        .data('daterangepicker')
        .startDate.format(formatoFecha)
    const fechaFin = $(idRange)
        .data('daterangepicker')
        .endDate.format(formatoFecha)
    return { fInicio: fechaInicio, fFin: fechaFin }
}

$('#filActiEmpleado').on('change', function() {
    const date = getDateRangePickerEmpleado()
    traerDatosEmpleados(date.fInicio, date.fFin)
})

$('#filtroEmpleado').keyup(function() {
    const date = getDateRangePickerEmpleado()
    traerDatosEmpleados(date.fInicio, date.fFin)
})

$('#filtroFechaRangeEmpleado').on('apply.daterangepicker', function(ev, picker) {
    const { formatoFecha } = configEmpleadoInicial()
    const filtrojer_ini2 = picker.startDate.format(formatoFecha)
    const filtrojer_fin2 = picker.endDate.format(formatoFecha)
    traerDatosEmpleados(filtrojer_ini2, filtrojer_fin2)
})

async function cboResponsableInmediato(strEntidad, strGrupo) {
    const { intIdMenu } = configEmpleadoInicial()

    const dataResponsable = await $.post('/Personal/ListarComboGlobal', {
        intIdMenu: intIdMenu,
        strEntidad: strEntidad,
        intIdFiltroGrupo: 0,
        strGrupo: strGrupo,
        strSubGrupo: '',
    })
    if (dataResponsable.length) {
        $('#cboResponsableInmediato').empty()
        $('#cboResponsableInmediato').attr('disabled', false)
        dataResponsable.forEach(element => {
            $('#cboResponsableInmediato').append('<option value="' + element.intId + '"   >' + element.strDescripcion + '</option>')
        })
        $('#cboResponsableInmediato').select2({
            placeholder: 'Seleccione',
            allowClear: true,
        })
    }

    //console.log(dataResponsable)
}

function validarEmpleadoControlesEmpleadop() {
    const { intIdMenu } = configEmpleadoInicial()
    const soloLetrasinputFilter = /^[a-zA-Z\sáéíóú]*$/
    $('#celularEmpleado').inputFilter(function(value) {
        return /^-?\d*$/.test(value)
    })
    $('#txtNumDoc').inputFilter(function(value) {
        return /^\S*$/.test(value)
    })
    $('#fotocheckPersonal').inputFilter(function(value) {
        return /^\S*$/.test(value)
    })
    $('#codigoExterno').inputFilter(function(value) {
        return /^\S*$/.test(value)
    })
    $('#txtApePat').inputFilter(function(value) {
        return soloLetrasinputFilter.test(value)
    })
    $('#txtApeMat').inputFilter(function(value) {
        return soloLetrasinputFilter.test(value)
    })
    $('#txtNombres').inputFilter(function(value) {
        return soloLetrasinputFilter.test(value)
    })
}

function limpiarControlesEmpleado() {
    $('#txtNumDoc').attr('disabled', false)
    $('#txtNumDoc').val('')
    $('#fechaDeCeseValidar').val('')
    $('#fechaDefechaAdmision').val('')
    $('#DNI_PER').val(0)
    $('#txtApePat').val('')
    $('#txtApeMat').val('')
    $('#txtNombres').val('')
    $('#txtFechaNac').val('')
    $('#TipVia').val(0)
    $('#TXTTIPVIA').val('')
    $('#txtFechaAdmi').val('')
    $('#VistaPrevia').html(`<img id="imgCarga"  src="/DirEmpleadosRuta/descarga(1).jpg" class="img-rounded img-logo-empleado"/>`)
    $('#txtRutaEmple').val('')
    $('#txtUbigeo').val('')
    $('#txtIntidUbigeo').val('')
    $('#chck_mas').iCheck('check')
    $('#Email_Emple').val('')
    $('#celularEmpleado').val('')
    $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value=""  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
    $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
    var mailformatEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/

    $('#tagsEmail').tagsInput({
        width: 'auto',
        defaultText: 'Correos',
        placeholderColor: '#666666',
        pattern: mailformatEmail,
        interactive: true,
    })
    $('#tagsTelefono').tagsInput({
        width: 'auto',
        defaultText: 'Teléfonos',
        placeholderColor: '#666666',
        pattern: /^\d{9}$/,
        interactive: true,
    })
    $('#fotocheckPersonal').val('')
    $('#codigoExterno').val('')
    $('#comboFiscalizacion').val(0)
    $('#nivelDeResponsabilidad').val(0)
    $('#cargoEmpleado').val(0)
    $('#planillaEmpleado').val(0)
    $('#categoriaEmpleado').val(0)
    $('#tipoDePersonal').val(0)
    $('#tgGrupoRegistro').val(0)
    $('#centroDeCosto').val(0)
    $('#cboDependencia').val(0)
    $('#unidadOrganizacionalCbo').val(0)
    $('#contradoIndeterminado').iCheck('uncheck')
    $('#codigoPensionista').val('')
    $('#codigoDeSalud').val('')
    $('#reglaDeNegocio').val(0)
    $('#tgHorarioFijo').val(0)
    $('#activarUsuarioCbo').iCheck('uncheck')
    $('#fechaCeseChecbox').iCheck('uncheck')
    $('#txtFechaCese').val('')
    $('#mativoDeCese').val(0)
    $('#tgTgGrupoliq').val(0)
    $('#strPersonalCampo1').val('')
    $('#strPersonalCampo2').val('')
    $('#strPersonalCampo3').val('')
    $('#strPersonalCampo4').val('')
    $('#strPersonalCampo5').val('')
    $('#marcadorMultiple option:selected').removeAttr('selected')
    // $('#txtFechaAdmi').
    // $('#cboResponsableInmediato').val(0)
    // $('#cboResponsableContractual').val(0)
}

function CombosEmpleado() {
    const { intIdMenu } = configEmpleadoInicial()
    const soloLetrasinputFilter = /^[a-zA-Z\sáéíóú]*$/

    cboResponsableInmediato('TGPERSONALINMEDIATOOLIDERAZGO', 'TGPERSONAL')
    $('#cboResponsableInmediato').empty()
    $('#cboResponsableInmediato').append('<option value="0">Seleccione</option>')

    $('#unidadOrganizacionalCbo').empty()
    $('#unidadOrganizacionalCbo').attr('disabled', false)
    $('#unidadOrganizacionalCbo').append('<option value="0">Seleccione</option>')
    $('#cboResponsableInmediato').select2({
        placeholder: 'Seleccione',
        allowClear: true,
    })
    validarEmpleadoControlesEmpleadop()

    $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value=""  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)

    $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)

    var mailformatEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    $('#tagsEmail').tagsInput({
        width: 'auto',
        defaultText: 'Correos',
        placeholderColor: '#666666',
        pattern: mailformatEmail,
    })
    $('#tagsTelefono').tagsInput({
        width: 'auto',
        defaultText: 'Teléfonos',
        placeholderColor: '#666666',
        pattern: /^\d{9}$/,
    })

    $.post(
        '/Personal/ListarComboGlobal',
        {
            intIdMenu: intIdMenu,
            strEntidad: 'TGPERSONALCONTRACTUAL',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGPERSONAL',
            strSubGrupo: '',
        },
        response => {
            $('#cboResponsableContractual').empty()
            $('#cboResponsableContractual').attr('disabled', false)
            response.forEach(element => {
                $('#cboResponsableContractual').append('<option value="' + element.intId + '"   >' + element.strDescripcion + '</option>')
            })
            $('#cboResponsableContractual').select2({
                placeholder: 'Seleccione',
                allowClear: true,
            })
        }
    )

    $('#nivelDeResponsabilidad').change(function() {
        let valinfo = $(this).val()
        if (valinfo == '0') {
            messageResponseMix({ type: 'info', message: 'Seleccione un Nivel de Responsabilidad' }, 'Registro Empleado')
            return false
            // 9 Inmediata o de Liderazgo
            // 10 Contractual
            // 11 Ambas (I+C)
            // 12 Ninguna
        }

        // $('#cboResponsableInmediato').attr('disabled', false)
        // $('#cboResponsableInmediato').select2({
        //     placeholder: 'Seleccione',
        //     allowClear: true,
        // })
        // if (valinfo == 9) {
        // cboResponsableInmediato('TGPERSONALINMEDIATOOLIDERAZGO', 'TGPERSONAL')
        // } else if (valinfo == 10) {
        //     cboResponsableInmediato('TGPERSONALCONTRACTUAL', 'TGPERSONAL')
        // } else if (valinfo == 11) {
        //     cboResponsableInmediato('TGPERSONALAMBASIC', 'TGPERSONAL')
        // } else if (valinfo == 12) {
        //     cboResponsableInmediato('TGPERSONALAMBASIC', 'TGPERSONAL')
        // }
    })

    $.post(
        '/Personal/ListarCombos',
        {
            intIdMenu: intIdMenu,
            strEntidad: 'TGTIPO_VIA',
            intIdFiltroGrupo: 0,
            strGrupo: '',
            strSubGrupo: '',
        },
        response => {
            $('#TipVia').empty()
            $('#TipVia').attr('disabled', false)
            $('#TipVia').append('<option value="0">Via</option>')
            response.forEach(element => {
                $('#TipVia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })
        }
    )

    $.post(
        '/Personal/ListarComboGlobal',
        {
            intIdMenu: intIdMenu,
            strEntidad: 'TSTIPDOC02',
            intIdFiltroGrupo: 0,
            strGrupo: 'PER',
            strSubGrupo: '',
        },
        response => {
            $('#cboUndOrg').empty()
            $('#cboUndOrg').attr('disabled', false)
            response.forEach(element => {
                $('#TipoDoc').append('<option value="' + element.intId + '" maxdata="' + element.strCodigo + '"  >' + element.strDescripcion + '</option>')
            })
        }
    )

    $('#TipoDoc').change(function() {
        const valorDoc = $(this).val()
        $('#txtNumDoc').val('')
        let maxdata = $('option:selected', this).attr('maxdata')

        if (valorDoc == '' || valorDoc == '0') {
            messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, 'Registro Empleado')
            $('#txtNumDoc').prop('disabled', true)
            $('#txtNumDoc').removeAttr('maxlength')
            $('#txtNumDoc').removeAttr('minlength')
        } else {
            $('#txtNumDoc').prop('disabled', false)
            if (maxdata == '0') {
                $('#txtNumDoc').removeAttr('maxlength')
                $('#txtNumDoc').removeAttr('minlength')
            } else {
                $('#txtNumDoc').attr('maxlength', maxdata)
                $('#txtNumDoc').attr('minlength', maxdata)
            }
        }
    })

    $.post(
        '/Personal/ListarCombos',
        {
            intIdMenu: intIdMenu,
            strEntidad: 'TGPAIS',
            intIdFiltroGrupo: 0,
            strGrupo: 'EXISTE',
            strSubGrupo: '',
        },
        response => {
            $('#CboPais').empty()
            $('#CboPais').attr('disabled', false)
            $('#CboPais').append('<option value="0">Seleccione</option>')

            response.forEach(element => {
                $('#CboPais').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })
        }
    )

    $('#CboPais').on('change', function() {
        var Valxpais = $('#CboPais').val()

        $.post(
            '/Personal/ListarCombos',
            {
                intIdMenu: intIdMenu,
                strEntidad: 'TGUBIGEO',
                intIdFiltroGrupo: Valxpais,
                strGrupo: 'DEPART',
                strSubGrupo: '',
            },
            response => {
                $('#CboRegion').empty()
                $('#CboRegion').attr('disabled', false)
                $('#CboRegion').append('<option value="0">Seleccione</option>')

                response.forEach(element => {
                    $('#CboRegion').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                })
            }
        )
    })

    $('#CboRegion').on('change', function() {
        var Valxpais = $('#CboRegion').val()
        $.post(
            '/Personal/ListarCombos',
            {
                intIdMenu: intIdMenu,
                strEntidad: 'TGUBIGEO',
                intIdFiltroGrupo: Valxpais,
                strGrupo: 'REG',
                strSubGrupo: '',
            },
            response => {
                $('#CboProvincia').empty()
                $('#CboProvincia').attr('disabled', false)
                $('#CboProvincia').append('<option value="0">Seleccione</option>')

                response.forEach(element => {
                    $('#CboProvincia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                })
            }
        )
    })

    $('#CboProvincia').on('change', function() {
        var Valxpais = $('#CboProvincia').val()
        $.post(
            '/Personal/ListarCombos',
            {
                intIdMenu: intIdMenu,
                strEntidad: 'TGUBIGEO',
                intIdFiltroGrupo: Valxpais,
                strGrupo: 'DIST',
                strSubGrupo: '',
            },
            response => {
                $('#CboDistrito').empty()
                $('#CboDistrito').attr('disabled', false)
                $('#CboDistrito').append('<option value="0">Seleccione</option>')
                response.forEach(element => {
                    $('#CboDistrito').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                })
            }
        )
    })

    $.post(
        '/Personal/ListarComboGlobal',
        {
            intIdMenu: 1,
            strEntidad: 'TGMOTIVOREGISTRO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGMOTIVO',
            strSubGrupo: '',
        },
        response => {
            $('#mativoDeCese').empty()
            $('#mativoDeCese').append('<option value="0">Seleccione</option>')
            response.forEach(item => {
                $('#mativoDeCese').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }
    )

    $.post(
        '/Personal/ListarCombos',
        {
            intIdMenu: intIdMenu,
            strEntidad: 'TGJERARQORG',
            intIdFiltroGrupo: 0,
            strGrupo: 'DEPEN',
            strSubGrupo: '',
        },
        response => {
            $('#cboDependencia').empty()
            $('#cboDependencia').attr('disabled', false)
            $('#cboDependencia').append('<option value="0">Seleccione</option>')
            response.forEach(element => {
                $('#cboDependencia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })
        }
    )

    $('#cboDependencia').change(function() {
        let idDependencia = $(this).val()
        if (idDependencia == '0') {
            messageResponseMix({ type: 'info', message: 'Seleccione una Dependencia ' }, 'Registro Empleado')
            return false
        }
        $.post('/Organizacion/getUnidxJerarquia', { IntIdJerOrg: idDependencia }, response => {
            $('#unidadOrganizacionalCbo').empty()
            $('#unidadOrganizacionalCbo').attr('disabled', false)
            $('#unidadOrganizacionalCbo').append('<option value="0">Seleccione</option>')
            response.forEach(element => {
                $('#unidadOrganizacionalCbo').append('<option value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>')
            })
        }).fail(function(result) {
            alert('ERROR ' + result.status + ' ' + result.statusText)
        })
    })

    $('#fechaCeseChecbox').on('ifChanged', function() {
        if ($('#fechaCeseChecbox').is(':checked') == true) {
            $('#tgTgGrupoliq').attr('disabled', false)
            $('#txtFechaCese').attr('disabled', false)
            $('#mativoDeCese').attr('disabled', false)
        } else if ($('#fechaCeseChecbox').is(':checked') == false) {
            $('#tgTgGrupoliq').attr('disabled', true)
            $('#txtFechaCese').attr('disabled', true)
            $('#mativoDeCese').attr('disabled', true)
        }
    })

    //busqueda validacion

    $('#txtNumDoc').keypress(function(e) {
        // $.post(
        //     '/Personal/ListarCombos',
        //     {
        //         strEntidad: 'TGPERSONAL',
        //         intIdFiltroGrupo: 0,
        //         strGrupo: 'EXISTE',
        //         strSubGrupo: '',
        //     },
        //     response => {
        //         $('#DNI_PER').empty()
        //         $('#DNI_PER').attr('disabled', false)
        //         $('#DNI_PER').append('<option value="0">Seleccione</option>')

        //         response.forEach(element => {
        //             $('#DNI_PER').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
        //         })
        //     }
        // )
        $('#intIdPersonalReg').val('0')
        $('#fechaDeCeseValidar').val('')
        $('#fechaDefechaAdmision').val('')
        var ValidaDocum = $('#DNI_PER').val()

        if (e.which == 13) {
            $('#intIdPersonalReg').val('0')
            $('#fechaDeCeseValidar').val('')
            $('#fechaDefechaAdmision').val('')
            if ($('#TipoDoc').val() == '0') {
                messageResponseMix({ type: 'info', message: 'Seleccione un tipo de documento' }, 'Registro Empleado')
                $('#TipoDoc').focus()
                return false
            }

            let fechaMostrarPorDefecto = moment().format('DD/MM/YYYY')
            $('#txtFechaAdmi').val(fechaMostrarPorDefecto)

            var NumDoc = $('#txtNumDoc').val()

            if (NumDoc == '') {
            } else if (NumDoc !== '') {
                var IntIdPersonaleValida = null
                var codPersonalHideen = null
                var numRegistroPersonalHideen = null
                var intIdTipDocConsulta = 1
                var fechaDeCeseValidar = null

                if ($('#TipoDoc').val() != '0') {
                    intIdTipDocConsulta = $('#TipoDoc').val()
                }
                $.post(
                    '/Personal/ValidarDocIdentidad',
                    {
                        intIdTipDoc: Number(intIdTipDocConsulta),
                        strNumDoc: NumDoc,
                    },
                    response => {
                        if (response.length) {
                            let data = response[0]
                            if (data.hasOwnProperty('intIdPersonal')) {
                                IntIdPersonaleValida = data.intIdPersonal

                                codPersonalHideen = data.strCodPersonal

                                messageResponseMix({ type: 'info', message: data.strObservacion }, 'Valida Empleado')

                                $('#intIdPersonalReg').val(IntIdPersonaleValida)
                                $('#intTipoOperacion').val('1')
                                $('#codPersonalHideen').val(codPersonalHideen)
                                $('#numRegistroPersonalHideen').val(data.strNumRegist.trim())
                                numRegistroPersonalHideen = data.strNumRegist.trim()
                                $('#codigoDeRegistro').val(data.strCodPersonal.trim() + '-' + data.strNumRegist.trim())
                                // validando documento inicio
                                if (data.intExiste == 1) {
                                    return false
                                }
                                $('#DNI_PER option')
                                    .filter(function() {
                                        return this.text == String(NumDoc)
                                    })
                                    .attr('selected', true)

                                ValidaDocum = $('#DNI_PER').val()

                                if (ValidaDocum !== '0') {
                                    const valorDocumento = $('#txtNumDoc').val()

                                    $('#txtNumDoc').attr('disabled', true)
                                    $('#Mensaje_Info').html(`${data.strObservacion}`)
                                    $('#msgVerifDoc').html('&nbsp;&nbsp;&nbsp;<i class="fa fa-lock" style="color:green;font-size:25px;" id="HabNumDoc"></i>')

                                    // alert(IntIdPersonaleValida);

                                    $.post(
                                        '/Personal/ObtenerRegistroEmpleado',
                                        {
                                            intIdPersonal: IntIdPersonaleValida,
                                        },
                                        response => {
                                            response.forEach(element => {
                                                $('#fechaDeCeseValidar').val(element.dttFecCese)
                                                $('#fechaDefechaAdmision').val(element.dttFecAdmin)

                                                fechaDeCeseValidar = element.dttFecCese
                                                $('#txtApePat').val(element.strApePaterno)
                                                $('#txtApeMat').val(element.strApeMaterno)
                                                $('#txtNombres').val(element.strNombres)
                                                $('#txtFechaNac').val(element.dttFecNacim)
                                                $('#TipVia').val(element.intIdTipoVia)
                                                $('#TXTTIPVIA').val(element.strDireccion)
                                                //$('#txtFechaAdmi').val(element.dttFecAdmin)

                                                if (element.bitflSexo == true) {
                                                    $('#chck_mas').iCheck('check')
                                                    //$('#chck_fem').iCheck('uncheck');
                                                } else if (element.bitflSexo == false) {
                                                    $('#chck_fem').iCheck('check')
                                                    // $('#chck_mas').iCheck('uncheck');
                                                }

                                                $('#CboPais').val(element.intIdUbiSupPais)

                                                $('#fotocheckPersonal').val(element.strFotocheck)

                                                $('#txtIntidUbigeo').val(element.intIdUbigeo)

                                                $('#Mensaje_Info').css('color', 'green')

                                                if (element.imgFoto != null) {
                                                    $('#VistaPrevia').html(`<img id="imgCarga"  src="/DirEmpleadosRuta/${element.imgFoto}" class="img-rounded img-logo-empleado"/>`)
                                                    $('#txtRutaEmple').val(element.imgFoto)
                                                } else {
                                                    $('#VistaPrevia').html(`<img id="imgCarga"  src="/DirEmpleadosRuta/descarga(1).jpg" class="img-rounded img-logo-empleado"/>`)
                                                    $('#txtRutaEmple').val('')
                                                }

                                                var INTIDTPEVAL = $('#txtIntidUbigeo').val()
                                                var INTIDSUPUBI = element.intIdUbigSup
                                                var INTIDSUPUBIREGION = element.intIdUbiSupReg
                                                var intIdProvinciaMostrar = element.intIdUbiReg
                                                var intIdRegionMostrar = element.intIdUbiPais

                                                $.post(
                                                    '/Personal/ListarCombos',
                                                    {
                                                        strEntidad: 'TGUBIGEO',
                                                        intIdFiltroGrupo: element.intIdUbiSupPais,
                                                        strGrupo: 'DEPART',
                                                        strSubGrupo: '',
                                                    },
                                                    response => {
                                                        console.log(response)
                                                        $('#CboRegion').empty()
                                                        $('#CboRegion').attr('disabled', false)
                                                        $('#CboRegion').append('<option >Seleccione</option>')
                                                        response.forEach(element => {
                                                            $('#CboRegion').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                                                            if (element.intidTipo == intIdRegionMostrar) {
                                                                $('#CboRegion').val(element.intidTipo)
                                                            }
                                                        })
                                                    }
                                                )

                                                $.post(
                                                    '/Personal/ListarCombos',
                                                    {
                                                        strEntidad: 'TGUBIGEO',
                                                        intIdFiltroGrupo: INTIDSUPUBI,
                                                        strGrupo: 'DIST',
                                                        strSubGrupo: '',
                                                    },
                                                    response => {
                                                        $('#CboDistrito').empty()
                                                        $('#CboDistrito').attr('disabled', false)
                                                        $('#CboDistrito').append('<option >Seleccione</option>')
                                                        response.forEach(element => {
                                                            $('#CboDistrito').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                                                            if (element.intidTipo == INTIDTPEVAL) {
                                                                $('#CboDistrito').val(element.intidTipo)
                                                                $('#txtUbigeo').val(element.strDeTipo)
                                                                $('#txtUbigeo').attr('disabled', true)
                                                            }
                                                        })
                                                    }
                                                )

                                                $.post(
                                                    '/Personal/ListarCombos',
                                                    {
                                                        strEntidad: 'TGUBIGEO',
                                                        intIdFiltroGrupo: INTIDSUPUBIREGION,
                                                        strGrupo: 'REG',
                                                        strSubGrupo: '',
                                                    },
                                                    response => {
                                                        $('#CboProvincia').empty()
                                                        $('#CboProvincia').attr('disabled', false)
                                                        $('#CboProvincia').append('<option >Seleccione</option>')
                                                        response.forEach(element => {
                                                            $('#CboProvincia').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                                                            if (element.intidTipo == intIdProvinciaMostrar) {
                                                                $('#CboProvincia').val(element.intidTipo)
                                                            }
                                                        })
                                                    }
                                                )

                                                var NumeroAleatorio = Math.floor(Math.random() * (999 - 99)) + 99
                                                var PrimeraLetraNombre = element.strNombres.substring(0, 1)
                                                var TresPrimerasLetrasApePater = element.strApeMaterno.substring(0, 3)
                                                var TresPrimerosNumerosDI = element.strNumDoc.substring(0, 3)

                                                let codPersonalUsuario = PrimeraLetraNombre + '' + TresPrimerasLetrasApePater + '' + NumeroAleatorio + '' + TresPrimerosNumerosDI
                                                //$('#codigoDeRegistro').val(codPersonalUsuario.toUpperCase() + '-' + numRegistroPersonalHideen)
                                            })
                                        }
                                    )

                                    $('#HabNumDoc').on('click', function() {
                                        swal({
                                            title: 'Cambiar Doc. Identidad',
                                            text: 'Se perdera toda la información ingresada',
                                            type: 'warning',
                                            showCancelButton: true,
                                            confirmButtonText: 'Sí, cambiar',
                                            cancelButtonText: 'No, cancelar',
                                        }).then(function(isConfirm) {
                                            if (isConfirm) {
                                                $('#txtNumDoc').attr('disabled', false)
                                                $('#txtNumDoc').val('')
                                                $('#fechaDeCeseValidar').val('')
                                                $('#fechaDefechaAdmision').val('')
                                                $('#DNI_PER').val(0)
                                                $('#msgVerifDoc').html('&nbsp;&nbsp;&nbsp;<i class="fa fa-unlock" style="color:red;font-size:25px;"></i>')

                                                limpiarControlesEmpleado()
                                            } else {
                                                swal('Cancelled', 'Your imaginary file is safe :)', 'error')
                                            }
                                        })
                                    })
                                } else if (ValidaDocum == '0') {
                                    $('#DNI_PER').val(0)
                                    $('#txtNumDoc').attr('disabled', true)
                                    $('#msgVerifDoc').html('&nbsp;&nbsp;&nbsp;<i class="fa fa-lock" style="color:green;font-size:25px;" id="HabNumDoc"></i>')
                                    $('#Mensaje_Info').html('Complete sus Datos (*)')

                                    $('#HabNumDoc').on('click', function() {
                                        swal({
                                            title: 'Cambiar Doc. Identidad',
                                            text: 'Se perdera toda la información ingresada',
                                            type: 'warning',
                                            showCancelButton: true,
                                            confirmButtonText: 'Sí, cambiar',
                                            cancelButtonText: 'No, cancelar',
                                        }).then(function(isConfirm) {
                                            if (isConfirm) {
                                                $('#txtNumDoc').attr('disabled', false)
                                                $('#txtNumDoc').val('')
                                                $('#fechaDeCeseValidar').val('')
                                                $('#fechaDefechaAdmision').val('')
                                                $('#DNI_PER').val(0)
                                                $('#msgVerifDoc').html('&nbsp;&nbsp;&nbsp;<i class="fa fa-unlock" style="color:red;font-size:25px;"></i>')
                                                limpiarControlesEmpleado()
                                            } else {
                                                swal('Cancelled', 'Your imaginary file is safe :)', 'error')
                                            }
                                        })
                                    })
                                }
                                // validando documento fin
                            } else {
                                $('#intTipoOperacion').val('1')
                                $('#fechaDeCeseValidar').val('')
                                $('#fechaDefechaAdmision').val('')
                                $('#txtNumDoc').attr('disabled', false)
                                $('#txtNumDoc').val('')
                                $('#DNI_PER').val(0)
                                $('#msgVerifDoc').html('&nbsp;&nbsp;&nbsp;<i class="fa fa-unlock" style="color:red;font-size:25px;"></i>')
                                limpiarControlesEmpleado()
                            }
                        } else if (response.type == 'success') {
                            let dataObjet = response.objeto
                            let fechaMostrarPorDefecto = moment().format('DD/MM/YYYY')
                            $('#txtFechaAdmi').val(fechaMostrarPorDefecto)

                            $('#intTipoOperacion').val('1')
                            $('#fechaDeCeseValidar').val('')
                            $('#fechaDefechaAdmision').val('')
                            $('#txtNumDoc').attr('disabled', true)
                            $('#TipoDoc').attr('disabled', true)
                            $('#msgVerifDoc').html('&nbsp;&nbsp;&nbsp;<i class="fa fa-lock" style="color:green;font-size:25px;" id="HabNumDoc"></i>')
                            //messageResponseMix({ type: 'error', message: response.message }, 'Registro Empleado')
                            $('#codPersonalHideen').val(dataObjet.strCodPersonal.trim())
                            $('#numRegistroPersonalHideen').val(dataObjet.strNumRegist.trim())
                            $('#codigoDeRegistro').val(dataObjet.strCodPersonal.trim() + '-' + dataObjet.strNumRegist.trim())
                            $('#DNI_PER').val(0)
                            $('#Mensaje_Info').html(`${response.message}`)
                            $('#Mensaje_Info').css('color', 'red')
                            $('#txtApePat').val('')
                            $('#txtApeMat').val('')
                            $('#txtNombres').val('')
                            $('#txtFechaNac').val('')
                            $('#TipVia').val(0)
                            $('#TXTTIPVIA').val('')
                            $('#chck_mas').iCheck('check')
                            $('#chck_fem').iCheck('uncheck')
                            $('#VistaPrevia').html(`<img id="imgCarga"  src="/DirEmpleadosRuta/descarga(1).jpg" class="img-rounded img-logo-empleado"/>`)
                            $('#txtRutaEmple').val('')

                            $('#HabNumDoc').on('click', function() {
                                swal({
                                    title: 'Cambiar Doc. Identidad',
                                    text: 'Se perdera toda la información ingresada',
                                    type: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Sí, cambiar',
                                    cancelButtonText: 'No, cancelar',
                                }).then(function(isConfirm) {
                                    if (isConfirm) {
                                        $('#TipoDoc').attr('disabled', false)
                                        $('#txtNumDoc').attr('disabled', false)
                                        $('#txtNumDoc').val('')
                                        $('#fechaDeCeseValidar').val('')
                                        $('#fechaDefechaAdmision').val('')
                                        $('#DNI_PER').val(0)
                                        $('#msgVerifDoc').html('&nbsp;&nbsp;&nbsp;<i class="fa fa-unlock" style="color:red;font-size:25px;"></i>')

                                        limpiarControlesEmpleado()
                                    } else {
                                        swal('Cancelled', 'Your imaginary file is safe :)', 'error')
                                    }
                                })
                            })
                        }
                    }
                )
            }
        }

        valor = $('#txtNumDoc').val()
    })

    //wizarEmpleadosValidacion()
}

function wizarEmpleadosValidacion(tipoOperacionPass) {
    const { intIdMenu, formatoFecha } = configEmpleadoInicial()
    let titleToast = 'Nuevo Empleado'
    if (tipoOperacionPass == 2) {
        titleToast = 'Editar Empleado'
    }
    // validacion de pasos
    var pasoUnoValidate = false
    var pasoDosValidate = false
    var pasoTresValidate = false
    var pasoCuatroValidate = false

    $('#wizarpaso2').click(function() {
        if (pasoUnoValidate) {
        } else {
            $('#wizard').smartWizard('goToStep', 1)
        }
    })

    $('#wizarpaso3').click(function() {
        if (pasoUnoValidate && pasoDosValidate) {
        } else {
            $('#wizard').smartWizard('goToStep', 2)
        }
    })

    $('#wizarpaso4').click(function() {
        if (pasoUnoValidate && pasoDosValidate && pasoTresValidate) {
        } else {
            $('#wizard').smartWizard('goToStep', 3)
        }
    })

    return pasoUnoValidate && pasoDosValidate && pasoTresValidate && pasoCuatroValidate
}
let _vartableEmpleado = null

function traerDatosEmpleados(filtrojer_ini_var = null, filtrojer_fin_var = null) {
    const datePicker = getDateRangePickerEmpleado()
    const { dataTableId, intIdMenu, formatoFecha } = configEmpleadoInicial()

    let filtrosActivo = $('#filActiEmpleado').val() != '' ? $('#filActiEmpleado').val() : 2
    let strfiltro = $('#filtroEmpleado').val()
    let filtrojer_ini = filtrojer_ini_var ? filtrojer_ini_var : datePicker.fInicio
    let filtrojer_fin = filtrojer_fin_var ? filtrojer_fin_var : datePicker.fFin

    const { loaderHtml } = APPCONFIG

    $(`#${dataTableId} tbody`).html(`<tr><td colspan="100%" ><div class="min-height-300">${loaderHtml}</div></td></tr>`)

    $.post(
        `/Personal/GetTablaPersonal`,
        {
            intIdMenu: intIdMenu,
            IntActivoFilter: filtrosActivo,
            strfilter: strfiltro,
            dttfiltrofch1: filtrojer_ini,
            dttfiltrofch2: filtrojer_fin,
        },
        response => {
            let dataJson = response

            $(`#${dataTableId} tbody`).empty()

            if (dataJson.length == 0) {
                dataJson = []
            }

            if (_vartableEmpleado !== null) {
                _vartableEmpleado.destroy()
            }

            _vartableEmpleado = $(`#${dataTableId}`).DataTable({
                data: dataJson,
                columns: [
                    { data: 'strCoPersonal' },
                    { data: 'strNombres' },
                    { data: 'strNumDoc' },
                    { data: 'dttFecAdmin' },
                    { data: 'bitEspecifica_DESC' },
                    {
                        sortable: false,
                        render: (data, type, item, meta) => {
                            return `<button class="btn btn-success btn-xs btn-edit" dataid="${item.intIdPersonal}" ><i class="fa fa-pencil"></i> Editar </button>
                                        <button class="btn btn-primary btn-xs btn-delete" dataid="${item.intIdPersonal}" des_data="${item.strNombres}"  ><i class="fa fa-trash-o"></i> Eliminar </button>`
                        },
                    },
                    { data: 'intIdPersonal' },
                ],
                lengthMenu: [10, 25, 50],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [
                    {
                        targets: [6], //IntIdJerOrg
                        visible: false,
                        searchable: false,
                    },
                ],
                order: [
                    [4, 'asc'],
                    [1, 'asc'],
                ],
                dom: 'lBfrtip',
            })
        }
    ).fail(error => {
        $(`#${dataTableId} tbody`).empty()
        $(`#${dataTableId}_info`).empty()
        $(`#${dataTableId}_paginate`).empty()
        $(`#${dataTableId} tbody`).html(`<tr><td colspan="100%" ><div class="min-height-300 flex-error"><div class="alert alert-danger">Hubo un error al listar. ${error.statusText}. Código de error: ${error.status}</div></div></td></tr>`)
    })
}

function setMaxLengthInput(id, maxLength) {
    $(`#${id}`).attr('maxlength', `${maxLength}`)
}

async function NuevoEmpleadoVista(editar) {
    const dataVista = await $.post('/Personal/NuevoEmpleado', {})
    if (dataVista !== '') {
        $('.form-hide-empleado .x_content').empty()
        $('.form-hide-empleado .x_content').html(dataVista)
        $('.form-hide-empleado').show()
        switcheryLoad()
        init_checkBox_styles()
        cargarDaterangePicker()
        init_daterangepicker()
        CombosEmpleado()
        $('#btn-save-change-empleado').prop('disabled', true)
        if (typeof $.fn.smartWizard != 'undefined') {
            $('#wizardEmpleado').smartWizard({
                selected: 0,
                enableFinishButton: true,
                enableAllSteps: true,
                onLeaveStep: leaveAStepCallbackEmpleadoRegistro,
                onFinish: onFinishCallbackEmpleado,
            })
            $('#wizard_verticle').smartWizard({
                transitionEffect: 'slide',
            })

            $('.buttonNext').hide() //.addClass('btn btn-success');
            $('.buttonPrevious').hide() //.addClass('btn btn-primary');
            $('.buttonFinish').hide() //.addClass('btn btn-default');
        }

        $('#CargarImagen').change(function(e) {
            const o = document.getElementById('CargarImagen')
            let foto = o.files[0]
            if (o.files.length == 0 || !/\.(jpeg|jpg|png|svg)$/i.test(foto.name)) {
                messageResponseMix({ type: 'infoc', message: 'Ingrese una imagen con alguno de los siguientes formatos: .jpeg/.jpg/.png.' }, 'Nuevo Empleado')
            } else {
                const img = new Image()
                img.onload = function() {
                    let widthImg = Number(this.width.toFixed(0))
                    let heightImg = Number(this.height.toFixed(0))
                    if (widthImg <= 200 && heightImg <= 200) {
                        messageResponseMix({ type: 'infoc', message: 'Las medidas deben ser mínimo: 200 x 200 px' }, 'Nuevo Empleado')
                    } else {
                        CargoImagenEmpleado()
                    }
                }

                img.src = URL.createObjectURL(foto)
            }
        })
        document.getElementById('delete').onclick = function() {
            $('#VistaPrevia').html('<img src = "/DirLogosRuta/descarga(1).jpg" />')
            $('#txtRutaEmple').val('')
            return false
        }
    }
}

async function mostrarFormNuevoEmpleado(estad) {
    const { intIdMenu } = configEmpleadoInicial()
    const dataVista = await NuevoEmpleadoVista(false)

    const camposAdicionales = await $.post('/Personal/ListarCamposAdicionales', { intIdMenu: intIdMenu, strNoEntidad: 'TGPERSONAL' })

    if (camposAdicionales.length) {
        $('#contendorCamposPersonal').empty()
        camposAdicionales.forEach(element => {
            let columHtml = `<div class="col-md-6 col-sm-6 col-xs-6">
                                <div class="form-group">
                                    <label> ${element.strTitulo}</label>
                                    <input id="${element.strNomCampo}" type="text" class="form-control " placeholder="${element.strTitulo}" maxlength="255"/>
                                </div>
                            </div>`
            $('#contendorCamposPersonal').append(columHtml)
        })
    }

    const dataCaracter = await $.post('/Personal/ListarCaracteresMax', {
        strMaestro: 'TGPERSONAL',
    })

    if (dataCaracter.length) {
        dataCaracter.forEach(item => {
            if (item.strColumnName == 'strFotocheck') {
                setMaxLengthInput('fotocheckPersonal', item.intMaxLength)
            } else if (item.strColumnName == 'strNombres') {
                setMaxLengthInput('txtNombres', item.intMaxLength)
            } else if (item.strColumnName == 'strApePaterno') {
                setMaxLengthInput('txtApePat', item.intMaxLength)
            } else if (item.strColumnName == 'strApeMaterno') {
                setMaxLengthInput('txtApeMat', item.intMaxLength)
            } else if (item.strColumnName == 'strDireccion') {
                setMaxLengthInput('TXTTIPVIA', item.intMaxLength)
            } else if (item.strColumnName == 'strPersoCampo1') {
                setMaxLengthInput('strPersonalCampo1', item.intMaxLength)
            } else if (item.strColumnName == 'strPersoCampo2') {
                setMaxLengthInput('strPersonalCampo2', item.intMaxLength)
            } else if (item.strColumnName == 'strPersoCampo3') {
                setMaxLengthInput('strPersonalCampo3', item.intMaxLength)
            } else if (item.strColumnName == 'strPersoCampo4') {
                setMaxLengthInput('strPersonalCampo4', item.intMaxLength)
            } else if (item.strColumnName == 'strPersoCampo5') {
                setMaxLengthInput('strPersonalCampo5', item.intMaxLength)
            } else if (item.strColumnName == 'strCodExterior') {
                setMaxLengthInput('codigoExterno', item.intMaxLength)
            } else if (item.strColumnName == 'strCodPensionista') {
                setMaxLengthInput('codigoPensionista', item.intMaxLength)
            } else if (item.strColumnName == 'strCodSalud') {
                setMaxLengthInput('codigoDeSalud', item.intMaxLength)
            }
        })
    }
}

$('#btn-new-empleado').on('click', function() {
    $('.form-hide-empleado').show()
    $('#btn-save-change-empleado').show()
    $('#btn-editar-empleado').hide()
    mostrarFormNuevoEmpleado(false)
})

function leaveAStepCallbackEmpleado(obj, context) {
    //alert('Leaving step ' + context.fromStep + ' to go to step ' + context.toStep)
    if (context.toStep == 4) {
        $('#btn-save-change-empleado').prop('disabled', false)
        //$('#btn-editar-empleado').prop('disabled', false)
    }
    return validateSteps(context.fromStep) // return false to stay on step and true to continue navigation
}

function leaveAStepCallbackEmpleadoRegistro(obj, context) {
    //alert('Leaving step ' + context.fromStep + ' to go to step ' + context.toStep)
    if (context.toStep == 4) {
        $('#btn-save-change-empleado').prop('disabled', false)
        //$('#btn-editar-empleado').prop('disabled', false)
    }
    return validateStepsEmpleado(context.fromStep) // return false to stay on step and true to continue navigation
}

function onFinishCallbackEmpleado(objs, context) {
    if (validateAllSteps()) {
        //$('form').submit()
        $('#btn-save-change-empleado').prop('disabled', false)
        // $('#btn-editar-empleado').prop('disabled', false)
    }
}

function validateStepsEmpleado(stepnumber) {
    const { intIdMenu, formatoFecha } = configEmpleadoInicial()
    const titleToast = 'Nuevo Empleado'

    var isStepValid = true
    // validate step 1
    if (stepnumber == 1) {
        if (
            $('#TipoDoc').val() != 0 &&
            $('#txtNumDoc').val().length > 2 &&
            $('#txtApePat').val().length > 2 &&
            $('#txtApeMat').val().length > 2 &&
            $('#txtNombres').val().length > 2 &&
            $('#txtFechaNac').val().length > 4 &&
            $("input[name='generoEmpleado']:radio").is(':checked') &&
            $('#Email_Emple').val().length > 4 &&
            ValidateEmail(getValueControl('#Email_Emple')) &&
            $('#celularEmpleado').val().length > 8
        ) {
            isStepValid = true
        } else {
            messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
            isStepValid = false
        }
    } else if (stepnumber == 2) {
        if (
            $('#fotocheckPersonal').val().length > 3 &&
            $('#txtFechaAdmi').val().length > 4 &&
            $('#comboFiscalizacion').val() != 0 &&
            $('#nivelDeResponsabilidad').val() != 0 &&
            $('#cargoEmpleado').val() != 0 &&
            $('#planillaEmpleado').val() != 0 &&
            $('#cboDependencia').val() != 0 &&
            $('#unidadOrganizacionalCbo').val() != 0
        ) {
            isStepValid = true
        } else {
            messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
            isStepValid = false
        }
    } else if (stepnumber == 3) {
        if ($('#cboResponsableInmediato').val() != 0 && $('#cboResponsableContractual').val() != 0) {
            isStepValid = true
            $('#btn-save-change-empleado').prop('disabled', false)
        } else {
            messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
            isStepValid = false
        }
    } else {
        if ($('#reglaDeNegocio').val() != 0 && $('#tgHorarioFijo').val() != 0 && getValueControl('#marcadorMultiple').length >= 1) {
            isStepValid = true
            $('#btn-save-change-empleado').prop('disabled', false)
        } else {
            messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
            isStepValid = false
        }
    }
    return isStepValid
}
// Your Step validation logic
function validateSteps(stepnumber) {
    const { intIdMenu, formatoFecha } = configEmpleadoInicial()
    const titleToast = 'Editar Empleado'

    var isStepValid = true
    // validate step 1
    if (stepnumber == 1) {
        if (
            $('#txtApePat').val().length > 2 &&
            $('#txtApeMat').val().length > 2 &&
            $('#txtNombres').val().length > 2 &&
            $('#txtFechaNac').val().length > 4 &&
            $("input[name='generoEmpleado']:radio").is(':checked') &&
            $('#Email_Emple').val().length > 4 &&
            ValidateEmail(getValueControl('#Email_Emple')) &&
            $('#celularEmpleado').val().length > 8
        ) {
            isStepValid = true
        } else {
            messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
            isStepValid = false
        }
    } else if (stepnumber == 2) {
        if (
            $('#fotocheckPersonal').val().length > 3 &&
            $('#txtFechaAdmi').val().length > 4 &&
            $('#comboFiscalizacion').val() != 0 &&
            $('#nivelDeResponsabilidad').val() != 0 &&
            $('#cargoEmpleado').val() != 0 &&
            $('#planillaEmpleado').val() != 0 &&
            $('#cboDependencia').val() != 0 &&
            $('#unidadOrganizacionalCbo').val() != 0
        ) {
            isStepValid = true
        } else {
            messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
            isStepValid = false
        }
    } else if (stepnumber == 3) {
        if ($('#cboResponsableInmediato').val() != 0 && $('#cboResponsableContractual').val() != 0) {
            isStepValid = true
        } else {
            messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
            isStepValid = false
        }
    } else {
        if ($('#reglaDeNegocio').val() != 0 && $('#tgHorarioFijo').val() != 0 && getValueControl('#marcadorMultiple').length >= 1) {
            isStepValid = true
        } else {
            messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
            isStepValid = false
        }
    }
    return isStepValid
}
function validateAllSteps() {
    var isStepValid = true
    // all step validation logic
    return isStepValid
}

function CargoImagenEmpleado() {
    const formdata = new FormData()
    const fileInput = document.getElementById('CargarImagen')
    formdata.append(fileInput.files[0].name, fileInput.files[0])
    const nameFile = fileInput.files[0].name
    var xhr = new XMLHttpRequest()

    xhr.open('POST', '/Personal/Upload')
    xhr.send(formdata)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            DirLocal = xhr.responseText
            $('#VistaPrevia').html('<img id="imgCarga"  src=' + DirLocal + ' class="img-rounded img-logo-empleado" />')
            $('#txtRutaEmple').val(nameFile)
        }
    }

    return false
}
// mostrar--
async function EditarEmpleadoVista(idItemPersonalEdit) {
    const { intIdMenu } = configEmpleadoInicial()
    $('.form-hide-empleado .x_content').empty()
    $('.form-hide-empleado .x_content').html('')
    try {
        const resultForm = await $.ajax({ url: '/Personal/EditarEmpleado', type: 'POST', data: {} })
        if (resultForm !== '') {
            $('.form-hide-empleado .x_content').empty()
            $('.form-hide-empleado .x_content').html(resultForm)
            $('#wizard .form-hide-empleado').hide()
            $('#btn-editar-empleado').hide()
            $('.form-hide-empleado').hide()
            switcheryLoad()
            init_checkBox_styles()
            cargarDaterangePicker()
            init_daterangepicker()
            //$('#btn-editar-empleado').prop('disabled', true)
            if (typeof $.fn.smartWizard != 'undefined') {
                $('#wizardEmpleado').smartWizard({
                    selected: 0,
                    enableFinishButton: true,
                    enableAllSteps: true,
                    onLeaveStep: leaveAStepCallbackEmpleado,
                    onFinish: onFinishCallbackEmpleado,
                })
                $('#wizard_verticle').smartWizard({
                    transitionEffect: 'slide',
                })

                $('.buttonNext').hide() //.addClass('btn btn-success');
                $('.buttonPrevious').hide() //.addClass('btn btn-primary');
                $('.buttonFinish').hide() //.addClass('btn btn-default');
            }
        }

        $('#CargarImagen').change(function(e) {
            const o = document.getElementById('CargarImagen')
            let foto = o.files[0]
            if (o.files.length == 0 || !/\.(jpeg|jpg|png|svg)$/i.test(foto.name)) {
                messageResponseMix({ type: 'infoc', message: 'Ingrese una imagen con alguno de los siguientes formatos: .jpeg/.jpg/.png.' }, 'Editar Empleado')
            } else {
                const img = new Image()
                img.onload = function() {
                    let widthImg = Number(this.width.toFixed(0))
                    let heightImg = Number(this.height.toFixed(0))
                    if (widthImg <= 200 && heightImg <= 200) {
                        messageResponseMix({ type: 'infoc', message: 'Las medidas deben ser mínimo: 200 x 200 px' }, 'Editar Empleado')
                    } else {
                        CargoImagenEmpleado()
                    }
                }

                img.src = URL.createObjectURL(foto)
            }
        })
        document.getElementById('delete').onclick = function() {
            $('#VistaPrevia').html('<img src = "/DirLogosRuta/descarga(1).jpg" />')
            $('#txtRutaEmple').val('')
            return false
        }

        // $('#tagsEmail').importTags('')
        // $('#tagsTelefono').importTags('')

        const camposAdicionales = await $.post('/Personal/ListarCamposAdicionales', { intIdMenu: intIdMenu, strNoEntidad: 'TGPERSONAL' })

        if (camposAdicionales.length) {
            $('#contendorCamposPersonal').empty()
            camposAdicionales.forEach(element => {
                let columHtml = `<div class="col-md-6 col-sm-6 col-xs-6">
                                    <div class="form-group">
                                        <label> ${element.strTitulo}</label>
                                        <input id="${element.strNomCampo}" type="text" class="form-control " placeholder="${element.strTitulo}" maxlength="255"/>
                                    </div>
                                </div>`
                $('#contendorCamposPersonal').append(columHtml)
            })
        }

        const caracteresMax = await $.post('/Personal/ListarCaracteresMax', {
            intIdMenu: intIdMenu,
            strMaestro: 'TGPERSONAL',
        })
        if (caracteresMax.length > 0) {
            caracteresMax.forEach(item => {
                if (item.strColumnName == 'strFotocheck') {
                    setMaxLengthInput('fotocheckPersonal', item.intMaxLength)
                } else if (item.strColumnName == 'strNombres') {
                    setMaxLengthInput('txtNombres', item.intMaxLength)
                } else if (item.strColumnName == 'strApePaterno') {
                    setMaxLengthInput('txtApePat', item.intMaxLength)
                } else if (item.strColumnName == 'strApeMaterno') {
                    setMaxLengthInput('txtApeMat', item.intMaxLength)
                } else if (item.strColumnName == 'strDireccion') {
                    setMaxLengthInput('TXTTIPVIA', item.intMaxLength)
                } else if (item.strColumnName == 'strPersoCampo1') {
                    setMaxLengthInput('strPersonalCampo1', item.intMaxLength)
                } else if (item.strColumnName == 'strPersoCampo2') {
                    setMaxLengthInput('strPersonalCampo2', item.intMaxLength)
                } else if (item.strColumnName == 'strPersoCampo3') {
                    setMaxLengthInput('strPersonalCampo3', item.intMaxLength)
                } else if (item.strColumnName == 'strPersoCampo4') {
                    setMaxLengthInput('strPersonalCampo4', item.intMaxLength)
                } else if (item.strColumnName == 'strPersoCampo5') {
                    setMaxLengthInput('strPersonalCampo5', item.intMaxLength)
                } else if (item.strColumnName == 'strCodExterior') {
                    setMaxLengthInput('codigoExterno', item.intMaxLength)
                } else if (item.strColumnName == 'strCodPensionista') {
                    setMaxLengthInput('codigoPensionista', item.intMaxLength)
                } else if (item.strColumnName == 'strCodSalud') {
                    setMaxLengthInput('codigoDeSalud', item.intMaxLength)
                }
            })
        }

        const tipoDocData = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: intIdMenu,
            strEntidad: 'TSTIPDOC02',
            intIdFiltroGrupo: 0,
            strGrupo: 'PER',
            strSubGrupo: '',
        })
        if (tipoDocData !== '') {
            $('#cboUndOrg').empty()
            $('#cboUndOrg').attr('disabled', false)
            tipoDocData.forEach(element => {
                $('#TipoDoc').append('<option value="' + element.intId + '" maxdata="' + element.strCodigo + '"  >' + element.strDescripcion + '</option>')
            })
        }

        const dataTipVia = await $.post('/Personal/ListarCombos', {
            intIdMenu: intIdMenu,
            strEntidad: 'TGTIPO_VIA',
            intIdFiltroGrupo: 0,
            strGrupo: '',
            strSubGrupo: '',
        })
        if (dataTipVia.length) {
            $('#TipVia').empty()
            $('#TipVia').attr('disabled', false)
            $('#TipVia').append('<option value="0">Via</option>')
            dataTipVia.forEach(element => {
                $('#TipVia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })
        }

        const dataCboPais = await $.post('/Personal/ListarCombos', {
            intIdMenu: intIdMenu,
            strEntidad: 'TGPAIS',
            intIdFiltroGrupo: 0,
            strGrupo: 'EXISTE',
            strSubGrupo: '',
        })
        if (dataCboPais.length) {
            $('#CboPais').empty()
            $('#CboPais').attr('disabled', false)
            $('#CboPais').append('<option value="0">Seleccione</option>')

            dataCboPais.forEach(element => {
                $('#CboPais').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })
        }

        const dataCorreosPersonal = await $.post('/Personal/GetCorreosPersonal', {
            intIdMenu: 1,
            intIdPersonal: idItemPersonalEdit,
        })
        if (dataCorreosPersonal.length) {
            let dataCorreosInsert = ''
            dataCorreosPersonal.forEach(element => {
                if (element.bitFlPrincipal) {
                    $('#Email_Emple').val(element.strCorreo)
                } else {
                    dataCorreosInsert += element.strCorreo + ','
                }
            })
            if (dataCorreosInsert != '') {
                let cadenaEmail = dataCorreosInsert.slice(0, -1)
                $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="${cadenaEmail}" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
                //$('#tagsEmail').importTags(cadenaEmail)
            } else {
                $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
            }
        } else {
            $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
        }

        const dataTelefonosPersonal = await $.post('/Personal/GetTelefonosPersonal', {
            intIdMenu: 1,
            intIdPersonal: idItemPersonalEdit,
        })
        if (dataTelefonosPersonal.length) {
            let dataTelefonosInsert = ''
            dataTelefonosPersonal.forEach(element => {
                if (element.bitFlPrincipal) {
                    $('#celularEmpleado').val(element.strNumero)
                } else {
                    dataTelefonosInsert += element.strNumero + ','
                }
            })
            if (dataTelefonosInsert != '') {
                let cadenaTekl = dataTelefonosInsert.slice(0, -1)
                $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value="${cadenaTekl}"  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
                //$('#tagsTelefono').importTags(cadenaTekl)
            } else {
                $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value=""  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
            }
        } else {
            $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value=""  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
        }

        var mailformatEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/

        $('#tagsEmail').tagsInput({
            width: 'auto',
            defaultText: 'Correos',
            placeholderColor: '#666666',
            pattern: mailformatEmail,
            interactive: true,
        })
        $('#tagsTelefono').tagsInput({
            width: 'auto',
            defaultText: 'Teléfonos',
            placeholderColor: '#666666',
            pattern: /^\d{9}$/,
            interactive: true,
        })

        const dataFiscalizacion = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGTIPO1REGISTROTIPOFISCALIZACION',
            intIdFiltroGrupo: 0,
            strGrupo: 'PER',
            strSubGrupo: '',
        })
        if (dataFiscalizacion.length) {
            $('#comboFiscalizacion').empty()
            $('#comboFiscalizacion').append('<option value="0">Seleccione</option>')
            dataFiscalizacion.forEach(item => {
                $('#comboFiscalizacion').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataResponsabilidad = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGTIPO1REGISTRO',
            intIdFiltroGrupo: 0,
            strGrupo: 'PER',
            strSubGrupo: '',
        })
        if (dataResponsabilidad.length) {
            $('#nivelDeResponsabilidad').empty()
            $('#nivelDeResponsabilidad').append('<option value="0">Seleccione</option>')
            dataResponsabilidad.forEach(item => {
                $('#nivelDeResponsabilidad').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataCargoEmpleado = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGCARGOREGISTRO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGCARGO',
            strSubGrupo: '',
        })
        if (dataCargoEmpleado.length) {
            $('#cargoEmpleado').empty()
            $('#cargoEmpleado').append('<option value="0">Seleccione</option>')
            dataCargoEmpleado.forEach(item => {
                $('#cargoEmpleado').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataPlanillaEmpleado = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGPLANILLAREGISTRO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGPLANILLA',
            strSubGrupo: '',
        })
        if (dataPlanillaEmpleado.length) {
            $('#planillaEmpleado').empty()
            $('#planillaEmpleado').append('<option value="0">Seleccione</option>')
            dataPlanillaEmpleado.forEach(item => {
                $('#planillaEmpleado').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataCategoriaEmpleado = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGCATEGORIAREGISTROEMPLEADO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGCATEGORIAEMPLEADO',
            strSubGrupo: '',
        })
        if (dataCategoriaEmpleado.length) {
            $('#categoriaEmpleado').empty()
            $('#categoriaEmpleado').append('<option value="0">Seleccione</option>')
            dataCategoriaEmpleado.forEach(item => {
                $('#categoriaEmpleado').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataTipoDePersonal = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGTIPOPERSONREGISTRO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGTIPOPERSON',
            strSubGrupo: '',
        })
        if (dataTipoDePersonal.length) {
            $('#tipoDePersonal').empty()
            $('#tipoDePersonal').append('<option value="0">Seleccione</option>')
            dataTipoDePersonal.forEach(item => {
                $('#tipoDePersonal').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataTgGrupoRegistro = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGGRUPOREGISTRO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGGRUPO',
            strSubGrupo: '',
        })
        if (dataTgGrupoRegistro.length) {
            $('#tgGrupoRegistro').empty()
            $('#tgGrupoRegistro').append('<option value="0">Seleccione</option>')
            dataTgGrupoRegistro.forEach(item => {
                $('#tgGrupoRegistro').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataCentroDeCosto = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGCCOSTOREGISTRO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGCCOSTO',
            strSubGrupo: '',
        })
        if (dataCentroDeCosto.length) {
            $('#centroDeCosto').empty()
            $('#centroDeCosto').append('<option value="0">Seleccione</option>')
            dataCentroDeCosto.forEach(item => {
                $('#centroDeCosto').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataCboDependencia = await $.post('/Personal/ListarCombos', {
            intIdMenu: intIdMenu,
            strEntidad: 'TGJERARQORG',
            intIdFiltroGrupo: 0,
            strGrupo: 'DEPEN',
            strSubGrupo: '',
        })

        if (dataCboDependencia.length) {
            $('#cboDependencia').empty()
            $('#cboDependencia').attr('disabled', false)
            $('#cboDependencia').append('<option value="0">Seleccione</option>')
            dataCboDependencia.forEach(element => {
                $('#cboDependencia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })
        }

        const dataRespoDetalle = await $.post('/Personal/GetResponsablesPersonal', {
            intIdMenu: 1,
            intIdPersonal: idItemPersonalEdit,
        })
        let intIdTipoRespInmediato = null
        let intIdTipoRespContractual = null
        if (dataRespoDetalle.length) {
            dataRespoDetalle.forEach(item => {
                if (item.intIdTipoResp == 10) {
                    intIdTipoRespContractual = item.intIdPerResp
                } else {
                    intIdTipoRespInmediato = item.intIdPerResp
                }
            })
        }

        const datacboResponsableInmediato = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: intIdMenu,
            strEntidad: 'TGPERSONALINMEDIATOOLIDERAZGO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGPERSONAL',
            strSubGrupo: '',
        })
        if (datacboResponsableInmediato.length) {
            $('#cboResponsableInmediato').empty()
            $('#cboResponsableInmediato').attr('disabled', false)
            datacboResponsableInmediato.forEach(element => {
                $('#cboResponsableInmediato').append('<option value="' + element.intId + '"   >' + element.strDescripcion + '</option>')
                if (intIdTipoRespInmediato == element.intId) {
                    $('#cboResponsableInmediato').val(intIdTipoRespInmediato)
                }
            })
            $('#cboResponsableInmediato').select2({
                placeholder: 'Seleccione',
                allowClear: true,
            })
        }

        const dataCboResponsableContractual = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: intIdMenu,
            strEntidad: 'TGPERSONALCONTRACTUAL',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGPERSONAL',
            strSubGrupo: '',
        })
        if (dataCboResponsableContractual.length) {
            $('#cboResponsableContractual').empty()
            $('#cboResponsableContractual').attr('disabled', false)
            dataCboResponsableContractual.forEach(element => {
                $('#cboResponsableContractual').append('<option value="' + element.intId + '"   >' + element.strDescripcion + '</option>')
                if (intIdTipoRespContractual == element.intId) {
                    $('#cboResponsableContractual').val(intIdTipoRespContractual)
                }
            })
            $('#cboResponsableContractual').select2({
                placeholder: 'Seleccione',
                allowClear: true,
            })
        }

        const dataReglaDeNegocio = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGREGLANEGREGISTRO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGREGLANEG',
            strSubGrupo: '',
        })
        if (dataReglaDeNegocio.length) {
            $('#reglaDeNegocio').empty()
            $('#reglaDeNegocio').append('<option value="0">Seleccione</option>')
            dataReglaDeNegocio.forEach(item => {
                $('#reglaDeNegocio').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataTgHorarioFijo = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGHORARIOREGISTRO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGHORARIO',
            strSubGrupo: '',
        })

        if (dataTgHorarioFijo.length) {
            $('#tgHorarioFijo').empty()
            $('#tgHorarioFijo').append('<option value="0">Seleccione</option>')
            dataTgHorarioFijo.forEach(item => {
                $('#tgHorarioFijo').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataMarcadorMultiple = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGMARCADORREGISTRO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGMARCADOR',
            strSubGrupo: '',
        })
        if (dataMarcadorMultiple.length) {
            $('#marcadorMultiple').empty()
            //$('#marcadorMultiple').append('<option value="0">Seleccione</option>');
            dataMarcadorMultiple.forEach(item => {
                $('#marcadorMultiple').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataMotivoDeCese = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGMOTIVOREGISTRO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGMOTIVO',
            strSubGrupo: '',
        })

        if (dataMotivoDeCese.length) {
            $('#mativoDeCese').empty()
            $('#mativoDeCese').append('<option value="0">Seleccione</option>')
            dataMotivoDeCese.forEach(item => {
                $('#mativoDeCese').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataTgTgGrupoliq = await $.post('/Personal/ListarComboGlobal', {
            intIdMenu: 1,
            strEntidad: 'TGGRUPOLIQREGISTRO',
            intIdFiltroGrupo: 0,
            strGrupo: 'TGGRUPOLIQ',
            strSubGrupo: '',
        })
        if (dataTgTgGrupoliq.length) {
            $('#tgTgGrupoliq').empty()
            $('#tgTgGrupoliq').append('<option value="0">Seleccione</option>')
            dataTgTgGrupoliq.forEach(item => {
                $('#tgTgGrupoliq').append('<option value="' + item.intId + '">' + item.strDescripcion + '</option>')
            })
        }

        const dataMarcadoresLista = await $.post('/Personal/GetMarcadoresPersonal', {
            intIdMenu: 1,
            intIdPersonal: idItemPersonalEdit,
        })
        if (dataMarcadoresLista.length) {
            const newArr = dataMarcadoresLista.map(function(val, index) {
                return val.intIdMarcador
            })
            $('#marcadorMultiple').val(newArr)
        }
    } catch (error) {
        console.error(error)
    }
}

async function editarEmpleado(idItemEdit) {
    const { intIdMenu } = configEmpleadoInicial()
    const { loaderHtml } = APPCONFIG
    $(`#loaderEditPersonal`).show()
    $(`#loaderEditPersonal`).html(`<div class="loaderContenedor"><div class="min-height-300">${loaderHtml}</div></div>`)

    const estadoDeCargaVista = await EditarEmpleadoVista(idItemEdit)
    validarEmpleadoControlesEmpleadop()
    const dataEmpleado = await $.post('/Personal/ObtenerRegistroEmpleado', { intIdPersonal: idItemEdit }, response => {})

    if (dataEmpleado.length) {
        const data = dataEmpleado[0]

        const INTIDTPEVAL = data.intIdUbigeo
        const INTIDSUPUBI = data.intIdUbigSup
        const INTIDSUPUBIREGION = data.intIdUbiSupReg
        const intIdProvinciaMostrar = data.intIdUbiReg
        const intIdRegionMostrar = data.intIdUbiPais
        const intIdJerOrgLista = data.intIdJerOrg
        const intIdUniOrgLista = data.intIdUniOrg

        $('#cboDependencia').val(intIdJerOrgLista)
        $('#CboPais').val(data.intIdUbiSupPais)
        $('#intTipoOperacion').val('2')
        $('#intIdPersonalReg').val(data.intIdPersonal)
        $('#codigoDeRegistro').val(data.strCoPersonal.trim() + '-' + data.strNumRegis.trim())
        $('#codPersonalHideen').val(data.strCoPersonal)
        $('#numRegistroPersonalHideen').val(data.strNumRegis.trim())
        $('#fechaDeCeseValidar').val(data.dttFecCese)
        $('#fechaDefechaAdmision').val(data.dttFecAdmin)
        $('#TipoDoc').val(data.intIdTipDoc)
        $('#TipoDoc').prop('disabled', true)
        $('#txtNumDoc').val(data.strNumDoc)
        $('#txtNumDoc').prop('disabled', true)
        $('#txtApePat').val(data.strApePaterno)
        $('#txtApeMat').val(data.strApeMaterno)
        $('#txtNombres').val(data.strNombres)
        $('#txtFechaNac').val(data.dttFecNacim)
        $('#TipVia').val(data.intIdTipoVia)
        $('#TXTTIPVIA').val(data.strDireccion)
        $('#txtFechaAdmi').val(data.dttFecAdmin)
        $('#fotocheckPersonal').val(data.strFotocheck)
        $('#strPersonalCampo1').val(data.strPersoCampo1)
        $('#strPersonalCampo2').val(data.strPersoCampo2)
        $('#strPersonalCampo3').val(data.strPersoCampo3)
        $('#strPersonalCampo4').val(data.strPersoCampo4)
        $('#strPersonalCampo5').val(data.strPersoCampo5)
        if (data.bitflSexo == true) {
            $('#chck_mas').iCheck('check')
        } else if (data.bitflSexo == false) {
            $('#chck_fem').iCheck('check')
        }
        if (data.bitFlActivo == false) {
            $('#checkEstadoEmpleado').html(`<input type="checkbox" class="js-switch"  id="estadoEmpleadoActivo" /> Activo`)
            switcheryLoad()
        } else if (data.bitFlActivo == true) {
            $('#checkEstadoEmpleado').html(`<input type="checkbox" class="js-switch" checked id="estadoEmpleadoActivo" /> Activo`)
            switcheryLoad()
        }
        $('#CboPais').val(data.intIdUbiSupPais)
        $('#fotocheckPersonal').val(data.strFotocheck)
        $('#txtIntidUbigeo').val(data.intIdUbigeo)
        $('#Mensaje_Info').css('color', 'green')
        if (data.imgFoto != null) {
            $('#VistaPrevia').html(`<img id="imgCarga"  src="/DirEmpleadosRuta/${data.imgFoto}" class="img-rounded img-logo-empleado"/>`)
            $('#txtRutaEmple').val(data.imgFoto)
        } else {
            $('#VistaPrevia').html(`<img id="imgCarga"  src="/DirEmpleadosRuta/descarga(1).jpg" class="img-rounded img-logo-empleado"/>`)
            $('#txtRutaEmple').val('')
        }
        $('#nivelDeResponsabilidad').val(data.intIdTipoResp)
        $('#comboFiscalizacion').val(data.intIdTipFisc)
        $('#planillaEmpleado').val(data.intIdPlanilla)
        $('#cargoEmpleado').val(data.intIdCargo)
        $('#categoriaEmpleado').val(data.intIdCateg)
        $('#tipoDePersonal').val(data.intIdTiPers)
        $('#centroDeCosto').val(data.intIdCCosto)
        $('#codigoExterno').val(data.strCodExterior)
        $('#codigoDeSalud').val(data.strCodSalud)
        $('#codigoPensionista').val(data.strCodPensionista)
        $('#tgGrupoRegistro').val(data.intIdGrupo)

        if (data.bitContratoInd) {
            $('#contradoIndeterminado').iCheck('check')
        }
        if (data.dttFecCese != '') {
            $('#fechaCeseChecbox').iCheck('check')
            $('#txtFechaCese').val(data.dttFecCese)
            $('#mativoDeCese').val(data.intIdMotiCese)
            $('#tgTgGrupoliq').val(data.intIdGrupoLiq)

            $('#tgTgGrupoliq').attr('disabled', false)
            $('#txtFechaCese').attr('disabled', false)
            $('#mativoDeCese').attr('disabled', false)
        }
        $('#reglaDeNegocio').val(data.intIdReglaNeg)
        $('#tgHorarioFijo').val(data.intIdHorario)
        if (data.bitActivarUsuario === true) {
            $('#activarUsuarioCbo').iCheck('check')
        }
        $.post(
            '/Personal/ListarCombos',
            {
                strEntidad: 'TGUBIGEO',
                intIdFiltroGrupo: INTIDSUPUBI,
                strGrupo: 'DIST',
                strSubGrupo: '',
            },
            response => {
                $('#CboDistrito').empty()
                $('#CboDistrito').attr('disabled', false)
                $('#CboDistrito').append('<option >Seleccione</option>')
                response.forEach(element => {
                    $('#CboDistrito').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                    if (element.intidTipo == INTIDTPEVAL) {
                        $('#CboDistrito').val(element.intidTipo)
                        $('#txtUbigeo').val(element.strDeTipo)
                        $('#txtUbigeo').attr('disabled', true)
                    }
                })
            }
        )

        $.post(
            '/Personal/ListarCombos',
            {
                strEntidad: 'TGUBIGEO',
                intIdFiltroGrupo: INTIDSUPUBIREGION,
                strGrupo: 'REG',
                strSubGrupo: '',
            },
            response => {
                $('#CboProvincia').empty()
                $('#CboProvincia').attr('disabled', false)
                $('#CboProvincia').append('<option >Seleccione</option>')
                response.forEach(element => {
                    $('#CboProvincia').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                    if (element.intidTipo == intIdProvinciaMostrar) {
                        $('#CboProvincia').val(element.intidTipo)
                    }
                })
            }
        )

        $.post(
            '/Personal/ListarCombos',
            {
                strEntidad: 'TGUBIGEO',
                intIdFiltroGrupo: data.intIdUbiSupPais,
                strGrupo: 'DEPART',
                strSubGrupo: '',
            },
            response => {
                $('#CboRegion').empty()
                $('#CboRegion').attr('disabled', false)
                $('#CboRegion').append('<option >Seleccione</option>')
                response.forEach(element => {
                    $('#CboRegion').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                    if (element.intidTipo == intIdRegionMostrar) {
                        $('#CboRegion').val(element.intidTipo)
                    }
                })
            }
        )

        $.post('/Organizacion/getUnidxJerarquia', { IntIdJerOrg: intIdJerOrgLista }, response => {
            $('#unidadOrganizacionalCbo').empty()
            $('#unidadOrganizacionalCbo').attr('disabled', false)
            $('#unidadOrganizacionalCbo').append('<option value="0">Seleccione</option>')
            response.forEach(element => {
                $('#unidadOrganizacionalCbo').append('<option value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>')
                if (intIdUniOrgLista == element.intIdUniOrg) {
                    $('#unidadOrganizacionalCbo').val(element.intIdUniOrg)
                }
            })
        })
    }

    // intIdJerOrgLista
    $(`#loaderEditPersonal`).hide()
    $('#wizard .form-hide-empleado').show()
    $('#btn-save-change-empleado').hide()
    $('#btn-editar-empleado').show()
    $('.form-hide-empleado').show()

    $('#cboDependencia').change(function() {
        let idDependencia = $(this).val()
        if (idDependencia == '0') {
            messageResponseMix({ type: 'info', message: 'Seleccione una Dependencia ' }, 'Registro Empleado')
            return false
        }
        $.post('/Organizacion/getUnidxJerarquia', { IntIdJerOrg: idDependencia }, response => {
            $('#unidadOrganizacionalCbo').empty()
            $('#unidadOrganizacionalCbo').attr('disabled', false)
            $('#unidadOrganizacionalCbo').append('<option value="0">Seleccione</option>')
            response.forEach(element => {
                $('#unidadOrganizacionalCbo').append('<option value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>')
            })
        }).fail(function(result) {
            alert('ERROR ' + result.status + ' ' + result.statusText)
        })
    })
    $('#fechaCeseChecbox').on('ifChanged', function() {
        if ($('#fechaCeseChecbox').is(':checked') == true) {
            $('#tgTgGrupoliq').attr('disabled', false)
            $('#txtFechaCese').attr('disabled', false)
            $('#mativoDeCese').attr('disabled', false)
        } else if ($('#fechaCeseChecbox').is(':checked') == false) {
            $('#tgTgGrupoliq').attr('disabled', true)
            $('#txtFechaCese').attr('disabled', true)
            $('#mativoDeCese').attr('disabled', true)
        }
    })
    $('#CboPais').on('change', function() {
        var Valxpais = $('#CboPais').val()

        $.post(
            '/Personal/ListarCombos',
            {
                intIdMenu: intIdMenu,
                strEntidad: 'TGUBIGEO',
                intIdFiltroGrupo: Valxpais,
                strGrupo: 'DEPART',
                strSubGrupo: '',
            },
            response => {
                $('#CboRegion').empty()
                $('#CboRegion').attr('disabled', false)
                $('#CboRegion').append('<option value="0">Seleccione</option>')

                response.forEach(element => {
                    $('#CboRegion').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                })
            }
        )
    })

    $('#CboRegion').on('change', function() {
        var Valxpais = $('#CboRegion').val()
        $.post(
            '/Personal/ListarCombos',
            {
                intIdMenu: intIdMenu,
                strEntidad: 'TGUBIGEO',
                intIdFiltroGrupo: Valxpais,
                strGrupo: 'REG',
                strSubGrupo: '',
            },
            response => {
                $('#CboProvincia').empty()
                $('#CboProvincia').attr('disabled', false)
                $('#CboProvincia').append('<option value="0">Seleccione</option>')

                response.forEach(element => {
                    $('#CboProvincia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                })
            }
        )
    })

    $('#CboProvincia').on('change', function() {
        var Valxpais = $('#CboProvincia').val()
        $.post(
            '/Personal/ListarCombos',
            {
                intIdMenu: intIdMenu,
                strEntidad: 'TGUBIGEO',
                intIdFiltroGrupo: Valxpais,
                strGrupo: 'DIST',
                strSubGrupo: '',
            },
            response => {
                $('#CboDistrito').empty()
                $('#CboDistrito').attr('disabled', false)
                $('#CboDistrito').append('<option value="0">Seleccione</option>')
                response.forEach(element => {
                    $('#CboDistrito').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                })
            }
        )
    })
}

function eliminarEmpleado(idItemDelete, textInfo = '¿Esta seguro de eliminar el registro?') {
    const { intIdMenu, tituloEliminarRegistro } = configEmpleadoInicial()
    swal({
        title: tituloEliminarRegistro,
        text: textInfo,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
    })
        .then(isConfirm => {
            $.post('/Personal/EliminarEmpleado', { intIdMenu: intIdMenu, intIdPersonal: idItemDelete }, respo => {
                messageResponseMix(respo, 'Eliminar Empleado')
                if (respo.type === 'success') {
                    traerDatosEmpleados()
                }
            })
        })
        .catch(err => {
            //swal('Cancelado', 'La Operación fue cancelada', 'error')
        })
}

function ValidateEmail(email) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (email.match(mailformat)) {
        return true
    }
    return false
}

function getValueControl(idControl) {
    let data = $(idControl).val()
    if (data.length > 0) {
        //data.trim()
    }
    return data
}

function focusControl(idControl) {
    return $(idControl).focus()
}











function registrarOActualizar(tipoOperacionPass) {
    //alert('registrarOActualizar');
    const { intIdMenu, formatoFecha } = configEmpleadoInicial()
    let titleToast = 'Nuevo Empleado'
    if (tipoOperacionPass == 2) {
        titleToast = 'Editar Empleado'
    }

    let cboResponsableInmediato = $('#cboResponsableInmediato').val()
    let cboResponsableContractual = $('#cboResponsableContractual').val()

    const otrosCorreosData = $.map($('#TagEmailContainer .tagsinput span span'), function(e, i) {
        return $(e)
            .text()
            .trim()
    })
    const otrosTelefonosData = $.map($('#tagTelefonosContainer .tagsinput span span'), function(e, i) {
        return $(e)
            .text()
            .trim()
    })

    const otrosCorreos = otrosCorreosData.filter(item => {
        return ValidateEmail(item) === true
    })

    let generoEstado = false
    let contradoIndeterminado = false
    let estadoActivoPersonal = false
    let activarUsuarioCbo = false
    let truefalsecontrat = FechaContratSeleccionado(true); // Añadido HGM 17.11.2021

    if ($('.radioMasculino').is(':checked')) {
        generoEstado = true
    }

    if ($('#contradoIndeterminado').is(':checked')) {
        contradoIndeterminado = true
    }

    if (!$('.estadoEmpleadoActivo').is(':checked')) {
        estadoActivoPersonal = true
    }

    if ($('#activarUsuarioCbo').is(':checked')) {
        activarUsuarioCbo = true
    }

    if (getValueControl('#TipoDoc') == '0') {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#TipoDoc')
        return false
    } else if (getValueControl('#txtNumDoc').length < 4) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#txtNumDoc')
        return false
    } else if (getValueControl('#txtApePat').length < 4) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#txtApePat')
        return false
    } else if (getValueControl('#txtApeMat').length < 4) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#txtApeMat')
        return false
    } else if (getValueControl('#txtNombres').length < 4) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#txtNombres')
        return false
    } else if (getValueControl('#txtFechaNac').length < 4) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#txtFechaNac')
        return false
    } else if (!$("input[name='generoEmpleado']:radio").is(':checked')) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        return false
    } else if (getValueControl('#Email_Emple').length < 4 && !ValidateEmail(getValueControl('#Email_Emple'))) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#Email_Emple')
        return false
    } else if (getValueControl('#celularEmpleado').length < 6) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#celularEmpleado')
        return false
    } else if (getValueControl('#fotocheckPersonal').length < 3) {
        $('#wizard').smartWizard('goToStep', 2)
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#fotocheckPersonal')
        return false
    } else if (getValueControl('#txtFechaAdmi').length < 5) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#txtFechaAdmi')
        return false
    } else if (getValueControl('#marcadorMultiple').length <= 0) {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
        focusControl('#marcadorMultiple')
        return false
    }
 


    // if ($('#fechaDeCeseValidar').val() != '' && $('#txtFechaAdmi').val() != '') {
    //     let fechaCese = moment($('#fechaDeCeseValidar').val())
    //     let fechaAdmision = moment($('#txtFechaAdmi').val())
    //     if (fechaCese >= fechaAdmision) {
    //         messageResponseMix({ type: 'info', message: `La fecha de admisión debe ser posterior a ${fechaCese.format(formatoFecha)}` }, titleToast)
    //         return false
    //     }
    // }

    let marcadorMultiple = getValueControl('#marcadorMultiple')
    let otrosCorreosInsert = []
    otrosCorreosInsert.push({
        intIdPerCorr: 0,
        intIdPersonal: 0,
        strCorreo: getValueControl('#Email_Emple'),
        bitFlPrincipal: true,
        bitFlEliminado: false,
    })
    otrosCorreos.forEach(item => {
        otrosCorreosInsert.push({
            intIdPerCorr: 0,
            intIdPersonal: 0,
            strCorreo: item,
            bitFlPrincipal: false,
            bitFlEliminado: false,
        })
    })

    let otrosTelefonosInsert = []
    otrosTelefonosInsert.push({
        intIdPerTele: 0,
        intIdPersonal: 0, //no esta enviando el id HGM 
        strNumero: getValueControl('#celularEmpleado'),
        bitFlPrincipal: true,
        strAnexo: ' ',
        bitFlEliminado: false,
    })
    otrosTelefonosData.forEach(item => {
        otrosTelefonosInsert.push({
            intIdPerTele: 0,
            intIdPersonal: 0,
            strNumero: item,
            bitFlPrincipal: false,
            strAnexo: '',
            bitFlEliminado: false,
        })
    })

    let otrosMarcadoresInsert = []
    marcadorMultiple.forEach(item => {
        otrosMarcadoresInsert.push({
            intIdPerMarc: false,
            intIdPersonal: 0,
            intIdSoft: 0,
            intIdMarcador: item,
            dttFecAsig: moment().format(formatoFecha),
            bitFlEliminado: false,
        })
    })

    let otrosResponsabilidadInsert = []

    otrosResponsabilidadInsert.push({
        intIdPerRespDet: 0,
        intIdPersonal: 0,
        intIdPerResp: cboResponsableInmediato,
        intIdTipoResp: 9,
        bitVigente: true,
        bitFlEliminado: false,
        intIdUsuarReg: 1,
    })
    otrosResponsabilidadInsert.push({
        intIdPerRespDet: 0,
        intIdPersonal: 0,
        intIdPerResp: cboResponsableContractual,
        intIdTipoResp: 10,
        bitVigente: true,
        bitFlEliminado: false,
        intIdUsuarReg: 1,
    })

    let imagePersonal = null
    let numRegistroPersonalHideen = '000'
    let strCoPersonalRegistro = '000'
    let subsidioPorAlimentacion = false
    let liniaDeCreditos = false

    if ($('#txtRutaEmple').val() != '') {
        imagePersonal = $('#txtRutaEmple').val()
    }

    if ($('#codPersonalHideen').val() != '') {
        strCoPersonalRegistro = $('#codPersonalHideen').val()
    }

    if ($('#numRegistroPersonalHideen').val() != '') {
        numRegistroPersonalHideen = $('#numRegistroPersonalHideen').val()
    }

    if ($('#subsidioPorAlimentacion').is(':checked')) {
        subsidioPorAlimentacion = true
    }
    if ($('#liniaDeCreditos').is(':checked')) {
        liniaDeCreditos = true
    }

    const params = {
        intIdMenu: intIdMenu,
        ObjPersonal: {
            intIdPersonal: $('#intIdPersonalReg').val(),
            strCoPersonal: strCoPersonalRegistro,
            strNumRegis: numRegistroPersonalHideen,
            strFotocheck: $('#fotocheckPersonal').val(),
            intIdTipDoc: $('#TipoDoc').val(),
            strNumDoc: $('#txtNumDoc').val(),
            strNombres: $('#txtNombres').val(),
            strApePaterno: $('#txtApePat').val(),
            strApeMaterno: $('#txtApeMat').val(),
            dttFecNacim: $('#txtFechaNac').val(),
            bitflSexo: generoEstado,
            intIdTipoVia: $('#TipVia').val() != '0' ? $('#TipVia').val() : null,
            strDireccion: $('#TXTTIPVIA').val().length ? $('#TXTTIPVIA').val() : null,
            intIdUbigeo: $('#txtIntidUbigeo').val() != '0' ? $('#txtIntidUbigeo').val() : null,
            imgFoto: imagePersonal,
            intIdUniOrg: $('#unidadOrganizacionalCbo').val(),
            intIdPlanilla: $('#planillaEmpleado').val(),
            intIdCargo: $('#cargoEmpleado').val(),
            intIdCateg: $('#categoriaEmpleado').val(),
            intIdTiPers: $('#tipoDePersonal').val(),
            intIdGrupo: $('#tgGrupoRegistro').val(),
            intIdCCosto: $('#centroDeCosto').val(),
            intIdTipFisc: $('#comboFiscalizacion').val(),
            intIdTipoResp: $('#nivelDeResponsabilidad').val(),
            bitContratoInd: contradoIndeterminado,
            dttFecAdmin: $('#txtFechaAdmi').val(),
            dttFecCese: $('#txtFechaCese').val() != '' || $('#txtFechaCese').val() != ' ' ? $('#txtFechaCese').val() : null, //'09/11/2021', //tgTgGrupoliq
            intIdMotiCese: $('#mativoDeCese').val() != '0' ? $('#mativoDeCese').val() : null,
            intIdGrupoLiq: $('#tgTgGrupoliq').val() != '0' ? $('#tgTgGrupoliq').val() : null,
            bitFlSubsidio: null,
            bitFlLinCred: false,
            strPersoCampo1: $('#strPersonalCampo1').val(),
            strPersoCampo2: $('#strPersonalCampo2').val(),
            strPersoCampo3: $('#strPersonalCampo3').val(),
            strPersoCampo4: $('#strPersonalCampo4').val(),
            strPersoCampo5: $('#strPersonalCampo5').val(),
            bitFlActivo: estadoActivoPersonal,

            strCodExterior: $('#codigoExterno').val(),
            strCodPensionista: $('#codigoPensionista').val(),
            strCodSalud: $('#codigoDeSalud').val(),
            bitSubsidioAlimentacion: subsidioPorAlimentacion,
            bitLineaCredito: liniaDeCreditos,
            intIdReglaNeg: $('#reglaDeNegocio').val() != '0' ? $('#reglaDeNegocio').val() : null,
            intIdHorario: $('#tgHorarioFijo').val() != '0' ? $('#tgHorarioFijo').val() : null,
            bitActivarUsuario: activarUsuarioCbo,
        },
        listaDetallesPersonalCorreos: otrosCorreosInsert,
        listaDetallesPersonalTelefonos: otrosTelefonosInsert, //No esta enviando el id
        listaDetallesPersonalResponsabilidad: otrosResponsabilidadInsert,
        listaDetallesPersonalMarcadores: otrosMarcadoresInsert,
        intTipoOperacion: tipoOperacionPass,
    }

    

    $.post('/Personal/RegistrarNuevoEmpleado', params, respo => {
        if (tipoOperacionPass == 1) {
            messageResponseMix(respo, 'Nuevo Empleado')
        } else {
            messageResponseMix(respo, 'Editar Empleado')
        }

        if (respo.type === 'success') {
            $('.form-hide-empleado .x_content').empty()
            $('.form-hide-empleado .x_content').html('')
            $('.form-hide-empleado').hide()
            traerDatosEmpleados()
        }
    })
}

$('#btn-save-change-empleado').on('click', function() {
    const titleToast = 'Nuevo Empleado'
    if ($('#reglaDeNegocio').val() != 0 && $('#tgHorarioFijo').val() != 0 && getValueControl('#marcadorMultiple').length >= 1) {
        registrarOActualizar(1)
    } else {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
    }
})
$('#btn-editar-empleado').on('click', function() {
    const titleToast = 'Editar Empleado'
    if ($('#reglaDeNegocio').val() != 0 && $('#tgHorarioFijo').val() != 0 && getValueControl('#marcadorMultiple').length >= 1) {
        registrarOActualizar(2)
    } else {
        messageResponseMix({ type: 'info', message: 'Complete los campos obligatorios' }, titleToast)
    }
})

$('#btn-cancel-empleado').on('click', function() {
    $('.form-hide-empleado').hide()
    $('#btn-save-change-empleado').show()
    $('#btn-editar-empleado').hide()
})

$(`#TablaPersonal tbody`).on('click', `tr button.btn-edit`, function() {
    let intIdPersonal = $(this).attr('dataid')
    editarEmpleado(intIdPersonal)
})

$(`#TablaPersonal tbody`).on('click', `tr button.btn-delete`, function() {
    let intIdPersonal = $(this).attr('dataid')
    let nombreEmpleado = $(this).attr('des_data')
    eliminarEmpleado(intIdPersonal, `¿Está seguro de eliminar el empleado "${nombreEmpleado}"?`)
})

$(document).ready(function() {
    const { dataTableId, formatoFecha, rangeDateInicial } = configEmpleadoInicial()
    if ($(`#${dataTableId}`).length) {
        traerDatosEmpleados(rangeDateInicial.startDate.format(formatoFecha), rangeDateInicial.endDate.format(formatoFecha))
    }
})
