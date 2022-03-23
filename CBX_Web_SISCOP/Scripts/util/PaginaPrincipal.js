var intIdPersonal_ = 0;
var arrayEncabezadoCrystal = [];//añadido Hebert 19.07.2021
var adicional = "&pdf=1"; //Para PDF
var listGraficoDashboard = new Array();
var Sesion = intIdSe;

$(document).ready(function () {

    $("#ps_edit_dos, #ps_edit_tres, #ps_edit_uno").bind({
        paste: function (e) {
            e.preventDefault()
            let output = e.originalEvent.clipboardData.getData('text').replaceAll(" ", "")
            $(this).val(output)
        }
    });

    intIdPersonal_ = window.SISCOP.intIdPersonal;
    const filtrojer_ini = moment().startOf('year').format('DD/MM/YYYY') + ' 00:00:00';
    const filtrojer_fin = moment().endOf("year").format('DD/MM/YYYY') + ' 23:59:59';
    //btn_(0); //mostrar botones
    getCabeceras(filtrojer_ini, filtrojer_fin)
    getAsistenciaDiariaEdit(filtrojer_ini, filtrojer_fin)
    //getDiasAusencia(filtrojer_ini, filtrojer_fin)
    //getHorasDescontadas(filtrojer_ini, filtrojer_fin)
    //getHorasExtras(filtrojer_ini, filtrojer_fin)

})

$('.range-datepicker').on('apply.daterangepicker', function (ev, picker) {
    validarSession()
    let filtrojer_ini = $('#campJerar').data('daterangepicker').startDate.format('YYYY/MM/DD')
    let filtrojer_fin = $('#campJerar').data('daterangepicker').endDate.format('YYYY/MM/DD')

    const anioMenor = filtrojer_ini.substr(0, 4)
    const anioMayor = filtrojer_fin.substr(0, 4)

    const mesNumberMenor = parseInt(filtrojer_ini.substr(5, 2))
    const mesNumberMayor = parseInt(filtrojer_fin.substr(5, 2))

    if (anioMenor != anioMayor && mesNumberMenor == mesNumberMayor) {
        messageResponseMix({ type: 'info', message: 'Debe seleccionar 12 meses' }, 'Perfil')
        return false;
    } else {
        //reformatear 
        const filtrojer_ini = $('#campJerar').data('daterangepicker').startDate.format('DD/MM/YYYY') + ' 00:00:00';
        const filtrojer_fin = $('#campJerar').data('daterangepicker').endDate.format('DD/MM/YYYY') + ' 23:59:59';
        //btn_(0); //mostrar botones
        getCabeceras(filtrojer_ini, filtrojer_fin)
        getAsistenciaDiariaEdit(filtrojer_ini, filtrojer_fin)
        //getDiasAusencia(filtrojer_ini, filtrojer_fin)
        //getHorasDescontadas(filtrojer_ini, filtrojer_fin)
        //getHorasExtras(filtrojer_ini, filtrojer_fin)
    }
});

function btn_(evento) {
    if (evento == 1) {
        //-----------------------------------------------------------------
        $('#btn-generar-report-resumen-dashboard-crystal').show();
        $('#btn-generar-report-resumen-dashboard-pdf').show();
        $('#btn-generar-report-grafico-dashboard-crystal').show();
        $('#btn-generar-report-grafico-dashboard-pdf').show();
        //-----------------------------------------------------------------
    } else {
        //-----------------------------------------------------------------
        $('#btn-generar-report-resumen-dashboard-crystal').hide();
        $('#btn-generar-report-resumen-dashboard-pdf').hide();
        $('#btn-generar-report-grafico-dashboard-crystal').hide();
        $('#btn-generar-report-grafico-dashboard-pdf').hide();
        //-----------------------------------------------------------------
    }

}

