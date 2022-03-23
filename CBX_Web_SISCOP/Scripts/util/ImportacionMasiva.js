//de siscop
let nombreExcel = ""
let idProceso = 0
let _varTablaMasivo
let _varTablaMasivoPermiso
let checkActualizar = false;
let bitNuevoExcel = false;

$(document).ready(function () {
    CombosImportacionMasiva()
    init_checkBox_styles();
    //TablaInicial();

    //////////////////////////////////////


    ///////////////////////////////////////


    $("#btnExplorar").attr("disabled", true) //añadido 04.11.2021
    $(".custom-file-label").text(" "); //añadido 04.11.2021
    $(".inline-1").css("background-color", "#ececec"); //$(".inline-2") añadido 04.11.2021
    $(".inline-1").css("background-color", "1px solid #d7dcde"); //$(".inline-2") añadido 04.11.2021
})

function TablaInicial() {
    let idComboPlantilla = $('#cboPlantilla').val();
    $("#divTotales").hide()
    $("#DivColumnas").hide()

    if (typeof _varTablaMasivo !== 'undefined') {
        _varTablaMasivo.destroy();
    }
    if (typeof _varTablaMasivoPermiso !== 'undefined') {
        _varTablaMasivoPermiso.destroy();
    }
    if (parseInt(idComboPlantilla) > 0) {
        $("#divTotales").show()
        $("#DivColumnas").show()
        if (parseInt(idComboPlantilla) == 1) {
            $('#columnHida').show(); //AÑADIDO 06.10.2021
            _varTablaMasivo = $('#datatable-Masivo').DataTable({
                data: {},
                columns: [
                    { data: "COD_EMP" },
                    { data: "COD_EMP_RUC" },
                    { data: "COD_EMP_DSC" },
                    { data: "COD_LOC" },
                    { data: "COD_LOC_DSC" },
                    { data: "COD_GER" },
                    { data: "COD_GER_DSC" },
                    { data: "COD_ARE" },
                    { data: "COD_ARE_DSC" },
                    { data: "COD_PL" },
                    { data: "COD_PL_DSC" },
                    { data: "COD_CG" },
                    { data: "COD_CG_DSC" },
                    { data: "COD_CT" },
                    { data: "COD_CT_DSC" },
                    { data: "COD_GR" },
                    { data: "COD_GR_DSC" },
                    { data: "COD_TP" },
                    { data: "COD_TP_DSC" },
                    { data: "COD_CC" },
                    { data: "COD_CC_DSC" },
                    { data: "COD_FIS" },
                    { data: "COD_RES" },
                    { data: "COD_EXT" },
                    { data: "COD_TD" },
                    { data: "NUMDOC" },
                    { data: "NOMBRES" },
                    { data: "FECNAC" },
                    { data: "GENERO" },
                    { data: "FOTOCHECK" },
                    { data: "FECADM" },
                    { data: "ESTADO" },
                    { data: "COD_REG" },
                    { data: "COD_HOR" },
                    { data: "COD_RES_IM" },
                    { data: "COD_RES_CT" },
                    { data: "CORREOP" },
                    { data: "CUENTA_US" },
                    { data: "CUENTA_PF" },
                    { data: "COD_VIA" },
                    { data: "DIRECCION" },
                    { data: "COD_UBI" },
                    { data: "CODPENSIONISTA" },
                    { data: "CODSALUD" },
                    { data: "TELEFONOP" },
                    { data: "CONTRATOI" },
                    { data: "FECCESE" },
                    { data: "COD_CESE" },
                    { data: "COD_GLIQ" },
                    { data: "COORDENADA" },
                    { data: "DIRCOORDENADA" },
                    { data: "INTIDPROCESO" },
                    { data: "OBSERVACION" },
                    { data: "FLAGOBSERVADO" },
                    { data: "ESTADO_FINAL" }
                ],
                lengthMenu: [10, 25, 50],
                order: [],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [
                    {
                        targets: [0],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [1],
                        visible: false,
                        searchable: false
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
                        targets: [8],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [9],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [10],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [11],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [12],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [13],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [14],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [15],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [16],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [17],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [18],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [19],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [20],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [21],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [22],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [23],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [27],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [28],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [31],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [32],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [33],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [34],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [35],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [36],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [37],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [38],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [39],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [40],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [41],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [42],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [43],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [44],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [45],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [46],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [47],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [48],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [49],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [50],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [51],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [53],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [54],
                        visible: false,
                        searchable: false
                    }
                ],
                dom: 'lBfrtip',
            });
            $('#datatable-Masivo').show(); //AÑADIDO 06.10.2021
            $('#datatable-MasivoPermiso').hide(); //AÑADIDO 06.10.2021
        }
        else if (parseInt(idComboPlantilla) == 2) {
            _varTablaMasivoPermiso = $('#datatable-MasivoPermiso').DataTable({
                data: {},
                columns: [
                    { data: "EMPRESA" },
                    { data: "COD_EMP" },
                    { data: "NOMBRES" },
                    { data: "COD_JUSTI" },
                    { data: "DSCPERMISO" },

                    { data: "FECHAINICIO" },
                    { data: "FECHAFIN" },
                    { data: "NDIAS" },//añadido 25.10.2021
                    { data: "HORAINICIO" },
                    { data: "HORAFIN" },
                    { data: "CAMBIODIA" }, //añadido 25.10.2021

                    { data: "COMENTARIO" },
                    { data: "INTIDPROCESO" },
                    { data: "OBSERVACION" },
                    { data: "FLAGOBSERVADO" },
                    { data: "ESTADO_FINAL" }
                ],
                lengthMenu: [10, 25, 50],
                order: [],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [
                    {
                        targets: [12],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [14],
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [15],
                        visible: false,
                        searchable: false
                    }
                ],
                dom: 'lBfrtip',
            });
            $('#datatable-Masivo').hide(); //AÑADIDO 06.10.2021
            $('#datatable-MasivoPermiso').show(); //AÑADIDO 06.10.2021
            $('#columnHida').hide(); //AÑADIDO 06.10.2021
        }
    }

}

