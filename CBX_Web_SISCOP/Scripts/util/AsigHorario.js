let _intIdProceso;
var _codigo;
var _nombre;
var _numDoc;
var _estado;
var _intidUniOrg;
var _dttFechAsig;
var _varTablaAsigHorarios;
var _varTablaAsigHorariosEmple;
let datahorariogLobal = null;
let datahorariocheck = [];
var datahorariocheckofinal = [];
var detalleListEmpReg = new Array();
var _varTablaAsigHorariosObs;
var DetalleListEmp2 = new Array();
class DetalleListEmp {
    constructor(codigo, NombreA, DocIden, HorAct, Empresa, intIdPerHorario) {
        this.codigo = codigo
        this.NombreA = NombreA
        this.DocIden = DocIden
        this.HorAct = HorAct
        this.Empresa = Empresa
        this.intIdPerHorario = intIdPerHorario

    }
}
class DetalleListEmpSave {
    constructor(intIdPersonal, intIdSoftw, intIdHorario, dttFecAsig, bitFlEliminado, IntIdUsuarReg, dttFeRegistro) {
        this.intIdPersonal = intIdPersonal
        this.intIdSoftw = intIdSoftw
        this.intIdHorario = intIdHorario
        this.dttFecAsig = dttFecAsig
        this.bitFlEliminado = bitFlEliminado
        this.IntIdUsuarReg = IntIdUsuarReg
        this.dttFeRegistro = dttFeRegistro

    }
}
var _TablaDetAsigHor;

function CombosAsigHorario() {
    $.post(
        '/Personal/ListarCombosPersonal',
        { intIdMenu: 0, strEntidad: 'TGUNIDORG', intIdFiltroGrupo: 0, strGrupo: 'JERAR', strSubGrupo: 'FILTRO' },//modificado 08.09.2021
        (response) => {
            $('#IntIDEmp').empty();
            //$('#IntIDEmp').append('<option value="0" selected>Todos</option>');

            response.forEach(element => {
                $('#IntIDEmp').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');
            });
        });
}

$('#IntIDEmp').on('change', function () {
    validarSession()
    traerDatosAsigHorario()
});

$('#filtroAsigHorCom').change(function () {
    validarSession()
    traerDatosAsigHorario()
});
$('#filtroFechaAsigHorario').on('apply.daterangepicker', function (ev, picker) { //.range-datepicker
    validarSession()
    if (_codigo != null && _nombre != null && _numDoc != null) {
        verHistoricoEmp(_codigo, _nombre, _numDoc, _estado, null);
    }
});

$("#filtroActivo").change(function () {
    validarSession()
    traerDatosAsigHorario()
})

$('#btn-cancelHistorial').on('click', function () {
    validarSession()
    $('.form-hide-AusentisCom').hide();
    $('.form-hide-AusentisCom').hide();
    $('.form-hide-AsighorarioCom').hide();
});

function CheckDetHor(IntidHor) {

    const dataGlobal = datahorariogLobal;
    if (dataGlobal == null) {
        return false;
    }

    if ($('#Chck' + IntidHor + '').is(':checked') == true) {
        $('#btn-new-AsighorarioCom').removeAttr("disabled");
        if (datahorariogLobal.find(e => e.intIdPerHorario == IntidHor)) {
            let position = datahorariogLobal.findIndex(e => e.intIdPerHorario == IntidHor);  //ln45781 e.intIdPerHorario IntidHor
            if (!isNaN(position)) {
                datahorariocheck.push(datahorariogLobal[position]);
            }
        }
    }

    else if ($('#Chck' + IntidHor + '').is(':checked') == false) {
        const datahorariocheckoR = datahorariocheck;
        if (datahorariocheck.find(e => e.intIdPerHorario == IntidHor)) {
            let position = datahorariocheck.findIndex(e => e.intIdPerHorario == IntidHor);
            if (!isNaN(position)) {
                datahorariocheckoR.splice(position, 1);
                datahorariocheck = datahorariocheckoR;
            }
        }
    }

    var table = $('#datatable-AsighorarioCom').DataTable();
    var info = table.page.info();
    $('#TotalPag').val(info.pages);

    var NumTotalChec = datahorariocheck.length;

    if (NumTotalChec == 0) {
        $('#All_Horarios').iCheck('uncheck');
        $('#btn-new-AsighorarioCom').attr("disabled");
    }

    if (info.recordsTotal == NumTotalChec) {
        $('#All_Horarios').iCheck('check');
    }
}