function getCabeceras(fechaInicio, fechaFin) {
    arrayEncabezadoCrystal = [];//añadido Hebert 19.07.2021

    $.ajax({
        url: '/Inicio/ListarCabeceras',
        type: 'POST',
        data:
            { fechaInicio, fechaFin, intIdPersonal: intIdPersonal_ },
        async: true,
        beforeSend: function () {
        },
        success: function (response) {
            $(".tile_count").html("")
            if (response.length > 0) {
                response.forEach(x => {

                    var data = "";
                    data += `<div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                            <span class="count_top"><i class="${x.icon == '' ? 'fa fa-user' : x.icon}"></i> ${x.titulo}</span>
                            <div class="count green">${x.valor}</div>
                            <span class="count_bottom">${x.pie}</span>
                        </div>`

                    $(".tile_count").append(data)

                    ////Añadido Hebert 19.07.2021
                    ////------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    var Ietiq = x.pie.indexOf("<") + 1;
                    var Letiq = x.pie.length - 4; //se le corta </i>
                    var Npie = (x.pie).slice(Ietiq, Letiq);
                    Ietiq = Npie.indexOf(">") + 1;
                    Npie = Npie.slice(Ietiq, Letiq);
                    //var Col_i = x.pie.indexOf("/") - 2;
                    //var Col_f = x.pie.indexOf("/") + 8;
                    var Valida = x.valor.indexOf(":") + x.valor.indexOf("/");

                    if (Valida == "-2") { //Valores sin Simbolo de Horas ni Monetario (Valores de Días)
                        var ValidaVac = x.titulo.indexOf("Vac");
                        if (ValidaVac == "-1") { //No Vacaciones
                            arrayEncabezadoCrystal.push({ "strTitulo": x.titulo, "strValor": x.valor + ' Días', "strCalculadoFecha": Npie, "strTipoBienesX": "General", "strNumeroBienesY": "A" });
                            //arrayEncabezadoCrystal.push({ "strTitulo": x.titulo, "strValor": x.valor + ' Días', "strCalculadoFecha": (x.pie).slice(Col_i, Col_f), "strTipoBienesX": "General", "strNumeroBienesY": "A" });
                        } else {
                            arrayEncabezadoCrystal.push({ "strTitulo": x.titulo, "strValor": x.valor, "strCalculadoFecha": Npie, "strTipoBienesX": "Gestión de Vacaciones", "strNumeroBienesY": "B" });
                            //arrayEncabezadoCrystal.push({ "strTitulo": x.titulo, "strValor": x.valor, "strCalculadoFecha": (x.pie).slice(Col_i, Col_f), "strTipoBienesX": "Gestión de Vacaciones", "strNumeroBienesY": "B" });
                        }
                    } else {//Valores con Simbolo de Horas ni monetario (Sin Vacaciones)
                        if (x.valor.indexOf("/") == "-1") {
                            arrayEncabezadoCrystal.push({ "strTitulo": x.titulo, "strValor": x.valor + ' Horas', "strCalculadoFecha": Npie, "strTipoBienesX": "General", "strNumeroBienesY": "A" });
                            //arrayEncabezadoCrystal.push({ "strTitulo": x.titulo, "strValor": x.valor + ' Horas', "strCalculadoFecha": (x.pie).slice(Col_i, Col_f), "strTipoBienesX": "General", "strNumeroBienesY": "A" });
                        } else {
                            arrayEncabezadoCrystal.push({ "strTitulo": x.titulo, "strValor": x.valor, "strCalculadoFecha": Npie, "strTipoBienesX": "General", "strNumeroBienesY": "A" });
                            //arrayEncabezadoCrystal.push({ "strTitulo": x.titulo, "strValor": x.valor, "strCalculadoFecha": (x.pie).slice(Col_i, Col_f), "strTipoBienesX": "General", "strNumeroBienesY": "A" });
                        }
                    }
                    ////------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

                })
            } else {
                $(".tile_count").html("NO EXISTEN DATOS PARA MOSTRAR")
            }
        },
        complete: function () {
        }
    });
}