function CombosImportacionMasiva() {
    validarSession()
    var intIdMenu = 0

    $.post(
        '/Personal/ListarCombosPersonal',
        {
            intIdMenu, strEntidad: 'IMPORTACIONMASIVA', intIdFiltroGrupo: 0, strGrupo: 'TIPOIMP', strSubGrupo: '',
        },
        response => {
            $('#cboPlantilla').empty()
            //if (response.length > 1) {
                $('#cboPlantilla').append('<option value="0">Seleccione</option>')
            //}
            //$('#cboPlantilla').append('<option value="0">Seleccione</option>')
            response.forEach(element => {
                $('#cboPlantilla').append('<option ruc="' + element.strextra1 + '" value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })

            let idComboPlantilla = $('#cboPlantilla').val();
            if (parseInt(idComboPlantilla) == 0) {
                $("#excelMasivo").attr('disabled', true);
                $(".divPlantillas").hide();
            } else {
                $("#excelMasivo").attr('disabled', false)
                $(".divPlantillas").show()
                if (parseInt(idComboPlantilla) == 1) { //comparando el strCoTipo
                    $(".divImportEmp").show()
                    $(".divImportPerm").hide()
                }
                if (parseInt(idComboPlantilla) == 2) { //comparando el strCoTipo
                    $(".divImportPerm").show()
                    $(".divImportEmp").hide()
                }
            }


        });

    $.post(
        '/Personal/ListarCombosPersonal',
        {
            intIdMenu, strEntidad: 'IMPORTACIONMASIVA', intIdFiltroGrupo: 0, strGrupo: 'FORMATOFEC', strSubGrupo: '',
        },
        response => {
            $('#cboFormato').empty()
            if (response.length > 1) {
                $('#cboFormato').append('<option value="0">Seleccione</option>')
            }

            response.forEach(element => {
                $('#cboFormato').append('<option ruc="' + element.strextra1 + '" value="' + element.intidTipo + '">' + element.strDeTipo + '</option>')
            })

            //$('#cboFormato').change(function () {
            //})

        });

}

$(".columnHide").click(function () {
    var index = $(this)[0].id;
    if (typeof _varTablaMasivo !== 'undefined') {
        var column = _varTablaMasivo.column(index);

        // Toggle the visibility
        column.visible(!column.visible());
    }
})

$("#excelMasivo").change(function (oEvent) {

    //ELIMINAR EL ANTERIOR EXCEL DEL DIRECTORIO AL SELECCIONAR UN NUEVO ARCHIVO CON EL BOTON "CHOOSE FILE"
    $.post('/Personal/eliminarTodoExcelDeDirectorio',
        {},
        response => {

            console.log()

            validarSession()
            // Get The File From The Input
            var oFile = oEvent.target.files[0];
            if (oFile != null) {

                var formData = new FormData()
                formData.append('archivos', oFile)

                filename = oFile.name
                //alert(filename);
                $.ajax({
                    url: "/Personal/uploadFilesEmpleado",
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        //alert(data)//Devuelve el nombre del excel en el servidor
                        $("#btn-import-masivo").attr("disabled", false)
                        $("#excelMasivo").val("");
                        $(".custom-file-label").text(filename);
                        $(".inline-1").css("background-color", "#ececec");//$(".inline-2")
                        $(".inline-1").css("background-color", "1px solid #d7dcde");//$(".inline-2")


                        $("#cboPlantilla").attr("disabled", true); //AÑADIDO HGM 16.11.2021

                    }
                });
                //INDICAR QUE ACABAN DE ATACHAR NUEVO ARCHIVO
                bitNuevoExcel = true;

            } else {
                $("#btn-import-masivo").attr("disabled", true)
                $("#excelMasivo").val("");
                $(".custom-file-label").text(" ");
            }


        });


  

})



$("#btn-import-masivo").click(function () {
    validarSession();

    var titulo_ = 'Importación de Empleados'
    let idComboPlantilla = $("#cboPlantilla").val()
    let cboFormato = $("#cboFormato").val()
    checkActualizar = $("#checkActualizar").is(':checked')

    if (idComboPlantilla == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione un tipo de importación' }, 'Tipo Importación')
        return;
    }

    if (cboFormato == 0) {
        messageResponseMix({ type: 'info', message: 'Seleccione un formato de fecha' }, 'Formato Fecha')
        return;
    }

    if (parseInt(idComboPlantilla) == 1) {


        //alert(ImportMasivoEmpleado);

        $.ajax({
            url: '/Personal/ImportMasivoEmpleado',
            type: 'POST',
            data: { idComboPlantilla, cboFormato, checkActualizar },
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

                $("#cboPlantilla").attr("disabled", false); //AÑADIDO HGM 16.11.2021

                if (response.type == "success") {

                    let lista = response.objeto
                    let lista_obs = lista.filter(x => x.FLAGOBSERVADO == true)
                    let lista_ok = lista.filter(x => x.FLAGOBSERVADO == false)
                    $("#txtEmpleadosOk").html(lista_ok.length)
                    $("#txtEmpleadosObs").html(lista_obs.length)
                    if (lista_obs.length > 0) {
                        $("#txtEmpleadosObs").css("color", "red")
                    } else {
                        $("#txtEmpleadosObs").css("color", "#73879C")
                    }

                    if (lista_ok.length > 0) {
                        $("#btn-save-masivo").attr("disabled", false)
                    } else {
                        $("#btn-save-masivo").attr("disabled", true)
                    }

                    $("#txt_titulo_tabla").html("Datos Importados")
                    $(".divEmpSave").hide()
                    $(".divEmpUpdate").hide()

                    if (typeof _varTablaMasivo !== 'undefined') {
                        _varTablaMasivo.destroy();
                    }

                    _varTablaMasivo = $('#datatable-Masivo').DataTable({
                        data: lista,
                        columns: [
                            { data: "COD_EMP" },
                            { data: "COD_EMP_RUC" },
                            { data: "COD_EMP_DSC" },
                            { data: "COD_LOC" },
                            { data: "COD_LOC_DSC" },
                            { data: "COD_GER" },
                            { data: "COD_GER_DSC" },
                            { data: "COD_ARE" },
                            { data: "COD_ARE_DSC" },
                            { data: "COD_PL" },
                            { data: "COD_PL_DSC" },
                            { data: "COD_CG" },
                            { data: "COD_CG_DSC" },
                            { data: "COD_CT" },
                            { data: "COD_CT_DSC" },
                            { data: "COD_GR" },
                            { data: "COD_GR_DSC" },
                            { data: "COD_TP" },
                            { data: "COD_TP_DSC" },
                            { data: "COD_CC" },
                            { data: "COD_CC_DSC" },
                            { data: "COD_FIS" },
                            { data: "COD_RES" },
                            { data: "COD_EXT" },
                            { data: "COD_TD" },
                            { data: "NUMDOC" },
                            { data: "NOMBRES" },
                            { data: "FECNAC" },
                            { data: "GENERO" },
                            { data: "FOTOCHECK" },
                            { data: "FECADM" },
                            { data: "ESTADO" },
                            { data: "COD_REG" },
                            { data: "COD_HOR" },
                            { data: "COD_RES_IM" },
                            { data: "COD_RES_CT" },
                            { data: "CORREOP" },
                            { data: "CUENTA_US" },
                            { data: "CUENTA_PF" },
                            { data: "COD_VIA" },
                            { data: "DIRECCION" },
                            { data: "COD_UBI" },
                            { data: "CODPENSIONISTA" },
                            { data: "CODSALUD" },
                            { data: "TELEFONOP" },
                            { data: "CONTRATOI" },
                            { data: "FECCESE" },
                            { data: "COD_CESE" },
                            { data: "COD_GLIQ" },
                            { data: "COORDENADA" },
                            { data: "DIRCOORDENADA" },
                            { data: "INTIDPROCESO" },
                            {
                                sortable: false,
                                "render": (data, type, item, meta) => {
                                    var OBSERVACION = item.OBSERVACION;

                                    if (OBSERVACION.includes("Empleado ya se encuentra Registrado")) {
                                        texto = `<span style="color:red">${OBSERVACION}</span>`
                                    } else {
                                        texto = OBSERVACION
                                    }

                                    return `${texto}`;
                                }
                            },
                            { data: "FLAGOBSERVADO" },
                            { data: "ESTADO_FINAL" }
                        ],
                        lengthMenu: [10, 25, 50],
                        order: [],
                        responsive: true,
                        language: _datatableLanguaje,
                        columnDefs: [
                            {
                                targets: [0],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [1],
                                visible: false,
                                searchable: false
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
                                targets: [8],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [9],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [10],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [11],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [12],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [13],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [14],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [15],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [16],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [17],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [18],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [19],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [20],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [21],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [22],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [23],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [27],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [28],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [31],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [32],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [33],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [34],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [35],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [36],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [37],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [38],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [39],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [40],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [41],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [42],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [43],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [44],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [45],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [46],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [47],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [48],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [49],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [50],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [51],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [53],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [54],
                                visible: false,
                                searchable: false
                            }
                        ],
                        dom: 'lBfrtip',
                    });


                    //INDICAR QUE ACABAN DE IMPORTAR EL ARCHIVO
                    bitNuevoExcel = false;


                } else {
                    messageResponseMix({ type: response.type, message: response.message }, titulo_)
                    return;
                }
            },
            complete: function () {
                $.unblockUI();
            }
        });
    }


    if (parseInt(idComboPlantilla) == 2) {



        titulo_ = 'Importación de Permisos'
        $.ajax({
            url: '/Personal/ImportMasivoPermiso',
            type: 'POST',
            data: { idComboPlantilla, cboFormato, checkActualizar },
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
                $("#cboPlantilla").attr("disabled", false); //AÑADIDO HGM 16.11.2021
                if (response.type == "success") {

                    let lista = response.objeto
                    let lista_obs = lista.filter(x => x.FLAGOBSERVADO == true)
                    let lista_ok = lista.filter(x => x.FLAGOBSERVADO == false)
                    $("#txtEmpleadosOk").html(lista_ok.length)
                    $("#txtEmpleadosObs").html(lista_obs.length)
                    if (lista_obs.length > 0) {
                        $("#txtEmpleadosObs").css("color", "red")
                    } else {
                        $("#txtEmpleadosObs").css("color", "#73879C")
                    }

                    if (lista_ok.length > 0) {
                        $("#btn-save-masivo").attr("disabled", false)
                    } else {
                        $("#btn-save-masivo").attr("disabled", true)
                    }

                    $("#txt_titulo_tabla").html("Datos Importados")
                    $(".divEmpSave").hide()
                    $(".divEmpUpdate").hide()

                    if (typeof _varTablaMasivoPermiso !== 'undefined') {
                        _varTablaMasivoPermiso.destroy();
                    }

                    _varTablaMasivoPermiso = $('#datatable-MasivoPermiso').DataTable({
                        data: lista,
                        columns: [
                            { data: "EMPRESA" },
                            { data: "COD_EMP" },
                            { data: "NOMBRES" },
                            { data: "COD_JUSTI" },
                            { data: "DSCPERMISO" },

                            { data: "FECHAINICIO" },
                            { data: "FECHAFIN" },
                            { data: "NDIAS" },//añadido 25.10.2021
                            { data: "HORAINICIO" },
                            { data: "HORAFIN" },
                            { data: "CAMBIODIA" }, //añadido 25.10.2021

                            { data: "COMENTARIO" },
                            { data: "INTIDPROCESO" },
                            {
                                sortable: false,
                                "render": (data, type, item, meta) => {
                                    var OBSERVACION = item.OBSERVACION;

                                    if (OBSERVACION.includes("Permiso ya se encuentra Registrado")) {
                                        texto = `<span style="color:red">${OBSERVACION}</span>`
                                    } else {
                                        texto = OBSERVACION
                                    }

                                    return `${texto}`;
                                }
                            },
                            { data: "FLAGOBSERVADO" },
                            { data: "ESTADO_FINAL" }
                        ],
                        lengthMenu: [10, 25, 50],
                        order: [],
                        responsive: true,
                        language: _datatableLanguaje,
                        columnDefs: [
                            {
                                targets: [12],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [14],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [15],
                                visible: false,
                                searchable: false
                            }
                        ],
                        dom: 'lBfrtip',
                    });


                    //INDICAR QUE ACABAN DE IMPORTAR EL ARCHIVO
                    bitNuevoExcel = false;


                } else {
                    messageResponseMix({ type: response.type, message: response.message }, titulo_)
                    return;
                }
            },
            complete: function () {
                $.unblockUI();
            }
        });
    }

})

