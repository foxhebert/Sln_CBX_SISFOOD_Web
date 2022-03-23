function avoidSpaceInput(event) {
    let k = event ? event.which : window.event.keyCode;
    if (k == 32) return false;
}

function mostrarClaveEdit1() {
    const el = document.getElementById("buttomshowpassedit1");
    const x = document.getElementById("ps_edit_uno");
    if (x.type === "password") {
        x.type = "text";
        el.innerHTML = '<i class="fa fa-eye-slash"></i>';
    } else {
        x.type = "password";
        el.innerHTML = '<i class="fa fa-eye"></i>';
    }
}

function validarSession() {
    $.post('/Configuracion/ValidarSession', {}, response => {
        if (response) {

            window.open('/LoginSiscop/CerrarSesion', '_self');
            ////alert('no tiene sesion')
            //window.stop();
        }
    });    
}

function mostrarClaveEdit2() {
    const el = document.getElementById("buttomshowpassedit2");
    const x = document.getElementById("ps_edit_dos");
    if (x.type === "password") {
        x.type = "text";
        el.innerHTML = '<i class="fa fa-eye-slash"></i>';
    } else {
        x.type = "password";
        el.innerHTML = '<i class="fa fa-eye"></i>';
    }
}

function mostrarClaveEdit3() {
    const el = document.getElementById("buttomshowpassedit3");
    const x = document.getElementById("ps_edit_tres");
    if (x.type === "password") {
        x.type = "text";
        el.innerHTML = '<i class="fa fa-eye-slash"></i>';
    } else {
        x.type = "password";
        el.innerHTML = '<i class="fa fa-eye"></i>';
    }
}

function cambiarTipoDeInput() {
    document.getElementById("buttomshowpassedit1").innerHTML = '<i class="fa fa-eye"></i>';
    document.getElementById("ps_edit_uno").type = "password";
    document.getElementById("buttomshowpassedit2").innerHTML = '<i class="fa fa-eye"></i>';
    document.getElementById("ps_edit_dos").type = "password";
    document.getElementById("buttomshowpassedit3").innerHTML = '<i class="fa fa-eye"></i>';
    document.getElementById("ps_edit_tres").type = "password";

    //const el1 = document.getElementById("buttomshowpassedit1");
    //const x1 = document.getElementById("ps_edit_uno");
    //const el2 = document.getElementById("buttomshowpassedit2");
    //const x2 = document.getElementById("ps_edit_dos");
    //const el3 = document.getElementById("buttomshowpassedit3");
    //const x3 = document.getElementById("ps_edit_tres");

    //if (x1.type === "password") {
    //    x1.type = "text";
    //    el1.innerHTML = '<i class="fa fa-eye-slash"></i>';
    //} else {
    //    x1.type = "password";
    //    el1.innerHTML = '<i class="fa fa-eye"></i>';
    //}
    //if (x2.type === "password") {
    //    x2.type = "text";
    //    el2.innerHTML = '<i class="fa fa-eye-slash"></i>';
    //} else {
    //    x2.type = "password";
    //    el2.innerHTML = '<i class="fa fa-eye"></i>';
    //}
    //if (x3.type === "password") {
    //    x3.type = "text";
    //    el3.innerHTML = '<i class="fa fa-eye-slash"></i>';
    //} else {
    //    x3.type = "password";
    //    el3.innerHTML = '<i class="fa fa-eye"></i>';
    //}

    ////document.getElementById("buttomshowpass").innerHTML = '<i class="fa fa-eye"></i>';
    ////document.getElementById("txt_psw").type = "password";
    ////document.getElementById("buttomshowpassedit1").innerHTML = '<i class="fa fa-eye"></i>';
    ////document.getElementById("ps_edit_uno").type = "password";
    ////document.getElementById("buttomshowpassedit2").innerHTML = '<i class="fa fa-eye"></i>';
    ////document.getElementById("ps_edit_dos").type = "password";
}
focusMethod = function getFocus() {
    document.getElementById("dni_Empleado_input").focus();
}