function getAsistenciaDiariaEdit(fechaInicio, fechaFin) {
    var echartBar = echarts.init(document.getElementById('mainPrincipal'), theme);
    echartGlobalInstance = echartBar

    var meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];

    $.ajax({
        url: '/Inicio/ListarAsistenciaDiaria',
        type: 'POST',
        data: { intIdPersonal: intIdPersonal_, fechaInicio: fechaInicio, fechaFin: fechaFin },
        async: true,
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
            const anioMenor = fechaInicio.substr(6, 4) //modificado decia 0,4
            const anioMayor = fechaFin.substr(6, 4) //modificado decia 0,4
            const mesNumberMenor = parseInt(fechaInicio.substr(3, 2)) //modificado decia 5,2
            const mesNumberMayor = parseInt(fechaFin.substr(3, 2))

            const anioGnl = anioMenor.substr(2, 2)

            const data_X = ['Ene' + anioGnl, 'Feb' + anioGnl, 'Mar' + anioGnl, 'Abr' + anioGnl, 'May' + anioGnl, 'Jun' + anioGnl, 'Jul' + anioGnl, 'Ago' + anioGnl, 'Set' + anioGnl, 'Oct' + anioGnl, 'Nov' + anioGnl, 'Dic' + anioGnl];
            var Dscr_ = ""; //añadido 19.07.2021

            if (anioMenor != anioMayor) {
                var listaMenorAsis = []
                var listaMenorInasis = []
                var listaMayorAsis = []
                var listaMayorInasis = []

                var numerador = 0

                for (var i = mesNumberMenor; i <= 12; i++) {
                    listaMenorAsis[i] = 0
                    listaMenorInasis[i] = 0
                    data_X[numerador] = meses[i - 1] + anioMenor.substr(2, 2)
                    numerador++
                }

                for (var i = 1; i <= mesNumberMayor; i++) {
                    listaMayorAsis[i] = 0
                    listaMayorInasis[i] = 0
                    data_X[numerador] = meses[i - 1] + anioMayor.substr(2, 2)
                    numerador++
                }

                response.forEach(element => {
                    //añadido 19.07.2021
                    switch (element.mes) {
                        case 01:
                            Dscr_ = "Enero " + element.anio;
                            break
                        case 02:
                            Dscr_ = "Febrero " + element.anio;
                            break
                        case 03:
                            Dscr_ = "Marzo " + element.anio;
                            break
                        case 04:
                            Dscr_ = "Abril " + element.anio;
                            break
                        case 05:
                            Dscr_ = "Mayo " + element.anio;
                            break
                        case 06:
                            Dscr_ = "Junio " + element.anio;
                            break
                        case 07:
                            Dscr_ = "Julio " + element.anio;
                            break
                        case 08:
                            Dscr_ = "Agosto " + element.anio;
                            break
                        case 09:
                            Dscr_ = "Septiembre " + element.anio;
                            break
                        case 10:
                            Dscr_ = "Octubre " + element.anio;
                            break
                        case 11:
                            Dscr_ = "Noviembre " + element.anio;
                            break
                        case 12:
                            Dscr_ = "Diciembre " + element.anio;
                            break
                    }

                    if (element.anio == anioMenor) {
                        listaMenorAsis[parseInt(element.mes)] = element.asistencia
                        listaMenorInasis[parseInt(element.mes)] = element.faltas

                    } else if (element.anio == anioMayor) {
                        listaMayorAsis[parseInt(element.mes)] = element.asistencia
                        listaMayorInasis[parseInt(element.mes)] = element.faltas
                    }

                    /////////////////////////////////////////////////////////////////////////
                    // CAPTURARAR LO QUE VA EN EL EJE X - añadido Hebert 19.07.2021
                    /////////////////////////////////////////////////////////////////////////
                    arrayEncabezadoCrystal.push({
                        "strTitulo": Dscr_,
                        "strValor": element.asistencia,
                        "strCalculadoFecha": element.faltas,
                        "strTipoBienesX": "Consumos Diarios",
                        "strNumeroBienesY": "C"
                    });
                    //////////////////////////////////////////////////////////////////////////

                });

                var list_asistencia = listaMenorAsis.concat(listaMayorAsis).filter(function (el) {
                    return el != null;
                });

                var list_inasistencia = listaMenorInasis.concat(listaMayorInasis).filter(function (el) {
                    return el != null;
                });
            } else {
                var list_asistencia = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                var list_inasistencia = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                response.forEach(element => {
                    switch (element.mes) {
                        case 01:
                            Dscr_ = "Enero " + element.anio;
                            list_asistencia[0] = element.asistencia;
                            list_inasistencia[0] = element.faltas;
                            break
                        case 02:
                            Dscr_ = "Febrero " + element.anio;
                            list_asistencia[1] = element.asistencia;
                            list_inasistencia[1] = element.faltas;
                            break
                        case 03:
                            Dscr_ = "Marzo " + element.anio;
                            list_asistencia[2] = element.asistencia;
                            list_inasistencia[2] = element.faltas;
                            break;
                        case 04:
                            Dscr_ = "Abril " + element.anio;
                            list_asistencia[3] = element.asistencia;
                            list_inasistencia[3] = element.faltas;
                            break;
                        case 05:
                            Dscr_ = "Mayo " + element.anio;
                            list_asistencia[4] = element.asistencia;
                            list_inasistencia[4] = element.faltas;
                            break;
                        case 06:
                            Dscr_ = "Junio " + element.anio;
                            list_asistencia[5] = element.asistencia;
                            list_inasistencia[5] = element.faltas;
                            break;
                        case 07:
                            Dscr_ = "Julio " + element.anio;
                            list_asistencia[6] = element.asistencia;
                            list_inasistencia[6] = element.faltas;
                            break;
                        case 08:
                            Dscr_ = "Agosto " + element.anio;
                            list_asistencia[7] = element.asistencia;
                            list_inasistencia[7] = element.faltas;
                            break;
                        case 09:
                            Dscr_ = "Septiembre " + element.anio;
                            list_asistencia[8] = element.asistencia;
                            list_inasistencia[8] = element.faltas;
                            break;
                        case 10:
                            Dscr_ = "Octubre " + element.anio;
                            list_asistencia[9] = element.asistencia;
                            list_inasistencia[9] = element.faltas;
                            break;
                        case 11:
                            Dscr_ = "Noviembre " + element.anio;
                            list_asistencia[10] = element.asistencia;
                            list_inasistencia[10] = element.faltas;
                            break;
                        case 12:
                            Dscr_ = "Diciembre " + element.anio;
                            list_asistencia[11] = element.asistencia;
                            list_inasistencia[11] = element.faltas;
                            break;
                    }

                    /////////////////////////////////////////////////////////////////////////
                    // CAPTURARAR LO QUE VA EN EL EJE X - añadido Hebert 19.07.2021
                    /////////////////////////////////////////////////////////////////////////
                    arrayEncabezadoCrystal.push({
                        "strTitulo": Dscr_,
                        "strValor": element.asistencia,
                        "strCalculadoFecha": element.faltas,
                        "strTipoBienesX": "Consumos Diarios",
                        "strNumeroBienesY": "C"
                    });
                    //////////////////////////////////////////////////////////////////////////
                });

            }

            echartGlobalInstance.setOption({
                title: {
                    text: 'Gráfico Anual de Consumos',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                //VALORES ENCIMA
                label: {
                    normal: {
                        show: true,
                        fontSize: 80,
                        fontWeight: 'bold',
                        position: 'top',
                        formatter: function (params) {
                            if (params.data == 0) {
                                return ``;
                            }
                        }
                    }
                },
                legend: {
                    bottom: 10,
                    left: 'center',
                    data: ['Consumos', 'Consumos Inválidos']
                },
                toolbox: {
                    show: false
                },
                calculable: false,
                xAxis: [{
                    bottom: -25,
                    left: -10,
                    type: 'category',
                    name: '\n   meses',
                    data: data_X
                }],
                yAxis: [{ //añadido 19.07
                    name: 'N° de Consumos',
                    type: 'value'
                }],
                series: [{
                    name: 'Consumos',
                    type: 'bar',
                    data: list_asistencia,
                    //label: {
                    //    show: true,
                    //    position: 'insideRight'
                    //},
                    //markLine: {
                    //    data: [{
                    //        type: 'average',
                    //        name: 'PROMEDIO'
                    //    }]
                    //}
                }, {
                    name: 'Consumos Inválidos',
                    type: 'bar',
                    data: list_inasistencia,
                    //label: {
                    //    show: true,
                    //    position: 'insideRight'
                    //},
                    //markLine: {
                    //    data: [{
                    //        type: 'average',
                    //        name: 'PROMEDIO'
                    //    }]
                    //}
                }]
            });
            //-------------------------------------------------------------------------
            getDiasAusencia(fechaInicio, fechaFin)
            //-------------------------------------------------------------------------

        },
        complete: function () {
            $.unblockUI();
        }
    });

}