$("#btn-save-masivo").click(function () {
    validarSession()
    var titulo_ = 'Guardar Empleados Importados'
    let idComboPlantilla = $('#cboPlantilla').val();
    //VALIDAR QUE EL ARCHIVO ATACHADO YA HAYA SIDO IMPORTADO AL SQL
    if (bitNuevoExcel == false) {
        //bitNuevoExcel = true cuando se acaba de atachar un archivo y no se ha importado aún.
        if (parseInt(idComboPlantilla) == 1) {
            swal({
                title: titulo_,
                text: "¿Está seguro de guardar los empleados?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, Guardar",
                cancelButtonText: "No, cancelar",
            }).then(function (isConfirm) {
                validarSession()
                $.ajax({
                    url: '/Personal/GuardarMasivoEmpleado',
                    type: 'POST',
                    data: {},
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
                            message: 'Guardando...'
                        });
                    },
                    success: function (response) {
                        if (response.type == "success") {
                            console.log(response)
                            $("#btn-save-masivo").attr("disabled", true)
                            $("#btn-import-masivo").attr("disabled", false)
                            $(".divEmpSave").show()
                            if (checkActualizar) {
                                $(".divEmpUpdate").show()
                            }

                            $("#txt_titulo_tabla").html("Datos Guardados")

                            let lista = response.objeto
                            let lista_guardados = lista.filter(x => x.ESTADO_FINAL == 1)
                            let lista_actualizados = lista.filter(x => x.ESTADO_FINAL == 2)
                            let lista_Noguardados = lista.filter(x => x.ESTADO_FINAL == 3)
                            //$("#txtEmpleadosGuardados").html(lista.length);
                            $("#txtEmpleadosGuardados").html(lista_guardados.length);
                            $("#txtEmpleadosActualizados").html(lista_actualizados.length);

                            if (typeof _varTablaMasivo !== 'undefined') {
                                _varTablaMasivo.destroy();
                            }

                            _varTablaMasivo = $('#datatable-Masivo').DataTable({
                                data: lista,
                                columns: [
                                    { data: "COD_EMP" },
                                    { data: "COD_EMP_RUC" },
                                    { data: "COD_EMP_DSC" },
                                    { data: "COD_LOC" },
                                    { data: "COD_LOC_DSC" },
                                    { data: "COD_GER" },
                                    { data: "COD_GER_DSC" },
                                    { data: "COD_ARE" },
                                    { data: "COD_ARE_DSC" },
                                    { data: "COD_PL" },
                                    { data: "COD_PL_DSC" },
                                    { data: "COD_CG" },
                                    { data: "COD_CG_DSC" },
                                    { data: "COD_CT" },
                                    { data: "COD_CT_DSC" },
                                    { data: "COD_GR" },
                                    { data: "COD_GR_DSC" },
                                    { data: "COD_TP" },
                                    { data: "COD_TP_DSC" },
                                    { data: "COD_CC" },
                                    { data: "COD_CC_DSC" },
                                    { data: "COD_FIS" },
                                    { data: "COD_RES" },
                                    { data: "COD_EXT" },
                                    { data: "COD_TD" },
                                    { data: "NUMDOC" },
                                    { data: "NOMBRES" },
                                    { data: "FECNAC" },
                                    { data: "GENERO" },
                                    { data: "FOTOCHECK" },
                                    { data: "FECADM" },
                                    { data: "ESTADO" },
                                    { data: "COD_REG" },
                                    { data: "COD_HOR" },
                                    { data: "COD_RES_IM" },
                                    { data: "COD_RES_CT" },
                                    { data: "CORREOP" },
                                    { data: "CUENTA_US" },
                                    { data: "CUENTA_PF" },
                                    { data: "COD_VIA" },
                                    { data: "DIRECCION" },
                                    { data: "COD_UBI" },
                                    { data: "CODPENSIONISTA" },
                                    { data: "CODSALUD" },
                                    { data: "TELEFONOP" },
                                    { data: "CONTRATOI" },
                                    { data: "FECCESE" },
                                    { data: "COD_CESE" },
                                    { data: "COD_GLIQ" },
                                    { data: "COORDENADA" },
                                    { data: "DIRCOORDENADA" },
                                    { data: "INTIDPROCESO" },
                                    { data: "OBSERVACION" },
                                    { data: "FLAGOBSERVADO" },
                                    {
                                        sortable: false,
                                        "render": (data, type, item, meta) => {
                                            var ESTADO_FINAL = item.ESTADO_FINAL;
                                            let texto = ''

                                            if (ESTADO_FINAL == 1) {
                                                texto = '<span style="color:green"><b>REGISTRADO</b></span>'
                                            } else if (ESTADO_FINAL == 2) {
                                                texto = '<span style="color:black"><b>ACTUALIZADO</b></span>'
                                            } else if (ESTADO_FINAL == 3) {
                                                texto = '<span style="color:red">NO GUARDADO</span>'
                                            }

                                            return `${texto}`;
                                        }
                                    }
                                ],
                                lengthMenu: [10, 25, 50],
                                order: [],
                                responsive: true,
                                language: _datatableLanguaje,
                                columnDefs: [
                                    {
                                        targets: [0],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [1],
                                        visible: false,
                                        searchable: false
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
                                        targets: [8],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [9],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [10],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [11],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [12],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [13],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [14],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [15],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [16],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [17],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [18],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [19],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [20],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [21],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [22],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [23],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [27],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [28],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [31],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [32],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [33],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [34],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [35],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [36],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [37],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [38],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [39],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [40],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [41],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [42],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [43],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [44],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [45],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [46],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [47],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [48],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [49],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [50],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [51],
                                        visible: false,
                                        searchable: false
                                    },
                                    {
                                        targets: [53],
                                        visible: false,
                                        searchable: false
                                    },
                                ],
                                dom: 'lBfrtip',
                            });

                            //$("#excelMasivo").attr('disabled', true) //para limpiar el campo 06.04.2021
                            //limpiar
                            $("#excelMasivo").val('');
                            $("#btn-import-masivo").attr("disabled", true)

                        } else {
                            messageResponseMix({ type: response.type, message: response.message }, titulo_)
                            return;
                        }
                    },
                    complete: function () {
                        $.unblockUI();
                    }
                });
            }, function (dismiss) {
                if (dismiss == 'cancel') {
                    //swal("Cancelado", "La Operación fue cancelada", "error");
                }
            });
        }

        if (parseInt(idComboPlantilla) == 2) {
            titulo_ = 'Guardar Permisos Importados'

            swal({
                title: titulo_,
                text: "¿Está seguro de guardar los permisos?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, Guardar",
                cancelButtonText: "No, cancelar",
            }).then(function (isConfirm) {
                validarSession()
                $.ajax({
                    url: '/Personal/GuardarMasivoPermiso',
                    type: 'POST',
                    data: {},
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
                            message: 'Guardando...'
                        });
                    },
                    success: function (response) {
                        if (response.type == "success") {
                            console.log(response)
                            $("#btn-save-masivo").attr("disabled", true)
                            $("#btn-import-masivo").attr("disabled", false)
                            $(".divEmpSave").show()
                            if (checkActualizar) {
                                $(".divEmpUpdate").show()
                            }

                            $("#txt_titulo_tabla").html("Datos Guardados")

                            let lista = response.objeto
                            let lista_guardados = lista.filter(x => x.ESTADO_FINAL == 1)
                            let lista_actualizados = lista.filter(x => x.ESTADO_FINAL == 2)
                            let lista_Noguardados = lista.filter(x => x.ESTADO_FINAL == 3)
                            $("#txtEmpleadosGuardados").html(lista_guardados.length);
                            $("#txtEmpleadosActualizados").html(lista_actualizados.length);

                            if (typeof _varTablaMasivoPermiso !== 'undefined') {
                                _varTablaMasivoPermiso.destroy();
                            }

                            _varTablaMasivoPermiso = $('#datatable-MasivoPermiso').DataTable({
                                data: lista,
                                columns: [
                                    { data: "EMPRESA" },
                                    { data: "COD_EMP" },
                                    { data: "NOMBRES" },
                                    { data: "COD_JUSTI" },
                                    { data: "DSCPERMISO" },

                                    { data: "FECHAINICIO" },
                                    { data: "FECHAFIN" },
                                    { data: "NDIAS" },//añadido 25.10.2021
                                    { data: "HORAINICIO" },
                                    { data: "HORAFIN" },
                                    { data: "CAMBIODIA" }, //añadido 25.10.2021

                                    { data: "COMENTARIO" },
                                    { data: "INTIDPROCESO" },
                                    { data: "OBSERVACION" },
                                    { data: "FLAGOBSERVADO" },
                                    {
                                        sortable: false,
                                        "render": (data, type, item, meta) => {
                                            var ESTADO_FINAL = item.ESTADO_FINAL;
                                            let texto = ''

                                            if (ESTADO_FINAL == 1) {
                                                texto = '<span style="color:green"><b>REGISTRADO</b></span>'
                                            } else if (ESTADO_FINAL == 2) {
                                                texto = '<span style="color:black"><b>ACTUALIZADO</b></span>'
                                            } else if (ESTADO_FINAL == 3) {
                                                texto = '<span style="color:red">NO GUARDADO</span>'
                                            }

                                            return `${texto}`;
                                        }
                                    }
                                ],
                                lengthMenu: [10, 25, 50],
                                order: [],
                                responsive: true,
                                language: _datatableLanguaje,
                                columnDefs: [
                                    {
                                        targets: [12],
                                        visible: false,
                                        searchable: false
                                    },
                                    //{
                                    //    targets: [13],
                                    //    visible: false,
                                    //    searchable: false
                                    //},
                                    {
                                        targets: [14],
                                        visible: false,
                                        searchable: false
                                    }
                                ],
                                dom: 'lBfrtip',
                            });

                            //$("#excelMasivo").attr('disabled', true) //para limpiar el campo 06.04.2021
                            //limpiar
                            $("#excelMasivo").val('');
                            $("#btn-import-masivo").attr("disabled", true)

                        } else {
                            messageResponseMix({ type: response.type, message: response.message }, titulo_)
                            return;
                        }
                    },
                    complete: function () {
                        $.unblockUI();
                    }
                });
            }, function (dismiss) {
                if (dismiss == 'cancel') {
                    //swal("Cancelado", "La Operación fue cancelada", "error");
                }
            });

        }

    } else {
        messageResponseMix({ type: 'info', message: 'Debe primero Importar el nuevo excel seleccionado.' }, titulo_)
        return;
    }
})

$("#cboPlantilla").change(function () {
    let idComboPlantilla = $('#cboPlantilla').val();
    $("#btn-import-masivo").attr("disabled", true)
    if (parseInt(idComboPlantilla) == 0) {
        $("#excelMasivo").attr('disabled', true);
        $(".divPlantillas").hide();
        $(".custom-file-label").text(" "); //añadido 04.11.2021
        $(".custom-file-label").hide();//añadido 04.11.2021
        $("#btnExplorar").attr("disabled", true); //añadido 04.11.2021
        $(".divImportEmp").hide()
        $(".divImportPerm").hide()
    } else {
        $(".custom-file-label").text(" "); //añadido 04.11.2021
        $(".custom-file-label").show();//añadido 04.11.2021
        $("#btnExplorar").attr("disabled", false); //añadido 04.11.2021
        $("#excelMasivo").attr('disabled', false)
        $(".divPlantillas").show()
        if (parseInt(idComboPlantilla) == 1) { //comparando el strCoTipo
            $(".divImportEmp").show()
            $(".divImportPerm").hide()
        }
        if (parseInt(idComboPlantilla) == 2) { //comparando el strCoTipo
            $(".divImportPerm").show()
            $(".divImportEmp").hide()
        }
        TablaInicial();
    }
})





