let direccion_ip = "";

//////////////////////////////////////////////////////////////////
// VALIDACION DE CARACTERES DE CODIGO - BASADO EN PERFIL
//////////////////////////////////////////////////////////////////
function validarCodigoAll(evt) {
    //onkeypress = "validarCodigoAll(event)"
    //let k = event ? event.which : window.event.keyCode;
    //if (k == 32) return false;

    var theEvent = evt || window.event;
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|[a-z]|[A-Z]|\_|\/|\-/; //Números, Letras ---> a-z,A-Z, _, - sin espacio, slash, guion, guion bajo
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }

}

function avoidSpaceInput(event) {
    let k = event ? event.which : window.event.keyCode;
    if (k == 32) return false;
}
$('body').on("keydown", function (e) {
    //Registrar Licencia
    if (e.ctrlKey && e.which === 88) { //// Ctrl+x  >>83:s  
        //if (e.ctrlKey && e.shiftKey && e.which === 83) { // 
        //alert("You pressed Ctrl + Shift + s");
        ActivarWCF(2)
        e.preventDefault();
    }
    //Generar Licencia
    if (e.ctrlKey && e.which === 96) { // Ctrl+0 >>O: 79
        ActivarWCF(1)
        e.preventDefault();
    }
    //Generar Licencia QA
    if (e.ctrlKey && e.which === 97) { // Ctrl+1
        ActivarWCF(3)
        e.preventDefault();
    }
});
function mostrarClave() {
    const el = document.getElementById("buttomshowpass");
    const x = document.getElementById("txt_psw");
    if (x.type === "password") {
        x.type = "text";
        el.innerHTML = '<i class="fa fa-eye-slash"></i>';
    } else {
        x.type = "password";
        el.innerHTML = '<i class="fa fa-eye"></i>';
    }
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
    document.getElementById("buttomshowpass").innerHTML = '<i class="fa fa-eye"></i>';
    document.getElementById("txt_psw").type = "password";
    document.getElementById("buttomshowpassedit1").innerHTML = '<i class="fa fa-eye"></i>';
    document.getElementById("ps_edit_uno").type = "password";
    document.getElementById("buttomshowpassedit2").innerHTML = '<i class="fa fa-eye"></i>';
    document.getElementById("ps_edit_dos").type = "password";
}