function getDiasAusencia(fechaInicio, fechaFin) {


    $.ajax({
        url: '/Inicio/ListarDiasAusencia',
        type: 'POST',
        data:
            { fechaInicio, fechaFin, intIdPersonal: intIdPersonal_ },
        async: true,
        beforeSend: function () {
            $("#echart_pie2").html("Cargando...")
        },
        success: function (response) {
            var leyend = []
            var data = []
            $("#echart_pie2").empty()
            if (response.length > 0) {
                response.forEach(x => {
                    var longitud = x.strDesConcepto.length;
                    var Ley_ = "";
                    if (longitud <= 31) {
                        Ley_ = x.strDesConcepto + "\n(" + x.intTotalDias + ")\n";
                    } else { //recorta a 62 caracteres
                        Ley_ = x.strDesConcepto.substr(0, 30) + "\n" + x.strDesConcepto.substr(31, 61) + "\n(" + x.intTotalDias + ")\n";
                    }
                    //var Ley_ = x.strDesConcepto + "\n  (" + x.intTotalDias + ")";
                    leyend.push(Ley_);
                    data.push({ "value": x.intTotalDias, "name": Ley_ })

                    //leyend.push(x.strDesConcepto)
                    //data.push({ "value": x.intTotalDias, "name": x.strDesConcepto })

                    //Añadido Hebert 19.07.2021
                    arrayEncabezadoCrystal.push({ "strTitulo": x.strDesConcepto, "strValor": x.intTotalDias, "strCalculadoFecha": "", "strTipoBienesX": "Tipos de Servicio", "strNumeroBienesY": "D" });
                })

                var echartPieCollapse = echarts.init(document.getElementById('echart_pie2'), theme);

                echartPieCollapse.setOption({
                    tooltip: {
                        trigger: 'item',
                        //formatter: "{a} <br/>{b} : {c} ({d}%)"
                        formatter: function (params) {
                            //return `${params.seriesName}<br />
                            //  ${params.name}: ${params.data.value2} [${params.percent}%]<br />`;
                            return `[ ${params.percent}% ]<br />
                                    ${ params.name} <br />
                                    ${params.data.value}  <br />`;
                        }
                    },
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: leyend,
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            restore: {
                                show: true,
                                title: "Restore"
                            },
                            saveAsImage: {
                                show: true,
                                title: "Save Image"
                            }
                        }
                    },
                    calculable: true,
                    series: [{
                        name: 'Detalle',
                        type: 'pie',
                        radius: ['0%', '30%'],
                        avoidLabelOverlap: true,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: data
                    }]
                });
            } else {
                $("#echart_pie2").html("NO EXISTEN DATOS PARA MOSTRAR")
            }
            //-------------------------------------------------------------------------
            getHorasDescontadas(fechaInicio, fechaFin)
            //-------------------------------------------------------------------------
        },
        complete: function () {
        }
    });
}

