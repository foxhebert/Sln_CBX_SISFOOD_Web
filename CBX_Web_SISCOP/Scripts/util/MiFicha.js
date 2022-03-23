const formatoFecha = 'DD/MM/YYYY'
let filtrojer_ini = "";
let filtrojer_fin = "";
var ActualizaMiFicha;
var mailformatEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ //añadido 18.11.2021

function getAsistenciaDiariaAsync(dataGrafico, fechaInicio, fechaFin) {

    var echartBar = echarts.init(document.getElementById('mainb'), theme);
    echartGlobalInstance = echartBar

    var meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];

    const anioMenor = fechaInicio.substr(6, 4) //modificado decia 0,4
    const anioMayor = fechaFin.substr(6, 4) //modificado decia 0,4
    const mesNumberMenor = parseInt(fechaInicio.substr(3, 2)) //modificado decia 5,2
    const mesNumberMayor = parseInt(fechaFin.substr(3, 2))
    //----------------------------
    if (anioMenor != anioMayor && mesNumberMenor == mesNumberMayor) {
        messageResponseMix({ type: 'info', message: 'Debe seleccionar 12 meses' }, 'Mi Ficha')
        return false;
    }
    //----------------------------

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

        dataGrafico.data.forEach(element => {
            if (element.anio == anioMenor) {
                listaMenorAsis[parseInt(element.mes)] = element.asistencia
                listaMenorInasis[parseInt(element.mes)] = element.faltas
            } else if (element.anio == anioMayor) {
                listaMayorAsis[parseInt(element.mes)] = element.asistencia
                listaMayorInasis[parseInt(element.mes)] = element.faltas
            }
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

        dataGrafico.data.forEach(element => {
            switch (element.mes) {
                case 1:
                    list_asistencia[0] = element.asistencia;
                    list_inasistencia[0] = element.faltas;
                    break
                case 2:
                    list_asistencia[1] = element.asistencia;
                    list_inasistencia[1] = element.faltas;
                    break
                case 3:
                    list_asistencia[2] = element.asistencia;
                    list_inasistencia[2] = element.faltas;
                    break;
                case 4:
                    list_asistencia[3] = element.asistencia;
                    list_inasistencia[3] = element.faltas;
                    break;
                case 5:
                    list_asistencia[4] = element.asistencia;
                    list_inasistencia[4] = element.faltas;
                    break;
                case 6:
                    list_asistencia[5] = element.asistencia;
                    list_inasistencia[5] = element.faltas;
                    break;
                case 7:
                    list_asistencia[6] = element.asistencia;
                    list_inasistencia[6] = element.faltas;
                    break;
                case 8:
                    list_asistencia[7] = element.asistencia;
                    list_inasistencia[7] = element.faltas;
                    break;
                case 9:
                    list_asistencia[8] = element.asistencia;
                    list_inasistencia[8] = element.faltas;
                    break;
                case 10:
                    list_asistencia[9] = element.asistencia;
                    list_inasistencia[9] = element.faltas;
                    break;
                case 11:
                    list_asistencia[10] = element.asistencia;
                    list_inasistencia[10] = element.faltas;
                    break;
                case 12:
                    list_asistencia[11] = element.asistencia;
                    list_inasistencia[11] = element.faltas;
                    break;
            }
        });
    }
    echartGlobalInstance.setOption({
        title: {
            text: 'Gráfico de Consumo Anual',
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
            name: '\n   Meses',
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
        }, {
            name: 'Consumos Inválidos',
            type: 'bar',
            data: list_inasistencia,
        }]
    });

}

