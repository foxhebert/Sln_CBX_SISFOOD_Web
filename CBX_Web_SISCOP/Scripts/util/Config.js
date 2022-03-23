const formatoFecha = 'DD/MM/YYYY'
let BitCheckAutentica = false;
let BitCheckWdms = false;
$(document).ready(function () {
    const intIdPersonal = window.SISCOP.intIdPersonal
    CargaInicial();
})

function CargaInicial() {
    validarSession()
    var intIdMenu = 0

    var SesionMovi = {
        IntIdMenu: 'M0314',
        intIdUsuario: idUsuar,
        intIdSoft: idSoftw,
        intIdSesion: intIdSe
    }

    //Aquí traer Lista de datos a mostrar en cada configuración
    $.post(
        '/Configuracion/GetTablaConfiguracion',
        { objSesion: SesionMovi, strCoConfi: '' },
        (response) => {
            response.forEach(element => {
                if (element.strCoConfi === 'COD_PERSONAL') {
                    $('#txtLongCodPer_').val(element.strValorConfi);
                }

                if (element.strCoConfi === 'TIEMPO_ENTRE_MARCA') {
                    //este valor se almacena en minutos enteros
                    var time = parseInt(element.strValorConfi, 10);
                    if (time>=0) {
                        var TiempoMarcaHHMM = getTimeFromMin(time);
                    }
                    $('#tiempo_marca_').val(TiempoMarcaHHMM);
                }
                if (element.strCoConfi === 'HAB_TEMPORIZADOR_TOMACONSUMO') {
                    if (element.strValorConfi==='1') {
                        $('#ChbTemporizador_').iCheck('check')
                    } else {
                        $('#ChbTemporizador_').iCheck('uncheck')
                    }
                }
                if (element.strCoConfi === 'NIVELES_JERARQUICOS') {
                    $('#txtNivelMaxJerar_').val(element.strValorConfi);
                }

                //Regla de Negocio/Horario: --añadido 14.09.2021
                if (element.strCoConfi === 'HAB_ASIST_WDMS') {
                    if (element.strValorConfi === "1") {
                        $('#ChbWdms_').iCheck('check')
                        BitCheckWdms = true;
                    } else {
                        $('#ChbWdms_').iCheck('uncheck')
                        BitCheckWdms = false;
                    }
                }
                //Regla de Negocio:
                if (element.strCoConfi === 'RN_ASIST_WDMS') {

                    $.post(
                        '/Personal/ListarComboGlobal',
                        {
                            intIdMenu, strEntidad: 'TSCONFI', intIdFiltroGrupo: 0, strGrupo: 'TGREGLANEG', strSubGrupo: 'U',//intIdMenu, strEntidad: 'TGREGLANEGREGISTRO', intIdFiltroGrupo: 0, strGrupo: 'TGREGLANEG', strSubGrupo: 'U',
                        },
                        response => {
                            console.log(response);
                            $('#cboRNWDMS').empty()
                            $('#cboRNWDMS').append('<option value="0">Seleccione</option>')
                            response.forEach(element => {
                                $('#cboRNWDMS').append('<option value="' + element.intId + '">' + element.strDescripcion + '</option>')
                            })

                            $('#cboRNWDMS').val(element.strValorConfi);
                            if (BitCheckWdms) {
                                $('#cboRNWDMS').attr('disabled', false);
                            } else {
                                $('#cboRNWDMS').attr('disabled', true);
                            }
                        });
                }

                //Horario:
                if (element.strCoConfi === 'HORARIO_ASIST_WDMS') {

                    $.post(
                        '/Personal/ListarComboGlobal',
                        {
                            intIdMenu, strEntidad: 'TSCONFI', intIdFiltroGrupo: 0, strGrupo: 'TGHORARIO', strSubGrupo: 'U',//intIdMenu, strEntidad: 'TGHORARIOREGISTRO', intIdFiltroGrupo: 0, strGrupo: 'TGHORARIO', strSubGrupo: 'U',
                        },
                        response => {
                            console.log(response);
                            $('#cboHORWDMS').empty()
                            $('#cboHORWDMS').append('<option value="0">Seleccione</option>')
                            response.forEach(element => {
                                $('#cboHORWDMS').append('<option value="' + element.intId + '">' + element.strDescripcion + '</option>')
                            })

                            $('#cboHORWDMS').val(element.strValorConfi);
                            if (BitCheckWdms) {
                                $('#cboHORWDMS').attr('disabled', false);
                            } else {
                                $('#cboHORWDMS').attr('disabled', true);
                            }
                        });
                }


                //Servidor de Correo
                if (element.strCoConfi === 'SERVIDOR_CORREO') {
                    if (element.bitFlActivo == 1) {
                        $('#cambio_estado_').html()
                        $('#cambio_estado_').html('<input type="checkbox" class="js-switch" id="Activo_" style="float:right;" onchange="ChangeServidor(this)" checked /> Activo');
                        switcheryLoad();
                        UpDisabledConfi(1);//modificado 17.04.2021
                    }
                    else if (element.bitFlActivo == 0) {
                        $('#cambio_estado_').html();
                        $('#cambio_estado_').html('<input type="checkbox" class="js-switch" id="Activo_" style="float:right;" onchange="ChangeServidor(this)" unchecked /> Activo');
                        switcheryLoad();
                        UpDisabledConfi(0);//modificado 17.04.2021
                    }
                    $('#txtServidor_').val(element.strValorConfi);
                    
                }
                if (element.strCoConfi === 'PUERTOSERVIDOR_CORREO') {
                    $('#txtPuerto_').val(element.strValorConfi);
                }
                if (element.strCoConfi === 'AUTENTICAUSER_CORREO') {
                    $('#txtCorreoRemitente_').val(element.strValorConfi);
                }
                if (element.strCoConfi === 'REQUIEREAUTENTICACION_CORREO') {
                    if (element.strValorConfi === "1") {
                        $('#ckbAutenticaServidor_').iCheck('check')
                        BitCheckAutentica = true;
                    } else {
                        $('#ckbAutenticaServidor_').iCheck('uncheck')
                        BitCheckAutentica = false;
                    }
                }
                if (element.strCoConfi === 'AUTENTICAPASS_CORREO') {
                    $('#txtContraseRemitente_').val(element.strValorConfi);
                }
                if (element.strCoConfi === 'NOMBREREMITENTE_CORREO') {
                    $('#txtFirmaRemitente_').val(element.strValorConfi);
                }
                if (element.strCoConfi === 'URL_WEBSITE_COM') {
                    $('#txtUrlRemitente_').val(element.strValorConfi);
                }
                //Impresión de Tickets
                if (element.strCoConfi === 'HAB_IMPR_TICKET_COMEDOR') {
                    if (element.strValorConfi === "0") {
                        $('#chck_0_').iCheck('check')
                    } else if (element.strValorConfi === "1") {//AQUI
                        $('#chck_1_').iCheck('check')
                    } else if (element.strValorConfi === "2") {
                        $('#chck_2_').iCheck('check')
                    } else if (element.strValorConfi === "3") {
                        $('#chck_3_').iCheck('check')
                    } else if (element.strValorConfi === "4") {
                        $('#chck_4_').iCheck('check')
                    } else {
                        $('#chck_0_').iCheck('check')
                    }
                }

            });
        });

    //UpDisabledConfi();
}