function getHorasDescontadas(fechaInicio, fechaFin) {

    $.ajax({
        url: '/Inicio/ListarHorasDescontadas',
        type: 'POST',
        data:
            { fechaInicio, fechaFin, intIdPersonal: intIdPersonal_ },
        async: true,
        beforeSend: function () {
            $("#echart_pie3").html("Cargando...")
        },
        success: function (response) {
            var leyend = []
            var data = []
            $("#echart_pie3").empty()
            if (response.length > 0) {
                console.log(response)
                response.forEach(x => {
                    var longitud = x.strDesConcepto.length;
                    var Ley_ = "";
                    if (longitud <= 31) {
                        Ley_ = x.strDesConcepto + "\n(" + x.strTotalHrs + ")\n";
                    } else { //recorta a 62 caracteres
                        Ley_ = x.strDesConcepto.substr(0, 30) + "\n" + x.strDesConcepto.substr(31, 61) + "\n(" + x.strTotalHrs + ")\n";
                    }

                    //var Ley_ = x.strDesConcepto + "\n(" + x.strTotalHrs + ")\n";
                    leyend.push(Ley_);
                    data.push({ "value": x.intTotalHrs, "name": Ley_, 'value2': x.strTotalHrs })

                    //leyend.push(x.strDesConcepto)
                    //data.push({ "value": x.intTotalHrs, "name": x.strDesConcepto, 'value2': x.strTotalHrs })

                    //Añadido Hebert 19.07.2021
                    arrayEncabezadoCrystal.push({ "strTitulo": x.strDesConcepto, "strValor": x.strTotalHrs, "strCalculadoFecha": "", "strTipoBienesX": "Tipos de Menú", "strNumeroBienesY": "E" });
                })

                var echartPieCollapse = echarts.init(document.getElementById('echart_pie3'), theme);

                echartPieCollapse.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            //return `${params.seriesName}<br />
                            //  ${params.name}: ${params.data.value2} [${params.percent}%]<br />`;
                            return `[ ${params.percent}% ]<br />
                                    ${ params.name} <br />
                                    ${params.data.value2}  <br />`;
                        }
                    },
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: leyend,
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            restore: {
                                show: true,
                                title: "Restore"
                            },
                            saveAsImage: {
                                show: true,
                                title: "Save Image"
                            }
                        }
                    },
                    calculable: true,
                    series: [{
                        name: 'Detalle',
                        type: 'pie',
                        radius: ['0%', '30%'],
                        avoidLabelOverlap: true,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: data
                    }]
                });
            } else {
                $("#echart_pie3").html("NO EXISTEN DATOS PARA MOSTRAR")
            }
            //-------------------------------------------------------------------------
            getHorasExtras(fechaInicio, fechaFin)
            //-------------------------------------------------------------------------
        },
        complete: function () {
        }
    });
}