async function getPersonalPerfil(intIdPersonalId, fechaInicio, fechaFin)  {
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
    const { intIdMenu, formatoFecha, rangeDateInicial } = configMiFichaInicial()
    const { loaderHtml } = APPCONFIG
    const intIdPersonal = intIdPersonalId
    $(".rangoFechaIni").html(fechaInicio.substr(0, 10))
    $(".rangoFechaFin").html(fechaFin.substr(0, 10))//.format('MMMM D, YYYY')
    //getAdicionalControlEditarPersonal()
    try {
        const dataUser = await axios.post('/Personal/GetPersonalData', { intIdMenu, intIdPersonal })
        const dataAusencia = await axios.post('/Personal/ListaAsusencias', { intIdPersonal, fechaInicio, fechaFin })
        const dataGrafico = await axios.post('/Personal/ObtenerAsistenciaXFecha', { intIdPersonal, fechaInicio, fechaFin })//prueba 21.07.2021
        getAsistenciaDiariaAsync(dataGrafico, fechaInicio, fechaFin);//añadido 21.07.2021}

        if (intIdPersonalId != 0) {
            const dataResponsabilidad = await axios.post('/Personal/ListaPersonalResponsabilidad', { intIdPersonal, fechaInicio, fechaFin })
            const dataAsistencia = await axios.post('/Personal/ListaPersonalAsistencia', { intIdPersonal, fechaInicio, fechaFin })
            const dataCorreos = await axios.post('/Personal/GetCorreosPersonal', { intIdMenu, intIdPersonal })
            const dataTelefonos = await axios.post('/Personal/GetTelefonosPersonal', { intIdMenu, intIdPersonal })

            if (dataResponsabilidad.data.length) {
                var listResponsabilidad = dataResponsabilidad.data
                var table = ''

                for (i = 0; i < listResponsabilidad.length; i++) {
                    table += '<tr>' +
                        '<th scope="row">' + listResponsabilidad[i].strCoPersonal + '</th>' +
                        '<td>' + listResponsabilidad[i].strNombresComp + '</td>' +
                        '<td>' + listResponsabilidad[i].strDesCargo + '</td>' +
                        '<td>' + listResponsabilidad[i].strDeTipo + '</td>' +
                        '</tr>'
                }

                if ($.fn.DataTable.isDataTable('#tableResponsabilidad')) {
                    _vartableResponsabilidad.destroy();
                }

                $("#tableResponsabilidad .data").html(table);

                _vartableResponsabilidad = $('#tableResponsabilidad').DataTable({
                    responsive: true,
                    language: {
                        lengthMenu: 'Mostrar _MENU_ Items',
                        info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                        infoEmpty: 'No hay Items para mostrar',
                        search: 'Buscar: ',
                        sSearchPlaceholder: 'Criterio de búsqueda',
                        zeroRecords: 'No se encontraron registros coincidentes',
                        infoFiltered: '(Filtrado de _MAX_ totales Items)',
                        paginate: {
                            previous: 'Anterior',
                            next: 'Siguiente'
                        }
                    }
                });
            } else {

                if ($.fn.DataTable.isDataTable('#tableResponsabilidad')) {
                    _vartableResponsabilidad.destroy();
                }
                $("#tableResponsabilidad .data").html("")
                _vartableResponsabilidad = $('#tableResponsabilidad').DataTable({
                    responsive: true,
                    language: {
                        lengthMenu: 'Mostrar _MENU_ Items',
                        info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                        infoEmpty: 'No hay Items para mostrar',
                        search: 'Buscar: ',
                        sSearchPlaceholder: 'Criterio de búsqueda',
                        zeroRecords: 'No se encontraron registros coincidentes',
                        infoFiltered: '(Filtrado de _MAX_ totales Items)',
                        paginate: {
                            previous: 'Anterior',
                            next: 'Siguiente'
                        }
                    }
                });
            }

            if (dataAsistencia.data.length) {

                var listaAsistencia = dataAsistencia.data
                var total = 0

                listaAsistencia.map((asistencia) => total += asistencia.intTotalDias)

                var table = ''

                for (i = 0; i < listaAsistencia.length; i++) {
                    var porcent = (listaAsistencia[i].intTotalDias * 100) / total

                    table += '<tr>' +
                        '<th scope="row">' + (i + 1) + '</th>' +
                        '<td>' + listaAsistencia[i].strDesConcepto + '</td>' +
                        '<td> Por ' + listaAsistencia[i].strDeTipo + '</td>' +
                        '<td>' + getHorasByMin(listaAsistencia[i].intTotalHoras) + '</td>' +
                        '<td>' + listaAsistencia[i].intTotalDias + '</td>' +
                        '<td>' +
                        '<div class="progress" >' +
                        //'<div class="progress-bar progress-bar-striped progress-bar-success" role = "progressbar" style = "width: ' + porcent + '%; background-color: ' + color+';" aria-valuenow="' + porcent + '" aria-valuemin="0" aria-valuemax="' + total + '" ></div>'
                        '<div class="progress-bar progress-bar-striped progress-bar-success" role = "progressbar" style = "width: ' + porcent + '%" aria-valuenow="' + porcent + '" aria-valuemin="0" aria-valuemax="' + total + '" ></div>'
                    '</div>' +
                        '</td> ' +
                        '</tr>'
                }

                if ($.fn.DataTable.isDataTable('#tablePapeleta')) {
                    _vartablePapeleta.destroy();
                }

                $("#tablePapeleta .data").html(table);

                _vartablePapeleta = $('#tablePapeleta').DataTable({
                    "footerCallback": function (row, data, start, end, display) {
                        var api = this.api(), data;

                        // Remove the formatting to get integer data for summation
                        var intVal = function (i) {
                            return typeof i === 'string' ?
                                i.replace(/[\$,]/g, '') * 1 :
                                typeof i === 'number' ?
                                    i : 0;
                        };

                        // Total over this page
                        pageTotal = api
                            .column(4, { page: 'current' })
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Update footer
                        $(api.column(4).footer()).html(
                            pageTotal
                        );
                    },
                    language: {
                        lengthMenu: 'Mostrar _MENU_ Items',
                        info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                        infoEmpty: 'No hay Items para mostrar',
                        search: 'Buscar: ',
                        sSearchPlaceholder: 'Criterio de búsqueda',
                        zeroRecords: 'No se encontraron registros coincidentes',
                        infoFiltered: '(Filtrado de _MAX_ totales Items)',
                        paginate: {
                            previous: 'Anterior',
                            next: 'Siguiente'
                        }
                    }
                });
            } else {

                if ($.fn.DataTable.isDataTable('#tablePapeleta')) {
                    _vartablePapeleta.destroy();
                }
                $("#tablePapeleta .data").html("")
                _vartablePapeleta = $('#tablePapeleta').DataTable({
                    "footerCallback": function (row, data, start, end, display) {
                        var api = this.api(), data;

                        // Remove the formatting to get integer data for summation
                        var intVal = function (i) {
                            return typeof i === 'string' ?
                                i.replace(/[\$,]/g, '') * 1 :
                                typeof i === 'number' ?
                                    i : 0;
                        };

                        // Total over this page
                        pageTotal = api
                            .column(4, { page: 'current' })
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Update footer
                        $(api.column(4).footer()).html(
                            pageTotal
                        );
                    },
                    language: {
                        lengthMenu: 'Mostrar _MENU_ Items',
                        info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                        infoEmpty: 'No hay Items para mostrar',
                        search: 'Buscar: ',
                        sSearchPlaceholder: 'Criterio de búsqueda',
                        zeroRecords: 'No se encontraron registros coincidentes',
                        infoFiltered: '(Filtrado de _MAX_ totales Items)',
                        paginate: {
                            previous: 'Anterior',
                            next: 'Siguiente'
                        }
                    }
                });

            }

            if (dataCorreos.data.length) {
                const dataCorreosArray = dataCorreos.data
                let dataCorreosInsert = ''
                $('#tituloCorreoPersonal').html(`<li><i class="glyphicon glyphicon-envelope"></i> Otros Emails:</li>`)
                $('#dataCorreoPersonal').empty()
                dataCorreosArray.forEach((item) => {
                    if (item.bitFlPrincipal) {
                        getDocumentElementById('correoPrincipalPersonal').innerHTML = `<i class="fa fa-envelope user-profile-icon"></i> ${item.strCorreo}`
                    } else {
                        $('#dataCorreoPersonal').append(`<li>${item.strCorreo}</li><br>`)
                    }
                })

                // editar
                dataCorreosArray.forEach((element) => {
                    if (element.bitFlPrincipal) {
                        $('#Email_Emple').val(element.strCorreo)
                    } else {
                        dataCorreosInsert += element.strCorreo + ','
                    }
                })
                if (dataCorreosInsert != '') {
                    let cadenaEmail = dataCorreosInsert.slice(0, -1)
                    $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="${cadenaEmail}" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
                } else {
                    $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
                }
            } else {
                $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
            }
            if (dataTelefonos.data.length) {
                const dataTelefonosArray = dataTelefonos.data
                let dataTelefonosInsert = ''
                $('#tituloTelefonoPersonal').html(`<li><i class="glyphicon glyphicon-phone-alt"></i> Otros Telefonos:</li>`)
                $('#dataTelefonoPersonal').empty()
                dataTelefonosArray.forEach((item) => {
                    if (item.bitFlPrincipal) {
                        getDocumentElementById('telefonoPrincipalPersonal').innerHTML = `<i class="glyphicon glyphicon-phone-alt"></i> ${item.strNumero}`
                    } else {
                        $('#dataTelefonoPersonal').append(`<li>${item.strNumero}</li><br>`)
                    }
                })
                // editar

                dataTelefonosArray.forEach((element) => {
                    if (element.bitFlPrincipal) {
                        $('#celularEmpleado').val(element.strNumero)
                    } else {
                        dataTelefonosInsert += element.strNumero + ','
                    }
                })
                if (dataTelefonosInsert != '') {
                    let cadenaTekl = dataTelefonosInsert.slice(0, -1)
                    $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value="${cadenaTekl}"  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
                } else {
                    $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value=""  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
                }
            } else {
                $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value=""  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
            }

            //var mailformatEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/

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
        }
        if (dataUser.data.length) {
            document.querySelectorAll('.loading-item-p').forEach((el) => {
                el.classList.remove('skeleton-loader', 'h23x100', 'h22x79', 'dplayinitial', 'bg-loader')
            })
        }

        if (dataUser.data.length) {
            const user = dataUser.data[0]
            const INTIDTPEVAL = user.intIdUbigeo
            const INTIDSUPUBI = user.intIdUbigSup
            const INTIDSUPUBIREGION = user.intIdUbiSupReg
            const intIdProvinciaMostrar = user.intIdUbiReg
            const intIdRegionMostrar = user.intIdUbiPais
            const intIdJerOrgLista = user.intIdJerOrg
            const intIdUniOrgLista = user.intIdUniOrg

            $('#showModalEditar').click(function () {
                $('#myModalEditar').modal('show')
            })

            var rutaFoto = `/DirEmpleadosRuta/${user.imgFoto}`;

            $.ajax({
                url: rutaFoto,
                type: 'HEAD',
                error: function () {
                    //Imagen por defecto
                    $("#imagePersonalPer").attr("src", '/DirEmpleadosRuta/descarga(1).jpg');
                },
                success: function () {
                    $("#imagePersonalPer").attr("src", rutaFoto);
                }
            });

            getDocumentElementById('imagePersonalPer').style.display = 'block'
            getDocumentElementById('loaderImagePersonal').style.display = 'none'
            getDocumentElementById('namePersonalPer').innerHTML = `${user.strApePaterno} ${user.strApeMaterno}, ${user.strNombres}`
            getDocumentElementById('codigoPersonalPer').innerHTML = `${user.strCoPersonal}-${user.strNumRegis}`
            getDocumentElementById('txtTipoDoc').innerHTML = `${user.strTipoDoc}`
            getDocumentElementById('documentoPersdonal').innerHTML = `${user.strNumDoc}`
            getDocumentElementById('admisionPersonalPer').innerHTML = `${user.dttFecAdmin}`
            getDocumentElementById('fotocheckPersonalPer').innerHTML = `${user.strFotocheck}`
            getDocumentElementById('empresaPersonalr').innerHTML = `${user.strDescripcion}`
            if (user.strDirUbi == null) {
                user.strDirUbi = ""
                user.strDireccion = "Sin Dirección"
            }
            getDocumentElementById('direccionPersonal').innerHTML = `<i class="fa fa-map-marker user-profile-icon"></i> ${user.strDir} <br> ${user.strDirUbi}`
            getDocumentElementById('cargoPersonalp').innerHTML = `<i class="fa fa-briefcase user-profile-icon"></i> ${user.strDesCargo}`

            getDocumentElementById('fechaNacimientoPersonal').innerHTML = `<strong>Fecha de Nacimiento:</strong> ${user.dttFecNacim}`
            getDocumentElementById('generoPersonalm').innerHTML = `<strong>Sexo:</strong> ${user.bitflSexo ? "Masculino" : "Femenino"}`
            getDocumentElementById('generoEstadolm').innerHTML = `<strong>Estado:</strong> ${user.bitFlActivo ? "Activo" : "Inactivo"}`

            const dataCabe = user.strCabe.split("|");
            const dataDeta = user.strDeta.split("|");

            var table = ''

            for (var i = 0; i < dataCabe.length; i++) {
                table += '<div class="col-md-4 col-sm-6 pb-2">' + `<span class="border"><b>${dataCabe[i]}: </b>` + dataDeta[i] + '</span></div>'
            }

            $('#planillaPersonal').html(table)


            $('#txtFechaNac').val(user.dttFecNacim)
            if (user.dttFecNacim != null) {
                var x = user.dttFecNacim.substr(6, 4) + '-' + user.dttFecNacim.substr(3, 2) + '-' + user.dttFecNacim.substr(0, 2);
                $('#inputSuccess3').val(x);
            } else {
                $('#inputSuccess3').val("");
            }

            $('#CboPais').val(user.intIdUbiSupPais)
            $('#TipVia').val(user.intIdTipoVia)
            $('#TXTTIPVIA').val(user.strDireccion)

        }
        //AQUI
        if (dataAusencia.data.length) {
            var listaAusencia = dataAusencia.data
            var table = ''
            var table2 = ''
            var table3 = ''
            var tt = 'Servicios Regulares'
            var CantidadSR = 0;
            var CantidadSc = 0;
            var ttc = 'Servicios Complementarios'
            for (i = 0; i < listaAusencia.length; i++) {
                if (listaAusencia[i].strCoConcepto == 'SR_') {
                    if (listaAusencia[i].intTotalDias > 0) {
                        tt = listaAusencia[i].strDesConcepto;
                        CantidadSR = listaAusencia[i].intTotalDias;
                    }
                    break;
                }

            }
            for (i = 0; i < listaAusencia.length; i++) {
                if (listaAusencia[i].strCoConcepto == 'SC_') {
                    if (listaAusencia[i].intTotalDias>0) {
                        ttc = listaAusencia[i].strDesConcepto;
                        CantidadSc = listaAusencia[i].intTotalDias;
                    }
                   break;
                }

            }
            if (CantidadSR > 0) {
                table += '<li>' +
                    '<h2 class="loading-item-p  dplayinitial mt-2">' + tt + '<br /></h2>' + '</li>'
            }
            if (CantidadSc > 0) {
                table3 += '<li>' +
                    '<h2 class="loading-item-p  dplayinitial mt-2">' + ttc + '<br /></h2>' + '</li>'
            }


            for (i = 0; i < listaAusencia.length; i++) {
                var color = "#34495E"; //General - Complementos

                if (listaAusencia[i].strCoConcepto != '0') {
                    color = "#26B99A"; //Almuerzo
                }
                if (listaAusencia[i].strCoConcepto == '0') {
                    color = "#DAA520"; //Desayuno
                }

                //Tabla de Complementos:  table3
                if (listaAusencia[i].strCoConcepto == '0') {
                    table3 += '<li>' +
                        '<h5 class="loading-item-p h23x200">' + listaAusencia[i].strDesConcepto + '</h5>' +
                        '<div class="progress" style="height:20px">'
                    if (listaAusencia[i].strDeTipo == "Ocurrencia") {
                        var porcent = (listaAusencia[i].intTotalDias * 100) / listaAusencia[i].intTope
                        table3 += '<div class="progress-bar progress-bar-success" role = "progressbar" style = "width: ' + porcent + '%; background-color: ' + color + ';" aria-valuenow="' + listaAusencia[i].intTotalDias + '" aria-valuemin="0" aria-valuemax="' + listaAusencia[i].intTope + '" >' + listaAusencia[i].intTotalDias + '</div>'
                    } else {
                        var porcent = (listaAusencia[i].intTotalHoras * 100) / listaAusencia[i].intTope
                        table3 += '<div class="progress-bar progress-bar-success" role = "progressbar" style = "width: ' + porcent + '%; background-color: ' + color + ';" aria-valuenow="' + listaAusencia[i].intTotalHoras + '" aria-valuemin="0" aria-valuemax="' + listaAusencia[i].intTope + '" >' + getTimeConceptoHoras(listaAusencia[i].strDesConcepto) + '</div>'
                    }

                    table3 += '</div>' +
                        '</li>'
                }//Tabla de Servicios:  table
                else if (listaAusencia[i].strCoConcepto != '0' && listaAusencia[i].strCoConcepto != 'SR_' && listaAusencia[i].strCoConcepto != 'SC_') { 

                    table += '<li>' +
                        '<h5 class="loading-item-p h23x200">' + listaAusencia[i].strDesConcepto + '</h5>' +
                        '<div class="progress" style="height:17px">'
                    if (listaAusencia[i].strDeTipo == "Ocurrencia") {
                        var porcent = (listaAusencia[i].intTotalDias * 100) / listaAusencia[i].intTope
                        table += '<div class="progress-bar progress-bar-success" role = "progressbar" style = "width: ' + porcent + '%; background-color: ' + color + ';" aria-valuenow="' + listaAusencia[i].intTotalDias + '" aria-valuemin="0" aria-valuemax="' + listaAusencia[i].intTope + '" >' + listaAusencia[i].intTotalDias + '</div>'
                    } else {
                        var porcent = (listaAusencia[i].intTotalHoras * 100) / listaAusencia[i].intTope
                        table += '<div class="progress-bar progress-bar-success" role = "progressbar" style = "width: ' + porcent + '%; background-color: ' + color + ';" aria-valuenow="' + listaAusencia[i].intTotalHoras + '" aria-valuemin="0" aria-valuemax="' + listaAusencia[i].intTope + '" >' + getTimeConceptoHoras(listaAusencia[i].strDesConcepto) + '</div>'
                    }
                    table += '</div>' +
                        '</li>'
                }
            }
            $("#List").html(table)
            //$("#AsisList").html(table2)
            $("#ausenciaList").html(table3)
        }

        $.unblockUI();
    } catch (error) {
        console.log(error);

        $.unblockUI();
    } 
}