//--------------------------------------------------------------------------------

function UpConfig() {
    var titulo_ = 'Actualización de Configuración'
    var SesionMovi = {
        IntIdMenu: 'M0314',
        intIdUsuario: idUsuar,
        intIdSoft: idSoftw,
        intIdSesion: intIdSe
    }

    class detalleConfig {
        constructor(intIdConfi,strCoConfi, strValorConfi, TipoControl, bitFlActivo) {
            this.intIdConfi = intIdConfi
            this.strCoConfi = strCoConfi
            this.strValorConfi = strValorConfi
            this.TipoControl = TipoControl
            this.bitFlActivo = bitFlActivo
        }
    }
    var txtServidor__ = $('#txtServidor_').val();
    var txtPuerto__ = $('#txtPuerto_').val();
    var txtCorreoRemitente__ = $('#txtCorreoRemitente_').val();
    var txtContraseRemitente__ = $('#txtContraseRemitente_').val();
    var txtFirmaRemitente__ = $('#txtFirmaRemitente_').val();
    var txtUrlRemitente__ = $('#txtUrlRemitente_').val();
    var txtLongCodPer__ = $('#txtLongCodPer_').val();
    var tiempo_marca__ = $('#tiempo_marca_').val();
    var txtNivelMaxJerar__ = $('#txtNivelMaxJerar_').val();
    var IdRN__ = $("#cboRNWDMS").val();
    var IdHOR__ = $("#cboHORWDMS").val();

        //Validaciones de Obligatoriedad
    if (txtLongCodPer__ === "" || txtLongCodPer__ === null) {
        messageResponseMix({ type: 'info', message: "La Longitud del Código de Personal es obligatoria." }, titulo_)
        return;
    }
    if (txtNivelMaxJerar__ === "" || txtNivelMaxJerar__ === null) {
        messageResponseMix({ type: 'info', message: "El N° máximo de Niveles Jerárquicos es obligatorio." }, titulo_)
        return;
    }

    if ($('#Activo_').is(':checked') == true) {
        if (txtServidor__ === "" || txtPuerto__ === "" || txtPuerto__ === "" || txtFirmaRemitente__ === "" || txtUrlRemitente__ === "" || txtUrlRemitente__ === null || txtFirmaRemitente__ === null || txtPuerto__ === null || txtServidor__ === null) {
            messageResponseMix({ type: 'info', message: "El Servidor, puerto, correo, firma y URL son obligatorios." }, 'Servidor de Correo')
            return;
        }

        if (txtContraseRemitente__ === "" && $('#ckbAutenticaServidor_').is(':checked') == true) {
            messageResponseMix({ type: 'info', message: "La contraseña es obligatoria." }, 'Autenticación de Correo')
            return;
        }
    }
    if ($('#ChbWdms_').is(':checked') == true) {
        if (IdRN__ === "" || IdRN__ === "0" || IdHOR__ === "" || IdHOR__ === "0" || IdRN__ === null || IdHOR__ === null) {//modificado null incluido 03.09.2021
            messageResponseMix({ type: 'info', message: "Debe seleccionar una regla de negocio y un horario por defecto." }, 'Integración WDMS')
            return;
        }
    }


    swal({
        title: "Actualizar Configuración",
        text: "¿Está seguro de guardar los cambios?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        allowOutsideClick: false, //añadido 25/03/2021
    }).then(function (isConfirm){
        if (isConfirm) {

               var detalleConfi = [];
                if (tiempo_marca__ === "" || tiempo_marca__ === null) {
                    tiempo_marca__ = "00:00";
                }

                var chck_Imp = "0";
                var ckbAutenticaServidor__ = "0";
                var ChbTemporizador__ = "0";
                var Activo__ = false;
                var ChbWdms__ = "0";

                if ($('#Activo_').is(':checked') == true) {
                    Activo__ = true;
                }
                if ($('#ckbAutenticaServidor_').is(':checked') == true) {
                    ckbAutenticaServidor__ = "1";
                }
                if ($('#ChbTemporizador_').is(':checked') == true) {
                    ChbTemporizador__ = "1";
                }
                if ($('#ChbWdms_').is(':checked') == true) {
                    ChbWdms__ = "1";
                }
                if ($('#chck_0_').is(':checked') == true) {
                    chck_Imp = "0";
                }
                if ($('#chck_1_').is(':checked') == true) {
                    chck_Imp = "1";
                }
                if ($('#chck_2_').is(':checked') == true) {
                    chck_Imp = "2";
                }
                if ($('#chck_3_').is(':checked') == true) {
                    chck_Imp = "3";
                }
                if ($('#chck_4_').is(':checked') == true) {
                    chck_Imp = "4";
                }
                

                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'COD_PERSONAL', strValorConfi = txtLongCodPer__, TipoControl = 'N', bitFlActivo = true));
                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'TIEMPO_ENTRE_MARCA', strValorConfi = tiempo_marca__, TipoControl = 'T', bitFlActivo = true));
                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'NIVELES_JERARQUICOS', strValorConfi = txtNivelMaxJerar__, TipoControl = 'N', bitFlActivo = true));
                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'HAB_TEMPORIZADOR_TOMACONSUMO', strValorConfi = ChbTemporizador__, TipoControl = 'B', bitFlActivo = true));
                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'HAB_ASIST_WDMS', strValorConfi = ChbWdms__, TipoControl = 'B', bitFlActivo = true));
                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'RN_ASIST_WDMS', strValorConfi = IdRN__, TipoControl = 'N', bitFlActivo = true));
                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'HORARIO_ASIST_WDMS', strValorConfi = IdHOR__, TipoControl = 'N', bitFlActivo = true));


                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'HAB_IMPR_TICKET_COMEDOR', strValorConfi = chck_Imp, TipoControl = 'C', bitFlActivo = true));

                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'SERVIDOR_CORREO', strValorConfi = txtServidor__, TipoControl = 'V', bitFlActivo = Activo__));
                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'PUERTOSERVIDOR_CORREO', strValorConfi = txtPuerto__, TipoControl = 'N', bitFlActivo = true));
                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'AUTENTICAUSER_CORREO', strValorConfi = txtCorreoRemitente__, TipoControl = 'V', bitFlActivo = true));
                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'REQUIEREAUTENTICACION_CORREO', strValorConfi = ckbAutenticaServidor__, TipoControl = 'B', bitFlActivo = true));
                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'AUTENTICAPASS_CORREO', strValorConfi = txtContraseRemitente__, TipoControl = 'V', bitFlActivo = true));
                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'NOMBREREMITENTE_CORREO', strValorConfi = txtFirmaRemitente__, TipoControl = 'V', bitFlActivo = true));
                detalleConfi.push(new detalleConfig(intIdConfi = 0, strCoConfi = 'URL_WEBSITE_COM', strValorConfi = txtUrlRemitente__, TipoControl = 'V', bitFlActivo = true));
                console.log(detalleConfi);

                    $.post(
                        '/Configuracion/ActualizarConfiguracion',
                        { objSesion: SesionMovi, detalleConfig: detalleConfi },
                        (response) => {
                            console.log(response);
                            if (response.type !== '') {

                                if (response.type === 'success') {
                                    messageResponseMix({ type: response.type, message: response.message }, titulo_)
                                } else {
                                    messageResponseMix({ type: response.type, message: response.message }, titulo_)
                                    return;
                                }

                            }
                        }
                    ).fail(function (result) {
                        alert('ERROR ' + result.status + ' ' + result.statusText);
                    });
        }}, function (dismiss)
        {
            if (dismiss === 'cancel')
            { // you might also handle 'close' or 'timer' if you used those
            } if (dismiss === 'overlay')
            {
                //ignorar
            } else {
            throw dismiss;
            }
        }
    );
}