function getHorasExtras(fechaInicio, fechaFin) {

    $.ajax({
        url: '/Inicio/ListarHorasExtras',
        type: 'POST',
        data:
            { fechaInicio, fechaFin, intIdPersonal: intIdPersonal_ },
        async: true,
        beforeSend: function () {
            $("#echart_pie4").html("Cargando...")
        },
        success: function (response) {
            var leyend = []
            var data = []
            $("#echart_pie4").empty()
            if (response.length > 0) {
                console.log(response)
                response.forEach(x => {
                    var longitud = x.strDesConcepto.length;
                    var Ley_ = "";
                    if (longitud <= 31) {
                        Ley_ = x.strDesConcepto + "\n(" + x.strTotalHrs + ")\n";
                    } else { //recorta a 62 caracteres
                        Ley_ = x.strDesConcepto.substr(0, 30) + "\n" + x.strDesConcepto.substr(31, 61) + "\n(" + x.strTotalHrs + ")\n";
                    }
                    //var Ley_ = x.strDesConcepto + "\n(" + x.strTotalHrs + ")\n";
                    leyend.push(Ley_);
                    data.push({ "value": x.intTotalHrs, "name": Ley_, 'value2': x.strTotalHrs })
                    //leyend.push(x.strDesConcepto);
                    //data.push({ "value": x.intTotalHrs, "name": x.strDesConcepto , 'value2': x.strTotalHrs })

                    //Añadido Hebert 19.07.2021
                    arrayEncabezadoCrystal.push({ "strTitulo": x.strDesConcepto, "strValor": x.strTotalHrs, "strCalculadoFecha": "", "strTipoBienesX": "Servicios", "strNumeroBienesY": "F" });
                })

                var echartPieCollapse = echarts.init(document.getElementById('echart_pie4'), theme);

                echartPieCollapse.setOption({
                    tooltip: {
                            trigger: 'item',
                            //formatter: "{a} <br/>{b} : {c} ({d}%)"
                            formatter: function (params) {
                                //return `${params.seriesName}<br />
                                //  ${params.name}: ${params.data.value2} [${params.percent}%]<br />`;
                                return `[ ${params.percent}% ]<br />
                                    ${ params.name} <br />
                                    ${params.data.value2}  <br />`;
                            }
                    },
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: leyend,
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            restore: {
                                show: true,
                                title: "Restore"
                            },
                            saveAsImage: {
                                show: true,
                                title: "Save Image"
                            }
                        }
                    },
                    calculable: true,
                    series: [{
                        name: 'Detalle',
                        type: 'pie',
                        radius: ['0%', '30%'],
                        avoidLabelOverlap: true,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: data
                    }]
                });
            } else {
                $("#echart_pie4").html("NO EXISTEN DATOS PARA MOSTRAR")
            }
            btn_(1); //mostrar botones
        },
        complete: function () {
        }
    });
}