$(document).ready(function () {
    filtrojer_ini = moment().startOf('year').format('DD/MM/YYYY') + ' 00:00:00';
    filtrojer_fin = moment().endOf("year").format('DD/MM/YYYY') + ' 23:59:59';

    $('.range-datepicker').startDate = filtrojer_ini;
    $('.range-datepicker').endDate = filtrojer_fin;

    const intIdPersonal = window.SISCOP.intIdPersonal;
    getPersonalPerfil(intIdPersonal, filtrojer_ini, filtrojer_fin)

    if (window.SISCOP.intIdPersonal == "0") {
        $("#divCboEmpleado").show()
        $(".adminClass").hide()
    }

    if (intIdPersonal == "0") {
        $.post(
            '/Personal/ListarCombosPersonal',
            { intIdMenu: 0, strEntidad: 'TGPERSONAL', intIdFiltroGrupo: 0, strGrupo: 'MIPERFIL', strSubGrupo: '' },
            (response) => {
                $('#cboEmpleados').empty();
                $('#cboEmpleados').append('<option value="0" selected>Seleccione</option>');

                response.forEach(element => {
                    $('#cboEmpleados').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                });
            });

        $('#cboEmpleados').select2({
            placeholder: 'Seleccione',
            allowClear: true
        });

    }

    var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    $('#FechaNac').datetimepicker({
        maxDate: today,
        viewMode: 'days',
        format: formatoFecha,
    })


    $('#guardarPerfilUsuario').click(function () {
        validarSession()
        var intIdPersonalTmp = 0;
        if (window.SISCOP.intIdPersonal == "0") {
            intIdPersonalTmp = intIdPersonal
        } else {
            intIdPersonalTmp = window.SISCOP.intIdPersonal
        }
        var x_ = $('#inputSuccess3').val();
        var x = x_.substr(8, 2) + '/' + x_.substr(5, 2) + '/' + x_.substr(0, 4);
        $('#txtFechaNac').val(x);
        ActualizaMiFicha = true;
        updatePersonalPerfil(intIdPersonalTmp)
        if (ActualizaMiFicha == true) {
            //añadido para refrescar los cambios que se hayan guardado
            getPersonalPerfil(intIdPersonalTmp, filtrojer_ini, filtrojer_fin)
            if (intIdPersonalTmp == 0) {
                $(".adminClass").hide()
            } else {
                $(".adminClass").show()
            }
        } else {
            console.log("Aqui..");
        }

    })

})

