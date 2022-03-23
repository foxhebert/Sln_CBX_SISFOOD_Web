var _varTablaCambioDI;

//añadido 13/09/2021
function validarSoloNumCDI(evt) {
    let k = event ? event.which : window.event.keyCode;
    if (k == 32) return false;
    //--------------------------------------------------------------------------------------
    var TxtTipDocConsulta = $('#TipoDoc  option:selected').text();
    if (TxtTipDocConsulta == 'DNI') {
        //onkeypress = "return  validarSoloNum(event)" //el return  es necesario para el espacio.
        var theEvent = evt || window.event;

        // Handle paste
        if (theEvent.type === 'paste') {
            key = event.clipboardData.getData('text/plain');
        } else {
            // Handle key press
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode(key);
        }

        let k = event ? event.which : window.event.keyCode;
        if (k == 32) return false;

        var regex = /[0-9]/; //Numeros
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }

    }

}
function validarSoloNumCDINew(evt) {
    let k = event ? event.which : window.event.keyCode;
    if (k == 32) return false;
    //--------------------------------------------------------------------------------------
    var TxtTipDocConsulta = $('#newTipoDocId  option:selected').text();
    if (TxtTipDocConsulta == 'DNI') {
        //onkeypress = "return  validarSoloNum(event)" //el return  es necesario para el espacio.
        var theEvent = evt || window.event;

        // Handle paste
        if (theEvent.type === 'paste') {
            key = event.clipboardData.getData('text/plain');
        } else {
            // Handle key press
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode(key);
        }

        let k = event ? event.which : window.event.keyCode;
        if (k == 32) return false;

        var regex = /[0-9]/; //Numeros
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }

    }
}


$(document).ready(function () {

    const fechaInicioAsigHor = moment().startOf('year').format('DD/MM/YYYY') + ' 00:00:00';
    const fechaFinAsigHor = moment().endOf("year").format('DD/MM/YYYY') + ' 23:59:59';

    $.post(
        '/Personal/ListarCombosPersonal',
        { intIdMenu: 0, strEntidad: 'TGUNIDORG', intIdFiltroGrupo: 0, strGrupo: 'JERAR', strSubGrupo: 'FILTRO' },//08.09.2021
        (response) => {
            $('#empresaId').empty();
            //$('#empresaId').append('<option value="0" selected>Todos</option>');

            response.forEach(element => {
                $('#empresaId').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');
            });

        });

    getTableCambiosDI(fechaInicioAsigHor, fechaFinAsigHor)

})

