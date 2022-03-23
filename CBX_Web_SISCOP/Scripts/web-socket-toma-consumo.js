/* =================================================================================
 * =========  SCRIPT PARA EL WEB SOCKET, TRABAJA CON LA LIBRERIA SIGNALR
 * =================================================================================*/
/*
 * Este Script es solamente para matenimiento Toma de Consumos del proyecto Live
 * 
 */

$(function () {
    // Proxy created on the fly
    var cus = $.connection.cusHub; //
    // Declare a function on the job hub so the server can invoke it
    cus.client.displayCustomer = function () {
        getData();
    };
    $.connection.hub.start();
    getData();
});

////======================================================================martes19
var ArrayIntIdAsisteencia = new Array();
//En la primera vez  no se necesita ni un solo dato en la pantalla "Toma de Consumo""
var numero_de_ejecucion_de_getData = 0; //Entra como ejecución "cero" la primera vez.
function getData() {
    numero_de_ejecucion_de_getData++;//Luego aumenta en "uno"

    //PRIMERA EJECUCION DE ESTA FUNCION 'getData()'
    if (numero_de_ejecucion_de_getData < 2) {

        $.ajax({
            url: $("#GetAsistenciaTomaConsumo").val(),
            type: 'GET',
            datatype: 'json',
            success: function (data) {
                $.each(data.listCus, function (i, model) {
                });
            }
        });
    }

    //var $ultimoIdAsistencia = $('#lblIdAsistencia');  //solo se declara una vez//Comentado 14.04.2021 HG

    var $codigo_marcador = $('#lblcodigo_marcador');  //solo se declara una vez

    //SEGUNDA, TERCERA, CUARTA VEZ DE EJECUCION DE ESTA FUNCION 'getData()'
    if (numero_de_ejecucion_de_getData > 1) {

       // $(".site_title").hide();//comentado 06.05.2021
        //$("#sidebar-menu").hide();//comentado 06.05.2021
        //$("#pantalla_bienvenida_modo_espera").append('<h1 style="font-size:90px;" id="lblIdAsistencia" ></h1>');

        //$ultimoIdAsistencia.empty();//Comentado 14.04.2021 HG
        $('#input_idAsistencia').val('0');  //Añadido HGM 13.04.21
        mi_variable_global_ = 0;//añadido 14.04.2021 ES
        $.ajax({
            url: $("#GetAsistenciaTomaConsumo").val(),
            type: 'GET',
            datatype: 'json',
            success: function (data) {

                
                //$ultimoIdAsistencia.empty(); //Tambien debe ir entre medio de success y each//Comentado 14.04.2021 HG
                $('#input_idAsistencia').val('0');  //Añadido HGM 13.04.21
                $('#input_idAsistencia').empty();
                mi_variable_global_ = 0;//añadido 14.04.2021 ES

                $.each(data.listCus, function (i, model) {

                    //Se comenta 3 líneas 14.04.2021 HG
                    //$ultimoIdAsistencia.empty();
                    //$('#ultimo_id_asistencia').empty();
                    //$ultimoIdAsistencia.append('<label id="ultimo_id_asistencia">' + model.ultimoIntIdAsistencia + '</label>')
                    $('#input_idAsistencia').val('0');
                    $('#input_idAsistencia').val(model.ultimoIntIdAsistencia);
                    mi_variable_global_ = model.ultimoIntIdAsistencia //añadido pruebas 14.04.2021

                    $codigo_marcador.empty();
                    $('#codigo_marcador').empty();
                    $codigo_marcador.append('<label id="codigo_marcador">' + model.codigoMarcador + '</label>')

                    //$SIDEBAR_MENU.find('li.active ul').hide();//comentado 06.05.2021
                    //$SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');//comentado 06.05.2021
                    //$('.nav-md nav-sm').hide();//comentado 06.05.2021
                    //$('.nav-sm').hide;//comentado 06.05.2021
                    //$('.nav-md').hide;//comentado 06.05.2021
                    $('#contenedor_render_body').removeClass('right_col');
                    $('#profile_clearfix').hide();
                    $("#contenedor_lateral_izquierdo").hide();
                    barra_cerrar_sesion();


                    //añadido y copiado para contraer la barra de menús-06.05.2021
                    if ($BODY.hasClass('nav-md')) {
                        $(".site_title img").attr("src", "/images/logo_short.jpeg");
                        $(".site_title").addClass("p-0")
                        $SIDEBAR_MENU.find('li.active ul').hide();
                        $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
                    }

                    $BODY.toggleClass('nav-md nav-sm');

                    setContentHeight();

                    $('.dataTable').each(function () { $(this).dataTable().fnDraw(); });
                    //fin del añadido



                });

            }, complete: function (data) {
            }

        });
    }

}


$('#table-lista-servicios-disponibles').hide(); //martes05