async function updatePersonalPerfil(intIdPersonal) {
    const titleToast = 'Actualizar Mi Ficha'
    ActualizarPerfilEmpleado(titleToast, intIdPersonal);
}

function ActualizarPerfilEmpleado(titleToast, intIdPersonal) {
    var FNac = $('#txtFechaNac').val();
    var SplitFNac = FNac.split("/");
    //añadido 10.09.2021 Calcular Si es o no Mayor de Edad)
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
    //añadido 10.09.2021 Calcular Si es o no Mayor de Edad)

    const { intIdMenu, formatoFecha } = configEmpleadoInicial()
    ActualizaMiFicha = false;
    if (getValueControl('#TipVia').length == '') {
        messageResponseMix({ type: 'info', message: 'El tipo de Vía es Obligatorio' }, titleToast)
        focusControl('#TipVia')
        return false
    }
    if (getValueControl('#TXTTIPVIA').length < 1) {
        messageResponseMix({ type: 'info', message: 'Debe ingresar una dirección' }, titleToast)
        focusControl('#TXTTIPVIA')
        return false
    }
    if (getValueControl('#txtFechaNac').length < 1) {
        messageResponseMix({ type: 'info', message: 'La Fecha de Nacimiento es obligatoria' }, titleToast)
        focusControl('#txtFechaNac')
        return false
    }
    if (ValidaMayorEdad == false) {//añadido 10.09.2021
        messageResponseMix({ type: 'info', message: 'El Empleado no puede ser Menor de Edad' }, titleToast)
        focusControl('#txtFechaNac')
        return false
    }
    if (!validarFecha(getValueControl('#txtFechaNac'))) {
        messageResponseMix({ type: 'info', message: 'Fecha incorrecta' }, titleToast)
        focusControl('#txtFechaNac')
        return false
    }
    else if (getValueControl('#CboPais') == '') {
        messageResponseMix({ type: 'info', message: 'El Pais del Ubigeo es obligatorio' }, titleToast)
        $('#CboPais').focus()
        return false
    }
    else if (getValueControl('#CboRegion') == '') {
        messageResponseMix({ type: 'info', message: 'El Departamento del Ubigeo es obligatorio' }, titleToast)
        $('#CboRegion').focus()
        return false
    }
    else if (getValueControl('#CboProvincia') == '') {
        messageResponseMix({ type: 'info', message: 'La Provincia del Ubigeo es obligatorio' }, titleToast)
        $('#CboProvincia').focus()
        return false
    }
    else if (getValueControl('#CboDistrito') == '') {
        messageResponseMix({ type: 'info', message: 'El Distrito del Ubigeo es obligatorio' }, titleToast)
        $('#CboDistrito').focus()
        return false
    }
    else if (getValueControl('#Email_Emple').length == '') {
        messageResponseMix({ type: 'info', message: 'Correo Principal es obligatorio' }, titleToast)
        focusControl('#Email_Emple')
        return false
    }
    else if (getValueControl('#Email_Emple').length < 1 || !ValidateEmail(getValueControl('#Email_Emple'))) {
        messageResponseMix({ type: 'info', message: 'Correo no tiene el formato correcto' }, titleToast)
        focusControl('#Email_Emple')
        return false
    } else if (getValueControl('#celularEmpleado').length > 0 || getValueControl('#celularEmpleado') != '') {//modificado 19.08.2021
        if (getValueControl('#celularEmpleado').length < 9) {
            messageResponseMix({ type: 'info', message: 'El Celular Principal debe tener 9 dígitos' }, titleToast)
            focusControl('#celularEmpleado')
            return false
        }
    }
    //else if (getValueControl('#celularEmpleado').length < 1) {
    //    messageResponseMix({ type: 'info', message: 'El Celular Principal es obligatorio' }, titleToast)
    //    focusControl('#celularEmpleado')
    //    return false
    //} else if (getValueControl('#celularEmpleado').length < 9) {
    //    messageResponseMix({ type: 'info', message: 'El Celular Principal debe tener 9 dígitos' }, titleToast)
    //    focusControl('#celularEmpleado')
    //    return false
    //}

    const otrosCorreosData = $.map($('#TagEmailContainer .tagsinput span span'), function (e, i) {
        return $(e)
            .text()
            .trim()
    })

    const otrosTelefonosData = $.map($('#tagTelefonosContainer .tagsinput span span'), function (e, i) {
        return $(e)
            .text()
            .trim()
    })

    const otrosCorreos = otrosCorreosData.filter(item => {
        return ValidateEmail(item) === true
    })


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
    if (getValueControl('#celularEmpleado').length > 0) {//modificado 19.08.2021
        otrosTelefonosInsert.push({
            intIdPerTele: 0,
            intIdPersonal: 0,
            strNumero: getValueControl('#celularEmpleado'),
            bitFlPrincipal: true,
            strAnexo: ' ',
            bitFlEliminado: false,
        })
    }

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
    //AÑADIDO 23.07.2021
    var x_ = $('#inputSuccess3').val();
    var x = x_.substr(8, 2) + '/' + x_.substr(5, 2) + '/' + x_.substr(0, 4);
    $('#txtFechaNac').val(x);
    //----------------------------------------------------------------------
    const params = {
        intIdMenu: intIdMenu,
        ObjPersonal: {
            intIdPersonal: intIdPersonal,
            dttFecNacim: $('#txtFechaNac').val(),
            intIdTipoVia: $('#TipVia').val() != '0' ? $('#TipVia').val() : null,
            strDireccion: $('#TXTTIPVIA').val().length ? $('#TXTTIPVIA').val() : null,
            intIdUbigeo: $('#txtIntidUbigeo').val() != '0' ? $('#txtIntidUbigeo').val() : null,
        },
        listaDetallesPersonalCorreos: otrosCorreosInsert,
        listaDetallesPersonalTelefonos: otrosTelefonosInsert
    }

    console.log(params)


    $.post('/Personal/ActualizarPerfilEmpleado', params, respo => {
        if (respo.type === 'success') {
            messageResponseMix({ type: respo.type, message: respo.message }, titleToast)
            $('#myModalEditar').modal('hide')
            ActualizaMiFicha = true;
            getPersonalPerfil2(intIdPersonal)
        } else {
            messageResponseMix({ type: respo.type, message: respo.message }, titleToast)
        }
    })

}