function ActivarWCF(Oper) {
    if (Oper == 2) {
        var titulo = 'Registrar Licencia'
    } else if (Oper == 3) {
        var titulo = 'Generar Token de Prueba'
    } else {
        var titulo = 'Generar Token'
    }

    console.log("activar WCF");
    swal({
        title: titulo,
        text: "",
        type: "warning",//"warning",
        html:
            '<br><input id="swal-input1" class="swal2-input" autofocus>',
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "CANCELAR",
    })
        .then(function (isConfirm) {
            console.log("THEN")
            var inputValue = $('#swal-input1').val();
            if (inputValue === "") {
                if (Oper == 2) {
                    var MSJ = 'Ingrese Token'
                } else {
                    var MSJ = 'Ingrese Serial'
                }
                swal.showInputError(MSJ);
                return false
            }
            var llave_ = inputValue.trim();
            $.post(
                '/LoginSiscop/RegistrarServerWCF',
                { llave: llave_, Oper: Oper },//{},
                (response) => {
                    if (response.type == "success") {
                        if (Oper == 2) {
                            var MSJ = 'Licencia Registrada'
                        } else {
                            var MSJ = 'Token Generado'
                        }
                        swal(MSJ, response.message, 'success');
                    } else {
                        if (Oper == 2) {
                            var MSJ = 'NO SE PUDO REGISTRAR LICENCIA'
                        } else {
                            var MSJ = 'NO SE PUDO GENERAR EL TOKEN'
                        }

                        swal("Operación no realizada", MSJ, 'error');
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

$("#olvideContrasena").click(function () {
    window.open('/LoginSiscop/RestablecerContrasena', '_blank');
})

$("#btnValidaCorreo").click(function () {
    let correo = $("#txt_correo").val()
    let numDoc = $("#txt_numDoc").val()

    if (!ValidateEmail(correo)) {
        new PNotify({
            title: "Correo",
            text: 'formato de correo incorrecto',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        return;
    }

    $.ajax({
        url: "/LoginSiscop/ValidarEmail",
        method: "POST",
        data: {
            correo,
            numDoc
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
            //alert(response.extramsg)
            if (response.message != null) {
                new PNotify({
                    title: "Restablecer contraseña",
                    text: response.message,
                    type: response.type,
                    delay: 3000,
                    styling: 'bootstrap3',
                    addclass: 'dark'
                });
            }

            if (response.extramsg != null) {
                if (response.objeto == 100) {
                    $("#btnValidaCorreo").prop('disabled', true);
                    updateClock(parseInt(response.extramsg))
                } else{
                    $("#responseError").html(`<div class="alert alert-danger alert-dismissible" role="alert">${response.extramsg}</div>`)
                    $("#responseError").show();
                }
            } else {
                $("#responseError").hide();                
                $("#txt_numDoc").val("")
                $("#txt_correo").val("")
            }
            
        },
        complete: function () {
            $.unblockUI();
        }
    });
})

$("#txt_correo, #txt_numDoc, #txt_usu, #txt_psw, #ps_edit_dos, #ps_edit_tres, #ps_edit_uno").bind({
    paste: function (e) {
        e.preventDefault()
        let output = e.originalEvent.clipboardData.getData('text').replaceAll(" ", "")
        $(this).val(output)
    }
});

function ValidateEmail(email) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (email.match(mailformat)) {
        return true
    }
    return false
}

function updateClock(totalTime) {
    $("#responseError").show();
    $("#responseError").html(`<div class="alert alert-danger alert-dismissible" role="alert">Espera ${totalTime} segundos para volver intentar.</div>`)
    if (totalTime == 0) {
        $("#responseError").hide();
        $("#btnValidaCorreo").prop('disabled', false);
    } else { 
        totalTime -= 1;
        setTimeout(`updateClock(${totalTime})`, 1000);
    }
}

function updateClockLogin(totalTime) {
    $("#responseError").show();
    $("#responseError").html(`<div class="alert alert-danger alert-dismissible" role="alert">Espera ${totalTime} segundos para volver intentar.</div>`)
    if (totalTime == 0) {
        $("#responseError").hide();
        $("#btnIngreso").prop('disabled', false);
    } else {
        totalTime -= 1;
        setTimeout(`updateClockLogin(${totalTime})`, 1000);
    }
}

$("#btnActualizarContrasena").click(function () {
    let estate = $("#ps_edit_dos").attr('validationpass')
    let estate2 = $("#ps_edit_tres").attr('validationpass')
    var token = $('input[name="__RequestVerificationToken"]', "#claveForm").val();

    let claveNuevo = $("#ps_edit_dos").val();

    if (estate == "false") {
        $("#ps_edit_dos").focus();
        new PNotify({
            title: "Actualizar Contraseña",
            text: "La contraseña no cumple con las políticas.",
            type: "error",
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
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
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        return false;
    }

    $.ajax({
        url: "/LoginSiscop/RestablecerContra",
        method: "POST",
        data: {
            __RequestVerificationToken: token,
            contrasena: claveNuevo,
            intIdPersonal: intIdPersona_TMP
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
        success: function (data) {

            if (data.type == "success") {

                swal({
                    type: 'success',
                    title: 'Restablecer Contraseña',
                    text: 'Se envió un correo de confirmación <br> <h5>Esta ventana se cerrara en 5 segundos...</h5>',
                    timer: 5000
                }).then(function () {
                    window.open("/LoginSiscop/LoginSiscop", "_self")
                }, function (dismiss) {
                    window.open("/LoginSiscop/LoginSiscop", "_self")
                });
                return;
            }

            if (data.type == "error") {
                new PNotify({
                    title: 'Actualizar Contraseña',
                    text: data.message,
                    type: 'error',
                    delay: 3000,
                    styling: 'bootstrap3',
                    addclass: 'dark'

                });
            }
        },
        complete: function () {
            $.unblockUI();
        }
    });
})

$(document).ready(function () {
    var URLactual = window.location;

    $("#btnCancelar").click(function (e) {
        $("#claveForm").hide();
        $("#loginForm").show();
        cambiarTipoDeInput();
    })

    $('#loginForm').on('submit', function (e) {
                let url = $(this).attr("action");
                let dataString = $(this).serialize();
                $("#claveForm").hide();
                //añadido 05.05.2021

                $.ajax({
                    url: url,
                    method: "POST",
                    data: dataString,
                    beforeSend: function () {
                        buttomLoading("Ingresando...")
                    },
                    success: function (data)
                    {
                        buttomLoading();
                        $("#responseError").html('');
                        if (data.codValida === 1) {
                            buttomLoading("Ingresando...")
                            window.location.href = "/Inicio/PaginaPrincipal";
                        } else if (data.codValida === 5) {
                            buttomLoading("Ingresar")
                            $('#loginForm').trigger("reset");
                            $("#loginForm").hide();
                            $("#claveForm").show();
                            cambiarTipoDeInput();
                        }

                        if (data.error == "login") {
                            $("#responseError").show();
                            if (data.strMensajeError != null && data.strMensajeError != "") {
                                errorShowLogin("Inicio de Sesión", data.strMensajeError)
                                if (!data.strMensajeError.includes("contraseña")) {
                                    $('form').trigger("reset");
                                } 
                            }
                            if (data.data != "") {
                                $("#btnIngreso").prop('disabled', true);
                                updateClockLogin(parseInt(data.data))
                            } else {
                                if (data.strMsgAlert != null || data.strMsgAlert != "") {
                                    $("#responseError").html(`<div class="alert alert-danger alert-dismissible" role="alert">${data.strMsgAlert}</div>`)
                                }
                            }
                        } else {
                            $("#responseError").hide();
                        }
                    },
                    error: function (error) {
                        location.reload();
                    }
                });
                e.preventDefault();

    });

    function buttomLoading(texto = "Ingresar") {
        $("#btnIngreso").html(texto);
    }

    $('#claveForm').on('submit', function (e) {
        let estate = $("#ps_edit_dos").attr('validationpass')
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


        if (claveActual.trim() === claveNuevo.trim()) {
            new PNotify({
                title: "Actualizar Contraseña",
                text: "La nueva contraseña ingresado deben ser distinta a la actual.",
                type: 'error',
                delay: 3000,
                styling: 'bootstrap3'
            });
            $("#ps_edit_dos").focus();
            return false;
        }



        let url = $(this).attr("action");
        let dataString = $(this).serialize();
        $.ajax({
            url: url,
            method: "POST",
            data: dataString,
            beforeSend: function () {
                $("#btnCambiar").html('Actualizando...')
            },
            success: function (data) {
                $("#btnCambiar").html('Actualizar')
                $("#responseError").html('');
                $("#responseError").html(`<div class="alert alert-danger alert-dismissible" role="alert">${data.extramsg}</div>`)
                if (data.type == "errorNoLoginFinalizado") {
                    $('#claveForm').trigger("reset");
                    $("#claveForm").hide();
                    $("#loginForm").show();
                    $("#txt_usu").focus();
                    //$("#responseError").html(`<div class="alert alert-danger alert-dismissible" role="alert">${data.extramsg}</div>`)
                }

                if (data.type == "errorNoLogin") {
                    $('#claveForm').trigger("reset");
                    $("#claveForm").hide();
                    $("#loginForm").show();
                    $("#txt_usu").focus();
                }

                if (data.type == "success") {
                    new PNotify({
                        title: "Actualizar Contraseña",
                        text: "Contraseña actualizada con éxito.",
                        type: "success",
                        delay: 3000,
                        styling: 'bootstrap3'
                    });

                    $('#claveForm').trigger("reset");
                    $("#claveForm").hide();
                    $("#loginForm").show();
                    $("#txt_usu").focus();
                    $("#responseError").hide();
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

            },
            error: function (error) {
                $("#btnCambiar").html('Actualizar')
                $('#claveForm').trigger("reset");
                $("#claveForm").hide();
                $("#loginForm").show();
                $("#txt_usu").focus();
            }
        });
        e.preventDefault();
    })

    function errorShowLogin(titulo, msg) {
        new PNotify({
            title: titulo,
            text: msg,
            type: 'error',
            delay: 3000,
            styling: 'bootstrap3',

        });
    }

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

    })

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

    })

    $("#txt_psw").attr("oninvalid", "this.setCustomValidity('La contraseña debe ser de mínimo de 8 caracteres.')");
    $("#txt_psw").attr("oninput", "setCustomValidity('')");
    $("#ps_edit_uno").attr("oninvalid", "this.setCustomValidity('La contraseña debe ser de mínimo de 8 caracteres.')");
    $("#ps_edit_uno").attr("oninput", "setCustomValidity('')");

});