function getTableCambiosDI(filtrojer_ini_var = null, filtrojer_fin_var = null) {

    var buscarId = $("#buscarId").val()
    var empresaId = parseInt($("#empresaId").val())

    let filtrojer_ini = filtrojer_ini_var ? filtrojer_ini_var : null;
    let filtrojer_fin = filtrojer_fin_var ? filtrojer_fin_var : null;

    $.ajax({
        url: '/Personal/ListarCambioDI',
        type: 'POST',
        data: {
            buscarId: buscarId,
            empresaId: empresaId,
            filtrojer_ini: filtrojer_ini,
            filtrojer_fin: filtrojer_fin
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

            if (typeof _varTablaCambioDI !== 'undefined') {
                _varTablaCambioDI.destroy();
            }

            _varTablaCambioDI = $('#datatable-CambiosDI').DataTable({
                data: response,
                columns: [
                    { data: 'strNumDocNew' },
                    { data: 'strNomCompleto' },
                    { data: 'strNumDocAnt' },
                    { data: 'strUniOrg' },
                    { data: 'strNomUsuarReg' },
                    { data: 'dttFeRegistro' },
                ],
                lengthMenu: [10, 25, 50],
                order: [],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [],
                dom: 'lBfrtip',
            });
        },
        complete: function () {
            $.unblockUI();
        }
    })
}
function cleanForm() {
    $("#newTipoDocId").attr('disabled', true)
    $("#newNumDocId").attr('disabled', true)

    $("#newTipoDocId").val(0)
    $("#newNumDocId").val("")
    $('#apeId').val("")
    $('#nomId').val("")
    $('#codEmpId').val("")
    $('#numRegId').val("")
    $('#fotocheckId').val("")
    $('#uniOrgId').val("")
    $('#txtfechaNacId_').val("")
}
function getCambioDI() {
    var titulo_ = 'Cambio de Documento de Identidad'

    $.post(
        '/Personal/ListarComboGlobal',
        {
            intIdMenu: 0,
            strEntidad: 'TSTIPDOC02',
            intIdFiltroGrupo: 0,
            strGrupo: 'PER',
            strSubGrupo: '',
        },
        response => {
            response.forEach(element => {
                $('#TipoDoc').append('<option value="' + element.intId + '" maxdata="' + element.strCodigo + '"  >' + element.strDescripcion + '</option>')
                $('#newTipoDocId').append('<option value="' + element.intId + '" maxdata="' + element.strCodigo + '"  >' + element.strDescripcion + '</option>')
            })
            //-------------------------------------------------------------------
            $("#TipoDoc").val(1);//añadido 21.05.2021 DNI por defecto.
            let maxdata = $('option:selected', "#TipoDoc").attr('maxdata')
            $('#txtNumDoc').attr('maxlength', maxdata)
            $('#txtNumDoc').attr('minlength', maxdata)
            //$('#txtNumDoc').attr('onkeypress', "return validarSoloNumCDI(event)")//añadido 13.09.2021
            document.getElementById("txtNumDoc").focus();//añadido 21.05.2021
            //-------------------------------------------------------------------
        })



    $('#txtNumDoc').keypress(function (e) {
        validarSession()
        if (e.which == 13) {
            if ($('#TipoDoc').val() == '0') {
                messageResponseMix({ type: 'info', message: 'Seleccione el tipo de documento a cambiar' }, titulo_)
                $('#TipoDoc').focus()
                return false
            }

            var NumDoc = $('#txtNumDoc').val()

            if (NumDoc == '') {
                messageResponseMix({ type: 'info', message: 'Ingrese el Número de documento a cambiar' }, titulo_)
                $('#txtNumDoc').focus()
                return false
            } else if (NumDoc !== '') {

                var intIdTipDocConsulta = $('#TipoDoc').val()

                $.post(
                    '/Personal/ValidarDocCambioIdentidad',
                    {
                        intIdTipDoc: Number(intIdTipDocConsulta),
                        strNumDoc: NumDoc,
                    },
                    response => {
                        if (response.objeto == null) {
                            messageResponseMix({ type: response.type, message: response.message }, titulo_)
                            cleanForm()
                        } else {
                            let dataObject = response.objeto
                            //let fechaMostrarPorDefecto = moment().format('DD/MM/YYYY')

                            $('#msgVerifDoc').html('&nbsp;&nbsp;&nbsp;<i class="fa fa-lock" style="color:green;font-size:25px;" id="HabNumDoc"></i>')

                            $("#leyenda_").hide()//añadido 21.05.2021
                            $("#TipoDoc").attr('disabled', true)
                            $("#txtNumDoc").attr('disabled', true)
                            $("#newTipoDocId").attr('disabled', false)
                            $("#newNumDocId").attr('disabled', true) //modificado 13.09.2021


                            $("#intIdPersonal").val(dataObject.intIdPersonal)
                            $('#apeId').val(dataObject.strApellidos)
                            $('#nomId').val(dataObject.strNombres)
                            $('#codEmpId').val(dataObject.strCoPersonal)
                            $('#numRegId').val(dataObject.strNumRegis)
                            $('#fotocheckId').val(dataObject.strFotocheck)
                            $('#uniOrgId').val(dataObject.strUniOrg)
                            //modificado 06/08/2021
                            if (dataObject.dttFecNacim != null) {
                                var x = dataObject.dttFecNacim.substr(6, 4) + '-' + dataObject.dttFecNacim.substr(3, 2) + '-' + dataObject.dttFecNacim.substr(0, 2);
                                $('#txtfechaNacId_').val(x);
                            } else {
                                $('#txtfechaNacId_').val("");
                            }
                            //$('#txtfechaNacId').val(dataObject.dttFecNacim)

                            $('#HabNumDoc').on('click', function () {
                                swal({
                                    title: 'Cambiar Doc. Identidad',
                                    text: 'Se perderá toda la información ingresada',
                                    type: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Sí, cambiar',
                                    cancelButtonText: 'No, cancelar',
                                }).then(function (isConfirm) {
                                    if (isConfirm) {
                                        $("#TipoDoc").attr('disabled', false)
                                        $("#txtNumDoc").attr('disabled', false)
                                        $("#newTipoDocId").attr('disabled', true)
                                        $("#newNumDocId").attr('disabled', true)

                                        //$("#TipoDoc").val(0)
                                        $("#txtNumDoc").val('')

                                        $('#msgVerifDoc').html('&nbsp;&nbsp;&nbsp;<i class="fa fa-unlock" style="color:red;font-size:25px;"></i>')
                                        $("#leyenda_").show()//añadido 21.05.2021
                                        document.getElementById("txtNumDoc").focus();//añadido 21.05.2021
                                        cleanForm()
                                    } else {
                                        swal('Cancelled', 'Your imaginary file is safe :)', 'error')
                                    }
                                })
                            })

                        }
                    })
            }

        }
    })

    $('#newTipoDocId').change(function () {
        var titulo_ = 'Cambio de Documento de Identidad'
        const valorDoc = $(this).val()
        $('#newNumDocId').val('')
        let maxdata = $('option:selected', this).attr('maxdata')

        if (valorDoc == '' || valorDoc == '0') {
            messageResponseMix({ type: 'info', message: 'Seleccione el Nuevo Tipo de Documento' }, titulo_)
            $('#newNumDocId').prop('disabled', true)
            $('#newNumDocId').removeAttr('maxlength')
            $('#newNumDocId').removeAttr('minlength')
        } else {
            if (maxdata == '0') {
                $('#newNumDocId').removeAttr('maxlength')
                $('#newNumDocId').removeAttr('minlength')
            } else {
                $('#newNumDocId').attr('maxlength', maxdata)
                $('#newNumDocId').attr('minlength', maxdata)
            }
            //$('#newNumDocId').attr('onkeypress', "return validarSoloNumCDINew(event)")//añadido 13.09.2021
            $('#newNumDocId').prop('disabled', false)
        }
    })
    $('#TipoDoc').change(function () {
        var titulo_ = 'Cambio de Documento de Identidad'
        const valorDoc = $(this).val()
        $('#txtNumDoc').val('')
        let maxdata = $('option:selected', this).attr('maxdata')

        if (valorDoc == '' || valorDoc == '0') {
            messageResponseMix({ type: 'info', message: 'Seleccione un tipo de documento' }, titulo_)
            $('#txtNumDoc').prop('disabled', true)
            $('#txtNumDoc').removeAttr('maxlength')
            $('#txtNumDoc').removeAttr('minlength')
        } else {
            if (maxdata == '0') {
                $('#txtNumDoc').removeAttr('maxlength')
                $('#txtNumDoc').removeAttr('minlength')
            } else {
                $('#txtNumDoc').attr('maxlength', maxdata)
                $('#txtNumDoc').attr('minlength', maxdata)
            }
            $('#txtNumDoc').prop('disabled', false)
        }
        //$('#txtNumDoc').attr('onkeypress', "return validarSoloNumCDI(event)")//añadido 13.09.2021
        document.getElementById("txtNumDoc").focus();//añadido 21.05.2021
    })

}