$("#exportPDF").click(function () {
    validarSession()
    window.open('/Personal/exportPDF');
})
function getDatos(intIdPersonal, filtrojer_ini, filtrojer_fin) {

    $.post(
        '/Personal/ListaPersonalAsistencia',
        { intIdPersonal: intIdPersonal, fechaInicio: filtrojer_ini, fechaFin: filtrojer_fin },//fechaInicio: fechaInicio, fechaFin: fechaFin 
        (response) => {
            if (response.length) {

                var listaAsistencia = response
                var total = 0

                listaAsistencia.map((asistencia) => total += asistencia.intTotalDias)

                var table = ''

                for (i = 0; i < listaAsistencia.length; i++) {
                    var porcent = (listaAsistencia[i].intTotalDias * 100) / total

                    table += '<tr>' +
                        '<th scope="row">' + (i + 1) + '</th>' +
                        '<td>' + listaAsistencia[i].strDesConcepto + '</td>' +
                        '<td> Por ' + listaAsistencia[i].strDeTipo + '</td>' +
                        '<td>' + getHorasByMin(listaAsistencia[i].intTotalHoras) + '</td>' +
                        '<td>' + listaAsistencia[i].intTotalDias + '</td>' +
                        '<td>' +
                        '<div class="progress" >' +
                        '<div class="progress-bar progress-bar-striped progress-bar-success" role = "progressbar" style = "width: ' + porcent + '%" aria-valuenow="' + porcent + '" aria-valuemin="0" aria-valuemax="' + total + '" ></div>'
                    '</div>' +
                        '</td> ' +
                        '</tr>'
                }
                if (_vartablePapeleta != null) {
                    _vartablePapeleta.destroy();
                }

                $("#tablePapeleta .data").html(table);
                _vartablePapeleta = $('#tablePapeleta').DataTable({
                    "footerCallback": function (row, data, start, end, display) {
                        var api = this.api(), data;

                        // Remove the formatting to get integer data for summation
                        var intVal = function (i) {
                            return typeof i === 'string' ?
                                i.replace(/[\$,]/g, '') * 1 :
                                typeof i === 'number' ?
                                    i : 0;
                        };

                        // Total over this page
                        pageTotal = api
                            .column(4, { page: 'current' })
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Update footer
                        $(api.column(4).footer()).html(
                            pageTotal
                        );
                    },
                    language: {
                        lengthMenu: 'Mostrar _MENU_ Items',
                        info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                        infoEmpty: 'No hay Items para mostrar',
                        search: 'Buscar: ',
                        sSearchPlaceholder: 'Criterio de búsqueda',
                        zeroRecords: 'No se encontraron registros coincidentes',
                        infoFiltered: '(Filtrado de _MAX_ totales Items)',
                        paginate: {
                            previous: 'Anterior',
                            next: 'Siguiente'
                        }
                    }
                });
            } else {
                if (_vartablePapeleta != null) {
                    _vartablePapeleta.destroy();
                }
                //_vartablePapeleta.destroy();
                $("#tablePapeleta .data").html('');
                _vartablePapeleta = $('#tablePapeleta').DataTable({
                    "footerCallback": function (row, data, start, end, display) {
                        var api = this.api(), data;

                        // Remove the formatting to get integer data for summation
                        var intVal = function (i) {
                            return typeof i === 'string' ?
                                i.replace(/[\$,]/g, '') * 1 :
                                typeof i === 'number' ?
                                    i : 0;
                        };

                        // Total over this page
                        pageTotal = api
                            .column(4, { page: 'current' })
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Update footer
                        $(api.column(4).footer()).html(
                            pageTotal
                        );
                    },
                    language: {
                        lengthMenu: 'Mostrar _MENU_ Items',
                        info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                        infoEmpty: 'No hay Items para mostrar',
                        search: 'Buscar: ',
                        sSearchPlaceholder: 'Criterio de búsqueda',
                        zeroRecords: 'No se encontraron registros coincidentes',
                        infoFiltered: '(Filtrado de _MAX_ totales Items)',
                        paginate: {
                            previous: 'Anterior',
                            next: 'Siguiente'
                        }
                    }
                });
            }
        }
    )

}