$('#btn-new-AsighorarioCom').on('click', function () {
    validarSession()
    var primerUO = datahorariocheck[0].intUniOrg
    if (!datahorariocheck.every(item => item.intUniOrg === primerUO)) {
        swal("Asignar Horario", "No puede asignar horario a empleados con diferente Unidad Organizacional", "info");
        return;
    }

    $('.form-hide-AsighorarioCom').show();
    $('#VerHist').hide();
    $('#EditHorAsig').hide();
    $('#AsigHor').show();
    //$("#fechaAsig").val(moment().format('DD/MM/YYYY'))
    $("#fechaAsig_").val(moment().format('YYYY-MM-DD'))//añadido 26.07.2021

    datahorariocheckofinal = [];
    datahorariocheckofinal = datahorariocheck.slice();

    if (datahorariocheckofinal.length == 1) {
        if (typeof _varTablaAsigHorariosEmple !== 'undefined') {
            _varTablaAsigHorariosEmple.destroy();
        }

        _varTablaAsigHorariosEmple = $('#TablaListEmp').DataTable({
            data: datahorariocheckofinal,
            columns: [
                { data: 'strCoPersonal' },
                { data: 'strNombres' },
                { data: 'strNumDoc' },
                { data: 'strDesEmp' },
                { data: 'intIdPerHorario' },
                { data: 'intIdPerHorario' }
            ],
            lengthMenu: [10, 25, 50],
            order: [],
            responsive: true,
            language: _datatableLanguaje,
            columnDefs: [
                {
                    targets: [4],
                    visible: false,
                    searchable: false
                },
                {
                    targets: [5],
                    visible: false,
                    searchable: false
                }
            ],
            dom: 'lBfrtip',
        });

    }
    else if (datahorariocheckofinal.length > 1) {
        if (typeof _varTablaAsigHorariosEmple !== 'undefined') {
            _varTablaAsigHorariosEmple.destroy();
        }

        _varTablaAsigHorariosEmple = $('#TablaListEmp').DataTable({
            data: datahorariocheckofinal,
            columns: [
                { data: 'strCoPersonal' },
                { data: 'strNombres' },
                { data: 'strNumDoc' },
                { data: 'strDesEmp' },
                {
                    sortable: false,
                    "render": (data, type, item, meta) => {
                        let intIdPerHorario = item.intIdPerHorario;
                        return `<input type="button" class="btn btn-danger btn-xs btn-del"  dataid="${intIdPerHorario}" value="Quitar"/> `;
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
                    targets: [5],
                    visible: false,
                    searchable: false
                }
            ],
            dom: 'lBfrtip',
        });


    }

    $.post(
        '/Personal/ListarCombosPersonal',
        { intIdMenu: 0, strEntidad: 'TGHORARIO', intIdFiltroGrupo: primerUO, strGrupo: 'COM', strSubGrupo: '' },
        (response) => {
            $('#IdHorCom').empty();
            $('#IdHorCom').append('<option value="0" selected>Seleccione</option>');
            response.forEach(element => {
                $('#IdHorCom').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');
            });
            $("#IdHorCom").val(0)
        });
});

$('#btn-cancel-AsighorarioCom').on('click', function () {
    validarSession()
    datahorariocheckofinal = [];
    $('.form-hide-AsighorarioCom').hide();

});

$('#TablaListEmp  tbody').on('click', 'tr .btn-del', function () {
    let EmpresaId = $(this).attr("dataid");
    if (!isNaN(EmpresaId)) {
        for (var i = 0; i < datahorariocheckofinal.length; i++) {
            if (datahorariocheckofinal[i].intIdPerHorario == EmpresaId) {
                datahorariocheckofinal.splice(i, 1);
                if (datahorariocheckofinal.length == 1) {
                    if (typeof _varTablaAsigHorariosEmple !== 'undefined') {
                        _varTablaAsigHorariosEmple.destroy();
                    }

                    _varTablaAsigHorariosEmple = $('#TablaListEmp').DataTable({
                        data: datahorariocheckofinal,
                        columns: [
                            { data: 'strCoPersonal' },
                            { data: 'strNombres' },
                            { data: 'strNumDoc' },
                            { data: 'strDesEmp' },
                            { data: 'intIdPerHorario' },
                            { data: 'intIdPerHorario' }
                        ],
                        lengthMenu: [10, 25, 50],
                        order: [],
                        responsive: true,
                        language: _datatableLanguaje,
                        columnDefs: [
                            {
                                targets: [4],
                                visible: false,
                                searchable: false
                            },
                            {
                                targets: [5],
                                visible: false,
                                searchable: false
                            }
                        ],
                        dom: 'lBfrtip',
                    });

                }
                else if (datahorariocheckofinal.length > 1) {
                    if (typeof _varTablaAsigHorariosEmple !== 'undefined') {
                        _varTablaAsigHorariosEmple.destroy();
                    }

                    _varTablaAsigHorariosEmple = $('#TablaListEmp').DataTable({
                        data: datahorariocheckofinal,
                        columns: [
                            { data: 'strCoPersonal' },
                            { data: 'strNombres' },
                            { data: 'strNumDoc' },
                            { data: 'strDesEmp' },
                            {
                                sortable: false,
                                "render": (data, type, item, meta) => {
                                    let intIdPerHorario = item.intIdPerHorario;

                                    return `<input type="button" class="btn btn-danger btn-xs btn-del"  dataid="${intIdPerHorario}" value="Quitar"/> `;
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
                                targets: [5],
                                visible: false,
                                searchable: false
                            }
                        ],
                        dom: 'lBfrtip',
                    });

                }

            }

        }
    }
});

function traerDatosAsigHorario() {

    var Activo = $("#filtroActivo").val();
    var strFiltro = $('#filtroAsigHorCom').val();
    var IntIdEmp = $('#IntIDEmp option:selected').val();
    let filtrojer_ini = moment().subtract(30, 'year').startOf('year').format('DD/MM/YYYY');
    let filtrojer_fin = moment().subtract(10, "year").endOf("year").format('DD/MM/YYYY');

    $.ajax({
        url: '/Personal/GetTablaAsigHorario',
        type: 'POST',
        data:
        {
            IntActivoFilter: Activo,
            strfilter: strFiltro,
            IntIdEmp: IntIdEmp,
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
            datahorariogLobal = response
            console.log(response);

            if (typeof _varTablaAsigHorarios !== 'undefined') {
                _varTablaAsigHorarios.destroy();
            }

            _varTablaAsigHorarios = $('#datatable-AsighorarioCom').DataTable({
                //stateSave: true,//comentado 26.08.2021 para que el campo de criterio de búsqueda dinámica de la tabla SI se limpie.
                data: response,
                columns: [
                    {
                        sortable: false,
                        "render": (data, type, item, meta) => {
                            let strCoPersonal = item.strCoPersonal;
                            let strNombres = item.strNombres;
                            let strNumDoc = item.strNumDoc;
                            let dttFechAsig = item.dttFechAsig;
                            let strDesEmp = item.strDesEmp;
                            let intIdPerHorario = item.intIdPerHorario;
                            let intIdUniOrg = item.intUniOrg;
                            let Activo_ = item.strEstado;
                            if (Activo_ == "Activo") {
                                return `<input 
                                           type="checkbox" 
                                           class="HorInd"  
                                           id="Chck${intIdPerHorario}"
                                           data_strco="${strCoPersonal}" 
                                           data_strNom="${strNombres}"  
                                           data_strNumDoc="${strNumDoc}"                                
                                           data_fecasig="${dttFechAsig}" 
                                           data_strdesemp="${strDesEmp}"  
                                           data_intIdPers="${intIdPerHorario}"
                                           data_intIdUniOrg="${intIdUniOrg}" 
                                           onchange="CheckDetHor(${intIdPerHorario});"                                          
                                     />`;
                            } else {
                                return `<label> </label>`;
                            }
                        }
                    },
                    { data: 'strCoPersonal' },
                    { data: 'strNombres' },
                    { data: 'strNumDoc' },
                    { data: 'dttFechAsig' },
                    { data: 'strDesEmp' },
                    { data: 'strEstado' }, //añadido 24.05.2021
                    {
                        sortable: false,
                        "render": (data, type, item, meta) => {
                            let intIdPerHorario = item.intIdPerHorario;
                            let strNombres = item.strNombres;
                            let strNumDoc = item.strNumDoc;
                            let intIdUniOrg = item.intUniOrg;
                            let Activo_ = item.strEstado;
                            let dttFechAsig_ = item.dttFechAsig;
                            //Listado de Empleado_Primera Columna
                            return `<button class="btn btn-dark btn-xs btn-edit"  onclick="VerDetAsigHor('${intIdPerHorario}','${strNombres}','${strNumDoc}','${intIdUniOrg}','${Activo_}','${dttFechAsig_}');"><i class="fa fa-search-plus"></i> Ver </button> `;
                        }
                    },
                    { data: 'intIdPerHorario' }

                ],

                lengthMenu: [10, 25, 50],
                order: [],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs:
                    [
                        {
                            targets: [8],//7
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [0], //Primera columna [0]
                            data: null,
                            defaultContent: '',
                            orderable: false,
                            className: 'select-checkbox'
                        }
                    ],
                dom: 'lBfrtip',
            });

            var allPages = _varTablaAsigHorarios.cells().nodes();

            $('#All_Horarios').on('change', function () {

                if ($('#All_Horarios').is(':checked')) {

                    $('#btn-new-AsighorarioCom').removeAttr("disabled");
                    datahorariocheck = datahorariogLobal
                    //$(allPages).find('input[type="checkbox"]').iCheck('check');
                    $(allPages).find('input[type="checkbox"]').prop('checked', true);
                } else {
                    $('#btn-new-AsighorarioCom').attr('disabled');

                    datahorariocheck = []
                    //$(allPages).find('input[type="checkbox"]').iCheck('uncheck');
                    $(allPages).find('input[type="checkbox"]').prop('checked', false);

                }

            });
        },
        complete: function () {
            $.unblockUI();
        }
    });
}

function VerDetAsigHor(intIdPerHorario, strNombres, strNumDoc, intidUniOrg, Activo_, dttFechAsig_) {
    validarSession()
    _codigo = intIdPerHorario;
    _nombre = strNombres;
    _numDoc = strNumDoc;
    _intidUniOrg = intidUniOrg;
    _estado = Activo_;
    _dttFechAsig = dttFechAsig_;
    verHistoricoEmp(intIdPerHorario, strNombres, strNumDoc, Activo_, dttFechAsig_);
}

function traerDatosAsigHorarioEmple() {

    if (typeof _varTablaAsigHorariosEmple !== 'undefined') {
        _varTablaAsigHorariosEmple.destroy();
    }

    if (datahorariocheckofinal.length == 1) {


        _varTablaAsigHorariosEmple = $('#TablaListEmp').DataTable({
            data: datahorariocheckofinal,
            columns: [

                { data: 'strCoPersonal' },
                { data: 'strNombres' },
                { data: 'strNumDoc' },
                { data: 'strDesEmp' },
                { data: 'intIdPerHorario' },
                { data: 'intIdPerHorario' }

            ],
            lengthMenu: [10, 25, 50],
            order: [],
            responsive: true,
            language: _datatableLanguaje,
            columnDefs: [
                {
                    targets: [4],
                    visible: false,
                    searchable: false
                },
                {
                    targets: [5],
                    visible: false,
                    searchable: false
                }
            ],
            dom: 'lBfrtip',
        });

    }
    else if (datahorariocheckofinal.length > 1) {


        _varTablaAsigHorariosEmple = $('#TablaListEmp').DataTable({
            data: datahorariocheckofinal,
            columns: [

                { data: 'strCoPersonal' },
                { data: 'strNombres' },
                { data: 'strNumDoc' },
                { data: 'strDesEmp' },
                {
                    sortable: false,
                    "render": (data, type, item, meta) => {
                        let intIdPerHorario = item.intIdPerHorario;

                        return `<input type="button" class="btn btn-primary btn-xs btn-del" onClick="EliminarEmp(${intIdPerHorario})" dataid="${intIdPerHorario}" value="Quitar"/> `;
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
                    targets: [5],
                    visible: false,
                    searchable: false
                }
            ],
            dom: 'lBfrtip',
        });
    }



}

$(function () {
    $("#finalizar_observados").click(function () {
        //alert('button clicked');
        $('#AsigHor').hide();
    }
    );
});

$('#btn-save-change-AsighorarioCom').on('click', function () {
    var titulo_ = 'Nueva Asignación de Horario'
    validarSession()
    var _IdHorCom = $('#IdHorCom').val();
    //    var _FechaAsig = $('#fechaAsig').val();
    var x_ = $('#fechaAsig_').val();
    var _FechaAsig = x_.substr(8, 2) + '/' + x_.substr(5, 2) + '/' + x_.substr(0, 4);


    if (_IdHorCom == 0 || _FechaAsig == '') {
        messageResponseMix({ type: 'info', message: 'Complete los Campos Obligatorios' }, titulo_)
        return;
    }

    //CONTAR ENVIADOS
    var NUMENV = datahorariocheckofinal.length;
    console.log(NUMENV);

    $.post(
        '/Personal/IUREGAsigHor',
        { listaDetalleHorAsigEmp: datahorariocheckofinal, intIdHorario: _IdHorCom, dttFecAsig: _FechaAsig },
        (response) => {
            if (response.type == 'success') {
                messageResponseMix({ type: response.type, message: response.message }, titulo_)

                $("#btn-cancel-AsighorarioCom").click()
                traerDatosAsigHorario()
                datahorariocheck = []
                return;
            } else {
                if (response.objeto.length == datahorariocheckofinal.length) {
                    if (response.objeto.length == 1) {
                        messageResponseMix({ type: response.type, message: response.objeto[0].strObservacion }, titulo_)
                        return;
                    } else {
                        messageResponseMix({ type: response.type, message: 'Todos los empleados se encuentran observados, verificar fecha de inicio' }, titulo_)
                        return;
                    }
                }
                else {
                    if ($.fn.DataTable.isDataTable('#TablaListEmpObserv')) {
                        _varTablaEmpleadosObs.destroy();
                    }

                    $("#totalEmpleados").html(datahorariocheckofinal.length)
                    $("#totalEmpleadosObs").html(response.objeto.length)
                    $("#textoModal").html("empleado ya tiene asignación registrada para la fecha ingresada.")
                    if (response.objeto.length > 1) {
                        $("#textoModal").html("empleados ya tienen asignaciones registradas para la fecha ingresada.")
                    }

                    $("#modaldetalle").modal('show');
                    _varTablaEmpleadosObs = $('#TablaListEmpObserv').DataTable({
                        data: response.objeto,
                        columns: [
                            { data: 'strCodEmpleado' },
                            { data: 'strNomCompleto' },
                            { data: 'strObservacion' }
                        ],
                        lengthMenu: [10, 25, 50],
                        order: [],
                        responsive: true,
                        language: _datatableLanguaje,
                        columnDefs: [],
                        dom: 'lBfrtip',
                    });
                }
                _intIdProceso = response.message
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

});

function verHistoricoEmp(intIdPerHorario2, strNombres, strNumDoc, Activo_, dttFechAsig_) {

    $('#NombresG').html('<h3>Empleado : ' + strNombres + '</h3>');
    if (Activo_ == "Activo") {
        $('#11').html('<label id="_lbl_">Activo</label> <input type = "checkbox" id = "estado_emp"  class= "js-switch" checked disabled /> ');
    } else {
        $('#11').html('<label id="_lbl_">Inactivo</label> <input type = "checkbox" id = "estado_emp" class= "js-switch" disabled/>');
    }
    switcheryLoad();

    $('#EditHorAsig').hide();
    let filtrojer_ini = $('#filtroFechaAsigHorario').data('daterangepicker').startDate.format('YYYY/MM/DD')

    if (dttFechAsig_ !== null) {
        //Formato desde BD: DD/MM/AAAA
        var d = dttFechAsig_.substr(0, 2);
        var m = dttFechAsig_.substr(3, 2);
        var a = dttFechAsig_.substr(6, 4);
        var fechaIni_ = d + "/" + m + "/" + a; //Armado como formato YYYY/MM/DD
        var fechaFin_ = $('#filtroFechaAsigHorario').data('daterangepicker').endDate.format('DD/MM/YYYY');

        filtrojer_ini = a + "/" + m + "/" + d;
        $('.range-datepicker span').html(fechaIni_ + ' - ' + fechaFin_);
    }

    let filtrojer_fin = $('#filtroFechaAsigHorario').data('daterangepicker').endDate.format('YYYY/MM/DD')

    $.post(
        '/Personal/GetTablaAsigHorarioDet',
        {
            intIdPerHor: intIdPerHorario2,
            filtrojer_ini,
            filtrojer_fin
        },
        (response) => {
            console.log(response);
            console.log(response.length);

            if (typeof _TablaDetAsigHor !== 'undefined') {
                _TablaDetAsigHor.destroy();
            }

            _TablaDetAsigHor = $('#TablaHistoricoHor').DataTable({
                data: response,
                columns: [
                    { data: 'dttFechAsig' },
                    { data: 'strDescHorario' },
                    { data: 'strCoHorario' },
                    {
                        sortable: false,
                        "render": (data, type, item, meta) => {
                            var intIdPerHorario = item.intIdPerHorario;
                            var intIdHorario = item.intIdHorario;
                            var strDescHorario = item.strDescHorario;
                            var dttFechAsig = item.dttFechAsig;
                            var strNombres2 = strNombres;
                            var strNumDoc2 = strNumDoc;
                            var bitPrincipal = item.bitPrincipal;//añadido 26.08.2021

                            if (Activo_ == "Activo") {
                                if (bitPrincipal == true) {
                                    return `<button class="btn btn-success btn-xs btn-edit" dataid="${strDescHorario}" des_data="${dttFechAsig}"  onclick="EditarHorDet('${strNombres2}', '${strNumDoc2}','${intIdPerHorario}','${intIdHorario}','${dttFechAsig}');"><i class="fa fa-pencil"></i> Editar </button>
                                            <label> [No Eliminable] </label>`;
                                } else {
                                    return `<button class="btn btn-success btn-xs btn-edit" dataid="${strDescHorario}" des_data="${dttFechAsig}"  onclick="EditarHorDet('${strNombres2}', '${strNumDoc2}','${intIdPerHorario}','${intIdHorario}','${dttFechAsig}');"><i class="fa fa-pencil"></i> Editar </button> 
                                           <button class="btn btn-primary btn-xs btn-delete" dataid="${intIdPerHorario}" des_data="${strDescHorario}" data_fec="${dttFechAsig}"  ><i class="fa fa-trash-o"></i> Eliminar </button>`;
                                }
                            } else {
                                return `<label> [No Editar - No Eliminar]</label>`;
                            }
                        }
                    },
                    { data: 'intIdPerHorario' },
                    { data: 'intIdHorario' }

                ],
                lengthMenu: [10, 25, 50],
                order: [], //columna ascendente o descendente ln46004
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [
                    {
                        targets: [4],
                        visible: false,
                        searchable: false
                    }, {
                        targets: [5],
                        visible: false,
                        searchable: false
                    }
                ],
                dom: 'lBfrtip',
            });

            $('#TablaHistoricoHor tbody').on('click', 'tr button.btn-delete', function () {
                validarSession()
                var intIdPerHorario = $(this).attr("dataid")

                var strDescHorario = $(this).attr("des_data")
                var strfec = $(this).attr("data_fec")

                if (!isNaN(intIdPerHorario)) {
                    $('#EditHorAsig').hide();
                    $('#VerHist').show();
                    $('#AsigHor').hide();

                    swal({
                        title: "Eliminar Horario Asignado",
                        text: "¿Está seguro de eliminar el Horario Asignado ''<strong>" + strDescHorario + "</strong>''  para la fecha " + strfec + "?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "No, cancelar",
                    }).then(function (isConfirm) {
                        validarSession()
                        $.post(
                            '/Personal/EliminarAsigHor',
                            { intIdPerHor: intIdPerHorario },
                            (response) => {
                                console.log(response);
                                if (response.type !== '') {
                                    var tipo = 'Eliminado!';
                                    if (response.type === 'error')
                                        tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                                    swal(tipo, response.message, response.type);

                                    if (response.type === 'success')

                                        verHistoricoEmp(intIdPerHorario2, strNombres, strNumDoc, Activo_, _dttFechAsig);

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
                        $('#EditHorAsig').hide();
                        $('#VerHist').show();

                    });
                }
            });
        });
    $('.form-hide-AsighorarioCom').show();
    $('#VerHist').show();
    $('#AsigHor').hide();
}

function EditarHorDet(strNombres, strNumDoc, intIdPerHorario, intIdHorario, dttFechAsig) {
    validarSession()

    $('#NomEmpEdit').html('Empleado : ' + strNombres + ' - ' + strNumDoc);
    if (!isNaN(intIdPerHorario)) {

        $("#IntIdPe").val(intIdPerHorario);
        //$("#fechaAsigEdit").val(dttFechAsig)
        //----------------------------------------------------------
        //AÑADIDO 26.07.2021
        if (dttFechAsig != null) {
            var x = dttFechAsig.substr(6, 4) + '-' + dttFechAsig.substr(3, 2) + '-' + dttFechAsig.substr(0, 2);
            $('#fechaAsigEdit_').val(x);
        } else {
            $('#fechaAsigEdit_').val("");
        }
        //----------------------------------------------------------
        $('#EditHorAsig').show();
        $('#VerHist').hide();
        $('#AsigHor').hide();

        $.post(
            '/Personal/ListarCombosPersonal',
            { intIdMenu: 0, strEntidad: 'TGHORARIO', intIdFiltroGrupo: _intidUniOrg, strGrupo: 'COM', strSubGrupo: '' },
            (response) => {
                $('#IdHorComEdit').empty();
                $('#IdHorComEdit').append('<option value="0" selected>Seleccione</option>');
                response.forEach(element => {
                    $('#IdHorComEdit').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');
                });
                $("#IdHorComEdit").val(intIdHorario);
            });


        $('#btn-cancelHistorial_Edit').on('click', function () {
            validarSession()
            $('#IdHorComEdit').val(0);
            //$('#fechaAsigEdit').val('');
            $('#fechaAsigEdit_').val('');
            $('#EditHorAsig').hide();
            $('#VerHist').show();

        });
    }

}

function ActualizarAsigDetHor() {
    var titulo_ = 'Actualización de Asignación de Horario'
    validarSession()
    var IntiDHor = $('#IdHorComEdit').val();
    //AÑADIDO 26.07.2021
    var x_ = $('#fechaAsigEdit_').val();
    var DttFecAsig = x_.substr(8, 2) + '/' + x_.substr(5, 2) + '/' + x_.substr(0, 4);
    //var DttFecAsig = $('#fechaAsigEdit').val();

    var intIdPerHorario = $("#IntIdPe").val();

    if (IntiDHor == 0 || DttFecAsig == '') {
        messageResponseMix({ type: 'info', message: 'Complete los campos Obligatorios' }, titulo_)
        return;
    }

    $.post(
        '/Personal/IUAsigHor',
        {
            intIdPerHor: intIdPerHorario
            , intIdHorario: IntiDHor
            , dttFecAsig: DttFecAsig
        },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    messageResponseMix({ type: response.type, message: response.message }, titulo_)
                    $('#EditHorAsig').hide();
                    $('#VerHist').hide();
                    traerDatosAsigHorario()
                    return;
                } else {
                    messageResponseMix({ type: response.type, message: response.message }, titulo_)
                    return;
                }
            }
        }
    );
}

$("#btnEmpContinuar").click(function () {
    validarSession()
    $.post('/Personal/IUREGAsigHorPost', { intIdProceso: _intIdProceso },
        (response) => {
            messageResponseMix({ type: response.type, message: response.message }, 'Nueva Asignación de Horario')
            $("#modaldetalle").modal('hide');
            $("#btn-cancel-AsighorarioCom").click()
            traerDatosAsigHorario()
            datahorariocheck = []

        });
});