$(document).ready(function () {

    $("#btn-cancel-contra").click(function (e) {
        validarSession()
        $("#ps_edit_uno").val('');
        $("#ps_edit_dos").val('');
        $("#ps_edit_tres").val('');
        $("#modalContra").modal('hide');
        cambiarTipoDeInput();

        //----------AÑADIDO 06.05.2021------------------------------------
        //CONSULTAR EL CODIGO DE LA VENTANA-MENU: USO EXCLUSIVO TOMA DE CONSUMO
        $.post(
            '/Seguridad/setCoMenuGlo_',
            {
                CoMenu: '',
                Operac: 'GET',
            },
            response => {
                //añadido 06.05.2021 condicion solo para Toma de Consumo
                let CODIGO_MENU_TOMA = response;
                if (CODIGO_MENU_TOMA === 'M0314') {
                    focusMethod();
                }
            })
        //----------FIN AÑADIDO 06.05.2021------------------------------------

    })

    $("#btn-save-change-contra").click(function (e) {
        validarSession()
        let estate = $("#ps_edit_dos").attr('validationpass')
        let estate2 = $("#ps_edit_tres").attr('validationpass')
        var token = $('input[name="__RequestVerificationToken"]', "#claveForm").val();

        let claveActual = $("#ps_edit_uno").val();
        let claveNuevo = $("#ps_edit_dos").val();

        if (estate == "false") {
            $("#ps_edit_dos").focus();
            new PNotify({
                title: "Actualizar Contraseña",
                text: "La contraseña no cumple con las políticas.",
                type: "error",
                delay: 3000,
                styling: 'bootstrap3'
            });
            return false;
        }

        if (estate2 == "false") {
            $("#ps_edit_tres").focus();
            new PNotify({
                title: "Actualizar Contraseña",
                text: "La contraseña no es igual.",
                type: "error",
                delay: 3000,
                styling: 'bootstrap3'
            });
            return false;
        }

        if (claveActual.trim() === claveNuevo.trim()) {
            new PNotify({
                title: "Actualizar Contraseña",
                text: "La nueva contraseña ingresada debe ser distinta a la actual.",
                type: 'error',
                delay: 3000,
                styling: 'bootstrap3'
            });
            $("#ps_edit_dos").focus();
            return false;
        }

        $.ajax({
            url: "/LoginSiscop/CambiarClave",
            method: "POST",
            data: {
                __RequestVerificationToken: token,
                contraseña: claveActual,
                nuevacontraseña: claveNuevo
            },
            success: function (data) {

                if (data.type == "errorNoLoginFinalizado" || data.type == "errorNoLogin") {
                    new PNotify({
                        title: "Actualizar Contraseña",
                        text: data.extramsg,
                        type: "error",
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                }

                if (data.type == "success") {
                    new PNotify({
                        title: "Actualizar Contraseña",
                        text: "Contraseña actualizada con éxito.",
                        type: "success",
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                }

                if (data.type == "errorNoNoincide") {
                    $("#ps_edit_uno").focus();
                    new PNotify({
                        title: "Actualizar Contraseña",
                        text: data.message,
                        type: 'error',
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                }

                if (data.type == "errorPassIgual") {
                    $("#ps_edit_dos").focus();
                    new PNotify({
                        title: "Actualizar Contraseña",
                        text: data.message,
                        type: 'error',
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                }

                if (data.type == "error") {
                    new PNotify({
                        title: 'Actualizar Contraseña',
                        text: data.message,
                        type: 'error',
                        delay: 3000,
                        styling: 'bootstrap3',

                    });
                }
                $("#modalContra").modal('hide');
            },
            error: function (error) {
                new PNotify({
                    title: "Actualizar Contraseña",
                    text: error,
                    type: 'error',
                    delay: 3000,
                    styling: 'bootstrap3'
                });
                $("#modalContra").modal('hide');
            }
        });

        //----------AÑADIDO 06.05.2021------------------------------------
        //CONSULTAR EL CODIGO DE LA VENTANA-MENU: USO EXCLUSIVO TOMA DE CONSUMO
        $.post(
            '/Seguridad/setCoMenuGlo_',
            {
                CoMenu: '',
                Operac: 'GET',
            },
            response => {
                //añadido 06.05.2021 condicion solo para Toma de Consumo
                let CODIGO_MENU_TOMA = response;
                if (CODIGO_MENU_TOMA === 'M0314') {
                    focusMethod();
                }
            })
        //----------FIN AÑADIDO 06.05.2021------------------------------------
    })

    $("#btnContra").click(function () {
        validarSession()
        $("#ps_edit_uno").val('');
        $("#ps_edit_dos").val('');
        $("#ps_edit_tres").val('');
        cambiarTipoDeInput()
        $("#modalContra").modal('show');
        
        //----------AÑADIDO 06.05.2021------------------------------------
        //CONSULTAR EL CODIGO DE LA VENTANA-MENU: USO EXCLUSIVO TOMA DE CONSUMO
        $.post(
            '/Seguridad/setCoMenuGlo_',
            {
                CoMenu: '',
                Operac: 'GET',
            },
            response => {
                //añadido 06.05.2021 condicion solo para Toma de Consumo
                let CODIGO_MENU_TOMA = response;
                if (CODIGO_MENU_TOMA === 'M0314') {
                    focusMethod();
                }
            })
        //----------FIN AÑADIDO 06.05.2021------------------------------------
    })

    $('#ps_edit_dos').keyup(function () {
        // set password variable
        var pswd = $(this).val();
        var estate = false;
        var estateEspecial = false;
        //validate the length
        if (pswd.length < 8) {
            $('#length').show();
        } else {
            $('#length').hide();
        }

        //validate letra
        if (pswd.match(/[a-z]/)) {
            $('#letter').hide()
        } else {
            $('#letter').show();
        }

        //validate capital letter
        if (pswd.match(/[A-Z]/)) {
            $('#capital').hide();
        } else {
            $('#capital').show();
        }

        //validate number
        if (pswd.match(/\d/)) {
            $('#number').hide();
        } else {
            $('#number').show();
        }

        //validate number \@@
        if (pswd.includes('@') || pswd.includes('#') || pswd.includes('$') || pswd.includes('%') || pswd.includes('/') || pswd.includes('_') || pswd.includes('-') || pswd.includes('.') || pswd.includes('(') || pswd.includes(')') || pswd.includes('*') || pswd.includes('+')) {
            $('#especial').hide();
            estateEspecial = true;
        } else {
            $('#especial').show();
        }

        if (pswd.length >= 8 && pswd.match(/[a-z]/) && pswd.match(/[A-Z]/) && pswd.match(/\d/) && estateEspecial) {
            estate = true;
        }


        $(this).attr('validationpass', estate)
        if (estate) {
            $('#contraneValidate').hide();
        } else {
            $('#contraneValidate').show();
        }

    }).
        focus(function () {
        let estate = $(this).attr('validationpass')
        if (estate) {
            $('#contraneValidate').hide();
        } else {
            $('#contraneValidate').show();
        }
        }).
        blur(function () {
        $('#contraneValidate').hide();
        });

    $('#ps_edit_tres').keyup(function () {
        // set password variable
        var pswd = $(this).val();
        var estate = false;
        //validate the length
        //validate letra
        if (pswd == $("#ps_edit_dos").val()) {
            $('#igual').hide()
            estate = true;
        } else {
            $('#igual').show()
        }

        $(this).attr('validationpass', estate)
        if (estate) {
            $('#contraneValidate2').hide();
        } else {
            $('#contraneValidate2').show();
        }

    }).
        focus(function () {
        let estate = $(this).attr('validationpass')
        if (estate) {
            $('#contraneValidate2').hide();
        } else {
            $('#contraneValidate2').show();
        }
        }).
        blur(function () {
        $('#contraneValidate2').hide();
    });

    $("#txt_psw").attr("oninvalid", "this.setCustomValidity('La contraseña debe ser de mínimo de 8 caracteres.')");
    $("#txt_psw").attr("oninput", "setCustomValidity('')");
    $("#ps_edit_uno").attr("oninvalid", "this.setCustomValidity('La contraseña debe ser de mínimo de 8 caracteres.')");
    $("#ps_edit_uno").attr("oninput", "setCustomValidity('')");

});