$('.range-datepicker').on('apply.daterangepicker', function (ev, picker) {
    validarSession()
    filtrojer_ini = picker.startDate.format('DD/MM/YYYY');
    filtrojer_fin = picker.endDate.format('DD/MM/YYYY');
    const anioMenor = filtrojer_ini.substr(0, 4)
    const anioMayor = filtrojer_fin.substr(0, 4)

    const mesNumberMenor = parseInt(filtrojer_ini.substr(5, 2))
    const mesNumberMayor = parseInt(filtrojer_fin.substr(5, 2))

    var intIdPersonalTmp = 0;
    if (window.SISCOP.intIdPersonal == "0") {
        intIdPersonalTmp = 0;//intIdPersonal //modificado 21.07
    } else {
        intIdPersonalTmp = window.SISCOP.intIdPersonal
    }
    if (anioMenor != anioMayor && mesNumberMenor == mesNumberMayor) {
        messageResponseMix({ type: 'info', message: 'Debe seleccionar 12 meses' }, 'Perfil')
        return false;
    } else {
        getPersonalPerfil(intIdPersonalTmp, filtrojer_ini, filtrojer_fin)//añadido 21.07.2021
        getDatos(intIdPersonalTmp, filtrojer_ini, filtrojer_fin)
    }
});

$("#cboEmpleados").change(function () {
    validarSession()
    var intIdPersonal = $(this).val();
    if (intIdPersonal == null) {
        intIdPersonal = 0;
    }
    window.SISCOP.intIdPersonal = intIdPersonal;
    getPersonalPerfil(intIdPersonal, filtrojer_ini, filtrojer_fin)
    if (intIdPersonal == 0) {
        $(".adminClass").hide()
    } else {
        $(".adminClass").show()
    }
})