//Añadido Hebert 19.07.2021
//---------------------------------------------------------------------------------------------------------------
//REPORTE RESUMEN DE DASHBOARD CRYSTAL
$('#btn-generar-report-resumen-dashboard-crystal').on('click', function () {

    //////https://stackoverflow.com/questions/31722687/pass-the-argument-from-ajax-function-to-aspx-cs-filelist
    $.ajax({
        type: "POST",
        url: "/Rep/Vista/RepVentanaPrincipal.aspx/DeleteRecord",
        data: JSON.stringify({ 'listadoVentanaPricipal': arrayEncabezadoCrystal }), // '{"id":"' + 123 + '"}',//change your code here
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {

            filtroDeReporte = "ReporteResumenDeDashboard"
            window.open('/Rep/Vista/RepVentanaPrincipal.aspx?filtroDeReporte=' + filtroDeReporte + '&zoomLevel=' + '80' + '');
        },
        failure: function () {
        }
    });

});

//REPORTE RESUMEN DE DASHBOARD PDF
$('#btn-generar-report-resumen-dashboard-pdf').on('click', function () {

    //////https://stackoverflow.com/questions/31722687/pass-the-argument-from-ajax-function-to-aspx-cs-filelist
    $.ajax({
        type: "POST",
        url: "/Rep/Vista/RepVentanaPrincipal.aspx/DeleteRecord",
        data: JSON.stringify({ 'listadoVentanaPricipal': arrayEncabezadoCrystal }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {

            filtroDeReporte = "ReporteResumenDeDashboard"
            window.open('/Rep/Vista/RepVentanaPrincipal.aspx?filtroDeReporte=' + filtroDeReporte + '&zoomLevel=' + '80' + adicional, '');
        },
        failure: function () {
            //alert("Failure!");
        }
    });

});

//REPORTE GRAFICO DE DASHBOARD CRYSTAL
$('#btn-generar-report-grafico-dashboard-crystal').on('click', function () {
    var ratio = (screen.availWidth / document.documentElement.clientWidth);
    var zoomLevelPantalla = Number(ratio.toFixed(1).replace(".", "") + "0");
    //Enviar Dimensión de captura igual siempre para todos los zoom
    if (zoomLevelPantalla > 100) {
        $('.right_col').addClass("right_colclass90");
        $('body').addClass("bodyClass90");
    } else {
        $('.right_col').addClass("right_colclass100");
        $('body').addClass("bodyClass100");
    }
    //-------------------------------------------

    jQuery('.esconder-botones').hide();

    var nombreImgDashboardHead_ = Sesion + "Screen" + ".png"
    //let region = document.querySelector("body"); // whole screen
    let region = $(".right_col")//Capturamos el div deseado, al gusto del cliente

    html2canvas(region, {
        onrendered: function (canvas) {
            let pngUrl = canvas.toDataURL(); // png in dataURL format
            let img = document.querySelector(".screen");
            img.src = pngUrl;

            // here you can allow user to set bug-region
            // and send it with 'pngUrl' to server
            var photoBase64Captured = document.getElementById("base64image").src;

            $.post(
                '/Reportes/SaveImage',
                {
                    base64image: photoBase64Captured,
                    imagenDashboardHead: nombreImgDashboardHead_,
                    zoom: zoomLevelPantalla
                },
                response => {

                    jQuery('.esconder-botones').show();
                    //Eliminar imagen de la division
                    img.src = "";

                    /*RECIEN SE ENVIA AL CRYSTAL*/
                    listGraficoDashboard.push({
                        "strIdImagen": "zoomLevelPantalla"
                        , "strDescripcion": "strDescripcion_nada"
                        , "byteImagenData": "byteImagenData_nada"
                        , "strPathImagen": response
                    });

                    $.ajax({
                        type: "POST",
                        url: "/Rep/Vista/RepVentanaPrincipal.aspx/ReportDashboardPrincipal",
                        data: JSON.stringify({ 'listGraficoDashboard': listGraficoDashboard }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            listGraficoDashboard.length = 0;
                            window.open('/Rep/Vista/RepVentanaPrincipal.aspx?filtroDeReporte=' + "ReporteGraficoDeDashboard" + '&zoomLevel=' + zoomLevelPantalla + '');
                            //$('.right_col').removeClass("right_colclass");
                            //$('body').removeClass("bodyClass");
                            $('.right_col').removeClass("right_colclass100");
                            $('body').removeClass("bodyClass100");
                            //$('.right_col').removeClass("right_colclass90");
                            //$('body').removeClass("bodyClass90");
                        },
                        failure: function () {
                            alert("Failure!");
                        }
                    });
                    //////////////////////////////////////////////////////////////////////
                });
        },
    });
});

//REPORTE GRAFICO DE DASHBOARD PDF
$('#btn-generar-report-grafico-dashboard-pdf').on('click', function () {
    var ratio = (screen.availWidth / document.documentElement.clientWidth);
    var zoomLevelPantalla = Number(ratio.toFixed(1).replace(".", "") + "0");

    //Enviar Dimensión de captura igual siempre para todos los zoom
    $('.right_col').addClass("right_colclass100");
    $('body').addClass("bodyClass100");
    //-------------------------------------------

    jQuery('.esconder-botones').hide();
    var nombreImgDashboardHead_ = Sesion + "Screen" + ".png"
    let region = $(".right_col")//Capturamos el div deseado, al gusto del cliente

    html2canvas(region, {
        onrendered: function (canvas) {
            let pngUrl = canvas.toDataURL(); // png in dataURL format
            let img = document.querySelector(".screen");
            img.src = pngUrl;
            // here you can allow user to set bug-region
            // and send it with 'pngUrl' to server
            var photoBase64Captured = document.getElementById("base64image").src;

            $.post(
                '/Reportes/SaveImage',
                {
                    base64image: photoBase64Captured,
                    imagenDashboardHead: nombreImgDashboardHead_,
                    zoom: zoomLevelPantalla
                },
                response => {
                    jQuery('.esconder-botones').show();
                    img.src = "";

                    /*RECIEN SE ENVIA AL CRYSTAL*/
                    listGraficoDashboard.push({
                        "strIdImagen": "strIdImage_nada"
                        , "strDescripcion": "strDescripcion_nada"
                        , "byteImagenData": "byteImagenData_nada"
                        , "strPathImagen": response
                    });

                    $.ajax({
                        type: "POST",
                        url: "/Rep/Vista/RepVentanaPrincipal.aspx/ReportDashboardPrincipal",
                        data: JSON.stringify({ 'listGraficoDashboard': listGraficoDashboard }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            listGraficoDashboard.length = 0;
                            window.open('/Rep/Vista/RepVentanaPrincipal.aspx?filtroDeReporte=' + "ReporteGraficoDeDashboard" + '&zoomLevel=' + zoomLevelPantalla + adicional, '');
                            //$('.right_col').removeClass("right_colclass");
                            //$('body').removeClass("bodyClass");
                            $('.right_col').removeClass("right_colclass100");
                            $('body').removeClass("bodyClass100");
                            //$('.right_col').removeClass("right_colclass90");
                            //$('body').removeClass("bodyClass90");
                        },
                        failure: function () {
                            alert("Failure!");
                        }
                    });
                    //////////////////////////////////////////////////////////////// FIN AJAX
                });
        },
    });
});