$('.range-datepicker').on('apply.daterangepicker', function (ev, picker) {
    validarSession()
    let filtrojer_ini = $('#fechaRegistroId').data('daterangepicker').startDate.format('DD/MM/YYYY') + ' 00:00:00'
    let filtrojer_fin = $('#fechaRegistroId').data('daterangepicker').endDate.format('DD/MM/YYYY') + ' 23:59:59'
    getTableCambiosDI(filtrojer_ini, filtrojer_fin)
});
$('#btn-new-cambioDI').on('click', function () {
    validarSession()
    $('.form-hide-cambioDI').show();
    $.post(
        '/Personal/NuevoCambioDI',
        {},
        (response) => {
            if (response !== '') {
                $('.form-hide-cambioDI .x_content').empty();
                $('.form-hide-cambioDI .x_content').html(response);
                getCambioDI()
                $('.form-hide-cambioDI').show();
            }
        });

});
$('#btn-save-change-cambioDI').on('click', function () {
    validarSession()

    var titulo_ = 'Cambio de Documento de Identidad'
    var intIdPerso = $('#intIdPersonal').val()
    var intIdTipDocAnt = $('#TipoDoc').val()
    var strNumDocAnt = $('#txtNumDoc').val()
    var intIdTipDocNue = $('#newTipoDocId').val()
    var strNumDocNue = $('#newNumDocId').val()
    //var strFechaNac = $('#txtfechaNacId').val()

    //AÑADIDO 06.08.2021
    var x_ = $('#txtfechaNacId_').val();
    strFechaNac = x_.substr(8, 2) + '/' + x_.substr(5, 2) + '/' + x_.substr(0, 4);

    //añadido 10.09.2021 Calcular Si es o no Mayor de Edad) - Inicio
    var SplitFNac = strFechaNac.split("/");
    const Hoy = Date.now();
    const fhoy = new Date(Hoy);
    var Dhoy = parseInt(fhoy.getDate(), 10);
    var Mhoy = parseInt(fhoy.getMonth(), 10) + 1; //Enero = 0
    var Ahoy = parseInt(fhoy.getFullYear(), 10);
    var DNac = parseInt(SplitFNac[0], 10);
    var MNac = parseInt(SplitFNac[1], 10);
    var ANac = parseInt(SplitFNac[2], 10);
    var ValidaMayorEdad = false;
    if ((Ahoy - ANac) < 18) {
        ValidaMayorEdad = false;
    } else if ((Ahoy - ANac) == 18) {
        //Validar Meses
        if (Mhoy < MNac) {
            ValidaMayorEdad = false;
        } else if (Mhoy == MNac) {
            //Validar Día
            if (Dhoy >= DNac) {
                ValidaMayorEdad = true;
            } else {
                ValidaMayorEdad = false;
            }
        } else {
            ValidaMayorEdad = true;
        }
    } else {
        ValidaMayorEdad = true;
    }
    //añadido 10.09.2021 Calcular Si es o no Mayor de Edad) - Fin



    var Cod_ = $('#codEmpId').val()

    if (intIdTipDocAnt == '0' || strNumDocAnt == "") {
        messageResponseMix({ type: 'info', message: 'Ingrese el Tipo y Número de Doc. Identidad a Cambiar' }, 'Identificar Doc. a Cambiar')
        $('#txtNumDoc').focus()
        return false
    }
    if (Cod_ == "") {
        messageResponseMix({ type: 'info', message: 'Presione ENTER para buscar el Documento a Cambiar' }, 'Identificar Doc. a Cambiar')
        $('#txtNumDoc').focus()
        return false
    }
    if (intIdTipDocNue == '0') {
        messageResponseMix({ type: 'info', message: 'Seleccione el nuevo tipo de documento' }, titulo_)
        $('#newTipoDocId').focus()
        return false
    }

    if (strNumDocNue == "") {
        messageResponseMix({ type: 'info', message: 'Ingrese el nuevo número de documento' }, titulo_)
        $('#newNumDocId').focus()
        return false
    }
    if (strFechaNac == '') {
        messageResponseMix({ type: 'info', message: 'Ingrese la Fecha de Nacimiento' }, titulo_)
        $('#txtfechaNacId_').focus()
        return false
    }
    if (ValidaMayorEdad == false) {//añadido 10.09.2021
        messageResponseMix({ type: 'info', message: 'El Empleado no puede ser Menor de Edad. Corrija la fecha de nacimiento.' }, titulo_)
        focusControl('#txtfechaNacId_')
        return false
    }
    var personalCDI = {
        intIdPerso: intIdPerso
        , intIdTipDocAnt: intIdTipDocAnt
        , strNumDocAnt: strNumDocAnt
        , intIdTipDocNue: intIdTipDocNue
        , strNumDocNue: strNumDocNue
        , strFechaNac: strFechaNac
    }

    console.log(personalCDI)

    $.post(
        '/Personal/ActualizarCambioDI',
        {
            personalCDI: personalCDI
        },
        (response) => {
            if (response.type == 'success') {//|| response.type == 'infoc'
                $('.form-hide-cambioDI .x_content').empty();
                $('.form-hide-cambioDI').hide();
                let filtrojer_ini = $('#fechaRegistroId').data('daterangepicker').startDate.format('DD/MM/YYYY') + ' 00:00:00'
                let filtrojer_fin = $('#fechaRegistroId').data('daterangepicker').endDate.format('DD/MM/YYYY') + ' 23:59:59'

                getTableCambiosDI(filtrojer_ini, filtrojer_fin)
                messageResponseMix({ type: response.type, message: response.message }, titulo_)
            } else if (response.type == 'infoc') {
                $('.form-hide-cambioDI .x_content').empty();
                $('.form-hide-cambioDI').hide();
            } else {
                messageResponseMix({ type: response.type, message: response.message }, titulo_)
            }
        });
});
$('#btn-cancel-cambioDI').on('click', function () {
    validarSession()
    $('.form-hide-cambioDI').hide();
});

$("#buscarId, #empresaId").change(function () {
    validarSession()
    let filtrojer_ini = $('#fechaRegistroId').data('daterangepicker').startDate.format('DD/MM/YYYY') + ' 00:00:00'
    let filtrojer_fin = $('#fechaRegistroId').data('daterangepicker').endDate.format('DD/MM/YYYY') + ' 23:59:59'
    getTableCambiosDI(filtrojer_ini, filtrojer_fin)
})