$('#showModalEditar').click(async function () {
    validarSession()
    var intIdPersonalTmp = 0;
    if (window.SISCOP.intIdPersonal == "0") {
        intIdPersonalTmp = 0;// intIdPersonal //modificado 21.07
    } else {
        intIdPersonalTmp = window.SISCOP.intIdPersonal
    }
    const intIdPersonal = intIdPersonalTmp
    const { intIdMenu } = configEmpleadoInicial()

    const dataUser = await axios.post('/Personal/GetPersonalData', { intIdMenu, intIdPersonal })
    const dataCorreos = await axios.post('/Personal/GetCorreosPersonal', { intIdMenu, intIdPersonal })
    const dataTelefonos = await axios.post('/Personal/GetTelefonosPersonal', { intIdMenu, intIdPersonal })

    if (dataUser.data.length) {
        const user = dataUser.data[0]
        const INTIDTPEVAL = user.intIdUbigeo
        const INTIDSUPUBI = user.intIdUbigSup
        const INTIDSUPUBIREGION = user.intIdUbiSupReg
        const intIdProvinciaMostrar = user.intIdUbiReg
        const intIdRegionMostrar = user.intIdUbiPais
        const intIdPaisMostrar = user.intIdUbiSupPais
        console.log(user.intIdTipoVia);

        $.post(
            '/Personal/ListarCombos',
            {
                intIdMenu: intIdMenu,
                strEntidad: 'TGTIPO_VIA',
                intIdFiltroGrupo: 0,
                strGrupo: '',
                strSubGrupo: ''
            },
            resp => {
                const dataTipVia = resp
                if (dataTipVia.length) {
                    $('#TipVia').empty()
                    $('#TipVia').attr('disabled', false)
                    $('#TipVia').append('<option value="">Via</option>')
                    dataTipVia.forEach((element) => {
                        $('#TipVia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                        if (element.intidTipo == user.intIdTipoVia) {
                            $('#TipVia').val(element.intidTipo)
                        }
                    })
                }
            });

        ////probando 23.07.2021
        $('#txtFechaNac').val(user.dttFecNacim);
        if (user.dttFecNacim != null) {
            var x = user.dttFecNacim.substr(6, 4) + '-' + user.dttFecNacim.substr(3, 2) + '-' + user.dttFecNacim.substr(0, 2);
            $('#inputSuccess3').val(x);
        } else {
            $('#inputSuccess3').val("");
        }
        $('#TXTTIPVIA').val(user.strDireccion);
        $('#txtIntidUbigeo').val(INTIDTPEVAL);

        if (dataCorreos.data.length) {
            const dataCorreosArray = dataCorreos.data
            let dataCorreosInsert = ''
            $('#tituloCorreoPersonal').html(`<li><i class="glyphicon glyphicon-envelope"></i> Otros Emails:</li>`)
            $('#dataCorreoPersonal').empty()
            dataCorreosArray.forEach((item) => {
                if (item.bitFlPrincipal) {
                    getDocumentElementById('correoPrincipalPersonal').innerHTML = `<i class="fa fa-envelope user-profile-icon"></i> ${item.strCorreo}`
                } else {
                    $('#dataCorreoPersonal').append(`<li>${item.strCorreo}</li><br>`)
                }
            })

            // editar
            dataCorreosArray.forEach((element) => {
                if (element.bitFlPrincipal) {
                    $('#Email_Emple').val(element.strCorreo)
                } else {
                    dataCorreosInsert += element.strCorreo + ','
                }
            })
            if (dataCorreosInsert != '') {
                let cadenaEmail = dataCorreosInsert.slice(0, -1)
                $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="${cadenaEmail}" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
            } else {
                $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
            }
        } else {
            $('#TagEmailContainer').html(`<input id="tagsEmail" type="text" class="tags form-control tagsEmailGet" value="" /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
        }
        if (dataTelefonos.data.length) {
            const dataTelefonosArray = dataTelefonos.data
            let dataTelefonosInsert = ''
            $('#tituloTelefonoPersonal').html(`<li><i class="glyphicon glyphicon-phone-alt"></i>Otros Telefonos:</li>`)
            $('#dataTelefonoPersonal').empty()
            dataTelefonosArray.forEach((item) => {
                if (item.bitFlPrincipal) {
                    getDocumentElementById('telefonoPrincipalPersonal').innerHTML = `<i class="glyphicon glyphicon-phone-alt"></i> ${item.strNumero}`
                } else {
                    $('#dataTelefonoPersonal').append(`<li>${item.strNumero}</li><br>`)
                }
            })
            // editar

            dataTelefonosArray.forEach((element) => {
                if (element.bitFlPrincipal) {
                    $('#celularEmpleado').val(element.strNumero)
                } else {
                    dataTelefonosInsert += element.strNumero + ','
                }
            })
            if (dataTelefonosInsert != '') {
                let cadenaTekl = dataTelefonosInsert.slice(0, -1)
                $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value="${cadenaTekl}"  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
            } else {
                $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value=""  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
            }
        } else {
            $('#tagTelefonosContainer').html(`<input id="tagsTelefono" type="text" class="tags form-control tagsTelefonoGet" value=""  /><div id="suggestions-container" style="position: relative; float: left; width: 250px; margin: 10px;"></div>`)
        }

       // var mailformatEmail = /^([a-zA-Z0-9_\.\-])+\@@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/

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
                if (response.length > 1) {
                    $('#CboPais').append('<option value="">Seleccione</option>')
                }
                response.forEach(element => {
                    $('#CboPais').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                    if (element.intidTipo == intIdPaisMostrar) {
                        $('#CboPais').val(element.intidTipo)
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
            (response) => {
                $('#CboDistrito').empty()
                $('#CboDistrito').attr('disabled', false)
                $('#CboDistrito').append('<option value="">Seleccione</option>')
                response.forEach((element) => {
                    $('#CboDistrito').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                    if (element.intidTipo == INTIDTPEVAL) {
                        $('#CboDistrito').val(element.intidTipo)
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
            (response) => {
                $('#CboProvincia').empty()
                $('#CboProvincia').attr('disabled', false)
                $('#CboProvincia').append('<option value="">Seleccione</option>')
                response.forEach((element) => {
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
                intIdFiltroGrupo: user.intIdUbiSupPais,
                strGrupo: 'DEPART',
                strSubGrupo: '',
            },
            (response) => {
                $('#CboRegion').empty()
                $('#CboRegion').attr('disabled', false)
                $('#CboRegion').append('<option value="">Seleccione</option>')
                response.forEach((element) => {
                    $('#CboRegion').append('<option value="' + element.intidTipo + '" >' + element.strDeTipo + '</option>')
                    if (element.intidTipo == intIdRegionMostrar) {
                        $('#CboRegion').val(element.intidTipo)
                    }
                })
            }
        )
    }
})

$('#CboPais').on('change', function () {
    var Valxpais = $('#CboPais').val()
    var intIdMenu = 0;
    if (Valxpais > 0) {

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
                if (response.length > 0) {
                    $('#CboRegion').empty()
                    $('#CboRegion').attr('disabled', false)
                    //$('#CboRegion').append('<option value="">Seleccione</option>')
                    if (response.length > 1) {
                        $('#CboRegion').append('<option value="">Seleccione</option>')
                    }
                    response.forEach(element => {
                        $('#CboRegion').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                    })

                    var ValDpto = $('#CboRegion').val()

                    if (ValDpto > 0) {
                        $.post(
                            '/Personal/ListarCombos',
                            {
                                intIdMenu: intIdMenu,
                                strEntidad: 'TGUBIGEO',
                                intIdFiltroGrupo: ValDpto,
                                strGrupo: 'REG',
                                strSubGrupo: '',
                            },
                            response => {
                                if (response.length > 0) {
                                    $('#CboProvincia').empty()
                                    $('#CboProvincia').attr('disabled', false)
                                    //$('#CboProvincia').append('<option value="">Seleccione</option>')
                                    if (response.length > 1) {
                                        $('#CboProvincia').append('<option value="">Seleccione</option>')
                                    }

                                    response.forEach(element => {
                                        $('#CboProvincia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                                    })

                                    var ValProv = $('#CboProvincia').val()
                                    if (ValProv > 0) {
                                        $.post(
                                            '/Personal/ListarCombos',
                                            {
                                                intIdMenu: intIdMenu,
                                                strEntidad: 'TGUBIGEO',
                                                intIdFiltroGrupo: ValProv,
                                                strGrupo: 'DIST',
                                                strSubGrupo: '',
                                            },
                                            response => {
                                                if (response.length > 0) {
                                                    $('#CboDistrito').empty()
                                                    $('#CboDistrito').attr('disabled', false)
                                                    //$('#CboDistrito').append('<option value="">Seleccione</option>')
                                                    if (response.length > 1) {
                                                        $('#CboDistrito').append('<option value="">Seleccione</option>')
                                                    }
                                                    response.forEach(element => {
                                                        $('#CboDistrito').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                                                    })
                                                }
                                                else {
                                                    //añadido 05/08/2021
                                                    $('#CboDistrito').empty()
                                                    $('#CboDistrito').attr('disabled', true)
                                                    $('#CboDistrito').append('<option value="">No hay Distritos</option>')
                                                }
                                            })
                                    }
                                    else {
                                        $('#CboDistrito').empty()
                                        $('#CboDistrito').attr('disabled', true)
                                        $('#CboDistrito').append('<option value="">Selec. una Provincia</option>')
                                    }
                                }
                                else {
                                    //añadido 05/08/2021
                                    $('#CboProvincia').empty()
                                    $('#CboProvincia').attr('disabled', true)
                                    $('#CboProvincia').append('<option value="">No hay Provincias</option>')
                                    $('#CboDistrito').empty()
                                    $('#CboDistrito').attr('disabled', true)
                                    $('#CboDistrito').append('<option value="">No hay Distritos</option>')
                                }
                            })
                    }
                    else {
                        //añadido 05/08/2021
                        $('#CboProvincia').empty()
                        $('#CboProvincia').attr('disabled', true)
                        $('#CboProvincia').append('<option value="">Selec. un Departamento</option>')
                        $('#CboDistrito').empty()
                        $('#CboDistrito').attr('disabled', true)
                        $('#CboDistrito').append('<option value="">Selec. una Provincia</option>')
                    }


                }
                else {
                    $('#CboRegion').empty()
                    $('#CboRegion').attr('disabled', true)
                    $('#CboRegion').append('<option value="">No hay Departamentos</option>')
                    $('#CboProvincia').empty()
                    $('#CboProvincia').attr('disabled', true)
                    $('#CboProvincia').append('<option value="">No hay Provincias</option>')
                    $('#CboDistrito').empty()
                    $('#CboDistrito').attr('disabled', true)
                    $('#CboDistrito').append('<option value="">No hay Distritos</option>')
                }
                //añadido 05/08/2021
                $('#CboProvincia').empty()
                $('#CboProvincia').attr('disabled', true)
                $('#CboProvincia').append('<option value="">Selec. un Departamento</option>')
                $('#CboDistrito').empty()
                $('#CboDistrito').attr('disabled', true)
                $('#CboDistrito').append('<option value="">Selec. una Provincia</option>')
            })

    } else {
        //añadido 05/08/2021
        $('#CboRegion').empty()
        $('#CboRegion').attr('disabled', true)
        $('#CboRegion').append('<option value="">Selec. un País</option>')
        $('#CboProvincia').empty()
        $('#CboProvincia').attr('disabled', true)
        $('#CboProvincia').append('<option value="">Selec. un Departamento</option>')
        $('#CboDistrito').empty()
        $('#CboDistrito').attr('disabled', true)
        $('#CboDistrito').append('<option value="">Selec. una Provincia</option>')
    }
})

$('#CboRegion').on('change', function () {
    var intIdMenu = 0;
    var ValDpto = $('#CboRegion').val()

    if (ValDpto > 0) {
        $.post(
            '/Personal/ListarCombos',
            {
                intIdMenu: intIdMenu,
                strEntidad: 'TGUBIGEO',
                intIdFiltroGrupo: ValDpto,
                strGrupo: 'REG',
                strSubGrupo: '',
            },
            response => {
                if (response.length > 0) {
                    $('#CboProvincia').empty()
                    $('#CboProvincia').attr('disabled', false)
                    //$('#CboProvincia').append('<option value="">Seleccione</option>')
                    if (response.length > 1) {
                        $('#CboProvincia').append('<option value="">Seleccione</option>')
                    }

                    response.forEach(element => {
                        $('#CboProvincia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                    })

                    var ValProv = $('#CboProvincia').val()
                    if (ValProv > 0) {
                        $.post(
                            '/Personal/ListarCombos',
                            {
                                intIdMenu: intIdMenu,
                                strEntidad: 'TGUBIGEO',
                                intIdFiltroGrupo: ValProv,
                                strGrupo: 'DIST',
                                strSubGrupo: '',
                            },
                            response => {
                                if (response.length > 0) {
                                    $('#CboDistrito').empty()
                                    $('#CboDistrito').attr('disabled', false)
                                    //$('#CboDistrito').append('<option value="">Seleccione</option>')
                                    if (response.length > 1) {
                                        $('#CboDistrito').append('<option value="">Seleccione</option>')
                                    }
                                    response.forEach(element => {
                                        $('#CboDistrito').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                                    })
                                }
                                else {
                                    //añadido 05/08/2021
                                    $('#CboDistrito').empty()
                                    $('#CboDistrito').attr('disabled', true)
                                    $('#CboDistrito').append('<option value="">No hay Distritos</option>')
                                }
                            })
                    }
                    else {
                        $('#CboDistrito').empty()
                        $('#CboDistrito').attr('disabled', true)
                        $('#CboDistrito').append('<option value="">Selec. una Provincia</option>')
                    }
                }
                else {
                    //añadido 05/08/2021
                    $('#CboProvincia').empty()
                    $('#CboProvincia').attr('disabled', true)
                    $('#CboProvincia').append('<option value="">No hay Provincias</option>')
                    $('#CboDistrito').empty()
                    $('#CboDistrito').attr('disabled', true)
                    $('#CboDistrito').append('<option value="">No hay Distritos</option>')
                }
            })
    }
    else {
        //añadido 05/08/2021
        $('#CboProvincia').empty()
        $('#CboProvincia').attr('disabled', true)
        $('#CboProvincia').append('<option value="">Selec. un Departamento</option>')
        $('#CboDistrito').empty()
        $('#CboDistrito').attr('disabled', true)
        $('#CboDistrito').append('<option value="">Selec. una Provincia</option>')
    }


})

$('#CboProvincia').on('change', function () {
    var ValProv = $('#CboProvincia').val()
    var intIdMenu = 0;

    if (ValProv > 0) {
        $.post(
            '/Personal/ListarCombos',
            {
                intIdMenu: intIdMenu,
                strEntidad: 'TGUBIGEO',
                intIdFiltroGrupo: ValProv,
                strGrupo: 'DIST',
                strSubGrupo: '',
            },
            response => {
                if (response.length > 0) {
                    $('#CboDistrito').empty()
                    $('#CboDistrito').attr('disabled', false)
                    //$('#CboDistrito').append('<option value="">Seleccione</option>')
                    if (response.length > 1) {
                        $('#CboDistrito').append('<option value="">Seleccione</option>')
                    }
                    response.forEach(element => {
                        $('#CboDistrito').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
                    })
                }
                else {
                    //añadido 05/08/2021
                    $('#CboDistrito').empty()
                    $('#CboDistrito').attr('disabled', true)
                    $('#CboDistrito').append('<option value="">No hay Distritos</option>')
                }
            })
    } else {
        $('#CboDistrito').empty()
        $('#CboDistrito').attr('disabled', true)
        $('#CboDistrito').append('<option value="">Selec. una Provincia</option>')
    }

})

$('#CboDistrito').on('change', function () {
    var Distrito = $('#CboDistrito').val();
    $('#txtIntidUbigeo').val(Distrito);
});