//--------------------------------------------------------------------------------
function UpDisabledConfi(Num) {
    if (Num === 1) {
        //if ($('#Activo_').is(':checked') == true) {
        //Habilita todos los campos del Servidor segun corresponda:
        $('#txtServidor_').attr('disabled', false);
        $('#txtPuerto_').attr('disabled', false);
        $('#txtCorreoRemitente_').attr('disabled', false);
        $('#txtFirmaRemitente_').attr('disabled', false);
        $('#txtUrlRemitente_').attr('disabled', false);

        if ($('#ckbAutenticaServidor_').is(':checked') == false) {
            $('#txtContraseRemitente_').attr('disabled', true);
            $('#buttomshowpass').attr('disabled', true);
            $('#ckbAutenticaServidor_').attr('disabled', true);
        } else {
            $('#txtContraseRemitente_').attr('disabled', false);
            $('#buttomshowpass').attr('disabled', false);
            $('#ckbAutenticaServidor_').attr('disabled', false);
        }
    }
    else {
        //Deshabilita todos los campos del Servidor
        $('#txtServidor_').attr('disabled', true);
        $('#txtPuerto_').attr('disabled', true);
        $('#txtCorreoRemitente_').attr('disabled', true);
        $('#txtContraseRemitente_').attr('disabled', true);
        $('#buttomshowpass').attr('disabled', true);
        $('#ckbAutenticaServidor_').attr('disabled', true);
        $('#txtFirmaRemitente_').attr('disabled', true);
        $('#txtUrlRemitente_').attr('disabled', true);
    }
}

function ChangeServidor(checkbox) {
    if (checkbox.checked) {
        $('#txtServidor_').attr('disabled', false);
        $('#txtPuerto_').attr('disabled', false);
        $('#txtCorreoRemitente_').attr('disabled', false);
        $('#txtFirmaRemitente_').attr('disabled', false);
        $('#txtUrlRemitente_').attr('disabled', false);

        if ($('#ckbAutenticaServidor_').is(':checked') == false) {
             $('#txtContraseRemitente_').attr('disabled', true);
            $('#buttomshowpass').attr('disabled', true);
            $('#ckbAutenticaServidor_').attr('disabled', true);
        } else {
            $('#txtContraseRemitente_').attr('disabled', false);
            $('#buttomshowpass').attr('disabled', false);
            $('#ckbAutenticaServidor_').attr('disabled', false);
        }
    } else {
        //Deshabilita todos los campos del Servidor
        $('#txtServidor_').attr('disabled', true);
        $('#txtPuerto_').attr('disabled', true);
        $('#txtCorreoRemitente_').attr('disabled', true);
        $('#txtContraseRemitente_').attr('disabled', true);
        $('#buttomshowpass').attr('disabled', true);
        $('#ckbAutenticaServidor_').attr('disabled', true);
        $('#txtFirmaRemitente_').attr('disabled', true);
        $('#txtUrlRemitente_').attr('disabled', true);
    }
}
function mostrarPass() {
    const el = document.getElementById("buttomshowpass");
    const x = document.getElementById("txtContraseRemitente_");
    if (x.type === "password") {
        x.type = "text";
        el.innerHTML = '<i class="fa fa-eye-slash"></i>';
    } else {
        x.type = "password";
        el.innerHTML = '<i class="fa fa-eye"></i>';
    }
}
function getTimeFromMin(mins) {
    // do not include the first validation check if you want, for example,
    // getTimeFromMins(1530) to equal getTimeFromMins(90) (i.e. mins rollover)
    if (mins >= 24 * 60 || mins < 0) {
        //throw new RangeError("Valid input should be greater than or equal to 0 and less than 1440.");
        return "00:00";
    } else {
        var h = mins / 60 | 0,
            m = mins % 60 | 0;
        return moment.utc().hours(h).minutes(m).format("HH:mm");
    }

}
function filterEnter(evt, input) {
    // Backspace = 8, Enter = 13, ‘0′ = 48, ‘9′ = 57, ‘.’ = 46, ‘-’ = 43
    var key = window.Event ? evt.which : evt.keyCode;
    var chark = String.fromCharCode(key);
    var tempValue = input.value + chark;

    if (key >= 48 && key <= 57) {
        if (filterE(tempValue) === false) {
            return false;
        } else {
            return true;
        }
    } else {
        if (key == 8 || key == 13 || key == 0) {
            return true;
        } else if (key == 46) {
            if (filterE(tempValue) === false) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
}
function filterE(__val__) {
    var pregE = /^([1-9]{1,2})$/;

    if (pregE.test(__val__) === true) {
        return true;
    } else {
        return false;
    }
}
$('#ckbAutenticaServidor_').on('ifChanged', function () {
    if ($('#ckbAutenticaServidor_').is(':checked') == true) {
        BitCheckWdms = true;
        $('#txtContraseRemitente_').attr('disabled', false);
        $('#buttomshowpass').attr('disabled', false);
    } else {
        $('#txtContraseRemitente_').val("");
        $('#txtContraseRemitente_').attr('disabled', true);
        $('#buttomshowpass').attr('disabled', true);
        BitCheckWdms = false;
    }
})
$('#ChbWdms_').on('ifChanged', function () {
    if ($('#ChbWdms_').is(':checked') == true) {
        BitCheckAutentica = true;
        $('#cboRNWDMS').attr('disabled', false);
        $('#cboHORWDMS').attr('disabled', false);
    } else {
        $('#cboRNWDMS').val("0");
        $('#cboHORWDMS').val("0");
        $('#cboRNWDMS').attr('disabled', true);
        $('#cboHORWDMS').attr('disabled', true);
        BitCheckAutentica = false;
    }
})

$('#btn-update-Confi').on('click', function () {
    UpConfig()
});
