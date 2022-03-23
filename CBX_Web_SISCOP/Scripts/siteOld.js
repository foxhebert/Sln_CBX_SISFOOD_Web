/*
------------------------------------------
    JavaScript INDEX
    ===================

    1. General functions
    2. Horario Functions
    3. Marcador Functions
    4. Centro de Costos Functions
    5. Planilla
    6. Grupo
    7. Tipo Personal
    8. Categoría
    9. Cargo
    10. Unidad Organizacional
    11. Jerarquía Organizacional
    12. Feriado
    13. Variable
    14. Empleado
    15. Cambio Documento de Identidad
    16. Perfil
    17. Periodo de Pago
    18. Grupo de Liquidación
    19. Pagina Principal
    20. Papeleta de Salida
    21. Campos Adicionales
    22. Jornada diaria
*/


//all ready functions
$(document).ready(function () {
    //if (typeof Date.prototype.GetHora !== 'function') { timeStamp.prototype.GetHora = function () { if (this === null) return ''; return ('00' + this. .getHours()).slice(-2) + ":" + ('00' + this.getMinutes()).slice(-2); } }

    //global functions
    init_sidebar();
    navCurrentHistory();
    init_ProgresBar();
    init_InputMask();
    init_TagsInput();
    switcheryLoad();
    cargarDaterangePicker();
    init_daterangepicker();
    init_checkBox_styles();
    init_datatables_net();
    init_SmartWizard();
    init_compose();
    graficoAsistencia();
    _initCharts_PaginaPricipal();
    init_charts();
    calcu_one();
    calcu_two();
    calcu_third();
    calcu_one_reportes();
    //calcu_two_reportes();
    //calcu_third_reportes();
    //habilitar_check();
    DescargarUnidades();
    LlenarPeriodo();


    //_datatableCargo();

    //$('#Legal').keypress(function () {
    //    console.log("Handler for .keypress() called.");
    //});

    //$('#chk1').change(function () {
    //    alert($(this).prop('checked'))
    //})



});


/* 1. General functions */
/*---------------------------------------------- */
/**
 * Resize function without multiple trigger
 *
 * Usage:
 * $(window).smartresize(function(){
 *     // code here
 * });
 */
(function ($, sr) {
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this, args = arguments;
            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // smartresize
    jQuery.fn[sr] = function (fn) { return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery, 'smartresize');
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');



// Sidebar
function init_sidebar() {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    $SIDEBAR_MENU.find('a').on('click', function (ev) {
        console.log('clicked - sidebar_menu');
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function () {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            } else {
                if ($BODY.is(".nav-sm")) {
                    $li.parent().find("li").removeClass("active active-sm");
                    $li.parent().find("li ul").slideUp();
                }
            }
            $li.addClass('active');

            $('ul:first', $li).slideDown(function () {
                setContentHeight();
            });
        }
    });

    // toggle small or large menu
    $MENU_TOGGLE.on('click', function () {
        console.log('clicked - menu toggle');

        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
        } else {
            $SIDEBAR_MENU.find('li.active-sm ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        $BODY.toggleClass('nav-md nav-sm');

        setContentHeight();

        $('.dataTable').each(function () { $(this).dataTable().fnDraw(); });
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function () {
        setContentHeight();
    });

    setContentHeight();

     //fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel: { preventDefault: true }
        });
    }
};
// /Sidebar

// Progressbar
function init_ProgresBar() {
    if ($(".progress .progress-bar")[0]) {
        $('.progress .progress-bar').progressbar();
    }
}
// /Progressbar

/* SMART WIZARD */

function init_SmartWizard() {

    if (typeof ($.fn.smartWizard) === 'undefined') { return; }
    console.log('init_SmartWizard');

    $('#wizard').smartWizard({
        selected: 0,
        //labelNext: 'Siguiente',
        //labelPrevious: 'Anterior',
        //labelFinish: 'Último',
        enableFinishButton: true,
        enableAllSteps: true
    });

    $('#wizard_verticle').smartWizard({
        transitionEffect: 'slide'
    });

    $('.buttonNext').hide();//.addClass('btn btn-success');
    $('.buttonPrevious').hide();//.addClass('btn btn-primary');
    $('.buttonFinish').hide();//.addClass('btn btn-default');

};

/* INPUT MASK */

function init_InputMask() {

    if (typeof ($.fn.inputmask) === 'undefined') { return; }
    console.log('init_InputMask');

    $(":input").inputmask();

};

//Preview Image
function ShowPreview(input) {
    if (input.files && input.files[0]) {
        var ImageDir = new FileReader();
        ImageDir.onload = function (e) {
            $('#impPrev').attr('src', e.target.result);
        }
        ImageDir.readAsDataURL(input.files[0]);
    }
}


//tags input
function init_TagsInput() {

    if (typeof $.fn.tagsInput !== 'undefined') {

        $('#tags_1').tagsInput({
            width: 'auto'
        });
        $('#tags_2').tagsInput({
            width: 'auto'
        });

    }

};


//Navegation History current
function navCurrentHistory() {
    //count elements child of class breadcrumb
    var cantChild = $('.breadcrumb > a').length;
    cantChild = (cantChild - 1) * 10;  //(cantidad de elementos -1 ) * el tamaño de cada item de la clase .breadcrumb__step =>Default value=10%;
    cantChild = 100 - cantChild;    //100% (total del espacio) - tamño de items.
    /* console.log(cantChild); */
    $('.breadcrumb a:last-child').css('width', cantChild + '%');
}

//icheck
function init_checkBox_styles() {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                radioClass: 'iradio_flat-blue'
            });
        });
    }
}

// Switchery
function switcheryLoad() {

    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }

}

//Datatables.net formating
function init_datatables_net() {
    $('.datatables-net-format').dataTable({
        lengthMenu: [10, 25, 50],
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

////////////
////////////
function init_datatables_net_nuevo() {
    $('.datatables-net-format').dataTable({
        lengthMenu: [10, 25, 50],
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

function init_daterangepicker() {

    var dateCurrent = moment().format('DD/MM/YYYY');

    if (typeof ($.fn.daterangepicker) === 'undefined') { return; }

    var cb = function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
        $('.range-datepicker span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
    };

    var optionSet1 = {
        startDate: moment(),
        endDate: moment(),
        minDate: '01/01/2019',
        maxDate: '12/31/2030',
        dateLimit: {
            months: 12
        },
        linkedCalendars: false,
        showDropdowns: true,
        showWeekNumbers: false,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
            'últimos 30 días': [moment().subtract(29, 'days'), moment()],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'último Mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'último Año': [moment().subtract(0, 'year').startOf('year'), moment().subtract(0, 'year').endOf('year')]
        },
        opens: 'left',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'DD/MM/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Consultar',
            cancelLabel: 'Cancelar',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Elegir Rango',
            daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            firstDay: 1
        }
    };

    $('.range-datepicker span').html(moment().format('DD/MM/YYYY') + ' - ' + moment().format('DD/MM/YYYY'));
    $('.range-datepicker').daterangepicker(optionSet1, cb);
    $('.range-datepicker').on('show.daterangepicker', function () {
        console.log("show event fired");
    });
    $('.range-datepicker').on('hide.daterangepicker', function () {
        console.log("hide event fired");
    });
    $('.range-datepicker').on('apply.daterangepicker', function (ev, picker) {
        console.log("Fechas Aplicadas: " + picker.startDate.format('DD/MM/YYYY') + " to " + picker.endDate.format('DD/MM/YYYY'));

    });
    $('.range-datepicker').on('cancel.daterangepicker', function (ev, picker) {
        console.log("cancel event fired");
    });
    $('#options1').click(function () {
        $('.range-datepicker').data('daterangepicker').setOptions(optionSet1, cb);
    });
    $('#options2').click(function () {
        $('.range-datepicker').data('daterangepicker').setOptions(optionSet2, cb);
    });
    $('#destroy').click(function () {
        $('.range-datepicker').data('daterangepicker').remove();
    });

}


function init_daterangepicker_custom(idDatepicker='rangedatepickergeneral', dateFormato='DD/MM/YYYY') {

    var dateCurrent = moment().format(dateFormato);

    if (typeof ($.fn.daterangepicker) === 'undefined') { return; }

    var cb = function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
        $(`#${idDatepicker} span`).html(start.format(dateFormato) + ' - ' + end.format(dateFormato));
    };

    var optionSet1 = {
        startDate: moment(),
        endDate: moment(),
        minDate: '01/01/2019',
        maxDate: '12/31/2030',
        dateLimit: {
            months: 12
        },
        linkedCalendars: false,
        showDropdowns: true,
        showWeekNumbers: false,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
            'últimos 30 días': [moment().subtract(29, 'days'), moment()],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'último Mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'último Año': [moment().subtract(0, 'year').startOf('year'), moment().subtract(0, 'year').endOf('year')]
        },
        opens: 'left',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: dateFormato,
        separator: ' to ',
        locale: {
            applyLabel: 'Consultar',
            cancelLabel: 'Cancelar',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Elegir Rango',
            daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            firstDay: 1,
            format: dateFormato
        }
    };

    $(`#${idDatepicker} span`).html(moment().format(dateFormato) + ' - ' + moment().format(dateFormato));
    $(`#${idDatepicker}`).daterangepicker(optionSet1, cb);
    $(`#${idDatepicker}`).on('show.daterangepicker', function () {
        console.log("show event fired");
    });
    $(`#${idDatepicker}`).on('hide.daterangepicker', function () {
        console.log("hide event fired");
    });
    $(`#${idDatepicker}`).on('apply.daterangepicker', function (ev, picker) {
        console.log("Fechas Aplicadas: " + picker.startDate.format(dateFormato) + " to " + picker.endDate.format(dateFormato));

    });
    $(`#${idDatepicker}`).on('cancel.daterangepicker', function (ev, picker) {
        console.log("cancel event fired");
    });
    $('#options1').click(function () {
        $(`#${idDatepicker}`).data('daterangepicker').setOptions(optionSet1, cb);
    });
    $('#options2').click(function () {
        $(`#${idDatepicker}`).data('daterangepicker').setOptions(optionSet2, cb);
    });
    $('#destroy').click(function () {
        $(`#${idDatepicker}`).data('daterangepicker').remove();
    });

}

//datatable settings
var _datatableLanguaje = {
    lengthMenu: 'Mostrar _MENU_ Items',
    info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
    infoEmpty: 'No hay Items para mostrar',
    search: 'Buscar: ',
    sSearchPlaceholder: 'Criterio de búsqueda',
    zeroRecords: 'No se encontraron registros coincidentes',
    infoFiltered: '(Filtrado de _MAX_  Items en total)',
    paginate: {
        previous: 'Anterior',
        next: 'Siguiente'
    }
};

//Theme Charts
var theme = {
    color: [
        '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
        '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
    ],

    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'normal',
            color: '#408829'
        }
    },

    dataRange: {
        color: ['#1f610a', '#97b58d']
    },

    toolbox: {
        color: ['#408829', '#408829', '#408829', '#408829']
    },

    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#408829',
                type: 'dashed'
            },
            crossStyle: {
                color: '#408829'
            },
            shadowStyle: {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: '#eee',
        fillerColor: 'rgba(64,136,41,0.2)',
        handleColor: '#408829'
    },
    grid: {
        borderWidth: 0
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#408829'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },

    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#408829'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },
    timeline: {
        lineStyle: {
            color: '#408829'
        },
        controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
        }
    },

    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',
                color0: '#a9cba2',
                lineStyle: {
                    width: 1,
                    color: '#408829',
                    color0: '#86b379'
                }
            }
        }
    },
    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },
    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    strokeColor: '#408829'
                }
            }
        }
    },
    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },
    gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                width: 8
            }
        },
        axisTick: {
            splitNumber: 10,
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 18,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    },
    textStyle: {
        fontFamily: 'Arial, Verdana, sans-serif'
    }
};

/*---------------------------------------------- */
/**2. Horario Functions */
/**------------------------------------------------ */

function cargarDaterangePicker() {
    $('#date_desde').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_1"
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });

    $('#date_hasta').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_1"
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });

    $('#date_extra1').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_1"
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
}
function ListarJerarquia() {

     //ComboJerarquia
$.post(
    '/Asistencia/LlenarTipoUM',
    { strEntidad: 'TGJERARQORG', intIdFiltroGrupo: 0, strGrupo: 'DEPEN', strSubGrupo: '' },
    (response) => {
        $('#cboJerar').empty();
        $('#cboJerar').append('<option value="0">Seleccione</option>');

        response.forEach(element => {
            $('#cboJerarquica').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

        });
    });



}
$('#filActivo').on('change', function () {
    TablaHorario();
});
$('#cboJerarquica').on('change', function () {
    TablaHorario();
});
$('#filtroHor').keyup(function () {
    TablaHorario();
});
function CambiosNumdIA() {

    $('#btn-edita-dias').on('click', function () {

        var IntLength = $('#1').html();

        if (IntLength !== undefined) {


            swal({
                title: "Generar Horario",
                text: "Al cambiar el inicio o la duración, El horario perderá las jornadas asignadas",
                type: "info",
                showCancelButton: true,
                confirmButtonText: "Sí, Continuar",
                cancelButtonText: "No, cancelar",
            }).then(function (isConfirm) {
                if (isConfirm) {


                    $('#txt_Num_Dias').attr('disabled', false);
                    $('#TipoDia').attr('disabled', false);
                    $('#btn-genra-horario').show();
                    $('#btn-edita-dias').hide();
                    $('#cuerpo').empty();
                    $('#external-events-listing').empty();


                } else {
                    swal("Cancelado", "La Operación fue cancelada", "error");
                    return;
                }
            });
        } else if (IntLength == undefined) {

            $('#txt_Num_Dias').attr('disabled', false);
            $('#TipoDia').attr('disabled', false);
            $('#btn-genra-horario').show();
            $('#btn-edita-dias').hide();



        }

    });

}
var _varTablaHorario;
function TablaHorario() {
    var filtroActivo = $('#filActivo').val();
    var strfiltro = $('#filtroHor').val();
    var filtrojer = $('#cboJerarquica').val();

    $.post(
        '/Asistencia/GetTablaFiltradaHorario',
        { IntActivoFilter: filtroActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
        (response) => {
            console.log(response);

            if (typeof _varTablaHorario !== 'undefined') {
                _varTablaHorario.destroy();
            }
            _varTablaHorario = $('#datatable-horario').DataTable({
                data: response,
                columns: [

                    { data: 'strCoHorario' },
                    { data: 'strDeHorario' },
                    { data: 'strExtra1' },
                    { data: 'strExtra2' },
                    { data: 'strExtra3' },
                    { data: 'strExtra4' },
                    { data: null },
                    { data: 'intIdHorario' },


                ],
                lengthMenu: [10, 25, 50],
                order: [[1, 'asc']],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [//ocultar y definir columnas
                    {
                        targets: [6],
                        data: null,
                        defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                            '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
                    }, {
                        targets: [7],//intIdTipFisc
                        visible: false,
                        searchable: false
                    },

                ],
                dom: 'lBfrtip',
            });


            $('#datatable-horario  tbody').on('click', 'tr button.btn-edit', function () {
                var data = _varTablaHorario.row($(this).parents('tr')).data();
                if (data == null) {
                    data = null;
                    var data = _varTablaHorario.row($(this).parents('li')).data();
                  cardarDatosHorario(data);
                } else {
                    var data = _varTablaHorario.row($(this).parents('tr')).data();
                   cardarDatosHorario(data);
                }

            });

            $('#datatable-horario  tbody').on('click', 'tr button.btn-delete', function () {

                var data = _varTablaHorario.row($(this).parents('tr')).data();

                if (data == null) {
                    data = null;

                    var data = _varTablaHorario.row($(this).parents('li')).data();
                    intentEliminarHorario(data['intIdHorario'], data['strDeHorario']);

                } else {

                    var data = _varTablaHorario.row($(this).parents('tr')).data();
                    intentEliminarHorario(data['intIdHorario'], data['strDeHorario']);

                }


            });

        });

}
function intentEliminarHorario(idHora, strNomHora) {

    swal({
        title: "Eliminar Horario",
        text: "¿Está seguro de eliminar el Horario   ''<strong>" + strNomHora + "</strong>''   ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaHorario(idHora);
        } else {
            swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}
function yesEliminaHorario(idHora) {

    $.post(
        '/Asistencia/EliminarHorario',
        { intIdHorario: idHora },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    TablaHorario();
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
function cardarDatosHorario(data) {






    $('.form-hide-horario').show();
    $.post(
        '/Asistencia/EditarHorario',
        {},
        (response) => {




            if (response !== '') {
                $('.form-hide-horario .x_content').empty();
                $('.form-hide-horario .x_content').html(response);
                $('.form-hide-horario').show();

                $('#txt_Num_Dias').attr('disabled', true);
                $('#TipoDia').attr('disabled', true);
                $('#btn-genra-horario').hide();
                $('#btn-edita-dias').show();


                switcheryLoad();
                init_calendar();
                CamposAdicionalesHorarios();
                CombosHorario();
                TablaHorarioXJor();
                //CambiosNumdIA();

                $('#Dias_next').on('click', function () {



                    $('#btn-edita-dias').on('click', function () {



                        swal({
                            title: "Generar Horario",
                            text: "Al cambiar el inicio o la duración, El horario perderá las jornadas asignadas",
                            type: "info",
                            showCancelButton: true,
                            confirmButtonText: "Sí, Continuar",
                            cancelButtonText: "No, cancelar",
                        }).then(function (isConfirm) {
                            if (isConfirm) {


                                $('#txt_Num_Dias').attr('disabled', false);
                                $('#TipoDia').attr('disabled', false);
                                $('#btn-genra-horario').show();
                                $('#btn-edita-dias').hide();
                                $('#cuerpo').empty();
                                $('#external-events-listing').empty();



                                return;

                            } else {


                                swal("Cancelado", "La Operación fue cancelada", "error");

                                return;
                            }



                        });




                    });




                });



                ///////////////////////





                    $('#btn-edita-dias').on('click', function () {



                        swal({
                            title: "Generar Horario",
                            text: "Al cambiar el inicio o la duración, El horario perderá las jornadas asignadas",
                            type: "info",
                            showCancelButton: true,
                            confirmButtonText: "Sí, Continuar",
                            cancelButtonText: "No, cancelar",
                        }).then(function (isConfirm) {
                            if (isConfirm) {


                                $('#txt_Num_Dias').attr('disabled', false);
                                $('#TipoDia').attr('disabled', false);
                                $('#btn-genra-horario').show();
                                $('#btn-edita-dias').hide();
                                $('#cuerpo').empty();
                                $('#external-events-listing').empty();



                                return;

                            } else {


                                swal("Cancelado", "La Operación fue cancelada", "error");

                                return;
                            }



                        });




                    });





///////////////////////




                $('#btn-genra-horario').on('click', function () {

                    var NumeroDias = $('#txt_Num_Dias').val();
                    if (NumeroDias == 0 || NumeroDias < 0) {
                        new PNotify({
                            title: 'Número de Días',
                            text: '' + NumeroDias + ' no es un Número válido',
                            type: 'info',
                            delay: 3000,
                            styling: 'bootstrap3',
                            addclass: 'dark'
                        });

                        return;
                    }else if (NumeroDias !== 0) {
                    $('#txt_Num_Dias').attr('disabled', true);
                    $('#TipoDia').attr('disabled', true);
                    $('#btn-genra-horario').hide();
                    $('#btn-edita-dias').show();


                    if (NumeroDias !== null && NumeroDias > 0) {


                        CreaTabla();

                        $('#Dias_next').on('click', function () {



                            $('#btn-edita-dias').on('click', function () {



                                swal({
                                    title: "Generar Horario",
                                    text: "Al cambiar el inicio o la duración, El horario perderá las jornadas asignadas",
                                    type: "info",
                                    showCancelButton: true,
                                    confirmButtonText: "Sí, Continuar",
                                    cancelButtonText: "No, cancelar",
                                }).then(function (isConfirm) {
                                    if (isConfirm) {


                                        $('#txt_Num_Dias').attr('disabled', false);
                                        $('#TipoDia').attr('disabled', false);
                                        $('#btn-genra-horario').show();
                                        $('#btn-edita-dias').hide();
                                        $('#cuerpo').empty();
                                        $('#external-events-listing').empty();



                                        return;

                                    } else {


                                        swal("Cancelado", "La Operación fue cancelada", "error");

                                        return;
                                    }



                                });




                            });




                        });



                    } else if (NumeroDias == null || NumeroDias == '') {


                        new PNotify({
                            title: 'Número de Días',
                            text: 'Complete los campos obligatorios',
                            type: 'info',
                            delay: 3000,
                            styling: 'bootstrap3',
                            addclass: 'dark'
                        });

                        alert('9');

                        $('#txt_Num_Dias').attr('disabled', false);
                        $('#TipoDia').attr('disabled', false);

                        $('#btn-genra-horario').show();
                        $('#btn-edita-dias').hide();

                        return;

                    }

                    }
                    //CambiosNumdIA();
                });


                //$('#TipoDia').on('change', function () {
                //    CreaTabla();
                //});

                //$('#txt_Num_Dias').keyup(function () {
                //    CreaTabla();
                //});

                $('#btn-update-horario').show();

                $('#btn-save-change-horario').hide();

                //init_sidebar();
                //$.post(
                //    '/Asistencia/ListarJerarquia',
                //    {},
                //    (response) => {

                //        response.forEach(element => {

                //            $('#cboJerarquia').append('<option value="' + element.intIdJerOrg + '">' + element.strNomJerOrg + '</option>');

                //        });

                //    });




                $.post(
                    '/Asistencia/ObtenerHorarioPorsuPK',
                    { intIdHorario: data.intIdHorario },
                    (response) => {

                        console.log(response);
                        response.forEach(element => {




                            $("#cboJerar").val(element.intExtra1);






                            //$('#cbounidsupe').empty();



                            //if (element.bitFlActivo == true) {

                            //    $('#chk-activo-Hor').prop('checked', true);


                            //} else if (element.bitFlActivo == false) {

                            //    $('#chk-activo-Hor').prop('checked', false);

                            //}

                            if (element.bitFlActivo == false) {

                                $('#idche').html('<input type="checkbox" id="chk-activo-Hor" class=" js-switch"  /> Activo');
                                // $('#chck_Activo_Var').iCheck('uncheck');
                                switcheryLoad();
                            } else if (element.bitFlActivo == true) {

                                $('#idche').html('<input type="checkbox" id="chk-activo-Hor" class=" js-switch" checked /> Activo');
                                // $('#chck_Activo_Var').iCheck('check');
                                switcheryLoad();
                            }

                            $('#txt_Cod_Hor').val(element.strCoHorario);
                            $('#txt_Desc_Hor').val(element.strDeHorario);
                            // $('#cboJerarquia').val(element.IntIdUniOrg);
                            $('#TipoDia').val(element.intNumDiaIni);
                            $('#txt_Num_Dias').val(element.intTotalDias);
                            $('#IdHor').val(data.intIdHorario);
                            $('#strHorarioCampo1').val(element.strHorarioCampo1);
                            $('#strHorarioCampo2').val(element.strHorarioCampo2);
                            $('#strHorarioCampo3').val(element.strHorarioCampo3);
                            $('#strHorarioCampo4').val(element.strHorarioCampo4);
                            $('#strHorarioCampo5').val(element.strHorarioCampo5);



                            var idER = $("#cboJerar").val();

                            $.post(
                                '/Asistencia/LlenarTipoUM',
                                { strEntidad: 'TGUNIDORG', intIdFiltroGrupo: idER, strGrupo: 'JERAR', strSubGrupo: '' },
                                (response) => {
                                    $('#cboUndOrg').empty();
                                    $('#cboUndOrg').attr('disabled', false);

                                    response.forEach(element => {
                                        $('#cboUndOrg').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                                    });

                                    $("#cboUndOrg").val(element.intIdUniOrg);


                                });


                            var cboInicia = $('#TipoDia').val();
                            var NumDiaas = $('#txt_Num_Dias').val();


                            if (NumDiaas !== 0 && NumDiaas !== "" && cboInicia !== "" && cboInicia !== null) {

                                if (typeof _vartablaDias !== 'undefined') {
                                    _vartablaDias.destroy();
                                }

                                $('#Header').empty();
                                $('#cuerpo').empty();





                                if (cboInicia == 83) {
                                    $('#Header').append('<tr><th>Domingo</th><th>Lunes</th><th>Martes</th><th>Miercoles</th><th>Jueves</th><th>Viernes</th><th>Sabado</th></tr>');
                                }
                                else if (cboInicia == 84) {
                                    $('#Header').append('<tr><th>Lunes</th><th>Martes</th><th>Miercoles</th><th>Jueves</th><th>Viernes</th><th>Sabado</th><th>Domingo</th></tr>');

                                }
                                else if (cboInicia == 85) {
                                    $('#Header').append('<tr><th>Martes</th><th>Miercoles</th><th>Jueves</th><th>Viernes</th><th>Sabado</th><th>Domingo</th><th>Lunes</th></tr>');
                                }
                                else if (cboInicia == 86) {
                                    $('#Header').append('<tr><th>Miercoles</th><th>Jueves</th><th>Viernes</th><th>Sabado</th><th>Domingo</th><th>Lunes</th><th>Martes</th></tr>');
                                }
                                else if (cboInicia == 87) {
                                    $('#Header').append('<tr><th>Jueves</th><th>Viernes</th><th>Sabado</th><th>Domingo</th><th>Lunes</th><th>Martes</th><th>Miercoles</th></tr>');
                                }
                                else if (cboInicia == 88) {
                                    $('#Header').append('<tr><th>Viernes</th><th>Sabado</th><th>Domingo</th><th>Lunes</th><th>Martes</th><th>Miercoles</th><th>Jueves</th></tr>');
                                }
                                else if (cboInicia == 89) {
                                    $('#Header').append('<tr><th>Sabado</th><th>Domingo</th><th>Lunes</th><th>Martes</th><th>Miercoles</th><th>Jueves</th><th>Viernes</th></tr>');
                                }




                                for (var o = 1; o <= NumDiaas; o += 7) {

                                    //if (o == 1) {

                                    //}
                                    //else if (o == 2) {

                                    //}
                                    //else if (o == 3) {

                                    //}
                                    //else if (o == 4) {

                                    //}
                                    //else if (o == 5) {

                                    //}
                                    //else if (o == 6) {

                                    //}
                                    //else if (o == 7) {
                                    //}
                                    //else if (o == 8) {
                                    //}

                                    $('#cuerpo').append('<tr><td ondrop="drop(event)" ondragover="allowDrop(event)"  id="' + o + '">' +

                                        o


                                        + '<td   ondrop="drop(event)" ondragover="allowDrop(event)" id="' + (o + 1) + '">' +

                                        (o + 1)

                                        + '</td><td ondrop="drop(event)" ondragover="allowDrop(event)" id="' + (o + 2) + '">' +

                                        (o + 2)


                                        + '</td> <td ondrop="drop(event)" ondragover="allowDrop(event)" id="' + (o + 3) + '">' +

                                        (o + 3)

                                        + '</td><td ondrop="drop(event)" ondragover="allowDrop(event)"  id="' + (o + 4) + '">' +

                                        (o + 4)

                                        + '</td> <td ondrop="drop(event)" ondragover="allowDrop(event)"  id="' + (o + 5) + '">' +

                                        (o + 5)

                                        + '</td> <td ondrop="drop(event)" ondragover="allowDrop(event)"  id="' + (o + 6) + '">' +

                                        (o + 6)

                                        + '</td></tr >');

                                    if (o > NumDiaas) {
                                        $('#' + o + '').html('<h1 style="color:red;width:100%; height:100%;"><strong>X</strong></h1>');
                                        $('#' + o + '').attr('disabbled', true);

                                    }
                                    if ((o + 1) > NumDiaas) {
                                        $('#' + (o + 1) + '').html('<h1 style="color:red;width:100%; height:100%;"><center><strong>X</strong></center></h1>');
                                        $('#' + (o + 1) + '').disabled = true;
                                    }
                                    if ((o + 2) > NumDiaas) {
                                        $('#' + (o + 2) + '').html('<h1 style="color:red;width:100%; height:100%;"><center><strong>X</strong></center></h1>');
                                        $('#' + (o + 2) + '').attr('disabled', true);
                                    }
                                    if ((o + 3) > NumDiaas) {
                                        $('#' + (o + 3) + '').html('<h1 style="color:red;width:100%; height:100%;"><center><strong>X</strong></center></h1>');
                                        $('#' + (o + 3) + '').attr('disabled', true);
                                    }
                                    if ((o + 4) > NumDiaas) {
                                        $('#' + (o + 4) + '').html('<h1 style="color:red;width:100%; height:100%;"><center><strong>X</strong></center></h1>');
                                        $('#' + (o + 4) + '').attr('disabled', true);
                                    }
                                    if ((o + 5) > NumDiaas) {
                                        $('#' + (o + 5) + '').html('<h1 style="color:red;width:100%; height:100%;"><center><strong>X</strong></center></h1>');
                                        $('#' + (o + 5) + '').attr('disabled', true);
                                    }
                                    if ((o + 6) > NumDiaas) {

                                        $('#' + (o + 6) + '').html('<h1 style="color:red;width:100%; height:100%"><center><strong>X</strong></center></h1>');
                                        $('#' + (o + 6) + '').attr('disabled', true);
                                    }
                                    if ((o + 7) > NumDiaas) {

                                        $('#' + (o + 7) + '').html('<strong><h1 style="color:red;width:100%; height:100%;"><center>X</h1></center></strong>');
                                        $('#' + (o + 7) + '').attr('disabled', true);
                                    }




                                }


                                DtatableDia();
                                TablaHorarioXJor();
                            }




                            $.post(
                                '/Asistencia/ListarHorJor',
                                { intfiltrojer: data.intIdHorario },
                                (response) => {






                                        response.forEach(element => {




                                            $('#cuerpo tr').each((index, item) => {



                                            // PRIMERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA
                                            //$(item).find('td').first().html('  1   holi ');
                                            //alert('as');



                                            var Dias = element.intNumDiaIni;
                                                var dato2 = $(item).find('td').first().attr('id');




                                            if (dato2 == Dias) {

                                                if (element.intIdJornada > 0) {


                                                    $(item).find('#' + dato2 + '').html('' + dato2 + '    ' +

                                                        ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                        element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                        '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                                   );
                                                    return;

                                                }


                                            }

                                            // SEGUNDA COLUMNA DE LA PRIMERA FILA VALOR Y DIA


                                                var dato4 = $(item).find('td').next().attr('id');

                                            if (dato4 == Dias ) {

                                                if (element.intIdJornada > 0) {


                                                    $(item).find('#' + dato4 + '').html('' + dato4 + '    ' +



                                                        ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                        element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                        '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                           );



                                                }



                                            }


                                            // TERCERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA



                                                var dato6 = $(item).find('td').next().next().attr('id');



                                            if (dato6 == Dias ) {

                                                if (element.intIdJornada > 0) {



                                                    $(item).find('#' + dato6 + '').html('' + dato6 + '    ' +



                                                        ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                        element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                        '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                             );
                                                    return;

                                                }


                                            }


                                            // CUARTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA


                                                var dato8 = $(item).find('td').next().next().next().attr('id');



                                            if (dato8 == Dias ) {

                                                if (element.intIdJornada > 0) {


                                                    $(item).find('#'+ dato8 +'').html('' + dato8 + '    ' +



                                                        ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                        element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                        '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                             );

                                                    return;

                                                }


                                            }



                                            // QUINTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA


                                                var dato10 = $(item).find('td').next().next().next().next().attr('id');


                                            if (dato10 == Dias ) {

                                                if (element.intIdJornada > 0) {



                                                    $(item).find('#' + dato10 + '').html('' + dato10 + '    ' +



                                                        ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                        element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                        '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                             );

                                                    return;

                                                }



                                            }



                                            // SEXTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA



                                                var dato12 = $(item).find('td').next().next().next().next().next().attr('id');

                                            if (dato12 == Dias ) {

                                                if (element.intIdJornada > 0) {



                                                    $(item).find('#' + dato12 + '').html('' + dato12 + '    ' +


                                                        ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                        element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                        '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                             );


                                                    return;

                                                }


                                            }



                                            // SEPTIMA COLUMNA DE LA PRIMERA FILA VALOR Y DIA



                                                var dato14 = $(item).find('td').next().next().next().next().next().next().attr('id');


                                            if (dato14 == Dias ) {
                                                if (element.intIdJornada > 0) {



                                                    $(item).find('#' + dato14 + '').html('' + dato14 + '    ' +



                                                        ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                        element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                        '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                             );

                                                    return;


                                                }



                                            }


                                            });

                                            $('#Dias_next').on('click', function () {




                                                $('#cuerpo tr').each((index, item) => {



                                                    $('#Dias select').val('5').trigger("change");

                                                    // PRIMERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA
                                                    //$(item).find('td').first().html('  1   holi ');
                                                    //alert('as');



                                                    var Dias = element.intNumDiaIni;
                                                    var dato2 = $(item).find('td').first().attr('id');




                                                    if (dato2 == Dias) {

                                                        if (element.intIdJornada > 0) {


                                                            $(item).find('#' + dato2 + '').html('' + dato2 + '    ' +

                                                                ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                                element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                                '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                            );
                                                            return;

                                                        }


                                                    }

                                                    // SEGUNDA COLUMNA DE LA PRIMERA FILA VALOR Y DIA


                                                    var dato4 = $(item).find('td').next().attr('id');

                                                    if (dato4 == Dias) {

                                                        if (element.intIdJornada > 0) {


                                                            $(item).find('#' + dato4 + '').html('' + dato4 + '    ' +



                                                                ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                                element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                                '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                            );



                                                        }



                                                    }


                                                    // TERCERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA



                                                    var dato6 = $(item).find('td').next().next().attr('id');



                                                    if (dato6 == Dias) {

                                                        if (element.intIdJornada > 0) {



                                                            $(item).find('#' + dato6 + '').html('' + dato6 + '    ' +



                                                                ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                                element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                                '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                            );
                                                            return;

                                                        }


                                                    }


                                                    // CUARTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA


                                                    var dato8 = $(item).find('td').next().next().next().attr('id');



                                                    if (dato8 == Dias) {

                                                        if (element.intIdJornada > 0) {


                                                            $(item).find('#' + dato8 + '').html('' + dato8 + '    ' +



                                                                ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                                element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                                '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                            );

                                                            return;

                                                        }


                                                    }



                                                    // QUINTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA


                                                    var dato10 = $(item).find('td').next().next().next().next().attr('id');


                                                    if (dato10 == Dias) {

                                                        if (element.intIdJornada > 0) {



                                                            $(item).find('#' + dato10 + '').html('' + dato10 + '    ' +



                                                                ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                                element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                                '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                            );

                                                            return;

                                                        }



                                                    }



                                                    // SEXTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA



                                                    var dato12 = $(item).find('td').next().next().next().next().next().attr('id');

                                                    if (dato12 == Dias) {

                                                        if (element.intIdJornada > 0) {



                                                            $(item).find('#' + dato12 + '').html('' + dato12 + '    ' +


                                                                ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                                element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                                '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                            );


                                                            return;

                                                        }


                                                    }



                                                    // SEPTIMA COLUMNA DE LA PRIMERA FILA VALOR Y DIA



                                                    var dato14 = $(item).find('td').next().next().next().next().next().next().attr('id');


                                                    if (dato14 == Dias) {
                                                        if (element.intIdJornada > 0) {



                                                            $(item).find('#' + dato14 + '').html('' + dato14 + '    ' +



                                                                ' <div id="drag8" class="col-md-2 col-sm-2 col-xs-2 drags colum2" draggable="true" Dato="' + element.intIdJornada + '" ondragstart="drag(event)" title="' +
                                                                element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +
                                                                '" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3 + '</div>'

                                                            );

                                                            return;


                                                        }



                                                    }


                                                });
                                            });


                                        });




                                });
                        });



                    });

                $('#txt_Num_Dias').attr('disabled', true);
                $('#TipoDia').attr('disabled', true);
                $('#btn-genra-horario').hide();
                $('#btn-edita-dias').show();

             }



        });


}
function CombosHorario() {

    //Combo Tipo de Dia
    $.post(
        '/Asistencia/LlenarTipoUM',
        { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'CAL', strSubGrupo: 'DIA' },
        (response) => {

            response.forEach(element => {
                $('#TipoDia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

            });
        });

    //ComboJerarquia
    $.post(
        '/Asistencia/LlenarTipoUM',
        { strEntidad: 'TGJERARQORG', intIdFiltroGrupo: 0, strGrupo: 'DEPEN', strSubGrupo: '' },
        (response) => {
            $('#cboJerar').empty();
            $('#cboJerar').append('<option value="0">Seleccione</option>');

            response.forEach(element => {
                $('#cboJerar').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

            });
        });

    //Combo UnidadOrganizacional
    $('#cboJerar').on('change', function () {

        var IntidJerar = $('#cboJerar option:selected').val();

        $.post(
            '/Asistencia/LlenarTipoUM',
            { strEntidad: 'TGUNIDORG', intIdFiltroGrupo: IntidJerar, strGrupo: 'JERAR', strSubGrupo: '' },
            (response) => {
                $('#cboUndOrg').empty();
                $('#cboUndOrg').attr('disabled', false);

                response.forEach(element => {
                    $('#cboUndOrg').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                });
            });
    });

}
$('#btn-new-horario').on('click', function () {

    $('.form-hide-horario').show();

    $.post(
        '/Asistencia/NuevoHorario',
        {},
        (response) => {
            if (response !== '') {

                $('.form-hide-horario .x_content').empty();
                $('.form-hide-horario .x_content').html(response);
                $('.form-hide-horario').show();

                switcheryLoad();//checked verde
                init_calendar();
                CamposAdicionalesHorarios();
                CombosHorario();



                $('#btn-update-horario').hide();

                $('#btn-save-change-horario').show();

                $('#btn-genra-horario').on('click', function () {



                    var NumeroDias = $('#txt_Num_Dias').val();
                    if (NumeroDias == 0 || NumeroDias < 0) {
                        new PNotify({
                            title: 'Número de Días',
                            text: '' + NumeroDias + ' no es un Número válido',
                            type: 'info',
                            delay: 3000,
                            styling: 'bootstrap3',
                            addclass: 'dark'
                        });

                        return;
                    }
                    else if (NumeroDias !== 0) {


                    $('#txt_Num_Dias').attr('disabled', true);
                    $('#TipoDia').attr('disabled', true);
                    $('#btn-genra-horario').hide();
                    $('#btn-edita-dias').show();


                    if (NumeroDias !== null && NumeroDias > 0) {


                        CreaTabla();
                        $('#btn-edita-dias').on('click', function () {



                            swal({
                                title: "Generar Horario",
                                text: "Al cambiar el inicio o la duración, El horario perderá las jornadas asignadas",
                                type: "info",
                                showCancelButton: true,
                                confirmButtonText: "Sí, Continuar",
                                cancelButtonText: "No, cancelar",

                            }).then(function (isConfirm) {
                                if (isConfirm) {


                                    $('#txt_Num_Dias').attr('disabled', false);
                                    $('#TipoDia').attr('disabled', false);
                                    $('#btn-genra-horario').show();
                                    $('#btn-edita-dias').hide();
                                    $('#cuerpo').empty();
                                    $('#external-events-listing').empty();



                                    return;



                                } else {


                                    swal("Cancelado", "La Operación fue cancelada", "error");

                                    return;
                                }



                            });




                        });

                        $('#Dias_next').on('click', function () {



                            $('#btn-edita-dias').on('click', function () {



                                swal({
                                    title: "Generar Horario",
                                    text: "Al cambiar el inicio o la duración, El horario perderá las jornadas asignadas",
                                    type: "info",
                                    showCancelButton: true,
                                    confirmButtonText: "Sí, Continuar",
                                    cancelButtonText: "No, cancelar",
                                }).then(function (isConfirm) {
                                    if (isConfirm) {


                                        $('#txt_Num_Dias').attr('disabled', false);
                                        $('#TipoDia').attr('disabled', false);
                                        $('#btn-genra-horario').show();
                                        $('#btn-edita-dias').hide();
                                        $('#cuerpo').empty();
                                        $('#external-events-listing').empty();



                                        return;

                                    } else {


                                        swal("Cancelado", "La Operación fue cancelada", "error");

                                        return;
                                    }



                                    });




                            });




                        });



                    }

                    else if (NumeroDias == null || NumeroDias == '') {


                        new PNotify({
                            title: 'Número de Días',
                            text: 'Complete los campos obligatorios',
                            type: 'info',
                            delay: 3000,
                            styling: 'bootstrap3',
                            addclass: 'dark'
                        });



                        $('#txt_Num_Dias').attr('disabled', false);
                        $('#TipoDia').attr('disabled', false);

                        $('#btn-genra-horario').show();
                        $('#btn-edita-dias').hide();

                        return;

                    }

                    }


                });


                //$('#txt_Num_Dias').keyup(function () {
                //    CreaTabla();
                //    TablaHorarioXJor();
                //});

                //init_events($('#external-events div.external-event'));

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
        });

   CambiosNumdIA();


    /* initialize the calendar
     -----------------------------------------------------------------*/
    //Date for the calendar events (dummy data)
    //var date = new Date()
    //var d = date.getDate(),
    //    m = date.getMonth(),
    //    y = date.getFullYear()
    //$('#calendar').fullCalendar({
    //    header: {
    //        left: 'prev,next today',
    //        center: 'title',
    //        right: 'month,agendaWeek,agendaDay'
    //    },
    //    buttonText: {
    //        today: 'today',
    //        month: 'month',
    //        week: 'week',
    //        day: 'day'
    //    },
    //    //Random default events
    //    events: [
    //        {
    //            title: 'All Day Event',
    //            start: new Date(y, m, 1),
    //            backgroundColor: '#f56954', //red
    //            borderColor: '#f56954' //red
    //        },
    //        {
    //            title: 'Long Event',
    //            start: new Date(y, m, d - 5),
    //            end: new Date(y, m, d - 2),
    //            backgroundColor: '#f39c12', //yellow
    //            borderColor: '#f39c12' //yellow
    //        },
    //        {
    //            title: 'Meeting',
    //            start: new Date(y, m, d, 10, 30),
    //            allDay: false,
    //            backgroundColor: '#0073b7', //Blue
    //            borderColor: '#0073b7' //Blue
    //        },
    //        {
    //            title: 'Lunch',
    //            start: new Date(y, m, d, 12, 0),
    //            end: new Date(y, m, d, 14, 0),
    //            allDay: false,
    //            backgroundColor: '#00c0ef', //Info (aqua)
    //            borderColor: '#00c0ef' //Info (aqua)
    //        },
    //        {
    //            title: 'Birthday Party',
    //            start: new Date(y, m, d + 1, 19, 0),
    //            end: new Date(y, m, d + 1, 22, 30),
    //            allDay: false,
    //            backgroundColor: '#00a65a', //Success (green)
    //            borderColor: '#00a65a' //Success (green)
    //        },
    //        {
    //            title: 'Click for Google',
    //            start: new Date(y, m, 28),
    //            end: new Date(y, m, 29),
    //            url: 'http://google.com/',
    //            backgroundColor: '#3c8dbc', //Primary (light-blue)
    //            borderColor: '#3c8dbc' //Primary (light-blue)
    //        }
    //    ],
    //    editable: true,
    //    droppable: true, // this allows things to be dropped onto the calendar !!!
    //    drop: function (date, allDay) { // this function is called when something is dropped

    //        // retrieve the dropped element's stored Event Object
    //        var originalEventObject = $(this).data('eventObject')

    //        // we need to copy it, so that multiple events don't have a reference to the same object
    //        var copiedEventObject = $.extend({}, originalEventObject)

    //        // assign it the date that was reported
    //        copiedEventObject.start = date
    //        copiedEventObject.allDay = allDay
    //        copiedEventObject.backgroundColor = $(this).css('background-color')
    //        copiedEventObject.borderColor = $(this).css('border-color')

    //        // render the event on the calendar
    //        // the last `true` argument determines if the event "sticks"
    //        $('#calendar').fullCalendar('renderEvent', copiedEventObject, true)

    //        // is the "remove after drop" checkbox checked?
    //        if ($('#drop-remove').is(':checked')) {
    //            // if so, remove the element from the "Draggable Events" list
    //            $(this).remove()
    //        }
    //    }
    //})
    /* ADDING EVENTS */
    var currColor = '#3c8dbc' //Red by default
    //Color chooser button
    var colorChooser = $('#color-chooser-btn')
    $('#color-chooser > li > a').click(function (e) {
        e.preventDefault()
        //Save color
        currColor = $(this).css('color')
        //Add color effect to button
        $('#add-new-event').css({ 'background-color': currColor, 'border-color': currColor })
    });
    $('#add-new-event').click(function (e) {
        e.preventDefault()
        //Get value and make sure it is not null
        var val = $('#new-event').val()
        if (val.length == 0) {
            return
        }

        //Create events
        var event = $('<div />')
        event.css({
            'background-color': currColor,
            'border-color': currColor,
            'color': '#fff'
        }).addClass('external-event')
        event.html(val)
        $('#external-events').prepend(event)

        //Add draggable funtionality
        init_events(event)

        //Remove event from text input
        $('#new-event').val('')
    });



});
function init_calendar() {

    if (typeof ($.fn.fullCalendar) === 'undefined') { return; }
    console.log('init_calendar');

    var date = new Date(),
        d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear(),
        started,
        categoryClass;

    var calendar = $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        },
        selectable: true,
        selectHelper: true,
        select: function (start, end, allDay) {
            $('#fc_create').click();

            started = start;
            ended = end;

            $(".antosubmit").on("click", function () {
                var title = $("#title").val();
                if (end) {
                    ended = end;
                }

                categoryClass = $("#event_type").val();

                if (title) {
                    calendar.fullCalendar('renderEvent', {
                        title: title,
                        start: started,
                        end: end,
                        allDay: allDay
                    },
                        true // make the event "stick"
                    );
                }

                $('#title').val('');

                calendar.fullCalendar('unselect');

                $('.antoclose').click();

                return false;
            });
        },
        eventClick: function (calEvent, jsEvent, view) {
            $('#fc_edit').click();
            $('#title2').val(calEvent.title);

            categoryClass = $("#event_type").val();

            $(".antosubmit2").on("click", function () {
                calEvent.title = $("#title2").val();

                calendar.fullCalendar('updateEvent', calEvent);
                $('.antoclose2').click();
            });

            calendar.fullCalendar('unselect');
        },
        editable: true,

    });

};
function editarHorario() {
    $('.form-hide-horario').show();
    $.post(
        '/Asistencia/EditarHorario',
        {},
        (response) => {
            if (response !== '') {
                $('.form-hide-horario .x_content').empty();
                $('.form-hide-horario .x_content').html(response);
                $('.form-hide-horario').show();
                switcheryLoad();
                init_checkBox_styles();


            }
        });
}
var _varTablaJornadasXHorario;
function TablaHorarioXJor() {

    $.post(
        '/Asistencia/GetTablaFiltradaJornadaDiariaHoraria',
        { IntActivoFilter: 2, strfilter: '', intfiltrojer: 2},
        (response) => {
            console.log(response);
            $('#external-events-listing').empty();
            $('#external-events-listing').append('<h4>Jornadas Disponibles</h4>');
            var i = 1; var y = 1;

            response.forEach(element => {

                //$('#Jornadas').append('<div id="drag' + i + '" class="col-md-2 col-sm-2 col-xs-2" draggable="true" ondragstart ="drag(event)" style="width:100px;heigth:100px;color:snow;background-color:' + element.strColor + '" >' + element.strCodJornada + ' &nbsp;[ &nbsp;' + element.timeHoraIni + ' &nbsp;] &nbsp;</div>');
                $('#external-events-listing').append('<div id="drag' + i + '" class="col-md-2 col-sm-2 col-xs-2 drags colum' + y + '" draggable="true" Dato="' + element.intIdJornada + '" ondragstart ="drag(event)" title="' + element.strLinea1 + '\n' + element.strLinea2 + '\n' + element.strLinea4 + '\n' + element.strLinea5 + '\n' + element.strLinea6 + '\n \n' + element.strLinea7 +'" style="color:white;background-color:' + element.strColor + ';border-color:white;border-style: solid;border-width: 1px; width:60px;" >' + element.strLinea3  + '</div>');
                i++;
                y = y + 1;

                if (y == 7) {
                    y = 1;
                }

            });
            var arrastrables = 0;
            var contador = 0;


            //CODIG COMENTADO POR  UNA AFVERTENCIA PERO SI EN ALGO FALLA EL DRAGGABLE DES COMENTAR TODA LA FUNCION  DE ABAJO

            //$(document).ready(function () {

            //    arrastrables = $('.arrastrable').length;

            //    //$('.arrastrable').draggable({
            //    //    revert: "invalid"
            //    //});


            ////    $('.positivo').droppable({
            ////        accept: ".pos",
            ////        drop: function (event, ui) { //Ocurre luego de soltar
            ////            depositado();
            ////            alert('asignado' + contador);
            ////        }

            ////    });


            ////    $('.negativo').droppable({
            ////        accept: ".pos",
            ////        drop: function (event, ui) {
            ////            depositado();
            ////        }
            ////    });

            ////});


            function depositado() {
                contador++;
                if (contador == arrastrables) {

                    //Termina
                    //alert("Finalizó el ejercicio");
                }
            }


        });


}
function CamposAdicionalesHorarios() {
    $.post(
      '/Asistencia/CamposAdicionales',
        { strEntidad: 'TGHORARIO' },
        (response) => {
            console.log(response);
            $('#containerCampose').empty();
            response.forEach(element => {

                $('#containerCampose').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');
            });
        });
}
var _vartablaDia;
function CreaTabla() {

    var cboInicia = $('#TipoDia').val();
    var NumDiaas = $('#txt_Num_Dias').val();

    if (NumDiaas !== 0 && NumDiaas !== "" && cboInicia !== "" && cboInicia !== null) {

        if (typeof _vartablaDias !== 'undefined') {
            _vartablaDias.destroy();
        }

        $('#Header').empty();
        $('#cuerpo').empty();


        if (cboInicia == 83) {
            $('#Header').append('<tr><th>Domingo</th><th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th><th>Viernes</th><th>Sábado</th></tr>');
        }
        else if (cboInicia == 84) {
            $('#Header').append('<tr><th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th><th>Viernes</th><th>Sábado</th><th>Domingo</th></tr>');

        }
        else if (cboInicia == 85) {
            $('#Header').append('<tr><th>Martes</th><th>Miércoles</th><th>Jueves</th><th>Viernes</th><th>Sábado</th><th>Domingo</th><th>Lunes</th></tr>');
        }
        else if (cboInicia == 86) {
            $('#Header').append('<tr><th>Miércoles</th><th>Jueves</th><th>Viernes</th><th>Sábado</th><th>Domingo</th><th>Lunes</th><th>Martes</th></tr>');
        }
        else if (cboInicia == 87) {
            $('#Header').append('<tr><th>Jueves</th><th>Viernes</th><th>Sábado</th><th>Domingo</th><th>Lunes</th><th>Martes</th><th>Miércoles</th></tr>');
        } else if (cboInicia == 88) {
            $('#Header').append('<tr><th>Viernes</th><th>Sábado</th><th>Domingo</th><th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th></tr>');
        } else if (cboInicia == 89) {
            $('#Header').append('<tr><th>Sábado</th><th>Domingo</th><th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th><th>Viernes</th></tr>');
        }

        for (var o = 1; o <= NumDiaas; o += 7) {
            $('#cuerpo').append('<tr><td ondrop="drop(event)" ondragover="allowDrop(event)"  id="' + o + '">' + o + '<br /><div id="drag" ondrop="drop(event)" ondragover="allowDrop(event)" style="float:right;"></div>'
                + '</td><td ondrop="drop(event)" ondragover="allowDrop(event)"  id="' + (o + 1) + '">' + (o + 1)  + '<br /><div id="drag" ondrop="drop(event)" ondragover="allowDrop(event)" style="float:right;"></div>'
                + '</td><td ondrop="drop(event)" ondragover="allowDrop(event)"  id="' + (o + 2) + '">' + (o + 2)  + '<br /><div id="drag" ondrop="drop(event)" ondragover="allowDrop(event)" style="float:right;"></div>'
                + '</td><td ondrop="drop(event)" ondragover="allowDrop(event)"  id="' + (o + 3) + '">' + (o + 3)  + '<br /><div id="drag" ondrop="drop(event)" ondragover="allowDrop(event)" style="float:right;"></div>'
                + '</td><td ondrop="drop(event)" ondragover="allowDrop(event)"  id="' + (o + 4) + '">' + (o + 4)  + '<br /><div id="drag" ondrop="drop(event)" ondragover="allowDrop(event)" style="float:right;"></div>'
                + '</td><td ondrop="drop(event)" ondragover="allowDrop(event)"  id="' + (o + 5) + '">' + (o + 5)  + '<br /><div id="drag" ondrop="drop(event)" ondragover="allowDrop(event)" style="float:right;"></div>'
                + '</td><td ondrop="drop(event)" ondragover="allowDrop(event)"  id="' + (o + 6) + '">' + (o + 6)  + '<br /><div id="drag" ondrop="drop(event)" ondragover="allowDrop(event)" style="float:right;"></div></td></tr>');


            if (o > NumDiaas) {
                $('#' + o + '').html('<h1 style="color:red;width:100%; height:100%;"><strong>X</strong></h1>');
                $('#' + o + '').attr('disabbled', true);

            }
            if ((o + 1) > NumDiaas) {
                $('#' + (o + 1) + '').html('<h1 style="color:red;width:100%; height:100%;"><center><strong>X</strong></center></h1>');
                $('#' + (o + 1) + '').disabled = true;
            }
            if ((o + 2) > NumDiaas) {
                $('#' + (o + 2) + '').html('<h1 style="color:red;width:100%; height:100%;"><center><strong>X</strong></center></h1>');
                $('#' + (o + 2) + '').attr('disabled', true);
            }
            if ((o + 3) > NumDiaas) {
                $('#' + (o + 3) + '').html('<h1 style="color:red;width:100%; height:100%;"><center><strong>X</strong></center></h1>');
                $('#' + (o + 3) + '').attr('disabled', true);
            }
            if ((o + 4) > NumDiaas) {
                $('#' + (o + 4) + '').html('<h1 style="color:red;width:100%; height:100%;"><center><strong>X</strong></center></h1>');
                $('#' + (o + 4) + '').attr('disabled', true);
            }
            if ((o + 5) > NumDiaas) {
                $('#' + (o + 5) + '').html('<h1 style="color:red;width:100%; height:100%;"><center><strong>X</strong></center></h1>');
                $('#' + (o + 5) + '').attr('disabled', true);
            }
            if ((o + 6) > NumDiaas) {

                $('#' + (o + 6) + '').html('<h1 style="color:red;width:100%; height:100%"><center><strong>X</strong></center></h1>');
                $('#' + (o + 6) + '').attr('disabled', true);
            }
            if ((o + 7) > NumDiaas) {

                $('#' + (o + 7) + '').html('<strong><h1 style="color:red;width:100%; height:100%;"><center>X</h1></center></strong>');
                $('#' + (o + 7) + '').attr('disabled', true);
            }

        }





        DtatableDia();
        TablaHorarioXJor();



    }
    else {
        new PNotify({
            title: 'Dìas',
            text: 'Ingrese el Numero de Dìas',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        return;
    }

}
function DtatableDia() {


    //var detalleHorJor = new Array();

    _vartablaDias = $('#Dias').DataTable({
        lengthMenu: [[5, 3], [5, 3]],
        ordering: false,
        language: {
            lengthMenu: 'Mostrar _MENU_ Filas',
            info: '(*) Las Casillas en X no se grabarán',
            infoEmpty: 'No hay Items para mostrar',
            search: '',
            sSearchPlaceholder: '',
            zeroRecords: '',
            infoFiltered: '',
            paginate: {
                previous: 'Anterior',
                next: 'Siguiente'
            }
        },
    });

    $('#Dias_filter').html('<label class="btn btn-danger" id="btn-clear-Jornadas" title="Quitar Jornadas"><i class="fa fa-trash-o fa-2x"></i></label>');


    $('#btn-clear-Jornadas').on('click', function () {


        var DIA = $('#txt_Num_Dias').val();

        $('#txt_Num_Dias').val(10);

        CreaTabla();

        $('#txt_Num_Dias').val(DIA);

        CreaTabla();


    });


}
var habilitador = 0;
$('#btn-save-change-horario').on('click', function () {



    var tipoListDia = $('#Dias_length option:selected').val();

    var _uorg = $('#cboUndOrg option:selected').val();   //selected
    var _codHor = $('#txt_Cod_Hor').val();
    var _descHor = $('#txt_Desc_Hor').val();
    var _TipoDia = $('#TipoDia option:selected').val();
    var _NumDias = $('#txt_Num_Dias').val();

    var _camp1 = $('#strHorarioCampo1').val();
    var _camp2 = $('#strHorarioCampo2').val();
    var _camp3 = $('#strHorarioCampo3').val();
    var _camp4 = $('#strHorarioCampo4').val();
    var _camp5 = $('#strHorarioCampo5').val();
    var _activo = $('#chk-activo-Hor').is(':checked');

    if (_uorg === '' || _codHor === '' || _descHor === '' || _TipoDia == null) {
        new PNotify({
            title: 'Nuevo Horaio',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }

    var xzy = 0;


    for (var i = 0; i <= _NumDias; i++) {

        var td = $('#' + i + '').html();

        if (String(td).length > 111) {

            xzy = 1;
        }
        //else if (String(td).length < 110) {
        //    xzy = xzy -1;
        //}

    }




    if (xzy !== 1) {
        new PNotify({
            title: 'Nuevo Horaio',
            text: 'El horario debe contener minimo un Intervlo',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });

        return;
    }



    var detalleHorJor = new Array();

    class HorarioJor {
        constructor(intIdHorJorDet, intIdHorario, intIdJornada, intNumDiaIni) {
            this.intIdHorJorDet = intIdHorJorDet
            this.intIdHorario = intIdHorario
            this.intIdJornada = intIdJornada
            this.intNumDiaIni = intNumDiaIni

        }
    }



    //$('#Dias select').val('-1').trigger("change");
   // for (var i = 1; i * 5= < _NumDias ; i++){ }
    //var incremenet = 35;
    var habilitador = 0;


    if (tipoListDia == 5) {


            var rest = (_NumDias / 35);
            var LlaveHab = Math.round((rest + 0.44));
            var ClaveFor = (LlaveHab + 1);
            for (var i = 1; i <= _NumDias; i = i + 7) {

                if (habilitador == 0) {


                if (LlaveHab == 0) {

                    var valis = 1;



                }

                else if (LlaveHab !== 0) {

                    var valis = 999;
                    LlaveHab = LlaveHab - 1;
                }



                if (valis == 1) {



                    for (var i = 1; i < ClaveFor; i++) {



                        //if (incremenet <= (_NumDias+34)) {

                        $('#Dias tr').each((index, item) => {


                            // PRIMERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA



                            var ini1 = $(item).find('td').first().html();


                            if (String(ini1).length < 5) {

                                var dato1 = null;

                            } else if (String(ini1).length > 5) {

                                var dato1 = $(item).find('td').first().find('.drags').attr('Dato');

                            }

                            var dato2 = $(item).find('td').first().attr('id');

                            if (dato1 == null && dato2 == null) {


                            } else if (dato2 !== null) {

                                detalleHorJor.push(new HorarioJor(null, null, dato1, dato2));

                                if (String(ini1).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato2));

                                } else if (String(ini1).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato1, dato2));

                                }
                            }





                            // SEGUNDA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini2 = $(item).find('td').next().html();


                            if (String(ini2).length < 5) {

                                var dato3 = null;

                            } else if (String(ini2).length > 5) {

                                var dato3 = $(item).find('td').next().find('.drags').attr('Dato');

                            }



                            var dato4 = $(item).find('td').next().attr('id');

                            if (dato3 == null && dato4 == null) {

                            } else if (dato4 != null) {

                                if (String(ini2).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato4));

                                } else if (String(ini2).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato3, dato4));

                                }

                            }




                            // TERCERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini3 = $(item).find('td').next().next().html();


                            if (String(ini3).length < 5) {

                                var dato5 = null;

                            } else if (String(ini3).length > 5) {

                                var dato5 = $(item).find('td').next().next().find('.drags').attr('Dato');


                            }


                            var dato6 = $(item).find('td').next().next().attr('id');


                            if (dato5 == null && dato6 == null) {

                            } else if (dato6 !== null) {


                                if (String(ini3).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato6));


                                } else if (String(ini3).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato5, dato6));


                                }


                            }









                            // CUARTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini4 = $(item).find('td').next().next().next().html();

                            if (String(ini4).length < 5) {

                                var dato7 = null;

                            } else if (String(ini4).length > 5) {

                                var dato7 = $(item).find('td').next().next().next().find('.drags').attr('Dato');

                            }
                            var dato8 = $(item).find('td').next().next().next().attr('id');



                            if (dato7 == null && dato8 == null) {

                            } else if (dato8 !== null) {


                                if (String(ini4).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato8));

                                } else if (String(ini4).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato7, dato8));

                                }
                            }





                            // QUINTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini5 = $(item).find('td').next().next().next().next().html();

                            if (String(ini5).length < 5) {

                                var dato9 = null;

                            } else if (String(ini5).length > 5) {

                                var dato9 = $(item).find('td').next().next().next().next().find('.drags').attr('Dato');

                            }
                            var dato10 = $(item).find('td').next().next().next().next().attr('id');




                            if (dato9 == null && dato10 == null) {

                            } else if (dato10 !== null) {


                                if (String(ini5).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato10));


                                } else if (String(ini5).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato9, dato10));


                                }

                            }




                            // SEXTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini6 = $(item).find('td').next().next().next().next().next().html();

                            if (String(ini6).length < 5) {

                                var dato11 = null;

                            } else if (String(ini6).length > 5) {

                                var dato11 = $(item).find('td').next().next().next().next().next().find('.drags').attr('Dato');

                            }

                            var dato12 = $(item).find('td').next().next().next().next().next().attr('id');


                            if (dato11 == null && dato12 == null) {

                            } else if (dato12 !== null) {


                                if (String(ini6).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato12));

                                } else if (String(ini6).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato11, dato12));

                                }
                            }





                            // SEPTIMA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini7 = $(item).find('td').next().next().next().next().next().next().html();


                            if (String(ini7).length < 5) {

                                var dato13 = null;

                            } else if (String(ini7).length > 5) {

                                var dato13 = $(item).find('td').next().next().next().next().next().next().find('.drags').attr('Dato');

                            }

                            var dato14 = $(item).find('td').next().next().next().next().next().next().attr('id');



                            if (dato13 == null && dato14 == null) {

                            } else if (dato14 !== null) {


                                if (String(ini7).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato14));


                                } else if (String(ini7).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato13, dato14));


                                }


                            }



                        });


                        $('#Dias_next').trigger("click");

                        //incremenet = incremenet + 35;


                        //}

                    }
                    habilitador = 1;
                    continue;

                } else if (valis !== 1) {
                    $('#Dias_previous').trigger("click");
                }

                } else if (habilitador !== 0) {

                }
            }


    }
    var habilitador = 0;

    if (tipoListDia == 3) {

        var rest = (_NumDias / 21);
        var LlaveHab = Math.round((rest + 0.44));
        var ClaveFor = (LlaveHab + 1);
        for (var i = 1; i <= _NumDias; i = i + 7) {

            if (habilitador == 0) {


                if (LlaveHab == 0) {

                    var valis = 1;



                }

                else if (LlaveHab !== 0) {

                    var valis = 999;
                    LlaveHab = LlaveHab - 1;
                }



                if (valis == 1) {



                    for (var i = 1; i < ClaveFor; i++) {



                        //if (incremenet <= (_NumDias+34)) {

                        $('#Dias tr').each((index, item) => {


                            // PRIMERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA



                            var ini1 = $(item).find('td').first().html();


                            if (String(ini1).length < 5) {

                                var dato1 = null;

                            } else if (String(ini1).length > 5) {

                                var dato1 = $(item).find('td').first().find('.drags').attr('Dato');

                            }

                            var dato2 = $(item).find('td').first().attr('id');

                            if (dato1 == null && dato2 == null) {


                            } else if (dato2 !== null) {

                                detalleHorJor.push(new HorarioJor(null, null, dato1, dato2));

                                if (String(ini1).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato2));

                                } else if (String(ini1).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato1, dato2));

                                }
                            }





                            // SEGUNDA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini2 = $(item).find('td').next().html();


                            if (String(ini2).length < 5) {

                                var dato3 = null;

                            } else if (String(ini2).length > 5) {

                                var dato3 = $(item).find('td').next().find('.drags').attr('Dato');

                            }



                            var dato4 = $(item).find('td').next().attr('id');

                            if (dato3 == null && dato4 == null) {

                            } else if (dato4 != null) {

                                if (String(ini2).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato4));

                                } else if (String(ini2).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato3, dato4));

                                }

                            }




                            // TERCERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini3 = $(item).find('td').next().next().html();


                            if (String(ini3).length < 5) {

                                var dato5 = null;

                            } else if (String(ini3).length > 5) {

                                var dato5 = $(item).find('td').next().next().find('.drags').attr('Dato');


                            }


                            var dato6 = $(item).find('td').next().next().attr('id');


                            if (dato5 == null && dato6 == null) {

                            } else if (dato6 !== null) {


                                if (String(ini3).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato6));


                                } else if (String(ini3).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato5, dato6));


                                }


                            }









                            // CUARTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini4 = $(item).find('td').next().next().next().html();

                            if (String(ini4).length < 5) {

                                var dato7 = null;

                            } else if (String(ini4).length > 5) {

                                var dato7 = $(item).find('td').next().next().next().find('.drags').attr('Dato');

                            }
                            var dato8 = $(item).find('td').next().next().next().attr('id');



                            if (dato7 == null && dato8 == null) {

                            } else if (dato8 !== null) {


                                if (String(ini4).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato8));

                                } else if (String(ini4).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato7, dato8));

                                }
                            }





                            // QUINTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini5 = $(item).find('td').next().next().next().next().html();

                            if (String(ini5).length < 5) {

                                var dato9 = null;

                            } else if (String(ini5).length > 5) {

                                var dato9 = $(item).find('td').next().next().next().next().find('.drags').attr('Dato');

                            }
                            var dato10 = $(item).find('td').next().next().next().next().attr('id');




                            if (dato9 == null && dato10 == null) {

                            } else if (dato10 !== null) {


                                if (String(ini5).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato10));


                                } else if (String(ini5).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato9, dato10));


                                }

                            }




                            // SEXTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini6 = $(item).find('td').next().next().next().next().next().html();

                            if (String(ini6).length < 5) {

                                var dato11 = null;

                            } else if (String(ini6).length > 5) {

                                var dato11 = $(item).find('td').next().next().next().next().next().find('.drags').attr('Dato');

                            }

                            var dato12 = $(item).find('td').next().next().next().next().next().attr('id');


                            if (dato11 == null && dato12 == null) {

                            } else if (dato12 !== null) {


                                if (String(ini6).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato12));

                                } else if (String(ini6).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato11, dato12));

                                }
                            }





                            // SEPTIMA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini7 = $(item).find('td').next().next().next().next().next().next().html();


                            if (String(ini7).length < 5) {

                                var dato13 = null;

                            } else if (String(ini7).length > 5) {

                                var dato13 = $(item).find('td').next().next().next().next().next().next().find('.drags').attr('Dato');

                            }

                            var dato14 = $(item).find('td').next().next().next().next().next().next().attr('id');



                            if (dato13 == null && dato14 == null) {

                            } else if (dato14 !== null) {


                                if (String(ini7).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato14));


                                } else if (String(ini7).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato13, dato14));


                                }


                            }



                        });


                        $('#Dias_next').trigger("click");

                        //incremenet = incremenet + 35;


                        //}

                    }
                    habilitador = 1;
                    continue;

                } else if (valis !== 1) {
                    $('#Dias_previous').trigger("click");
                }

            } else if (habilitador !== 0) {

            }
        }

    }
    var habilitador = 0;

    if (tipoListDia == 1) {

        var rest = (_NumDias / 7);
        var LlaveHab = Math.round((rest + 0.44));

        var ClaveFor2 = (LlaveHab * LlaveHab);
        var ClaveFor3 = (LlaveHab +1);
        for (var i = 1; i <= ClaveFor2 ; i = i + 7) {

            if (habilitador == 0) {

                if (LlaveHab == 0) {

                    var valis = 1;



                }

                else if (LlaveHab !== 0) {

                    var valis = 999;
                    LlaveHab = LlaveHab - 1;
                }



                if (valis == 1) {



                    for (var i = 1; i < ClaveFor3; i++) {



                        //if (incremenet <= (_NumDias+34)) {


                        $('#Dias tr').each((index, item) => {


                            // PRIMERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA



                            var ini1 = $(item).find('td').first().html();


                            if (String(ini1).length < 5) {

                                var dato1 = null;

                            } else if (String(ini1).length > 5) {

                                var dato1 = $(item).find('td').first().find('.drags').attr('Dato');

                            }

                            var dato2 = $(item).find('td').first().attr('id');

                            if (dato1 == null && dato2 == null) {


                            } else if (dato2 !== null) {

                                detalleHorJor.push(new HorarioJor(null, null, dato1, dato2));

                                if (String(ini1).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato2));

                                } else if (String(ini1).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato1, dato2));

                                }
                            }





                            // SEGUNDA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini2 = $(item).find('td').next().html();


                            if (String(ini2).length < 5) {

                                var dato3 = null;

                            } else if (String(ini2).length > 5) {

                                var dato3 = $(item).find('td').next().find('.drags').attr('Dato');

                            }



                            var dato4 = $(item).find('td').next().attr('id');

                            if (dato3 == null && dato4 == null) {

                            } else if (dato4 != null) {

                                if (String(ini2).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato4));

                                } else if (String(ini2).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato3, dato4));

                                }

                            }




                            // TERCERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini3 = $(item).find('td').next().next().html();


                            if (String(ini3).length < 5) {

                                var dato5 = null;

                            } else if (String(ini3).length > 5) {

                                var dato5 = $(item).find('td').next().next().find('.drags').attr('Dato');


                            }


                            var dato6 = $(item).find('td').next().next().attr('id');


                            if (dato5 == null && dato6 == null) {

                            } else if (dato6 !== null) {


                                if (String(ini3).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato6));


                                } else if (String(ini3).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato5, dato6));


                                }


                            }









                            // CUARTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini4 = $(item).find('td').next().next().next().html();

                            if (String(ini4).length < 5) {

                                var dato7 = null;

                            } else if (String(ini4).length > 5) {

                                var dato7 = $(item).find('td').next().next().next().find('.drags').attr('Dato');

                            }
                            var dato8 = $(item).find('td').next().next().next().attr('id');



                            if (dato7 == null && dato8 == null) {

                            } else if (dato8 !== null) {


                                if (String(ini4).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato8));

                                } else if (String(ini4).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato7, dato8));

                                }
                            }





                            // QUINTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini5 = $(item).find('td').next().next().next().next().html();

                            if (String(ini5).length < 5) {

                                var dato9 = null;

                            } else if (String(ini5).length > 5) {

                                var dato9 = $(item).find('td').next().next().next().next().find('.drags').attr('Dato');

                            }
                            var dato10 = $(item).find('td').next().next().next().next().attr('id');




                            if (dato9 == null && dato10 == null) {

                            } else if (dato10 !== null) {


                                if (String(ini5).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato10));


                                } else if (String(ini5).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato9, dato10));


                                }

                            }




                            // SEXTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini6 = $(item).find('td').next().next().next().next().next().html();

                            if (String(ini6).length < 5) {

                                var dato11 = null;

                            } else if (String(ini6).length > 5) {

                                var dato11 = $(item).find('td').next().next().next().next().next().find('.drags').attr('Dato');

                            }

                            var dato12 = $(item).find('td').next().next().next().next().next().attr('id');


                            if (dato11 == null && dato12 == null) {

                            } else if (dato12 !== null) {


                                if (String(ini6).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato12));

                                } else if (String(ini6).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato11, dato12));

                                }
                            }





                            // SEPTIMA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini7 = $(item).find('td').next().next().next().next().next().next().html();


                            if (String(ini7).length < 5) {

                                var dato13 = null;

                            } else if (String(ini7).length > 5) {

                                var dato13 = $(item).find('td').next().next().next().next().next().next().find('.drags').attr('Dato');

                            }

                            var dato14 = $(item).find('td').next().next().next().next().next().next().attr('id');



                            if (dato13 == null && dato14 == null) {

                            } else if (dato14 !== null) {


                                if (String(ini7).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, null, dato14));


                                } else if (String(ini7).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, null, dato13, dato14));


                                }


                            }



                        });


                        $('#Dias_next').trigger("click");

                        //incremenet = incremenet + 35;


                        //}

                    }

                    habilitador = 1;
                    continue;

                }
                else if (valis !== 1) {
                    $('#Dias_previous').trigger("click");
                }

            } else if (habilitador !== 0) {

            }
        }
    }







    //detalleHorJor.length = _NumDias;

    //alert(detalleHorJor.length + '2');

    //var distint = (value, index,self) =>
    //{
    //    return self.indexOf(value) === index;
    //}

    //detalleHorJor = detalleHorJor.filter(distint);


    if (_uorg === '') {
        _uorg = null;
    }


    var Horario = {

        strCoHorario: _codHor,
        strDeHorario: _descHor,
        intIdUniOrg: _uorg,
        intTotalDias: _NumDias,
        intNumDiaIni: _TipoDia,
        strHorarioCampo1: _camp1,
        strHorarioCampo2: _camp2,
        strHorarioCampo3: _camp3,
        strHorarioCampo4: _camp4,
        strHorarioCampo5: _camp5,
        bitFlActivo: _activo,

    }


    $.post(
        '/Asistencia/RegistrarNuevoHorario',
        { ObjHorario: Horario, lISTAHorJor: detalleHorJor},
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    new PNotify({
                        title: 'Nuevo Horario',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                    TablaHorario();
                    $('.form-hide-horario').hide();
                } else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Horario';
                        var campo = 'txt_Cod_Hor';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {
                            var nomMantemiento = 'Horario';
                            var campo = 'txt_Desc_Hor';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;

                        } else {
                            if (response.type === 'alert') {
                                $('#notifry_error').html('');
                                $('#notifry_errordes').html('');

                                new PNotify({
                                    title: 'Registro de Horario',
                                    text: response.message,
                                    type: response.type,
                                    delay: 3000,
                                    styling: 'bootstrap3',
                                    addclass: 'dark'
                                });
                                return;
                            } else {


                            }
                        }


                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });


});
$('#btn-cancel-horario').on('click', function () {
    $('.form-hide-horario').hide();
});
$('#btn-update-horario').on('click', function () {
    var tipoListDia = $('#Dias_length option:selected').val();
    var _uorg = $('#cboUndOrg option:selected').val();   //selected
    var _codHor = $('#txt_Cod_Hor').val();
    var _descHor = $('#txt_Desc_Hor').val();
    var _TipoDia = $('#TipoDia option:selected').val();
    var _NumDias = $('#txt_Num_Dias').val();

    var _camp1 = $('#strHorarioCampo1').val();
    var _camp2 = $('#strHorarioCampo2').val();
    var _camp3 = $('#strHorarioCampo3').val();
    var _camp4 = $('#strHorarioCampo4').val();
    var _camp5 = $('#strHorarioCampo5').val();
    var _activo = $('#chk-activo-Hor').is(':checked');

    var id_hor = $('#IdHor').val();

    if (_uorg === '' || _codHor === '' || _descHor === '' || _TipoDia == null) {
        new PNotify({
            title: 'Nuevo Horaio',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }


    var xzy = 0;


    for (var i = 0; i <= _NumDias; i++) {

        var td = $('#' + i + '').html();

        if (String(td).length > 111) {

            xzy = 1;
        }
        //else if (String(td).length < 110) {
        //    xzy = xzy -1;
        //}

    }




    if (xzy !== 1) {
        new PNotify({
            title: 'Nuevo Horaio',
            text: 'El horario debe contener minimo un Intervlo',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });

        return;
    }


    var detalleHorJor = new Array();

    class HorarioJor {
        constructor(intIdHorJorDet, intIdHorario, intIdJornada, intNumDiaIni) {
            this.intIdHorJorDet = intIdHorJorDet
            this.intIdHorario = intIdHorario
            this.intIdJornada = intIdJornada
            this.intNumDiaIni = intNumDiaIni

        }
    }


    var habilitador = 0;


    if (tipoListDia == 5) {


        var rest = (_NumDias / 35);
        var LlaveHab = Math.round((rest + 0.44));
        var ClaveFor = (LlaveHab + 1);
        for (var i = 1; i <= _NumDias; i = i + 7) {

            if (habilitador == 0) {


                if (LlaveHab == 0) {

                    var valis = 1;



                }

                else if (LlaveHab !== 0) {

                    var valis = 999;
                    LlaveHab = LlaveHab - 1;
                }



                if (valis == 1) {



                    for (var i = 1; i < ClaveFor; i++) {



                        //if (incremenet <= (_NumDias+34)) {

                        $('#Dias tr').each((index, item) => {


                            // PRIMERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA



                            var ini1 = $(item).find('td').first().html();


                            if (String(ini1).length < 5) {

                                var dato1 = null;

                            } else if (String(ini1).length > 5) {

                                var dato1 = $(item).find('td').first().find('.drags').attr('Dato');

                            }

                            var dato2 = $(item).find('td').first().attr('id');

                            if (dato1 == null && dato2 == null) {


                            } else if (dato2 !== null) {

                                //detalleHorJor.push(new HorarioJor(null, id_hor, dato1, dato2));

                                if (String(ini1).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato2));

                                } else if (String(ini1).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato1, dato2));

                                }
                            }





                            // SEGUNDA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini2 = $(item).find('td').next().html();


                            if (String(ini2).length < 5) {

                                var dato3 = null;

                            } else if (String(ini2).length > 5) {

                                var dato3 = $(item).find('td').next().find('.drags').attr('Dato');

                            }



                            var dato4 = $(item).find('td').next().attr('id');

                            if (dato3 == null && dato4 == null) {

                            } else if (dato4 != null) {

                                if (String(ini2).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato4));

                                } else if (String(ini2).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato3, dato4));

                                }

                            }




                            // TERCERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini3 = $(item).find('td').next().next().html();


                            if (String(ini3).length < 5) {

                                var dato5 = null;

                            } else if (String(ini3).length > 5) {

                                var dato5 = $(item).find('td').next().next().find('.drags').attr('Dato');


                            }


                            var dato6 = $(item).find('td').next().next().attr('id');


                            if (dato5 == null && dato6 == null) {

                            } else if (dato6 !== null) {


                                if (String(ini3).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato6));


                                } else if (String(ini3).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato5, dato6));


                                }


                            }









                            // CUARTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini4 = $(item).find('td').next().next().next().html();

                            if (String(ini4).length < 5) {

                                var dato7 = null;

                            } else if (String(ini4).length > 5) {

                                var dato7 = $(item).find('td').next().next().next().find('.drags').attr('Dato');

                            }
                            var dato8 = $(item).find('td').next().next().next().attr('id');



                            if (dato7 == null && dato8 == null) {

                            } else if (dato8 !== null) {


                                if (String(ini4).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato8));

                                } else if (String(ini4).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato7, dato8));

                                }
                            }





                            // QUINTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini5 = $(item).find('td').next().next().next().next().html();

                            if (String(ini5).length < 5) {

                                var dato9 = null;

                            } else if (String(ini5).length > 5) {

                                var dato9 = $(item).find('td').next().next().next().next().find('.drags').attr('Dato');

                            }
                            var dato10 = $(item).find('td').next().next().next().next().attr('id');




                            if (dato9 == null && dato10 == null) {

                            } else if (dato10 !== null) {


                                if (String(ini5).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato10));


                                } else if (String(ini5).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato9, dato10));


                                }

                            }




                            // SEXTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini6 = $(item).find('td').next().next().next().next().next().html();

                            if (String(ini6).length < 5) {

                                var dato11 = null;

                            } else if (String(ini6).length > 5) {

                                var dato11 = $(item).find('td').next().next().next().next().next().find('.drags').attr('Dato');

                            }

                            var dato12 = $(item).find('td').next().next().next().next().next().attr('id');


                            if (dato11 == null && dato12 == null) {

                            } else if (dato12 !== null) {


                                if (String(ini6).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato12));

                                } else if (String(ini6).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato11, dato12));

                                }
                            }





                            // SEPTIMA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini7 = $(item).find('td').next().next().next().next().next().next().html();


                            if (String(ini7).length < 5) {

                                var dato13 = null;

                            } else if (String(ini7).length > 5) {

                                var dato13 = $(item).find('td').next().next().next().next().next().next().find('.drags').attr('Dato');

                            }

                            var dato14 = $(item).find('td').next().next().next().next().next().next().attr('id');



                            if (dato13 == null && dato14 == null) {

                            } else if (dato14 !== null) {


                                if (String(ini7).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato14));


                                } else if (String(ini7).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato13, dato14));


                                }


                            }



                        });


                        $('#Dias_next').trigger("click");

                        //incremenet = incremenet + 35;


                        //}

                    }
                    habilitador = 1;
                    continue;

                } else if (valis !== 1) {
                    $('#Dias_previous').trigger("click");
                }

            } else if (habilitador !== 0) {

            }
        }


    }
    var habilitador = 0;

    if (tipoListDia == 3) {

        var rest = (_NumDias / 21);
        var LlaveHab = Math.round((rest + 0.44));
        var ClaveFor = (LlaveHab + 1);
        for (var i = 1; i <= _NumDias; i = i + 7) {

            if (habilitador == 0) {


                if (LlaveHab == 0) {

                    var valis = 1;



                }

                else if (LlaveHab !== 0) {

                    var valis = 999;
                    LlaveHab = LlaveHab - 1;
                }



                if (valis == 1) {



                    for (var i = 1; i < ClaveFor; i++) {



                        //if (incremenet <= (_NumDias+34)) {

                        $('#Dias tr').each((index, item) => {


                            // PRIMERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA



                            var ini1 = $(item).find('td').first().html();


                            if (String(ini1).length < 5) {

                                var dato1 = null;

                            } else if (String(ini1).length > 5) {

                                var dato1 = $(item).find('td').first().find('.drags').attr('Dato');

                            }

                            var dato2 = $(item).find('td').first().attr('id');

                            if (dato1 == null && dato2 == null) {


                            } else if (dato2 !== null) {

                                //detalleHorJor.push(new HorarioJor(null, null, dato1, dato2));

                                if (String(ini1).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato2));

                                } else if (String(ini1).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato1, dato2));

                                }
                            }





                            // SEGUNDA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini2 = $(item).find('td').next().html();


                            if (String(ini2).length < 5) {

                                var dato3 = null;

                            } else if (String(ini2).length > 5) {

                                var dato3 = $(item).find('td').next().find('.drags').attr('Dato');

                            }



                            var dato4 = $(item).find('td').next().attr('id');

                            if (dato3 == null && dato4 == null) {

                            } else if (dato4 != null) {

                                if (String(ini2).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato4));

                                } else if (String(ini2).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato3, dato4));

                                }

                            }




                            // TERCERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini3 = $(item).find('td').next().next().html();


                            if (String(ini3).length < 5) {

                                var dato5 = null;

                            } else if (String(ini3).length > 5) {

                                var dato5 = $(item).find('td').next().next().find('.drags').attr('Dato');


                            }


                            var dato6 = $(item).find('td').next().next().attr('id');


                            if (dato5 == null && dato6 == null) {

                            } else if (dato6 !== null) {


                                if (String(ini3).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato6));


                                } else if (String(ini3).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato5, dato6));


                                }


                            }









                            // CUARTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini4 = $(item).find('td').next().next().next().html();

                            if (String(ini4).length < 5) {

                                var dato7 = null;

                            } else if (String(ini4).length > 5) {

                                var dato7 = $(item).find('td').next().next().next().find('.drags').attr('Dato');

                            }
                            var dato8 = $(item).find('td').next().next().next().attr('id');



                            if (dato7 == null && dato8 == null) {

                            } else if (dato8 !== null) {


                                if (String(ini4).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato8));

                                } else if (String(ini4).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato7, dato8));

                                }
                            }





                            // QUINTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini5 = $(item).find('td').next().next().next().next().html();

                            if (String(ini5).length < 5) {

                                var dato9 = null;

                            } else if (String(ini5).length > 5) {

                                var dato9 = $(item).find('td').next().next().next().next().find('.drags').attr('Dato');

                            }
                            var dato10 = $(item).find('td').next().next().next().next().attr('id');




                            if (dato9 == null && dato10 == null) {

                            } else if (dato10 !== null) {


                                if (String(ini5).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato10));


                                } else if (String(ini5).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato9, dato10));


                                }

                            }




                            // SEXTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini6 = $(item).find('td').next().next().next().next().next().html();

                            if (String(ini6).length < 5) {

                                var dato11 = null;

                            } else if (String(ini6).length > 5) {

                                var dato11 = $(item).find('td').next().next().next().next().next().find('.drags').attr('Dato');

                            }

                            var dato12 = $(item).find('td').next().next().next().next().next().attr('id');


                            if (dato11 == null && dato12 == null) {

                            } else if (dato12 !== null) {


                                if (String(ini6).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato12));

                                } else if (String(ini6).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato11, dato12));

                                }
                            }





                            // SEPTIMA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini7 = $(item).find('td').next().next().next().next().next().next().html();


                            if (String(ini7).length < 5) {

                                var dato13 = null;

                            } else if (String(ini7).length > 5) {

                                var dato13 = $(item).find('td').next().next().next().next().next().next().find('.drags').attr('Dato');

                            }

                            var dato14 = $(item).find('td').next().next().next().next().next().next().attr('id');



                            if (dato13 == null && dato14 == null) {

                            } else if (dato14 !== null) {


                                if (String(ini7).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato14));


                                } else if (String(ini7).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato13, dato14));


                                }


                            }



                        });


                        $('#Dias_next').trigger("click");

                        //incremenet = incremenet + 35;


                        //}

                    }
                    habilitador = 1;
                    continue;

                } else if (valis !== 1) {
                    $('#Dias_previous').trigger("click");
                }

            } else if (habilitador !== 0) {

            }
        }

    }
    var habilitador = 0;

    if (tipoListDia == 1) {

        var rest = (_NumDias / 7);
        var LlaveHab = Math.round((rest + 0.44));

        var ClaveFor2 = (LlaveHab * LlaveHab);
        var ClaveFor3 = (LlaveHab + 1);
        for (var i = 1; i <= ClaveFor2; i = i + 7) {

            if (habilitador == 0) {

                if (LlaveHab == 0) {

                    var valis = 1;



                }

                else if (LlaveHab !== 0) {

                    var valis = 999;
                    LlaveHab = LlaveHab - 1;
                }



                if (valis == 1) {



                    for (var i = 1; i < ClaveFor3; i++) {



                        //if (incremenet <= (_NumDias+34)) {


                        $('#Dias tr').each((index, item) => {


                            // PRIMERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA



                            var ini1 = $(item).find('td').first().html();


                            if (String(ini1).length < 5) {

                                var dato1 = null;

                            } else if (String(ini1).length > 5) {

                                var dato1 = $(item).find('td').first().find('.drags').attr('Dato');

                            }

                            var dato2 = $(item).find('td').first().attr('id');

                            if (dato1 == null && dato2 == null) {


                            } else if (dato2 !== null) {

                                //detalleHorJor.push(new HorarioJor(null, null, dato1, dato2));

                                if (String(ini1).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato2));

                                } else if (String(ini1).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato1, dato2));

                                }
                            }





                            // SEGUNDA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini2 = $(item).find('td').next().html();


                            if (String(ini2).length < 5) {

                                var dato3 = null;

                            } else if (String(ini2).length > 5) {

                                var dato3 = $(item).find('td').next().find('.drags').attr('Dato');

                            }



                            var dato4 = $(item).find('td').next().attr('id');

                            if (dato3 == null && dato4 == null) {

                            } else if (dato4 != null) {

                                if (String(ini2).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato4));

                                } else if (String(ini2).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato3, dato4));

                                }

                            }




                            // TERCERA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini3 = $(item).find('td').next().next().html();


                            if (String(ini3).length < 5) {

                                var dato5 = null;

                            } else if (String(ini3).length > 5) {

                                var dato5 = $(item).find('td').next().next().find('.drags').attr('Dato');


                            }


                            var dato6 = $(item).find('td').next().next().attr('id');


                            if (dato5 == null && dato6 == null) {

                            } else if (dato6 !== null) {


                                if (String(ini3).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato6));


                                } else if (String(ini3).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato5, dato6));


                                }


                            }









                            // CUARTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini4 = $(item).find('td').next().next().next().html();

                            if (String(ini4).length < 5) {

                                var dato7 = null;

                            } else if (String(ini4).length > 5) {

                                var dato7 = $(item).find('td').next().next().next().find('.drags').attr('Dato');

                            }
                            var dato8 = $(item).find('td').next().next().next().attr('id');



                            if (dato7 == null && dato8 == null) {

                            } else if (dato8 !== null) {


                                if (String(ini4).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato8));

                                } else if (String(ini4).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato7, dato8));

                                }
                            }





                            // QUINTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini5 = $(item).find('td').next().next().next().next().html();

                            if (String(ini5).length < 5) {

                                var dato9 = null;

                            } else if (String(ini5).length > 5) {

                                var dato9 = $(item).find('td').next().next().next().next().find('.drags').attr('Dato');

                            }
                            var dato10 = $(item).find('td').next().next().next().next().attr('id');




                            if (dato9 == null && dato10 == null) {

                            } else if (dato10 !== null) {


                                if (String(ini5).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato10));


                                } else if (String(ini5).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato9, dato10));


                                }

                            }




                            // SEXTA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini6 = $(item).find('td').next().next().next().next().next().html();

                            if (String(ini6).length < 5) {

                                var dato11 = null;

                            } else if (String(ini6).length > 5) {

                                var dato11 = $(item).find('td').next().next().next().next().next().find('.drags').attr('Dato');

                            }

                            var dato12 = $(item).find('td').next().next().next().next().next().attr('id');


                            if (dato11 == null && dato12 == null) {

                            } else if (dato12 !== null) {


                                if (String(ini6).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato12));

                                } else if (String(ini6).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato11, dato12));

                                }
                            }





                            // SEPTIMA COLUMNA DE LA PRIMERA FILA VALOR Y DIA

                            var ini7 = $(item).find('td').next().next().next().next().next().next().html();


                            if (String(ini7).length < 5) {

                                var dato13 = null;

                            } else if (String(ini7).length > 5) {

                                var dato13 = $(item).find('td').next().next().next().next().next().next().find('.drags').attr('Dato');

                            }

                            var dato14 = $(item).find('td').next().next().next().next().next().next().attr('id');



                            if (dato13 == null && dato14 == null) {

                            } else if (dato14 !== null) {


                                if (String(ini7).length < 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, null, dato14));


                                } else if (String(ini7).length > 111) {


                                    detalleHorJor.push(new HorarioJor(null, id_hor, dato13, dato14));


                                }


                            }



                        });


                        $('#Dias_next').trigger("click");

                        //incremenet = incremenet + 35;


                        //}

                    }

                    habilitador = 1;

                    continue;

                }
                else if (valis !== 1) {
                    $('#Dias_previous').trigger("click");
                }

            } else if (habilitador !== 0) {

            }
        }


    }



    if (_uorg === '') {
        _uorg = null;
    }



         var Horario = {

        strCoHorario: _codHor,
        strDeHorario: _descHor,
        intIdUniOrg: _uorg,
        intTotalDias: _NumDias,
        intNumDiaIni: _TipoDia,
        strHorarioCampo1: _camp1,
        strHorarioCampo2: _camp2,
        strHorarioCampo3: _camp3,
        strHorarioCampo4: _camp4,
        strHorarioCampo5: _camp5,
        bitFlActivo: _activo,
        intIdHorario: id_hor,

    }
    $.post(
        '/Asistencia/ActualizarHorario',
        { ObjHorario: Horario, lISTAHorJor : detalleHorJor },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    new PNotify({
                        title: 'Actualización de Horario',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                    TablaHorario();
                    $('.form-hide-horario').hide();
                } else {
                    $('#notifry_error').html('');
                    $('#notifry_errordes').html('');

                    if (response.type === 'info') {

                        var nomMantemiento = 'Horario';
                        var campo = 'txt_Cod_Hor';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {
                            var nomMantemiento = 'Horario';
                            var campo = 'txt_Desc_Hor';
                            var msj = response.message;
                            var response = response.type;
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            $('#notifry_error').html('');
                            $('#notifry_errordes').html('');

                            return;
                        } else {
                            if (response.type === 'alert') {
                                $('#notifry_error').html('');
                                $('#notifry_errordes').html('');

                                new PNotify({
                                    title: 'Actualización de Horario',
                                    text: response.message,
                                    type: response.type,
                                    delay: 3000,
                                    styling: 'bootstrap3',
                                    addclass: 'dark'
                                });


                                return;
                            } else {


                            }
                        }


                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

});
$('#RemoveJornada').on('click', function () {

    alert('eliminar');

});

/**------------------------------------------------ */
/**3. Marcador Functions */
/**-------------------------------------------- */

$('#filActi').on('change', function () {
      TablaMarcador();
});
$('#filtro').keyup(function () {
    TablaMarcador();
});
$('#btn-new-Marcador').on('click', function () {
    $('#btn-update-marcador').hide();
    $('#btn-save-change-marcador').show();

    $('.form-hide-Marcador').show();
    $.post(
        '/Organizacion/NuevoMarcador',
        {},
        (response) => {

            if (response !== '') {
                $('.form-hide-Marcador .x_content').empty();
                $('.form-hide-Marcador .x_content').html(response);
                $('.form-hide-Marcador').show();
                BuscarUnidades();
                switcheryLoad();//checked verde


            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
});
$('#btn-cancel-marcador').on('click', function () {
    $('.form-hide-Marcador').hide();
});
var _varTablaMarcador;
function TablaMarcador() {

    var filtrosActivo = $('#filActi').val();
    var strfiltro = $('#filtro').val();

    $.post(
        '/Organizacion/GetTablaMarcador',
        { IntActivoFilter: filtrosActivo, strfilter: strfiltro },
        (response) => {

            console.log(_varTablaMarcador);
            if (typeof _varTablaMarcador !== 'undefined') {
                _varTablaMarcador.destroy();
            }

            console.log('en TablaMarcador');
            console.log(response);

            _varTablaMarcador = $('#tablaMarcador').DataTable({
                data: response,
                columns: [
                    { data: 'intNumMarcador' },
                    { data: 'strDesMarcador' },
                    { data: 'NumIPNumPort' },
                    { data: 'strNomJerOrg' },
                    { data: 'FlActivo.strEstadoActivo' },
                    { data: null },
                    { data: 'strNumIP' },
                    { data: 'intNumPuerto' },
                    { data: 'intIdMarcador' },
                    { data: 'intTipoMarcad' },
                    { data: 'intTipoFunc' },
                    { data: 'strMarcadCampo1' },
                    { data: 'strMarcadCampo2' },
                    { data: 'strMarcadCampo3' },
                    { data: 'strMarcadCampo4' },
                    { data: 'strMarcadCampo5' },
                    { data: 'intIdUniOrg' },
                    { data: 'bitTipoComu' },
                ],
                lengthMenu: [10, 25, 50],
                responsive: true,
                order: [[1, 'desc'], [2, 'desc']],
                language: _datatableLanguaje,
                columnDefs: [//ocultar y definir columnas
                    {
                        targets: [6],//IntIdCCosto
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [7],//intIdTipFisc
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [8],//bitFlActivo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [9],//strPlaniCampo1
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [10],//strCargoCampo3
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [11],//strCargoCampo4
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [12],//strCargoCampo5
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [13],//intIdUniOrg
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [14],//intIdUniOrg
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [15],//intIdUniOrg
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [16],//intIdUniOrg
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [17],//intIdUniOrg
                        visible: false,
                        searchable: false
                    },

                    {
                        targets: [5],
                        data: null,
                        defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                            '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
                    }
                ],
                dom: 'lBfrtip',
            });




            $('#tablaMarcador tbody').on('click', 'tr button.btn-edit', function () {
                var data = _varTablaMarcador.row($(this).parents('tr')).data();
                if (data == null) {
                    data = null;
                    var data = _varTablaMarcador.row($(this).parents('li')).data();
                    cardarDatosMarcador(data);
                } else {
                    var data = _varTablaMarcador.row($(this).parents('tr')).data();
                    cardarDatosMarcador(data);
                }
            });

            $('#tablaMarcador tbody').on('click', 'tr button.btn-delete', function () {

                var data = _varTablaMarcador.row($(this).parents('tr')).data();

                if (data == null) {
                    data = null;

                    var data = _varTablaMarcador.row($(this).parents('li')).data();
                    intentEliminarMarcador(data['intIdMarcador'], data['strDesMarcador']);

                } else {

                    var data = _varTablaMarcador.row($(this).parents('tr')).data();
                    intentEliminarMarcador(data['intIdMarcador'], data['strDesMarcador']);

                }


            });




        });
}
function intentEliminarMarcador(idMarcador, strNomMarcador) {

    swal({
        title: "Eliminar Marcador",
        text: "¿Está seguro de eliminar el Marcador   ''<strong>" + strNomMarcador + "</strong>''   ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaMarcador(idMarcador);
        } else {
            swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}
function yesEliminaMarcador(idMarcador) {

    $.post(
        '/Organizacion/EliminarMarcador',
        { intIdMarcador: idMarcador },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    TablaMarcador('', '');
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
function cardarDatosMarcador(data) {

    $('#btn-update-marcador').show();
    $('#btn-save-change-marcador').hide();

    var objDatosMarcador = {
        intIdMarcador: data['intIdMarcador'],
        intNumMarcador: data['intNumMarcador'],
        strDesMarcador: data['strDesMarcador'],
        intTipoMarcad: data['intTipoMarcad'],
        intTipoFunc: data['intTipoFunc'],
        strNumIP: data['strNumIP'],
        intNumPuerto: data['intNumPuerto'],

        strNomJerOrg: data['strNomJerOrg'],
        strDescripcion: data['strDescripcion'],
        intIdUniOrg: data['intIdUniOrg'],

        strEstadoActivo: data['FlActivo']['strEstadoActivo'],
        bitFlActivo: data['FlActivo']['bitFlActivo'],

        strMarcadCampo1: data['strMarcadCampo1'],
        strMarcadCampo2: data['strMarcadCampo2'],
        strMarcadCampo3: data['strMarcadCampo3'],
        strMarcadCampo4: data['strMarcadCampo4'],
        strMarcadCampo5: data['strMarcadCampo5'],
        bitTipoComu: data['bitTipoComu']

    }

    $.post(
        '/Organizacion/EditarMarcador',
        { ObjMarcador: objDatosMarcador },
        (response) => {

            if (response !== '') {
                $('.form-hide-Marcador .x_content').empty();
                $('.form-hide-Marcador .x_content').html(response);
                $('.form-hide-Marcador').show();
                switcheryLoad();
                init_checkBox_styles();
                //  onchange_jerarquia();
                $('#txt-Num-Marcador').val(objDatosMarcador.intNumMarcador);
                $('#txt-desc-Marcador').val(objDatosMarcador.strDesMarcador);
                $('#txt-IP-Marcado').val(objDatosMarcador.strNumIP);
                $('#txt-Puerto-Marcador').val(objDatosMarcador.intNumPuerto);
                $('#cboTipoFuncionalidad').val(objDatosMarcador.intTipoFunc);
                $('#cboTipoMarcador').val(objDatosMarcador.intTipoMarcad);

                $('#txtIdMarc').val(objDatosMarcador.intIdMarcador);


                if (objDatosMarcador.bitTipoComu == 1) {
                    $('#cboTipoComu').val(54);
                } if (objDatosMarcador.bitTipoComu == 0) {
                    $('#cboTipoComu').val(53);
                }
                //if (objDatosCargo.strEstadoActivo == 'Activo') {
                //    $('#chk-activo-Cargo ').prop('checked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = true;

                //} else {

                //    $('#chk-activo-Cargo ').prop('unchecked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = false;
                //}


                if (objDatosMarcador.strEstadoActivo == 'Activo') {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Marcador" class= "js-switch" checked /><script>switcheryLoad();</script >');

                } else {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Marcador" class= "js-switch" unchecked /><script>switcheryLoad();</script >');

                }

                ////Bloque de Campos Adicionales

                $.post(
                    '/Organizacion/CamposAdicionales',
                    { strEntidad: 'TGMARCADOR' },
                    (response) => {


                        $('#containerCampose').empty();
                        response.forEach(element => {
                            //alert(element.strTitulo);

                            $('#containerCampose').append(
                                ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                                + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


                        });

                        $('#strMarcadCampo1').val(objDatosMarcador.strMarcadCampo1);
                        $('#strMarcadCampo2').val(objDatosMarcador.strMarcadCampo2);
                        $('#strMarcadCampo3').val(objDatosMarcador.strMarcadCampo3);
                        $('#strMarcadCampo4').val(objDatosMarcador.strMarcadCampo4);
                        $('#strMarcadCampo5').val(objDatosMarcador.strMarcadCampo5);
                    });

                        //Bloque de llenados de CB
                var ides = objDatosMarcador.intIdUniOrg;
                var Idjerorg;
                $.post(
                    '/Organizacion/LlenarDatosMarcador',
                    { intIdUniOrg: ides },
                    (response) => {
                        response.forEach(element => {
                            Idjerorg = element.intIdJerOrg;
                        });
                        if (Idjerorg == 0 || !Idjerorg) {
                            $('#cbounidsupe').empty();
                            $('#cbounidsupe').attr('disabled', true);

                            return;
                        }
                        $('#cboJerarquia').val(Idjerorg);
                        $.post(
                    '/Organizacion/getUnidxJerarquia',
                    { IntIdJerOrg: Idjerorg },
                    (response) => {

                        if (true) {
                            response.forEach(element => {

                                $('#cbounidsupe').attr('disabled', false);
                                $('#cbounidsupe').append('<option value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>');


                                $('#cbounidsupe').val(ides);


                            });

                        }
                    }
                ).fail(function (result) {
                    alert('ERROR ' + result.status + ' ' + result.statusText);
                });
                $('#cbounidsupe').empty();

                    });





            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
//function BuscarMarcador() {

//	var filtrosActivo = $('#filActi').val();
//	var filtrojer = $('#campJerar').val();
//	var strfiltro = $('#filtro').val();
//	var activado;
//	$.post(
//		'/Organizacion/GetTablaMarcador',
//		{ IntActivoFilter: filtrosActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
//		(response) => {
//			$('#tablaMarcador tbody').empty();
//			response.forEach(element => {
//				if (element.bitFlActivo = true) {
//					activado = "Activo";
//				}
//				else {
//					activado = "Inactivo";
//				}
//				$('#tablabodyMarcador').append(

//					'<tr> <th>' + element.intNumMarcador + '</th > <th> ' + element.strDesMarcador + '</th > <th> ' + element.strNumIP + '</th><th>' + element.strNomJerOrg + '</th ><th>' + Activo + '</th><th><a href="#" onclick="editarMarcador()" class="btn btn-success btn-xs"><i class="fa fa-pencil"></i> Editar  </a>' + '<a href = "#" onclick = "eliminarMarcador()" class= "btn btn-primary btn-xs" > <i class="fa fa-trash-o"></i> Eliminar </a ></th></tr>'
//				);
//			});

//		})
//}
function CamposAdicionalesMarcador() {
    $.post(
        '/Organizacion/CamposAdicionales',
        { strEntidad: 'TGMARCADOR' },
        (response) => {
            console.log(response);
            $('#containerCampose').empty();
            response.forEach(element => {

                $('#containerCampose').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');
            });
        });
}
$('#btn-save-change-marcador').on('click', function () {

    var _uorg = $('#cbounidsupe option:selected').val();   //selected
    var _NumMarcador = $('#txt-Num-Marcador').val();
    var _desc = $('#txt-desc-Marcador').val();
    var _TipoMarcador = $('#cboTipoMarcador option:selected').val();
    var _IntNumPuerto = $('#txt-Puerto-Marcador').val();
    var _NumIp = $('#txt-IP-Marcado').val();
    var _TipoFunc = $('#cboTipoFuncionalidad option:selected').val();

    var variable = $('#cboTipoComu').val();
   var _TipoComu = null;
    if (variable == 53) {

        _TipoComu = false;
    } if (variable == 54) {
         _TipoComu = true;
    }
    //if (_TipoComu == null) {
    //    new PNotify({
    //        title: 'Nuevo Marcador',
    //        text: 'Seleccione el Tipo de  Comunicación',
    //        type: 'info',
    //        delay: 3000,
    //        styling: 'bootstrap3',
    //        addclass: 'dark'
    //    });
    //    return;
    //}

    var _camp1 = $('#strMarcadCampo1').val();
    var _camp2 = $('#strMarcadCampo2').val();
    var _camp3 = $('#strMarcadCampo3').val();
    var _camp4 = $('#strMarcadCampo4').val();
    var _camp5 = $('#strMarcadCampo5').val();
    var _activo = $('#chk-activo-Marcador').is(':checked');

    if (_NumMarcador === '' || _desc === '' || _uorg === '' || _TipoComu == null) {
        new PNotify({
            title: 'Nuevo Marcador',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }



    if (_uorg === '') {
        _uorg = null;
    }
    var Marcador = {

        intNumMarcador : _NumMarcador,
        strDesMarcador: _desc,
        intIdUniOrg: _uorg,
        intTipoFunc: _TipoFunc,
        intTipoMarcad: _TipoMarcador,  // Aún no se sabe de que campo o de donde se sacará PENDIENTE
        bitTipoComu: _TipoComu,
        strNumIP: _NumIp,
        intNumPuerto: _IntNumPuerto,
        strMarcadCampo1: _camp1,
        strMarcadCampo2: _camp2,
        strMarcadCampo3: _camp3,
        strMarcadCampo4: _camp4,
        strMarcadCampo5: _camp5,
        bitFlActivo: _activo,

    }
    $.post(
        '/Organizacion/RegistrarNuevoMarcador',
        { Marcador: Marcador },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                      new PNotify({
                    title: 'Nuevo Marcador',
                    text: response.message,
                    type: response.type,
                    delay: 3000,
                    styling: 'bootstrap3'
                    });
                    TablaMarcador();
                $('.form-hide-Marcador').hide();
                } else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Marcador';
                        var campo = 'txt-Num-Marcador';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {
                            var nomMantemiento = 'Marcador';
                            var campo = 'txt-desc-Marcador';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        } else {
                            if (response.type === 'alert') {
                                $('#notifry_error').html('');
                                $('#notifry_errordes').html('');

                                new PNotify({
                                    title: 'Actualización de Marcador',
                                    text: response.message,
                                    type: response.type,
                                    delay: 3000,
                                    styling: 'bootstrap3',
                                    addclass: 'dark'
                                });
                                return;
                            } else {


                            }
                        }


                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

});
$('#btn-update-marcador').on('click', function () {
    var _uorg = $('#cbounidsupe option:selected').val();   //selected
    var _NumMarcador = $('#txt-Num-Marcador').val();
    var _desc = $('#txt-desc-Marcador').val();
    var _TipoMarcador = $('#cboTipoMarcador option:selected').val();
    var _IntNumPuerto = $('#txt-Puerto-Marcador').val();
    var _NumIp = $('#txt-IP-Marcado').val();
    var _TipoFunc = $('#cboTipoFuncionalidad option:selected').val();
    var variable = $('#cboTipoComu').val();
   // alert(variable);
    var _TipoComu =null;

    if (variable == 53) {
      //  alert('false');

        _TipoComu =false;

    }    if (variable == 54) {
       // alert('true');
        _TipoComu =true;

    }

    //if (_TipoComu == null) {
    //    new PNotify({
    //        title: 'Nuevo Marcador',
    //        text: 'Seleccione el Tipo de  Marcador',
    //        type: 'info',
    //        delay: 3000,
    //        styling: 'bootstrap3',
    //        addclass: 'dark'
    //    });
    //    return;
    //}
    var _camp1 = $('#strMarcadCampo1').val();
    var _camp2 = $('#strMarcadCampo2').val();
    var _camp3 = $('#strMarcadCampo3').val();
    var _camp4 = $('#strMarcadCampo4').val();
    var _camp5 = $('#strMarcadCampo5').val();
    var _activo = $('#chk-activo-Marcador').is(':checked');
    var _idMarc = $('#txtIdMarc').val();

    if (_NumMarcador === '' || _desc === '' || _uorg === '' || _TipoComu == null) {
        new PNotify({
            title: 'Actualización de Marcador',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }
    if (_TipoComu !== null && _NumIp == null && _IntNumPuerto ==null) {
        new PNotify({
            title: 'Actualización de Marcador',
            text: 'La IP debe ser ingresada',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }

    if (_uorg === '') {
        _uorg = null;
    }
    var Marcador = {

        intNumMarcador: _NumMarcador,
        strDesMarcador: _desc,
        intIdUniOrg: _uorg,
        intTipoFunc: _TipoFunc,
        intTipoMarcad: _TipoMarcador,  // Aún no se sabe de que campo o de donde se sacará PENDIENTE
        bitTipoComu: _TipoComu,
        strNumIP: _NumIp,
        intNumPuerto: _IntNumPuerto,
        strMarcadCampo1: _camp1,
        strMarcadCampo2: _camp2,
        strMarcadCampo3: _camp3,
        strMarcadCampo4: _camp4,
        strMarcadCampo5: _camp5,
        bitFlActivo: _activo,
        intIdMarcador:  _idMarc,

    }
    $.post(
        '/Organizacion/ActualizarMarcador',
        { objDatos: Marcador },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                   new PNotify({
                       title: 'Actualización de Marcador',
                    text: response.message,
                    type: response.type,
                    delay: 3000,
                    styling: 'bootstrap3'
                       });
                    TablaMarcador();
                $('.form-hide-Marcador').hide();
                }  else {
                    $('#notifry_error').html('');
                    $('#notifry_errordes').html('');

                    if (response.type === 'info') {
                        var nomMantemiento = 'Marcador';
                        var campo = 'txt-Num-Marcador';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                   INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {
                            var nomMantemiento = 'Marcador';
                            var campo = 'txt-desc-Marcador';
                            var msj = response.message;
                            var response = response.type;
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            $('#notifry_error').html('');
                            $('#notifry_errordes').html('');

                            return;
                        } else {
                            if (response.type === 'alert') {
                                $('#notifry_error').html('');
                                $('#notifry_errordes').html('');

                                new PNotify({
                                    title: 'Actualización de Marcador',
                                    text: response.message,
                                    type: response.type,
                                    delay: 3000,
                                    styling: 'bootstrap3',
                                    addclass: 'dark'
                                });


                                return;
                            } else {


                            }
                        }


                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

});

/**------------------------------------------------ */
/**4. Centro de Costos Functions */
/**------------------------------------------------ */

$('#filActi').on('change', function () {
 TablaCentroCosto();
});
$('#campJerar').on('change', function () {

    TablaCentroCosto();
});
$('#filtro').keyup(function () {

    TablaCentroCosto();
});
$('#btn-new-ccosto').on('click', function () {
    $('#btn-save-change-ccosto').show();
    $('#btn-update-ccosto').hide();
    $('.form-hide-ccosto').show();
    $.post(
        '/Organizacion/NuevoCentroCosto',
        {},
        (response) => {
            if (response !== '') {
                $('.form-hide-ccosto .x_content').empty();
                $('.form-hide-ccosto .x_content').html(response);
                $('.form-hide-ccosto').show();
                //BuscarUnidad();
                CamposAdicionalesCCosto();
                switcheryLoad();//checked verde
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
});
var _varTablaCCosto;
function TablaCentroCosto() {
    var filtrosActivo = $('#filActi').val();
    var filtrojer = $('#campJerar').val();
    var strfiltro = $('#filtro').val();
    $.post(
        '/Organizacion/getTablaCCosto',
        { IntActivoFilter: filtrosActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
        (response) => {

            if (typeof _varTablaCCosto !== 'undefined') {
                _varTablaCCosto.destroy();
            }


            _varTablaCCosto = $('#tablaCentroCosto').DataTable({
                data: response,
                columns: [
              { data: 'strCoCCosto' },
                    { data: 'strDesCCosto' },
                    { data: 'strNomJerOrg' },
                    { data: 'strDescripcion' },
                    { data: 'FlActivo.strEstadoActivo' },
                    { data: null },
                    { data: 'IntIdCCosto' },
                    { data: 'intIdTipFisc' },
                    { data: 'bitFlActivo' },
                    { data: 'strCeCoCampo1' },
                    { data: 'strCeCoCampo2' },
                    { data: 'strCeCoCampo3' },
                    { data: 'strCeCoCampo4' },
                    { data: 'strCeCoCampo5' },
                    { data: 'IntIdUniOrg' },
                ],
                lengthMenu: [10, 25, 50],
                responsive: true,
                order: [[1, 'desc'], [2, 'desc']],
                language: _datatableLanguaje,
                columnDefs: [//ocultar y definir columnas
                    {
                        targets: [6],//IntIdCCosto
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [7],//intIdTipFisc
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [8],//bitFlActivo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [9],//strPlaniCampo1
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [10],//strCargoCampo3
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [11],//strCargoCampo4
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [12],//strCargoCampo5
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [13],//intIdUniOrg
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [14],//intIdUniOrg
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [5],
                        data: null,
                        defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                            '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
                    }
                ],
                dom: 'lBfrtip',
            });




            $('#tablaCentroCosto  tbody').on('click', 'tr button.btn-edit', function () {
                var data = _varTablaCCosto.row($(this).parents('tr')).data();
                if (data == null) {
                    data = null;
                    var data = _varTablaCCosto.row($(this).parents('li')).data();
                    cardarDatosCCosto(data);
                } else {
                    var data = _varTablaCCosto.row($(this).parents('tr')).data();
                    cardarDatosCCosto(data);
                }
            });

            $('#tablaCentroCosto  tbody').on('click', 'tr button.btn-delete', function () {

                var data = _varTablaCCosto.row($(this).parents('tr')).data();

                if (data == null) {
                    data = null;

                    var data = _varTablaCCosto.row($(this).parents('li')).data();
                    intentEliminarCCosto(data['IntIdCCosto'], data['strDesCCosto']);

                } else {

                    var data = _varTablaCCosto.row($(this).parents('tr')).data();
                    intentEliminarCCosto(data['IntIdCCosto'], data['strDesCCosto']);

                }


            });



        });
}
function intentEliminarCCosto(idCCosto, strNomCCosto) {

    swal({
        title: "Eliminar Centro de Costo",
        text: "¿Está seguro de eliminar el Centro de Costo   ''<strong>" + strNomCCosto + "</strong>''    ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaCCosto(idCCosto);
        } else {
            swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}
function yesEliminaCCosto(idCCosto) {

    $.post(
        '/Organizacion/EliminarCCosto',
        { IntIdCCosto: idCCosto },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    TablaCentroCosto('', '', '');
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
function cardarDatosCCosto(data) {

    $('#btn-update-ccosto').show();
    $('#btn-save-change-ccosto').hide();

    var objDatosCCosto = {
        IntIdCCosto: data['IntIdCCosto'],
        strCoCCosto: data['strCoCCosto'],
        strDesCCosto: data['strDesCCosto'],
        strNomJerOrg: data['strNomJerOrg'],
        IntIdCCosto: data['IntIdCCosto'],
        intIdTipFisc: data['intIdTipFisc'],
        intIdUniOrg: data['IntIdUniOrg'],

        strEstadoActivo: data['FlActivo']['strEstadoActivo'],
        bitFlActivo: data['FlActivo']['bitFlActivo'],

        strCeCoCampo1: data['strCeCoCampo1'],
        strCeCoCampo2: data['strCeCoCampo2'],
        strCeCoCampo3: data['strCeCoCampo3'],
        strCeCoCampo4: data['strCeCoCampo4'],
        strCeCoCampo5: data['strCeCoCampo5'],
        strDescripcion: data['strDescripcion']
    }


    $.post(
        '/Organizacion/EditarCCosto',
        { ObjCCosto: objDatosCCosto },
        (response) => {
            if (response !== '') {
                $('.form-hide-ccosto .x_content').empty();
                $('.form-hide-ccosto .x_content').html(response);
                $('.form-hide-ccosto').show();
                switcheryLoad();
                init_checkBox_styles();
                //  onchange_jerarquia();
                $('#txt-cod-CCosto').val(objDatosCCosto.strCoCCosto);
                $('#txt-desc-CCosto').val(objDatosCCosto.strDesCCosto);
                $('#txtIdCCosto').val(objDatosCCosto.IntIdCCosto);
                $("#cboTipo").val(objDatosCCosto.intIdTipFisc);

                //if (objDatosCargo.strEstadoActivo == 'Activo') {
                //    $('#chk-activo-Cargo ').prop('checked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = true;

                //} else {

                //    $('#chk-activo-Cargo ').prop('unchecked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = false;
                //}


                if (objDatosCCosto.strEstadoActivo == 'Activo') {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Grupo" class= "js-switch" checked /><script>switcheryLoad();</script >');

                } else {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Grupo" class= "js-switch" unchecked /><script>switcheryLoad();</script >');

                }

                ////Bloque de Campos Adicionales
                $.post(
                    '/Organizacion/CamposAdicionales',
                    { strEntidad: 'TGCCOSTO' },
                    (response) => {

                        console.log(response);
                        $('#containerCampose').empty();
                        response.forEach(element => {
                            //alert(element.strTitulo);

                            $('#containerCampose').append(
                                ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                                + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


                        });

                        $('#strCeCoCampo1').val(objDatosCCosto.strCeCoCampo1);
                        $('#strCeCoCampo2').val(objDatosCCosto.strCeCoCampo2);
                        $('#strCeCoCampo3').val(objDatosCCosto.strCeCoCampo3);
                        $('#strCeCoCampo4').val(objDatosCCosto.strCeCoCampo4);
                        $('#strCeCoCampo5').val(objDatosCCosto.strCeCoCampo5);
                    });


                //Bloque de llenados de CBO

                $("#cboJerarquia option").filter(function () {
                    return this.text == objDatosCCosto.strNomJerOrg;
                }).attr('selected', true);

                var id = $('#cboJerarquia option:selected').val();
                if (id == 0 || !id) {
                    $('#cbounidsupe').empty();
                    $('#cbounidsupe').attr('disabled', true);

                    return;
                }
                $.post(
                    '/Organizacion/getUnidxJerarquia',
                    { IntIdJerOrg: id },
                    (response) => {

                        if (true) {

                            response.forEach(element => {

                                $('#cbounidsupe').attr('disabled', false);
                                $('#cbounidsupe').append('<option value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>');


                                if (element.intIdUniOrg == objDatosCCosto.intIdUniOrg) {
                                    $("#cbounidsupe option").filter(function () {
                                        return this.text == objDatosCCosto.strDescripcion;
                                    }).attr('selected', true);
                                }


                            });

                        }
                    }
                ).fail(function (result) {
                    alert('ERROR ' + result.status + ' ' + result.statusText);
                });
                $('#cbounidsupe').empty();

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
$('#btn-save-change-ccosto').on('click', function () {

    var _uorg = $('#cbounidsupe option:selected').val();   //selected
    var _codigo = $('#txt-cod-CCosto').val();
    var _desc = $('#txt-desc-CCosto').val();
    var _activo = $('#chk-activo-CCosto').is(':checked');
    var _TipoCCosto = $('#cboTipo option:selected').val();
    var _camp1 = $('#strCeCoCampo1').val();
    var _camp2 = $('#strCeCoCampo2').val();
    var _camp3 = $('#strCeCoCampo3').val();
    var _camp4 = $('#strCeCoCampo4').val();
    var _camp5 = $('#strCeCoCampo5').val();

    if (_codigo === '' || _desc === '' || _uorg === '') {
        new PNotify({
            title: 'Nuevo Centro de Costo',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }

    if (_uorg === '') {
        _uorg = null;
    }
    var CCosto = {

        strCoCCosto: _codigo,
        strDesCCosto: _desc,
        intIdUniOrg: _uorg,
        intIdTipFisc: _TipoCCosto,
        strCeCoCampo1: _camp1,
        strCeCoCampo2: _camp2,
        strCeCoCampo3: _camp3,
        strCeCoCampo4: _camp4,
        strCeCoCampo5: _camp5,
        bitFlActivo: _activo,

    }
    $.post(
        '/Organizacion/RegistrarNuevoCCosto',
        { CCosto: CCosto },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                   new PNotify({
                    title: 'Nuevo Centro de Costo',
                    text: response.message,
                    type: response.type,
                    delay: 3000,
                    styling: 'bootstrap3'
                    });
                    TablaCentroCosto();
                $('.form-hide-ccosto').hide();
                } else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Centro de Costo';
                        var campo = 'txt-cod-CCosto';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {

                            var nomMantemiento = 'Centro de Costo';
                            var campo = 'txt-desc-CCosto';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        } else {
                            if (response.type === 'alert') {

                                new PNotify({
                                    title: 'Actualización de Centro de Costo',
                                    text: response.message,
                                    type: response.type,
                                    delay: 3000,
                                    styling: 'bootstrap3',
                                    addclass: 'dark'
                                });
                                return;
                            } else {


                            }
                        }

                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
});
$('#btn-update-ccosto').on('click', function () {

    var _uorg = $('#cbounidsupe option:selected').val();   //selected
    var _codigo = $('#txt-cod-CCosto').val();
    var _desc = $('#txt-desc-CCosto').val();
    var _activo = $('#chk-activo-CCosto').is(':checked');
    var _TipoCCosto = $('#cboTipo option:selected').val();
    var _camp1 = $('#strCeCoCampo1').val();
    var _camp2 = $('#strCeCoCampo2').val();
    var _camp3 = $('#strCeCoCampo3').val();
    var _camp4 = $('#strCeCoCampo4').val();
    var _camp5 = $('#strCeCoCampo5').val();
    var _idCCosto = $('#txtIdCCosto').val();

    if (_codigo === '' || _desc === '' || _uorg === '') {
        new PNotify({
            title: 'Actualización de Centro de Costo',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }

    if (_uorg === '') {
        _uorg = null;
    }
    var CCosto = {
        IntIdCCosto: _idCCosto,
        strCoCCosto: _codigo,
        strDesCCosto: _desc,
        intIdUniOrg: _uorg,
        intIdTipFisc: _TipoCCosto,
        strCeCoCampo1: _camp1,
        strCeCoCampo2: _camp2,
        strCeCoCampo3: _camp3,
        strCeCoCampo4: _camp4,
        strCeCoCampo5: _camp5,
        bitFlActivo: _activo,

    }
    $.post(
        '/Organizacion/ActualizarCCosto',
        { objDatos: CCosto },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {

                   new PNotify({
                       title: 'Actualización de Centro de Costo',
                    text: response.message,
                    type: response.type,
                    delay: 3000,
                    styling: 'bootstrap3'
                    });
                    TablaCentroCosto();
                $('.form-hide-ccosto').hide();
                } else {

                    if (response.type === 'info') {

                        var nomMantemiento = 'Centro de Costo';
                        var campo = 'txt-cod-CCosto';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {

                            var nomMantemiento = 'Centro de Costo';
                            var campo = 'txt-desc-CCosto';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        } else {
                            if (response.type === 'alert') {

                                new PNotify({
                                    title: 'Actualización de Centro de Costo',
                                    text: response.message,
                                    type: response.type,
                                    delay: 3000,
                                    styling: 'bootstrap3',
                                    addclass: 'dark'
                                });
                                return;
                            } else {


                            }
                        }

                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
});
$('#btn-cancel-ccosto').on('click', function () {
    $('.form-hide-ccosto').hide();
});
function CamposAdicionalesCCosto() {

    $.post(
        '/Organizacion/CamposAdicionales',
        { strEntidad: 'TGCCOSTO' },
        (response) => {

            console.log(response);
            $('#containerCampose').empty();
            response.forEach(element => {

                $('#containerCampose').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


            });
        });
}

/**------------------------------------------ */
/**--------------5. Planilla----------------- */
/**------------------------------------------ */

$('#btn-new-planilla').on('click', function () {
    $('.form-hide-planilla').show();
    $('#btn-update-planilla').hide();
    $('#btn-save-change-planilla').show();
    $.post(
        '/Organizacion/NuevaPlanilla',
        {},
        (response) => {
            if (response !== '') {
                $('.form-hide-planilla .x_content').empty();
                $('.form-hide-planilla .x_content').html(response);
                $('.form-hide-planilla').show();
                switcheryLoad();//checked verde

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
});
$('#filActi').on('change', function () {
 TablaPlanilla();
});
$('#campJerar').on('change', function () {
    TablaPlanilla();
});
$('#filtro').keyup(function () {
    TablaPlanilla();
});
var _varTablaPlanilla;
function TablaPlanilla() {
    var filtrosActivo = $('#filActi').val();
    var filtrojer = $('#campJerar').val();
    var strfiltro = $('#filtro').val();
    $.post(
        '/Organizacion/getTablaPlanilla',
        { IntActivoFilter: filtrosActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
        (response) => {

            if (typeof _varTablaPlanilla !== 'undefined') {
                _varTablaPlanilla.destroy();
            }

            _varTablaPlanilla = $('#tablaPlanilla').DataTable({
                data: response,
                columns: [

                    { data: 'strCoPlani' },
                    { data: 'strDesPlani' },
                    { data: 'strNomJerOrg' },
                    { data: 'strDescripcion' },
                    { data: 'FlActivo.strEstadoActivo' },
                    { data: null },
                    { data: 'intIdPlanilla' },
                    { data: 'bitFlActivo' },
                    { data: 'strPlaniCampo1' },
                    { data: 'strPlaniCampo2' },
                    { data: 'strPlaniCampo3' },
                    { data: 'strPlaniCampo4' },
                    { data: 'strPlaniCampo5' },
                    { data: 'intIdUniOrg' },
                ],
                lengthMenu: [10, 25, 50],
                responsive: true,
                order: [[1, 'desc'], [2, 'desc']],
                language: _datatableLanguaje,
                columnDefs: [//ocultar y definir columnas
                    {
                        targets: [6],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [7],//bitFlActivo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [8],//strCargoCampo1
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [9],//strCargoCampo2
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [10],//strCargoCampo3
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [11],//strCargoCampo4
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [12],//strCargoCampo5
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [13],//intIdUniOrg
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [5],
                        data: null,
                        defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                            '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
                    }
                ],
                dom: 'lBfrtip',
            });

          $('#tablaPlanilla tbody').on('click', 'tr button.btn-edit', function () {
                var data = _varTablaPlanilla.row($(this).parents('tr')).data();
                if (data == null) {
                    data = null;
                    var data = _varTablaPlanilla.row($(this).parents('li')).data();
                    cardarDatosPlanilla(data);
                } else {
                    var data = _varTablaPlanilla.row($(this).parents('tr')).data();
                    cardarDatosPlanilla(data);
                }
            });

            $('#tablaPlanilla tbody').on('click', 'tr button.btn-delete', function () {

                var data = _varTablaPlanilla.row($(this).parents('tr')).data();

                if (data == null) {
                    data = null;

                    var data = _varTablaPlanilla.row($(this).parents('li')).data();
                    intentEliminarPlanilla(data['intIdPlanilla'], data['strDesPlani']);

                } else {

                    var data = _varTablaPlanilla.row($(this).parents('tr')).data();
                    intentEliminarPlanilla(data['intIdPlanilla'], data['strDesPlani']);

                }


            });
        });
}
//function BuscarPlanilla() {

//	var filtrosActivo = $('#filActi').val();
//	var filtrojer = $('#campJerar').val();
//	var strfiltro = $('#filtro').val();
//	$.post(
//		'/Organizacion/getTablaPlanilla',
//		{ IntActivoFilter: filtrosActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
//		(response) => {
//			$('#tablaPlanilla tbody').empty();
//			response.forEach(element => {
//				$('#tablaBodyPlanilla').append(
//					'<tr> <th>' + element.strCoPlani + '</th > <th> ' + element.strDesPlani + '</th > <th> ' + element.strDescripcion + '</th><th>' + element.strNomJerOrg + '</th ><th> Activo </th><th><a href="#" onclick="editarPlanilla()" class="btn btn-success btn-xs"><i class="fa fa-pencil"></i> Editar  </a>' + '<a href = "#" onclick = "eliminarPlanilla()" class= "btn btn-primary btn-xs" > <i class="fa fa-trash-o"></i> Eliminar </a ></th></tr>'
//				);
//			});
//		})
//}
function intentEliminarPlanilla(idPlanilla, strNomPlanilla) {

    swal({
        title: "Eliminar Planilla",
        text: "¿Está seguro de eliminar la Planilla   ''<strong>" + strNomPlanilla + "</strong>''  ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaPlanilla(idPlanilla);
        } else {
            swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}
function yesEliminaPlanilla(idPlanilla) {

    $.post(
        '/Organizacion/EliminarPlanilla',
        { IdPlanilla: idPlanilla },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'EL REGISTRO NO SE PUEDE ELIMINAR';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    TablaPlanilla('', '', '');
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
function cardarDatosPlanilla(data) {

    $('#btn-update-planilla').show();
    $('#btn-save-change-planilla').hide();

    var objDatosPlanilla = {
        intIdPlanilla: data['intIdPlanilla'],
        strCoPlani: data['strCoPlani'],
        strDesPlani: data['strDesPlani'],
        strNomJerOrg: data['strNomJerOrg'],
        strDescripcion: data['strDescripcion'],
        intIdUniOrg: data['intIdUniOrg'],

        strEstadoActivo: data['FlActivo']['strEstadoActivo'],
        bitFlActivo: data['FlActivo']['bitFlActivo'],

        strPlaniCampo1: data['strPlaniCampo1'],
        strPlaniCampo2: data['strPlaniCampo2'],
        strPlaniCampo3: data['strPlaniCampo3'],
        strPlaniCampo4: data['strPlaniCampo4'],
        strPlaniCampo5: data['strPlaniCampo5']
    }


    $.post(
        '/Organizacion/EditarPlanilla',
        { ObjPlanilla: objDatosPlanilla },
        (response) => {
            if (response !== '') {
                $('.form-hide-planilla .x_content').empty();
                $('.form-hide-planilla .x_content').html(response);
                $('.form-hide-planilla').show();
                switcheryLoad();
                init_checkBox_styles();
                //  onchange_jerarquia();
                $('#txt-cod-Planilla').val(objDatosPlanilla.strCoPlani);
                $('#txt-desc-Planilla').val(objDatosPlanilla.strDesPlani);
                $('#txtIdPlan').val(objDatosPlanilla.intIdPlanilla);


                //if (objDatosCargo.strEstadoActivo == 'Activo') {
                //    $('#chk-activo-Cargo ').prop('checked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = true;

                //} else {

                //    $('#chk-activo-Cargo ').prop('unchecked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = false;
                //}


                if (objDatosPlanilla.strEstadoActivo == 'Activo') {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Planilla" class= "js-switch" checked /><script>switcheryLoad();</script >');

                } else {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Planilla" class= "js-switch" unchecked /><script>switcheryLoad();</script >');

                }

                ////Bloque de Campos Adicionales

                $.post(
                    '/Organizacion/CamposAdicionales',
                    { strEntidad: 'TGPLANILLA' },
                    (response) => {


                        console.log(response);
                        $('#containerCampose').empty();
                        response.forEach(element => {
                            //alert(element.strTitulo);

                            $('#containerCampose').append(
                                ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                                + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


                        });

                        $('#strPlaniCampo1').val(objDatosPlanilla.strPlaniCampo1);
                        $('#strPlaniCampo2').val(objDatosPlanilla.strPlaniCampo2);
                        $('#strPlaniCampo3').val(objDatosPlanilla.strPlaniCampo3);
                        $('#strPlaniCampo4').val(objDatosPlanilla.strPlaniCampo4);
                        $('#strPlaniCampo5').val(objDatosPlanilla.strPlaniCampo5);
                    });


                //Bloque de llenados de CBO

                $("#cboJerarquia option").filter(function () {
                    return this.text == objDatosPlanilla.strNomJerOrg;
                }).attr('selected', true);

                var id = $('#cboJerarquia option:selected').val();
                if (id == 0 || !id) {
                    $('#cbounidsupe').empty();
                    $('#cbounidsupe').attr('disabled', true);

                    return;
                }
                $.post(
                    '/Organizacion/getUnidxJerarquia',
                    { IntIdJerOrg: id },
                    (response) => {

                        if (true) {

                            response.forEach(element => {

                                $('#cbounidsupe').attr('disabled', false);
                                $('#cbounidsupe').append('<option value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>');
                                if (element.intIdUniOrg == objDatosPlanilla.intIdUniOrg) {
                                    $("#cbounidsupe option").filter(function () {
                                        return this.text == objDatosPlanilla.strDescripcion;
                                    }).attr('selected', true);
                                }


                            });

                        }
                    }
                ).fail(function (result) {
                    alert('ERROR ' + result.status + ' ' + result.statusText);
                });
                $('#cbounidsupe').empty();

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
$('#btn-save-change-planilla').on('click', function () {

    var _uorg = $('#cbounidsupe option:selected').val();   //selected
    var _codigo = $('#txt-cod-Planilla').val();
    var _desc = $('#txt-desc-Planilla').val();
    var _activo = $('#chk-activo-Planilla').is(':checked');
    var _camp1 = $('#strPlaniCampo1').val();
    var _camp2 = $('#strPlaniCampo2').val();
    var _camp3 = $('#strPlaniCampo3').val();
    var _camp4 = $('#strPlaniCampo4').val();
    var _camp5 = $('#strPlaniCampo5').val();

    if (_codigo === '' || _desc === '' || _uorg === '') {
        new PNotify({
            title: 'Nueva Planilla',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');

        return;
    }

    if (_uorg === '') {
        _uorg = null;
    }
    var Planilla = {

        strCoPlani: _codigo,
        strDesPlani: _desc,
        intIdUniOrg: _uorg,
        strPlaniCampo1: _camp1,
        strPlaniCampo2: _camp2,
        strPlaniCampo3: _camp3,
        strPlaniCampo4: _camp4,
        strPlaniCampo5: _camp5,
        bitFlActivo: _activo,

    }
    $.post(
        '/Organizacion/RegistrarNuevaPlanilla',
        { Planilla: Planilla },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                  new PNotify({
                    title: 'Nueva Planilla',
                    text: response.message,
                    type: response.type,
                    delay: 3000,
                    styling: 'bootstrap3'
                   });
                    $('.form-hide-planilla').hide();
                TablaPlanilla();
                } else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Planilla';
                        var campo = 'txt-cod-Planilla';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {

                            var nomMantemiento = 'Planilla';
                            var campo = 'txt-desc-Planilla';
                            var msj = response.message;
                            var response = "info";
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        }


                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

});
$('#btn-cancel-planilla').on('click', function () {
    $('.form-hide-planilla').hide();
});
$('#btn-update-planilla').on('click', function () {

    var _uorg = $('#cbounidsupe option:selected').val();   //selected
    var _codigo = $('#txt-cod-Planilla').val();
    var _desc = $('#txt-desc-Planilla').val();
    var _activo = $('#chk-activo-Planilla').is(':checked');
    var _camp1 = $('#strPlaniCampo1').val();
    var _camp2 = $('#strPlaniCampo2').val();
    var _camp3 = $('#strPlaniCampo3').val();
    var _camp4 = $('#strPlaniCampo4').val();
    var _camp5 = $('#strPlaniCampo5').val();
    var _codi = $('#txtIdPlan').val();

    if (_codigo === '' || _desc === '' || _uorg === '') {
        new PNotify({
            title: 'Actualización de Planilla',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');

        return;
    }

    if (_uorg === '') {
        _uorg = null;
    }
    var Planilla = {
        intIdPlanilla: _codi,
        strCoPlani: _codigo,
        strDesPlani: _desc,
        intIdUniOrg: _uorg,
        strPlaniCampo1: _camp1,
        strPlaniCampo2: _camp2,
        strPlaniCampo3: _camp3,
        strPlaniCampo4: _camp4,
        strPlaniCampo5: _camp5,
        bitFlActivo: _activo,

    }
    $.post(
        '/Organizacion/ActualizarPlanilla',
        { objDatos: Planilla },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    new PNotify({
                        title: 'Actualización de Planilla',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                    TablaPlanilla();
                    $('.form-hide-planilla').hide();
                }
                else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Planilla';
                        var campo = 'txt-cod-Planilla';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                    INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {

                            var nomMantemiento = 'Planilla';
                            var campo = 'txt-desc-Planilla';
                            var msj = response.message;
                            var response = "info";
                            var deta = 'notifry_errordes';
                       INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        }


                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

});
function CamposAdicionalesPlanilla() {

    $.post(
        '/Organizacion/CamposAdicionales',
        { strEntidad: 'TGPLANILLA' },
        (response) => {


            console.log(response);
            $('#containerCampose').empty();
            response.forEach(element => {

                $('#containerCampose').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


            });
        });
}

/**------------------------------------------------------ */
/**6. Grupo */
/**----------------------------------------------- */
$('#filActi').on('change', function () {
    TablaGrupo();
});
$('#campJerar').on('change', function () {
    TablaGrupo();
});
$('#filtro').keyup(function () {
    TablaGrupo();
});
$('#btn-new-grupo').on('click', function () {
    $('.form-hide-grupo').show();
    $('#btn-update-grupo').hide();
    $('#btn-save-change-grupo').show();
    $.post(
        '/Organizacion/NuevoGrupo',
        {},
        (response) => {
            if (response !== '') {
                $('.form-hide-grupo .x_content').empty();
                $('.form-hide-grupo .x_content').html(response);
                $('.form-hide-grupo').show();

                switcheryLoad();//checked verde

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
});
var _varTablaGrupo;
function TablaGrupo() {

    var filtrosActivo = $('#filActi').val();
    var filtrojer = $('#campJerar').val();
    var strfiltro = $('#filtro').val();

    $.post(
        '/Organizacion/GetTablaFiltradaGrupo',
        { IntActivoFilter: filtrosActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
        (response) => {


            if (typeof _varTablaGrupo !== 'undefined') {
                _varTablaGrupo.destroy();
            }

            _varTablaGrupo = $('#tablaGrupo').DataTable({
                data: response,
                columns: [

                    { data: 'strCoGrupo' },
                    { data: 'strDesGrupo' },
                    { data: 'strNomJerOrg' },
                    { data: 'strDescripcion' },
                    { data: 'FlActivo.strEstadoActivo' },
                    { data: null },
                    { data: 'intIdGrupo' },
                    { data: 'bitFlActivo' },
                    { data: 'strGrupoCampo1' },
                    { data: 'strGrupoCampo2' },
                    { data: 'strGrupoCampo3' },
                    { data: 'strGrupoCampo4' },
                    { data: 'strGrupoCampo5' },
                    { data: 'intIdUniOrg' },
                ],
                lengthMenu: [10, 25, 50],
                responsive: true,
                order: [[1, 'desc'], [2, 'desc']],
                language: _datatableLanguaje,
                columnDefs: [//ocultar y definir columnas
                    {
                        targets: [6],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [7],//bitFlActivo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [8],//strCargoCampo1
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [9],//strCargoCampo2
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [10],//strCargoCampo3
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [11],//strCargoCampo4
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [12],//strCargoCampo5
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [13],//intIdUniOrg
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [5],
                        data: null,
                        defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                            '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
                    }
                ],
                dom: 'lBfrtip',
            });



            $('#tablaGrupo tbody').on('click', 'tr button.btn-edit', function () {
                var data = _varTablaGrupo.row($(this).parents('tr')).data();
                if (data == null) {

                    var data = _varTablaGrupo.row($(this).parents('li')).data();
                    cardarDatosGrupo(data);
                } else {

                    var data = _varTablaGrupo.row($(this).parents('tr')).data();
                    cardarDatosGrupo(data);
                }
            });

            $('#tablaGrupo tbody').on('click', 'tr button.btn-delete', function () {

                var data = _varTablaGrupo.row($(this).parents('tr')).data();

                if (data == null) {

                    var data = _varTablaGrupo.row($(this).parents('li')).data();
                    intentEliminarGrupo(data['intIdGrupo'], data['strDesGrupo']);

                } else {

                    var data = _varTablaGrupo.row($(this).parents('tr')).data();
                    intentEliminarGrupo(data['intIdGrupo'], data['strDesGrupo']);

                }


            });

        });
}
//function BuscarGrupo() {

//	var filtrosActivo = $('#filActi').val();
//	var filtrojer = $('#campJerar').val();
//	var strfiltro = $('#filtro').val();
//	$.post(
//		'/Organizacion/getTablaFiltradaGrupo',
//		{ IntActivoFilter: filtrosActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
//		(response) => {
//			$('#tablaGrupo tbody').empty();
//			response.forEach(element => {
//				$('#tablaBodyGrupo').append(
//					'<tr> <th>' + element.strCoGrupo + '</th > <th> ' + element.strDesGrupo + '</th > <th> ' + element.strDescripcion + '</th><th>' + element.strNomJerOrg + '</th ><th> Activo </th><th><a href="#" onclick="editarGrupo()" class="btn btn-success btn-xs"><i class="fa fa-pencil"></i> Editar  </a>' + '<a href = "#" onclick = "eliminarGrupo()" class= "btn btn-primary btn-xs" > <i class="fa fa-trash-o"></i> Eliminar </a ></th></tr>'
//				);
//			});



//		})



//}
function intentEliminarGrupo(idGrupo, strNomGrupo) {

    swal({
        title: "Eliminar Grupo",
        text: "¿Está seguro de eliminar el Grupo   ''<strong>" + strNomGrupo + "</strong>''   ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaGrupo(idGrupo);
        } else {
            swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}
function yesEliminaGrupo(idGrupo) {

    $.post(
        '/Organizacion/EliminarGrupo',
        { intIdGrupo: idGrupo },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    TablaGrupo('', '', '');
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
function cardarDatosGrupo(data) {

    $('#btn-update-grupo').show();
    $('#btn-save-change-grupo').hide();

    var objDatosGrupo = {
        intIdGrupo: data['intIdGrupo'],
        strCoGrupo: data['strCoGrupo'],
        strDesGrupo: data['strDesGrupo'],
        strNomJerOrg: data['strNomJerOrg'],
        strDescripcion: data['strDescripcion'],
        intIdUniOrg: data['intIdUniOrg'],

        strEstadoActivo: data['FlActivo']['strEstadoActivo'],
        bitFlActivo: data['FlActivo']['bitFlActivo'],

        strGrupoCampo1: data['strGrupoCampo1'],
        strGrupoCampo2: data['strGrupoCampo2'],
        strGrupoCampo3: data['strGrupoCampo3'],
        strGrupoCampo4: data['strGrupoCampo4'],
        strGrupoCampo5: data['strGrupoCampo5']
    }


    $.post(
        '/Organizacion/EditarGrupo',
        { ObjGrupo: objDatosGrupo },
        (response) => {
            if (response !== '') {
                $('.form-hide-grupo .x_content').empty();
                $('.form-hide-grupo .x_content').html(response);
                $('.form-hide-grupo').show();
                switcheryLoad();
                init_checkBox_styles();
                //  onchange_jerarquia();
                $('#txt-cod-Grupo').val(objDatosGrupo.strCoGrupo);
                $('#txt-desc-Grupo').val(objDatosGrupo.strDesGrupo);
                $('#txtIdGroup').val(objDatosGrupo.intIdGrupo);


                //if (objDatosCargo.strEstadoActivo == 'Activo') {
                //    $('#chk-activo-Cargo ').prop('checked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = true;

                //} else {

                //    $('#chk-activo-Cargo ').prop('unchecked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = false;
                //}


                if (objDatosGrupo.strEstadoActivo == 'Activo') {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Grupo" class= "js-switch" checked /><script>switcheryLoad();</script >');

                } else {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Grupo" class= "js-switch" unchecked /><script>switcheryLoad();</script >');

                }

                ////Bloque de Campos Adicionales

                $.post(
                    '/Organizacion/CamposAdicionales',
                    { strEntidad: 'TGGRUPO' },
                    (response) => {

                        console.log(response);
                        $('#containerCampose').empty();
                        response.forEach(element => {
                            //alert(element.strTitulo);

                            $('#containerCampose').append(
                                ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                                + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


                        });

                        $('#strGrupoCampo1').val(objDatosGrupo.strGrupoCampo1);
                        $('#strGrupoCampo2').val(objDatosGrupo.strGrupoCampo2);
                        $('#strGrupoCampo3').val(objDatosGrupo.strGrupoCampo3);
                        $('#strGrupoCampo4').val(objDatosGrupo.strGrupoCampo4);
                        $('#strGrupoCampo5').val(objDatosGrupo.strGrupoCampo5);
                    });


                //Bloque de llenados de CBO

                $("#cboJerarquia option").filter(function () {
                    return this.text == objDatosGrupo.strNomJerOrg;
                }).attr('selected', true);

                var id = $('#cboJerarquia option:selected').val();
                if (id == 0 || !id) {
                    $('#cbounidsupe').empty();
                    $('#cbounidsupe').attr('disabled', true);

                    return;
                }
                $.post(
                    '/Organizacion/getUnidxJerarquia',
                    { IntIdJerOrg: id },
                    (response) => {

                        if (true) {

                            response.forEach(element => {

                                $('#cbounidsupe').attr('disabled', false);
                                $('#cbounidsupe').append('<option value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>');
                                if (element.intIdUniOrg == objDatosGrupo.intIdUniOrg) {
                                    $("#cbounidsupe option").filter(function () {
                                        return this.text == objDatosGrupo.strDescripcion;
                                    }).attr('selected', true);
                                }


                            });

                        }
                    }
                ).fail(function (result) {
                    alert('ERROR ' + result.status + ' ' + result.statusText);
                });
                $('#cbounidsupe').empty();

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
function CamposAdicionalesGrupo() {

    $.post(
        '/Organizacion/CamposAdicionales',
        { strEntidad: 'TGGRUPO' },
        (response) => {

            console.log(response);
            $('#containerCampose').empty();
            response.forEach(element => {

                $('#containerCampose').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


            });
        });
}
$('#btn-save-change-grupo').on('click', function () {
        //Datos del Grupo

    var _uorg = $('#cbounidsupe option:selected').val();   //selected
    var _codigo = $('#txt-cod-Grupo').val();
    var _desc = $('#txt-desc-Grupo').val();
    var _activo = $('#chk-activo-Grupo').is(':checked');
    var _camp1 = $('#strGrupoCampo1').val();
    var _camp2 = $('#strGrupoCampo2').val();
    var _camp3 = $('#strGrupoCampo3').val();
    var _camp4 = $('#strGrupoCampo4').val();
    var _camp5 = $('#strGrupoCampo5').val();

        if (_codigo === '' || _desc === '' || _uorg === '') {
            new PNotify({
                title: 'Nuevo Grupo',
                text: 'Complete los campos obligatorios',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3',
                addclass: 'dark'
            });
            $('#notifry_error').html('');
            $('#notifry_errordes').html('');


            return;
        }

        if (_uorg === '') {
            _uorg = null;
        }
        var Grupo = {

            strCoGrupo: _codigo,
            strDesGrupo: _desc,
            intIdUniOrg: _uorg,
            strGrupoCampo1: _camp1,
            strGrupoCampo2: _camp2,
            strGrupoCampo3: _camp3,
            strGrupoCampo4: _camp4,
            strGrupoCampo5: _camp5,
            bitFlActivo: _activo,

        }
        $.post(
            '/Organizacion/RegistrarNuevoGrupo',
            { Grupo: Grupo },
            (response) => {
                console.log(response);
                if (response.type !== '') {

                    if (response.type === 'success') {
                   new PNotify({
                        title: 'Nuevo Grupo',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                     TablaGrupo();
                    $('.form-hide-grupo').hide();
                    } else {

                        if (response.type === 'info') {
                            var nomMantemiento = 'Grupo';
                            var campo = 'txt-cod-Grupo';
                            var msj = response.message;
                            var response = response.type;
                            var deta = 'notifry_error';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;

                        } else {

                            if (response.type === 'error') {

                                var nomMantemiento = 'Grupo';
                                var campo = 'txt-desc-Grupo';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errordes';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;
                            }


                        }
                    }

                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });

});
$('#btn-cancel-grupo').on('click', function () {
    $('.form-hide-grupo').hide();
});
$('#btn-update-grupo').on('click', function () {
    //Datos del Grupo

    var _uorg = $('#cbounidsupe option:selected').val();   //selected
    var _codigo = $('#txt-cod-Grupo').val();
    var _desc = $('#txt-desc-Grupo').val();
    var _activo = $('#chk-activo-Grupo').is(':checked');
    var _camp1 = $('#strGrupoCampo1').val();
    var _camp2 = $('#strGrupoCampo2').val();
    var _camp3 = $('#strGrupoCampo3').val();
    var _camp4 = $('#strGrupoCampo4').val();
    var _camp5 = $('#strGrupoCampo5').val();
    var _idcate = $('#txtIdGroup').val();

    if (_codigo === '' || _desc === '' || _uorg === '') {
        new PNotify({
            title: 'Actualización de Grupo',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');

        return;
    }

    if (_uorg === '') {
        _uorg = null;
    }
    var Grupo = {
        intIdGrupo: _idcate,
        strCoGrupo: _codigo,
        strDesGrupo: _desc,
        intIdUniOrg: _uorg,
        strGrupoCampo1: _camp1,
        strGrupoCampo2: _camp2,
        strGrupoCampo3: _camp3,
        strGrupoCampo4: _camp4,
        strGrupoCampo5: _camp5,
        bitFlActivo: _activo,

    }
    $.post(
        '/Organizacion/ActualizarGrupo',
        { objDatos: Grupo },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                     new PNotify({
                    title: 'Actualización de Grupo',
                    text: response.message,
                    type: response.type,
                    delay: 3000,
                    styling: 'bootstrap3'
                    });
                    TablaGrupo();
                $('.form-hide-grupo').hide();

                }
                else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Grupo';
                        var campo = 'txt-cod-Grupo';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {

                            var nomMantemiento = 'Grupo';
                            var campo = 'txt-desc-Grupo';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        }


                    }
                }
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });


});
/**---------------------------------------------- */
/**7. Tipo Personal */
/**------------------------------------------------------ */
$('#filActi').on('change', function () {

    TablaTipoPersonal();

});
$('#campJerar').on('change', function () {
    TablaTipoPersonal();
});
$('#filtro').keyup(function () {

    TablaTipoPersonal();
});
$('#btn-new-tipoPerso').on('click', function () {
    $('.form-hide-tipoPerso').show();
    $('#btn-update-tipoPerso').hide();
    $('#btn-save-change-tipoPerso').show();
    $.post(
        '/Organizacion/NuevoTipoPersonal',
        {},
        (response) => {
            if (response !== '') {
                $('.form-hide-tipoPerso .x_content').empty();
                $('.form-hide-tipoPerso .x_content').html(response);
                $('.form-hide-tipoPerso').show();
                BuscarUnidades();
                switcheryLoad();//checked verde

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
});
var _varTablaTipoPersonal;
function TablaTipoPersonal() {
    var filtrosActivo = $('#filActi').val();
    var filtrojer = $('#campJerar').val();
    var strfiltro = $('#filtro').val();

    $.post(
        '/Organizacion/getTablaFiltradaTipoPerson',
        { IntActivoFilter: filtrosActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
        (response) => {

                if (typeof _varTablaTipoPersonal !== 'undefined') {
                    _varTablaTipoPersonal.destroy();
                }
                _varTablaTipoPersonal = $('#tablaTipoPersonal').DataTable({
                    data: response,
                    columns: [

                        { data: 'strCoTiPers' },
                        { data: 'strDesTiPers' },
                        { data: 'strNomJerOrg' },
                        { data: 'strDescripcion' },
                        { data: 'FlActivo.strEstadoActivo' },
                        { data: null },
                        { data: 'IntIdTiPers' },
                        { data: 'bitFlActivo' },
                        { data: 'strTiPersCampo1' },
                        { data: 'strTiPersCampo2' },
                        { data: 'strTiPersCampo3' },
                        { data: 'strTiPersCampo4' },
                        { data: 'strTiPersCampo5' },
                        { data: 'IntIdUniOrg' },
                    ],
                    lengthMenu: [10, 25, 50],
                    responsive: true,
                    order: [[1, 'desc'], [2, 'desc']],
                    language: _datatableLanguaje,
                    columnDefs: [//ocultar y definir columnas
                        {
                            targets: [6],//intIdCargo
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [7],//bitFlActivo
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [8],//strCargoCampo1
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [9],//strCargoCampo2
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [10],//strCargoCampo3
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [11],//strCargoCampo4
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [12],//strCargoCampo5
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [13],//intIdUniOrg
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [5],
                            data: null,
                            defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                                '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
                        }
                    ],
                    dom: 'lBfrtip',
                });


            $('#tablaTipoPersonal tbody').on('click', 'tr button.btn-edit', function () {
                var data = _varTablaTipoPersonal.row($(this).parents('tr')).data();
                if (data == null) {
                    data = null;
                    var data = _varTablaTipoPersonal.row($(this).parents('li')).data();
                    cardarDatosTipoper(data);
                } else {
                    var data = _varTablaTipoPersonal.row($(this).parents('tr')).data();
                    cardarDatosTipoper(data);
                }
            });

            $('#tablaTipoPersonal tbody').on('click', 'tr button.btn-delete', function () {

                var data = _varTablaTipoPersonal.row($(this).parents('tr')).data();

                if (data == null) {
                    data = null;

                    var data = _varTablaTipoPersonal.row($(this).parents('li')).data();
                    intentEliminarTipoPersonal(data['IntIdTiPers'], data['strDesTiPers']);

                } else {

                    var data = _varTablaTipoPersonal.row($(this).parents('tr')).data();
                    intentEliminarTipoPersonal(data['IntIdTiPers'], data['strDesTiPers']);

                }


            });




            });



}
function intentEliminarTipoPersonal(idTipoPerson, strNomPerson) {

    swal({
        title: "Eliminar Cargo",
        text: "¿Está seguro de eliminar el Tipo de Personal   ''<strong>" + strNomPerson + "</strong>''   ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaTipoPerson(idTipoPerson);
        } else {
            swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}
function yesEliminaTipoPerson(idTipoPerson) {

    $.post(
        '/Organizacion/EliminarTipoPerson',
        { intIdTipo: idTipoPerson },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    TablaTipoPersonal('', '', '');
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
function cardarDatosTipoper(data) {

    $('#btn-update-tipoPerso').show();
    $('#btn-save-change-tipoPerso').hide();

    var objDatosTipoPer = {
        IntIdTiPers: data['IntIdTiPers'],
        strCoTiPers: data['strCoTiPers'],
        strDesTiPers: data['strDesTiPers'],
        strNomJerOrg: data['strNomJerOrg'],
        strDescripcion: data['strDescripcion'],
        intIdUniOrg: data['IntIdUniOrg'],

        strEstadoActivo: data['FlActivo']['strEstadoActivo'],
        bitFlActivo: data['FlActivo']['bitFlActivo'],

        strTiPersCampo1: data['strTiPersCampo1'],
        strTiPersCampo2: data['strTiPersCampo2'],
        strTiPersCampo3: data['strTiPersCampo3'],
        strTiPersCampo4: data['strTiPersCampo4'],
        strTiPersCampo5: data['strTiPersCampo5']


    }


    $.post(
        '/Organizacion/EditarTipoPerso',
        { ObjTipoper: objDatosTipoPer },
        (response) => {
            if (response !== '') {
                $('.form-hide-tipoPerso .x_content').empty();
                $('.form-hide-tipoPerso .x_content').html(response);
                $('.form-hide-tipoPerso').show();
                switcheryLoad();
                init_checkBox_styles();
                //  onchange_jerarquia();
                $('#txt-cod-TiPers').val(objDatosTipoPer.strCoTiPers);
                $('#txt-desc-TiPers').val(objDatosTipoPer.strDesTiPers);
                $('#txtIdTipPers').val(objDatosTipoPer.IntIdTiPers);


                //if (objDatosCargo.strEstadoActivo == 'Activo') {
                //    $('#chk-activo-Cargo ').prop('checked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = true;

                //} else {

                //    $('#chk-activo-Cargo ').prop('unchecked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = false;
                //}


                if (objDatosTipoPer.strEstadoActivo == 'Activo') {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-TiPers" class= "js-switch" checked /><script>switcheryLoad();</script >');

                } else {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-TiPers" class= "js-switch" unchecked /><script>switcheryLoad();</script >');

                }

                ////Bloque de Campos Adicionales

                $.post(
                    '/Organizacion/CamposAdicionales',
                    { strEntidad: 'TGTIPOPERSON' },
                    (response) => {

                        console.log(response);
                        $('#containerCamposea').empty();
                        response.forEach(element => {
                            //alert(element.strTitulo);

                            $('#containerCamposea').append(
                                ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                                + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


                        });

                        $('#strTiPersCampo1').val(objDatosTipoPer.strTiPersCampo1);
                        $('#strTiPersCampo2').val(objDatosTipoPer.strTiPersCampo2);
                        $('#strTiPersCampo3').val(objDatosTipoPer.strTiPersCampo3);
                        $('#strTiPersCampo4').val(objDatosTipoPer.strTiPersCampo4);
                        $('#strTiPersCampo5').val(objDatosTipoPer.strTiPersCampo5);
                    });


                //Bloque de llenados de CBO

                $("#cboJerarquia option").filter(function () {
                    return this.text == objDatosTipoPer.strNomJerOrg;
                }).attr('selected', true);

                var id = $('#cboJerarquia option:selected').val();
                if (id == 0 || !id) {
                    $('#cbounidsupe').empty();
                    $('#cbounidsupe').attr('disabled', true);

                    return;
                }
                $.post(
                    '/Organizacion/getUnidxJerarquia',
                    { IntIdJerOrg: id },
                    (response) => {

                        if (true) {

                            response.forEach(element => {

                                $('#cbounidsupe').attr('disabled', false);
                                $('#cbounidsupe').append('<option value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>');
                                if (element.intIdUniOrg == objDatosTipoPer.intIdUniOrg) {
                                    $("#cbounidsupe option").filter(function () {
                                        return this.text == objDatosTipoPer.strDescripcion;
                                    }).attr('selected', true);
                                }


                            });

                        }
                    }
                ).fail(function (result) {
                    alert('ERROR ' + result.status + ' ' + result.statusText);
                });
                $('#cbounidsupe').empty();

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
function CamposAdicionalesTipoPersonal() {

    $.post(
        '/Organizacion/CamposAdicionales',
        { strEntidad: 'TGTIPOPERSON' },
        (response) => {

            console.log(response);
            $('#containerCamposea').empty();
            response.forEach(element => {
                //alert(element.strTitulo);

                $('#containerCamposea').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


            });
        });
}
$('#btn-save-change-tipoPerso').on('click', function () {
        //Datos del Tipo de Personal

    var _uorg = $('#cbounidsupe option:selected').val();   //selected
    var _codigo = $('#txt-cod-TiPers').val();
    var _desc = $('#txt-desc-TiPers').val();
    var _activo = $('#chk-activo-TiPers').is(':checked');
    var _camp1 = $('#strTiPersCampo1').val();
    var _camp2 = $('#strTiPersCampo2').val();
    var _camp3 = $('#strTiPersCampo3').val();
    var _camp4 = $('#strTiPersCampo4').val();
    var _camp5 = $('#strTiPersCampo5').val();

        if (_codigo === '' || _desc === '' || _uorg === '') {
            new PNotify({
                title: 'Nuevo Tipo de Personal',
                text: 'Complete los campos obligatorios',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3',
                addclass: 'dark'
            });
            $('#notifry_error').html('');
            $('#notifry_errordes').html('');
            return;
        }


        if (_uorg === '') {
            _uorg = null;
        }

    var tipoPerson = {

            strCoTiPers: _codigo,
            strDesTiPers: _desc,
            intIdUniOrg: _uorg,
            strTiPersCampo1: _camp1,
            strTiPersCampo2: _camp2,
            strTiPersCampo3: _camp3,
            strTiPersCampo4: _camp4,
            strTiPersCampo5: _camp5,
            bitFlActivo: _activo,

        }
        $.post(
            '/Organizacion/RegistrarNuevoTipoPerson',
            { tipoPerson: tipoPerson },
            (response) => {
                console.log(response);
                if (response.type !== '') {

                    if (response.type === 'success') {
                    new PNotify({
                        title: 'Nuevo Tipo de Personal',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                        });
                        TablaTipoPersonal();
                        $('.form-hide-tipoPerso').hide();
                        return;
                    }
                    else {

                        if (response.type === 'info') {
                            var nomMantemiento = 'Tipo Personal';
                            var campo = 'txt-cod-TiPers';
                            var msj = response.message;
                            var response = response.type;
                            var deta = 'notifry_error';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;

                        } else {

                            if (response.type === 'error') {

                                var nomMantemiento = 'Tipo Personal';
                                var campo = 'txt-desc-TiPers';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errordes';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;
                            }


                        }
                    }
                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });

});
$('#btn-cancel-tipoPerso').on('click', function () {
    $('.form-hide-tipoPerso').hide();
});
$('#btn-update-tipoPerso').on('click', function () {

    //Datos de la categoria


    var _uorg = $('#cbounidsupe option:selected').val();   //selected
    var _codigo = $('#txt-cod-TiPers').val();
    var _desc = $('#txt-desc-TiPers').val();
    var _activo = $('#chk-activo-TiPers').is(':checked');
    var _camp1 = $('#strTiPersCampo1').val();
    var _camp2 = $('#strTiPersCampo2').val();
    var _camp3 = $('#strTiPersCampo3').val();
    var _camp4 = $('#strTiPersCampo4').val();
    var _camp5 = $('#strTiPersCampo5').val();
    var _idcate = $('#txtIdTipPers').val();

    if (_codigo === '' || _desc === '' || _uorg === '') {
        new PNotify({
            title: 'Actualizacion de Tipo de Personal',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }


    if (_uorg === '') {
        _uorg = null;
    }

    var tipoPerson = {
        IntIdTiPers: _idcate,
        strCoTiPers: _codigo,
        strDesTiPers: _desc,
        intIdUniOrg: _uorg,
        strTiPersCampo1: _camp1,
        strTiPersCampo2: _camp2,
        strTiPersCampo3: _camp3,
        strTiPersCampo4: _camp4,
        strTiPersCampo5: _camp5,
        bitFlActivo: _activo,

    }
    $.post(
        '/Organizacion/ActualizarTipoPerso',
        { objDatos: tipoPerson },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                 new PNotify({
                    title: 'Actualización de Tipo Personal',
                    text: response.message,
                    type: response.type,
                    delay: 3000,
                    styling: 'bootstrap3'
                });TablaTipoPersonal();
                $('.form-hide-tipoPerso').hide();
                }
                else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Tipo Personal';
                        var campo = 'txt-cod-TiPers';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {

                            var nomMantemiento = 'Tipo Personal';
                            var campo = 'txt-desc-TiPers';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        }


                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
});
/**------------------------------------------------------ */
/**8. Categoría */
/**------------------------------------------------------ */
$('#filActi').on('change', function () {

    TablaCategoria();

});
$('#campJerar').on('change', function () {

    TablaCategoria();
});
$('#filtro').keyup(function () {

    TablaCategoria();
});
$('#btn-new-categoria').on('click', function () {
    $('.form-hide-categoria').show();
    $('#btn-update-categoria').hide();
    $('#btn-save-change-categoria').show();
    $.post(
        '/Organizacion/NuevaCategoria',
        {},
        (response) => {
            if (response !== '') {
                $('.form-hide-categoria .x_content').empty();
                $('.form-hide-categoria .x_content').html(response);
                $('.form-hide-categoria').show();

                switcheryLoad();//checked verde
                CamposAdicionalesCategorias();
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
});
$('#btn-save-change-categoria').on('click', function () {

        //Datos de la categoria

        var _uorg = $('#cbounidsupe option:selected').val();   //selected
        var _codigo = $('#txt-cod-Categoria').val();
        var _desc = $('#txt-desc-Categoria').val();
        var _activo = $('#chk-activo-Categoria').is(':checked');
        var _camp1 = $('#txt-cam1-Categoria').val();
        var _camp2 = $('#txt-cam2-Categoria').val();
        var _camp3 = $('#txt-cam3-Categoria').val();
        var _camp4 = $('#txt-cam4-Categoria').val();
        var _camp5 = $('#txt-cam5-Categoria').val();

        if (_codigo === '' || _desc === '' || _uorg === '') {
            new PNotify({
                title: 'Nueva Categoría',
                text: 'Complete los campos obligatorios',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3',
                addclass: 'dark'
            });
            $('#notifry_error').html('');
            $('#notifry_errordes').html('');

            return;
        }


        if (_uorg === '') {
            _uorg = null;
        }

        var Categoria = {

            strCoCateg: _codigo,
            strDesCateg: _desc,
            intIdUniOrg: _uorg,
            strCateCampo1: _camp1,
            strCateCampo2: _camp2,
            strCateCampo3: _camp3,
            strCateCampo4: _camp4,
            strCateCampo5: _camp5,
            bitFlActivo: _activo,

        }

        $.post(
            '/Organizacion/RegistrarNuevaCategoria',
            { Categoria: Categoria },
            (response) => {
                console.log(response);
                if (response.type !== '') {

                    if (response.type === 'success') {
                        new PNotify({
                            title: 'Nueva Categoría',
                            text: response.message,
                            type: response.type,
                            delay: 3000,
                            styling: 'bootstrap3'
                        });
                        TablaCategoria();
                        $('.form-hide-categoria').hide();
                    }
                    else {

                        if (response.type === 'info') {
                            var nomMantemiento = 'Categoría';
                            var campo = 'txt-cod-Categoria';
                            var msj = response.message;
                            var response = response.type;
                            var deta = 'notifry_error';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;

                        } else {

                            if (response.type === 'error') {

                                var nomMantemiento = 'Categoría';
                                var campo = 'txt-desc-Categoria';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errordes';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;
                            }


                        }
                    }
                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });

    });
$('#btn-cancel-categoria').on('click', function () {
        $('.form-hide-categoria').hide();
});
var _varTablaCategoria;
function TablaCategoria() {
    var filtrosActivo = $('#filActi').val();
    var filtrojer = $('#campJerar').val();
    var strfiltro = $('#filtro').val();

	$.post(
		'/Organizacion/GetTablaFiltradaCategorias',
		{ IntActivoFilter: filtrosActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
        (response) => {

            if (typeof _varTablaCategoria !== 'undefined') {
                _varTablaCategoria.destroy();
            }
            _varTablaCategoria = $('#tablaCategoria').DataTable({
                data: response,
                columns: [

                    { data: 'strCoCateg' },
                    { data: 'strDesCateg' },
                    { data: 'strNomJerOrg' },
                    { data: 'strDescripcion' },
                    { data: 'FlActivo.strEstadoActivo' },
                    { data: null },
                    { data: 'intIdCateg' },
                    { data: 'bitFlActivo' },
                    { data: 'strCateCampo1' },
                    { data: 'strCateCampo2' },
                    { data: 'strCateCampo3' },
                    { data: 'strCateCampo4' },
                    { data: 'strCateCampo5' },
                    { data: 'intIdUniOrg' },
                ],
                lengthMenu: [10, 25, 50],
                responsive: true,
                order: [[1, 'desc'], [2, 'desc']],
                language: _datatableLanguaje,
                columnDefs: [//ocultar y definir columnas
                    {
                        targets: [6],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [7],//bitFlActivo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [8],//strCargoCampo1
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [9],//strCargoCampo2
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [10],//strCargoCampo3
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [11],//strCargoCampo4
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [12],//strCargoCampo5
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [13],//intIdUniOrg
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [5],
                        data: null,
                        defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                            '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
                    }
                ],
                dom: 'lBfrtip',
            });



            $('#tablaCategoria tbody').on('click', 'tr button.btn-edit', function () {
                var data = _varTablaCategoria.row($(this).parents('tr')).data();
                if (data == null) {
                    data = null;
                    var data = _varTablaCategoria.row($(this).parents('li')).data();
                    cardarDatosCategoria(data);
                } else {
                    var data = _varTablaCategoria.row($(this).parents('tr')).data();
                    cardarDatosCategoria(data);
                }
            });

            $('#tablaCategoria tbody').on('click', 'tr button.btn-delete', function () {

                var data = _varTablaCategoria.row($(this).parents('tr')).data();

                if (data == null) {
                    data = null;

                    var data = _varTablaCategoria.row($(this).parents('li')).data();
                    intentEliminarCategoria(data['intIdCateg'], data['strDesCateg']);

                } else {

                    var data = _varTablaCategoria.row($(this).parents('tr')).data();
                    intentEliminarCategoria(data['intIdCateg'], data['strDesCateg']);

                }


            });



        });


}
function intentEliminarCategoria(idCategoria, strNomCategoria) {

    swal({
        title: "Eliminar Categoría",
        text: "¿Está seguro de eliminar la categoría    ''<strong>" + strNomCategoria + "</strong>''   ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaCategoria(idCategoria);
        } else {
            swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}
function yesEliminaCategoria(idCategoria) {

    $.post(
        '/Organizacion/EliminarCategoria',
        { intIdCategoria: idCategoria },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    TablaCategoria('', '', '');
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
function cardarDatosCategoria(data) {

    $('#btn-update-categoria').show();
    $('#btn-save-change-categoria').hide();

    var objDatosCategoria = {
        intIdCateg: data['intIdCateg'],
        strCoCateg: data['strCoCateg'],
        strDesCateg: data['strDesCateg'],
        strNomJerOrg: data['strNomJerOrg'],
        strDescripcion: data['strDescripcion'],
        intIdUniOrg: data['intIdUniOrg'],

        strEstadoActivo: data['FlActivo']['strEstadoActivo'],
        bitFlActivo: data['FlActivo']['bitFlActivo'],

        strCateCampo1: data['strCateCampo1'],
        strCateCampo2: data['strCateCampo2'],
        strCateCampo3: data['strCateCampo3'],
        strCateCampo4: data['strCateCampo4'],
        strCateCampo5: data['strCateCampo5']


    }

    console.log(objDatosCategoria);

    $.post(
        '/Organizacion/EditarCategoria',
        { objCategoria: objDatosCategoria },
        (response) => {
            if (response !== '') {
                $('.form-hide-categoria .x_content').empty();
                $('.form-hide-categoria .x_content').html(response);
                $('.form-hide-categoria').show();
                switcheryLoad();
                init_checkBox_styles();
                //  onchange_jerarquia();
                $('#txt-cod-Categoria').val(objDatosCategoria.strCoCateg);
                $('#txt-desc-Categoria').val(objDatosCategoria.strDesCateg);
                $('#txtIdCate').val(objDatosCategoria.intIdCateg);


                //if (objDatosCargo.strEstadoActivo == 'Activo') {
                //    $('#chk-activo-Cargo ').prop('checked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = true;

                //} else {

                //    $('#chk-activo-Cargo ').prop('unchecked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = false;
                //}


                if (objDatosCategoria.strEstadoActivo == 'Activo') {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Categoria" class= "js-switch" checked /><script>switcheryLoad();</script >');

                } else {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Categoria" class= "js-switch" unchecked /><script>switcheryLoad();</script >');

                }

                ////Bloque de Campos Adicionales

                $.post(
                    '/Organizacion/CamposAdicionales',
                    { strEntidad: 'TGCATEGORIA' },
                    (response) => {

                        console.log(response);
                        $('#containerCampos').empty();
                        response.forEach(element => {

                            $('#containerCamposea').append(
                                ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                                + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');

                        });

                        $('#strCategoriaCampo1').val(objDatosCategoria.strCateCampo1);
                        $('#strCategoriaCampo2').val(objDatosCategoria.strCateCampo2);
                        $('#strCategoriaCampo3').val(objDatosCategoria.strCateCampo3);
                        $('#strCategoriaCampo4').val(objDatosCategoria.strCateCampo4);
                        $('#strCategoriaCampo5').val(objDatosCategoria.strCateCampo5);
                    });


                //Bloque de llenados de CBO

                $("#cboJerarquia option").filter(function () {
                    return this.text == objDatosCategoria.strNomJerOrg;
                }).attr('selected', true);

                var id = $('#cboJerarquia option:selected').val();
                if (id == 0 || !id) {
                    $('#cbounidsupe').empty();
                    $('#cbounidsupe').attr('disabled', true);

                    return;
                }
                $.post(
                    '/Organizacion/getUnidxJerarquia',
                    { IntIdJerOrg: id },
                    (response) => {

                        if (true) {

                            response.forEach(element => {

                                $('#cbounidsupe').attr('disabled', false);
                                $('#cbounidsupe').append('<option value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>');
                                if (element.intIdUniOrg == objDatosCategoria.intIdUniOrg) {
                                    $("#cbounidsupe option").filter(function () {
                                        return this.text == objDatosCategoria.strDescripcion;
                                    }).attr('selected', true);
                                }


                            });

                        }
                    }
                ).fail(function (result) {
                    alert('ERROR ' + result.status + ' ' + result.statusText);
                });
                $('#cbounidsupe').empty();

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
function CamposAdicionalesCategorias() {

    $.post(
        '/Organizacion/CamposAdicionales',
        { strEntidad: 'TGCATEGORIA' },
        (response) => {

            console.log(response);
            $('#containerCamposea').empty();
            response.forEach(element => {

                $('#containerCamposea').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


            });
        });
}
$('#btn-update-categoria').on('click', function () {

    //Datos de la categoria

    var _uorg = $('#cbounidsupe option:selected').val();   //selected
    var _codigoCate = $('#txt-cod-Categoria').val();
    var _descCate = $('#txt-desc-Categoria').val();
    var _activo = $('#chk-activo-Categoria').is(':checked');
    var _camp1 = $('#strCategoriaCampo1').val();
    var _camp2 = $('#strCategoriaCampo2').val();
    var _camp3 = $('#strCategoriaCampo3').val();
    var _camp4 = $('#strCategoriaCampo4').val();
    var _camp5 = $('#strCategoriaCampo5').val();
    var _idcate = $('#txtIdCate').val();

    if (_codigoCate === '' || _descCate === '' || _uorg === '') {
        new PNotify({
            title: 'Actualizacion de Categoria',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');

        return;
    }


    if (_uorg === '') {
        _uorg = null;
    }

    var Categoria = {
        intIdCateg: _idcate,
        strCoCateg: _codigoCate,
        strDesCateg: _descCate,
        intIdUniOrg: _uorg,
        strCateCampo1: _camp1,
        strCateCampo2: _camp2,
        strCateCampo3: _camp3,
        strCateCampo4: _camp4,
        strCateCampo5: _camp5,
        bitFlActivo: _activo,
    }
    $.post(
        '/Organizacion/ActualizarCategoria',
        { objDatos: Categoria },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    new PNotify({
                        title: 'Actualización de Categoría',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                    TablaCategoria();
                    $('.form-hide-categoria').hide();
                }
                else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Categoría';
                        var campo = 'txt-cod-Categoria';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {

                            var nomMantemiento = 'Categoría';
                            var campo = 'txt-desc-Categoria';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        }


                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

});
    /**------------------------------------------------------ */
    /**9. Cargo */
    /**----------------------------------------------------- */
    $('#btn-new-cargo').on('click', function () {
        $('.form-hide-Cargo').show();
        $('#btn-update-cargo').hide();
        $('#btn-save-change-cargo').show();

        $.post(
            '/Organizacion/NuevoCargo',
            {},
            (response) => {
                if (response !== '') {
                    $('.form-hide-cargo .x_content').empty();
                    $('.form-hide-cargo .x_content').html(response);
                    $('.form-hide-cargo').show();
                    //BuscarUnidades();
                    CamposAdicionalesCargo();
                    switcheryLoad();//checked verde
                    var txtCod = 'strCoCargo';
                    var txtdes = 'strDesCargo';
                    //var txtcamp1 = 'strCargoCampo1';
                    //var txtcamp2 = 'strCargoCampo2';
                    //var txtcamp3 = 'strCargoCampo3';
                    //var txtcamp4 = 'strCargoCampo4';
                    //var txtcamp5 = 'strCargoCampo5';
                    //var valor;

                    $.post(
                        '/Organizacion/Validaciones',
                        {},
                        (response) => {


                            //$('#containerCampos').empty();
                            response.forEach(element => {
                                //    //alert(element.strTitulo);

                                if (element.strCoCargo == txtCod) {

                                    $('#ValCode').html('<label>Código (*)</label><input id = "txt-cod-Cargo" type = "text" class= "form-control" placeholder = "Nº Terminal" maxlength="' + element.intIdCargo + '"/>');
                                } if (element.strCoCargo == txtdes) {
                                    $('#Valdes').html('<label>Descripcion (*)</label><input id = "txt-desc-Cargo" type = "text" class= "form-control" placeholder = "Nº Terminal" maxlength="' + element.intIdCargo + '"/>');

                                } //if (element.strCoCargo == txtcamp1) {
                                //    alert(valor);
                                //    valor = element.intIdCargo;
                                //    alert(valor+'1');
                                //} if (element.strCoCargo == txtcamp2) {

                                //    valor = element.intIdCargo;

                                //} if (element.strCoCargo == txtcamp3) {

                                //    valor = element.intIdCargo;


                                //} if (element.strCoCargo == txtcamp4) {

                                //    valor = element.intIdCargo;

                                //} if (element.strCoCargo == txtcamp5) {

                                //    valor = element.intIdCargo;
                                //}

                            });
                        });


                }

            });

    });
    $('#btn-cancel-cargo').on('click', function () {
    $('.form-hide-cargo').hide();
});
    function BuscarUnidades() {
        $('#cboJerarquia').on('change', function () {
            var id = $('#cboJerarquia option:selected').val();

            if (id == 0 || !id) {
                $('#cbounidsupe').empty();
                $('#cbounidsupe').attr('disabled', true);

                return;
            }
            $.post(
                '/Organizacion/getUnidxJerarquia',
                { IntIdJerOrg: id },
                (response) => {
                    if (true) {
                        console.log(response);
                        response.forEach(element => {
                            $('#cbounidsupe').attr('disabled', false);
                            $('#cbounidsupe').append('<option value="' + element.intIdUniOrg + '">' + element.strDescripcion + '</option>');
                        });

                    }
                }
            ).fail(function (result) {
                alert('ERROR ' + result.status + ' ' + result.statusText);
            });
            $('#cbounidsupe').empty();
        });
    }
    function CargarUnidOreg() {

        var id = $('#cboJerarquia option:selected').val();

        if (id == 0 || !id) {
            $('#cbounidsupe').empty();
            $('#cbounidsupe').attr('disabled', true);

            return;
        }
        $.post(
            '/Organizacion/getUnidxJerarquia',
            { IntIdJerOrg: id },
            (response) => {
                if (true) {
                    console.log(response);
                    response.forEach(element => {
                        $('#cbounidsupe').attr('disabled', false);
                        $('#cbounidsupe').append('<option value="' + element.intIdUniOrg + '">' + element.strDescripcion + '</option>');
                    });

                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });
        $('#cbounidsupe').empty();

    }
     var _varTablaCCosto;
    function TablaCargos() {

        var filtrosActivo = $('#filActi').val();
        var filtrojer = $('#campJerar').val();
        var strfiltro = $('#filtro').val();

        $.post(
            '/Organizacion/getTablaFiltradaCargos',
            { IntActivoFilter: filtrosActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
            (response) => {
                console.log(response);
                if (typeof _varTablaCargo !== 'undefined') {
                    _varTablaCargo.destroy();
               }
                _varTablaCargo = $('#tablacargo').DataTable({
                    data: response,
                    columns: [

                        { data: 'strCoCargo' },
                        { data: 'strDesCargo' },
                        { data: 'strNomJerOrg' },
                        { data: 'strDescripcion' },
                        { data: 'FlActivo.strEstadoActivo'},
                        { data: null },
                        { data: 'intIdCargo' },
                        { data: 'bitFlActivo' },
                        { data: 'strCargoCampo1' },
                        { data: 'strCargoCampo2' },
                        { data: 'strCargoCampo3' },
                        { data: 'strCargoCampo4' },
                        { data: 'strCargoCampo5' },
                        { data: 'intIdUniOrg' },
                    ],
                    lengthMenu: [10, 25, 50],
                    responsive: true,
                    order: [[1, 'desc'], [2, 'desc']],
                    language: _datatableLanguaje,
                    columnDefs: [//ocultar y definir columnas
                        {
                            targets: [6],//intIdCargo
                            visible: false,
                            searchable: true
                        },
                        {
                            targets: [7],//bitFlActivo
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [8],//strCargoCampo1
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [9],//strCargoCampo2
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [10],//strCargoCampo3
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [11],//strCargoCampo4
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [12],//strCargoCampo5
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [13],//intIdUniOrg
                            visible: false,
                            searchable: false
                        },
                      {
                          targets: [5],
                          data: null,
                          defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                                '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
                        }
                    ],
                    dom: 'lBfrtip',
                });



                $('#tablacargo tbody').on('click', 'tr button.btn-edit', function () {
                    var data = _varTablaCargo.row($(this).parents('tr')).data();
                    if (data == null) {
                        data = null;
                        var data = _varTablaCargo.row($(this).parents('li')).data();
                        cardarDatosCargo(data);
                    } else {
                        var data = _varTablaCargo.row($(this).parents('tr')).data();
                        cardarDatosCargo(data);
                    }
                });

                $('#tablacargo tbody').on('click', 'tr button.btn-delete', function () {

                    var data = _varTablaCargo.row($(this).parents('tr')).data();

                    if (data == null) {
                        data = null;

                        var data = _varTablaCargo.row($(this).parents('li')).data();
                        intentEliminarCargo(data['intIdCargo'], data['strDesCargo']);

                    } else {

                        var data = _varTablaCargo.row($(this).parents('tr')).data();
                        intentEliminarCargo(data['intIdCargo'], data['strDesCargo']);

                    }


                });



            });


    }
    function intentEliminarCargo(idCargo, strNomCargo) {

    swal({
        title: "Eliminar Cargo",
        text: "¿Está seguro de eliminar el Cargo    ''<strong>" + strNomCargo + "</strong>''   ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaCargo(idCargo);
        } else {
            swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}
    function yesEliminaCargo(idCargo) {
    $.post(
        '/Organizacion/EliminarCargo',
        { intIdCargo: idCargo },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    TablaCargos('','','');
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
    $('#filActi').on('change', function () {
        TablaCargos();

    });
    $('#campJerar').on('change', function () {
        TablaCargos();

    });
    $('#filtro').keyup(function () {

        TablaCargos();
});
    function cardarDatosCargo(data) {

    $('#btn-update-cargo').show();
    $('#btn-save-change-cargo').hide();

    var objDatosCargo = {
        intIdCargo: data['intIdCargo'],
        strCoCargo: data['strCoCargo'],
        strDesCargo: data['strDesCargo'],
        strNomJerOrg: data['strNomJerOrg'],
        strDescripcion: data['strDescripcion'],
        intIdUniOrg: data['intIdUniOrg'],

            strEstadoActivo: data['FlActivo']['strEstadoActivo'],
            bitFlActivo: data['FlActivo']['bitFlActivo'],

        strCargoCampo1: data['strCargoCampo1'],
        strCargoCampo2: data['strCargoCampo2'],
        strCargoCampo3: data['strCargoCampo3'],
        strCargoCampo4: data['strCargoCampo4'],
        strCargoCampo5: data['strCargoCampo5']


    }

    console.log(objDatosCargo);

    $.post(
        '/Organizacion/EditarCargo',
        { objCargo: objDatosCargo },
        (response) => {
            if (response !== '') {
                $('.form-hide-cargo .x_content').empty();
                $('.form-hide-cargo .x_content').html(response);
                $('.form-hide-cargo').show();
                switcheryLoad();
                init_checkBox_styles();
                //  onchange_jerarquia();
                $('#txt-cod-Cargo').val(objDatosCargo.strCoCargo);
                $('#txt-desc-Cargo').val(objDatosCargo.strDesCargo);
                $('#txt-desc-Cargo').val(objDatosCargo.strDesCargo);
                $('#txtIdCar').val(objDatosCargo.intIdCargo);


                //if (objDatosCargo.strEstadoActivo == 'Activo') {
                //    $('#chk-activo-Cargo ').prop('checked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = true;

                //} else {

                //    $('#chk-activo-Cargo ').prop('unchecked', true);
                //    alert($('#chk-activo-Cargo').is(':checked'));
                //    blnActivo = false;
                //}


                if (objDatosCargo.strEstadoActivo == 'Activo') {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Cargo" class= "js-switch" checked /><script>switcheryLoad();</script >');

                } else {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Cargo" class= "js-switch" unchecked /><script>switcheryLoad();</script >');

                }

                ////Bloque de Campos Adicionales

                $.post(
                    '/Organizacion/CamposAdicionales',
                    { strEntidad: 'TGCARGO' },
                    (response) => {

                        console.log(response);
                        $('#containerCampose').empty();
                        response.forEach(element => {

                            $('#containerCampose').append(
                                ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                                + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');



                        });

                        $('#strCargoCampo1').val(objDatosCargo.strCargoCampo1);
                        $('#strCargoCampo2').val(objDatosCargo.strCargoCampo2);
                        $('#strCargoCampo3').val(objDatosCargo.strCargoCampo3);
                        $('#strCargoCampo4').val(objDatosCargo.strCargoCampo4);
                        $('#strCargoCampo5').val(objDatosCargo.strCargoCampo5);
                    });


                //Bloque de llenados de CBO

                $("#cboJerarquia option").filter(function () {
                    return this.text == objDatosCargo.strNomJerOrg;
                }).attr('selected', true);

                var id = $('#cboJerarquia option:selected').val();
                if (id == 0 || !id) {
                    $('#cbounidsupe').empty();
                    $('#cbounidsupe').attr('disabled', true);

                    return;
                }
                $.post(
                    '/Organizacion/getUnidxJerarquia',
                    { IntIdJerOrg: id },
                    (response) => {

                        if (true) {

                            response.forEach(element => {

                                $('#cbounidsupe').attr('disabled', false);
                                $('#cbounidsupe').append('<option value="' + element.intIdUniOrg + '" >' + element.strDescripcion + '</option>');
                                if (element.intIdUniOrg == objDatosCargo.intIdUniOrg) {
                                    $("#cbounidsupe option").filter(function () {
                                        return this.text == objDatosCargo.strDescripcion;
                                    }).attr('selected', true);
                                }


                            });

                        }
                    }
                ).fail(function (result) {
                    alert('ERROR ' + result.status + ' ' + result.statusText);
                });
                $('#cbounidsupe').empty();

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
 //function BuscarIDjer() {

 //       // var idJer = $('#cboJerarquia option:selected').val();
 //       //var idOrg = $('#cbounidsupe option:selected').val();
 //       var codid = $('#txtIdCar').val();

 //       alert(codid);
 //       $.post(
 //           '/Organizacion/getCampoJerOrgxCargo',
 //           { intidCargo: codid },
 //           alert('2' + codid),
 //           (response) => {
 //               console.log(response);
 //               alert('13');
 //               if (true) {
 //                   console.log(response);
 //                   response.forEach(element => {
 //                       $('#cbounidsupe').attr('disabled', false);
 //                       $('#cbounidsupe').select('<option value="' + element.intIdUniOrg + '"></option>');
 //                   });

 //               }
 //           }
 //       ).fail(function (result) {
 //           alert('ERROR ' + result.status + ' ' + result.statusText);
 //       });
 //       $('#cbounidsupe').empty();


 //   }
    //function BuscarCargo() {
    //    var filtrosActivo = $('#filActi').val();
    //    var filtrojer = $('#campJerar').val();
    //    var strfiltro = $('#filtro').val();
    //    var activado;
    //   // var cargo = $('#tablacargo');

    //    $.post(
    //        '/Organizacion/getTablaFiltradaCargos',
    //        { IntActivoFilter: filtrosActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
    //        (response) => {

    //                $('#tablacargo tbody').empty();

    //            response.forEach(element => {
    //                if (element.bitFlActivo) {
    //                activado = "Activo";
    //            }
    //            else {
    //                activado = "Inactivo";
    //                }

    //          $('#tablaBodyCargo').append(
    //              '<tr intid="' + element.intIdCargo + '"  idact="' + activado + '" idcar="' + element.strCoCargo + '"   iddesc="' + element.strDesCargo + '"   > <th>' + element.strCoCargo + '</th > <th> ' + element.strDesCargo + '</th > <th > ' + element.strNomJerOrg + '</th><th >' + element.strDescripcion + '</th ><th>' + activado + ' </th><th><a href="#"  class="btn btn-success btn-xs btn-edit"><i class="fa fa-pencil"></i> Editar  </a>' + '<a href = "#"  class= "btn btn-primary btn-xs  btn-dele" > <i class="fa fa-trash-o"></i> Eliminar </a ></th></tr>'
    //                );
    //            });
    //            EditarCargo();
    //            intentEliminarCarg();
    //        });
    //}
function CamposAdicionalesCargo() {

    $.post(
        '/Organizacion/CamposAdicionales',
        { strEntidad: 'TGCARGO' },
        (response) => {

            console.log(response);
            $('#containerCampos').empty();
            response.forEach(element => {

                $('#containerCampos').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


            });
        });
}
    $('#btn-save-change-cargo').on('click', function () {
        //Datos del Cargo

        var _uorg = $('#cbounidsupe option:selected').val();    //selected
        var _codigo = $('#txt-cod-Cargo').val();
        var _desc = $('#txt-desc-Cargo').val();
        var _activo = $('#chk-activo-Cargo').is(':checked');
        if ($('#strCargoCampo1').val() == null) {
            var _camp1 = null;
        } else {
            var _camp1 = $('#strCargoCampo1').val();
        }
        if ($('#strCargoCampo2').val() == null) {
            var _camp2 = null;
        } else {
            var _camp2 = $('#strCargoCampo2').val();
        } if ($('#strCargoCampo3').val() == null) {
            var _camp3 = null;
        } else {
            var _camp3 = $('#strCargoCampo3').val();
        } if ($('#strCargoCampo4').val() == null) {
            var _camp4 = null;
        } else {
            var _camp4 = $('#strCargoCampo4').val();
        } if ($('#strCargoCampo5').val() == null) {
            var _camp5 = null;
        } else {
            var _camp5 = $('#strCargoCampo5').val();
        }

        if (_codigo === '' || _desc === '' || _uorg === '') {

            new PNotify({
                title: 'Nuevo Cargo',
                text: 'Complete los campos obligatorios',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3',
                addclass: 'dark'
            });
            $('#notifry_error').html('');
            $('#notifry_errordes').html('');

            return;
        }


        if (_uorg === '') {
            _uoPadre = null;
        }

        var Cargo = {

            strCoCargo: _codigo,
            strDesCargo: _desc,
            intIdUniOrg: _uorg,
            strCargoCampo1: _camp1,
            strCargoCampo2: _camp2,
            strCargoCampo3: _camp3,
            strCargoCampo4: _camp4,
            strCargoCampo5: _camp5,
            bitFlActivo: _activo,



        }

        $.post(
            '/Organizacion/RegistrarNuevoCargo',
            { Cargo: Cargo },
            (response) => {
                console.log(response);

                if (response.type !== '') {

                    if (response.type === 'success') {
                        new PNotify({
                            title: 'Nuevo Cargo',
                            text: response.message,
                            type: response.type,
                            delay: 3000,
                            styling: 'bootstrap3'

                        });
                        $('.form-hide-cargo').hide();
                        TablaCargos();

                    }
                    else {

                        if (response.type === 'info') {
                             var nomMantemiento = 'Cargo';
                              var campo = 'txt-cod-Cargo';
                              var msj = response.message;
                              var response = response.type;
                              var deta = 'notifry_error';
                              INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                              return;

                            } else {

                            if (response.type === 'error') {

                            var nomMantemiento = 'Cargo';
                            var campo = 'txt-desc-Cargo';
                            var msj = response.message;
                            var response = "info";
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                              }


                          }

                    }




                }
            }

        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
            });


});
    $('#btn-update-cargo').on('click', function () {
        //Datos del Cargo
        var _codcargo = $('#txtIdCar').val();
        var _uorg = $('#cbounidsupe option:selected').val();    //selected
        var _codigo = $('#txt-cod-Cargo').val();
        var _desc = $('#txt-desc-Cargo').val();
        var _activo = $('#chk-activo-Cargo').is(':checked');
        if ($('#strCargoCampo1').val() == null) {
            var _camp1 = null;
        } else {
            var _camp1 = $('#strCargoCampo1').val();
        }
        if ($('#strCargoCampo2').val() == null) {
            var _camp2 = null;
        } else {
            var _camp2 = $('#strCargoCampo2').val();
        } if ($('#strCargoCampo3').val() == null) {
            var _camp3 = null;
        } else {
            var _camp3 = $('#strCargoCampo3').val();
        } if ($('#strCargoCampo4').val() == null) {
            var _camp4 = null;
        } else {
            var _camp4 = $('#strCargoCampo4').val();
        } if ($('#strCargoCampo5').val() == null) {
            var _camp5 = null;
        } else {
            var _camp5 = $('#strCargoCampo5').val();
        }

        if (_codigo === '' || _desc === '' || _uorg === 0) {
            new PNotify({
                title: 'Actualizacion de Cargo',
                text: 'Complete los campos obligatorios',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3',
                addclass: 'dark'
            });
            $('#notifry_error').html('');
            $('#notifry_errordes').html('');

            return;
        }


        if ( _uorg === 0) {
            new PNotify({
                title: 'Actualizacion de Cargo',
                text: 'Complete los campos obligatorios',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3',
                addclass: 'dark'
            });
            return;
        }


        if (_uorg === '') {
            _uoPadre = null;
        }


        var Cargo = {
            intIdCargo: _codcargo,
            strCoCargo: _codigo,
            strDesCargo: _desc,
            intIdUniOrg: _uorg,
            strCargoCampo1: _camp1,
            strCargoCampo2: _camp2,
            strCargoCampo3: _camp3,
            strCargoCampo4: _camp4,
            strCargoCampo5: _camp5,
            bitFlActivo: _activo,




        }

        $.post(
            '/Organizacion/ActualizarCargo',
            { objDatos: Cargo },
            (response) => {
                console.log(response);
                if (response.type !== '') {

                    if (response.type === 'success') {
                        new PNotify({
                        title: 'Actualización de Cargo',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                        });
                        TablaCargos();
                    $('.form-hide-cargo').hide();
                    } else {

                        if (response.type === 'info') {
                            var nomMantemiento = 'Cargo';
                            var campo = 'txt-cod-Cargo';
                            var msj = response.message;
                            var response = response.type;
                            var deta = 'notifry_error';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;

                        } else {

                            if (response.type === 'error') {

                                var nomMantemiento = 'Cargo';
                                var campo = 'txt-desc-Cargo';
                                var msj = response.message;
                                var response = "info";
                                var deta = 'notifry_errordes';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;
                            }


                        }

                    }


                }
            }

        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });

    });
    /**----------------------------------------------------- */
    /**10. Unidad Organizacional */
    /**----------------------------------------------------- */
$('#filActi').on('change', function () {

    TablaUnidadOrg();

});
$('#campJerar').on('change', function () {
    TablaUnidadOrg();

});
$('#filtro').keyup(function () {

    TablaUnidadOrg();
});
function GetCampJerar() {
    $.post(
        '/Organizacion/GetCampJerar',
        {},
        (response) => {
            response.forEach(element => {
                $('#campJerar').append(
                    ' <option value="' + element.IntIdJerOrg + '">' + element.strNomJerOrg + '</option>'
                );
            });
        }
    );
}
function intentEliminarUndOrg(idUndOrg, strDesc) {
    swal({
        title: "Eliminar Unidad Organizacional",
        text: "¿Está seguro de eliminar la Unidad Organizacional    ''<strong>" + strDesc + "</strong>''   ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaUndOrg(idUndOrg);
        } else {
            swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}
function yesEliminaUndOrg(idUndOrg) {
    $.post(
        '/Organizacion/EliminarUnidad',
        { intIdUniOrg: idUndOrg },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    TablaUnidadOrg('', '', '');
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
var _varTablaUndOrg;
function TablaUnidadOrg() {
    var filtroActivo = $('#filActi').val();
    var strfiltro = $('#filtro').val();

    var filtrojer = $('#campJerar').val();
    $.post(
        '/Organizacion/GetTablaUnidOrg',
        { IntActivoFilter: filtroActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
        (response) => {

            if (typeof _varTablaUndOrg !== 'undefined') {
                _varTablaUndOrg.destroy();
            }
            _varTablaUndOrg = $('#tablaUnidOrg').DataTable({
                data: response,
                columns: [

                    { data: 'strCodigo' },
                    { data: 'strDescripcion' },
                    { data: 'strNomJerOrg' },
                    { data: 'strDescripcionSup' },
                    { data: 'FlActivo.strEstadoActivo' },
                    { data: null },
                    { data: 'intIdUniOrg' },
                    { data: 'intIdUniOrgSup' },
                    { data: 'strRuc' },
                    { data: 'strDirLogo' },
                    { data: 'intIdPerResp' },
                    { data: 'intIdRepLeg' },
                    { data: 'strDirFiscal' },
                    { data: 'intidTipoVia' },
                    { data: 'intIdUbigeo' },
                    { data: 'strUOCampo1' },
                    { data: 'strUOCampo2' },
                    { data: 'strUOCampo3' },
                    { data: 'strUOCampo4' },
                    { data: 'strUOCampo5' },


                ],
                lengthMenu: [10, 25, 50],
                order: [[1, 'desc'], [2, 'desc']],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [//ocultar y definir columnas
                    {
                        targets: [6],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [7],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [8],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [9],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [10],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [11],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [12],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [13],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [14],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [15],//intIdCargo
                        visible: false,
                        searchable: false
                    }, {
                        targets: [16],//intIdCargo
                        visible: false,
                        searchable: false
                    }, {
                        targets: [17],//intIdCargo
                        visible: false,
                        searchable: false
                    }, {
                        targets: [18],//intIdCargo
                        visible: false,
                        searchable: false
                    }, {
                        targets: [19],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [5],
                        data: null,
                        defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                            '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
                    }
                ],
                dom: 'lBfrtip',
            });


            _varTablaUndOrg
                .order([1, 'asc'])
                .draw();

            $('#tablaUnidOrg  tbody').on('click', 'tr button.btn-edit', function () {
                var data = _varTablaUndOrg.row($(this).parents('tr')).data();
                if (data == null) {
                    data = null;
                    var data = _varTablaUndOrg.row($(this).parents('li')).data();
                    cardarDatosUndOrg(data);
                } else {
                    var data = _varTablaUndOrg.row($(this).parents('tr')).data();
                    cardarDatosUndOrg(data);
                }

            });

            $('#tablaUnidOrg  tbody').on('click', 'tr button.btn-delete', function () {

                var data = _varTablaUndOrg.row($(this).parents('tr')).data();

                if (data == null) {
                    data = null;

                    var data = _varTablaUndOrg.row($(this).parents('li')).data();
                    intentEliminarUndOrg(data['intIdUniOrg'], data['strDescripcion']);

                } else {

                    var data = _varTablaUndOrg.row($(this).parents('tr')).data();
                    intentEliminarUndOrg(data['intIdUniOrg'], data['strDescripcion']);

                }


            });

        });

}
function cardarDatosUndOrg(data) {

    $('#btn-update-undOrganiza').show();
    $('#btn-save-change-undOrganiza').hide();

    var strCodigo = data['strCodigo'];
    var strDescripcion = data['strDescripcion'];

    var strNomJerOrg = data['strNomJerOrg'];
    var intIdUniOrg = data['intIdUniOrg'];
    var intIdUniOrgSup = data['intIdUniOrgSup'];
    var strRuc = data['strRuc'];
    var RutImg = data['strDirLogo'];
    var intIdPerResp = data['intIdPerResp'];
    var intIdRepLeg = data['intIdRepLeg'];
    var strDirFiscal = data['strDirFiscal'];
    var intidTipoVia = data['intidTipoVia'];
    var intIdUbigeo = data['intIdUbigeo'];
    var strUOCampo1 = data['strUOCampo1'];
    var strUOCampo2 = data['strUOCampo2'];
    var strUOCampo3 = data['strUOCampo3'];
    var strUOCampo4 = data['strUOCampo4'];
    var strUOCampo5 = data['strUOCampo5'];

    var Provincia;

    $.post(
        '/Organizacion/EditarUnidadOrg',
        { intIdUniOrg: data.intIdUniOrg },
        (response) => {
            if (response !== '') {

                $('.form-hide-undOrganiza .x_content').empty();
                $('.form-hide-undOrganiza .x_content').html(response);
                $('.form-hide-undOrganiza').show();
                $('#btn-save-change-undOrganiza').hide();
                $('#btn-update-undOrganiza').show();
                switcheryLoad();

                init_checkBox_styles();
                //  onchange_jerarquia();



                $.post(
                    '/Organizacion/ObtenerOrganizacionPorsuPK',
                    { intIdOrganizacion: data.intIdUniOrg },
                    (response) => {

                        console.log(response);
                        response.forEach(element => {

                            $("#cboJerarquia option").filter(function () {
                                return this.text == element.strNomJerOrg;
                            }).attr('selected', true);


                            var idER = $("#cboJerarquia").val();

                            $.post(
                                '/Organizacion/getUnidSup',
                                { IntIdJerOrg: idER },
                                (response) => {
                                    if (true) {
                                        response.forEach(element => {
                                            $('#cbounidsup').attr('disabled', false);
                                            $('#cbounidsup').append('<option value="' + element.intIdUniOrg + '">' + element.strDescripcion + '</option>');


                                        });
                                        if (idER !== 0 || idER !== '') {
                                            $('#cbounidsup').attr('disabled', false);
                                            $('#cbounidsup').val(element.intIdUniOrgSup);
                                        }
                                    }
                                }
                            ).fail(function (result) {
                                alert('ERROR ' + result.status + ' ' + result.statusText);
                            });


                            $.post(
                                '/Organizacion/CamposAdicionales',
                                { strEntidad: 'TGUNIDORG' },
                                (response) => {

                                    console.log(response);
                                    $('#containerCamposea').empty();
                                    response.forEach(element => {

                                        $('#containerCamposea').append(
                                            ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                                            + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');

                                    });

                                    $('#strUOCampo1').val(element.strUOCampo1);
                                    $('#strUOCampo2').val(element.strUOCampo2);
                                    $('#strUOCampo3').val(element.strUOCampo3);
                                    $('#strUOCampo4').val(element.strUOCampo4);
                                    $('#strUOCampo5').val(element.strUOCampo5);
                                });
                            $('#idorg').val(element.intIdUniOrg);


                            OcultarIneDITAR();


                            $('#cboVia').val(element.intidTipoVia);
                            // $('#cbounidsup').attr('disabled', false);
                            //$('#cbounidsup').val(element.intIdUniOrgSup);

                            $('#txt-cod-UO').val(element.strCodigo);
                            $('#txt-desc-UO').val(element.strDescripcion);
                            $('#txt-dirfiscal-UO').val(element.strDirFiscal);

                            //$('#cboDisrict-UO').val(element.intIdUbigeo);

                            $('#cboRepPais-UO').val(element.intextra3);
                            $('#cboDeparment-UO').attr('disabled', false);



                            $('#idLegal').val(element.intIdRepLeg);
                            $('#idPerLeg').val(element.intIdPerResp);


                            $('#cboProvince-UO').empty();
                            $('#cboDisrict-UO').empty();
                            var paisId = $('#cboRepPais-UO option:selected').val();
                            paisId = $('#cboRepPais-UO').val();
                          ///////////
                            ////$('#cboDeparment-UO').attr('disabled', false);
                            ////$('#cboDeparment-UO').val(element.STRextra2);
                            ///////////////
                            ////$('#cboProvince-UO').attr('disabled', false);
                            ////$('#cboProvince-UO').val(element.STRextra1);
                            /////////////////
                            ////$('#cboDisrict-UO').attr('disabled', false);
                            ////$('#cboDisrict-UO').val(element.intIdUbigeo);

                            $.post(
                                '/Organizacion/getcboRepDep',
                                { intcodPais: paisId },

                                (response) => {
                                    if (true) {
                                        $('#cboDeparment-UO').empty();
                                        $('#cboDeparment-UO').attr('disabled', false);
                                        $('#cboDeparment-UO').append('<option value="00">Seleccione</option>');
                                        response.forEach(element2 => {

                                            $('#cboDeparment-UO').append('<option value="' + element2.strCoUbigeo + '">' + element2.strDesUbigeo + '</option>');
                                        });

                                        $('#cboDeparment-UO').val(element.STRextra2);
                                        $('#cboDisrict-UO').empty();
                                        var DepartId = $('#cboDeparment-UO option:selected').val();
                                        var PaisDepId = $('#cboRepPais-UO option:selected').val();
                                        $.post(
                                            '/Organizacion/getcboRepProvince',
                                            {
                                                strCoDep: DepartId,
                                                stridPaisDep: PaisDepId
                                            },
                                            (response) => {
                                                if (true) {
                                                    $('#cboProvince-UO').empty();
                                                    $('#cboProvince-UO').attr('disabled', false);
                                                    $('#cboProvince-UO').append('<option value="00">Seleccione</option>');
                                                    response.forEach(element => {
                                                        $('#cboProvince-UO').append('<option value="' + element.strCoUbigeo + '">' + element.strDesUbigeo + '</option>');
                                                    });
                                                    $('#cboProvince-UO').val(element.STRextra1);
                                                }

                                                var ProvinceID = $('#cboProvince-UO option:selected').val();
                                                var PaisDisId = $('#cboRepPais-UO option:selected').val();
                                                $.post(
                                                    '/Organizacion/getcboRepDistrict',
                                                    {
                                                        stridpaisProv: PaisDisId,
                                                        strCoDep: ProvinceID
                                                    },
                                                    (response) => {
                                                        if (true) {
                                                            $('#cboDisrict-UO').empty();
                                                            $('#cboDisrict-UO').attr('disabled', false);
                                                            $('#cboDisrict-UO').append('<option value="00">Seleccione</option>');
                                                            response.forEach(element => {
                                                                $('#cboDisrict-UO').append('<option value="' + element.intIdUbigeo + '">' + element.strDesUbigeo + '</option>');
                                                            });
                                                            $('#cboDisrict-UO').val(element.intIdUbigeo);
                                                        }

                                                    }
                                                ).fail(function (result) {
                                                    alert('ERROR ' + result.status + ' ' + result.statusText);
                                                });
                                            });
                                    }

                                });




                        });
                    });






                //////cboDisrict - UO
                //////cboProvince - UO
                //////cboDeparment - UO
                //////cboRepPais - UO















                //$.post(
                //    '/Organizacion/UbigeoInvertido',
                //    { intIdUbigeo: intIdUbigeo },
                //    (response) => {
                //        response.forEach(element => {

                //            if (element.intIdUbigeo == intIdUbigeo) {


                //                $('#cboRepPais-UO').val(element.intIdPais);
                //                $('#cboRepPais-UO').trigger('change');

                //                //$('#cboProvince-UO').val(element.intIdUbiSup);
                //                //$('#cboProvince-UO').trigger('change');
                //                var Ubigeo = element.strCoUbigeo; //strco exito
                //                Provincia = element.intIdUbiSup;


                //                $('#idprov').val(Provincia);

                //            }


                //        });

                //    });





                $('#txt-cod-UO').val(strCodigo);
                $('#txt-desc-UO').val(strDescripcion);
                $('#txt-dirfiscal-UO').val(strDirFiscal);
                $('#cboVia').val(intidTipoVia);
                $('#cboDisrict-UO').val(intIdUbigeo);






                var filtro = document.getElementById("Legal").value;
                console.log(filtro);

                var relacion = new Array();

                $.post(
                    '/Organizacion/getLegal',
                    { strfiltroLegal: filtro },
                    (response) => {
                        if (true) {
                            console.log(response);
                            lstRepLeg = response;
                            $(relacion).empty();

                            var i = 0;

                            response.forEach(element => {
                                if (element.IntIdRepLeg == intIdRepLeg) {
                                    relacion[i] = element.strNombres + ' ' + element.strApePaterno + ' ' + element.strApeMaterno;

                                    $('#Legal').empty();
                                    $('#Legal').val(relacion[i]);
                                }
                                i++;

                            });
                            $('#Legal').autocomplete({
                                source: [relacion]

                            }).on('selected.xdsoft', function (e, datum) {
                                console.log(datum);
                                idRL = lstRepLeg.find(x => x.strNombres + ' ' + x.strApePaterno + ' ' + x.strApeMaterno === datum).IntIdRepLeg;
                                console.log(idRL);
                                $('#idLegal').val(idRL);
                            });




                        }

                    }
                );






                var filtro = document.getElementById("Respon").value;
                console.log(filtro);
                var listado = new Array();
                $.post(
                    '/Organizacion/getRes',
                    { strfiltroPersonal: filtro },
                    (response) => {
                        console.log(response);
                        if (true) {

                            lstResp = response;
                            $(listado).empty();
                            var i = 0;

                            response.forEach(element => {
                                if (element.intIdPersonal == intIdPerResp) {
                                    listado[i] = element.strNombres + ' ' + element.strApePaterno + ' ' + element.strApeMaterno;

                                    $('#Respon').empty();
                                    $('#Respon').val(listado[i]);
                                }
                                i++;
                            });

                            $('#Respon').autocomplete({
                                source: [listado]
                            }).on('selected.xdsoft', function (e, datum) {
                                console.log(datum);
                                idRL = lstResp.find(x => x.strNombres + ' ' + x.strApePaterno + ' ' + x.strApeMaterno === datum).intIdPersonal;
                                console.log(idRL);
                                $('#idPerLeg').val(idRL);
                            });



                        }
                    }
                )

                $('#txt-ruc-UO').val(strRuc);
                // $('#txt-dirfiscal-UO').val(objDatosOrganizacion.strDirFiscal);
                // $('#cboDisrict-UO option:selected').val(objDatosOrganizacion.intIdUbigeo);
                //$('#imageupload').val(objDatosUndOrg.intIdCargo);
                if (RutImg !== '') {
                    $('#ViewPreview').html('<img id="imgCarga" src=' + RutImg + ' style="width:100px;height:100px" />');
                }
                if (response.strEstadoActivo == 'Activo') {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Cargo" class= "js-switch" checked /><script>switcheryLoad();</script >');

                } else {
                    $('#11').html('<label>Activo</label> <input type = "checkbox" id = "chk-activo-Cargo" class= "js-switch" unchecked /><script>switcheryLoad();</script >');

                }


                //            $("#cboJerarquia option").filter(function () {
                //                return this.text == strNomJerOrg;
                //            }).attr('selected', true);


                //            var idstr = id.toString();

                //            $.post(
                //                '/Organizacion/GetFiltroObliJer',
                //                { filtro: idstr },
                //                (response) => {
                //                    if (true) {
                //                        response.forEach(element => {

                //                            $('#' + element.strCoCampo).attr('hidden', false);
                //                            if (element.bitObligatorio == true) {
                //                                $('#' + element.strCoCampo).attr('requerid', true);
                //                            }
                //                        });
                //                    }
                //                }
                //            ).fail(function (result) {
                //                alert('ERROR ' + result.status + ' ' + result.statusText);
                //            });

                //        }
                //    }
                //).fail(function (result) {
                //    alert('ERROR ' + result.status + ' ' + result.statusText);
                //});

            }
        });
}
$('#btn-save-change-undOrganiza').on('click', function () {
   // var UnidadOrg = data.imgLogo;
    //var Byte _imgLogo;
    //Datos de la Unidad Organizacional
    var _nivelJerar = $('#cboJerarquia option:selected').val();   //selected
    var _uoPadre = $('#cbounidsup option:selected').val();
    var _codigo = $('#txt-cod-UO').val();
    var _desc = $('#txt-desc-UO').val();
    var _activo = $('#chk-activo-UO').is(':checked');

    if ($('#cboDisrict-UO  option:selected').val() == 0) {
        var _ubigeo = null;
    } else {
        var _ubigeo = $('#cboDisrict-UO  option:selected').val();
    }
    var _ubigeo = $('#cboDisrict-UO  option:selected').val();
    var _ruc = $('#txt-ruc-UO').val();
    var _legal = $('#idLegal').val();
    var _resp = $('#idPerLeg').val();
    var _via = $('#cboVia option:selected').val();

    var _dirfiscal = $('#txt-dirfiscal-UO').val();
    var _camp1 = $('#strUOCampo1').val();
    var _camp2 = $('#strUOCampo2').val();
    var _camp3 = $('#strUOCampo3').val();
    var _camp4 = $('#strUOCampo4').val();
    var _camp5 = $('#strUOCampo5').val();
    var _imgRuta = $('#txt-ruta').val();

    if (_nivelJerar === '' || _codigo === '' || _desc === '' || _uoPadre === '') {
        new PNotify({
            title: 'Nueva Unidad Organizacional',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        return;
    }


    if (_uoPadre === '') {
        _uoPadre = null;
    }

    var UnidadOrg = {
        strCodigo: _codigo,
        strDescripcion: _desc,
        intIdJerOrg: _nivelJerar,
        strCoJerPadre: _uoPadre,
        bitFlActivo: _activo,
        intIdUbigeo: _ubigeo,
        intIdUniOrgSup: _uoPadre,
        intIdRepLeg: _legal,
        intIdPerResp: _resp,
        intidTipoVia: _via,
        strRuc: _ruc,
        strDirLogo: _imgRuta,
        strDirFiscal: _dirfiscal,
        strUOcampo1: _camp1,
        strUOcampo2: _camp2,
        strUOcampo3: _camp3,
        strUOcampo4: _camp4,
        strUOcampo5: _camp5


    }



    function FiltroLegal() {
        var filtro = document.getElementById("Legal").value;
        console.log(filtro);
        var relacion = new Array();
        $.post(
            '/Organizacion/getLegal',
            { strfiltroLegal: filtro },
            (response) => {
                if (true) {

                    response.forEach(element => {
                        $('#txtPersonaResponsable').val(element.intIdRepLeg);


                    });
                }
            }
        )
    }




        $.post(
            '/Organizacion/RegistrarNuevaUnidad',
            { UnidadOrg: UnidadOrg },
            (response) => {


                console.log(response);


                if (response.type !== '') {


                    if (response.type === 'success') {


                        new PNotify({
                        title: 'Nueva Unidad Organizacional',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                        });

                        $('.form-hide-undOrganiza').hide();
                        TablaUnidadOrg();
                        return;

                    } else {

                        if (response.type === 'info') {
                            var nomMantemiento = 'Unidad Organizacional';
                            var campo = 'txt-cod-UO';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_error';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);

                            return;

                        } else {

                            if (response.type === 'error') {

                                var nomMantemiento = 'Unidad Organizacional';
                                var campo = 'txt-desc-UO';
                                var msj = response.message;
                                var response = "info";
                                var deta = 'notifry_errordes';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);


                                return;
                            } else if (response.type === 'errorGeneral') {
                                new PNotify({
                                    title: 'Nueva Unidad Organizacional',
                                    text: response.message,
                                    type: 'info',
                                    delay: 3000,
                                    styling: 'bootstrap3'
                                });
                                return;
                            }

                        }

                    }


                }

            }

        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });

});
$('#btn-update-undOrganiza').on('click', function () {

    // var UnidadOrg = data.imgLogo;
    //var Byte _imgLogo;
    //Datos de la Unidad Organizacional
    var _nivelJerar = $('#cboJerarquia option:selected').val();   //selected
    var _uoPadre = $('#cbounidsup option:selected').val();
    var _codigo = $('#txt-cod-UO').val();
    var _desc = $('#txt-desc-UO').val();
    var _activo = $('#chk-activo-UO').is(':checked');

    if ($('#cboDisrict-UO  option:selected').val() == 0) {
        var _ubigeo = null;
    } else {
        var _ubigeo = $('#cboDisrict-UO  option:selected').val();
    }
    var _ubigeo = $('#cboDisrict-UO  option:selected').val();
    var _ruc = $('#txt-ruc-UO').val();
    var _legal = $('#idLegal').val();
    var _resp = $('#idPerLeg').val();
    var _via = $('#cboVia option:selected').val();

    var _dirfiscal = $('#txt-dirfiscal-UO').val();
    var _camp1 = $('#strUOCampo1').val();
    var _camp2 = $('#strUOCampo2').val();
    var _camp3 = $('#strUOCampo3').val();
    var _camp4 = $('#strUOCampo4').val();
    var _camp5 = $('#strUOCampo5').val();
    var _imgRuta = $('#txt-ruta').val();
    var _intidorg = $('#idorg').val();

    if (_nivelJerar === '' || _codigo === '' || _desc === '' || _uoPadre === '') {
        new PNotify({
            title: 'Actualización Unidad Organizacional',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        return;
    }


    if (_uoPadre === '') {
        _uoPadre = null;
    }

    var UnidadOrg = {
        strCodigo: _codigo,
        strDescripcion: _desc,
        intIdJerOrg: _nivelJerar,
        strCoJerPadre: _uoPadre,
        bitFlActivo: _activo,
        intIdUbigeo: _ubigeo,
        intIdUniOrgSup: _uoPadre,
        intIdRepLeg: _legal,
        intIdPerResp: _resp,
        intidTipoVia: _via,
        strRuc: _ruc,
        strDirLogo: _imgRuta,
        strDirFiscal: _dirfiscal,
        strUOcampo1: _camp1,
        strUOcampo2: _camp2,
        strUOcampo3: _camp3,
        strUOcampo4: _camp4,
        strUOcampo5: _camp5,
        intIdUniOrg: _intidorg


    }



    //$.post(
    //    '/Organizacion/NuevaUnidadOrg',
    //    {},
    //    (response) => {
    //        if (response !== '') {
    //            $('.form-hide-undOrganiza .x_content').empty();
    //            $('.form-hide-undOrganiza .x_content').html(response);
    //            $('.form-hide-undOrganiza').show();
    //            switcheryLoad();
    //            BuscarUnidad();
    //            Ubigeo_Deparment();
    //            Ubigeo_Province();
    //            Ubigeo_District();
    //            FiltroLegal();
    //            FiltroRes();
    //            OcultarIn();


    //        }
    //    }
    //).fail(function (result) {
    //    alert('ERROR ' + result.status + ' ' + result.statusText);
    //});



    function FiltroLegal() {
        var filtro = document.getElementById("Legal").value;
        console.log(filtro);
        var relacion = new Array();
        $.post(
            '/Organizacion/getLegal',
            { strfiltroLegal: filtro },
            (response) => {
                if (true) {

                    response.forEach(element => {
                        $('#txtPersonaResponsable').val(element.intIdRepLeg);


                    });
                }
            }
        )

    }
        $.post(
            '/Organizacion/ActualizarNuevaUnidad',
            { UnidadOrg: UnidadOrg },
            (response) => {

                console.log(response);
                if (response.type !== '') {


                    if (response.type === 'success') {
                        new PNotify({
                            title: 'Actualización Unidad Organizacional',
                            text: response.message,
                            type: response.type,
                            delay: 3000,
                            styling: 'bootstrap3'
                        });
                        TablaUnidadOrg();
                        $('.form-hide-undOrganiza').hide();
                        return;
                    }
                    else {

                        if (response.type === 'info') {
                            var nomMantemiento = 'Unidad Organizacional';
                            var campo = 'txt-cod-UO';
                            var msj = response.message;
                            var response = response.type;
                            var deta = 'notifry_error';

                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;

                        } else {

                            if (response.type === 'error') {

                                var nomMantemiento = 'Unidad Organizacional';
                                var campo = 'txt-desc-UO';
                                var msj = response.message;
                                var response = "info";
                                var deta = 'notifry_errordes';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;
                            } else if (response.type === 'errorGeneral') {
                                new PNotify({
                                    title: 'Nueva Unidad Organizacional',
                                    text: response.message,
                                    type: 'info',
                                    delay: 3000,
                                    styling: 'bootstrap3'
                                });
                                return;
                            }


                        }

                    }

                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });



});
function CamposAdicioUndOrg() {
    $.post(
        '/Organizacion/CamposAdicionales',
        { strEntidad: 'TGUNIDORG' },
        (response) => {

            console.log(response);
            $('#containerCamposea').empty();
            response.forEach(element => {

                $('#containerCamposea').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');

            });

            $('#strUOCampo1').val(element.strUOCampo1);
            $('#strUOCampo1').val(element.strUOCampo2);
            $('#strUOCampo3').val(element.strUOCampo3);
            $('#strUOCampo4').val(element.strUOCampo4);
            $('#strUOCampo5').val(element.strUOCampo5);
        });

}
function OcultarIn() {
        $('#cboJerarquia').on('change', function () {
            $('#REPLEG').attr('hidden', true);
            $('#PerResp').attr('hidden', true);
            $('#RUC').attr('hidden', true);
            $('#DIRF').attr('hidden', true);
            $('#UBIGEO').attr('hidden', true);
            $('#LOGO').attr('hidden', true);
            $('#CAM1').attr('hidden', true);
            $('#CAM2').attr('hidden', true);
            $('#CAM3').attr('hidden', true);
            $('#CAM4').attr('hidden', true);
            $('#CAM5').attr('hidden', true);
            var filtrado = $('#cboJerarquia option:selected').val();
            var strfiltr = filtrado.toString();

            if (filtrado == 0 || filtrado == null) {
                return
            }
            if (filtrado !== null) {
                $.post(
                    '/Organizacion/GetFiltroObliJer',
                    { filtro: strfiltr },
                    (response) => {
                        if (true) {
                            response.forEach(element => {
                                $('#' + element.strCoCampo).attr('hidden', false);
                                if (element.bitObligatorio == true) {
                                    $('#' + element.strCoCampo).attr('requerid', true);
                                }
                            });
                        }
                    }
                ).fail(function (result) {
                    alert('ERROR ' + result.status + ' ' + result.statusText);
                });
            }
            else {
                return;
            }
        });
}
function OcultarIneDITAR() {

        $('#REPLEG').attr('hidden', true);
        $('#PerResp').attr('hidden', true);
        $('#RUC').attr('hidden', true);
        $('#DIRF').attr('hidden', true);
        $('#UBIGEO').attr('hidden', true);
        $('#LOGO').attr('hidden', true);
        $('#CAM1').attr('hidden', true);
        $('#CAM2').attr('hidden', true);
        $('#CAM3').attr('hidden', true);
        $('#CAM4').attr('hidden', true);
        $('#CAM5').attr('hidden', true);
        var filtrado = $('#cboJerarquia option:selected').val();
        var strfiltr = filtrado.toString();

        if (filtrado == 0 || filtrado == null) {
            return
        }
        if (filtrado !== null) {
            $.post(
                '/Organizacion/GetFiltroObliJer',
                { filtro: strfiltr },
                (response) => {
                    if (true) {
                        response.forEach(element => {
                            $('#' + element.strCoCampo).attr('hidden', false);
                            if (element.bitObligatorio == true) {
                                $('#' + element.strCoCampo).attr('requerid', true);
                            }
                        });
                    }
                }
            ).fail(function (result) {
                alert('ERROR ' + result.status + ' ' + result.statusText);
            });
        }
        else {
            return;
        }

}
var _id;
function BuscarUnidad() {


    $('#cboJerarquia').on('change', function () {
        if (typeof _id == 'undefined') {

            $('#cbounidsup').empty();

        }

        var _id = $('#cboJerarquia option:selected').val();

        if (_id == 1 || !_id) {
            $('#cbounidsup').empty();
            $('#cbounidsup').attr('disabled', true);

            return;
        }
        $.post(
            '/Organizacion/getUnidSup',
            { IntIdJerOrg: _id },
            (response) => {
                if (true) {
                    response.forEach(element => {
                        $('#cbounidsup').attr('disabled', false);
                        $('#cbounidsup').append('<option value="' + element.intIdUniOrg + '">' + element.strDescripcion + '</option>');
                    });
                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });
    });
}
 $('#btn-new-undOrganiza').on('click', function () {
     $('.form-hide-undOrganiza').show();

     $('#btn-update-undOrganiza').hide();
     $('#btn-save-change-undOrganiza').show();

        $.post(
            '/Organizacion/NuevaUnidadOrg',
            {},
            (response) => {
                if (response !== '') {
                    $('.form-hide-undOrganiza .x_content').empty();
                    $('.form-hide-undOrganiza .x_content').html(response);
                    $('.form-hide-undOrganiza').show();
                    switcheryLoad();
                    BuscarUnidad();
                    Ubigeo_Deparment();
                    Ubigeo_Province();
                    Ubigeo_District();
                    FiltroLegal();
                    FiltroRes();
                    OcultarIn();
                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });
});
var lstRepLeg = null;
var lstResp = null;
var idRL = 0;
function FiltroLegal() {
        var filtro = document.getElementById("Legal").value;
        console.log(filtro);
        var relacion = new Array();

        $.post(
            '/Organizacion/getLegal',
            { strfiltroLegal: filtro },
            (response) => {
                if (true) {
                    console.log(response);
                    lstRepLeg = response;
                    $(relacion).empty();

                    var i = 0;

                    response.forEach(element => {
                        relacion[i] = element.strNombres + ' ' + element.strApePaterno + ' ' + element.strApeMaterno;

                        i++;

                    });
                    $('#Legal').autocomplete({
                        source: [relacion]

                    }).on('selected.xdsoft', function (e, datum) {
                        console.log(datum);
                        idRL = lstRepLeg.find(x => x.strNombres + ' ' + x.strApePaterno + ' ' + x.strApeMaterno === datum).IntIdRepLeg;
                        console.log(idRL);
                        $('#idLegal').val(idRL);
                    });




                }

            }
        );
};
function FiltroRes() {
        var filtro = document.getElementById("Respon").value;
        console.log(filtro);
        var listado = new Array();
        $.post(
            '/Organizacion/getRes',
            { strfiltroPersonal: filtro },
            (response) => {
                console.log(response);
                if (true) {

                    lstResp = response;
                    $(listado).empty();
                    var i = 0;

                    response.forEach(element => {

                        listado[i] = element.strNombres + ' ' + element.strApePaterno + ' ' + element.strApeMaterno  ;
                        i++;
                           });

                    $('#Respon').autocomplete({
                        source: [listado]
                    }).on('selected.xdsoft', function (e, datum) {
                        console.log(datum);
                        idRL = lstResp.find(x => x.strNombres + ' ' + x.strApePaterno + ' ' + x.strApeMaterno === datum).intIdPersonal;
                        console.log(idRL);
                        $('#idPerLeg').val(idRL);
                    });



                }
            }
        )
}
////function FiltroRes() {
////    var filtro = document.getElementById("Respon").value;
////  var listado = new Array();
////    $.post(
////        '/Organizacion/getRes',
////        { strfiltroPersonal: filtro },
////        (response) => {
////            console.log(response);
////            if (true) {
////                  $(listado).empty();
////                var i = 0;
////                response.forEach(element => {
////                    listado[i] = element.strNombres + ' ' + element.strApePaterno + ' ' + element.strApeMaterno;
////                    i++;

////                });

////                console.log('Pase el foreach');
////                console.log(response.intIdPerResp);

////                console.log(listado);
////                $('#Respon').autocomplete({
////                    source: [listado]
////                });
////               console.log('pase el listado');
////                console.log(response.intIdPerResp);






////            }
////        }
////    )
////}
function limpiar() {
        document.getElementById('inputImage').value = "";
        $("#imageupload").attr("src", "../../images/user.png");
}
function previewFile() {
        var preview = document.querySelector('#imageupload');
        var file = document.querySelector('#inputImage').files[0];
        var reader = new FileReader();
        var NombreArchivo;
        reader.addEventListener("load", function () {
            preview.src = reader.result;
            console.log($("#imageupload"));

        }, false);
        if (file) {
            reader.readAsDataURL(file);
   }
}
function Ubigeo_Deparment() {
        $('#cboRepPais-UO').on('change', function () {
            $('#cboProvince-UO').empty();
            $('#cboDisrict-UO').empty();
            var paisId = $('#cboRepPais-UO option:selected').val();
            paisId = $('#cboRepPais-UO').val();
            $.post(
                '/Organizacion/getcboRepDep',
                { intcodPais: paisId },

                (response) => {
                    if (true) {
                        $('#cboDeparment-UO').empty();
                        $('#cboDeparment-UO').attr('disabled', false);
                        $('#cboDeparment-UO').append('<option value="00">Seleccione</option>');
                        response.forEach(element => {

                            $('#cboDeparment-UO').append('<option value="' + element.strCoUbigeo + '">' + element.strDesUbigeo + '</option>');
                        });


                    }

                }
            ).fail(function (result) {
                alert('ERROR ' + result.status + ' ' + result.statusText);
            });
        });

    }
function Ubigeo_Province() {
        $('#cboDeparment-UO').on('change', function () {
            $('#cboDisrict-UO').empty();
            var DepartId = $('#cboDeparment-UO option:selected').val();
            var PaisDepId = $('#cboRepPais-UO option:selected').val();
            $.post(
                '/Organizacion/getcboRepProvince',
                {
                    strCoDep: DepartId,
                    stridPaisDep: PaisDepId
                },
                (response) => {
                    if (true) {
                        $('#cboProvince-UO').empty();
                        $('#cboProvince-UO').attr('disabled', false);
                        $('#cboProvince-UO').append('<option value="00">Seleccione</option>');
                        response.forEach(element => {
                            $('#cboProvince-UO').append('<option value="' + element.strCoUbigeo + '">' + element.strDesUbigeo + '</option>');
                        });

                    }

                }
            ).fail(function (result) {
                alert('ERROR ' + result.status + ' ' + result.statusText);
            });
        });

    }
function Ubigeo_District() {
        $('#cboProvince-UO').on('change', function () {
            var ProvinceID = $('#cboProvince-UO option:selected').val();
            var PaisDisId = $('#cboRepPais-UO option:selected').val();
            $.post(
                '/Organizacion/getcboRepDistrict',
                {
                    stridpaisProv: PaisDisId,
                    strCoDep: ProvinceID
                },
                (response) => {
                    if (true) {
                        $('#cboDisrict-UO').empty();
                        $('#cboDisrict-UO').attr('disabled', false);
                        $('#cboDisrict-UO').append('<option value="00">Seleccione</option>');
                        response.forEach(element => {
                            $('#cboDisrict-UO').append('<option value="' + element.intIdUbigeo + '">' + element.strDesUbigeo + '</option>');
                        });

                    }

                }
            ).fail(function (result) {
                alert('ERROR ' + result.status + ' ' + result.statusText);
            });
        });
    }
$('#btn-cancel-undOrganiza').on('click', function () {
        $('.form-hide-undOrganiza').hide();
    });
function CamposAdicionalesUO() {

    $.post(
        '/Organizacion/CamposAdicionales',
        { strEntidad: 'TGUNIDORG' },
        (response) => {

            console.log(response);
            $('#containerCampose').empty();
            response.forEach(element => {

                $('#containerCampose').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


            });
        });
}

    /**---------------------------------------------------------- */
    /**11. Jerarquía Organizacional */
    /**----------------------------------------------------------- */

$('#cbo-filter-estado-JO').on('change', function () {

    TablaJerar();

});
$('#txt-buscar-JO').keyup(function () {

    TablaJerar();
});
var _vartableJerarquiaOrg;
function TablaJerar() {
    var filtroActivo = $('#cbo-filter-estado-JO').val();
    var strfiltro = $('#txt-buscar-JO').val();

    $.post(
        '/Configuracion/GetTablaFiltradaJerarquiaOrganizacional',
        { IntActivoFilter: filtroActivo, strfilter: strfiltro},
        (response) => {



            if (typeof _vartableJerarquiaOrg !== 'undefined') {
                _vartableJerarquiaOrg.destroy();
            }
        //Diseño de la tabla
            _vartableJerarquiaOrg = $('#datatable-jerOrg').DataTable({
                data: response,
                columns: [
                    { data: 'strCoJerOrg' },
                    { data: 'strNomJerOrg' },
                    { data: 'intNivelJer' },
                    { data: 'strNomJerPadre' },
                    { data: 'FlActivo.strEstadoActivo' },
                    { data: null },
                    { data: 'FlActivo.bitFlActivo' },
                    { data: 'strJerarCampo1' },
                    { data: 'strJerarCampo2' },
                    { data: 'strJerarCampo3' },
                    { data: 'strJerarCampo4' },
                    { data: 'strJerarCampo5' },
                    { data: 'IntIdJerOrg' },
                    { data: 'strCoIntJO' },
                    { data: 'strCoJerPadre' },

                ],
                lengthMenu: [10, 25, 50],
                responsive: true,
                language: _datatableLanguaje,

            columnDefs: [//ocultar y definir columnas
                {
                    targets: [6],//IntIdJerOrg
                    visible: false,
                    searchable: false
                },
                {
                    targets: [7],//strCoIntJO
                    visible: false,
                    searchable: false
                },
                {
                    targets: [8],//strCoJerPadre
                    visible: false,
                    searchable: false
                },
                {
                    targets: [9],//bitFlActivo
                    visible: false,
                    searchable: false
                },
                {
                    targets: [10],//bitFlActivo
                    visible: false,
                    searchable: false
                },
                {
                    targets: [11],//bitFlActivo
                    visible: false,
                    searchable: false
                },
                {
                    targets: [12],//bitFlActivo
                    visible: false,
                    searchable: false
                },
                {
                    targets: [13],//bitFlActivo
                    visible: false,
                    searchable: false
                },
                {
                    targets: [14],//bitFlActivo
                    visible: false,
                    searchable: false
                },
                {
                    targets:[5],
                    data: null,
                    defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                        '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
                }

                ],
            dom: 'lBfrtip',

        });



            // Sort by column 1 and then re-draw
            _vartableJerarquiaOrg
                .order([2, 'asc'])
                .draw();

        $('#datatable-jerOrg  tbody').on('click', 'tr button.btn-edit', function () {
            var data = _vartableJerarquiaOrg.row($(this).parents('tr')).data();
            if (data == null) {
                data = null;
                var data = _vartableJerarquiaOrg.row($(this).parents('li')).data();
                cardarDatosJerarquia(data);
            } else {
                var data = _vartableJerarquiaOrg.row($(this).parents('tr')).data();
                cardarDatosJerarquia(data);
            }

        });

        $('#datatable-jerOrg  tbody').on('click', 'tr button.btn-delete', function () {

            var data = _vartableJerarquiaOrg.row($(this).parents('tr')).data();

            if (data == null) {
                data = null;

                var data = _vartableJerarquiaOrg.row($(this).parents('li')).data();
                intentEliminarJerarquia(data['IntIdJerOrg'], data['strNomJerOrg']);

            } else {

                var data = _vartableJerarquiaOrg.row($(this).parents('tr')).data();
                intentEliminarJerarquia(data['IntIdJerOrg'], data['strNomJerOrg']);

            }


          });

     });

}
 class DetalleJerarquia {
        constructor(intIdJerCampo, IntIdJerOrg, strCoIntJO, intIdCampo, strCoCampo, bitObligatorio) {
            this.intIdJerCampo = intIdJerCampo
            this.IntIdJerOrg = IntIdJerOrg
            this.strCoIntJO = strCoIntJO
            this.intIdCampo = intIdCampo
            this.strCoCampo = strCoCampo
            this.bitObligatorio = bitObligatorio
        }
    }


    //$('#txt-buscar-JO').on('keypress', (e) => {
    //    if (e.which == 13) {
    //        var value = $('#cbo-filter-estado-JO option:selected').val();
    //        var filtro = $('#txt-buscar-JO').val();
    //        filtrarDatosJO_table(filtro, value);
    //    }
    //});

    //function filtrarDatosJO_table(filter, activo) {
    //    $.post(
    //        '/Configuracion/jsonFiltrarJerarquiaOrg',
    //        { strFiltro: filter, intActivo: activo },
    //        (response) => {
    //            if (response.length > 0) {
    //                _vartableJerarquiaOrg.destroy();
    //                _datatableJerORG(response);
    //            }
    //            else
    //                _vartableJerarquiaOrg.rows().clear().draw();
    //        }
    //    ).fail(function (result) {
    //        alert('ERROR ' + result.status + ' ' + result.statusText);
    //    });
    //}

    //$('#cbo-filter-estado-JO').on('change', () => {
    //    var value = $('#cbo-filter-estado-JO option:selected').val();
    //    var filtro = $('#txt-buscar-JO').val();

    //    filtrarDatosJO_table(filtro, value);
    //});

    $('#btn-new-jerarquia').on('click', function () {
        $('#btn-update-jerarquia').hide();//Ocultar el boton de actualizar
        $('#btn-save-change-jerarquia').show();
        $.post(
            '/Configuracion/NuevaJerarquia',
            {},
            (response) => {
                if (response !== '') {
                    $('.form-hide-jerarquia .x_content').empty();
                    $('.form-hide-jerarquia .x_content').html(response);

                    switcheryLoad();
                    init_checkBox_styles();
                    //HabilitarSwitch();
                    onchange_jerarquia();

                    var lista = document.getElementById("cboNivel-JO");

                    var nivjer = $('#cboNivel-JO').val();
                    if (lista.length < 2) {


                        swal({
                            title: "Nueva Jerarquía",
                            text: "<strong>Ha utilizado sus " + 10 + " niveles jerárquicos configurados.<br/> Si desea registrar más niveles por favor modifique su configuración o elimine niveles inactivos.</strong>",
                            type: "info",
                            confirmButtonText: "OK",
                        });
                        $('.form-hide-jerarquia').hide();

                    } else {
                        $('.form-hide-jerarquia').show();

                    }
                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });

    });
    //Cargar Datos para Editar
    function cardarDatosJerarquia(data) {
        $('#btn-update-jerarquia').show();
        $('#btn-save-change-jerarquia').hide();

        var objJerarquia = {
            IntIdJerOrg: data['IntIdJerOrg'],
            strCoIntJO: data['strCoIntJO'],
            strCoJerOrg: data['strCoJerOrg'],
            strNomJerOrg: data['strNomJerOrg'],
            intNivelJer: data['intNivelJer'],
            strCoJerPadre: data['strCoJerPadre'],
            FlActivo: {
                strEstadoActivo: data['FlActivo']['strEstadoActivo'],
                bitFlActivo: data['FlActivo']['bitFlActivo']
            }
        }

        console.log(objJerarquia);

        $.post(
            '/Configuracion/DatosJerarquia',
            { jerarquiaOrg: objJerarquia },
            (response) => {
                if (response !== '') {
                    $('.form-hide-jerarquia .x_content').empty();
                    $('.form-hide-jerarquia .x_content').html(response);
                    $('.form-hide-jerarquia').show();
                    switcheryLoad();
                    init_checkBox_styles();
                    onchange_jerarquia();

                    $('#txt-intId-JO').val(objJerarquia.IntIdJerOrg);

                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });
}

    //Enviar Datos para Actualizar la Jerarquía
    $('#btn-update-jerarquia').on('click', () => {
        //Leer Datos de la Jerarquía Organizacional
        var _intIdJer = $('#txt-intId-JO').val();

        var _strCoIntJer = $('#txt-strCoInt-JO').val();
        var _nivelJer = $('#cboNivel-JO option:selected').val();
        var _jerPadre = $('#cboJerPadre-JO option:selected').val();
        var _codigo = $('#txt-cod-JO').val();
        var _desc = $('#txt-desc-JO').val();
        var _activo = $('#chk-activo-JO').is(':checked');

        if (_nivelJer === '' || _codigo === '' || _desc === '') {
            new PNotify({
                title: 'Editar Jerarquía',
                text: 'Complete los campos obligatorios',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3',
                addclass: 'dark'
            });
            return;
        }


        if (_jerPadre === '')
            _jerPadre = null;

        var JerarquíaOrg = {
            IntIdJerOrg: _intIdJer,
            strCoIntJO: _strCoIntJer,
            strCoJerOrg: _codigo,
            strNomJerOrg: _desc,
            intNivelJer: _nivelJer,
            strCoJerPadre: _jerPadre,
            FlActivo: {
                bitFlActivo: _activo
            }
        }

        var detalleJer = new Array();
        $('div[class="div-campos-adicio"]').each((index, item) => {
            var label = $(item).find('label');
            var _check = $(label).find('input.flat');
            var IntIdJerOrg = $('#txt-intId-JO').val();

            var IntIdJerOrgCamp = $('#txt-strIntidCamp-JO').val();

            var _switch = $(label).find('input.chkObligatorio');
            if ($(_check).is(':checked')) {

                var intid = $(_check).data('intidcampo');
                var strco = $(_check).data('strcocampo');
                var bitObli = $(_switch).is(':checked');
                detalleJer.push(new DetalleJerarquia(IntIdJerOrgCamp, IntIdJerOrg , null, intid, strco, bitObli));
               //detalleJer.push(new DetalleJerarquia(IntIdJerOrgCamp, IntIdJerOrg , null, intid, strco, bitObli));
            }
        });
        console.log(detalleJer);

        $.post(
            '/Configuracion/ActualizarJeraquia',
            { jerarquiaOrg: JerarquíaOrg, detalleJer: detalleJer },
            (response) => {
                console.log(response);
                if (response.type !== '') {
                    if (response.type === 'success') {

                    new PNotify({
                        title: 'Actualización Jerarquía Organizacional',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                            });
                        TablaJerar();

                        $('.form-hide-jerarquia').hide();
                    } else {

                        if (response.type === 'info') {
                            var nomMantemiento = 'Jerarquía Organizacional';
                            var campo = 'txt-cod-JO';
                            var msj = response.message;
                            var response = response.type;
                            var deta = 'notifry_error';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;

                        } else {

                            if (response.type === 'error') {

                                var nomMantemiento = 'Jerarquía Organizacional';
                                var campo = 'txt-desc-JO';
                                var msj = response.message;
                                var response = "info";
                                var deta = 'notifry_errordes';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;
                            }


                        }

                    }
                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });

    });
    //Guardar Datos de la Nueva Jerarquía
    $('#btn-save-change-jerarquia').on('click', function () {

        //Datos de la Jerarquía Organizacional
        var _nivelJer = $('#cboNivel-JO option:selected').val();
        var _jerPadre = $('#cboJerPadre-JO option:selected').val();
        var _codigo = $('#txt-cod-JO').val();
        var _desc = $('#txt-desc-JO').val();
        var _activo = $('#chk-activo-JO').is(':checked');

        if (_nivelJer === '' || _codigo === '' || _desc === '') {
            new PNotify({
                title: 'Nueva Jerarquía',
                text: 'Complete los campos obligatorios',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3',
                addclass: 'dark'
            });
            return;
        }


        if (_jerPadre === '')
            _jerPadre = null;

        var JerarquíaOrg = {
            strCoJerOrg: _codigo,
            strNomJerOrg: _desc,
            intNivelJer: _nivelJer,
            strCoJerPadre: _jerPadre,
            FlActivo: {
                bitFlActivo: _activo
            }
        }

        var detalleJer = new Array();
        /* $('#cboCampoAD-JO option:selected').each(function () {
            var $this = $(this);
            detalleJer.push(new DetalleJerarquia(null, null, null, $this.val(), $this.data('strcocampo'), false));
        }); */
        //$('div[class="Busqueda"]').each((index, item) => {
        $('div[class="div-campos-adicio"]').each((index, item) => {
            var label = $(item).find('label');
            var _check = $(label).find('input.flat');
            var _switch = $(label).find('input.case1');//antes era switch ahora es flat

            if ($(_check).is(':checked')) {
                var intid = $(_check).data('intidcampo');
                var strco = $(_check).data('strcocampo');
                var bitObli = $(_switch).is(':checked');
                //console.log(intid + ' co:' + strco + ' bit:' + bitObli);

                detalleJer.push(new DetalleJerarquia(null, null, null, intid, strco, bitObli));
            }
        });
        console.log(detalleJer);
        $.post(
            '/Configuracion/RegistrarNuevaJeraquia',
            { jerarquiaOrg: JerarquíaOrg, detalleJer: detalleJer },
            (response) => {
                console.log(response);
                if (response.type !== '') {


                    if (response.type === 'success') {
                         new PNotify({
                        title: 'Nueva Jerarquía Organizacional',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                        });
                        TablaJerar();

                    $('.form-hide-jerarquia').hide();
                    } else {

                        if (response.type === 'info') {
                            var nomMantemiento = 'Jerarquía Organizacional';
                            var campo = 'txt-cod-JO';
                            var msj = response.message;
                            var response = response.type;
                            var deta = 'notifry_error';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);

                            return;

                        } else {

                            if (response.type === 'error') {

                                var nomMantemiento = 'Jerarquía Organizacional';
                                var campo = 'txt-desc-JO';
                                var msj = response.message;
                                var response = "info";
                                var deta = 'notifry_errordes';


                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;
                            }


                        }

                    }

                }




            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });
    });
    function intentEliminarJerarquia(idJer, strNomJer) {
        swal({
            title: "Eliminar Jerarquía",
            text: "¿Está seguro de eliminar la Jerarquía      ''<strong>" + strNomJer + "</strong>''      ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        }).then(function (isConfirm) {
            if (isConfirm) {
                yesEliminaJerarquia(idJer);
            } else {
                swal("Cancelado", "La Operación fue cancelada", "error");
            }
        });
    }
    function yesEliminaJerarquia(intIdJer) {
        $.post(
            '/Configuracion/EliminarJeraquia',
            { IntIdJerOrg: intIdJer },
            (response) => {
                console.log(response);
                if (response.type !== '') {
                    var tipo = 'Eliminado!';
                    if (response.type === 'error')
                        tipo = 'ERROR';
                    swal(tipo, response.message, response.type);

                    if (response.type === 'success')
                        TablaJerar();
                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });
    }
    /** Recargar campo Jerarquía Padre */
    function onchange_jerarquia() {
        $('#cboNivel-JO').on('change', () => {
            var _nivelJer = $('#cboNivel-JO option:selected').val();
            $('#cboJerPadre-JO').empty();
            if (_nivelJer > 1) {
                $('#cboJerPadre-JO').attr('disabled', false);

                $.post(
                    '/Configuracion/GetJerarquiaSuperior',
                    { intNivelJer: _nivelJer },
                    (response) => {
                        if (response.objeto.length > 0) {
                            response.objeto.forEach(element => {
                                $('#cboJerPadre-JO').append('<option value="' + element.strCoIntJO + '">' + element.strNomJerOrg + '</option>');
                            });
                        }
                    }
                ).fail(function (result) {
                    alert('ERROR ' + result.status + ' ' + result.statusText);
                });

            } else {
                $('#cboJerPadre-JO').attr('disabled', true);
            }
        });
    }
    $('#btn-cancel-jerarquia').on('click', function () {
        $('.form-hide-jerarquia').hide();
    });

    /**----------------------------------------------------------- */
    /**12. Feriado */
    /**---------------------------------------------------------- */

     function getDateRangePickerFeriado() {
    const idRange = ".range-datepicker";
    const fechaInicio = $(idRange).data('daterangepicker').startDate.format('DD/MM/YYYY');
    const fechaFin = $(idRange).data('daterangepicker').endDate.format('DD/MM/YYYY');
    return { fInicio: fechaInicio, fFin: fechaFin}
}

     $('#filActiFeriado').on('change', function () {
    const date = getDateRangePickerFeriado();
    traerDatosFeriados(date.fInicio, date.fFin)
});

     function CombosFeriado() {
         $('#txtHoraFinFer').attr('disabled', true);
         $('#txtHoraIniFer').attr('disabled', true);
    // combo recursividad
         $.post(
             '/Asistencia/LlenarTipoUM',
             { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'FER', strSubGrupo: 'FER' },
             (response) => {
                 $('#idRecu').empty();
                 $('#idRecu').append('<option value="0">Seleccione</option>');
                 response.forEach(element => {
                     $('#idRecu').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');


                 });
             });

    // combo regimen
    //JSON.String o PARSE
    $.post(
        '/Asistencia/LlenarTipoUM',
        { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'PER', strSubGrupo: 'REGI' },
        (response) => {
            $('#idRegi').empty();
            $('#idRegi').append('<option value="0">Seleccione</option>');
            response.forEach(element => {
                $('#idRegi').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');


            });
        });

         // combo comcepto
         $.post(
             '/Asistencia/LlenarTipoUM',
             { strEntidad: 'TGCONCEPTO', intIdFiltroGrupo: 0, strGrupo: 'FER', strSubGrupo: 'FER' },
             (response) => {
                 $('#idConcep').empty();
                 $('#idConcep').append('<option value="0">Seleccione</option>');
                 response.forEach(element => {
                     $('#idConcep').append('<option value="' + element.intidTipo + '" TipoUM="' + element.intextra1+'">' + element.strDeTipo + '</option>');



                 });





             });

         $('#idConcep').on('change', function () {

          var ValidaUM=  $('#idConcep').val();

         $.post(
             '/Asistencia/ObtenerConceptoPorsuPK',
             { intIdConcepto: ValidaUM },
             (response) => {


                 response.forEach(element => {



                     if (element.intTipoUM == 25) {

                             $('#txtHoraFinFer').attr('disabled', false);
                             $('#txtHoraIniFer').attr('disabled', false);


                         }
                     else if (element.intTipoUM == 26) {

                             $('#txtHoraFinFer').attr('disabled', true);
                             $('#txtHoraIniFer').attr('disabled', true);

                         }

                     });
                 });
             });



    //ComboJerarquia
    $.post(
        '/Asistencia/LlenarTipoUM',
        { strEntidad: 'TGJERARQORG', intIdFiltroGrupo: 0, strGrupo: 'DEPEN', strSubGrupo: '' },
        (response) => {
            $('#cboJerar').empty();
            $('#cboJerar').append('<option value="0">Seleccione</option>');

            response.forEach(element => {
                $('#cboJerar').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

            });
        });

    //Combo UnidadOrganizacional
    $('#cboJerar').on('change', function () {

        var IntidJerar = $('#cboJerar option:selected').val();

        $.post(
            '/Asistencia/LlenarTipoUM',
            { strEntidad: 'TGUNIDORG', intIdFiltroGrupo: IntidJerar, strGrupo: 'JERAR', strSubGrupo: '' },
            (response) => {
                $('#cboUndOrg').empty();
                $('#cboUndOrg').attr('disabled', false);

                response.forEach(element => {
                    $('#cboUndOrg').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                });
            });
    });

     }

     function CamposAdicionalesFeriado() {

    $.post(
        '/Asistencia/CamposAdicionales',
        { strEntidad: 'TGFERIADO' },
        (response) => {

            console.log(response);
            $('#containerCampose').empty();
            response.forEach(element => {

                $('#containerCampose').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


            });
        });
}

     $('#filtroFeriado').keyup(function () {

    const date = getDateRangePickerFeriado();
    traerDatosFeriados(date.fInicio, date.fFin)

});

     $('.range-datepicker').on('apply.daterangepicker', function (ev, picker) {
    const filtrojer_ini = picker.startDate.format('DD/MM/YYYY');
    const filtrojer_fin = picker.endDate.format('DD/MM/YYYY');
    traerDatosFeriados(filtrojer_ini, filtrojer_fin)
});

     $('#btn-new-feriado').on('click', function () {

         $('#btn-save-change-feriado').show();
         $('#btn-update-feriado').hide();
    $('.form-hide-feriado').show();
    $.post(
        '/Asistencia/NuevoFeriado',
        {},
        (response) => {
            if (response !== '') {
                $('.form-hide-feriado .x_content').empty();
                $('.form-hide-feriado .x_content').html(response);
                $('.form-hide-feriado').show();
                switcheryLoad();
                init_checkBox_styles();
                cargarDaterangePicker();
                init_daterangepicker();
                CombosFeriado();
                CamposAdicionalesFeriado();

                $('#chck_bitEspecifica').iCheck('unchecked');

                $('#chck_bitEspecifica').on('ifChanged', function () {

                    if ($('#chck_bitEspecifica').is(':checked') == true) {

                        $('#cboJerar').attr('disabled', false);

                        $('#cboUndOrg').attr('disabled', false);

                    } else if ($('#chck_bitEspecifica').is(':checked') == false) {

                        $('#cboJerar').attr('disabled', true);

                        $('#cboUndOrg').attr('disabled', true);


                    }
                });

                if ($('#chck_bitEspecifica').is(':checked') == true) {

                    $('#cboJerar').attr('disabled', false);

                    $('#cboUndOrg').attr('disabled', false);

                } else if ($('#chck_bitEspecifica').is(':checked') == false) {

                    $('#cboJerar').attr('disabled', true);

                    $('#cboUndOrg').attr('disabled', true);


                }
            }
        });

});

     var _vartableFeriado;

     function traerDatosFeriados(filtrojer_ini_var = null, filtrojer_fin_var = null) {

    let filtrosActivo = ($('#filActiFeriado').val() != "") ? $('#filActiFeriado').val() : 2;
    let strfiltro = $('#filtroFeriado').val();
    let filtrojer_ini = filtrojer_ini_var ? filtrojer_ini_var : null;
    let filtrojer_fin = filtrojer_fin_var ? filtrojer_fin_var : null;

    $.post(
        '/Asistencia/GetTablaFeriado',
        {
            IntActivoFilter: filtrosActivo,
            strfilter: strfiltro,
            intfiltrojer1: filtrojer_ini,
            intfiltrojer2: filtrojer_fin
        },
        (response) => {
            $('#tablaFeriado tbody').empty();
            response.forEach(element => {

                if (typeof _vartableFeriado !== 'undefined') {
                    _vartableFeriado.destroy();
                }

                //Diseño de la tabla
                _vartableFeriado = $('#tablaFeriado').DataTable({
                    data: response,
                    columns: [
                        { data: 'dttfechaIni' },
                        { data: 'strDeFeriado' },
                        { data: 'CAMPO_CONCAT' },
                        { data: 'bitEspecifica_DESC' },
                        { data: 'bitFlActivo_desc' },
                        {
                            sortable: false,
                            "render": (data, type, item, meta) => {
                                let feriadoId = item.IntIdFeriado;
                                let strDeFeriado = item.strDeFeriado;
                                return `<button class="btn btn-success btn-xs btn-edit" dataid="${feriadoId}" ><i class="fa fa-pencil"></i> Editar </button>
                                           <button class="btn btn-primary btn-xs btn-delete" dataid="${feriadoId}" des_data="${strDeFeriado}" data="${item}" ><i class="fa fa-trash-o"></i> Eliminar </button>`;
                            }
                        },
                        { data: 'CAMPO_CONCAT' },
                        { data: 'CAMPO_CONCAT' },
                        { data: 'CAMPO_CONCAT' }
                    ],
                    lengthMenu: [10, 25, 50],
                    responsive: true,
                    language: _datatableLanguaje,

                    columnDefs: [//ocultar y definir columnas
                        {
                            targets: [6],//IntIdJerOrg
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [7],//strCoIntJO
                            visible: false,
                            searchable: false
                        },
                        {
                            targets: [8],//strCoJerPadre
                            visible: false,
                            searchable: false
                        }

                    ],
                    dom: 'lBfrtip',

                });



            });
        }
    );
}

     $('#btn-save-change-feriado').on('click', function () {


    var _Recursividad = $('#idRecu option:selected').val();
    var _Regimen = $('#idRegi option:selected').val();
    var _Concepto = $('#idConcep option:selected ').val();
    var _desc = $('#txt_desc_fer').val();


    var _FechaInicio = $('#txtFechaIniFer').val();
    var _HoraIniFer = $('#txtHoraIniFer').val();
    var _HoraFinFer = $('#txtHoraFinFer').val();

    var _bitEspecifica = $('#chck_bitEspecifica').is(':checked');

    var _strFeriaCampo1 = $('#strFeriaCampo1').val();
    var _strFeriaCampo2 = $('#strFeriaCampo2').val();
    var _strFeriaCampo3 = $('#strFeriaCampo3').val();
    var _strFeriaCampo4 = $('#strFeriaCampo4').val();
    var _strFeriaCampo5 = $('#strFeriaCampo5').val();
    var _chckActivoFer = $('#chck_activo_fer').is(':checked');

    if (_Recursividad === '' || _Regimen === '' || _desc === '' || _Concepto === '' ) {
        new PNotify({
            title: 'Nuevo Feriado',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }


    var Feriado = {

      intTipoRec    : _Recursividad,
      intTipoReg     : _Regimen,
      intIdConcepto  : _Concepto,
      strDeFeriado   : _desc,
      dttfechaIni    : _FechaInicio,
      timeHoraIni    : _HoraIniFer,
      timeHoraFin    : _HoraFinFer,
      bitEspecifica  : _bitEspecifica,
      strFeriaCampo1 : _strFeriaCampo1 ,
      strFeriaCampo2 : _strFeriaCampo2 ,
      strFeriaCampo3 : _strFeriaCampo3 ,
      strFeriaCampo4 : _strFeriaCampo4,
      strFeriaCampo5 : _strFeriaCampo5 ,
      bitFlActivo    : _chckActivoFer,

    }




    class TGFER_UNIORG_DET {
        constructor(intIdFerUniOrg, intIdFeriado, intIdUniOrg) {
            this.intIdFerUniOrg = intIdFerUniOrg
            this.intIdFeriado = intIdFeriado
            this.intIdUniOrg = intIdUniOrg
        }
    }


    var detalleOrgi = new Array();

    $('#cboUndOrg option:selected').each((index, item) => {
        //var input = $(item).find('input');
        console.log(item);
        var tr_cogido = $(item).val();
        detalleOrgi.push(new TGFER_UNIORG_DET(null, null, tr_cogido));

    });
    console.log(detalleOrgi);


    $.post(
        '/Asistencia/RegistrarNuevoFeriado',
        { ObjFeriado: Feriado, listaOrgxFer: detalleOrgi },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    new PNotify({
                        title: 'Nuevo Feriado',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });

                    const fechaInicioFeriado = moment().subtract(0, "year").startOf("year").format('DD/MM/YYYY');
                    const fechaFinFeriado = moment().subtract(0, "year").endOf("year").format('DD/MM/YYYY');
                    if ($("#tablaFeriado").length) {
                        traerDatosFeriados(fechaInicioFeriado, fechaFinFeriado);
                    }

                    $('.form-hide-feriado').hide();
                } else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Feriado';
                        var campo = 'txt_cod_Var';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {

                            var nomMantemiento = 'Feriado';
                            var campo = 'txt_desc_Var';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        } else {
                            if (response.type === 'alert') {

                                var nomMantemiento = 'Feriado';
                                var campo = 'txt_codPla_Var';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errorpla';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;
                            } else if (response.type === 'externo') {

                                var nomMantemiento = 'Feriado';
                                var campo = 'txt_codExte_Var';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errorext';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            } else {

                                return;
                            }
                        }

                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

});

     $('#btn-update-feriado').on('click', function () {


    var _Recursividad = $('#idRecu option:selected').val();
    var _Regimen = $('#idRegi option:selected').val();
    var _Concepto = $('#idConcep option:selected ').val();
    var _desc = $('#txt_desc_fer').val();
    var _FechaInicio = $('#txtFechaIniFer').val();
         var _HoraIniFer = $('#txtHoraIniFer').val();
         var _HoraFinFer = $('#txtHoraFinFer').val();

    var _bitEspecifica = $('#chck_bitEspecifica').is(':checked');

    var _strFeriaCampo1 = $('#strFeriaCampo1').val();
    var _strFeriaCampo2 = $('#strFeriaCampo2').val();
    var _strFeriaCampo3 = $('#strFeriaCampo3').val();
    var _strFeriaCampo4 = $('#strFeriaCampo4').val();
    var _strFeriaCampo5 = $('#strFeriaCampo5').val();
    var _chckActivoFer  = $('#chck_activo_fer').is(':checked');
    var _intidferiado = $('#IntidFer').val();

    if (_Recursividad === '' || _Regimen === '' || _desc === '' || _Concepto === '') {
        new PNotify({
            title: 'Nuevo Feriado',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }


    var Feriado = {

        intTipoRec: _Recursividad,
        intTipoReg: _Regimen,
        intIdConcepto: _Concepto,
        strDeFeriado: _desc,
        dttfechaIni: _FechaInicio,
        timeHoraIni: _HoraIniFer,
        timeHoraFin: _HoraFinFer,
        bitEspecifica: _bitEspecifica,
        strFeriaCampo1: _strFeriaCampo1,
        strFeriaCampo2: _strFeriaCampo2,
        strFeriaCampo3: _strFeriaCampo3,
        strFeriaCampo4: _strFeriaCampo4,
        strFeriaCampo5: _strFeriaCampo5,
        bitFlActivo: _chckActivoFer,
        IntIdFeriado: _intidferiado,

    }




    class TGFER_UNIORG_DET {
        constructor(intIdFerUniOrg, intIdFeriado, intIdUniOrg) {
            this.intIdFerUniOrg = intIdFerUniOrg
            this.intIdFeriado = intIdFeriado
            this.intIdUniOrg = intIdUniOrg
        }
    }


    var detalleOrgi = new Array();

    $('#cboUndOrg option:selected').each((index, item) => {
        //var input = $(item).find('input');
        console.log(item);
        var tr_cogido = $(item).val();
        detalleOrgi.push(new TGFER_UNIORG_DET(null, null, tr_cogido));

    });
    console.log(detalleOrgi);


    $.post(
        '/Asistencia/ActualizarFeriado',
        { ObjFeriado: Feriado, listaOrgxFer: detalleOrgi },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    new PNotify({
                        title: 'Actualizar Feriado',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });

                    const fechaInicioFeriado = moment().subtract(0, "year").startOf("year").format('DD/MM/YYYY');
                    const fechaFinFeriado = moment().subtract(0, "year").endOf("year").format('DD/MM/YYYY');
                    if ($("#tablaFeriado").length) {
                        traerDatosFeriados(fechaInicioFeriado, fechaFinFeriado);
                    }

                    $('.form-hide-feriado').hide();
                } else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Feriado';
                        var campo = 'txt_cod_Var';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {

                            var nomMantemiento = 'Feriado';
                            var campo = 'txt_desc_Var';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        } else {
                            if (response.type === 'alert') {

                                var nomMantemiento = 'Feriado';
                                var campo = 'txt_codPla_Var';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errorpla';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;
                            } else if (response.type === 'externo') {

                                var nomMantemiento = 'Feriado';
                                var campo = 'txt_codExte_Var';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errorext';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            } else {

                                return;
                            }
                        }

                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

});

     $('#btn-cancel-feriado').on('click', function () {
    $('.form-hide-feriado').hide();
});

     $('#tablaFeriado  tbody').on('click', 'tr button.btn-delete', function () {
    let feriadoId = $(this).attr("dataid")
    let DescripcionFer = $(this).attr("des_data")
    if (!isNaN(feriadoId)) {
        eliminarFeriado(feriadoId, DescripcionFer)
    }
})

     function eliminarFeriado(feriadoId, DescripcionFer) {

    swal({
        title: "Eliminar Feriado",
        text: "Esta seguro de eliminar el registro <strong>" + DescripcionFer +"</strong> ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {

        if (isConfirm) {

            $.post(
                '/Asistencia/EliminarFeriado',
                { intIdFeriado: feriadoId},
                (response) => {
                    console.log(response);
                    if (response.type !== '') {
                        var tipo = 'Eliminado!';
                        if (response.type === 'error')
                            tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                        swal(tipo, response.message, response.type);

                        if (response.type === 'success')
                            traerDatosFeriados('', '');

                    }
                }
            ).fail(function (result) {
                alert('ERROR ' + result.status + ' ' + result.statusText);
                });

            swal("Eliminado!", "El resgistro fue eliminado correctamente", "success");
        } else {
            swal("Cancelled", "Your imaginary file is safe :)", "error");
        }
    });

}

     $('#tablaFeriado  tbody').on('click', 'tr button.btn-edit', function () {
    let feriadoId = $(this).attr("dataid")

    if (!isNaN(feriadoId)) {
        editarFeriado(feriadoId)
    }
})

     function editarFeriado(feriadoId) {
         $('#btn-save-change-feriado').hide();
         $('#btn-update-feriado').show();
        $('.form-hide-feriado').show();
        $.post(
            '/Asistencia/EditarFeriado',
            {},
            (response) => {

                if (response !== '') {
                    $('.form-hide-feriado .x_content').empty();
                    $('.form-hide-feriado .x_content').html(response);
                    $('.form-hide-feriado').show();
                    switcheryLoad();
                    init_checkBox_styles();
                    cargarDaterangePicker();
                    init_daterangepicker();
                    CombosFeriado();
                    CamposAdicionalesFeriado();

                    $.post(
                        '/Asistencia/ObtenerRegistroFeriado',
                        { intIdFeriado: feriadoId },
                        (response) => {

                            console.log(response);
                            response.forEach(element => {

                                $('#idRecu').val(element.intTipoRec);
                                $('#idRegi').val(element.intTipoReg);
                                $('#idConcep').val(element.intIdConcepto);
                                $('#idConcep').val(element.intIdConcepto);
                                $('#txt_desc_fer').val(element.strDeFeriado);
                                $('#txtFechaIniFer').val(element.dttfechaIni);

                                if (element.timeHoraIni_desc !== '' || element.timeHoraFin_desc !== '') {

                                    $('#txtHoraIniFer').attr('disabled', false);
                                    $('#txtHoraFinFer').attr('disabled', false);
                                }

                                $('#txtHoraIniFer').val(element.timeHoraIni_desc);
                                $('#txtHoraFinFer').val(element.timeHoraFin_desc);



                                $('#strFeriaCampo1').val(element.strFeriaCampo1);
                                $('#strFeriaCampo2').val(element.strFeriaCampo2);
                                $('#strFeriaCampo3').val(element.strFeriaCampo3);
                                $('#strFeriaCampo4').val(element.strFeriaCampo4);
                                $('#strFeriaCampo5').val(element.strFeriaCampo5);
                                $('#IntidFer').val(element.IntIdFeriado);

                                if (element.bitEspecifica == 1) {

                                    $('#chck_bitEspecifica').iCheck('checked');

                                } else if (element.bitEspecifica == 0) {

                                    $('#chck_bitEspecifica').iCheck('unchecked');

                                }


                                $('#chck_bitEspecifica').on('ifChanged', function () {

                                    if ($('#chck_bitEspecifica').is(':checked') == true) {

                                        $('#cboJerar').attr('disabled', false);

                                        $('#cboUndOrg').attr('disabled', false);

                                    } else if ($('#chck_bitEspecifica').is(':checked') == false) {

                                        $('#cboJerar').attr('disabled', true);

                                        $('#cboUndOrg').attr('disabled', true);


                                    }
                                });




                                if ($('#chck_bitEspecifica').is(':checked') == true) {

                                    $('#cboJerar').attr('disabled', false);

                                    $('#cboUndOrg').attr('disabled', false);

                                } else if ($('#chck_bitEspecifica').is(':checked') == false) {

                                    $('#cboJerar').attr('disabled', true);

                                    $('#cboUndOrg').attr('disabled', true);


                                }

                                if (element.bitFlActivo == false) {

                                    $('#idche').html(' <input type="checkbox" id="chck_activo_fer" class="js-switch" id="chk-activo-JO"/> Activo');
                                    // $('#chck_Activo_Var').iCheck('uncheck');
                                    switcheryLoad();
                                } else if (element.bitFlActivo == true) {

                                    $('#idche').html(' <input type="checkbox" id="chck_activo_fer" class="js-switch" id="chk-activo-JO" checked /> Activo');
                                    // $('#chck_Activo_Var').iCheck('check');
                                    switcheryLoad();
                                }

                                $.post(
                                    '/Asistencia/ObtenerRegistroReglaDetalleDeOrgixFer',
                                    { intIdFeriado: feriadoId },
                                    (response) => {



                                        response.forEach(element => {



                                            $('#cboJerar').val(element.IntIdJerOrg);
                                            $('#cboJerar').trigger("change");






                                            //$('#cboUndOrg option[value=' + element.intIdUniOrg + ']').prop('selected', true);





                                        });

                                        $.post(
                                            '/Asistencia/ListarHorarioEspecifico',
                                            { strEntidad: 'TGFER_UNIORG_DET', intId: feriadoId, intUso: 2, strGrupo: '', strSubGrupo: '' },
                                            (response) => {

                                                response.forEach(element => {


                                                    $('#cboUndOrg option[value=' + element.intIdTipRegimen + ']').prop('selected', true);


                                                });


                                            });

                                    });

                            });

                      });





                }
            });

}

   /**----------------------------------------------------------- */
    /**Fin Feriado */
    /**---------------------------------------------------------- */

    /**13. Variable */
    /**--------------------------------------------------------- */

$('#filActi').on('change', function () {

    TablaVariable();

});

$('#campTipoVar').on('change', function () {
    TablaVariable();

});

$('#filtro').keyup(function () {

    TablaVariable();
});

$('#btn-new-variable').on('click', function () {
        $('#btn-update-variable').hide();
        $('#btn-save-change-variable').show();
        $('.form-hide-variable').show();
        $.post(
            '/Asistencia/NuevoVariable',
            {},
            (response) => {
                if (response !== '') {
                    $('.form-hide-variable .x_content').empty();
                    $('.form-hide-variable .x_content').html(response);
                    $('.form-hide-variable').show();
                    switcheryLoad();
                    init_checkBox_styles();
                   // TablaExtra();
                    $('#cboRedondeo').attr('disabled', true);
                    $('#cboVariable').on('change', function () {
                        $('#Incidencia-det').show();

                        var variable = $('#cboVariable').val();
                        $('#campTipoum').empty();
                        if (variable == 'undefinied' || variable == '' ) {

                            $('#campTipoum').attr('disabled', true);
                        } else {


                        $.post(
                            '/Asistencia/LlenarTipoUM',
                            { strEntidad: 'TGTIPO', intIdFiltroGrupo: variable, strGrupo: 'VARI', strSubGrupo: 'UM' },
                            (response) => {
                                $('#campTipoum').append('<option value=0> Seleccione </option>');

                                response.forEach(element => {
                                $('#campTipoum').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                                });
                                $('#campTipoum').attr('disabled', false);

                            });
                        }

                        if ($('#cboVariable').val() == 30) {
                            $('#GeneralChecks').show();
                            $('#Todos').show();
                            $('#Laborable').show();
                            $('#Descanso').hide();
                            $('#Feriado').hide();
                            $('#Sábado').hide();
                            $('#Domingo').hide();
                            $('#extras').hide();
                            $('#Marcas-det').show();
                            $('#bonificacion-det').show();
                            $('#bonificacion-det').html('<p>' +
                                '<input type = "checkbox" id = "chck_Descontable" class= "flat"  name = "iCheck9" >Descontable</p>' +
                                '<p><input type="checkbox" id="chck_Sustentación" class="flat" name="iCheck5">Sustentación</p>');
                            init_checkBox_styles();
                            $('#Específicos').hide();
                            $('#horarios-det').show();
                            $('#horarios-det').html('<p>Uso máximo anual</p>' +
                                '<input type = "text" id = "txtMaxUso" class="form-control" placeholder="Máximo">');
                            $('#ConfiguracionBonificaciones').hide();
                            $('#Acumulables').show();
                            $('#chck_Sustentación').iCheck('uncheck');
                            $('#chck_Descontable').iCheck('uncheck');

                            $('#chck_Permite').iCheck('uncheck');
                            $('#chck_Requiere').iCheck('uncheck');


                            $('#chck_Permite').on('ifChanged', function () {

                                if ($('#chck_Permite').is(':checked') == true) {
                                    $('#chck_Requiere').iCheck('uncheck');
                                }
                            });
                            $('#chck_Requiere').on('ifChanged', function () {

                                if ($('#chck_Requiere').is(':checked') == true) {
                                    $('#chck_Permite').iCheck('uncheck');

                                }
                            });


                        } else if ($('#cboVariable').val() == 31) {
                            $('#GeneralChecks').hide();
                            $('#Todos').hide();
                            $('#Laborable').hide();
                            $('#Descanso').hide();
                            $('#Feriado').hide();
                            $('#Sábado').hide();
                            $('#Domingo').hide();
                            $('#extras').hide();
                            $('#Marcas-det').show();
                            $('#bonificacion-det').show();
                            $('#bonificacion-det').html('<p>' +
                                '<input type = "checkbox" id = "chck_Descontable" class= "flat"  name = "iCheck9" >Descontable</p>' +
                                '<p><input type="checkbox" id="chck_Sustentación" class="flat" name="iCheck5">Sustentación</p>');
                            init_checkBox_styles();
                            $('#Específicos').hide();
                            $('#horarios-det').show();
                            $('#horarios-det').html('<p>Uso máximo anual</p>' +
                                '<input type = "text" id = "txtMaxUso" class="form-control" placeholder="Máximo">');
                            $('#ConfiguracionBonificaciones').hide();
                            $('#Acumulables').hide();
                            $('#chck_Sustentación').iCheck('uncheck');
                            $('#chck_Descontable').iCheck('uncheck');

                            $('#chck_Permite').iCheck('uncheck');
                            $('#chck_Requiere').iCheck('uncheck');

                            $('#chck_Permite').on('ifChanged', function () {

                                if ($('#chck_Permite').is(':checked') == true) {
                                    $('#chck_Requiere').iCheck('uncheck');
                                }
                            });
                            $('#chck_Requiere').on('ifChanged', function () {

                                if ($('#chck_Requiere').is(':checked') == true) {
                                    $('#chck_Permite').iCheck('uncheck');

                                }
                            });

                        }else if ($('#cboVariable').val() == 33) {
                            $('#GeneralChecks').show();
                            $('#Todos').hide();
                            $('#Laborable').show();
                            $('#Descanso').show();
                            $('#Feriado').show();
                            $('#Sábado').show();
                            $('#Domingo').show();
                            $('#extras').hide();
                            $('#Específicos').hide();
                            $('#bonificacion-det').html('<p>' +
                                '<input type = "radio" id = "chck_Total" class= "flat" checked name = "iCheck1" > Bono Total' +
                                '</p ><p><input type="radio" id="chck_Específico" class="flat" name="iCheck1"> Bono Específico' +
                                '</p>');
                            $('#horarios-det').html('<p>' +
                                    '<input type="radio" id="chck_HorTotal" class="flat" name="iCheck3"> Cualquier Jornada' +
                                    '</p ><p><input type = "radio" id = "chck_HorEspeci" class= "flat" checked name = "iCheck3" > Jornadas Específicas' +
                                    '</p>');

                            $('#Específicos').hide();
                            $('#Marcas-det').hide();
                            $('#bonificacion-det').show();
                            $('#horarios-det').show();

                           $('#chck_Específico').on('ifChanged', function (event) {

                           if ($('#chck_Específico').is(':checked') == true) {

                               $('#ConfiguracionBonificaciones').show();
                           } else {


                               $('#ConfiguracionBonificaciones').hide();
                             }

                            });
                            if ($('#chck_Específico').is(':checked') == true) {

                                $('#ConfiguracionBonificaciones').show();
                            } else {


                                $('#ConfiguracionBonificaciones').hide();
                            }
                            $('#chck_HorEspeci').on('ifChanged', function (event) {

                                if ($('#chck_HorEspeci').is(':checked') == true) {

                                    $('#Específicos').show();
                                } else {


                                    $('#Específicos').hide();
                                }

                            });
                            if ($('#chck_HorEspeci').is(':checked') == true) {

                                $('#Específicos').show();
                            } else {


                                $('#Específicos').hide();
                            }
                            init_checkBox_styles();
                            $('#selects').on('ifChanged', function () {

                                if ($('#selects').is(':checked') == true) {

                                    $('#ListaHorario option').prop('hidden', true);
                                    $('#ListaHorario option:selected').prop('hidden', false);


                                } else {
                                    $('#ListaHorario option').prop('hidden', false);
                                }
                            });

                            $('#select_All').on('ifChanged', function () {


                                if ($('#select_All').is(':checked') == true) {

                                    $('#ListaHorario option').prop('selected', true);

                                } else {
                                    $('#ListaHorario option').prop('selected', false);
                                }


                            });


                        } else if ($('#cboVariable').val() == 32) {
                            $('#GeneralChecks').hide();
                            $('#extras').show();
                            $('#horarios-det').show();
                            $('#Específicos').show();
                            $('#bonificacion-det').hide();
                            //prioridades();
                           // EdiatarPrioridades();
                            TablaExtra();
                            EdiatarPrioridades();

                            $('#horarios-det').hide();
                            $('#Específicos').hide();
                            $('#ConfiguracionBonificaciones').hide();
                            $('#Marcas-det').hide();
                            $('#Acumulables').hide();

                         }else {
                            $('#GeneralChecks').hide();
                            $('#Todos').hide();
                            $('#Laborable').hide();
                            $('#Descanso').hide();
                            $('#Feriado').hide();
                            $('#Sábado').hide();
                            $('#Domingo').hide();
                            $('#extras').hide();
                        }

                    });



                    $('#campTipoum').on('change', function () {

                        if ($('#campTipoum').val() == 25 ){
                            $('#Horas').show();
                            $('#cboAplica').val(79);
                            $('#cboRedondeo').val(82);
                            $('#cboRedondeo').attr('disabled', false);
                        }  else {
                            $('#Horas').hide();

                        }

                    });
                    $('#cboAplica').on('change', function () {
                    if ($('#cboAplica').val() == 79) {
                        $('#cboRedondeo').val(82);
                            $('#cboRedondeo').attr('disabled', false);

                    } else {
                        $('#cboRedondeo').val('Seleccione');
                            $('#cboRedondeo').attr('disabled', true);
                        }
                    });





                    $('#cboTipoRed').on('change', function () {

                        if ($('#cboTipoRed').val() == 76) {
                            $('#ChnageRedondeo').empty();

                            $('#ChnageRedondeo').html('<label>Factor de Redondeo(Tiempo)</label>' +
                                '<select class= "form-control" id = "Redondeo" disabled>' +
                                '<option value="0">00:00</option>' +
                                '<option value="5">00:05</option>' +
                                '<option value="10">00:10</option>' +
                                '<option value="15">00:15</option>' +
                                '<option value="20">00:20</option>' +
                                '<option value="25">00:25</option>' +
                                '<option value="30">00:30</option>' +
                                '<option value="60">01:00</option>' +
                                '</select >');

                            $('#Redondeo').attr('disabled', false);
                            $('#Redondeo').val(5);

                        } else if ($('#cboTipoRed').val() == 77) {
                            $('#ChnageRedondeo').empty();
                            $('#ChnageRedondeo').html('<label>Factor de Redondeo(Tiempo)</label>' +
                                '<select class= "form-control" id = "Redondeo" disabled>' +
                                '<option value="0">00:00</option>' +
                                '<option value="5">00:05</option>' +
                                '<option value="10">00:10</option>' +
                                '<option value="15">00:15</option>' +
                                '<option value="20">00:20</option>' +
                                '<option value="25">00:25</option>' +
                                '<option value="30">00:30</option>' +
                                '<option value="60">01:00</option>' +
                                '</select >');

                            $('#Redondeo').attr('disabled', false);
                            $('#Redondeo').val(60);

                        } else if ($('#cboTipoRed').val() == 78) {

                            $('#Redondeo').attr('disabled', false);
                            $('#Redondeo').val(30);
                            $('#ChnageRedondeo').empty();

                            $('#ChnageRedondeo').html('<label>Factor de Redondeo(Tiempo)</label>'+
                               '<input type="time" id="tiempo_in" min="00:00"'+
                               ' max="24:00" accept="hh:mm" value="00:00" class="form-control" />');


                        } else {
                            $('#ChnageRedondeo').empty();
                            $('#ChnageRedondeo').html('<label>Factor de Redondeo(Tiempo)</label>' +
                                '<select class= "form-control" id = "Redondeo" disabled>' +
                                '<option value="0">00:00</option>' +
                                '<option value="5">00:05</option>' +
                                '<option value="10">00:10</option>' +
                                '<option value="15">00:15</option>' +
                                '<option value="20">00:20</option>' +
                                '<option value="25">00:25</option>' +
                                '<option value="30">00:30</option>' +
                                '<option value="60">01:00</option>' +
                                '</select >');
                            $('#Redondeo').attr('disabled', true);
                            $('#Redondeo').val(0);
                        }
                    });

                }
        });


});

    var _varTablaVariable;

    function TablaVariable() {
    var filtroActivo = $('#filActi').val();
    var strfiltro = $('#filtro').val();
        var filtrojer = $('#campTipoVar').val();


    $.post(
        '/Asistencia/GetTablaFiltradaVariable',
        { IntActivoFilter: filtroActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
        (response) => {

            if (typeof _varTablaVariable !== 'undefined') {
                _varTablaVariable.destroy();
            }
            _varTablaVariable = $('#tablaVariable').DataTable({
                data: response,
                columns: [

                    { data: 'strCoConcepto' },
                    { data: 'strDesConcepto' },
                    { data: 'strDeTipotipo' },
                    { data: 'strDeTipoum' },
                    { data: 'strActivo' },
                    { data: null },
                    { data: 'intIdConcepto' },
                    { data: 'strConceptoCampo1' },
                    { data: 'strConceptoCampo2' },
                    { data: 'strConceptoCampo3' },
                    { data: 'strConceptoCampo4' },
                    { data: 'strConceptoCampo5' },


                ],
                lengthMenu: [10, 25, 50],
                order: [[1, 'desc'], [2, 'desc']],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [//ocultar y definir columnas
                    {
                        targets: [6],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [7],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [8],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [9],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [10],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    {
                        targets: [11],//intIdCargo
                        visible: false,
                        searchable: false
                    },
                    //////{
                    //////    targets: [12],//intIdCargo
                    //////    visible: false,
                    //////    searchable: false
                    //////},
                    {
                        targets: [5],
                        data: null,
                        defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                            '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
                    }
                ],
                dom: 'lBfrtip',
            });


            $('#tablaVariable  tbody').on('click', 'tr button.btn-edit', function () {
                var data = _varTablaVariable.row($(this).parents('tr')).data();
                if (data == null) {
                    data = null;
                    var data = _varTablaVariable.row($(this).parents('li')).data();
                    cardarDatosVariable(data);
                } else {
                    var data = _varTablaVariable.row($(this).parents('tr')).data();
                    cardarDatosVariable(data);
                }

            });

            $('#tablaVariable  tbody').on('click', 'tr button.btn-delete', function () {

                var data = _varTablaVariable.row($(this).parents('tr')).data();

                if (data == null) {
                    data = null;

                    var data = _varTablaVariable.row($(this).parents('li')).data();
                    intentEliminarVariable(data['intIdConcepto'], data['strDeTipotipo'], data['strDesConcepto']);

                } else {

                    var data = _varTablaVariable.row($(this).parents('tr')).data();
                    intentEliminarVariable(data['intIdConcepto'], data['strDeTipotipo'], data['strDesConcepto']);

                }


            });

        });

}

    function intentEliminarVariable(idVar,tipo, strDesc) {
    swal({
        title: "Eliminar Variable",
        text: "¿Está seguro de eliminar la variable   ''<strong>" + strDesc + "</strong>''  de tipo  " + tipo +"   ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaVariable(idVar);
        } else {
            swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}

    function yesEliminaVariable(idVar) {
    $.post(
        '/Asistencia/EliminarConcepto',
        { intIdConcepto: idVar },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    TablaVariable();
                TablaExtra();
                EdiatarPrioridades();
            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}

    function cardarDatosVariable(data) {
    $.post(
        '/Asistencia/EditarVariable',
        {},
        (response) => {

            if (response !== '') {
                $('.form-hide-variable .x_content').empty();
                $('.form-hide-variable .x_content').html(response);
                $('.form-hide-variable').show();
                $('#btn-update-variable').show();
                $('#btn-save-change-variable').hide();

                switcheryLoad();
                init_checkBox_styles();
                //  onchange_jerarquia();
                TablaExtra();

                $.post(
                    '/Asistencia/ObtenerConceptoPorsuPK',
                    { intIdConcepto: data.intIdConcepto },
                    (response) => {

                        console.log(response);
                        response.forEach(element => {

                            $('#cboVariable').val(element.intTipoConcepto);

                            var variableds = $('#cboVariable').val();

                            $.post(
                                '/Asistencia/LlenarTipoUM',
                                { strEntidad: 'TGTIPO', intIdFiltroGrupo: variableds, strGrupo: 'VARI', strSubGrupo: 'UM' },
                                (response) => {

                                    $('#campTipoum').empty();
                                    response.forEach(element2 => {

                                        if (element.intTipoUM == element2.intidTipo) {
                                            $('#campTipoum').append('<option value="' + element2.intidTipo + '" selected>' + element2.strDeTipo + '</option>');
                                        } else if (element.intTipoUM !== element2.intidTipo) {
                                            $('#campTipoum').append('<option value="' + element2.intidTipo + '">' + element2.strDeTipo + '</option>');

                                        }
                                        if ($('#campTipoum').val() == 25) {
                                            $('#Horas').show();
                                            $('#cboAplica').val(79);
                                            $('#cboRedondeo').val(82);
                                            $('#cboRedondeo').attr('disabled', true);
                                        } else {
                                            $('#Horas').hide();

                                        }
                                    });
                                    $('#campTipoum').attr('disabled', );


                                });


                            $('#txt_cod_Var').val(element.strCoConcepto);
                            $('#txt_desc_Var').val(element.strDesConcepto);
                            $('#txt_codPla_Var').val(element.strCoPlaniExp);
                            $('#txt_codExte_Var').val(element.strCoPDT);
                            $('#txtIdConcepto').val(element.intIdConcepto);
                            $('#strConceptoCampo1').val(element.strConceptoCampo1);
                            $('#strConceptoCampo2').val(element.strConceptoCampo2);
                            $('#strConceptoCampo3').val(element.strConceptoCampo3);
                            $('#strConceptoCampo4').val(element.strConceptoCampo4);
                            $('#strConceptoCampo5').val(element.strConceptoCampo5);
                            $('#strConceptoCampo5').val(element.strConceptoCampo5);


                            if (element.timeHoraIni == 0) {

                            } else if (element.timeHoraIni !== 0) {

                                $('#tiempo_in').val(element.timeHoraIni);
                            }


                            if (element.timeHoraFin == 0) {

                            } else if (element.timeHoraFin !== 0) {

                                $('#tiempo_fil').val(element.timeHoraFin);
                            }


                            if (element.timeTiempoMin == 0) {

                            } else if (element.timeTiempoMin !== 0) {

                                $('#tiempo_min').val(element.timeTiempoMin);
                            }

                            if (element.timeTolerancia == 0) {

                            } else if (element.timeTolerancia !== 0) {

                                $('#tiempo_tol').val(element.timeTolerancia);
                            }



                            if (element.bitClasifica == 0) {

                                $('#chck_inc').iCheck('check');
                                $('#chck_ause').iCheck('uncheck');

                            } else if (element.bitClasifica == 1) {
                                $('#chck_inc').iCheck('uncheck');
                                $('#chck_ause').iCheck('check');
                            }

                            if (element.bitClasifica == 0) {

                                $('#chck_inc').iCheck('check');
                                $('#chck_ause').iCheck('uncheck');

                            } else if (element.bitClasifica == 1) {
                                $('#chck_inc').iCheck('uncheck');
                                $('#chck_ause').iCheck('check');
                            }






                            $('#chck_Permite').on('ifChanged', function () {
                                if ($('#chck_Permite').is(':checked') == true) {

                                    $('#chck_Requiere').iCheck('uncheck');
                                }
                            });
                            $('#chck_Requiere').on('ifChanged', function () {
                                if ($('#chck_Requiere').is(':checked') == true) {
                                    $('#chck_Permite').iCheck('uncheck');

                                }
                            });



                            if (element.bitReqMarca == 0) {

                                $('#chck_Permite').iCheck('check');
                                $('#chck_Requiere').iCheck('uncheck');

                            } else if (element.bitReqMarca == 1) {
                                $('#chck_Permite').iCheck('uncheck');
                                $('#chck_Requiere').iCheck('check');
                            }
                            else if (element.bitReqMarca == 2) {
                                $('#chck_Permite').iCheck('uncheck');
                                $('#chck_Requiere').iCheck('uncheck');
                            }




                            if (element.bitAplTodosDias == 0) {
                                $('#chck_ToDias').iCheck('uncheck');


                            } else if (element.bitAplTodosDias == 1) {
                                $('#chck_ToDias').iCheck('check');
                            }

                            if (element.bitAplDiaLabor == 0) {
                                $('#chck_DiLab').iCheck('uncheck');


                            } else if (element.bitAplTodosDias == 1) {
                                $('#chck_DiLab').iCheck('check');
                            }

                            if (element.bitAplDiaDescanso == 0) {
                                $('#chck_DiDesc').iCheck('uncheck');


                            } else if (element.bitAplTodosDias == 1) {
                                $('#chck_DiDesc').iCheck('check');
                            }

                            if (element.bitAplDiaFeriado == 0) {
                                $('#chck_DiFer').iCheck('uncheck');


                            } else if (element.bitAplTodosDias == 1) {
                                $('#chck_DiFer').iCheck('check');
                            }

                            if (element.bitAplDiaSabado == 0) {
                                $('#chck_DiSab').iCheck('uncheck');


                            } else if (element.bitAplDiaSabado == 1) {
                                $('#chck_DiSab').iCheck('check');
                            }

                            if (element.bitAplDiaDomingo == 0) {
                                $('#chck_DiDom').iCheck('uncheck');


                            } else if (element.bitAplDiaDomingo == 1) {
                                $('#chck_DiDom').iCheck('check');
                            }

                            if (element.smlTipoRedondeo == 0) {
                                $('#cboTipoRed').val(75);


                            } else if (element.smlTipoRedondeo !== 0) {
                                $('#cboTipoRed').val(element.smlTipoRedondeo);
                            }
                            if (element.smlFormaRedond == 0 && element.smlFormaRedond == 1) {

                            } else if (element.smlAplicaRedond !== 0 && element.smlFormaRedond !== 1) {
                                $('#cboAplica').val(element.smlAplicaRedond);
                            }


                            $('#Redondeo').val(element.intTiempoRedond);

                            if (element.smlFormaRedond == 0 && element.smlFormaRedond == 1) {

                            } else if (element.smlFormaRedond !== 0 && element.smlFormaRedond !== 1) {
                                $('#cboRedondeo').val(element.smlFormaRedond);
                            }

                            if (element.bitFlHT == 0) {
                                $('#chckHorTra').iCheck('uncheck');


                            } else if (element.bitFlHT == 1) {
                                $('#chckHorTra').iCheck('check');
                            }

                            if (element.bitFlDT == 0) {
                                $('#chckDiaTra').iCheck('uncheck');


                            } else if (element.bitFlDT == 1) {
                                $('#chckDiaTra').iCheck('check');
                            }


                            if (element.bitFlHTE == 0) {
                                $('#chckTraEfec').iCheck('uncheck');


                            } else if (element.bitFlDT == 1) {
                                $('#chckTraEfec').iCheck('check');
                            }

                            if (element.bitExportPlani == 0) {
                                $('#chckExpPlan').iCheck('uncheck');


                            } else if (element.bitExportPlani == 1) {
                                $('#chckExpPlan').iCheck('check');
                            }

                            if (element.bitFlSubsidio == 0) {
                                $('#chckExpSubs').iCheck('uncheck');


                            } else if (element.bitFlSubsidio == 1) {
                                $('#chckExpSubs').iCheck('check');
                            }

                            if (element.bitFlDiaNoLabNiSub == 0) {
                                $('#chckExpNoTraNoSubs').iCheck('uncheck');


                            } else if (element.bitFlDiaNoLabNiSub == 1) {
                                $('#chckExpNoTraNoSubs').iCheck('check');
                            }

                            if (element.bitFlCTS == 0) {
                                $('#chckCalculoCTS').iCheck('uncheck');


                            } else if (element.bitFlCTS == 1) {
                                $('#chckCalculoCTS').iCheck('check');
                            }

                            if (element.tinFlCompensacion == 0) {
                                $('#chckCompensable').iCheck('uncheck');


                            } else if (element.tinFlCompensacion == 1) {
                                $('#chckCompensable').iCheck('check');
                            }


                            if (element.bitFlActivo == 0) {

                                $('#idche').html('<input type="checkbox" id="chck_Activo_Var" class=" js-switch"  /> Activo');
                               // $('#chck_Activo_Var').iCheck('uncheck');
                                switcheryLoad();
                            } else if (element.bitFlActivo == 1) {

                                $('#idche').html('<input type="checkbox" id="chck_Activo_Var" class=" js-switch" checked /> Activo');
                               // $('#chck_Activo_Var').iCheck('check');
                                switcheryLoad();
                            }


                            if (element.bitFlGenerarHA == 0) {
                                $('#chckGenerHoras').iCheck('uncheck');


                            } else if (element.bitFlGenerarHA == 1) {
                                $('#chckGenerHoras').iCheck('check');
                            }


                            if ($('#cboVariable option:selected').val() == 31 ) {
                                $('#txt_cod_Var').attr('disabled', true);

                                $('#campTipoum').attr('disabled', true);

                            }

                            $('#Incidencia-det').show();

                            if ($('#cboVariable').val() == 30 ) {
                                $('#GeneralChecks').show();
                                $('#Todos').show();
                                $('#Laborable').show();
                                $('#Descanso').hide();
                                $('#Feriado').hide();
                                $('#Sábado').hide();
                                $('#Domingo').hide();
                                $('#extras').hide();
                                $('#Marcas-det').show();
                                $('#bonificacion-det').show();
                                $('#bonificacion-det').html('<p>' +
                                    '<input type = "checkbox" id = "chck_Descontable" class= "flat" checked name = "iCheck2" >Descontable</p>' +
                                    '<p><input type="checkbox" id="chck_Sustentación" class="flat" name="iCheck2">Sustentación</p>');
                                init_checkBox_styles();
                                $('#Específicos').hide();
                                $('#horarios-det').show();
                                $('#horarios-det').html('<p>Uso máximo anual</p>' +
                                    '<input type = "text" id = "txtMaxUso" class="form-control" placeholder="Máximo">');
                                $('#ConfiguracionBonificaciones').hide();
                                $('#Acumulables').show();
                                $('#cboRedondeo').attr('disabled', false);

                                $('#chck_Permite').on('ifChanged', function () {

                                    if ($('#chck_Permite').is(':checked') == true) {
                                        $('#chck_Requiere').iCheck('uncheck');
                                    }
                                });
                                $('#chck_Requiere').on('ifChanged', function () {

                                    if ($('#chck_Requiere').is(':checked') == true) {
                                        $('#chck_Permite').iCheck('uncheck');

                                    }
                                });


                            /******************************/

                            /******************************/


                            }
                           else if ($('#cboVariable').val() == 31) {
                                $('#GeneralChecks').hide();
                                $('#Todos').hide();
                                $('#Laborable').hide();
                                $('#Descanso').hide();
                                $('#Feriado').hide();
                                $('#Sábado').hide();
                                $('#Domingo').hide();
                                $('#extras').hide();
                                $('#Marcas-det').show();
                                $('#bonificacion-det').show();
                                $('#bonificacion-det').html('<p>' +
                                    '<input type = "checkbox" id = "chck_Descontable" class= "flat" checked name = "iCheck2" >Descontable</p>' +
                                    '<p><input type="checkbox" id="chck_Sustentación" class="flat" name="iCheck2">Sustentación</p>');
                                init_checkBox_styles();
                                $('#Específicos').hide();
                                $('#horarios-det').show();
                                $('#horarios-det').html('<p>Uso máximo anual</p>' +
                                    '<input type = "text" id = "txtMaxUso" class="form-control" placeholder="Máximo">');
                                $('#ConfiguracionBonificaciones').hide();
                                $('#Acumulables').hide();

                                $('#chck_Permite').on('ifChanged', function () {

                                    if ($('#chck_Permite').is(':checked') == true) {
                                        $('#chck_Requiere').iCheck('uncheck');
                                    }
                                });
                                $('#chck_Requiere').on('ifChanged', function () {

                                    if ($('#chck_Requiere').is(':checked') == true) {
                                        $('#chck_Permite').iCheck('uncheck');

                                    }
                                });

                            }
                            else if ($('#cboVariable').val() == 33) {
                                $('#GeneralChecks').show();
                                $('#Todos').hide();
                                $('#Laborable').show();
                                $('#Descanso').show();
                                $('#Feriado').show();
                                $('#Sábado').show();
                                $('#Domingo').show();
                                $('#extras').hide();
                                $('#Específicos').hide();
                                $('#bonificacion-det').html('<p>' +
                                    '<input type = "radio" id = "chck_Total" class= "flat" checked name = "iCheck1" > Bono Total' +
                                    '</p ><p><input type="radio" id="chck_Específico" class="flat" name="iCheck1"> Bono Específico' +
                                    '</p>');
                                $('#horarios-det').html('<p>' +
                                    '<input type="radio" id="chck_HorTotal" class="flat" name="iCheck3"> Cualquier Jornada' +
                                    '</p ><p><input type = "radio" id = "chck_HorEspeci" class= "flat" checked name = "iCheck3" > Jornadas Específicas' +
                                    '</p>');


                                $('#Específicos').hide();
                                $('#Marcas-det').hide();
                                $('#bonificacion-det').show();
                                $('#horarios-det').show();

                                $('#cboRedondeo').attr('disabled', false);

                                $('#chck_Específico').on('ifChanged', function (event) {

                                    if ($('#chck_Específico').is(':checked') == true) {

                                        $('#ConfiguracionBonificaciones').show();
                                    } else {


                                        $('#ConfiguracionBonificaciones').hide();
                                    }

                                });
                                if ($('#chck_Específico').is(':checked') == true) {

                                    $('#ConfiguracionBonificaciones').show();
                                } else {


                                    $('#ConfiguracionBonificaciones').hide();
                                }
                                $('#chck_HorEspeci').on('ifChanged', function (event) {

                                    if ($('#chck_HorEspeci').is(':checked') == true) {

                                        $('#Específicos').show();
                                    } else {


                                        $('#Específicos').hide();
                                    }

                                });
                                if ($('#chck_HorEspeci').is(':checked') == true) {

                                    $('#Específicos').show();
                                } else {


                                    $('#Específicos').hide();
                                }
                                init_checkBox_styles();

                                $('#selects').on('ifChanged', function () {

                                    if ($('#selects').is(':checked') == true) {

                                        $('#ListaHorario option').prop('hidden', true);
                                        $('#ListaHorario option:selected').prop('hidden', false);


                                    } else {
                                        $('#ListaHorario option').prop('hidden', false);
                                    }
                                });

                                $('#select_All').on('ifChanged', function () {


                                    if ($('#select_All').is(':checked') == true) {

                                        $('#ListaHorario option').prop('selected', true);

                                    } else {
                                        $('#ListaHorario option').prop('selected', false);
                                    }


                                });


                                if (element.intIdTipBoni == 4) {
                                    $('#chck_Específico').iCheck('check');

                                } else if (element.intIdTipBoni == 3){
                                    $('#chck_Específico').iCheck('uncheck');


                                }

                            }
                            else if ($('#cboVariable').val() == 32) {
                                $('#GeneralChecks').hide();
                                $('#extras').show();
                                $('#horarios-det').show();
                                $('#Específicos').show();
                                $('#bonificacion-det').hide();
                                //prioridades();
                                //EdiatarPrioridades();
                                TablaExtra();
                                EdiatarPrioridades();
                                $('#horarios-det').hide();
                                $('#Específicos').hide();
                                $('#ConfiguracionBonificaciones').hide();
                                $('#Marcas-det').hide();
                                $('#Acumulables').hide();
                                $('#cboRedondeo').attr('disabled', false);

                            }
                            else {
                                $('#GeneralChecks').hide();
                                $('#Todos').hide();
                                $('#Laborable').hide();
                                $('#Descanso').hide();
                                $('#Feriado').hide();
                                $('#Sábado').hide();
                                $('#Domingo').hide();
                                $('#extras').hide();
                                $('#cboRedondeo').attr('disabled', false);

                            }


                            $('#cboVariable').on('change', function () {
                                $('#Incidencia-det').show();

                                if ($('#cboVariable').val() == 30 ) {
                                    $('#GeneralChecks').show();
                                    $('#Todos').show();
                                    $('#Laborable').show();
                                    $('#Descanso').hide();
                                    $('#Feriado').hide();
                                    $('#Sábado').hide();
                                    $('#Domingo').hide();
                                    $('#extras').hide();
                                    $('#Marcas-det').show();
                                    $('#bonificacion-det').show();
                                    $('#bonificacion-det').html('<p>' +
                                        '<input type = "checkbox" id = "chck_Descontable" class= "flat" checked name = "iCheck2" >Descontable</p>' +
                                        '<p><input type="checkbox" id="chck_Sustentación" class="flat" name="iCheck2">Sustentación</p>');
                                    init_checkBox_styles();
                                    $('#Específicos').hide();
                                    $('#horarios-det').show();
                                    $('#horarios-det').html('<p>Uso máximo anual</p>' +
                                        '<input type = "text" id = "txtMaxUso" class="form-control" placeholder="Máximo">');
                                    $('#ConfiguracionBonificaciones').hide();
                                    $('#Acumulables').show();

                                    $('#chck_Permite').on('ifChanged', function () {

                                        if ($('#chck_Permite').is(':checked') == true) {
                                            $('#chck_Requiere').iCheck('uncheck');
                                        }
                                    });
                                    $('#chck_Requiere').on('ifChanged', function () {

                                        if ($('#chck_Requiere').is(':checked') == true) {
                                            $('#chck_Permite').iCheck('uncheck');

                                        }
                                    });

                                } else if ($('#cboVariable').val() == 31) {
                                    $('#GeneralChecks').hide();
                                    $('#Todos').hide();
                                    $('#Laborable').hide();
                                    $('#Descanso').hide();
                                    $('#Feriado').hide();
                                    $('#Sábado').hide();
                                    $('#Domingo').hide();
                                    $('#extras').hide();
                                    $('#Marcas-det').show();
                                    $('#bonificacion-det').show();
                                    $('#bonificacion-det').html('<p>' +
                                        '<input type = "checkbox" id = "chck_Descontable" class= "flat" checked name = "iCheck2" >Descontable</p>' +
                                        '<p><input type="checkbox" id="chck_Sustentación" class="flat" name="iCheck2">Sustentación</p>');
                                    init_checkBox_styles();
                                    $('#Específicos').hide();
                                    $('#horarios-det').show();
                                    $('#horarios-det').html('<p>Uso máximo anual</p>' +
                                        '<input type = "text" id = "txtMaxUso" class="form-control" placeholder="Máximo">');
                                    $('#ConfiguracionBonificaciones').hide();
                                    $('#Acumulables').hide();

                                    $('#chck_Permite').on('ifChanged', function () {

                                        if ($('#chck_Permite').is(':checked') == true) {
                                            $('#chck_Requiere').iCheck('uncheck');
                                        }
                                    });
                                    $('#chck_Requiere').on('ifChanged', function () {

                                        if ($('#chck_Requiere').is(':checked') == true) {
                                            $('#chck_Permite').iCheck('uncheck');

                                        }
                                    });


                                } else if ($('#cboVariable').val() == 33) {
                                    $('#GeneralChecks').show();
                                    $('#Todos').hide();
                                    $('#Laborable').show();
                                    $('#Descanso').show();
                                    $('#Feriado').show();
                                    $('#Sábado').show();
                                    $('#Domingo').show();
                                    $('#extras').hide();
                                    $('#Específicos').hide();
                                    $('#bonificacion-det').html('<p>' +
                                        '<input type = "radio" id = "chck_Total" class= "flat" checked name = "iCheck1" > Bono Total' +
                                        '</p ><p><input type="radio" id="chck_Específico" class="flat" name="iCheck1"> Bono Específico' +
                                        '</p>');
                                    $('#horarios-det').html('<p>' +
                                        '<input type="radio" id="chck_HorTotal" class="flat" name="iCheck3"> Cualquier Jornada' +
                                        '</p ><p><input type = "radio" id = "chck_HorEspeci" class= "flat"  name = "iCheck3" > Jornadas Específicas' +
                                        '</p>');


                                    $('#Específicos').hide();
                                    $('#Marcas-det').hide();
                                    $('#bonificacion-det').show();
                                    $('#horarios-det').show();

                                    $('#chck_Específico').on('ifChanged', function (event) {

                                        if ($('#chck_Específico').is(':checked') == true) {

                                            $('#ConfiguracionBonificaciones').show();
                                        } else {


                                            $('#ConfiguracionBonificaciones').hide();
                                        }

                                    });
                                    if ($('#chck_Específico').is(':checked') == true) {

                                        $('#ConfiguracionBonificaciones').show();
                                    } else {


                                        $('#ConfiguracionBonificaciones').hide();
                                    }
                                    $('#chck_HorEspeci').on('ifChanged', function (event) {

                                        if ($('#chck_HorEspeci').is(':checked') == true) {

                                            $('#Específicos').show();
                                        } else {


                                            $('#Específicos').hide();
                                        }

                                    });
                                    if ($('#chck_HorEspeci').is(':checked') == true) {

                                        $('#Específicos').show();
                                    } else {


                                        $('#Específicos').hide();
                                    }
                                    init_checkBox_styles();

                                    $('#selects').on('ifChanged', function () {

                                        if ($('#selects').is(':checked') == true) {

                                            $('#ListaHorario option').prop('hidden', true);
                                            $('#ListaHorario option:selected').prop('hidden', false);


                                        } else {
                                            $('#ListaHorario option').prop('hidden', false);
                                        }
                                    });

                                    $('#select_All').on('ifChanged', function () {


                                        if ($('#select_All').is(':checked') == true) {

                                            $('#ListaHorario option').prop('selected', true);

                                        } else {
                                            $('#ListaHorario option').prop('selected', false);
                                        }


                                    });


                                } else if ($('#cboVariable').val() == 32) {
                                    $('#GeneralChecks').hide();
                                    $('#extras').show();
                                    $('#horarios-det').show();
                                    $('#Específicos').show();
                                    $('#bonificacion-det').hide();
                                    TablaExtra();
                                    EdiatarPrioridades();
                                    $('#horarios-det').hide();
                                    $('#Específicos').hide();
                                    $('#ConfiguracionBonificaciones').hide();
                                    $('#Marcas-det').hide();
                                    $('#Acumulables').hide();

                                } else {
                                    $('#GeneralChecks').hide();
                                    $('#Todos').hide();
                                    $('#Laborable').hide();
                                    $('#Descanso').hide();
                                    $('#Feriado').hide();
                                    $('#Sábado').hide();
                                    $('#Domingo').hide();
                                    $('#extras').hide();
                                }

                            });

                            $('#campTipoum').on('change', function () {

                                if ($('#campTipoum').val() == 25) {
                                    $('#Horas').show();
                                    $('#cboAplica').val(79);
                                    $('#cboRedondeo').val(82);
                                    $('#cboRedondeo').attr('disabled', false);
                                } else {
                                    $('#Horas').hide();

                                }

                            });

                            $('#cboAplica').on('change', function () {
                                if ($('#cboAplica').val() == 79) {
                                    $('#cboRedondeo').val(82);
                                    $('#cboRedondeo').attr('disabled', false);

                                } else {
                                    $('#cboRedondeo').val('Seleccione');
                                    $('#cboRedondeo').attr('disabled', true);
                                }
                            });

                            $('#cboTipoRed').on('change', function () {

                                if ($('#cboTipoRed').val() == 76) {
                                    $('#ChnageRedondeo').empty();

                                    $('#ChnageRedondeo').html('<label>Factor de Redondeo(Tiempo)</label>' +
                                        '<select class= "form-control" id = "Redondeo" disabled>' +
                                        '<option value="0">00:00</option>' +
                                        '<option value="5">00:05</option>' +
                                        '<option value="10">00:10</option>' +
                                        '<option value="15">00:15</option>' +
                                        '<option value="20">00:20</option>' +
                                        '<option value="25">00:25</option>' +
                                        '<option value="30">00:30</option>' +
                                        '<option value="60">01:00</option>' +
                                        '</select >');

                                    $('#Redondeo').attr('disabled', false);
                                    $('#Redondeo').val(5);

                                } else if ($('#cboTipoRed').val() == 77) {
                                    $('#ChnageRedondeo').empty();
                                    $('#ChnageRedondeo').html('<label>Factor de Redondeo(Tiempo)</label>' +
                                        '<select class= "form-control" id = "Redondeo" disabled>' +
                                        '<option value="0">00:00</option>' +
                                        '<option value="5">00:05</option>' +
                                        '<option value="10">00:10</option>' +
                                        '<option value="15">00:15</option>' +
                                        '<option value="20">00:20</option>' +
                                        '<option value="25">00:25</option>' +
                                        '<option value="30">00:30</option>' +
                                        '<option value="60">01:00</option>' +
                                        '</select >');

                                    $('#Redondeo').attr('disabled', false);
                                    $('#Redondeo').val(60);

                                } else if ($('#cboTipoRed').val() == 78) {

                                    $('#Redondeo').attr('disabled', false);
                                    $('#Redondeo').val(30);
                                    $('#ChnageRedondeo').empty();

                                    $('#ChnageRedondeo').html('<label>Factor de Redondeo(Tiempo)</label>' +
                                        '<input type="time" id="tiempo_in" min="00:00"' +
                                        ' max="24:00" accept="hh:mm" value="00:00" class="form-control" />');


                                } else {
                                    $('#ChnageRedondeo').empty();
                                    $('#ChnageRedondeo').html('<label>Factor de Redondeo(Tiempo)</label>' +
                                        '<select class= "form-control" id = "Redondeo" disabled>' +
                                        '<option value="0">00:00</option>' +
                                        '<option value="5">00:05</option>' +
                                        '<option value="10">00:10</option>' +
                                        '<option value="15">00:15</option>' +
                                        '<option value="20">00:20</option>' +
                                        '<option value="25">00:25</option>' +
                                        '<option value="30">00:30</option>' +
                                        '<option value="60">01:00</option>' +
                                        '</select >');
                                    $('#Redondeo').attr('disabled', true);
                                    $('#Redondeo').val(0);
                                }
                            });

                            $('#txtMaxUso').val(element.intUsoMaximo);

                            if (element.bitSustentacion == 0) {
                                $('#chck_Sustentación').iCheck('uncheck');


                            } else if (element.bitSustentacion == 1) {
                                $('#chck_Sustentación').iCheck('check');
                            }

                            if (element.bitFlGrati == 0) {
                                $('#chckCalculoGrat').iCheck('uncheck');


                            } else if (element.bitFlGrati == 1) {
                                $('#chckCalculoGrat').iCheck('check');
                            }
                            if (element.bitFlDescontable == 0) {
                                $('#chck_Descontable').iCheck('uncheck');


                            } else if (element.bitFlDescontable == 1) {
                                $('#chck_Descontable').iCheck('check');
                            }

                            if (element.bitFlUtilidades == false) {
                                $('#chckCalidadUtili').iCheck('uncheck');


                            } else if (element.bitFlUtilidades == true) {
                                $('#chckCalidadUtili').iCheck('check');
                            }


                            if (element.bitJornadaEspecif == false) {


                                $('#chck_HorTotal').iCheck('check');

                            }

                            else if (element.bitJornadaEspecif == true) {


                                $('#chck_HorEspeci').iCheck('check');


                            }
                            if (element.intIdTipBoni == 4) {
                                //$('#chck_Total').iCheck('uncheck');
                                $('#chck_Específico').iCheck('check');
                            } else if (element.intIdTipBoni == 3) {
                                $('#chck_Total').iCheck('check');
                                // $('#chck_Específico').iCheck('uncheck');
                            }



                            $.post(
                                '/Asistencia/ListarHorarioEspecifico',
                                { strEntidad: 'TGJOR_BON_DET', intId: data.intIdConcepto, intUso:1, strGrupo:'', strSubGrupo:''},
                                (response) => {

                                    response.forEach(element => {

                                        $('#ListaHorario option[value=' + element.intIdTipRegimen + ']').prop('selected', true);

                                        //if (data.intIdConcepto == element.intIdConcepto) {


                                        //    $('#ListaHorario').val(element.intIdTipRegimen) || [];


                                        //} else {
                                        //    $('#ListaHorario option').prop('selected', false);
                                        //}


                                    });

                                });

                        });
                    });
            }
        });


    EdiatarPrioridades();
}

    function LlenarTipoVar() {
  $.post(
    '/Asistencia/LlenarTipoVar',
    { },
    (response) => {
        if (true) {
            response.forEach(element => {
                $('#campTipoVar').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');
            });
        }
    }
   ).fail(function (result) {
    alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}

    $('#btn-save-change-variable').on('click', function () {

    var _TipoVariable = $('#cboVariable option:selected').val();
      var _TipoUniMed = $('#campTipoum option:selected').val();
    var _codigo = $('#txt_cod_Var').val();
    var _desc = $('#txt_desc_Var').val();
    var _codigoPlani = $('#txt_codPla_Var').val();
    var _codigoExter = $('#txt_codExte_Var').val();
    var _chckinci = $('#chck_inc').is(':checked');
    var _chckusen = $('#chck_ause').is(':checked');
    //var _chckpermite = $('#chck_Permite').is(':checked');
    //var _chckrequiere = $('#chck_Requiere').is(':checked');

      var _marcas = null;
      if ($('#chck_Permite').is(':checked') == true) {
          _marcas = false;
      } if ($('#chck_Requiere').is(':checked') == true) {
          _marcas = true;
      } if ($('#chck_Permite').is(':checked') == false  && $('#chck_Requiere').is(':checked') == false) {
          _marcas = null;
      } if ($('#chck_Permite').is(':checked') == null) {
          _marcas = null;
      }
      if ($('#chck_Requiere').is(':checked') == null) {
          _marcas = null;
      }

      var _jor = null;
      if ($('#chck_HorTotal').is(':checked') == true) {
          _jor = false;
      } if ($('#chck_HorEspeci').is(':checked') == true) {
          _jor = true;
      } if ($('#chck_HorTotal').is(':checked') == null) {
          _jor = null;
      }
      if ($('#chck_HorEspeci').is(':checked') == null) {
          _jor = null;
      }


      var _intboni = null;

      if ($('#cboVariable').val() == 33) {

          if ($('#chck_Específico').is(':checked') == true) {
               _intboni =04;
          } if ($('#chck_Total').is(':checked') == true) {
               _intboni = 03;
          } if ($('#chck_Total').is(':checked') == null) {
               _intboni = null;
          }
          if ($('#chck_Específico').is(':checked') == null) {
               _intboni = null;
          }

      } else {


      }
    var _chcktodias = $('#chck_ToDias').is(':checked');
    var _chckdiaLab = $('#chck_DiLab').is(':checked');
    var _chckdiadesc = $('#chck_DiDesc').is(':checked');
    var _chckdiafer = $('#chck_DiFer').is(':checked');
    var _chckdiasab = $('#chck_DiSab').is(':checked');
    var _chckdiadom = $('#chck_DiDom').is(':checked');
    var _intIdConcepto = $('#txtIdConcepto').val();


    if ($('#tiempo_min').val() == null) {
        var _tiempmin = null;
    } else {
        var _tiempmin = $('#tiempo_min').val();
    }

    if ($('#tiempo_tol').val() == null) {
        var _tiemptol = null;
    } else {
        var _tiemptol = $('#tiempo_tol').val();
    }
    if ($('#txtMaxUso').val() == null) {
        var _txtMaxUso = null;
    } else {
        var _txtMaxUso = $('#txtMaxUso').val();
    }

    if ($('#tiempo_in').val() == null) {
        var _tiempo_in = '00:00:00';
    } else {
        var _tiempo_in = $('#tiempo_in').val();
    }

    if ($('#tiempo_fil').val() == null) {
        var _tiempo_fil = '00:00:00';
    } else {
        var _tiempo_fil = $('#tiempo_fil').val();
    }
    if ($('#tiempo_min').val() == null) {

        var _tiempo_min = '00:00:00';
    } else {
        var _tiempo_min = $('#tiempo_min').val();
    }

    if ($('#tiempo_tol').val() == '') {
        var _tiempo_tol = '00:00:00';
    } else {
        var _tiempo_tol = $('#tiempo_tol').val();
    }

    if ($('#cboTipoRegimen option:selected').val() == null) {
        var _TipoRgimen = null;
    } else {
        var _TipoRgimen = $('#cboTipoRegimen option:selected').val();
    }

    if ($('#cboTipoRed option:selected').val() == null) {
        var _TipoRedondeo = null;
    } else {
        var _TipoRedondeo = $('#cboTipoRed option:selected').val();
    }

    if ($('#cboAplica option:selected').val() == null) {
        var _AplicaPor = null;
    } else {
        var _AplicaPor = $('#cboAplica option:selected').val();
    }

    if ($('#Redondeo option:selected').val() == null) {
        var _FactorRed = null;
    } else {
        var _FactorRed = $('#Redondeo option:selected').val();
    }

    if ($('#cboRedondeo option:selected').val() == null) {
        var _FormaRedondeo = null;
    } else {
        var _FormaRedondeo = $('#cboRedondeo option:selected').val();
    }

    if ($('#ListaHorario option:selected').val() == null) {
        var _HorEspeci = null;
    } else {
        var _HorEspeci = $('#ListaHorario option:selected').val();
    }

    if ($('#Prioridad1 option:selected').val() == null) {
        var _Prioridad = null;
    } else {
        var _Prioridad = $('#Prioridad option:selected').val();
    }

    var _chckHorTra = $('#chckHorTra').is(':checked');
    var _chckDiaTra = $('#chckDiaTra').is(':checked');
    var _chckTraEfec = $('#chckTraEfec').is(':checked');
    var _chckExpPlan = $('#chckExpPlan').is(':checked');
    var _chckExpSubs = $('#chckExpSubs').is(':checked');
    var _chckExpNoTraNoSub = $('#chckExpNoTraNoSubs').is(':checked');
    var _chckCalculoCTS = $('#chckCalculoCTS').is(':checked');
    var _chckCalidadUti = $('#chckCalidadUtili').is(':checked');
    var _chckCalculoGrat = $('#chckCalculoGrat').is(':checked');
    var _chckActivo = $('#chck_Activo_Var').is(':checked');

    if ($('#chckCompensable').is(':checked')) {
        var _chckComp = 1;
    } else {
        var _chckComp = 0;
    }
      var _chckGenera = $('#chckGenerHoras').is(':checked');

    var _chck_Descontable = $('#chck_Descontable').is(':checked');
    var _chck_Sustentación = $('#chck_Sustentación').is(':checked');

    if ($('#strConceptoCampo1').val() == null) {
        var _campVar1 = null;
    } else {
        var _campVar1 = $('#strConceptoCampo1').val();
    }

    if ($('#strConceptoCampo2').val() == null) {
        var _campVar2 = null;
    } else {
        var _campVar2 = $('#strConceptoCampo2').val();
    }

    if ($('#strConceptoCampo3').val() == null) {
        var _campVar3 = null;
    } else {
        var _campVar3 = $('#strConceptoCampo3').val();
    }

    if ($('#strConceptoCampo4').val() == null) {
        var _campVar4 = null;
    } else {
        var _campVar4 = $('#strConceptoCampo4').val();
    }

    if ($('#strConceptoCampo5').val() == null) {
        var _campVar5 = null;
    } else {
        var _campVar5 = $('#strConceptoCampo5').val();
      }

      if (_codigo === '' || _desc === '' || _TipoVariable === '' || _TipoUniMed === '' || _TipoUniMed === "0"
        || _codigoPlani === '' || _codigoExter === '') {
        new PNotify({
            title: 'Nueva Variable',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
      }


    var Variable = {

        // intIdSoft: 1,
        intTipoConcepto: _TipoVariable,
        bitInternoSis: 0,
        strCoConcepto: _codigo,
        strDesConcepto: _desc,
        bitReqMarca: _marcas,
        strCoPlaniExp: _codigoPlani,
        strCoPDT: _codigoExter,
        intTipoUM: _TipoUniMed,
        bitAplTodosDias: _chcktodias,
        bitAplDiaLabor: _chckdiaLab,
        bitAplDiaDescanso: _chckdiadesc,
        bitAplDiaFeriado: _chckdiafer,
        bitAplDiaSabado: _chckdiasab,
        bitAplDiaDomingo: _chckdiadom,
        intIdTipRegimen: 34,                  //_TipoRgimen
        bitClasifica: _chckusen,
        smlTipoRedondeo: _TipoRedondeo,
        smlAplicaRedond: _AplicaPor,
        intTiempoRedond: _FactorRed,
        smlFormaRedond: _FormaRedondeo,
        bitFlHT: _chckHorTra,
        bitFlDT: _chckDiaTra,
        bitFlHTE: _chckTraEfec,
        bitFlGenerarHA: _chckGenera,
        bitFlCTS: _chckCalculoCTS,
        bitExportPlani: _chckExpPlan,
        bitFlSubsidio: _chckExpSubs,
        bitFlDiaNoLabNiSub: _chckExpNoTraNoSub,
        intTiempoRTardanza: null,
        tinFlCompensacion: _chckComp,
        tinPrioridadHE: 0,
        intIdTipBoni: _intboni,
        timeHoraIni: _tiempo_in,
        timeHoraFin: _tiempo_fil,
        timeTolerancia: _tiempo_min,
        timeTiempoMin: _tiempo_tol,
        bitSustentacion: _chck_Sustentación,
        intUsoMaximo: _txtMaxUso,
        strConceptoCampo1: _campVar1,
        strConceptoCampo2: _campVar2,
        strConceptoCampo3: _campVar3,
        strConceptoCampo4: _campVar4,
        strConceptoCampo5: _campVar5,
        bitFlActivo: _chckActivo,
        bitflutilidades: _chckCalidadUti,
        bitFlGrati: _chckCalculoGrat,
        bitFlDescontable: _chck_Descontable,
        bitJornadaEspecif: _jor,

      }
      console.log(Variable);

      class PrioridadesConcepto {
        constructor(intIdConcepto, tinPrioridadHE) {
            this.intIdConcepto = intIdConcepto
            this.tinPrioridadHE = tinPrioridadHE
        }
      }

    class JornadasBonificacion {
        constructor(intIdJorBonDet, intIdConcepto, intIdJornada, intIdUniOrg, dttFecAsig) {
            this.intIdJorBonDet = intIdJorBonDet
            this.intIdConcepto = intIdConcepto
            this.intIdJornada = intIdJornada
            this.intIdUniOrg = intIdUniOrg
            this.dttFecAsig = dttFecAsig


        }
    }

      var detalleVar = new Array();
      $('#tb_HorasExtras tr').each((index, item) => {
          var tr_cogido = $(item).find('td').first().html();
          var td_id = $(item).find('select option:selected').val();
          //var input = $(item).find('input');
          //   $('.HEP' + (index + 1) + '').val();
          // $('.HEP' + (index + 1) + '').prop('id');

          detalleVar.push(new PrioridadesConcepto(tr_cogido, td_id));

      });
      console.log(detalleVar);

    var detalleBoni = new Array();
    $('#ListaHorario option:selected').each((index, item) => {
        //var input = $(item).find('input');
        console.log(item);
        var tr_cogido = $(item).val();
        detalleBoni.push(new JornadasBonificacion(0, 0, tr_cogido, 0, null));

    });
    console.log(detalleBoni);


        $.post(
            '/Asistencia/RegistrarNuevaVariable',
            { ObjConcepto: Variable, listaConcepto: detalleVar, listaDetaBoni: detalleBoni},
            (response) => {
                console.log(response);
                if (response.type !== '') {

                    if (response.type === 'success') {
                        new PNotify({
                            title: 'Nueva Variable',
                            text: response.message,
                            type: response.type,
                            delay: 3000,
                            styling: 'bootstrap3'
                        });
                        TablaVariable();
                        $('.form-hide-variable').hide();
                    } else {

                        if (response.type === 'info') {
                            var nomMantemiento = 'Variable';
                            var campo = 'txt_cod_Var';
                            var msj = response.message;
                            var response = response.type;
                            var deta = 'notifry_error';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                           return;

                        } else {

                            if (response.type === 'error') {

                                var nomMantemiento = 'Variable';
                                var campo = 'txt_desc_Var';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errordes';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;
                            } else {
                                if (response.type === 'alert') {

                                    var nomMantemiento = 'Variable';
                                    var campo = 'txt_codPla_Var';
                                    var msj = response.message;
                                    var response = 'info';
                                    var deta = 'notifry_errorpla';
                                    INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                    return;
                                } else if (response.type === 'externo') {

                                    var nomMantemiento = 'Variable';
                                    var campo = 'txt_codExte_Var';
                                    var msj = response.message;
                                    var response = 'info';
                                    var deta = 'notifry_errorext';
                                    INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                } else {

                                    return;
                                }
                            }

                        }
                    }

                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });

});

    $('#btn-update-variable').on('click', function () {
    var _intIdConcepto = $('#txtIdConcepto').val();
    var _TipoVariable = $('#cboVariable option:selected').val();
      var _TipoUniMed = $('#campTipoum option:selected').val();
    var _codigo = $('#txt_cod_Var').val();
    var _desc = $('#txt_desc_Var').val();
    var _codigoPlani = $('#txt_codPla_Var').val();
    var _codigoExter = $('#txt_codExte_Var').val();
    var _chckinci = $('#chck_inc').is(':checked');
    var _chckusen = $('#chck_ause').is(':checked');
    var _chckpermite = $('#chck_Permite').is(':checked');
    var _chckrequiere = $('#chck_Requiere').is(':checked');


      var _marcas = null;
      if ($('#chck_Permite').is(':checked') == true) {
          _marcas = false;
      } if ($('#chck_Requiere').is(':checked') == true) {
          _marcas = true;
      } if ($('#chck_Permite').is(':checked') == false && $('#chck_Requiere').is(':checked') == false) {
          _marcas = null;
      } if ($('#chck_Permite').is(':checked') == null) {
          _marcas = null;
      }
      if ($('#chck_Requiere').is(':checked') == null) {
          _marcas = null;
      }

      var _jor = null;
      if ($('#chck_HorTotal').is(':checked') == true) {
          _jor = false;
      } if ($('#chck_HorEspeci').is(':checked') == true) {
          _jor = true;
      } if ($('#chck_HorTotal').is(':checked') == null) {
          _jor = null;
      }
      if ($('#chck_HorEspeci').is(':checked') == null) {
          _jor = null;
      }

      var _intboni = null;

      if ($('#cboVariable').val() == 33) {

          if ($('#chck_Específico').is(':checked') == true) {
              _intboni = 4;
          } if ($('#chck_Total').is(':checked') == true) {
              _intboni = 3;
          } if ($('#chck_Total').is(':checked') == null) {
              _intboni = null;
          }
          if ($('#chck_Específico').is(':checked') == null) {
              _intboni = 0;
          }

      } else {
          _intboni = 0;

      }


    var _chcktodias = $('#chck_ToDias').is(':checked');
    var _chckdiaLab = $('#chck_DiLab').is(':checked');
    var _chckdiadesc = $('#chck_DiDesc').is(':checked');
    var _chckdiafer = $('#chck_DiFer').is(':checked');
    var _chckdiasab = $('#chck_DiSab').is(':checked');
    var _chckdiadom = $('#chck_DiDom').is(':checked');

    if ($('#tiempo_min').val() == null) {
        var _tiempmin = null;
    } else {
        var _tiempmin = $('#tiempo_min').val();
    }

    if ($('#tiempo_tol').val() == null) {
        var _tiemptol = null;
    } else {
        var _tiemptol = $('#tiempo_tol').val();
    }
    if ($('#txtMaxUso').val() == null) {
        var _txtMaxUso = null;
    } else {
        var _txtMaxUso = $('#txtMaxUso').val();
    }

    if ($('#tiempo_in').val() == null) {
        var _tiempo_in = null;
    } else {
        var _tiempo_in = $('#tiempo_in').val();
    }

    if ($('#tiempo_fil').val() == null) {
        var _tiempo_fil = null;
    } else {
        var _tiempo_fil = $('#tiempo_fil').val();
    }

    if ($('#tiempo_min').val() == null) {
        var _tiempo_min = null;
    } else {
        var _tiempo_min = $('#tiempo_min').val();
      }

    if ($('#tiempo_tol').val() == null) {
        var _tiempo_tol = null;
    } else {
        var _tiempo_tol = $('#tiempo_tol').val();
    }

    if ($('#cboTipoRegimen option:selected').val() == null) {
        var _TipoRgimen = null;
    } else {
        var _TipoRgimen = $('#cboTipoRegimen option:selected').val();
    }

    if ($('#cboTipoRed option:selected').val() == null) {
        var _TipoRedondeo = null;
    } else {
        var _TipoRedondeo = $('#cboTipoRed option:selected').val();
    }

    if ($('#cboAplica option:selected').val() == null) {
        var _AplicaPor = null;
    } else {
        var _AplicaPor = $('#cboAplica option:selected').val();
    }

    if ($('#Redondeo option:selected').val() == null) {
        var _FactorRed = null;
    } else {
        var _FactorRed = $('#Redondeo option:selected').val();
    }

    if ($('#cboRedondeo option:selected').val() == null) {
        var _FormaRedondeo = null;
    } else {
        var _FormaRedondeo = $('#cboRedondeo option:selected').val();
    }

    if ($('#ListaHorario option:selected').val() == null) {
        var _HorEspeci = null;
    } else {
        var _HorEspeci = $('#ListaHorario option:selected').val();
    }

    if ($('#Prioridad1 option:selected').val() == null) {
        var _Prioridad = null;
    } else {
        var _Prioridad = $('#Prioridad option:selected').val();
    }

    var _chckHorTra = $('#chckHorTra').is(':checked');
    var _chckDiaTra = $('#chckDiaTra').is(':checked');
    var _chckTraEfec = $('#chckTraEfec').is(':checked');
    var _chckExpPlan = $('#chckExpPlan').is(':checked');
    var _chckExpSubs = $('#chckExpSubs').is(':checked');
    var _chckExpNoTraNoSub = $('#chckExpNoTraNoSubs').is(':checked');
    var _chckCalculoCTS = $('#chckCalculoCTS').is(':checked');
    var _chckCalidadUti = $('#chckCalidadUtili').is(':checked');
    var _chckCalculoGrat = $('#chckCalculoGrat').is(':checked');
    var _chckActivo = $('#chck_Activo_Var').is(':checked');

    if ($('#chckCompensable').is(':checked')) {
        var _chckComp = 1;
    } else {
        var _chckComp = 0;
    }
    var _chckGenera = $('#chckGenerHoras').is(':checked');
    var _chck_Descontable = $('#chck_Descontable').is(':checked');
    var _chck_Sustentación = $('#chck_Sustentación').is(':checked');

      if ($('#strConceptoCampo1').val() == null) {
          var _campVar1 = null;
      } else {
          var _campVar1 = $('#strConceptoCampo1').val();
      }

      if ($('#strConceptoCampo2').val() == null) {
          var _campVar2 = null;
      } else {
          var _campVar2 = $('#strConceptoCampo2').val();
      }

      if ($('#strConceptoCampo3').val() == null) {
          var _campVar3 = null;
      } else {
          var _campVar3 = $('#strConceptoCampo3').val();
      }

      if ($('#strConceptoCampo4').val() == null) {
          var _campVar4 = null;
      } else {
          var _campVar4 = $('#strConceptoCampo4').val();
      }

      if ($('#strConceptoCampo5').val() == null) {
          var _campVar5 = null;
      } else {
          var _campVar5 = $('#strConceptoCampo5').val();
      }


    if (_codigo === '' || _desc === '' || _TipoVariable === '' || _TipoUniMed === ''
        || _codigoPlani === '' || _codigoExter === '') {
        new PNotify({
            title: 'Actualización de Variable',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }

    var Variable = {

        // intIdSoft: 1,
        intIdConcepto: _intIdConcepto,
        intTipoConcepto: _TipoVariable,
        bitInternoSis: 0,
        strCoConcepto: _codigo,
        strDesConcepto: _desc,
        bitReqMarca: _marcas,
        strCoPlaniExp: _codigoPlani,
        strCoPDT: _codigoExter,
        intTipoUM: _TipoUniMed,
        bitAplTodosDias: _chcktodias,
        bitAplDiaLabor: _chckdiaLab,
        bitAplDiaDescanso: _chckdiadesc,
        bitAplDiaFeriado: _chckdiafer,
        bitAplDiaSabado: _chckdiasab,
        bitAplDiaDomingo: _chckdiadom,
        intIdTipRegimen: 34,                  //_TipoRgimen
        bitClasifica: _chckusen,
        smlTipoRedondeo: _TipoRedondeo,
        smlAplicaRedond: _AplicaPor,
        intTiempoRedond: _FactorRed,
        smlFormaRedond: _FormaRedondeo,
        bitFlHT: _chckHorTra,
        bitFlDT: _chckDiaTra,
        bitFlHTE: _chckTraEfec,
        bitFlGenerarHA: _chckGenera,
        bitFlCTS: _chckCalculoCTS,
        bitExportPlani: _chckExpPlan,
        bitFlSubsidio: _chckExpSubs,
        bitFlDiaNoLabNiSub: _chckExpNoTraNoSub,
        intTiempoRTardanza: _chck_Descontable,
        tinFlCompensacion: _chckComp,
        tinPrioridadHE: _Prioridad,
        intIdTipBoni: _intboni,
        //intHoraIni: _tiempo_in,
        //intHoraFin: _tiempo_fil,
        //intTolerancia: _tiemptol,
        //intTiempoMin: _tiempmin,
        timeHoraIni: _tiempo_in,
        timeHoraFin: _tiempo_fil,
        timeTolerancia: _tiempo_min,
        timeTiempoMin: _tiempo_tol,
        bitSustentacion: _chck_Sustentación,
        intUsoMaximo: _txtMaxUso,
        strConceptoCampo1: _campVar1,
        strConceptoCampo2: _campVar2,
        strConceptoCampo3: _campVar3,
        strConceptoCampo4: _campVar4,
        strConceptoCampo5: _campVar5,
        bitFlActivo: _chckActivo,
        bitflutilidades: _chckCalidadUti,
        bitFlGrati: _chckCalculoGrat,
        bitFlDescontable: _chck_Descontable,
        bitJornadaEspecif: _jor,

      }


      class PrioridadesConcepto {
          constructor(intIdConcepto, tinPrioridadHE) {
              this.intIdConcepto = intIdConcepto
              this.tinPrioridadHE = tinPrioridadHE
          }
      }

      class JornadasBonificacion {
          constructor(intIdJorBonDet, intIdConcepto, intIdJornada, intIdUniOrg, dttFecAsig) {
              this.intIdJorBonDet = intIdJorBonDet
              this.intIdConcepto = intIdConcepto
              this.intIdJornada = intIdJornada
              this.intIdUniOrg = intIdUniOrg
              this.dttFecAsig = dttFecAsig


          }
      }

      //var detalleVar = new Array();
      //$('div[id="abc"] input').each((index, item) => {
      //    //var input = $(item).find('input');
      //    var tr_cogido = $('.HEP' + (index +1)+ '').val();
      //    var td_id = $('.HEP' + (index + 1) + '').prop('id');

      //    detalleVar.push(new PrioridadesConcepto(tr_cogido, td_id));

      //});
      //console.log(detalleVar);
      var detalleVar = new Array();
      $('#tb_HorasExtras tr').each((index, item) => {
          var tr_cogido = $(item).find('td').first().html();
          var td_id =  $(item).find('select option:selected').val();
          //var input = $(item).find('input');
        //   $('.HEP' + (index + 1) + '').val();
        // $('.HEP' + (index + 1) + '').prop('id');

          detalleVar.push(new PrioridadesConcepto(tr_cogido, td_id));

      });
      console.log(detalleVar);

      var detalleBoni = new Array();
      $('#ListaHorario option:selected').each((index, item) => {
          //var input = $(item).find('input');
          console.log(item);
          var tr_cogido = $(item).val();
          detalleBoni.push(new JornadasBonificacion(0, 0, tr_cogido, 0, null));

      });
      console.log(detalleBoni);




    $.post(
        '/Asistencia/ActualizarVariable',
        { ObjConcepto: Variable, listaConcepto: detalleVar, listaDetaBoni: detalleBoni},
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    new PNotify({
                        title: 'Actualización de Variable',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                    TablaVariable();
                    $('.form-hide-variable').hide();
                } else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Variable';
                        var campo = 'txt_cod_Var';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'info') {
                            var nomMantemiento = 'Variable';
                            var campo = 'txt_cod_Var';
                            var msj = response.message;
                            var response = response.type;
                            var deta = 'notifry_error';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;

                        } else {

                            if (response.type === 'error') {

                                var nomMantemiento = 'Variable';
                                var campo = 'txt_desc_Var';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errordes';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;
                            } else {
                                if (response.type === 'alert') {

                                    var nomMantemiento = 'Variable';
                                    var campo = 'txt_codPla_Var';
                                    var msj = response.message;
                                    var response = 'info';
                                    var deta = 'notifry_errorpla';
                                    INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                    return;
                                } else if (response.type === 'externo') {

                                    var nomMantemiento = 'Variable';
                                    var campo = 'txt_codExte_Var';
                                    var msj = response.message;
                                    var response = 'info';
                                    var deta = 'notifry_errorext';
                                    INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                } else {

                                }
                            }

                        }
                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

});

    $('#btn-cancel-variable').on('click', function () {
    $('.form-hide-variable').hide();
});

    function TablaExtra() {

    var variable = $('#cboVariable option:selected').val();
    $.post(
        '/Asistencia/ListarHorasExtrasxPrio',
        { strEntidad: 'TGCONCEPTO', intIdFiltroGrupo: variable, strGrupo: '', strSubGrupo: ''},

        (response) => {
            $('#tb_HorasExtras').empty();
            $('#HE').empty();
           Prioridad = 1;
            response.forEach(element => {

                $('#tb_HorasExtras').append('<tr><td  style="display:none" class="id">' + element.intIdConcepto + '</td><td class="strcoconcepto">' + element.strCoConcepto + '</td><td class="strDesConcepto">' + element.strDesConcepto + '</td><td class="tinPrioridadHE">' + element.tinPrioridadHE + '</td><td><select class= "form-control ComboPrioridad" id ="Prioridad' + Prioridad + '" > ' +

                    '</select> </td></tr>');

                $('#HE').append('<div id="abc" ><input type="hidden" class="HEP' + Prioridad +'" id="' + Prioridad +'" value="' + element.intIdConcepto+'"/></div>')


                Prioridad = Prioridad + 1;

            });
            var count_hours = response.length;

            for (var y = 1; y <= count_hours ; y++) {

                for (var i = 0; i <= count_hours ; i++) {

                    $('#Prioridad'+y+'').append('<option value="' + i + '" >' + i + '</option>');

                }
                //priority(count_hours, y);
                var seleccionados = new Array();
                var iddd = new Array();


                if ($('#Prioridad' + y + '  option:selected').val() !== 0) {


                } else if ($('#Prioridad' + x + '  option:selected').val() == 0) {


                iddd.push(x);
                    seleccionados.push(selecets);

                }
            }

            $('#Reset').on('click', function () {

                for (var i = 0; i <= Prioridad; i++) {

                    $('#Prioridad' + i + '').val(0);

                }

            });
      });
}

    function EdiatarPrioridades() {
    var variable = $('#cboVariable option:selected').val();
    $.post(
        '/Asistencia/ListarHorasExtrasxPrio',
        { strEntidad: 'TGCONCEPTO', intIdFiltroGrupo: variable, strGrupo: '', strSubGrupo: ''},
        (response) => {


             Prioridad = 1;
            response.forEach(element => {

                if ($('#' + Prioridad + '').val() == element.intIdConcepto ) {
                    $('#Prioridad' + Prioridad + '').val(element.tinPrioridadHE);

                } else if ($('#' + Prioridad + '').val() !== element.intIdConcepto)   {

                    $('#Prioridad' + Prioridad + '').val(0);

                }

                $('#Prioridad' + Prioridad + '').on('change', function () {


                    var o = Prioridad - 1;
                    for (var y = 1; y <= o; y++) {

                        for (var i = 2; i <= o; i++) {

                            if (i !== y) {


                                var combo1 = $('#Prioridad' + y + '').val();
                                var combo2 = $('#Prioridad' + i + '').val();



                                 if (combo1 == 0 || combo2 == 0) {

                                }

                                 else if (combo1 == combo2 ) {


                                    new PNotify({
                                        title: 'Horas Extras',
                                        text: 'No pueden poner la misma prioridad ' + combo1 + '',
                                        type: 'info',
                                        delay: 3000,
                                        styling: 'bootstrap3'
                                     });
                                     $('#Prioridad' + y + '').val(0);

                                    return;
                                }
                                else if (combo1 !== combo2) {


                                }


                            } else if (i == y) {

                            }

                        }
                    }

                });


                Prioridad = Prioridad + 1;

            });




        });

}

    function CamposAdicionalesConcepto() {

    $.post(
        '/Asistencia/CamposAdicionales',
        { strEntidad : 'TGCONCEPTO'},
        (response) => {

            console.log(response);
            $('#containerCampose').empty();
            response.forEach(element => {

                $('#containerCampose').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


            });
        });
}


    /**--------------------------------------------------------- */

    /**14. Empleado */
    /**-------------------------------------------------------- */

    function getDateRangePickerEmpleado() {
    const idRange = ".range-datepicker";
    const fechaInicio = $(idRange).data('daterangepicker').startDate.format('DD/MM/YYYY');
    const fechaFin = $(idRange).data('daterangepicker').endDate.format('DD/MM/YYYY');
    return { fInicio: fechaInicio, fFin: fechaFin }
}

    $('#filActiEmpleado').on('change', function () {
    const date = getDateRangePickerEmpleado();
    traerDatosEmpleados(date.fInicio, date.fFin)
});

    $('#filtroEmpleado').keyup(function () {

    const date = getDateRangePickerEmpleado();
    traerDatosEmpleados(date.fInicio, date.fFin)

});

    $('.range-datepicker').on('apply.daterangepicker', function (ev, picker) {

    const filtrojer_ini2 = picker.startDate.format('DD/MM/YYYY');
    const filtrojer_fin2 = picker.endDate.format('DD/MM/YYYY');
    traerDatosFeriados(filtrojer_ini2, filtrojer_fin2)
});

    function CombosEmpleado() {


    $.post(
        '/Personal/ListarComboJerar',
        { strEntidad: 'TGUNIDORG', intIdFiltroGrupo: 1, strGrupo: 'JERAR', strSubGrupo: 'XD' },
        (response) => {
            $('#cboUndOrg').empty();
            $('#cboUndOrg').attr('disabled', false);

            response.forEach(element => {
                $('#cboUndOrg').append('<option value="' + element.strDeTipo + '">' + element.strextra1 + '<h4>' + element.strextra2 + '</h4></option>');

                $('#cboUndOrg1').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');
                $('#Pruebase').on('change', function () {

                    var FiltroNom = $('#Pruebase').val();



                    $("#cboUndOrg1 option").filter(function () {

                        return this.text == FiltroNom;

                    }).attr('selected', true);

                });
            });
        });



    $.post(
        '/Personal/ListarCombos',
        { strEntidad: 'TGTIPO_VIA', intIdFiltroGrupo: 0, strGrupo: '', strSubGrupo: '' },
        (response) => {
            $('#TipVia').empty();
            $('#TipVia').attr('disabled', false);
            $('#TipVia').append('<option value="0">Via</option>');

            response.forEach(element => {
                $('#TipVia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');


            });
        });


    $.post(
        '/Personal/ListarCombos',
        { strEntidad: 'TSTIPDOC', intIdFiltroGrupo: 0, strGrupo: 'PER', strSubGrupo: '' },
        (response) => {
            $('#cboUndOrg').empty();
            $('#cboUndOrg').attr('disabled', false);

            response.forEach(element => {
                $('#TipoDoc').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');


            });
        });


    $.post(
        '/Personal/ListarCombos',
        { strEntidad: 'TGPAIS', intIdFiltroGrupo: 0, strGrupo: 'EXISTE', strSubGrupo: '' },
        (response) => {
            $('#CboPais').empty();
            $('#CboPais').attr('disabled', false);
            $('#CboPais').append('<option value="0">Seleccione</option>');

            response.forEach(element => {
                $('#CboPais').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');


            });
        });

    $('#CboPais').on('change', function () {

        var Valxpais = $('#CboPais').val();

        $.post(
            '/Personal/ListarCombos',
            { strEntidad: 'TGUBIGEO', intIdFiltroGrupo: Valxpais, strGrupo: 'DEPART', strSubGrupo: '' },
            (response) => {
                $('#CboRegion').empty();
                $('#CboRegion').attr('disabled', false);
                $('#CboRegion').append('<option value="0">Seleccione</option>');

                response.forEach(element => {
                    $('#CboRegion').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');


                });
            });
    });

    $('#CboRegion').on('change', function () {

        var Valxpais = $('#CboRegion').val();

        $.post(
            '/Personal/ListarCombos',
            { strEntidad: 'TGUBIGEO', intIdFiltroGrupo: Valxpais, strGrupo: 'REG', strSubGrupo: '' },
            (response) => {
                $('#CboProvincia').empty();
                $('#CboProvincia').attr('disabled', false);
                $('#CboProvincia').append('<option value="0">Seleccione</option>');

                response.forEach(element => {
                    $('#CboProvincia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');


                });
            });
    });

    $('#CboProvincia').on('change', function () {

        var Valxpais = $('#CboProvincia').val();

        $.post(
            '/Personal/ListarCombos',
            { strEntidad: 'TGUBIGEO', intIdFiltroGrupo: Valxpais, strGrupo: 'DIST', strSubGrupo: '' },
            (response) => {
                $('#CboDistrito').empty();
                $('#CboDistrito').attr('disabled', false);
                $('#CboDistrito').append('<option value="0">Seleccione</option>');

                response.forEach(element => {
                    $('#CboDistrito').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');


                });
            });
    });


}

    var _vartableEmpleado;

    function traerDatosEmpleados(filtrojer_ini_var = null, filtrojer_fin_var = null) {

        let filtrosActivo = ($('#filActiEmpleado').val() != "") ? $('#filActiEmpleado').val() : 2;
        let strfiltro = $('#filtroEmpleado').val();
    let filtrojer_ini = filtrojer_ini_var ? filtrojer_ini_var : null;
    let filtrojer_fin = filtrojer_fin_var ? filtrojer_fin_var : null;

    $.post(
        '/Personal/GetTablaPersonal',
        {
            IntActivoFilter: filtrosActivo,
            strfilter: strfiltro,
            dttfiltrofch1: filtrojer_ini,
            dttfiltrofch2: filtrojer_fin
        },
        (response) => {
            $('#TablaPersonal tbody').empty();
            response.forEach(element => {

                if (typeof _vartableEmpleado !== 'undefined') {
                    _vartableEmpleado.destroy();
                }

                //Diseño de la tabla
                _vartableEmpleado = $('#TablaPersonal').DataTable({
                    data: response,
                    columns: [
                        { data: 'strCoPersonal' },
                        { data: 'strNumDoc' },
                        { data: 'strNombres' },
                        { data: 'dttFecAdmin' },
                        { data: 'bitEspecifica_DESC' },
                        {
                            sortable: false,
                            "render": (data, type, item, meta) => {
                                let feriadoId = item.IntIdFeriado;
                                let strDeFeriado = item.strDeFeriado;
                                return `<button class="btn btn-success btn-xs btn-edit" dataid="${feriadoId}" ><i class="fa fa-pencil"></i> Editar </button>
                                           <button class="btn btn-primary btn-xs btn-delete" dataid="${feriadoId}" des_data="${strDeFeriado}" data="${item}" ><i class="fa fa-trash-o"></i> Eliminar </button>`;
                            }
                        },
                        { data: 'intIdPersonal' }

                    ],
                    lengthMenu: [10, 25, 50],
                    responsive: true,
                    language: _datatableLanguaje,

                    columnDefs: [//ocultar y definir columnas
                        {
                            targets: [6],//IntIdJerOrg
                            visible: false,
                            searchable: false
                        }

                    ],
                    dom: 'lBfrtip',

                });



            });
        }
    );
}

    $('#btn-new-empleado').on('click', function () {
        $('.form-hide-empleado').show();

        $.post(
            '/Personal/NuevoEmpleado',
            {},
            (response) => {
                if (response !== '') {
                    $('.form-hide-empleado .x_content').empty();
                    $('.form-hide-empleado .x_content').html(response);
                    $('.form-hide-empleado').show();
                    switcheryLoad();
                    init_checkBox_styles();
                    cargarDaterangePicker();
                    init_daterangepicker();
                    CombosEmpleado();



                    $('#DNI_PER').on('change', function () {




                    });
                }
            });


    });

    function editarEmpleado() {
        $('.form-hide-empleado').show();

        $.post(
            '/Personal/ObtenerRegistroEmpleado',
            { intIdPersonal: data.intIdJornada },
            (response) => {

                console.log(response);
                response.forEach(element => {



                });
            });
    }

    function eliminarEmpleado() {

        swal({
            title: "Eliminar Empleado",
            text: "Esta seguro de eliminar el registro?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        }).then(function (isConfirm) {
            if (isConfirm) {
                swal("Eliminado!", "El resgistro fue eliminado correctamente", "success");
            } else {
                swal("Cancelled", "Your imaginary file is safe :)", "error");
            }
        });

    }

    $('#btn-save-change-empleado').on('click', function () {

        var typeArray = ['success', 'info', 'error'];

        var typeItem = typeArray[Math.floor(Math.random() * typeArray.length)];

        new PNotify({
            title: 'Registro Empleado',
            text: 'El registro se creó correctamente',
            type: typeItem,
            delay: 1000,
            styling: 'bootstrap3'
        });
    });

    $('#btn-cancel-empleado').on('click', function () {
        $('.form-hide-empleado').hide();
    });

    /**-------------------------------------------------------- */
    /**15. Cambio Documento de Identidad */
    /**------------------------------------------------------- */
    $('#btn-new-cambioDI').on('click', function () {
        $('.form-hide-cambioDI').show();
        $.post(
            '/Personal/NuevoCambioDI',
            {},
            (response) => {
                if (response !== '') {
                    $('.form-hide-cambioDI .x_content').empty();
                    $('.form-hide-cambioDI .x_content').html(response);
                    $('.form-hide-cambioDI').show();
                }
            });
    });

    function editarCambioDI() {
        $('.form-hide-cambioDI').show();
    }

    function eliminarCambioDI() {

        swal({
            title: "Eliminar Documento de Identidad",
            text: "Esta seguro de eliminar el registro?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        }).then(function (isConfirm) {
            if (isConfirm) {
                swal("Eliminado!", "El resgistro fue eliminado correctamente", "success");
            } else {
                swal("Cancelado", "La operacion fue cancelada :)", "error");
            }
        });

    }

    $('#btn-save-change-cambioDI').on('click', function () {

        var typeArray = ['success', 'info', 'error'];

        var typeItem = typeArray[Math.floor(Math.random() * typeArray.length)];

        new PNotify({
            title: 'Registro Documento de Identidad',
            text: 'El registro se creó correctamente',
            type: typeItem,
            delay: 1000,
            styling: 'bootstrap3'
        });
    });

    $('#btn-cancel-cambioDI').on('click', function () {
        $('.form-hide-cambioDI').hide();
    });


    /**------------------------------------------------------- */
    /**16. Perfil */
    /**------------------------------------------------------ */

    function graficoAsistencia() {
        if ($('#mainb').length) {

            var echartBar = echarts.init(document.getElementById('mainb'), theme);

            echartBar.setOption({
                title: {
                    text: 'Gráfico de Asistencia Anual',
                    subtext: 'Rango de 12 meses'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['Asistencias', 'Inasistencias']
                },
                toolbox: {
                    show: false
                },
                calculable: false,
                xAxis: [{
                    type: 'category',
                    data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic']
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: 'Asistencias',
                    type: 'bar',
                    data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                    markPoint: {
                        data: [{
                            type: 'max',
                            name: '???'
                        }, {
                            type: 'min',
                            name: '???'
                        }]
                    },
                    markLine: {
                        data: [{
                            type: 'average',
                            name: '???'
                        }]
                    }
                }, {
                    name: 'Inasistencias',
                    type: 'bar',
                    data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                    markPoint: {
                        data: [{
                            name: 'Asistencias',
                            value: 182.2,
                            xAxis: 7,
                            yAxis: 183,
                        }, {
                            name: 'Inasistencias',
                            value: 2.3,
                            xAxis: 11,
                            yAxis: 3
                        }]
                    },
                    markLine: {
                        data: [{
                            type: 'average',
                            name: '???'
                        }]
                    }
                }]
            });

        }
    }
    /**------------------------------------------------------ */
    /**17. Periodo de Pago */
    /**------------------------------------------------------ */
    $('#btn-new-periodo').on('click', function () {
        $('.form-hide-periodo').show();
    });
    function editarPeriodo() {
        $('.form-hide-periodo').show();
    }
    function eliminarPeriodo() {

        swal({
            title: "Eliminar Periodo",
            text: "Esta seguro de eliminar el registro?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        }).then(function (isConfirm) {
            if (isConfirm) {
                swal("Eliminado!", "El resgistro fue eliminado correctamente", "success");
            } else {
                swal("Cancelado", "La operacion fue cancelada :)", "error");
            }
        });

    }
    $('#btn-save-change-periodo').on('click', function () {

        var typeArray = ['success', 'info', 'error'];

        var typeItem = typeArray[Math.floor(Math.random() * typeArray.length)];

        new PNotify({
            title: 'Registro Periodo',
            text: 'El registro se creó correctamente',
            type: typeItem,
            delay: 1000,
            styling: 'bootstrap3'
        });
    });
    $('#btn-cancel-periodo').on('click', function () {
        $('.form-hide-periodo').hide();
    });

    /**------------------------------------------------------ */
    /**18. Grupo de Liquidación */
    /**------------------------------------------------------ */
    $('#btn-new-grupoliq').on('click', function () {
        $('.form-hide-grupoliq').show();
        $.post(
            '/Organizacion/NuevoGrupo',
            {},
            (response) => {
                if (response !== '') {
                    $('.form-hide-grupoliq .x_content').empty();
                    $('.form-hide-grupoliq .x_content').html(response);
                    $('.form-hide-grupoliq').show();
                    BuscarUnidad();
                    switcheryLoad();//checked verde

                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });
    });
    function editarGrupoLiq() {
        $('.form-hide-grupoliq').show();
    }
    function eliminarGrupoLiq() {

        swal({
            title: "Eliminar grupo de liquidación",
            text: "Esta seguro de eliminar el registro?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        }).then(function (isConfirm) {
            if (isConfirm) {
                swal("Eliminado!", "El resgistro fue eliminado correctamente", "success");
            } else {
                swal("Cancelado", "La operacion fue cancelada :)", "error");
            }
        });

    }
    $('#btn-save-change-grupoliq').on('click', function () {

        var typeArray = ['success', 'info', 'error'];

        var typeItem = typeArray[Math.floor(Math.random() * typeArray.length)];

        new PNotify({
            title: 'Registro grupoliq',
            text: 'El registro se creó correctamente',
            type: typeItem,
            delay: 1000,
            styling: 'bootstrap3'
        });
    });
    $('#btn-cancel-grupoliq').on('click', function () {
        $('.form-hide-grupoliq').hide();
    });
    /**------------------------------------------------------ */
    /**19. Pagina Principal */
    /**------------------------------------------------------ */
    function _initCharts_PaginaPricipal() {

        //Pie Chart
        var leyend = ['Subsidio\n por Enfermedad', 'Otros\n Subsidios', 'Licencias\n S/Goce', 'Licencias\n C/Goce', 'Faltas\n Injustificadas', 'Descanso\n Médico'];
        if ($('#echart_pie2').length) {

            var echartPieCollapse = echarts.init(document.getElementById('echart_pie2'), theme);

            echartPieCollapse.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
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
                    name: 'Area Mode',
                    type: 'pie',
                    radius: [25, 90],
                    center: ['50%', 170],
                    roseType: 'area',
                    x: '50%',
                    max: 40,
                    sort: 'ascending',
                    data: [{
                        value: 10,
                        name: leyend[0]
                    }, {
                        value: 5,
                        name: leyend[1]
                    }, {
                        value: 15,
                        name: leyend[2]
                    }, {
                        value: 25,
                        name: leyend[3]
                    }, {
                        value: 20,
                        name: leyend[4]
                    }, {
                        value: 35,
                        name: leyend[5]
                    }]
                }]
            });

        }

        //echart Bar Horizontal

        if ($('#echart_bar_horizontal').length) {

            var echartBar = echarts.init(document.getElementById('echart_bar_horizontal'), theme);

            echartBar.setOption({
                title: {
                    text: 'Bar Graph',
                    subtext: 'Graph subtitle'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    x: 100,
                    data: ['Hrs. Tardanza', 'Horas Fuera']
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {
                            show: true,
                            title: "Save Image"
                        }
                    }
                },
                calculable: true,
                xAxis: [{
                    type: 'value',
                    boundaryGap: [0, 0.01]
                }],
                yAxis: [{
                    type: 'category',
                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                }],
                series: [{
                    name: 'Hrs. Tardanza',
                    type: 'bar',
                    data: [18203, 23489, 29034, 104970, 131744, 630230]
                }, {
                    name: 'Horas Fuera',
                    type: 'bar',
                    data: [19325, 23438, 31000, 121594, 134141, 681807]
                }]
            });

        }

        if ($('#graph_bar_group').length) {

            Morris.Bar({
                element: 'graph_bar_group',
                data: [
                    { "period": "2016-10-01", "licensed": 807, "sorned": 660 },
                    { "period": "2016-09-30", "licensed": 1251, "sorned": 729 },
                    { "period": "2016-09-29", "licensed": 1769, "sorned": 1018 },
                    { "period": "2016-09-20", "licensed": 2246, "sorned": 1461 },
                    { "period": "2016-09-19", "licensed": 2657, "sorned": 1967 },
                    { "period": "2016-09-18", "licensed": 3148, "sorned": 2627 },
                    { "period": "2016-09-17", "licensed": 3471, "sorned": 3740 },
                    { "period": "2016-09-16", "licensed": 2871, "sorned": 2216 },
                    { "period": "2016-09-15", "licensed": 2401, "sorned": 1656 },
                    { "period": "2016-09-10", "licensed": 2115, "sorned": 1022 }
                ],
                xkey: 'period',
                barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
                ykeys: ['licensed', 'sorned'],
                labels: ['Licensed', 'SORN'],
                hideHover: 'auto',
                xLabelAngle: 60,
                resize: true
            });

        }

    };
    /**------------------------------------------------------ */
    /**20. Papeleta de Salida */
    /**------------------------------------------------------- */
    $('#btn-new-PapeletaSalida').on('click', function () {
        $('.form-hide-PapeletaSalida').show();
        $("#DropDiv").dropzone({ url: "/file/post" });
        $.post(
            '/Personal/NuevaPapeletaSal',
            {},
            (response) => {
                if (response !== '') {
                    $('.form-hide-PapeletaSalida .x_content').empty();
                    $('.form-hide-PapeletaSalida .x_content').html(response);
                    $('.form-hide-PapeletaSalida').show();
                }
            });

    });
    //$('.collapse-link').on('click', function () {
    //    var $BOX_PANEL = $(this).closest('.x_panel'),
    //        $ICON = $(this).find('i'),
    //        $BOX_CONTENT = $BOX_PANEL.find('.x_content');
    //    if ($BOX_PANEL.attr('style')) {
    //        $BOX_CONTENT.slideToggle(200, function () {
    //            $BOX_PANEL.removeAttr('style');
    //        });
    //    } else {
    //        $BOX_CONTENT.slideToggle(200);
    //        $BOX_PANEL.css('height', 'auto');
    //    }
    //    $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    //});
    $(document).ready(function () {
        $('.collapse-link').on('click', function () {
            var $BOX_PANEL = $(this).closest('.x_panel'),
                $ICON = $(this).find('i'),
                $BOX_CONTENT = $BOX_PANEL.find('#oculto');
            // fix for some div with hardcoded fix class
            if ($BOX_PANEL.attr('style')) {
                $BOX_CONTENT.slideToggle(200, function () {
                    $BOX_PANEL.removeAttr('style');
                });
            } else {
                $BOX_CONTENT.slideToggle(200);
                $BOX_PANEL.css('height', 'auto');
            }
            $ICON.toggleClass('fa-chevron-up fa-chevron-down');
        });
    });

    //$(document).ready(function () {
    //    $('.collapse-link').on('click', function () {
    //        var $BOX_PANEL = $(this).closest('.x_panel'),
    //            $ICON = $(this).find('i'),
    //            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

    //        // fix for some div with hardcoded fix class
    //        if ($BOX_PANEL.attr('style')) {
    //            $BOX_CONTENT.slideToggle(200, function () {
    //                $BOX_PANEL.removeAttr('style');
    //            });
    //        } else {
    //            $BOX_CONTENT.slideToggle(200);
    //            $BOX_PANEL.css('height', 'auto');
    //        }

    //        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    //    });

    //    $('.close-link').click(function () {
    //        var $BOX_PANEL = $(this).closest('.x_panel');

    //        $BOX_PANEL.remove();
    //    });
    //});

    function init_ToolbarBootstrapBindings() {
        var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
            'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
            'Times New Roman', 'Verdana'
        ],
            fontTarget = $('[title=Font]').siblings('.dropdown-menu');
        $.each(fonts, function (idx, fontName) {
            fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
        });
        $('a[title]').tooltip({
            container: 'body'
        });
        $('.dropdown-menu input').click(function () {
            return false;
        })
            .change(function () {
                $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
            })
            .keydown('esc', function () {
                this.value = '';
                $(this).change();
            });

        $('[data-role=magic-overlay]').each(function () {
            var overlay = $(this),
                target = $(overlay.data('target'));
            overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
        });

        if ("onwebkitspeechchange" in document.createElement("input")) {
            var editorOffset = $('#editor').offset();

            $('.voiceBtn').css('position', 'absolute').offset({
                top: editorOffset.top,
                left: editorOffset.left + $('#editor').innerWidth() - 35
            });
        } else {
            $('.voiceBtn').hide();
        }
    }
    // Dropzone class:
    // If you use jQuery, you can use the jQuery plugin Dropzone ships with:
    //$("div#DropDiv").dropzone({ url: "/file/post" });

    //$MENU_TOGGLE.on('click', function () {
    //    console.log('clicked - menu toggle');

    //    if ($BODY.hasClass('nav-md')) {
    //        $SIDEBAR_MENU.find('li.active ul').hide();
    //        $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
    //    } else {
    //        $SIDEBAR_MENU.find('li.active-sm ul').show();
    //        $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
    //    }

    //    $BODY.toggleClass('nav-md nav-sm');

    //    setContentHeight();

    //    $('.dataTable').each(function () { $(this).dataTable().fnDraw(); });
    //});

    //$('.dropdown-menu input').click(function () {
    //    return false;
    //})
    //    .change(function () {
    //        $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
    //    })
    //    .keydown('esc', function () {
    //        this.value = '';
    //        $(this).change();
    //    });

    function editarPapeletaSalida() {
        $('.form-hide-PapeletaSalida').show();
    }

    function eliminarPapeletaSalida() {

        swal({
            title: "Eliminar Papeleta de Salida",
            text: "Esta seguro de eliminar el registro?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        }).then(function (isConfirm) {
            if (isConfirm) {
                swal("Eliminado!", "El resgistro fue eliminado correctamente", "success");
            } else {
                swal("Cancelado", "La operacion fue cancelada : )", "error");
            }
        });

    }

    $('#btn-save-change-PapeletaSalida').on('click', function () {

        var typeArray = ['success', 'info', 'error'];

        var typeItem = typeArray[Math.floor(Math.random() * typeArray.length)];

        new PNotify({
            title: 'Registro Papeleta de Salida',
            text: 'El registro se creó correctamente',
            type: typeItem,
            delay: 1000,
            styling: 'bootstrap3'
        });
    });

    $('#btn-cancel-PapeletaSalida').on('click', function () {
        $('.form-hide-PapeletaSalida').hide();
    });

    /**------------------------------------------------------ */
    /**21. Campos Adicionales */
    /**------------------------------------------------------- */
    $('#btn-new-CamposAdicionales').on('click', function () {
        $('.form-hide-CamposAdicionales').show();

    });
    function editarCamposAdicionales() {
        $('.form-hide-CamposAdicionales').show();
    }
    function eliminarCamposAdicionales() {

        swal({
            title: "Eliminar Campos Adicionales",
            text: "Esta seguro de eliminar el registro?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        }).then(function (isConfirm) {
            if (isConfirm) {
                swal("Eliminado!", "El resgistro fue eliminado correctamente", "success");
            } else {
                swal("Cancelled", "Your imaginary file is safe :)", "error");
            }
        });

    }
    $('#btn-save-change-CamposAdicionales').on('click', function () {

        var typeArray = ['success', 'info', 'error'];

        var typeItem = typeArray[Math.floor(Math.random() * typeArray.length)];

        new PNotify({
            title: 'Registro Campos Adicionales',
            text: 'El registro se creó correctamente',
            type: typeItem,
            delay: 1000,
            styling: 'bootstrap3'
        });
    });
    $('#btn-cancel-CamposAdicionales').on('click', function () {
        $('.form-hide-CamposAdicionales').hide();
});

    /**------------------------------------------------------ */
    /**22. Jornada Diaria */
    /**------------------------------------------------------- */

     $('#filActi1').on('change', function () {


    TablaJornada();


     });
     $('#filtojer1').on('change', function () {


    TablaJornada();


});
     $('#filtro1').keyup(function () {


    TablaJornada();


});
     var _varTablaJornada;
     function TablaJornada() {

    var filtroActivo = $('#filActi1').val();
    var strfiltro = $('#filtro1').val();
    var filtrojer = $('#filtojer1').val();

    $.post(
        '/Asistencia/GetTablaFiltradaJornadaDiaria',
        { IntActivoFilter: filtroActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
        (response) => {
            console.log(response);

            if (typeof _varTablaJornada !== 'undefined') {
                _varTablaJornada.destroy();
            }
            _varTablaJornada = $('#tablaJornada').DataTable({
                data: response,
                columns: [

                    { data: 'strCodJornada' },
                    { data: 'strDscJornada' },
                    { data: 'EXtra1' },
                    { data: 'EXtra2' },
                    { data: 'timeHoraIni' },
                    { data: 'timeHoraFin' },
                    { data: 'EXtra3' },
                    { data: 'EXtra4' },
                    { data: null },
                    { data: 'intIdJornada' },

                ],
                lengthMenu: [10, 25, 50],
                order:  [1, 'asc'],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [//ocultar y definir columnas
                    {
                        targets: [8],
                        data: null,
                        defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                            '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
                    },
                    {

                       targets: [9],
                       visible: false,
                       searchable: false
                    }
                ],
                dom: 'lBfrtip',
            });


            $('#tablaJornada  tbody').on('click', 'tr button.btn-edit', function () {
                var data = _varTablaJornada.row($(this).parents('tr')).data();
                if (data == null) {
                    data = null;
                    var data = _varTablaJornada.row($(this).parents('li')).data();
                   cardarDatosJornada(data);
                } else {
                    var data = _varTablaJornada.row($(this).parents('tr')).data();
                    cardarDatosJornada(data);
                }

            });

            $('#tablaJornada  tbody').on('click', 'tr button.btn-delete', function () {

                var data = _varTablaJornada.row($(this).parents('tr')).data();

                if (data == null) {
                    data = null;

                    var data = _varTablaJornada.row($(this).parents('li')).data();
                    intentEliminarJornada(data['intIdJornada'], data['strDscJornada']);

                } else {

                    var data = _varTablaJornada.row($(this).parents('tr')).data();
                    intentEliminarJornada(data['intIdJornada'], data['strDscJornada']);

                }


            });

        });

}
     function intentEliminarJornada(idJor, nomJor) {
    swal({
        title: "Eliminar Variable",
        text: "¿Está seguro de eliminar la variable   ''<strong>" + nomJor + "</strong>''?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaJornada(idJor);
        } else {
            swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}
     function yesEliminaJornada(idJor) {
    $.post(
        '/Asistencia/EliminarJornada',
        { intIdJornada: idJor },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    TablaJornada();

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}
     function CamposAdicionalesJornada() {

    $.post(
        '/Asistencia/CamposAdicionales',
        { strEntidad: 'TGJORNADA' },
        (response) => {

            console.log(response);
            $('#containerCampose').empty();
            response.forEach(element => {

                $('#containerCampose').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


            });
        });
}
     class Intervalos {
         constructor(interva, intTipoInterval, NomTipoInter, timeHoraIni, timeHoraFin, intTurno, timeTolerancia, timeDuracion, timeTiempoMaximo, bitFlHT, bitDiaSig, strorden, intnum, clave, intIdInterval) {

        this.interva = interva
        this.intTipoInterval = intTipoInterval
        this.NomTipoInter = NomTipoInter
        this.timeHoraIni = timeHoraIni
        this.timeHoraFin = timeHoraFin
        this.intTurno = intTurno
        this.timeTolerancia = timeTolerancia
        this.timeDuracion = timeDuracion
        this.timeTiempoMaximo = timeTiempoMaximo
        this.bitFlHT = bitFlHT
        this.bitDiaSig = bitDiaSig
        this.strorden = strorden
        this.intnum = intnum
             this.clave = clave
             this.intIdInterval = intIdInterval
    }
}
     function cardarDatosJornada(data) {

        $('.form-hide-JornadaDiaria').show();
        $.post(
            '/Asistencia/EditarJornadaDiaria',
            {},
            (response) => {
                if (response !== '') {
                    $('.form-hide-JornadaDiaria .x_content').empty();
                    $('.form-hide-JornadaDiaria .x_content').html(response);
                    $('.form-hide-JornadaDiaria').show();
                    switcheryLoad();
                    init_checkBox_styles();
                    $('#btn-update-JornadaDiaria').show();
                    $('#btn-save-change-JornadaDiaria').hide();
                    init_sidebar();
                   // BuscarUnidades();
                    CamposAdicionalesJornada();
                    CombosJornadaDiaria();
                    var detalleinterval = new Array();
                    var detalleHoras = new Array();
                    $.post(
                        '/Asistencia/ObtenerJornadaPorsuPK',
                        { intIdJornada: data.intIdJornada },
                        (response) => {

                            console.log(response);
                            response.forEach(element => {



                                $("#cboJerar option").filter(function () {
                                    return this.text == element.EXtra3;
                                }).attr('selected', true);


                                var idER = $("#cboJerar").val();

                                $.post(
                                    '/Asistencia/LlenarTipoUM',
                                    { strEntidad: 'TGUNIDORG', intIdFiltroGrupo: idER, strGrupo: 'JERAR', strSubGrupo: '' },
                                    (response) => {
                                        $('#cboUndOrg').empty();
                                        $('#cboUndOrg').attr('disabled', false);

                                        response.forEach(element => {
                                            $('#cboUndOrg').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                                        });

                                        $("#cboUndOrg").val(element.IntIdUniOrg);
                                    });



                                $('#cboJerar').on('change', function () {

                                    var IntidJerar = $('#cboJerar option:selected').val();

                                    $.post(
                                        '/Asistencia/LlenarTipoUM',
                                        { strEntidad: 'TGUNIDORG', intIdFiltroGrupo: IntidJerar, strGrupo: 'JERAR', strSubGrupo: '' },
                                        (response) => {
                                            $('#cboUndOrg').empty();
                                            $('#cboUndOrg').attr('disabled', false);

                                            response.forEach(element => {
                                                $('#cboUndOrg').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                                            });
                                        });
                                });
                                //$('#cbounidsupe').empty();



                                $('#TipoJor').val(element.intTipoDia);
                                $('#cboRefriguerio').val(element.intControlRefri);
                                // $('#cboJerarquia').val(element.IntIdUniOrg);
                                $('#txt_cod_Jor').val(element.strCodJornada);
                                $('#txt_desc_Jor').val(element.strDscJornada);
                                $('#idjorn').val(data.intIdJornada);


                                if (element.bitFlActivo == false) {

                                    $('#idche').html('<input type="checkbox" id="chk-activo-JO" class=" js-switch"  /> Activo');
                                    // $('#chck_Activo_Var').iCheck('uncheck');
                                    switcheryLoad();
                                } else if (element.bitFlActivo == true) {

                                    $('#idche').html('<input type="checkbox" id="chk-activo-JO" class=" js-switch" checked /> Activo');
                                    // $('#chck_Activo_Var').iCheck('check');
                                    switcheryLoad();
                                }

                                if (element.bitDiaSig == true) {
                                    $('#chck_cambdia').iCheck('check');
                                }
                                else if (element.bitDiaSig == false) {
                                    $('#chck_cambdia').iCheck('uncheck');
                                }
                                if (element.bitPertenecDiaSig == true) {
                                    $('#chck_perteneceJor').iCheck('check');
                                }
                                else if (element.bitDiaSig == false) {
                                    $('#chck_perteneceJor').iCheck('uncheck');
                                }


                                $('#txtcolor').val(element.strColor);

                                init_ColorPicker();


                                $('#strJornadaCampo1').val(element.strJornadaCampo1);
                                $('#strJornadaCampo2').val(element.strJornadaCampo2);
                                $('#strJornadaCampo3').val(element.strJornadaCampo3);
                                $('#strJornadaCampo4').val(element.strJornadaCampo4);
                                $('#strJornadaCampo5').val(element.strJornadaCampo5);


                            });

                        });


                    $('#chck_cambdia').on('ifChanged', function () {

                        if ($('#chck_cambdia').is(':checked') == true) {

                            $('#Pertenece_Jor').show();
                            $('#chck_perteneceJor').attr('disabled', false);
                        }
                        if ($('#chck_cambdia').is(':checked') == false) {
                            $('#chck_perteneceJor').iCheck('uncheck');
                            $('#Pertenece_Jor').hide();
                            $('#chck_perteneceJor').attr('disabled', true);

                        }

                    });

                    if ($('#TipoInter').val() == 2) {

                        $('#cons_trab').hide();
                        $('#consi_max').hide();
                        $('#checks_pri_ult').show();
                        $('#chck_pri').iCheck('uncheck');
                        $('#chck_ult').iCheck('uncheck');
                        $('#consTrab').iCheck('uncheck');
                        $('#tiempo_cons_max').empty();

                    }

                    $('#TipoInter').on('change', function () {

                        if ($('#TipoInter').val() == 39) {

                            $('#cons_trab').hide();
                            $('#consi_max').hide();
                            $('#checks_pri_ult').show();
                            $('#chck_pri').iCheck('uncheck');
                            $('#chck_ult').iCheck('uncheck');
                            $('#consTrab').iCheck('uncheck');
                            $('#tiempo_cons_max').empty();

                        } else if ($('#TipoInter').val() == 40) {

                            $('#cons_trab').hide();
                            $('#consi_max').hide();
                            $('#checks_pri_ult').hide();
                            $('#chck_pri').iCheck('uncheck');
                            $('#chck_ult').iCheck('uncheck');
                            $('#consTrab').iCheck('uncheck');
                            $('#tiempo_cons_max').empty();

                        } else if ($('#TipoInter').val() == 41) {

                            $('#cons_trab').show();
                            $('#consi_max').hide();
                            $('#checks_pri_ult').hide();
                            $('#chck_pri').iCheck('uncheck');
                            $('#chck_ult').iCheck('uncheck');
                            $('#consTrab').iCheck('uncheck');
                            $('#tiempo_cons_max').empty();

                        } else if ($('#TipoInter').val() == 45) {

                            $('#cons_trab').hide();
                            $('#consi_max').show();
                            $('#checks_pri_ult').show();
                            $('#chck_pri').iCheck('uncheck');
                            $('#chck_ult').iCheck('uncheck');
                            $('#consTrab').iCheck('uncheck');
                            $('#tiempo_cons_max').empty();

                        } else if ($('#TipoInter').val() == 46) {

                            $('#consi_max').show();
                            $('#cons_trab').show();
                            $('#checks_pri_ult').hide();
                            $('#chck_pri').iCheck('uncheck');
                            $('#chck_ult').iCheck('uncheck');
                            $('#consTrab').iCheck('uncheck');
                            $('#tiempo_cons_max').empty();

                        }
                    });

                    $('#btn-limpiar-Intrevalos').on('click', function () {


                        $('#TipoInter').val(39);
                        $('#TipoTurn').val(42);
                        $('#tiempo_inic').val('00:00');
                        $('#tiempo_fin').val('00:00');
                        $('#tiempo_tole').val('00:00');
                        $('#tiempo_dura').val('00:00');
                        $('#tiempo_cons_max').val('00:00');
                        $('#cons_trab').hide();
                        $('#consi_max').hide();
                        $('#checks_pri_ult').hide();

                        if ($('#TipoInter').val() == 39) {

                            $('#cons_trab').hide();
                            $('#consi_max').hide();
                            $('#checks_pri_ult').show();
                            $('#chck_pri').iCheck('uncheck');
                            $('#chck_ult').iCheck('uncheck');
                            $('#consTrab').iCheck('uncheck');
                            $('#tiempo_cons_max').empty();

                        }
                    });

                    $('#chck_pri').on('ifChanged', function () {

                        if ($('#chck_pri').is(':checked') == true) {
                            $('#chck_ult').iCheck('uncheck');
                        } else if ($('#chck_pri').is(':checked') == false) {
                            $('#chck_pri').iCheck('uncheck');
                        }
                    });

                    $('#chck_ult').on('ifChanged', function () {

                        if ($('#chck_ult').is(':checked') == true) {
                            $('#chck_pri').iCheck('uncheck');
                        } else if ($('#chck_ult').is(':checked') == false) {
                            $('#chck_ult').iCheck('uncheck');
                        }
                    });


                    var d = new Date();
                    var n = d.getTime()

                    var uiui = 2;

                    $.post(
                        '/Asistencia/GetTablaFiltradaIntervalos',
                        { intfiltrojer: data.intIdJornada },

                        (response) => {

                            response.forEach(element => {

                                if (element.intNuOrden == 1) {
                                    var strorden = 'Primero';
                                    $('#end').val(5);
                                }
                                 if (element.intNuOrden == 999) {
                                     var strorden = 'Ultimo';
                                     $('#end2').val(5);
                                } if (element.intNuOrden !== 1 && element.intNuOrden !== 999 ) {
                                    var strorden = ' ';
                                }

                                class Horas {

                                    constructor(HoraInicial, MinIninicial, HoraFinal, MiniFinal, clave) {

                                        this.HoraInicial = HoraInicial
                                        this.MinIninicial = MinIninicial
                                        this.HoraFinal = HoraFinal
                                        this.MiniFinal = MiniFinal
                                        this.clave = n

                                    }

                                }

                                var _HoraIni = element.strectra7;
                                var _HoraFin = element.strectra8;

                                var HoraIni = parseInt(_HoraIni.substring(0, 2));
                                var MiniIni = parseInt(_HoraIni.substring(5, 3));
                                var HoraFin = parseInt(_HoraFin.substring(0, 2));
                                var MiniFin = parseInt(_HoraFin.substring(5, 3));


                                detalleHoras.push(new Horas(HoraIni, MiniIni, HoraFin, MiniFin, n+uiui));


                                detalleinterval.push(new Intervalos(element.strectra3,
                                    element.intTipoInterval, element.strectra1, element.strectra7, element.strectra8, element.intTurno,
                                    element.strectra5, element.strectra4, element.strectra6, element.bitFlHT, element.bitDiaSig, strorden,  element.intNuOrden,
                                    n+uiui, element.intIdIntervalo));

                                uiui = uiui + 2;

                            });

                            if (typeof _varTablaIntervalo !== 'undefined') {
                                _varTablaIntervalo.destroy();
                            }


                            _varTablaIntervalo = $('#TablaIntervalso').DataTable({

                                data: detalleinterval,
                                columns: [
                                    { data: 'interva' },
                                    { data: 'NomTipoInter' },
                                    { data: 'intTurno' },
                                    { data: 'intTipoInterval' },
                                    { data: 'timeDuracion' },
                                    { data: 'bitDiaSig' },
                                    { data: 'timeHoraIni' },
                                    { data: 'timeTiempoMaximo' },
                                    { data: 'timeTolerancia' },
                                    { data: 'strorden' },
                                    { data: 'intnum' },
                                    { data: 'timeHoraFin' },
                                    {
                                        sortable: false,
                                        "render": (data, type, item, meta) => {

                                            let clave = item.clave;
                                            return `<input type="button" class="btn btn-primary btn-xs btn-delete" dataid="${clave}" data="${item}" value="Quitar" />`;
                                        }
                                    },
                                    { data: 'clave' },
                                    { data: 'bitFlHT' },
                                    { data: 'intIdInterval'},

                                ],
                                order: [10, 'asc'],
                                lengthMenu: [15],
                                sDom: '',
                                responsive: true,
                                language: {
                                    lengthMenu: '',
                                    info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                    infoEmpty: 'No hay Items para mostrar',
                                    search: '',
                                    sSearchPlaceholder: '',
                                    zeroRecords: '',
                                    infoFiltered: '',
                                    paginate: {
                                        previous: 'Anterior',
                                        next: 'Siguiente'
                                    }
                                },
                                columnDefs: [//ocultar y definir columnas

                                    {

                                        targets: [2],
                                        visible: false,

                                    },
                                    {

                                        targets: [3],
                                        visible: false,

                                    },
                                    {

                                        targets: [5],
                                        visible: false,

                                    },
                                    {

                                        targets: [6],
                                        visible: false,

                                    },
                                    {

                                        targets: [7],
                                        visible: false,

                                    },
                                    {

                                        targets: [8],
                                        visible: false,

                                    },
                                    {

                                        targets: [10],
                                        visible: false,

                                    }, {

                                        targets: [11],
                                        visible: false,

                                    },
                                    {

                                        targets: [13],
                                        visible: false,

                                    },
                                    {

                                        targets: [14],
                                        visible: false,

                                    },
                                    {

                                        targets: [15],
                                        visible: false,

                                    }
                                ],

                            });


                            $('.form-control input-sm').hide();





                        });


                             $('#TablaIntervalso  tbody').on('click', 'tr input.btn-delete', function () {


                                let claves = $(this).attr("dataid")
                                var LimiteBucle = parseInt(detalleinterval.length);

                                if (!isNaN(claves)) {


                                    for (var i = 0; i < parseInt(detalleinterval.length); i++) {


                                        if (detalleinterval[i].clave == claves) {

                                            u = detalleinterval[i].timeHoraIni;

                                            detalleinterval.splice(i, 1);

                                            if (detalleHoras[i].clave = claves) {


                                                detalleHoras.splice(i, 1);
                                                console.log(detalleinterval + '---->2');
                                                console.log(detalleHoras + '---->2');
                                                continue;
                                            }


                                        }

                                    }


                                    if (typeof _varTablaIntervalo !== 'undefined') {
                                        _varTablaIntervalo.destroy();
                                    }


                                    _varTablaIntervalo = $('#TablaIntervalso').DataTable({

                                        data: detalleinterval,
                                        columns: [
                                            { data: 'interva' },
                                            { data: 'NomTipoInter' },
                                            { data: 'intTurno' },
                                            { data: 'intTipoInterval' },
                                            { data: 'timeDuracion' },
                                            { data: 'bitDiaSig' },
                                            { data: 'timeHoraIni' },
                                            { data: 'timeTiempoMaximo' },
                                            { data: 'timeTolerancia' },
                                            { data: 'strorden' },
                                            { data: 'intnum' },
                                            { data: 'timeHoraFin' },
                                            {
                                                sortable: false,
                                                "render": (data, type, item, meta) => {

                                                    let clave = item.clave;
                                                    return `<input type="button" class="btn btn-primary btn-xs btn-delete" dataid="${clave}" data="${item}" value="Quitar" />`;
                                                }
                                            },
                                            { data: 'clave' },
                                            { data: 'bitFlHT' },
                                            { data: 'intIdInterval' },

                                        ],
                                        order: [10, 'asc'],
                                        lengthMenu: [15],
                                        sDom: '',
                                        responsive: true,
                                        language: {
                                            lengthMenu: '',
                                            info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                            infoEmpty: 'No hay Items para mostrar',
                                            search: '',
                                            sSearchPlaceholder: '',
                                            zeroRecords: '',
                                            infoFiltered: '',
                                            paginate: {
                                                previous: 'Anterior',
                                                next: 'Siguiente'
                                            }
                                        },
                                        columnDefs: [//ocultar y definir columnas

                                            {

                                                targets: [2],
                                                visible: false,

                                            },
                                            {

                                                targets: [3],
                                                visible: false,

                                            },
                                            {

                                                targets: [5],
                                                visible: false,

                                            },
                                            {

                                                targets: [6],
                                                visible: false,

                                            },
                                            {

                                                targets: [7],
                                                visible: false,

                                            },
                                            {

                                                targets: [8],
                                                visible: false,

                                            },
                                            {

                                                targets: [10],
                                                visible: false,

                                            }, {

                                                targets: [11],
                                                visible: false,

                                            },
                                            {

                                                targets: [13],
                                                visible: false,

                                            },
                                            {

                                                targets: [14],
                                                visible: false,

                                            },
                                            {

                                                targets: [15],
                                                visible: false,

                                            }
                                        ],

                                    });



                                }



                            });


                    $('#tiempo_inic').on('change', function () {

                        $('#tiempo_dura').val('00:00');


                        var _HoraIni = $('#tiempo_inic').val();
                        var _HoraFin = $('#tiempo_fin').val();
                        var _bitDiaSiq = $('#chck_cambdia').is(':checked');

                        if (_HoraIni == '00:00' && _HoraFin == '00:00') {

                            $('#tiempo_dura').val('00:00');

                        } else if (_HoraFin == '00:00') {

                            var HoraIni = parseInt(_HoraIni.substring(0, 2));
                            var HoraFin = parseInt(_HoraFin.substring(0, 2));
                            var MiniIni = parseInt(_HoraIni.substring(5, 3));
                            var MiniFin = parseInt(_HoraFin.substring(5, 3));

                            if (HoraIni == 0 && HoraFin == 0 && MiniIni !== 0) {

                                var HoraDur = 0;
                                var MinDur = '00';
                                if (MiniIni == 0) {
                                    MinDur = 0;
                                } else if (MiniIni !== 0) {

                                    MinDur = 60 - MiniIni;

                                }



                                if (HoraDur < 10) {

                                    if (MinDur < 10) {
                                        $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                    } else if (MinDur > 9) {
                                        $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                    }

                                } else if (HoraDur > 9) {

                                    if (MinDur < 10) {
                                        $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                    } else if (MinDur > 9) {
                                        $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                    }
                                }


                            } else if (HoraIni !== 0) {




                                var HoraDur = 24 - HoraIni;
                                var MinDur = '00';
                                if (MiniIni == 0) {
                                    MinDur = 0;
                                } else if (MiniIni !== 0) {

                                    MinDur = 60 - MiniIni;

                                }



                                if (HoraDur < 10) {
                                    if (MinDur < 10) {
                                        $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                    } else if (MinDur > 9) {
                                        $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                    }
                                } else if (HoraDur > 9) {
                                    if (MinDur < 10) {
                                        $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                    } else if (MinDur > 9) {
                                        $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                    }

                                }
                            }



                        } else {
                            var HoraIni = parseInt(_HoraIni.substring(0, 2));
                            var MiniIni = parseInt(_HoraIni.substring(5, 3));
                            var HoraFin = parseInt(_HoraFin.substring(0, 2));
                            var MiniFin = parseInt(_HoraFin.substring(5, 3));

                            if (HoraIni <= HoraFin) {

                                if (MiniIni <= MiniFin) {

                                    var HoraDur = HoraFin - HoraIni;
                                    var MinDur = MiniFin - MiniIni;
                                    //var Ini = (HoraIni * 60) + MiniIni;
                                    //var Fin = (HoraFin * 60) + MiniIni;

                                    //var Result = Fin - Ini;
                                    //var HoraDur = HoraFin - HoraIni;
                                    //var MinDur = MiniFin - MiniFin;

                                    if (HoraDur < 10) {
                                        if (MinDur < 10) {
                                            $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                        } else if (MinDur > 9) {
                                            $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                        }
                                    } else if (HoraDur > 9) {
                                        if (MinDur < 10) {
                                            $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                        } else if (MinDur > 9) {
                                            $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                        }
                                    }
                                } else if (MiniIni > MiniFin) {

                                    var HoraDur = (HoraFin - HoraIni) - 1;
                                    var MinDur = (60 - MiniIni) + MiniFin;

                                    if (HoraDur < 10) {
                                        if (MinDur < 10) {
                                            $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                        } else if (MinDur > 9) {
                                            $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                        }
                                    } else if (HoraDur > 9) {
                                        if (MinDur < 10) {
                                            $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                        } else if (MinDur > 9) {
                                            $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                        }
                                    }
                                }
                            }

                            else if (HoraIni > HoraFin) {

                                if (_bitDiaSiq == true) {

                                    if (MiniIni <= MiniFin) {

                                        var HoraDur = (24 - HoraIni) + HoraFin;
                                        var MinDur = MiniFin - MiniIni;


                                        if (HoraDur < 10) {

                                            if (MinDur < 10) {
                                                $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                            } else if (MinDur > 9) {
                                                $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                            }
                                        } else if (HoraDur > 9) {
                                            if (MinDur < 10) {
                                                $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                            } else if (MinDur > 9) {
                                                $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                            }
                                        }

                                    } else if (MiniIni > MiniFin) {

                                        var HoraDur = ((24 - HoraIni) + HoraFin) - 1;
                                        var MinDur = (60 - MiniIni) + MiniFin;

                                        if (HoraDur < 10) {
                                            if (MinDur < 10) {

                                                $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');

                                            } else if (MinDur > 9) {

                                                $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');

                                            }
                                        } else if (HoraDur > 9) {
                                            if (MinDur < 10) {

                                                $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');

                                            } else if (MinDur > 9) {

                                                $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');

                                            }
                                        }
                                    }

                                }
                                else if (_bitDiaSiq == false) {
                                    $('#tiempo_dura').val('00:00');
                                }

                            }
                            else {
                                $('#tiempo_dura').val('00:00');
                            }
                        }

                    });
                    $('#tiempo_fin').on('change', function () {

                        var _HoraIni = $('#tiempo_inic').val();
                        var _HoraFin = $('#tiempo_fin').val();
                        var _bitDiaSiq = $('#chck_cambdia').is(':checked');

                        if (_HoraIni == '00:00' && _HoraFin == '00:00') {

                            $('#tiempo_dura').val('00:00');

                        } if (_HoraIni == '00:00') {





                            var HoraFin = parseInt(_HoraFin.substring(0, 2));
                            var MinFin = parseInt(_HoraFin.substring(5, 3));


                            var HoraDur = HoraFin;
                            var MinDur = MinFin;




                            if (HoraDur < 10) {
                                if (MinDur < 10) {
                                    $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                } else if (MinDur > 9) {
                                    $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                }
                            } else if (HoraDur > 9) {
                                if (MinDur < 10) {
                                    $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                } else if (MinDur > 9) {
                                    $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                }
                            }



                        } else {
                            var HoraIni = parseInt(_HoraIni.substring(0, 2));
                            var MiniIni = parseInt(_HoraIni.substring(5, 3));
                            var HoraFin = parseInt(_HoraFin.substring(0, 2));
                            var MiniFin = parseInt(_HoraFin.substring(5, 3));

                            if (HoraIni <= HoraFin) {

                                if (MiniIni <= MiniFin) {

                                    var HoraDur = HoraFin - HoraIni;
                                    var MinDur = MiniFin - MiniIni;


                                    if (HoraDur < 10) {
                                        if (MinDur < 10) {
                                            $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                        } else if (MinDur > 9) {
                                            $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                        }
                                    } else if (HoraDur > 9) {
                                        if (MinDur < 10) {
                                            $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                        } else if (MinDur > 9) {
                                            $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                        }
                                    }
                                } else if (MiniIni > MiniFin) {

                                    var HoraDur = (HoraFin - HoraIni) - 1;
                                    var MinDur = (60 - MiniIni) + MiniFin;

                                    if (HoraDur < 10) {
                                        if (MinDur < 10) {
                                            $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                        } else if (MinDur > 9) {
                                            $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                        }
                                    } else if (HoraDur > 9) {
                                        if (MinDur < 10) {
                                            $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                        } else if (MinDur > 9) {
                                            $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                        }
                                    }
                                }
                            }
                            else if (HoraIni > HoraFin) {

                                if (_bitDiaSiq == true) {

                                    if (MiniIni <= MiniFin) {

                                        var HoraDur = (24 - HoraIni) + HoraFin;
                                        var MinDur = MiniFin - MiniIni;


                                        if (HoraDur < 10) {

                                            if (MinDur < 10) {
                                                $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                            } else if (MinDur > 9) {
                                                $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                            }
                                        } else if (HoraDur > 9) {
                                            if (MinDur < 10) {
                                                $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                            } else if (MinDur > 9) {
                                                $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                            }
                                        }

                                    } else if (MiniIni > MiniFin) {

                                        var HoraDur = (24 - HoraIni) + HoraFin;
                                        var MinDur = (60 - MiniIni) + MiniFin;

                                        if (HoraDur < 10) {
                                            if (MinDur < 10) {

                                                $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');

                                            } else if (MinDur > 9) {

                                                $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');

                                            }
                                        } else if (HoraDur > 9) {
                                            if (MinDur < 10) {

                                                $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');

                                            } else if (MinDur > 9) {

                                                $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');

                                            }
                                        }
                                    }

                                }
                                else if (_bitDiaSiq == false) {
                                    $('#tiempo_dura').val('00:00');
                                }

                            }
                            else {
                                $('#tiempo_dura').val('00:00');
                            }
                        }


                    });

                    $('#tiempo_tole').on('change' , function () {

                        var _HoraTole = $('#tiempo_tole').val();
                        var _HoraDura = $('#tiempo_dura').val();
                        alert(_HoraDura);
                        if (_HoraDura == '00:00') {

                            $('#tiempo_tole').val('00:00');
                            new PNotify({
                                title: 'Intervalo',
                                text: 'Ingrese ek Rango de Horas ',
                                type: 'info',
                                delay: 1000,
                                styling: 'bootstrap3'

                            });

                            return;
                        } else {
                            var HoraIni = parseInt(_HoraIni.substring(0, 2));
                            var MiniIni = parseInt(_HoraIni.substring(5, 3));
                            var HoraFin = parseInt(_HoraFin.substring(0, 2));
                            var MiniFin = parseInt(_HoraFin.substring(5, 3));

                            if (HoraIni <= HoraFin) {

                                if (MiniIni <= MiniFin) {

                                    var HoraDur = HoraFin - HoraIni;
                                    var MinDur = MiniFin - MiniIni;
                                    //var Ini = (HoraIni * 60) + MiniIni;
                                    //var Fin = (HoraFin * 60) + MiniIni;

                                    //var Result = Fin - Ini;
                                    //var HoraDur = HoraFin - HoraIni;
                                    //var MinDur = MiniFin - MiniFin;

                                    if (HoraDur < 10) {
                                        if (MinDur < 10) {
                                            $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                        } else if (MinDur > 9) {
                                            $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                        }
                                    } else if (HoraDur > 9) {
                                        if (MinDur < 10) {
                                            $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                        } else if (MinDur > 9) {
                                            $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                        }
                                    }
                                } else if (MiniIni > MiniFin) {

                                    var HoraDur = (HoraFin - HoraIni) - 1;
                                    var MinDur = (60 - MiniIni) + MiniFin;

                                    if (HoraDur < 10) {
                                        if (MinDur < 10) {
                                            $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                        } else if (MinDur > 9) {
                                            $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                        }
                                    } else if (HoraDur > 9) {
                                        if (MinDur < 10) {
                                            $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                        } else if (MinDur > 9) {
                                            $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                        }
                                    }
                                }
                            } else {
                                $('#tiempo_dura').val('00:00');
                            }
                        }


                    });

                    $('#btn-save-changes-Intrevalos').on('click', function () {

                        var _TiEMPOiNTERV = $('#TipoInter option:selected').val();
                        var _HoraIni = $('#tiempo_inic').val();
                        var _HoraFin = $('#tiempo_fin').val();
                        var _TipTutn = $('#TipoTurn option:selected').val();
                        var strorden = null;
                        var intnum = null;
                        var num1 = parseInt(_HoraIni);
                        var num2 = parseInt(_HoraFin);

                        var idasig = $('#chck_cambdia').is(':checked');

                        if (idasig == false) {
                            if (num1 > num2) {
                                new PNotify({
                                    title: 'Intervalo',
                                    text: 'La hora Fin no puede ser menor a la Hora de inicio para una Jornada sin Cambio de Día.',
                                    type: 'info',
                                    delay: 1000,
                                    styling: 'bootstrap3'

                                });
                                return;
                            } else {

                            }
                        }
                        if ($('#chck_pri').is(':checked')) {


                            var arr = jQuery.grep(detalleinterval, function (n, i) {
                                return (n.strorden == "Primero")
                            });

                            console.log(arr);

                            if (arr.length == 1) {


                                new PNotify({
                                    title: 'Orden',
                                    text: 'Ya Existe el Intervalo de Primer Orden',
                                    type: 'info',
                                    delay: 1000,
                                    styling: 'bootstrap3'

                                });
                                return;
                            }
                            else {

                                strorden = 'Primero';
                                intnum = 1
                            }
                        }
                        else if ($('#chck_ult').is(':checked')) {
                            var arr = jQuery.grep(detalleinterval, function (n, i) {
                                return (n.strorden == "Ultimo")
                            });

                            console.log(arr);

                            if (arr.length == 1) {


                                new PNotify({
                                    title: 'Orden',
                                    text: 'Ya Existe el Intervalo de Ultimo Orden',
                                    type: 'info',
                                    delay: 1000,
                                    styling: 'bootstrap3'

                                });
                                return;
                            } else {
                                strorden = 'Ultimo';

                                intnum = 999;
                            }
                        } else {
                            strorden = '';
                            intnum = detalleinterval.length + 1;
                        }




                        var _Tiptoler = $('#tiempo_tole').val();
                        var _Tipdur = $('#tiempo_dura').val();

                        var _chck_pri = $('#chck_pri').is(':checked');
                        var _chck_ult = $('#chck_ult').is(':checked');

                        var _consTrab = $('#consTrab').is(':checked');
                        var _chck_cambdia = $('#chck_cambdia').is(':checked');

                        if (_consTrab == 'true') {
                            _consTrab = true;
                        } else if (_consTrab == true) {
                            _consTrab = true;
                        }
                        var _tiempo_cons_max = $('#tiempo_cons_max').val();
                        var NOMTIP_INT = null;

                        var interva;

                        interva = _HoraIni + ' - ' + _HoraFin;

                        var d = new Date();
                        var n = d.getTime()

                        $.post(
                            '/Asistencia/LlenarTipoUM',
                            { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'CAL', strSubGrupo: 'HOR' },
                            (response) => {

                                response.forEach(element2 => {

                                    if (_TiEMPOiNTERV == element2.intidTipo) {
                                        NOMTIP_INT = element2.strDeTipo;

                                        class Horas {
                                            constructor(HoraInicial, MinIninicial, HoraFinal, MiniFinal, clave) {

                                                this.HoraInicial = HoraInicial
                                                this.MinIninicial = MinIninicial
                                                this.HoraFinal = HoraFinal
                                                this.MiniFinal = MiniFinal
                                                this.clave = n

                                            }
                                        }
                                        var _HoraIni = $('#tiempo_inic').val();
                                        var _HoraFin = $('#tiempo_fin').val();
                                        var _bitDiaSiq = $('#chck_cambdia').is(':checked');


                                        var HoraIni = parseInt(_HoraIni.substring(0, 2));
                                        var MiniIni = parseInt(_HoraIni.substring(5, 3));
                                        var HoraFin = parseInt(_HoraFin.substring(0, 2));
                                        var MiniFin = parseInt(_HoraFin.substring(5, 3));


                                        detalleHoras.push(new Horas(HoraIni, MiniIni, HoraFin, MiniFin, n));

                                        //////console.log("Con repetidos es:", detalleHoras);
                                        //////let detalleHorase = detalleHoras.filter((valorActual, indiceActual, arreglo) => {
                                        //////    //Podríamos omitir el return y hacerlo en una línea, pero se vería menos legible
                                        //////    return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)) === indiceActual
                                        //////});
                                        //////console.log("Sin repetidos es:", detalleHorase);

                                        var Notify = 0; var xd = 1; var Valdes = 0;
                                        detalleHoras.filter(function (dato) {

                                            //if (_bitDiaSiq == false) {

                                            if (HoraIni == dato.HoraFinal && HoraFin == dato.HoraFinal) {

                                                if (MiniIni == dato.MiniFinal) {

                                                    if (MiniFin > MiniIni) {

                                                    } else if (MiniIni > MiniFin) {
                                                        Notify = 1;
                                                        Valdes = 2;


                                                        return;

                                                    }
                                                } else if (MiniIni >= dato.MiniFinal) {
                                                    if (MiniFin > MiniIni) {

                                                    } else if (MiniIni > MiniFin) {
                                                        Notify = 1;
                                                        Valdes = 2;

                                                        return;

                                                    }
                                                } else if (MiniIni > MiniFin) {
                                                    Notify = 1;
                                                    Valdes = 2;


                                                    return;
                                                }

                                            }
                                            else if (HoraIni !== dato.HoraInicial || HoraFin !== dato.HoraFinal) {

                                                if (HoraIni < dato.HoraFinal && HoraFin > dato.HoraFinal) {
                                                    //se Cruza con  Rango Posterior a nivel de horas
                                                    Notify = 1;
                                                    Valdes = 2;



                                                } else if (HoraIni < dato.HoraInicial && HoraFin > dato.HoraInicial) {
                                                    //se Cruza con  Rango Contenido a nivel de horas
                                                    Notify = 1;
                                                    Valdes = 2;



                                                } else if (HoraIni > dato.HoraInicial && HoraFin < dato.HoraFinal) {
                                                    //Se Cruza con  Rango Anterior a nivel de horas
                                                    Notify = 1;
                                                    Valdes = 2;



                                                } else if (HoraIni == dato.HoraFinal && HoraFin > dato.HoraFinal) {
                                                    //Rango con igualdad en posterior

                                                    if (MiniIni >= dato.MiniFinal) {

                                                    } else if (MiniIni < dato.MiniFinal) {
                                                        Notify = 1;
                                                        Valdes = 2;



                                                    }
                                                } else if (HoraFin == dato.HoraInicial && HoraIni < dato.HoraFinal) {
                                                    //Rango con igualdad en posterior

                                                    if (MiniFin <= dato.MinIninicial) {

                                                    } else if (MiniFin > dato.MinIninicial) {
                                                        Notify = 1;
                                                        Valdes = 2;


                                                    }
                                                }
                                                else if (HoraIni == dato.HoraInicial && HoraIni < dato.HoraFinal) {
                                                    //Rango con igualdad en posterior
                                                    Notify = 1;
                                                    Valdes = 2;


                                                }

                                                else if (HoraFin == dato.HoraFinal && HoraIni > dato.HoraInicial) {
                                                    //Rango con igualdad en posterior
                                                    Notify = 1;
                                                    Valdes = 2;


                                                }

                                            }
                                            else if (HoraIni == dato.HoraInicial && HoraFin == dato.HoraFinal) {

                                                if (detalleHoras.length == 1) {

                                                } else if (detalleHoras.length > 1) {

                                                    Valdes = 3 + xd;
                                                    xd++;
                                                }
                                            }
                                            else if (HoraIni == dato.HoraInicial && HoraIni == dato.HoraIni) {

                                                if (detalleHoras.length == 1) {

                                                } else if (detalleHoras.length > 1) {

                                                    Valdes = 3 + xd;
                                                    xd++;
                                                }
                                            }
                                            else if (HoraIni == dato.HoraFinal || HoraFin == dato.HoraInicial || HoraIni == dato.HoraFinal && HoraFin == dato.HoraInicial) {

                                                if (MiniIni >= dato.MiniFinal) {

                                                } else if (MiniIni < dato.MiniFinal) {
                                                    Notify = 1;
                                                    Valdes = 2;


                                                    return;

                                                }
                                                else if (MiniFin <= dato.MinIninicial) {


                                                } else if (MiniFin > dato.MinIninicial) {
                                                    Notify = 1;
                                                    Valdes = 2;

                                                    return;


                                                }
                                            }
                                            //} else if (_bitDiaSiq == true) {

                                            //    alert('Con dia siguiente');

                                            //}


                                        });

                                        if (Notify == 1) {
                                            new PNotify({
                                                title: 'Nueva Intervalos',
                                                text: 'Cruce de Intervalos',
                                                type: 'info',
                                                delay: 3000,
                                                styling: 'bootstrap3',
                                                addclass: 'dark'
                                            });


                                            var dex = (detalleHoras.length) - 1;
                                            detalleHoras.splice(dex, 1);

                                            return;

                                        }
                                        else if (Notify == 0 && Valdes == 2 || Notify == 0 && Valdes == 4 || Notify == 0 && Valdes == 0) {

                                            detalleinterval.push(new Intervalos(interva, _TiEMPOiNTERV, NOMTIP_INT, _HoraIni, _HoraFin, _TipTutn, _Tiptoler, _Tipdur, _tiempo_cons_max, _consTrab,
                                                _chck_cambdia, strorden, intnum, n, null));
                                      }
                                        else if (Valdes > 4) {

                                            new PNotify({
                                                title: 'Nueva Intervalos',
                                                text: 'No se puede Repetir el Intervalo',
                                                type: 'info',
                                                delay: 3000,
                                                styling: 'bootstrap3',
                                                addclass: 'dark'
                                            });

                                            var dex = (detalleHoras.length) - 1;
                                            detalleHoras.splice(dex, 1);


                                            return;

                                        }
                                        console.log(detalleinterval);

                                    }
                                    var numeroArreglos = detalleinterval.length;

                                    $('#CantArrInter').val(numeroArreglos);

                                    if (strorden == 'Primero') {

                                        $('#end').val(5);
                                    }
                                    if (strorden == 'Ultimo') {

                                        $('#end2').val(5);
                                    }

                                });


                                var numeroArreglos = detalleinterval.length;

                                $('#CantArrInter').val(numeroArreglos);


                                if (typeof _varTablaIntervalo !== 'undefined') {
                                    _varTablaIntervalo.destroy();
                                }


                                _varTablaIntervalo = $('#TablaIntervalso').DataTable({

                                    data: detalleinterval,
                                    columns: [
                                        { data: 'interva' },
                                        { data: 'NomTipoInter' },
                                        { data: 'intTurno' },
                                        { data: 'intTipoInterval' },
                                        { data: 'timeDuracion' },
                                        { data: 'bitDiaSig' },
                                        { data: 'timeHoraIni' },
                                        { data: 'timeTiempoMaximo' },
                                        { data: 'timeTolerancia' },
                                        { data: 'strorden' },
                                        { data: 'intnum' },
                                        { data: 'timeHoraFin' },
                                        {
                                            sortable: false,
                                            "render": (data, type, item, meta) => {

                                                let clave = item.clave;
                                                return `<input type="button" class="btn btn-primary btn-xs btn-delete" dataid="${clave}" data="${item}" value="Quitar" />`;
                                            }
                                        },
                                        { data: 'clave' },
                                        { data: 'bitFlHT' },
                                        { data: 'intIdInterval' },

                                    ],
                                    order: [10, 'asc'],
                                    lengthMenu: [15],
                                    sDom: '',
                                    responsive: true,
                                    language: {
                                        lengthMenu: '',
                                        info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                        infoEmpty: 'No hay Items para mostrar',
                                        search: '',
                                        sSearchPlaceholder: '',
                                        zeroRecords: '',
                                        infoFiltered: '',
                                        paginate: {
                                            previous: 'Anterior',
                                            next: 'Siguiente'
                                        }
                                    },
                                    columnDefs: [//ocultar y definir columnas

                                        {

                                            targets: [2],
                                            visible: false,

                                        },
                                        {

                                            targets: [3],
                                            visible: false,

                                        },
                                        {

                                            targets: [5],
                                            visible: false,

                                        },
                                        {

                                            targets: [6],
                                            visible: false,

                                        },
                                        {

                                            targets: [7],
                                            visible: false,

                                        },
                                        {

                                            targets: [8],
                                            visible: false,

                                        },
                                        {

                                            targets: [10],
                                            visible: false,

                                        }, {

                                            targets: [11],
                                            visible: false,

                                        },
                                        {

                                            targets: [13],
                                            visible: false,

                                        },
                                        {

                                            targets: [14],
                                            visible: false,

                                        },
                                        {

                                            targets: [15],
                                            visible: false,

                                        }
                                    ],

                                });


                            });

                        $('.form-control input-sm').hide();



                    });


                    $('#TablaIntervalso  tbody').on('click', 'tr input.btn-delete', function () {


                        let claves = $(this).attr("dataid")
                        var LimiteBucle = parseInt(detalleinterval.length);

                        if (!isNaN(claves)) {


                            for (var i = 0; i < parseInt(detalleinterval.length); i++) {


                                if (detalleinterval[i].clave == claves) {

                                    u = detalleinterval[i].timeHoraIni;

                                    detalleinterval.splice(i, 1);

                                    if (detalleHoras[i].clave = claves) {


                                        detalleHoras.splice(i, 1);
                                        console.log(detalleinterval + '---->2');
                                        console.log(detalleHoras + '---->2');
                                        continue;
                                    }


                                }

                            }


                            if (typeof _varTablaIntervalo !== 'undefined') {
                                _varTablaIntervalo.destroy();
                            }


                            _varTablaIntervalo = $('#TablaIntervalso').DataTable({

                                data: detalleinterval,
                                columns: [
                                    { data: 'interva' },
                                    { data: 'NomTipoInter' },
                                    { data: 'intTurno' },
                                    { data: 'intTipoInterval' },
                                    { data: 'timeDuracion' },
                                    { data: 'bitDiaSig' },
                                    { data: 'timeHoraIni' },
                                    { data: 'timeTiempoMaximo' },
                                    { data: 'timeTolerancia' },
                                    { data: 'strorden' },
                                    { data: 'intnum' },
                                    { data: 'timeHoraFin' },
                                    {
                                        sortable: false,
                                        "render": (data, type, item, meta) => {

                                            let clave = item.clave;
                                            return `<input type="button" class="btn btn-primary btn-xs btn-delete" dataid="${clave}" data="${item}" value="Quitar" />`;
                                        }
                                    },
                                    { data: 'clave' },
                                    { data: 'bitFlHT' },
                                    { data: 'intIdInterval' },

                                ],
                                order: [10, 'asc'],
                                lengthMenu: [15],
                                sDom: '',
                                responsive: true,
                                language: {
                                    lengthMenu: '',
                                    info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                    infoEmpty: 'No hay Items para mostrar',
                                    search: '',
                                    sSearchPlaceholder: '',
                                    zeroRecords: '',
                                    infoFiltered: '',
                                    paginate: {
                                        previous: 'Anterior',
                                        next: 'Siguiente'
                                    }
                                },
                                columnDefs: [//ocultar y definir columnas

                                    {

                                        targets: [2],
                                        visible: false,

                                    },
                                    {

                                        targets: [3],
                                        visible: false,

                                    },
                                    {

                                        targets: [5],
                                        visible: false,

                                    },
                                    {

                                        targets: [6],
                                        visible: false,

                                    },
                                    {

                                        targets: [7],
                                        visible: false,

                                    },
                                    {

                                        targets: [8],
                                        visible: false,

                                    },
                                    {

                                        targets: [10],
                                        visible: false,

                                    }, {

                                        targets: [11],
                                        visible: false,

                                    },
                                    {

                                        targets: [13],
                                        visible: false,

                                    },
                                    {

                                        targets: [14],
                                        visible: false,

                                    },
                                    {

                                        targets: [15],
                                        visible: false,

                                    }
                                ],

                            });



                        }



                    });



                    function EliminarIntervalos(data) {

                        var u = 0;



                        for (var i = 0; i < detalleinterval.length; i++) {



                            if (u == 0) {

                                if (detalleinterval[i].clave == data * 1) {


                                    u = detalleinterval[i].timeHoraIni;


                                    detalleinterval.splice(i, 1);


                                    detalleHoras.splice(i, 1);

                                    continue;

                                }


                            } else if (u !== 0) {


                                u++;


                                return false;

                                break;


                            }


                        }

                    }

                    $('#btn-clear-Intrevalos').on('click', function () {

                        if (detalleinterval.length == 0) {

                        } else if (detalleinterval.length > 0) {

                        swal({
                            title: "Eliminar intervalos ",
                            text: "¿Está seguro de eliminar Todos los Intervalos'?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Sí, eliminar",
                            cancelButtonText: "No, cancelar",
                        }).then(function (isConfirm) {
                            if (isConfirm) {

                                detalleinterval.length = 0;
                                detalleHoras.length = 0;

                                if (typeof _varTablaIntervalo !== 'undefined') {
                                    _varTablaIntervalo.destroy();
                                }


                                _varTablaIntervalo = $('#TablaIntervalso').DataTable({

                                    data: detalleinterval,
                                    columns: [
                                        { data: 'interva' },
                                        { data: 'NomTipoInter' },
                                        { data: 'intTurno' },
                                        { data: 'intTipoInterval' },
                                        { data: 'timeDuracion' },
                                        { data: 'bitDiaSig' },
                                        { data: 'timeHoraIni' },
                                        { data: 'timeTiempoMaximo' },
                                        { data: 'timeTolerancia' },
                                        { data: 'strorden' },
                                        { data: 'intnum' },
                                        { data: 'timeHoraFin' },
                                        {
                                            sortable: false,
                                            "render": (data, type, item, meta) => {

                                                let clave = item.clave;
                                                return `<input type="button" class="btn btn-primary btn-xs btn-delete" dataid="${clave}" data="${item}" value="Quitar" />`;
                                            }
                                        },
                                        { data: 'clave' },
                                        { data: 'bitFlHT' },
                                        { data: 'intIdInterval' },

                                    ],
                                    order: [10, 'asc'],
                                    lengthMenu: [15],
                                    sDom: '',
                                    responsive: true,
                                    language: {
                                        lengthMenu: '',
                                        info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                        infoEmpty: 'No hay Items para mostrar',
                                        search: '',
                                        sSearchPlaceholder: '',
                                        zeroRecords: '',
                                        infoFiltered: '',
                                        paginate: {
                                            previous: 'Anterior',
                                            next: 'Siguiente'
                                        }
                                    },
                                    columnDefs: [//ocultar y definir columnas

                                        {

                                            targets: [2],
                                            visible: false,

                                        },
                                        {

                                            targets: [3],
                                            visible: false,

                                        },
                                        {

                                            targets: [5],
                                            visible: false,

                                        },
                                        {

                                            targets: [6],
                                            visible: false,

                                        },
                                        {

                                            targets: [7],
                                            visible: false,

                                        },
                                        {

                                            targets: [8],
                                            visible: false,

                                        },
                                        {

                                            targets: [10],
                                            visible: false,

                                        }, {

                                            targets: [11],
                                            visible: false,

                                        },
                                        {

                                            targets: [13],
                                            visible: false,

                                        },
                                        {

                                            targets: [14],
                                            visible: false,

                                        },
                                        {

                                            targets: [15],
                                            visible: false,

                                        }
                                    ],

                                });

                                return;
                            } else {
                                swal("Cancelado", "La Operación fue cancelada", "error");
                            }
                        });

                       }
                    });

                    //$(document).ready(function () {
                    //    $('.collapse-link').on('click', function () {
                    //        var $BOX_PANEL = $(this).closest('.x_panel'),
                    //            $ICON = $(this).find('i'),
                    //            $BOX_CONTENT = $BOX_PANEL.find('#oculto');
                    //        // fix for some div with hardcoded fix class
                    //        if ($BOX_PANEL.attr('style')) {
                    //            $BOX_CONTENT.slideToggle(200, function () {
                    //                $BOX_PANEL.removeAttr('style');
                    //            });
                    //        } else {
                    //            $BOX_CONTENT.slideToggle(200);
                    //            $BOX_PANEL.css('height', 'auto');
                    //        }
                    //        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
                    //    });
                    //});
                    //var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
                    //    $BODY = $('body'),
                    //    $MENU_TOGGLE = $('#menu_toggle'),
                    //    $SIDEBAR_MENU = $('#sidebar-menu'),
                    //    $SIDEBAR_FOOTER = $('.sidebar-footer'),
                    //    $LEFT_COL = $('.left_col'),
                    //    $RIGHT_COL = $('.right_col'),
                    //    $NAV_MENU = $('.nav_menu'),
                    //    $FOOTER = $('footer');


                }
            });

        //$(".range_min_max").ionRangeSlider({
        //    type: "double",
        //    min: 0,
        //    max: +24,
        //    from: -24,
        //    step: 1,
        //    to: +24,
        //    max_interval: 48
        //});
        function init_ColorPicker() {

            if (typeof ($.fn.colorpicker) === 'undefined') { return; }

            $('.demo1').colorpicker();
            $('.demo2').colorpicker();

            $('#demo_forceformat').colorpicker({
                format: 'rgba',
                horizontal: true
            });

            $('#demo_forceformat3').colorpicker({
                format: 'rgba',
            });

            $('.demo-auto').colorpicker();




        }
    }
     var _varTablaIntervalo;

     function CombosJornadaDiaria() {

      //Combo Tipo Jornada
    $.post(
        '/Asistencia/LlenarTipoUM',
        { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'JORN', strSubGrupo: 'TIPO' },
        (response) => {
            $('#filtojer1').empty();
            $('#TipoJor').empty();
            response.forEach(element => {
                $('#filtojer1').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                $('#TipoJor').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

            });
        });
      //Combos Intervalo
         $.post(
             '/Asistencia/LlenarTipoUM',
             { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'CAL', strSubGrupo: 'HOR' },
             (response) => {
                 $('#TipoInter').empty();
                 response.forEach(element => {
                     $('#TipoInter').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                 });
             });
      //ComboTipoHorario
         $.post(
             '/Asistencia/LlenarTipoUM',
             { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'CAL', strSubGrupo: 'TURN' },
             (response) => {
                 $('#TipoTurn').empty();
                 response.forEach(element => {
                     $('#TipoTurn').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                 });
             });

      //ComboRefriguerio
         $.post(
             '/Asistencia/LlenarTipoUM',
             { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'CAL', strSubGrupo: 'REF' },
             (response) => {
                 $('#cboRef').empty();
                 response.forEach(element => {
                     $('#cboRef').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                 });
             });

      //ComboJerarquia
         $.post(
             '/Asistencia/LlenarTipoUM',
             { strEntidad: 'TGJERARQORG', intIdFiltroGrupo: 0, strGrupo: 'DEPEN', strSubGrupo: '' },
             (response) => {
                 $('#cboJerar').empty();
                 $('#cboJerar').append('<option value="0">Seleccione</option>');

                 response.forEach(element => {
                     $('#cboJerar').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                 });
             });

         //Combo UnidadOrganizacional
         $('#cboJerar').on('change', function () {

             var IntidJerar = $('#cboJerar option:selected').val();

             $.post(
                 '/Asistencia/LlenarTipoUM',
                 { strEntidad: 'TGUNIDORG', intIdFiltroGrupo: IntidJerar, strGrupo: 'JERAR', strSubGrupo: '' },
                 (response) => {
                     $('#cboUndOrg').empty();
                     $('#cboUndOrg').attr('disabled', false);

                     response.forEach(element => {
                         $('#cboUndOrg').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                     });
                 });
         });

}

     var u = 0;

     $('#btn-new-JornadaDiaria').on('click', function () {
    $('.form-hide-JornadaDiaria').show();
    $('#cpicker').colorpicker();
    $('#btn-update-JornadaDiaria').hide();
    $('#btn-save-change-JornadaDiaria').show();
         $.post(
             '/Asistencia/NuevoJornadaDiaria',
             {},
             (response) => {
                 if (response !== '') {
                     $('.form-hide-JornadaDiaria .x_content').empty();
                     $('.form-hide-JornadaDiaria .x_content').html(response);
                     $('.form-hide-JornadaDiaria').show();
                     switcheryLoad();
                     init_checkBox_styles();
                     init_ColorPicker();
                     init_sidebar();
                     CamposAdicionalesJornada();
                     CombosJornadaDiaria();
                     var detalleinterval = new Array();
                     var detalleHoras = new Array();
                     $('#chck_cambdia').on('ifChanged', function () {

                         if ($('#chck_cambdia').is(':checked') == true) {

                             $('#Pertenece_Jor').show();
                             $('#chck_perteneceJor').attr('disabled', false);
                         }
                         if ($('#chck_cambdia').is(':checked') == false) {
                             $('#chck_perteneceJor').iCheck('uncheck');
                             $('#Pertenece_Jor').hide();
                             $('#chck_perteneceJor').attr('disabled', true);

                         }

                     });



                     if ($('#TipoInter').val() == 2) {

                         $('#cons_trab').hide();
                         $('#consi_max').hide();
                         $('#checks_pri_ult').show();
                         $('#chck_pri').iCheck('uncheck');
                         $('#chck_ult').iCheck('uncheck');
                         $('#consTrab').iCheck('uncheck');
                         $('#tiempo_cons_max').empty();

                     }


                     $('#TipoInter').on('change', function () {

                         if ($('#TipoInter').val() == 39) {

                             $('#cons_trab').hide();
                             $('#consi_max').hide();
                             $('#checks_pri_ult').show();
                             $('#chck_pri').iCheck('uncheck');
                             $('#chck_ult').iCheck('uncheck');
                             $('#consTrab').iCheck('uncheck');
                             $('#tiempo_cons_max').empty();

                         } else if ($('#TipoInter').val() == 40) {

                             $('#cons_trab').hide();
                             $('#consi_max').hide();
                             $('#checks_pri_ult').hide();
                             $('#chck_pri').iCheck('uncheck');
                             $('#chck_ult').iCheck('uncheck');
                             $('#consTrab').iCheck('uncheck');
                             $('#tiempo_cons_max').empty();

                         } else if ($('#TipoInter').val() == 41) {

                             $('#cons_trab').show();
                             $('#consi_max').hide();
                             $('#checks_pri_ult').hide();
                             $('#chck_pri').iCheck('uncheck');
                             $('#chck_ult').iCheck('uncheck');
                             $('#consTrab').iCheck('uncheck');
                             $('#tiempo_cons_max').empty();

                         } else if ($('#TipoInter').val() == 45) {

                             $('#cons_trab').hide();
                             $('#consi_max').show();
                             $('#checks_pri_ult').show();
                             $('#chck_pri').iCheck('uncheck');
                             $('#chck_ult').iCheck('uncheck');
                             $('#consTrab').iCheck('uncheck');
                             $('#tiempo_cons_max').empty();

                         } else if ($('#TipoInter').val() == 46) {

                             $('#consi_max').show();
                             $('#cons_trab').show();
                             $('#checks_pri_ult').hide();
                             $('#chck_pri').iCheck('uncheck');
                             $('#chck_ult').iCheck('uncheck');
                             $('#consTrab').iCheck('uncheck');
                             $('#tiempo_cons_max').empty();

                         }
                     });
                     $('#tiempo_dura').attr('disabled', true);
                     $('#btn-limpiar-Intrevalos').on('click', function () {


                         $('#TipoInter').val(39);
                         $('#TipoTurn').val(42);
                         $('#tiempo_inic').val('00:00');
                         $('#tiempo_fin').val('00:00');
                         $('#tiempo_tole').val('00:00');
                         $('#tiempo_dura').val('00:00');
                         $('#tiempo_cons_max').val('00:00');
                         $('#cons_trab').hide();
                         $('#consi_max').hide();
                         $('#checks_pri_ult').hide();

                         if ($('#TipoInter').val() == 39) {

                             $('#cons_trab').hide();
                             $('#consi_max').hide();
                             $('#checks_pri_ult').show();
                             $('#chck_pri').iCheck('uncheck');
                             $('#chck_ult').iCheck('uncheck');
                             $('#consTrab').iCheck('uncheck');
                             $('#tiempo_cons_max').empty();

                         }
                     });
                     $('#chck_pri').on('ifChanged', function () {

                         if ($('#chck_pri').is(':checked') == true) {
                             $('#chck_ult').iCheck('uncheck');
                         } else if ($('#chck_pri').is(':checked') == false) {
                             $('#chck_pri').iCheck('uncheck');
                         }
                     });
                     $('#chck_ult').on('ifChanged', function () {

                         if ($('#chck_ult').is(':checked') == true) {
                             $('#chck_pri').iCheck('uncheck');
                         } else if ($('#chck_ult').is(':checked') == false) {
                             $('#chck_ult').iCheck('uncheck');
                         }
                     });
                     $('#chck_cambdia').on('ifChanged', function () {



                             $('#tiempo_dura').val('00:00');


                             var _HoraIni = $('#tiempo_inic').val();
                             var _HoraFin = $('#tiempo_fin').val();
                             var _bitDiaSiq = $('#chck_cambdia').is(':checked');

                             if (_HoraIni == '00:00' && _HoraFin == '00:00') {

                                 $('#tiempo_dura').val('00:00');

                             } else if (_HoraFin == '00:00') {

                                 var HoraIni = parseInt(_HoraIni.substring(0, 2));
                                 var HoraFin = parseInt(_HoraFin.substring(0, 2));
                                 var MiniIni = parseInt(_HoraIni.substring(5, 3));
                                 var MiniFin = parseInt(_HoraFin.substring(5, 3));

                                 if (HoraIni == 0 && HoraFin == 0 && MiniIni !== 0) {

                                     var HoraDur = 0;
                                     var MinDur = '00';
                                     if (MiniIni == 0) {
                                         MinDur = 0;
                                     } else if (MiniIni !== 0) {

                                         MinDur = 60 - MiniIni;

                                     }



                                     if (HoraDur < 10) {

                                         if (MinDur < 10) {
                                             $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                         } else if (MinDur > 9) {
                                             $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                         }

                                     } else if (HoraDur > 9) {

                                         if (MinDur < 10) {
                                             $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                         } else if (MinDur > 9) {
                                             $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                         }
                                     }


                                 } else if (HoraIni !== 0) {




                                     var HoraDur = 24 - HoraIni;
                                     var MinDur = '00';
                                     if (MiniIni == 0) {
                                         MinDur = 0;
                                     } else if (MiniIni !== 0) {

                                         MinDur = 60 - MiniIni;

                                     }



                                     if (HoraDur < 10) {
                                         if (MinDur < 10) {
                                             $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                         } else if (MinDur > 9) {
                                             $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                         }
                                     } else if (HoraDur > 9) {
                                         if (MinDur < 10) {
                                             $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                         } else if (MinDur > 9) {
                                             $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                         }

                                     }
                                 }



                             } else {
                                 var HoraIni = parseInt(_HoraIni.substring(0, 2));
                                 var MiniIni = parseInt(_HoraIni.substring(5, 3));
                                 var HoraFin = parseInt(_HoraFin.substring(0, 2));
                                 var MiniFin = parseInt(_HoraFin.substring(5, 3));

                                 if (HoraIni <= HoraFin) {

                                     if (MiniIni <= MiniFin) {

                                         var HoraDur = HoraFin - HoraIni;
                                         var MinDur = MiniFin - MiniIni;
                                         //var Ini = (HoraIni * 60) + MiniIni;
                                         //var Fin = (HoraFin * 60) + MiniIni;

                                         //var Result = Fin - Ini;
                                         //var HoraDur = HoraFin - HoraIni;
                                         //var MinDur = MiniFin - MiniFin;

                                         if (HoraDur < 10) {
                                             if (MinDur < 10) {
                                                 $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                             } else if (MinDur > 9) {
                                                 $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                             }
                                         } else if (HoraDur > 9) {
                                             if (MinDur < 10) {
                                                 $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                             } else if (MinDur > 9) {
                                                 $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                             }
                                         }
                                     } else if (MiniIni > MiniFin) {

                                         var HoraDur = (HoraFin - HoraIni) - 1;
                                         var MinDur = (60 - MiniIni) + MiniFin;

                                         if (HoraDur < 10) {
                                             if (MinDur < 10) {
                                                 $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                             } else if (MinDur > 9) {
                                                 $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                             }
                                         } else if (HoraDur > 9) {
                                             if (MinDur < 10) {
                                                 $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                             } else if (MinDur > 9) {
                                                 $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                             }
                                         }
                                     }
                                 }

                                 else if (HoraIni > HoraFin) {

                                     if (_bitDiaSiq == true) {

                                         if (MiniIni <= MiniFin) {

                                             var HoraDur = (24 - HoraIni) + HoraFin;
                                             var MinDur = MiniFin - MiniIni;


                                             if (HoraDur < 10) {

                                                 if (MinDur < 10) {
                                                     $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                                 } else if (MinDur > 9) {
                                                     $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                                 }
                                             } else if (HoraDur > 9) {
                                                 if (MinDur < 10) {
                                                     $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                                 } else if (MinDur > 9) {
                                                     $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                                 }
                                             }

                                         } else if (MiniIni > MiniFin) {

                                             var HoraDur = ((24 - HoraIni) + HoraFin) - 1;
                                             var MinDur = (60 - MiniIni) + MiniFin;

                                             if (HoraDur < 10) {
                                                 if (MinDur < 10) {

                                                     $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');

                                                 } else if (MinDur > 9) {

                                                     $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');

                                                 }
                                             } else if (HoraDur > 9) {
                                                 if (MinDur < 10) {

                                                     $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');

                                                 } else if (MinDur > 9) {

                                                     $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');

                                                 }
                                             }
                                         }

                                     }
                                     else if (_bitDiaSiq == false) {
                                         $('#tiempo_dura').val('00:00');
                                     }

                                 }
                                 else {
                                     $('#tiempo_dura').val('00:00');
                                 }
                             }


                             var _HoraIni = $('#tiempo_inic').val();
                             var _HoraFin = $('#tiempo_fin').val();
                             var _bitDiaSiq = $('#chck_cambdia').is(':checked');

                             if (_HoraIni == '00:00' && _HoraFin == '00:00') {

                                 $('#tiempo_dura').val('00:00');

                             } if (_HoraIni == '00:00') {





                                 var HoraFin = parseInt(_HoraFin.substring(0, 2));
                                 var MinFin = parseInt(_HoraFin.substring(5, 3));


                                 var HoraDur = HoraFin;
                                 var MinDur = MinFin;




                                 if (HoraDur < 10) {
                                     if (MinDur < 10) {
                                         $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                     } else if (MinDur > 9) {
                                         $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                     }
                                 } else if (HoraDur > 9) {
                                     if (MinDur < 10) {
                                         $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                     } else if (MinDur > 9) {
                                         $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                     }
                                 }



                             } else {
                                 var HoraIni = parseInt(_HoraIni.substring(0, 2));
                                 var MiniIni = parseInt(_HoraIni.substring(5, 3));
                                 var HoraFin = parseInt(_HoraFin.substring(0, 2));
                                 var MiniFin = parseInt(_HoraFin.substring(5, 3));

                                 if (HoraIni <= HoraFin) {

                                     if (MiniIni <= MiniFin) {

                                         var HoraDur = HoraFin - HoraIni;
                                         var MinDur = MiniFin - MiniIni;


                                         if (HoraDur < 10) {
                                             if (MinDur < 10) {
                                                 $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                             } else if (MinDur > 9) {
                                                 $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                             }
                                         } else if (HoraDur > 9) {
                                             if (MinDur < 10) {
                                                 $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                             } else if (MinDur > 9) {
                                                 $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                             }
                                         }
                                     } else if (MiniIni > MiniFin) {

                                         var HoraDur = (HoraFin - HoraIni) - 1;
                                         var MinDur = (60 - MiniIni) + MiniFin;

                                         if (HoraDur < 10) {
                                             if (MinDur < 10) {
                                                 $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                             } else if (MinDur > 9) {
                                                 $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                             }
                                         } else if (HoraDur > 9) {
                                             if (MinDur < 10) {
                                                 $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                             } else if (MinDur > 9) {
                                                 $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                             }
                                         }
                                     }
                                 }
                                 else if (HoraIni > HoraFin) {

                                     if (_bitDiaSiq == true) {

                                         if (MiniIni <= MiniFin) {

                                             var HoraDur = (24 - HoraIni) + HoraFin;
                                             var MinDur = MiniFin - MiniIni;


                                             if (HoraDur < 10) {

                                                 if (MinDur < 10) {
                                                     $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                                 } else if (MinDur > 9) {
                                                     $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                                 }
                                             } else if (HoraDur > 9) {
                                                 if (MinDur < 10) {
                                                     $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                                 } else if (MinDur > 9) {
                                                     $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                                 }
                                             }

                                         } else if (MiniIni > MiniFin) {

                                             var HoraDur = (24 - HoraIni) + HoraFin;
                                             var MinDur = (60 - MiniIni) + MiniFin;

                                             if (HoraDur < 10) {
                                                 if (MinDur < 10) {

                                                     $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');

                                                 } else if (MinDur > 9) {

                                                     $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');

                                                 }
                                             } else if (HoraDur > 9) {
                                                 if (MinDur < 10) {

                                                     $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');

                                                 } else if (MinDur > 9) {

                                                     $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');

                                                 }
                                             }
                                         }

                                     }
                                     else if (_bitDiaSiq == false) {
                                         $('#tiempo_dura').val('00:00');
                                     }

                                 }
                                 else {
                                     $('#tiempo_dura').val('00:00');
                                 }
                             }




                     });
                     $('#tiempo_inic').on('change', function () {

                         $('#tiempo_dura').val('00:00');


                         var _HoraIni = $('#tiempo_inic').val();
                         var _HoraFin = $('#tiempo_fin').val();
                         var _bitDiaSiq = $('#chck_cambdia').is(':checked');

                         if (_HoraIni == '00:00' && _HoraFin == '00:00') {

                             $('#tiempo_dura').val('00:00');

                         } else if (_HoraFin == '00:00') {

                             var HoraIni = parseInt(_HoraIni.substring(0, 2));
                             var HoraFin = parseInt(_HoraFin.substring(0, 2));
                             var MiniIni = parseInt(_HoraIni.substring(5, 3));
                             var MiniFin = parseInt(_HoraFin.substring(5, 3));

                             if (HoraIni == 0 && HoraFin == 0 && MiniIni !== 0) {

                                 var HoraDur = 0;
                                 var MinDur = '00';
                                 if (MiniIni == 0) {
                                     MinDur = 0;
                                 } else if (MiniIni !== 0) {

                                     MinDur = 60 - MiniIni;

                                 }



                                 if (HoraDur < 10) {

                                     if (MinDur < 10) {
                                         $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                     } else if (MinDur > 9) {
                                         $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                     }

                                 } else if (HoraDur > 9) {

                                     if (MinDur < 10) {
                                         $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                     } else if (MinDur > 9) {
                                         $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                     }
                                 }


                             } else if (HoraIni !== 0) {




                                 var HoraDur = 24 - HoraIni;
                                 var MinDur = '00';
                                 if (MiniIni == 0) {
                                     MinDur = 0;
                                 } else if (MiniIni !== 0) {

                                     MinDur = 60 - MiniIni;

                                 }



                                 if (HoraDur < 10) {
                                     if (MinDur < 10) {
                                         $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                     } else if (MinDur > 9) {
                                         $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                     }
                                 } else if (HoraDur > 9) {
                                     if (MinDur < 10) {
                                         $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                     } else if (MinDur > 9) {
                                         $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                     }

                                 }
                             }



                         } else {
                             var HoraIni = parseInt(_HoraIni.substring(0, 2));
                             var MiniIni = parseInt(_HoraIni.substring(5, 3));
                             var HoraFin = parseInt(_HoraFin.substring(0, 2));
                             var MiniFin = parseInt(_HoraFin.substring(5, 3));

                             if (HoraIni <= HoraFin) {

                                 if (MiniIni <= MiniFin) {

                                     var HoraDur = HoraFin - HoraIni;
                                     var MinDur = MiniFin - MiniIni;
                                     //var Ini = (HoraIni * 60) + MiniIni;
                                     //var Fin = (HoraFin * 60) + MiniIni;

                                     //var Result = Fin - Ini;
                                     //var HoraDur = HoraFin - HoraIni;
                                     //var MinDur = MiniFin - MiniFin;

                                     if (HoraDur < 10) {
                                         if (MinDur < 10) {
                                             $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                         } else if (MinDur > 9) {
                                             $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                         }
                                     } else if (HoraDur > 9) {
                                         if (MinDur < 10) {
                                             $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                         } else if (MinDur > 9) {
                                             $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                         }
                                     }
                                 } else if (MiniIni > MiniFin) {

                                     var HoraDur = (HoraFin - HoraIni) - 1;
                                     var MinDur = (60 - MiniIni) + MiniFin;

                                     if (HoraDur < 10) {
                                         if (MinDur < 10) {
                                             $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                         } else if (MinDur > 9) {
                                             $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                         }
                                     } else if (HoraDur > 9) {
                                         if (MinDur < 10) {
                                             $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                         } else if (MinDur > 9) {
                                             $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                         }
                                     }
                                 }
                             }

                             else if (HoraIni > HoraFin) {

                                 if (_bitDiaSiq == true) {

                                     if (MiniIni <= MiniFin) {

                                         var HoraDur = (24 - HoraIni) + HoraFin;
                                         var MinDur = MiniFin - MiniIni;


                                         if (HoraDur < 10) {

                                             if (MinDur < 10) {
                                                 $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                             } else if (MinDur > 9) {
                                                 $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                             }
                                         } else if (HoraDur > 9) {
                                             if (MinDur < 10) {
                                                 $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                             } else if (MinDur > 9) {
                                                 $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                             }
                                         }

                                     } else if (MiniIni > MiniFin) {

                                         var HoraDur = ((24 - HoraIni) + HoraFin) - 1;
                                         var MinDur = (60 - MiniIni) + MiniFin;

                                         if (HoraDur < 10) {
                                             if (MinDur < 10) {

                                                 $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');

                                             } else if (MinDur > 9) {

                                                 $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');

                                             }
                                         } else if (HoraDur > 9) {
                                             if (MinDur < 10) {

                                                 $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');

                                             } else if (MinDur > 9) {

                                                 $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');

                                             }
                                         }
                                     }

                                 }
                                 else if (_bitDiaSiq == false) {
                                     $('#tiempo_dura').val('00:00');
                                 }

                             }
                             else {
                                 $('#tiempo_dura').val('00:00');
                             }
                         }

                     });
                     $('#tiempo_fin').on('change', function () {

                         var _HoraIni = $('#tiempo_inic').val();
                         var _HoraFin = $('#tiempo_fin').val();
                         var _bitDiaSiq = $('#chck_cambdia').is(':checked');

                         if (_HoraIni == '00:00' && _HoraFin == '00:00') {

                             $('#tiempo_dura').val('00:00');

                         } if (_HoraIni == '00:00') {





                             var HoraFin = parseInt(_HoraFin.substring(0, 2));
                             var MinFin = parseInt(_HoraFin.substring(5, 3));


                             var HoraDur = HoraFin;
                             var MinDur = MinFin;




                             if (HoraDur < 10) {
                                 if (MinDur < 10) {
                                     $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                 } else if (MinDur > 9) {
                                     $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                 }
                             } else if (HoraDur > 9) {
                                 if (MinDur < 10) {
                                     $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                 } else if (MinDur > 9) {
                                     $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                 }
                             }



                         } else {
                             var HoraIni = parseInt(_HoraIni.substring(0, 2));
                             var MiniIni = parseInt(_HoraIni.substring(5, 3));
                             var HoraFin = parseInt(_HoraFin.substring(0, 2));
                             var MiniFin = parseInt(_HoraFin.substring(5, 3));

                             if (HoraIni <= HoraFin) {

                                 if (MiniIni <= MiniFin) {

                                     var HoraDur = HoraFin - HoraIni;
                                     var MinDur = MiniFin - MiniIni;


                                     if (HoraDur < 10) {
                                         if (MinDur < 10) {
                                             $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                         } else if (MinDur > 9) {
                                             $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                         }
                                     } else if (HoraDur > 9) {
                                         if (MinDur < 10) {
                                             $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                         } else if (MinDur > 9) {
                                             $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                         }
                                     }
                                 } else if (MiniIni > MiniFin) {

                                     var HoraDur = (HoraFin - HoraIni) - 1;
                                     var MinDur = (60 - MiniIni) + MiniFin;

                                     if (HoraDur < 10) {
                                         if (MinDur < 10) {
                                             $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                         } else if (MinDur > 9) {
                                             $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                         }
                                     } else if (HoraDur > 9) {
                                         if (MinDur < 10) {
                                             $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                         } else if (MinDur > 9) {
                                             $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                         }
                                     }
                                 }
                             }
                             else if (HoraIni > HoraFin) {

                                 if (_bitDiaSiq == true) {

                                     if (MiniIni <= MiniFin) {

                                         var HoraDur = (24 - HoraIni) + HoraFin;
                                         var MinDur = MiniFin - MiniIni;


                                         if (HoraDur < 10) {

                                             if (MinDur < 10) {
                                                 $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');
                                             } else if (MinDur > 9) {
                                                 $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');
                                             }
                                         } else if (HoraDur > 9) {
                                             if (MinDur < 10) {
                                                 $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');
                                             } else if (MinDur > 9) {
                                                 $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');
                                             }
                                         }

                                     } else if (MiniIni > MiniFin) {

                                         var HoraDur = (24 - HoraIni) + HoraFin;
                                         var MinDur = (60 - MiniIni) + MiniFin;

                                         if (HoraDur < 10) {
                                             if (MinDur < 10) {

                                                 $('#tiempo_dura').val('0' + HoraDur + ':0' + MinDur + '');

                                             } else if (MinDur > 9) {

                                                 $('#tiempo_dura').val('0' + HoraDur + ':' + MinDur + '');

                                             }
                                         } else if (HoraDur > 9) {
                                             if (MinDur < 10) {

                                                 $('#tiempo_dura').val('' + HoraDur + ':0' + MinDur + '');

                                             } else if (MinDur > 9) {

                                                 $('#tiempo_dura').val('' + HoraDur + ':' + MinDur + '');

                                             }
                                         }
                                     }

                                 }
                                 else if (_bitDiaSiq == false) {
                                     $('#tiempo_dura').val('00:00');
                                 }

                             }
                             else {
                                 $('#tiempo_dura').val('00:00');
                             }
                         }


                     });
                     $('#tiempo_tole').on('change', function () {

                         var _HoraTole = $('#tiempo_tole').val();
                         var _HoraDura = $('#tiempo_dura').val();

                         if (_HoraDura == '00:00') {

                             $('#tiempo_tole').val('00:00');
                             new PNotify({
                                 title: 'Intervalo',
                                 text: 'Ingrese el Rango de Horas',
                                 type: 'info',
                                 delay: 1000,
                                 styling: 'bootstrap3'

                             });

                             return;
                         } else {
                             var HoraDur = parseInt(_HoraDura.substring(0, 2));
                             var MiniDur = parseInt(_HoraDura.substring(5, 3));
                             var HoraTole = parseInt(_HoraTole.substring(0, 2));
                             var MiniTole = parseInt(_HoraTole.substring(5, 3));

                             if (HoraDur == HoraTole) {

                                 if (MiniDur == MiniTole) {

                                 } else if (MiniTole > MiniDur) {
                                     $('#tiempo_tole').val('00:00');
                                     new PNotify({
                                         title: 'Intervalo',
                                         text: 'El tiempo de Tolerancia no puede ser mayor a la Duracion.',
                                         type: 'info',
                                         delay: 1000,
                                         styling: 'bootstrap3'

                                     });

                                     return;
                                 }
                             } else if (HoraDur > HoraTole) {

                             } else if (HoraDur < HoraTole) {

                                 $('#tiempo_tole').val('00:00');
                                 new PNotify({
                                     title: 'Intervalo',
                                     text: 'El tiempo de Tolerancia no puede ser mayor a la Duracion.',
                                     type: 'info',
                                     delay: 1000,
                                     styling: 'bootstrap3'

                                 });

                                 return;
                             }
                         }


                     });

                     $('#btn-save-changes-Intrevalos').on('click', function () {

                         var _TiEMPOiNTERV = $('#TipoInter option:selected').val();
                         var _HoraIni = $('#tiempo_inic').val();
                         var _HoraFin = $('#tiempo_fin').val();
                         var _TipTutn = $('#TipoTurn option:selected').val();
                         var strorden = null;
                         var intnum = null;
                         var num1 = parseInt(_HoraIni);
                         var num2 = parseInt(_HoraFin);
                         var idasig = $('#chck_cambdia').is(':checked');
                         if (idasig == false) {
                             if (num1 > num2) {
                                 new PNotify({
                                     title: 'Intervalo',
                                     text: 'La hora Fin no puede ser menor a la Hora de inicio para una Jornada sin Cambio de Día.',
                                     type: 'info',
                                     delay: 1000,
                                     styling: 'bootstrap3'

                                 });
                                 return;
                             } else {

                             }
                         }
                         if ($('#chck_pri').is(':checked')) {


                             var arr = jQuery.grep(detalleinterval, function (n, i) {
                                 return (n.strorden == "Primero")
                             });

                             console.log(arr);

                             if (arr.length == 1) {


                                 new PNotify({
                                     title: 'Orden',
                                     text: 'Ya Existe el Intervalo de Primer Orden',
                                     type: 'info',
                                     delay: 1000,
                                     styling: 'bootstrap3'

                                 });
                                 return;
                             }
                             else {

                                 strorden = 'Primero';
                                 intnum = 1
                             }
                         }
                         else if ($('#chck_ult').is(':checked')) {


                             var arr = jQuery.grep(detalleinterval, function (n, i) {

                                 return (n.strorden == "Ultimo")

                             });

                             console.log(arr);

                             if (arr.length == 1) {


                                 new PNotify({
                                     title: 'Orden',
                                     text: 'Ya Existe el Intervalo de Ultimo Orden',
                                     type: 'info',
                                     delay: 1000,
                                     styling: 'bootstrap3'

                                 });
                                 return;
                             } else {
                                 strorden = 'Ultimo';

                                 intnum = 999;
                             }
                         }
                     else {

                             if (detalleinterval.length == 0) {

                                 strorden = '';
                             intnum = detalleinterval.length + 2;

                             }
                             else if (detalleinterval.length !== 0) {
                                 strorden = '';
                                 intnum = detalleinterval.length + 1;
                             }


                         }
                         var _Tiptoler = $('#tiempo_tole').val();
                         var _Tipdur = $('#tiempo_dura').val();
                         var _chck_pri = $('#chck_pri').is(':checked');
                         var _chck_ult = $('#chck_ult').is(':checked');
                         var _consTrab = $('#consTrab').is(':checked');
                         var _bitDiaSiq = $('#chck_cambdia').is(':checked');
                         if (_consTrab == 'true') {
                             _consTrab = true;
                         }
                         else if (_consTrab == true) {
                             _consTrab = true;
                         }
                         var _tiempo_cons_max = $('#tiempo_cons_max').val();
                         var NOMTIP_INT = null;
                         var interva;
                         interva = _HoraIni + ' - ' + _HoraFin;
                         var d = new Date();
                         var n = d.getTime();
                         $.post(
                             '/Asistencia/LlenarTipoUM',
                             { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'CAL', strSubGrupo: 'HOR' },
                             (response) => {

                                 response.forEach(element2 => {

                                     if (_TiEMPOiNTERV == element2.intidTipo) {
                                         NOMTIP_INT = element2.strDeTipo;

                                         class Intervalos {
                                             constructor(interva, intTipoInterval, NomTipoInter, timeHoraIni, timeHoraFin, intTurno, timeTolerancia, timeDuracion, timeTiempoMaximo, bitFlHT, bitDiaSig, strorden, intnum, clave) {

                                                 this.interva = interva
                                                 this.intTipoInterval = intTipoInterval
                                                 this.NomTipoInter = NomTipoInter
                                                 this.timeHoraIni = timeHoraIni
                                                 this.timeHoraFin = timeHoraFin
                                                 this.intTurno = intTurno
                                                 this.timeTolerancia = timeTolerancia
                                                 this.timeDuracion = timeDuracion
                                                 this.timeTiempoMaximo = timeTiempoMaximo
                                                 this.bitFlHT = bitFlHT
                                                 this.bitDiaSig = bitDiaSig
                                                 this.strorden = strorden
                                                 this.intnum = intnum
                                                 this.clave = n
                                             }
                                         }

                                         class Horas {
                                             constructor(HoraInicial, MinIninicial, HoraFinal, MiniFinal, clave) {

                                                 this.HoraInicial = HoraInicial
                                                 this.MinIninicial = MinIninicial
                                                 this.HoraFinal = HoraFinal
                                                 this.MiniFinal = MiniFinal
                                                 this.clave = n

                                             }
                                         }

                                         var _HoraIni = $('#tiempo_inic').val();
                                         var _HoraFin = $('#tiempo_fin').val();
                                         var _bitDiaSiq = $('#chck_cambdia').is(':checked');


                                         var HoraIni = parseInt(_HoraIni.substring(0, 2));
                                         var MiniIni = parseInt(_HoraIni.substring(5, 3));
                                         var HoraFin = parseInt(_HoraFin.substring(0, 2));
                                         var MiniFin = parseInt(_HoraFin.substring(5, 3));


                                         detalleHoras.push(new Horas(HoraIni, MiniIni, HoraFin, MiniFin, n));


                                         console.log("Con repetidos es:", detalleHoras);
                                         let detalleHorase = detalleHoras.filter((valorActual, indiceActual, arreglo) => {
                                             //Podríamos omitir el return y hacerlo en una línea, pero se vería menos legible
                                             return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)) === indiceActual
                                         });
                                         console.log("Sin repetidos es:", detalleHorase);

                                         var Notify = 0; var xd = 1; var Valdes = 0;
                                         detalleHoras.filter(function (dato) {

                                             if (HoraIni == dato.HoraFinal && HoraFin == dato.HoraFinal) {

                                                 if (MiniIni == dato.MiniFinal) {

                                                     if (MiniFin > MiniIni) {

                                                     } else if (MiniIni > MiniFin) {
                                                         Notify = 1;
                                                         Valdes = 2;


                                                         return;

                                                     }
                                                 } else if (MiniIni >= dato.MiniFinal) {
                                                     if (MiniFin > MiniIni) {

                                                     } else if (MiniIni > MiniFin) {
                                                         Notify = 1;
                                                         Valdes = 2;

                                                         return;

                                                     }
                                                 } else if (MiniIni > MiniFin) {
                                                     Notify = 1;
                                                     Valdes = 2;


                                                     return;
                                                 }

                                             }
                                             else if (HoraIni !== dato.HoraInicial || HoraFin !== dato.HoraFinal) {

                                                 if (HoraIni < dato.HoraFinal && HoraFin > dato.HoraFinal) {
                                                     //se Cruza con  Rango Posterior a nivel de horas
                                                     Notify = 1;
                                                     Valdes = 2;



                                                 } else if (HoraIni < dato.HoraInicial && HoraFin > dato.HoraInicial) {
                                                     //se Cruza con  Rango Contenido a nivel de horas
                                                     Notify = 1;
                                                     Valdes = 2;



                                                 } else if (HoraIni > dato.HoraInicial && HoraFin < dato.HoraFinal) {
                                                     //Se Cruza con  Rango Anterior a nivel de horas
                                                     Notify = 1;
                                                     Valdes = 2;



                                                 } else if (HoraIni == dato.HoraFinal && HoraFin > dato.HoraFinal) {
                                                     //Rango con igualdad en posterior

                                                     if (MiniIni >= dato.MiniFinal) {

                                                     } else if (MiniIni < dato.MiniFinal) {
                                                         Notify = 1;
                                                         Valdes = 2;



                                                     }
                                                 } else if (HoraFin == dato.HoraInicial && HoraIni < dato.HoraFinal) {
                                                     //Rango con igualdad en posterior

                                                     if (MiniFin <= dato.MinIninicial) {

                                                     } else if (MiniFin > dato.MinIninicial) {
                                                         Notify = 1;
                                                         Valdes = 2;


                                                     }
                                                 }
                                                 else if (HoraIni == dato.HoraInicial && HoraIni < dato.HoraFinal) {
                                                     //Rango con igualdad en posterior
                                                     Notify = 1;
                                                     Valdes = 2;


                                                 }

                                                 else if (HoraFin == dato.HoraFinal && HoraIni > dato.HoraInicial) {
                                                     //Rango con igualdad en posterior
                                                     Notify = 1;
                                                     Valdes = 2;


                                                 }

                                             }
                                             else if (HoraIni == dato.HoraInicial && HoraFin == dato.HoraFinal) {

                                                 if (detalleHoras.length == 1) {

                                                 } else if (detalleHoras.length > 1) {

                                                     Valdes = 3 + xd;
                                                     xd++;
                                                 }
                                             }
                                             else if (HoraIni == dato.HoraInicial && HoraIni == dato.HoraIni) {

                                                 if (detalleHoras.length == 1) {

                                                 } else if (detalleHoras.length > 1) {

                                                     Valdes = 3 + xd;
                                                     xd++;
                                                 }
                                             }
                                             else if (HoraIni == dato.HoraFinal || HoraFin == dato.HoraInicial || HoraIni == dato.HoraFinal && HoraFin == dato.HoraInicial) {

                                                 if (MiniIni >= dato.MiniFinal) {

                                                 } else if (MiniIni < dato.MiniFinal) {
                                                     Notify = 1;
                                                     Valdes = 2;


                                                     return;

                                                 }
                                                 else if (MiniFin <= dato.MinIninicial) {


                                                 } else if (MiniFin > dato.MinIninicial) {
                                                     Notify = 1;
                                                     Valdes = 2;

                                                     return;


                                                 }
                                             }

                                         });



                                         if (HoraIni == HoraFin) {
                                             if (MiniIni == MiniFin)  {
                                                 Notify = 6;
                                             }
                                         }

                                         if (Notify == 1) {
                                             new PNotify({
                                                 title: 'Nuevo Intervalo',
                                                 text: 'Cruce de Intervalos',
                                                 type: 'info',
                                                 delay: 3000,
                                                 styling: 'bootstrap3',
                                                 addclass: 'dark'
                                             });





                                             var dex = (detalleHoras.length) - 1;
                                             detalleHoras.splice(dex, 1);



                                             return;

                                         } else if (Notify == 6) {
                                             new PNotify({
                                                 title: 'Nuevo Intervalo',
                                                 text: 'La hora Inicial y la hora Final no pueden ser la misma',
                                                 type: 'info',
                                                 delay: 3000,
                                                 styling: 'bootstrap3',
                                                 addclass: 'dark'
                                             });
                                             var de = (detalleHoras.length)-1;
                                             detalleHoras.splice(de, 1);
                                             return;

                                         }
                                         else if (Notify == 0 && Valdes == 2 || Notify == 0 && Valdes == 4 || Notify == 0 && Valdes == 0) {


                                             detalleinterval.push(new Intervalos(interva, _TiEMPOiNTERV, NOMTIP_INT, _HoraIni, _HoraFin, _TipTutn, _Tiptoler, _Tipdur, _tiempo_cons_max, _consTrab, _bitDiaSiq, strorden, intnum, n));

                                         }
                                         else if (Valdes > 4) {

                                             new PNotify({
                                                 title: 'Nueva Intervalo',
                                                 text: 'No se puede Repetir el Intervalo',
                                                 type: 'info',
                                                 delay: 3000,
                                                 styling: 'bootstrap3',
                                                 addclass: 'dark'
                                             });

                                             var dea = (detalleHoras.length) - 1;
                                             detalleHoras.splice(dea, 1);

                                             return;

                                         }

                                         console.log(detalleinterval);

                                     }
                                     var numeroArreglos = detalleinterval.length;

                                     $('#CantArrInter').val(numeroArreglos);

                                     if (strorden == 'Primero') {

                                         $('#end').val(5);
                                     }
                                     if (strorden == 'Ultimo') {

                                         $('#end2').val(5);
                                     }

                                 });

                                 if (typeof _varTablaIntervalo !== 'undefined') {
                                     _varTablaIntervalo.destroy();
                                 }


                                 _varTablaIntervalo = $('#TablaIntervalso').DataTable({

                                     data: detalleinterval,
                                     columns: [
                                         { data: 'interva' },
                                         { data: 'NomTipoInter' },
                                         { data: 'intTurno' },
                                         { data: 'intTipoInterval' },
                                         { data: 'timeDuracion' },
                                         { data: 'bitDiaSig' },
                                         { data: 'timeHoraIni' },
                                         { data: 'timeTiempoMaximo' },
                                         { data: 'timeTolerancia' },
                                         { data: 'strorden' },
                                         { data: 'intnum' },
                                         { data: 'timeHoraFin' },
                                         {
                                             sortable: false,
                                             "render": (data, type, item, meta) => {

                                                 let clave = item.clave;
                                                 return `<input type="button" class="btn btn-primary btn-xs btn-delete" dataid="${clave}" data="${item}" value="Quitar" />`;
                                             }
                                         },
                                         { data: 'clave' },
                                         { data: 'bitFlHT' },

                                     ],
                                     order: [10, 'asc'],
                                     lengthMenu: [15],
                                     sDom: '',
                                     responsive: true,
                                     language: {
                                         lengthMenu: '',
                                         info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                         infoEmpty: 'No hay Items para mostrar',
                                         search: '',
                                         sSearchPlaceholder: '',
                                         zeroRecords: '',
                                         infoFiltered: '',
                                         paginate: {
                                             previous: 'Anterior',
                                             next: 'Siguiente'
                                         }
                                     },
                                     columnDefs: [//ocultar y definir columnas

                                         {

                                             targets: [2],
                                             visible: false,

                                         },
                                         {

                                             targets: [3],
                                             visible: false,

                                         },
                                         {

                                             targets: [5],
                                             visible: false,

                                         },
                                         {

                                             targets: [6],
                                             visible: false,

                                         },
                                         {

                                             targets: [7],
                                             visible: false,

                                         },
                                         {

                                             targets: [8],
                                             visible: false,

                                         },
                                         {

                                             targets: [10],
                                             visible: false,

                                         }, {

                                             targets: [11],
                                             visible: false,

                                         },
                                         {

                                             targets: [13],
                                             visible: false,

                                         },
                                         {

                                             targets: [14],
                                             visible: false,

                                         }
                                     ],

                                 });



                             });
                         $('.form-control input-sm').hide();
                         $('#chck_pri').iCheck('uncheck');
                         $('#chck_ult').iCheck('uncheck');
                         $('#consTrab').iCheck('uncheck');

                     });

                     $('#TablaIntervalso  tbody').on('click', 'tr input.btn-delete', function () {



                         let clave1 = $(this).attr("dataid");


                         var LimiteBucle = (detalleinterval.length)-1;

                         if (!isNaN(clave1)) {


                             for (var i = 0; i < LimiteBucle  ; i++) {




                                     if (detalleinterval[i].clave == clave1) {


                                         u = detalleinterval[i].timeHoraIni;


                                         detalleinterval.splice(i, 1);

                                         if (detalleHoras[i].clave = clave1) {

                                             detalleHoras.splice(i, 1);
                                             console.log(detalleinterval + '---->2');
                                              console.log(detalleHoras + '---->2');
                                                   continue;
                                         }


                                  }

                             }


                             if (typeof _varTablaIntervalo !== 'undefined') {
                                 _varTablaIntervalo.destroy();
                             }


                             _varTablaIntervalo = $('#TablaIntervalso').DataTable({

                                 data: detalleinterval,
                                 columns: [
                                     { data: 'interva' },
                                     { data: 'NomTipoInter' },
                                     { data: 'intTurno' },
                                     { data: 'intTipoInterval' },
                                     { data: 'timeDuracion' },
                                     { data: 'bitDiaSig' },
                                     { data: 'timeHoraIni' },
                                     { data: 'timeTiempoMaximo' },
                                     { data: 'timeTolerancia' },
                                     { data: 'strorden' },
                                     { data: 'intnum' },
                                     { data: 'timeHoraFin' },
                                     {
                                         sortable: false,
                                         "render": (data, type, item, meta) => {

                                             let clave = item.clave;
                                             return `<input type="button" class="btn btn-primary btn-xs btn-delete" dataid="${clave}" data="${item}" value="Quitar" />`;
                                         }
                                     },
                                     { data: 'clave' },
                                     { data: 'bitFlHT' },

                                 ],
                                 order: [10, 'asc'],
                                 lengthMenu: [15],
                                 sDom: '',
                                 responsive: true,
                                 language: {
                                     lengthMenu: '',
                                     info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                     infoEmpty: 'No hay Items para mostrar',
                                     search: '',
                                     sSearchPlaceholder: '',
                                     zeroRecords: '',
                                     infoFiltered: '',
                                     paginate: {
                                         previous: 'Anterior',
                                         next: 'Siguiente'
                                     }
                                 },
                                 columnDefs: [//ocultar y definir columnas

                                     {

                                         targets: [2],
                                         visible: false,

                                     },
                                     {

                                         targets: [3],
                                         visible: false,

                                     },
                                     {

                                         targets: [5],
                                         visible: false,

                                     },
                                     {

                                         targets: [6],
                                         visible: false,

                                     },
                                     {

                                         targets: [7],
                                         visible: false,

                                     },
                                     {

                                         targets: [8],
                                         visible: false,

                                     },
                                     {

                                         targets: [10],
                                         visible: false,

                                     }, {

                                         targets: [11],
                                         visible: false,

                                     },
                                     {

                                         targets: [13],
                                         visible: false,

                                     },
                                     {

                                         targets: [14],
                                         visible: false,

                                     }
                                 ],

                             });


                         }



                     });


                     $('#btn-clear-Intrevalos').on('click', function () {

                         if (detalleinterval.length == 0) {

                         } else if (detalleinterval.length > 0) {


                             swal({
                                 title: "Eliminar intervalos ",
                                 text: "¿Está seguro de eliminar Todos los Intervalos'?",
                                 type: "warning",
                                 showCancelButton: true,
                                 confirmButtonText: "Sí, eliminar",
                                 cancelButtonText: "No, cancelar",
                             }).then(function (isConfirm) {
                                 if (isConfirm) {

                                     detalleinterval.length = 0;
                                     detalleHoras.length = 0;

                                     if (typeof _varTablaIntervalo !== 'undefined') {
                                         _varTablaIntervalo.destroy();
                                     }


                                     _varTablaIntervalo = $('#TablaIntervalso').DataTable({

                                         data: detalleinterval,
                                         columns: [
                                             { data: 'interva' },
                                             { data: 'NomTipoInter' },
                                             { data: 'intTurno' },
                                             { data: 'intTipoInterval' },
                                             { data: 'timeDuracion' },
                                             { data: 'bitDiaSig' },
                                             { data: 'timeHoraIni' },
                                             { data: 'timeTiempoMaximo' },
                                             { data: 'timeTolerancia' },
                                             { data: 'strorden' },
                                             { data: 'intnum' },
                                             { data: 'timeHoraFin' },
                                             {
                                                 sortable: false,
                                                 "render": (data, type, item, meta) => {

                                                     let clave = item.clave;
                                                     return `<input type="button" class="btn btn-primary btn-xs btn-delete" dataid="${clave}" data="${item}" value="Quitar" />`;
                                                 }
                                             },
                                             { data: 'clave' },
                                             { data: 'bitFlHT' },

                                         ],
                                         order: [10, 'asc'],
                                         lengthMenu: [15],
                                         sDom: '',
                                         responsive: true,
                                         language: {
                                             lengthMenu: '',
                                             info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                             infoEmpty: 'No hay Items para mostrar',
                                             search: '',
                                             sSearchPlaceholder: '',
                                             zeroRecords: '',
                                             infoFiltered: '',
                                             paginate: {
                                                 previous: 'Anterior',
                                                 next: 'Siguiente'
                                             }
                                         },
                                         columnDefs: [//ocultar y definir columnas

                                             {

                                                 targets: [2],
                                                 visible: false,

                                             },
                                             {

                                                 targets: [3],
                                                 visible: false,

                                             },
                                             {

                                                 targets: [5],
                                                 visible: false,

                                             },
                                             {

                                                 targets: [6],
                                                 visible: false,

                                             },
                                             {

                                                 targets: [7],
                                                 visible: false,

                                             },
                                             {

                                                 targets: [8],
                                                 visible: false,

                                             },
                                             {

                                                 targets: [10],
                                                 visible: false,

                                             }, {

                                                 targets: [11],
                                                 visible: false,

                                             },
                                             {

                                                 targets: [13],
                                                 visible: false,

                                             },
                                             {

                                                 targets: [14],
                                                 visible: false,

                                             }
                                         ],

                                     });



                                     return;
                                 } else {
                                     swal("Cancelado", "La Operación fue cancelada", "error");
                                 }

                             });

                         }
                      });

            }



   var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
                        $BODY = $('body'),
                        $MENU_TOGGLE = $('#menu_toggle'),
                        $SIDEBAR_MENU = $('#sidebar-menu'),
                        $SIDEBAR_FOOTER = $('.sidebar-footer'),
                        $LEFT_COL = $('.left_col'),
                        $RIGHT_COL = $('.right_col'),
                        $NAV_MENU = $('.nav_menu'),
        $FOOTER = $('footer');

                    $(document).ready(function () {
                        $('.collapse-link').on('click', function () {
                            var $BOX_PANEL = $(this).closest('.x_panel'),
                                $ICON = $(this).find('i'),
                                $BOX_CONTENT = $BOX_PANEL.find('#oculto');
                            // fix for some div with hardcoded fix class
                            if ($BOX_PANEL.attr('style')) {
                                $BOX_CONTENT.slideToggle(200, function () {
                                    $BOX_PANEL.removeAttr('style');
                                });
                            } else {
                                $BOX_CONTENT.slideToggle(200);
                                $BOX_PANEL.css('height', 'auto');
                            }
                            $ICON.toggleClass('fa-chevron-up fa-chevron-down');
                        });
                    });

   });



        $(".range_min_max").ionRangeSlider({
            type: "double",
            min: 0,
            max: +24,
            from: -24,
            step: 1,
            to: +24,
            max_interval: 48
        });
        function init_ColorPicker() {

            if (typeof ($.fn.colorpicker) === 'undefined') { return; }
            console.log('init_ColorPicker');

            $('.demo1').colorpicker();
            $('.demo2').colorpicker();

            $('#demo_forceformat').colorpicker({
                format: 'rgba',
                horizontal: true
            });

            $('#demo_forceformat3').colorpicker({
                format: 'rgba',
            });

            $('.demo-auto').colorpicker();



        };


});

     $('#btn-cancel-JornadaDiaria').on('click', function () {
        $('.form-hide-JornadaDiaria').hide();
});

     $('#btn-save-change-JornadaDiaria').on('click', function () {

         var chckactivo = null;
         if ($('#chk-activo-JO').is(':checked') == false) {
             chckactivo = false;
         } if ($('#chk-activo-JO').is(':checked') == true) {
             chckactivo = true;
         }

         var _TipoJor = $('#TipoJor option:selected').val();
         var _Refriguerio = $('#cboRef option:selected').val();
         var _jerar = $('#cboJerar option:selected').val();
         var _uo = $('#cboUndOrg option:selected').val();
         var _codigo = $('#txt_cod_Jor').val();
         var _desc = $('#txt_desc_Jor').val();



         var _cambio48 = $('#chck_cambdia').is(':checked');
         var _pertejor = $('#chck_perteneceJor').is(':checked');

         var _color = $('#txtcolor').val();
         var _campo1 = $('#strJornadaCampo1').val();
         var _campo2 = $('#strJornadaCampo2').val();
         var _campo3 = $('#strJornadaCampo3').val();
         var _campo4 = $('#strJornadaCampo4').val();
         var _campo5 = $('#strJornadaCampo5').val();



         if (_codigo === '' || _desc === '' || _TipoJor === '' || _Refriguerio === ''
             || _jerar === '' || _uo === '') {
             new PNotify({
                 title: 'Nueva Jornada',
                 text: 'Complete los campos obligatorios',
                 type: 'info',
                 delay: 3000,
                 styling: 'bootstrap3',
                 addclass: 'dark'
             });
             $('#notifry_error').html('');
             $('#notifry_errordes').html('');
             return;
         }

         var _TiEMPOiNTERV = $('#TipoInter option:selected').val();
         var _HoraIni = $('#tiempo_inic').val();
         var _HoraFin = $('#tiempo_fin').val();
         var _TipTutn = $('#TipoTurn option:selected').val();
         var _Tiptoler = $('#tiempo_tole').val();
         var _Tipdur = $('#tiempo_dura').val();

         var _chck_pri = $('#chck_pri').is(':checked');
         var _chck_ult = $('#chck_ult').is(':checked');

         var _consTrab = $('#consTrab').is(':checked');

         var _tiempo_cons_max = $('#tiempo_cons_max').val();



         var detallejornada = new Array();

         class Intervalo {
             constructor(intTipoInterval, timeHoraIni, timeHoraFin, intTurno, timeTolerancia, timeDuracion, timeTiempoMaximo, bitFlHT, bitDiaSig, intNuOrden, intidTipoServ, bitFlActivo) {
                 this.intTipoInterval = intTipoInterval
                 this.timeHoraIni = timeHoraIni
                 this.timeHoraFin = timeHoraFin
                 this.intTurno = intTurno
                 this.timeTolerancia = timeTolerancia
                 this.timeDuracion = timeDuracion
                 this.timeTiempoMaximo = timeTiempoMaximo
                 this.bitFlHT = bitFlHT
                 this.bitDiaSig = bitDiaSig
                 this.intNuOrden = intNuOrden
                 this.intidTipoServ = intidTipoServ
                 this.bitFlActivo = bitFlActivo

             }
         }



         $('#Tabla_Intervalos tr').each((index, item) => {

                 var orden = new Array();

                 for (var y = 0; y <= index; y++) {

                     var interva = _varTablaIntervalo.cells({ row: y, column: 0 }).data()[0];
                     var NomTipoInter = _varTablaIntervalo.cells({ row: y, column: 1 }).data()[0];
                     var intTurno = _varTablaIntervalo.cells({ row: y, column: 2 }).data()[0];
                     var intTipoInterval = _varTablaIntervalo.cells({ row: y, column: 3 }).data()[0];
                     var timeDuracion = _varTablaIntervalo.cells({ row: y, column: 4 }).data()[0];
                     var bitDiaSig = _varTablaIntervalo.cells({ row: y, column: 5 }).data()[0];
                     var timeHoraIni = _varTablaIntervalo.cells({ row: y, column: 6 }).data()[0];
                     var timeTiempoMaximo = _varTablaIntervalo.cells({ row: y, column: 7 }).data()[0];
                     var timeTolerancia = _varTablaIntervalo.cells({ row: y, column: 8 }).data()[0];
                     var strorden = _varTablaIntervalo.cells({ row: y, column: 9 }).data()[0];
                     var intnum = _varTablaIntervalo.cells({ row: y, column: 10 }).data()[0];
                     var timeHoraFin = _varTablaIntervalo.cells({ row: y, column: 11 }).data()[0];
                     var clave = _varTablaIntervalo.cells({ row: y, column: 13 }).data()[0];
                     var bitTrabajado = _varTablaIntervalo.cells({ row: y, column: 14 }).data()[0];


                     orden.push(intnum);
                 }

                 var bitFlActivo = true;
                 var intidTipoServ = null;
                 var CantArr = $('#CantArrInter').val();
                 var prim = $('#primer').val();
                 var end = $('#end').val();
                 var end2 = $('#end2').val();

                 if (CantArr == 1) {
                     var intnum = 1;

                     detallejornada.push(new Intervalo(intTipoInterval, timeHoraIni, timeHoraFin, intTurno, timeTolerancia, timeDuracion, timeTiempoMaximo, bitTrabajado, bitDiaSig, intnum, intidTipoServ, bitFlActivo));

                 }

                 else if (CantArr ==2) {


                     if (end == 5) {

                         detallejornada.push(new Intervalo(intTipoInterval, timeHoraIni, timeHoraFin, intTurno, timeTolerancia, timeDuracion, timeTiempoMaximo, bitTrabajado, bitDiaSig, intnum, intidTipoServ, bitFlActivo));

                     }

                     else if (end !== 5 ){

                        $('#primer').val(3);

                     }


                 } else if (CantArr > 2) {

                     if (end == 5 && end2 ==5) {

                         detallejornada.push(new Intervalo(intTipoInterval, timeHoraIni, timeHoraFin, intTurno, timeTolerancia, timeDuracion, timeTiempoMaximo, bitTrabajado, bitDiaSig, intnum, intidTipoServ, bitFlActivo));

                     }

                     else if (end !== 5 && end2 !==5) {

                         $('#primer').val(4);

                     } else if (end !== 5 ) {

                         $('#primer').val(3);

                     }

                     else if (end2 !== 5) {

                         $('#primer').val(5);

                     }

                 }

         });

         var prim = $('#primer').val();
         var end = $('#end').val();
         if (prim == 4 ) {
         new PNotify({
             title: 'Nueva Jornada',
             text: 'Ingrese la primera jornada y la ultima jornada.',
             type: 'info',
             delay: 3000,
             styling: 'bootstrap3',
             addclass: 'dark'
             });
             return;
         }


         if (prim == 3) {
             new PNotify({
                 title: 'Nueva Jornada',
                 text: 'Ingrese la primera jornada.',
                 type: 'info',
                 delay: 3000,
                 styling: 'bootstrap3',
                 addclass: 'dark'
             });
             return;
         }


         if (prim == 5) {
             new PNotify({
                 title: 'Nueva Jornada',
                 text: 'Ingrese la ultima jornada.',
                 type: 'info',
                 delay: 3000,
                 styling: 'bootstrap3',
                 addclass: 'dark'
             });
             return;
         }

         console.log(detallejornada);

         var Jornada = {

             strCodJornada: _codigo,
             strDscJornada: _desc,
             intTipoDia: _TipoJor,
            // timeHoraIni: null,
            // timeHoraFin: null,
             intControlRefri: _Refriguerio,
             strColor: _color,
             IntIdUniOrg: _uo,
             bitDiaSig: _cambio48,
             bitPertenecDiaSig: _pertejor,
             bitPertenecDiaSig: _pertejor,
             strJornadaCampo1: _campo1,
             strJornadaCampo2: _campo2,
             strJornadaCampo3: _campo3,
             strJornadaCampo4: _campo4,
             strJornadaCampo5: _campo5,
             strJornadaCampo5: _campo5,
             bitFlActivo: chckactivo,

         }

         if (detallejornada.length == 0) {
             new PNotify({
                 title: 'Nueva Jornada',
                 text: 'Debe contener al menos un  Intervalo ',
                 type: 'info',
                 delay: 3000,
                 styling: 'bootstrap3',
                 addclass: 'dark'
             });
             return;
         }

         if (detallejornada.length == null) {
             alert('Debe contener un registro Minimo');
             new PNotify({
                 title: 'Nueva Jornada',
                 text: 'Debe contener al menos un Intervalo Minimo',
                 type: 'info',
                 delay: 3000,
                 styling: 'bootstrap3',
                 addclass: 'dark'
             });
             return;
         }


         $.post(
             '/Asistencia/RegistrarNuevaJornada',
             { ObjJornada: Jornada, listaIntervalos: detallejornada},
             (response) => {
                 console.log(response);
                 if (response.type !== '') {

                     if (response.type === 'success') {
                         new PNotify({
                             title: 'Nueva Jornada',
                             text: response.message,
                             type: response.type,
                             delay: 3000,
                             styling: 'bootstrap3'
                         });
                         TablaJornada();
                         $('.form-hide-JornadaDiaria').hide();
                     } else {

                         if (response.type === 'info') {
                             var nomMantemiento = 'Jornada';
                             var campo = 'txt_cod_Jor';
                             var msj = response.message;
                             var response = response.type;
                             var deta = 'notifry_error';
                             INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                             return;

                         } else {

                             if (response.type === 'error') {

                                 var nomMantemiento = 'Jornada';
                                 var campo = 'txt_desc_Jor';
                                 var msj = response.message;
                                 var response = 'info';
                                 var deta = 'notifry_errordes';
                                 INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                 return;
                             } else {
                                 if (response.type === 'alert') {

                                     var nomMantemiento = 'Jornada';
                                     var campo = 'txt_codPla_Var';
                                     var msj = response.message;
                                     var response = 'info';
                                     var deta = 'notifry_errorpla';
                                     INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                     return;
                                 } else if (response.type === 'externo') {

                                     var nomMantemiento = 'Jornada';
                                     var campo = 'txt_codExte_Var';
                                     var msj = response.message;
                                     var response = 'info';
                                     var deta = 'notifry_errorext';
                                     INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                 } else {
                                     new PNotify({
                                         title: 'Error en actualización Jornada',
                                         text: response.message,
                                         type: 'alert',
                                         delay: 3000,
                                         styling: 'bootstrap3'
                                     });
                                     return;
                                 }
                             }

                         }
                     }

                 }
             }
         ).fail(function (result) {
             alert('ERROR ' + result.status + ' ' + result.statusText);
         });

});

     $('#btn-update-JornadaDiaria').on('click', function () {

    var chckactivo = null;
    if ($('#chk-activo-JO').is(':checked') == false) {
        chckactivo = false;
    } if ($('#chk-activo-JO').is(':checked') == true) {
        chckactivo = true;
    }

    var _TipoJor = $('#TipoJor option:selected').val();
    var _Refriguerio = $('#cboRef option:selected').val();
    var _jerar = $('#cboJerar option:selected').val();
    var _uo = $('#cboUndOrg option:selected').val();
    var _codigo = $('#txt_cod_Jor').val();
    var _desc = $('#txt_desc_Jor').val();



    var _cambio48 = $('#chck_cambdia').is(':checked');
    var _pertejor = $('#chck_perteneceJor').is(':checked');

    var _color = $('#txtcolor').val();
    var _campo1 = $('#strJornadaCampo1').val();
    var _campo2 = $('#strJornadaCampo2').val();
    var _campo3 = $('#strJornadaCampo3').val();
    var _campo4 = $('#strJornadaCampo4').val();
    var _campo5 = $('#strJornadaCampo5').val();



    if (_codigo === '' || _desc === '' || _TipoJor === '' || _Refriguerio === ''
        || _jerar === '' || _uo === '') {
        new PNotify({
            title: 'Nueva Jornada',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        return;
    }

    var _TiEMPOiNTERV = $('#TipoInter option:selected').val();
    var _HoraIni = $('#tiempo_inic').val();
    var _HoraFin = $('#tiempo_fin').val();
    var _TipTutn = $('#TipoTurn option:selected').val();
    var _Tiptoler = $('#tiempo_tole').val();
    var _Tipdur = $('#tiempo_dura').val();

    var _chck_pri = $('#chck_pri').is(':checked');
    var _chck_ult = $('#chck_ult').is(':checked');

    var _consTrab = $('#consTrab').is(':checked');

    var _tiempo_cons_max = $('#tiempo_cons_max').val();
    var _idjor = $('#idjorn').val();



    var detallejornadas = new Array();

    class Intervalo {

        constructor(intTipoInterval, timeHoraIni, timeHoraFin, intTurno, timeTolerancia, timeDuracion, timeTiempoMaximo, bitFlHT, bitDiaSig, intNuOrden, intidTipoServ, bitFlActivo, IntIdIntervalo) {
            this.intTipoInterval = intTipoInterval
            this.timeHoraIni = timeHoraIni
            this.timeHoraFin = timeHoraFin
            this.intTurno = intTurno
            this.timeTolerancia = timeTolerancia
            this.timeDuracion = timeDuracion
            this.timeTiempoMaximo = timeTiempoMaximo
            this.bitFlHT = bitFlHT
            this.bitDiaSig = bitDiaSig
            this.intNuOrden = intNuOrden
            this.intidTipoServ = intidTipoServ
            this.bitFlActivo = bitFlActivo
            this.IntIdIntervalo = IntIdIntervalo

        }
    }


    selectedIndex = _varTablaIntervalo.row(this).data();





    $('#Tabla_Intervalose tr').each((index, item) => {

        var orden = new Array();

        for (var y = 0; y <= index; y++) {


            var interva = _varTablaIntervalo.cells({ row: y, column: 0 }).data()[0];
            var NomTipoInter = _varTablaIntervalo.cells({ row: y, column: 1 }).data()[0];
            var intTurno = _varTablaIntervalo.cells({ row: y, column: 2 }).data()[0];
            var intTipoInterval = _varTablaIntervalo.cells({ row: y, column: 3 }).data()[0];
            var timeDuracion = _varTablaIntervalo.cells({ row: y, column: 4 }).data()[0];
            var bitDiaSig = _varTablaIntervalo.cells({ row: y, column: 5 }).data()[0];
            var timeHoraIni = _varTablaIntervalo.cells({ row: y, column: 6 }).data()[0];
            var timeTiempoMaximo = _varTablaIntervalo.cells({ row: y, column: 7 }).data()[0];
            var timeTolerancia = _varTablaIntervalo.cells({ row: y, column: 8 }).data()[0];
            var strorden = _varTablaIntervalo.cells({ row: y, column: 9 }).data()[0];
            var intnum = _varTablaIntervalo.cells({ row: y, column: 10 }).data()[0];
            var timeHoraFin = _varTablaIntervalo.cells({ row: y, column: 11 }).data()[0];
            var clave = _varTablaIntervalo.cells({ row: y, column: 13 }).data()[0];
            var bitTrabajado = _varTablaIntervalo.cells({ row: y, column: 14 }).data()[0];
            var intIdIntervalo = _varTablaIntervalo.cells({ row: y, column: 15 }).data()[0];

            orden.push(intnum);
        }



        var bitFlActivo = true;
        var intidTipoServ = null;
        var CantArr = $('#CantArrInter').val();
        var prim = $('#primer').val();
        var end = $('#end').val();
        var end2 = $('#end2').val();

        if (CantArr == 1) {
            var intnum = 1;
               detallejornadas.push(new Intervalo(intTipoInterval, timeHoraIni, timeHoraFin, intTurno, timeTolerancia, timeDuracion, timeTiempoMaximo, bitTrabajado, bitDiaSig, intnum, intidTipoServ, bitFlActivo, intIdIntervalo));
        }
        else if (CantArr == 2) {
            if (end == 5) {
                detallejornadas.push(new Intervalo(intTipoInterval, timeHoraIni, timeHoraFin, intTurno, timeTolerancia, timeDuracion, timeTiempoMaximo, bitTrabajado, bitDiaSig, intnum, intidTipoServ, bitFlActivo, intIdIntervalo));
            }
            else if (end !== 5) {

                $('#primer').val(3);

            }
        } else if (CantArr > 2) {

            if (end == 5 && end2 == 5) {
                detallejornadas.push(new Intervalo(intTipoInterval, timeHoraIni, timeHoraFin, intTurno, timeTolerancia, timeDuracion, timeTiempoMaximo, bitTrabajado, bitDiaSig, intnum, intidTipoServ, bitFlActivo, intIdIntervalo));

            } else if (end !== 5 && end2 !== 5) {

                $('#primer').val(4);

            } else if (end !== 5) {

                $('#primer').val(3);

            }

            else if (end2 !== 5) {

                $('#primer').val(5);

            }

            //detallejornadas.push(new Intervalo(intTipoInterval, timeHoraIni, timeHoraFin, intTurno, timeTolerancia, timeDuracion, timeTiempoMaximo, bitTrabajado, bitDiaSig, intnum, intidTipoServ, bitFlActivo, intIdIntervalo));

        }

    });

         var prim = $('#primer').val();
         var end = $('#end').val();
         if (prim == 4) {
             new PNotify({
                 title: 'Nueva Jornada',
                 text: 'Ingrese la primera jornada y la ultima jornada.',
                 type: 'info',
                 delay: 3000,
                 styling: 'bootstrap3',
                 addclass: 'dark'
             });
             return;
         }


         if (prim == 3) {
             new PNotify({
                 title: 'Nueva Jornada',
                 text: 'Ingrese la primera jornada.',
                 type: 'info',
                 delay: 3000,
                 styling: 'bootstrap3',
                 addclass: 'dark'
             });
             return;
         }

         if (prim == 5) {
             new PNotify({
                 title: 'Nueva Jornada',
                 text: 'Ingrese la ultima jornada.',
                 type: 'info',
                 delay: 3000,
                 styling: 'bootstrap3',
                 addclass: 'dark'
             });
             return;
         }

    console.log(detallejornadas);


    var Jornada = {

        strCodJornada: _codigo,
        strDscJornada: _desc,
        intTipoDia: _TipoJor,
        // timeHoraIni: null,
        // timeHoraFin: null,
        intControlRefri: _Refriguerio,
        strColor: _color,
        IntIdUniOrg: _uo,
        bitDiaSig: _cambio48,
        bitPertenecDiaSig: _pertejor,
        bitPertenecDiaSig: _pertejor,
        strJornadaCampo1: _campo1,
        strJornadaCampo2: _campo2,
        strJornadaCampo3: _campo3,
        strJornadaCampo4: _campo4,
        strJornadaCampo5: _campo5,
        strJornadaCampo5: _campo5,
        bitFlActivo: chckactivo,
        intIdJornada: _idjor,

    }



    $.post(
        '/Asistencia/ActualizarJornada',
        { ObjJornada: Jornada, listaIntervalos: detallejornadas },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    new PNotify({
                        title: 'Actualización de Jornada',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                    TablaJornada();
                    $('.form-hide-JornadaDiaria').hide();
                } else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Jornada';
                        var campo = 'txt_cod_Jor';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {

                            var nomMantemiento = 'Jornada';
                            var campo = 'txt_desc_Jor';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            return;
                        } else {
                            if (response.type === 'alert') {

                                var nomMantemiento = 'Jornada';
                                var campo = 'txt_codPla_Var';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errorpla';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;
                            } else if (response.type === 'externo') {

                                var nomMantemiento = 'Jornada';
                                var campo = 'txt_codExte_Var';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errorext';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            } else {

                            }
                        }

                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });


});


    /**------------------------------------------------------ */
    /**23. Regla de Negocio */
    /**------------------------------------------------------- */


    $('#filActiVO').on('change', function () {


    TablarReglaNeg();


});

    $('#cboJerar').on('change', function () {


    TablarReglaNeg();


});

    $('#filtro1').keyup(function () {


    TablarReglaNeg();


});


    function CombosReglaDeNegocio() {


    //ComboJerarquia formulario
    $.post(
        '/Asistencia/LlenarTipoUM',
        { strEntidad: 'TGJERARQORG', intIdFiltroGrupo: 0, strGrupo: 'DEPEN', strSubGrupo: '' },
        (response) => {
            $('#cboJerarquia').empty();
            $('#cboJerarquia').append('<option value="0" selected>Seleccione</option>');

            response.forEach(element => {
                $('#cboJerarquia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

            });
        });

    //ComboJerarquia title

    //Combo UnidadOrganizacional
    $('#cboJerarquia').on('change', function () {

        var IntidJerar = $('#cboJerarquia option:selected').val();

        $.post(
            '/Asistencia/LlenarTipoUM',
            { strEntidad: 'TGUNIDORG', intIdFiltroGrupo: IntidJerar, strGrupo: 'JERAR', strSubGrupo: '' },
            (response) => {
                $('#cboUndOrg').empty();
                $('#cboUndOrg').attr('disabled', false);

             var cantreg =response.length ;

                if (cantreg == 0) {
                    $('#cboUndOrg').append('<option value="0" selected>No existen Registros</option>');
                    $('#cboUndOrg').attr('disabled', true);

                }
                else if (cantreg !== 0) {
                    response.forEach(element => {


                        $('#cboUndOrg').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                    });

                }
            });
    });



    //Combo USo Maximo de Tolerancia

    $.post(
        '/Asistencia/LlenarTipoUM',
        { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'REGNEG', strSubGrupo: 'USO' },
        (response) => {
            var cantreg = response.length;
             if (cantreg == 0) {
                $('#UsoTole').empty();
                $('#UsoTole').append('<option selected>No existen Registros</option>');
                $('#UsoTole').attr('disabled', true);

            }
             else if (cantreg !== 0) {
                 $('#UsoTole').empty();
                 response.forEach(element => {

                    $('#UsoTole').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                });
            }
        });

    //Combo USo Maximo de Tolerancia

    $.post(
        '/Asistencia/LlenarTipoUM',
        { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'REGNEG', strSubGrupo: 'HE' },
        (response) => {
            var cantreg = response.length;
            $('#UsoTolera').empty();
            $('#UsoTolera').append('<option selected>Seleccione</option>');

            if (cantreg == 0) {
                $('#UsoTolera').empty();
                $('#UsoTolera').append('<option selected>No existen Registros</option>');
                $('#UsoTolera').attr('disabled', true);

            }
            else if (cantreg !== 0) {
                response.forEach(element => {
                    $('#UsoTolera').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                });
            }
        });

    //Combo USo Maximo de Tolerancia

    $.post(
        '/Asistencia/LlenarTipoUM',
        { strEntidad: 'TGHEXTRAS', intIdFiltroGrupo: 0, strGrupo: '', strSubGrupo: '' },
        (response) => {
            var cantreg = response.length;
            $('#HorasExtras').empty();

            $('#HorasExtras').append('<option selected>Seleccione</option>');

            if (cantreg == 0) {
                $('#HorasExtras').empty();
                $('#HorasExtras').append('<option selected>No existen Registros</option>');
                $('#HorasExtras').attr('disabled', true);

            }
            else if (cantreg !== 0) {

                response.forEach(element => {
                    $('#HorasExtras').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');


                });

            }
        });

    //Combo USo Maximo de Tolerancia

    $.post(
        '/Asistencia/LlenarTipoUM',
        { strEntidad: 'TGHEXTRAS', intIdFiltroGrupo: 0, strGrupo: '', strSubGrupo: '' },
        (response) => {
            var cantreg = response.length;
            $('#HorasExtrase').empty();

            $('#HorasExtrase').append('<option selected>Seleccione</option>');

            if (cantreg == 0) {

                $('#HorasExtrase').empty();
                $('#HorasExtrase').append('<option selected>No existen Registros</option>');
                $('#HorasExtrase').attr('disabled', true);

            }
            else if (cantreg !== 0) {

                response.forEach(element => {
                    $('#HorasExtrase').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');


                });

            }
        });


     //Metodo de Calculo

    $.post(
        '/Asistencia/LlenarTipoUM',
        { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'REGNEG', strSubGrupo: 'CALC' },
        (response) => {
            var cantreg = response.length;
            $('#MetCal').empty();


            if (cantreg == 0) {
                $('#MetCal').empty();
                $('#MetCal').append('<option selected>No existen Registros</option>');
                $('#MetCal').attr('disabled', true);

            }
            else if (cantreg !== 0) {


                response.forEach(element => {
                    $('#MetCal').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                });

            }
        });

     //Metodo de Calculo

    $.post(
        '/Asistencia/LlenarTipoUM',
        { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'REGNEG', strSubGrupo: 'TCALC' },
        (response) => {
            $('#MetCalc').empty();

            var cantreg = response.length;


            if (cantreg == 0) {
                $('#MetCalc').empty();
                $('#MetCalc').append('<option selected>No existen Registros</option>');
                $('#MetCalc').attr('disabled', true);

            }
            else if (cantreg !== 0) {


                response.forEach(element => {
                    $('#MetCalc').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                });

            }
        });
}

    var _varTablaRegNeg;

    function TablarReglaNeg() {

    var filtroActivo = $('#filActiVO').val();
    var strfiltro = $('#filtro1').val();
    var filtrojer = $('#cboJerar').val();



    $.post(
        '/Asistencia/GetTablaFiltradaReglaNegocio',
        { IntActivoFilter: filtroActivo, strfilter: strfiltro, intfiltrojer: filtrojer },
        (response) => {
            console.log(response);

            if (typeof _varTablaRegNeg !== 'undefined') {
                _varTablaRegNeg.destroy();
            }

            _varTablaRegNeg = $('#TablaReg').DataTable({
                data: response,
                columns: [


                    { data: 'strCoRegNeg' },
                    { data: 'strDesRegNeg' },
                    { data: 'strDescUO' },
                    { data: 'strJerOrg' },
                    { data: 'strEstado' },
                    { data: null },
                    { data: 'intIdReglaNeg' },
                    { data: 'intextra1' },
                    { data: 'strRegNegCampo1' },
                    { data: 'strRegNegCampo2' },
                    { data: 'strRegNegCampo3' },
                    { data: 'strRegNegCampo4' },
                    { data: 'strRegNegCampo5' },
                    { data: 'intextra2' },
                    { data: 'bitFlActivo' },



                ],
                lengthMenu: [10, 25, 50],
                order: [1, 'asc'],
                responsive: true,
                language: _datatableLanguaje,
                columnDefs: [//ocultar y definir columnas
                    {
                        targets: [5],
                        data: null,
                        defaultContent: '<button class="btn btn-success btn-xs btn-edit" ><i class="fa fa-pencil"></i> Editar </button>' +
                            '<button class="btn btn-primary btn-xs btn-delete"><i class="fa fa-trash-o"></i> Eliminar </button>'
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
                    }
                ],
                dom: 'lBfrtip',
            });


            $('#TablaReg  tbody').on('click', 'tr button.btn-edit', function () {
                var data = _varTablaRegNeg.row($(this).parents('tr')).data();
                if (data == null) {
                    data = null;
                    var data = _varTablaRegNeg.row($(this).parents('li')).data();
                    cardarDatosRegNeg(data);
                } else {
                    var data = _varTablaRegNeg.row($(this).parents('tr')).data();
                    cardarDatosRegNeg(data);
                }

            });

            $('#TablaReg  tbody').on('click', 'tr button.btn-delete', function () {

                var data = _varTablaRegNeg.row($(this).parents('tr')).data();

                if (data == null) {
                    data = null;

                    var data = _varTablaRegNeg.row($(this).parents('li')).data();
                    intentEliminarReglaNegocio(data['intIdReglaNeg'], data['strDesRegNeg']);

                } else {

                    var data = _varTablaRegNeg.row($(this).parents('tr')).data();
                    intentEliminarReglaNegocio(data['intIdReglaNeg'], data['strDesRegNeg']);

                }


            });

        });

}

    function intentEliminarReglaNegocio(idJor, nomJor) {
    swal({
        title: "Eliminar Regla de Negocio",
        text: "¿Está seguro de eliminar la regla   ''<strong>" + nomJor + "</strong>''?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    }).then(function (isConfirm) {
        if (isConfirm) {
            yesEliminaRegla(idJor);
        } else {
            swal("Cancelado", "La Operación fue cancelada", "error");
        }
    });
}

    function yesEliminaRegla(idJor) {
    $.post(
        '/Asistencia/EliminarReglaNegocio',
        { intIdReglaNeg: idJor },
        (response) => {
            console.log(response);
            if (response.type !== '') {
                var tipo = 'Eliminado!';
                if (response.type === 'error')
                    tipo = 'NO SE PUEDE ELIMINAR EL REGISTRO';
                swal(tipo, response.message, response.type);

                if (response.type === 'success')
                    TablarReglaNeg();

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
}

    var _varTablaConfigHECD;
    var _varTablaConfigHECDD;

    function cardarDatosRegNeg(data) {

    console.log(data);

    $.post(
        '/Asistencia/EditarReglaNegocio',
        {},
        (response) => {
            if (response !== '') {
                $('.form-hide-ReglaNegocio').show();
                $('.form-hide-ReglaNegocio .x_content').empty();
                $('.form-hide-ReglaNegocio .x_content').html(response);
                $('#btn-save-change-ReglaNegocio').hide();
                $('#btn-update-ReglaNegocio').show();
                $('#btn-update-ReglaNegocio').attr('disabled', false);
                CombosReglaDeNegocio();
                init_SmartWizard();
                init_sidebar();
                init_checkBox_styles();


                $('#txt_codigo_RN').val(data.strCoRegNeg);
                $('#txt_descripcion_RN').val(data.strDesRegNeg);

                //ComboJerarquia formulario
                $.post(
                    '/Asistencia/LlenarTipoUM',
                    { strEntidad: 'TGJERARQORG', intIdFiltroGrupo: 0, strGrupo: 'DEPEN', strSubGrupo: '' },
                    (response) => {
                        $('#cboJerarquia').empty();
                        $('#cboJerarquia').append('<option value="0" selected>Seleccione</option>');

                        response.forEach(element => {
                            $('#cboJerarquia').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                        });
                        $("#cboJerarquia").val(data.intextra1);
                    });




                $.post(
                    '/Asistencia/LlenarTipoUM',
                    { strEntidad: 'TGUNIDORG', intIdFiltroGrupo: data.intextra1, strGrupo: 'JERAR', strSubGrupo: '' },
                    (response) => {
                        $('#cboUndOrg').empty();
                        $('#cboUndOrg').attr('disabled', false);

                        var cantreg = response.length;

                        if (cantreg == 0) {
                            $('#cboUndOrg').append('<option value="0" selected>No existen Registros</option>');
                            $('#cboUndOrg').attr('disabled', true);

                        }
                        else if (cantreg !== 0) {
                            response.forEach(element => {


                                $('#cboUndOrg').append('<option value="' + element.intidTipo + '">' + element.strDeTipo + '</option>');

                            });

                        }
                        $("#cboUndOrg").val(data.intextra2);
                    });

                $.post(
                    '/Asistencia/CamposAdicionales',
                    { strEntidad: 'TGREGLANEG' },
                    (response) => {

                        console.log(response);
                        $('#containerCampose').empty();
                        response.forEach(element => {

                            $('#containerCampose').append(
                                ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                                + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


                        });
                        $('#strRegNegCampo1').val(data.strRegNegCampo1);
                        $('#strRegNegCampo2').val(data.strRegNegCampo2);
                        $('#strRegNegCampo3').val(data.strRegNegCampo3);
                        $('#strRegNegCampo4').val(data.strRegNegCampo4);
                        $('#strRegNegCampo5').val(data.strRegNegCampo5);


                    });


                if (data.bitFlActivo == false) {

                    $('#idche').html('<input type="checkbox" id="chk-activo-JO" class=" js-switch"  /> Activo');
                    // $('#chck_Activo_Var').iCheck('uncheck');

                }
                else if (data.bitFlActivo == true) {

                    $('#idche').html('<input type="checkbox" id="chk-activo-JO" class=" js-switch" checked /> Activo');
                    // $('#chck_Activo_Var').iCheck('check');

                }

                switcheryLoad();


                $('#IdRegNeg').val(data.intIdReglaNeg);

                LlenarTablaHE();



                $.post(
                    '/Asistencia/ObtenerRegistroReglaNedocio',
                    { intIdReglaNeg: data.intIdReglaNeg },
                    (response) => {

                        console.log(response);
                        response.forEach(element => {


                            // 1.-Bloque  A.1.1
                            if (element.strCoReglaDet == 'AVPM') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_valid_pri_marca').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_valid_pri_marca').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'PVALIDREF') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_valid_marca_refri').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_valid_marca_refri').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'PASMAREF') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_asumir_Marcar_MI').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_asumir_Marcar_MI').iCheck('uncheck');

                                }
                            }

                            //2.-Bloque A.1.1


                            if (element.strCoReglaDet == 'TMINHTREF') {


                                $('#TimeMinHTDsctRefri').val(element.strPosibValor);

                            }


                            if (element.strCoReglaDet == 'TVALIDREF') {


                                $('#TimeMinValidMarCRefri').val(element.strPosibValor);

                            }


                            if (element.strCoReglaDet == 'TREFDIADES') {


                                $('#TimeDsctRefriDiaDesca').val(element.strPosibValor);

                            }

                            //3.-Bloque A.1.1

                            if (element.strCoReglaDet == 'ABO') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_Valida_Bon').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_Valida_Bon').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'DINIPLANHO') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_config_dia_ini').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_config_dia_ini').iCheck('uncheck');
                                }
                            }


                            if (element.strCoReglaDet == 'ASIGM') {

                                if (element.strPosibValor == "1") {

                                    $('#Vali_Asig_marc').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#Vali_Asig_marc').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'PEXCEP') {

                                if (element.strPosibValor == "1") {

                                    $('#Cons_Exc_SinCargo').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#Cons_Exc_SinCargo').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'FSH') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_cons_fer_hor').iCheck('check');

                                }
                                else if (element.strPosibValor == "false") {

                                    $('#chck_cons_fer_hor').iCheck('0');
                                }
                            }


                            if (element.strCoReglaDet == 'FEF') {

                                if (element.strPosibValor == "1") {

                                    $('#ConsFal').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#ConsFal').iCheck('uncheck');

                                }
                            }


                            //4.-Bloque A.1.2


                            if (element.strCoReglaDet == 'TING') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_Tar_Ing_Tole').iCheck('check');
                                    $('#chck_Tar_Tole').iCheck('uncheck');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_Tar_Tole').iCheck('check');
                                    $('#chck_Tar_Ing_Tole').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'TREF') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_Tar_Refr_Tole').iCheck('check');
                                    $('#chck_Tar_Tole_xd').iCheck('uncheck');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_Tar_Tole_xd').iCheck('check');
                                    $('#chck_Tar_Refr_Tole').iCheck('uncheck');

                                }

                            }

                            //5.-Bloque A.1.2

                            if (element.strCoReglaDet == 'TIPOTOL') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_PorSemana').iCheck('check');
                                    $('#chck_PorPeriodo').iCheck('uncheck');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_PorPeriodo').iCheck('check');
                                    $('#chck_PorSemana').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'FORMTOL') {

                                $('#UsoTole').val(element.strPosibValor);
                                $('#UsoTole').on('change', function () {

                                    var VARI = $('#UsoTole').val();

                                    if (VARI == 107) {

                                        $('#change_state_TipoTole').html('<input type="time" id="DscTole" class="form-control" min="00:00" max="24:00" accept="hh:mm" value="00:00">');

                                    } else if (VARI == 108) {

                                        $('#change_state_TipoTole').html('<input type="number" id="DscTole" class="form-control" value="0">');


                                    }

                                });

                                var VARI = $('#UsoTole').val();

                                if (VARI == 107) {

                                    $('#change_state_TipoTole').html('<input type="time" id="DscTole" class="form-control" min="00:00" max="24:00" accept="hh:mm" value="00:00">');

                                } else if (VARI == 108) {

                                    $('#change_state_TipoTole').html('<input type="number" id="DscTole" class="form-control" value="0">');



                                }


                            }



                            if (element.strCoReglaDet == 'GENTOLTAR') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_GeneTar_MaxTol').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_GeneTar_MaxTol').iCheck('uncheck');

                                }
                            }







                            $.post(
                                '/Asistencia/ObtenerRegistroReglaNedocio',
                                { intIdReglaNeg: data.intIdReglaNeg },
                                (response) => {

                                    console.log(response);
                                    response.forEach(element => {

                                        if (element.strCoReglaDet == 'TMAXTOL') {


                                            $('#DscTole').val(element.strPosibValor);



                                        }

                                    });
                                });









                            //6.-Bloque A.1.2

                            if (element.strCoReglaDet == 'CJD') {

                                if (element.strPosibValor == "1") {

                                    $('#ConsAusJustDiaria').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#ConsAusJustDiaria').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'CDF') {

                                if (element.strPosibValor == "1") {

                                    $('#ConsFeriSinAsis').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#ConsFeriSinAsis').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'HTDOM') {



                                if (element.strPosibValor > '00:00') {

                                    $('#chk_cons_dom').iCheck('check');

                                } else if (element.strPosibValor == '00:00') {

                                    $('#chk_cons_dom').iCheck('uncheck');

                                }


                                $('#time_chk_cons_dom').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TMAXREF') {



                                $('#chck_con_refr_max').iCheck('check');

                                if (element.strPosibValor > '00:00') {

                                    $('#chk_cons_dom').iCheck('check');

                                } else if (element.strPosibValor == '00:00') {

                                    $('#chck_con_refr_max').iCheck('uncheck');

                                }

                                $('#time_chck_con_refr_max').val(element.strPosibValor);


                            }

                            if (element.strCoReglaDet == 'TCASTMIREF') {




                                if (element.strPosibValor > '00:00') {

                                    $('#chck_dsct_no_marcar').iCheck('check');

                                } else if (element.strPosibValor == '00:00') {

                                    $('#chck_dsct_no_marcar').iCheck('uncheck');

                                }


                                $('#time_chck_dsct_no_marcar').val(element.strPosibValor);

                            }


                            //7.-Bloque A.1.3

                            if (element.strCoReglaDet == 'TMAH') {

                                $('#time_min_antes_hor').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TMDH') {

                                $('#time_min_despues_hor').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TMDNL') {

                                $('#time_min_durante_diaslab').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'PHAJUST') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_dias_just').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_dias_just').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'PREF') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_per_refr').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_per_refr').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'TMREF') {

                                $('#time_chck_per_refr').val(element.strPosibValor);
                            }

                            //8.-Bloque A.1.3

                            if (element.strCoReglaDet == 'DTR') {

                                $('#Time_TE_ConsiDTrab').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TMHADT') {

                                $('#Time_HA_Efect_ConsDT').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'ADTRAB') {

                                $('#chck_Sabado').iCheck('uncheck');
                                $('#chck_Domingo').iCheck('uncheck');
                                $('#chck_DiaFer').iCheck('uncheck');
                                $('#chck_DiaDesc').iCheck('uncheck');

                                if (element.strPosibValor.includes('SAB') == true) {

                                    $('#chck_Sabado').iCheck('check');

                                } if (element.strPosibValor.includes('DOM') == true) {

                                    $('#chck_Domingo').iCheck('check');

                                } if (element.strPosibValor.includes('FER') == true) {

                                    $('#chck_DiaFer').iCheck('check');

                                } if (element.strPosibValor.includes('DESC') == true) {

                                    $('#chck_DiaDesc').iCheck('check');

                                }

                            }


                            //9.-Bloque A.1.4

                            if (element.strCoReglaDet == 'CHORARIO') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_Con_Hor').iCheck('check');
                                    $('#chck_Sin_Hor').iCheck('uncheck');


                                } else if (element.strPosibValor == "0") {

                                    $('#chck_Sin_Hor').iCheck('check');
                                    $('#chck_Con_Hor').iCheck('uncheck');


                                }
                            }


                            if (element.strCoReglaDet == 'TRABAMA') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_trab_amanecida').iCheck('check');


                                } else if (element.strPosibValor == "0") {

                                    $('#chck_trab_amanecida').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'PTAREOS') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_proc_tareo').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_proc_tareo').iCheck('uncheck');

                                }
                            }

                            //10.-Bloque A.1.4

                            if (element.strCoReglaDet == 'HGESMIREF') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_marc_incom_refr').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_marc_incom_refr').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'THOLINIREF') {

                                $('#time_ini_chck_marc_incom_refr').val(element.strPosibValor);

                            }


                            if (element.strCoReglaDet == 'THOLFINREF') {

                                $('#time_fin_chck_marc_incom_refr').val(element.strPosibValor);

                            }

                            //11.-Bloque A.1.4

                            if (element.strCoReglaDet == 'ACASTXTI') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_apli_catigo').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_apli_catigo').iCheck('uncheck');

                                }
                            }

                            /************************************************/
                            $('#chck_apli_catigo').on('ifChanged', function () {

                                if ($('#chck_apli_catigo').is(':checked') == false) {

                                    $('#time_ini_cast1').attr('disabled', true);
                                    $('#time_ini_cast1').val('00:00');
                                    $('#time_ini_cast2').attr('disabled', true);
                                    $('#time_ini_cast2').val('00:00');
                                    $('#time_ini_cast3').attr('disabled', true);
                                    $('#time_ini_cast3').val('00:00');
                                    $('#time_fin_cast1').attr('disabled', true);
                                    $('#time_fin_cast1').val('00:00');
                                    $('#time_fin_cast2').attr('disabled', true);
                                    $('#time_fin_cast2').val('00:00');
                                    $('#time_apli_cast1').attr('disabled', true);
                                    $('#time_apli_cast1').val('00:00');
                                    $('#time_apli_cast2').attr('disabled', true);
                                    $('#time_apli_cast2').val('00:00');
                                    $('#time_apli_cast3').attr('disabled', true);
                                    $('#time_apli_cast3').val('00:00');

                                } if ($('#chck_apli_catigo').is(':checked') == true) {

                                    $('#time_ini_cast1').attr('disabled', false);
                                    $('#time_ini_cast2').attr('disabled', false);
                                    $('#time_ini_cast3').attr('disabled', false);
                                    $('#time_fin_cast1').attr('disabled', false);
                                    $('#time_fin_cast2').attr('disabled', false);
                                    $('#time_apli_cast1').attr('disabled', false);
                                    $('#time_apli_cast2').attr('disabled', false);
                                    $('#time_apli_cast3').attr('disabled', false);


                                }
                            });
                            if ($('#chck_apli_catigo').is(':checked') == false) {

                                $('#time_ini_cast1').attr('disabled', true);
                                $('#time_ini_cast1').val('00:00');
                                $('#time_ini_cast2').attr('disabled', true);
                                $('#time_ini_cast2').val('00:00');
                                $('#time_ini_cast3').attr('disabled', true);
                                $('#time_ini_cast3').val('00:00');
                                $('#time_fin_cast1').attr('disabled', true);
                                $('#time_fin_cast1').val('00:00');
                                $('#time_fin_cast2').attr('disabled', true);
                                $('#time_fin_cast2').val('00:00');
                                $('#time_apli_cast1').attr('disabled', true);
                                $('#time_apli_cast1').val('00:00');
                                $('#time_apli_cast2').attr('disabled', true);
                                $('#time_apli_cast2').val('00:00');
                                $('#time_apli_cast3').attr('disabled', true);
                                $('#time_apli_cast3').val('00:00');

                            }


                            $('#time_apli_cast1').on('change', function () {
                                var _HoraIni = $('#time_ini_cast1').val();
                                var _HoraFin = $('#time_fin_cast1').val();

                                if (_HoraFin == '00:00') {

                                } else if (_HoraFin !== '00:00') {
                                    if (_HoraIni <= _HoraFin) {
                                        return;
                                    } else if (_HoraIni > _HoraFin) {

                                        new PNotify({
                                            title: 'Configuración de Horas Extras',
                                            text: 'Ingrese un Intervalo Correcto del Castigo #1',
                                            type: 'info',
                                            delay: 3000,
                                            styling: 'bootstrap3',
                                        });
                                        $('#time_ini_cast1').val('00:00');
                                        $('#time_fin_cast1').val('00:00');

                                        return;
                                    }
                                }
                            });


                            $('#time_apli_cast2').on('change', function () {
                                var _HoraIni = $('#time_ini_cast2').val();
                                var _HoraFin = $('#time_fin_cast2').val();
                                var _HoraFinAnt = $('#time_fin_cast1').val();

                                if (_HoraFin == '00:00') {

                                } else if (_HoraFin !== '00:00') {
                                    if (_HoraIni <= _HoraFin) {
                                        return;
                                    } else if (_HoraIni > _HoraFin) {

                                        new PNotify({
                                            title: 'Configuración de Horas Extras',
                                            text: 'Ingrese un Intervalo Correcto del Castigo #2',
                                            type: 'info',
                                            delay: 3000,
                                            styling: 'bootstrap3',
                                        });
                                        $('#time_ini_cast2').val('00:00');
                                        $('#time_fin_cast2').val('00:00');
                                        return;
                                    } else if (_HoraIni < _HoraFinAnt) {

                                        new PNotify({
                                            title: 'Configuración de Horas Extras',
                                            text: 'Ingrese un Intervalo Correcto del Castigo #2',
                                            type: 'info',
                                            delay: 3000,
                                            styling: 'bootstrap3',
                                        });
                                        $('#time_ini_cast2').val('00:00');
                                        $('#time_fin_cast2').val('00:00');
                                        return;
                                    }
                                }
                            });

                            $('#time_apli_cast3').on('change', function () {
                                var _HoraIni = $('#time_ini_cast3').val();
                                var _HoraFinAnt = $('#time_fin_cast2').val();

                                if (_HoraIni == '00:00') {

                                } else if (_HoraIni < _HoraFinAnt) {

                                    new PNotify({
                                        title: 'Configuración de Horas Extras',
                                        text: 'Ingrese un Intervalo Correcto del Castigo #3',
                                        type: 'info',
                                        delay: 3000,
                                        styling: 'bootstrap3',
                                    });
                                    $('#time_ini_cast2').val('00:00');
                                    $('#time_ini_cast3').val('00:00');
                                    return;

                                }
                            });


                            /************************************************/


                            if (element.strCoReglaDet == 'TINICAST1') {

                                $('#time_ini_cast1').val(element.strPosibValor);


                            }

                            if (element.strCoReglaDet == 'TINICAST2') {

                                $('#time_ini_cast2').val(element.strPosibValor);



                            }

                            if (element.strCoReglaDet == 'TFINCAST1') {

                                $('#time_fin_cast1').val(element.strPosibValor);



                            }

                            if (element.strCoReglaDet == 'TFINCAST2') {

                                $('#time_fin_cast2').val(element.strPosibValor);


                            }

                            if (element.strCoReglaDet == 'TCASTMAS') {

                                $('#time_ini_cast3').val(element.strPosibValor);


                            }

                            if (element.strCoReglaDet == 'TCASTAPL1') {

                                $('#time_apli_cast1').val(element.strPosibValor);


                            }

                            if (element.strCoReglaDet == 'TCASTAPL2') {

                                $('#time_apli_cast2').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TCASTAPL3') {

                                $('#time_apli_cast3').val(element.strPosibValor);

                            }



                            //12.-Bloque A.2.1

                            ///FUNCION CRREADA PARA LLENAR LA TABLA DE CONFIG H.E  => LlenarTablaHE() ,FUERA DEL CARGAR DATOS

                            //13.-Bloque  A.2.2

                            if (element.strCoReglaDet == "FCCD") {

                                if (element.strValorRegla == "1") {

                                    $('#chck_FechaProc').iCheck('check');
                                    $('#chck_FechaReal').iCheck('uncheck');


                                } else if (element.strValorRegla == "0") {



                                    $('#chck_FechaProc').iCheck('uncheck');
                                    $('#chck_FechaReal').iCheck('check');


                                }
                            }

                            if (element.strCoReglaDet == "MCHE") {

                                $('#MetCal').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == "MCHE") {

                                $('#MetCal').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == "TMEAH") {

                                $('#time_HE_antes_hor').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == "TMEDH") {

                                $('#time_HE_despues_hor').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == "TMEDNL") {

                                $('#time_HE_durante_diasnolab').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == "TMAXHE") {

                                $('#time_Max_HE_Diario').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == 'ASUMHDES') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_asu_hora_ultdialab').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_asu_hora_ultdialab').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'QTREFHE') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_qui_time_refri').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_qui_time_refri').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'HEAUTOFERI') {

                                if (element.strPosibValor == "1") {

                                    $('#Hab_HE_AutoFer').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#Hab_HE_AutoFer').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'GENHEDN') {

                                if (element.strPosibValor == "1") {

                                    $('#chck_HE_Diu_Noct').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#chck_HE_Diu_Noct').iCheck('uncheck');

                                }
                            }

                            //14.-Bloque  A.2.2


                            if (element.strCoReglaDet == "HNHI") {

                                var termino = element.strPosibValor;


                                var Inicial = String(termino.substring(0, 1));

                                console.log(Inicial + ' <-->');

                                if (Inicial == '+') {


                                    var datoFinal = String(termino.substring(1, 6));
                                    console.log(datoFinal + ' <-->');

                                    $('#time_HN_HI').val(datoFinal);

                                    $('#time_HN_HI_DIA_SIG').iCheck('check');


                                } else if (Inicial !== '+') {

                                    $('#time_HN_HI').val(element.strPosibValor);

                                    $('#time_HN_HI_DIA_SIG').iCheck('uncheck');

                                }


                            }

                            if (element.strCoReglaDet == "HNHF") {



                                var termino2 = element.strPosibValor;


                                var Inicial2 = String(termino2.substring(0, 1));

                                console.log(Inicial2 + ' <-->');

                                if (Inicial2 == '+') {

                                    var datoFinal2 = String(termino2.substring(1, 6));

                                    console.log(datoFinal2 + ' <-->');

                                    $('#time_HN_HF').val(datoFinal2);

                                    $('#time_HN_HF_DIA_SIG').iCheck('check');


                                } else if (Inicial2 !== '+') {

                                    $('#time_HN_HF').val(element.strPosibValor);

                                    $('#time_HN_HF_DIA_SIG').iCheck('uncheck');

                                }


                            }


                            if (element.strCoReglaDet == 'HNHTRAB') {

                                if (element.strPosibValor == "1") {

                                    $('#time_HN_HT').iCheck('check');

                                } else if (element.strPosibValor == "0") {

                                    $('#time_HN_HT').iCheck('uncheck');

                                }
                            }

                            //15.-Bloque  A.3.1
                            if (element.strCoReglaDet == "AHE") {

                                $('#MetCalc').val(element.strPosibValor);
                            }
                            if (element.strCoReglaDet == 'PAHECOMP') {


                                if (element.strPosibValor == "1") {

                                    $('#chk_priori_change').iCheck('check');

                                    $('#chk_priori_change_A').iCheck('UNcheck');


                                } else if (element.strPosibValor == "0") {

                                    $('#chk_priori_change_A').iCheck('check');
                                    $('#chk_priori_change').iCheck('UNcheck');


                                }



                            }




                        });



                        if ($('#time_HN_HI').val() == '00:00' && $('#time_HN_HF').val() == '00:00' && $('#time_HN_HF_DIA_SIG').is(':checked') == false && $('#time_HN_HI_DIA_SIG').is(':checked') == false && $('#time_HN_HT').is(':checked') == false) {


                            $('#CHCK_BLOQUEO_CONFIG_HOR').iCheck('uncheck');

                            $('#time_HN_HI').attr('disabled', true);
                            $('#time_HN_HI_DIA_SIG').attr('disabled', true);
                            $('#time_HN_HF').attr('disabled', true);
                            $('#time_HN_HF_DIA_SIG').attr('disabled', true);
                            $('#time_HN_HT').attr('disabled', true);
                        } else

                            if ($('#time_HN_HI').val() !== '00:00' || $('#time_HN_HF').val() !== '00:00' || $('#time_HN_HF_DIA_SIG').is(':checked') == true || $('#time_HN_HI_DIA_SIG').is(':checked') == true || $('#time_HN_HT').is(':checked') == true) {


                                $('#CHCK_BLOQUEO_CONFIG_HOR').iCheck('check');



                            }


                    });



                $('#chck_cons_fer_hor').on('ifChanged', function () {


                    if ($('#chck_cons_fer_hor').is(':checked') == true) {

                        $('#ConsFal').attr('disabled', false);

                    }


                    if ($('#chck_cons_fer_hor').is(':checked') == false) {


                        $('#ConsFal').iCheck('uncheck');
                        $('#ConsFal').attr('disabled', true);


                    }



                });




                $('#CHCK_BLOQUEO_CONFIG_HOR').on('ifChanged', function () {



                    if ($('#CHCK_BLOQUEO_CONFIG_HOR').is(':checked') == false) {

                        $('#time_HN_HI').attr('disabled', true);
                        $('#time_HN_HI_DIA_SIG').attr('disabled', true);
                        $('#time_HN_HF').attr('disabled', true);
                        $('#time_HN_HF_DIA_SIG').attr('disabled', true);
                        $('#time_HN_HT').attr('disabled', true);


                        $('#time_HN_HI').val('00:00');
                        $('#time_HN_HI_DIA_SIG').iCheck('uncheck');
                        $('#time_HN_HF').val('00:00');
                        $('#time_HN_HF_DIA_SIG').iCheck('uncheck');
                        $('#time_HN_HT').iCheck('uncheck');


                    } else if ($('#CHCK_BLOQUEO_CONFIG_HOR').is(':checked') == true) {

                        $('#time_HN_HI').attr('disabled', false);
                        $('#time_HN_HI_DIA_SIG').attr('disabled', false);
                        $('#time_HN_HF').attr('disabled', false);
                        $('#time_HN_HF_DIA_SIG').attr('disabled', false);
                        $('#time_HN_HT').attr('disabled', false);


                    }

                });

            }


        });




}

    function LlenarTablaHE() {
    var DetalleHorasExtras = new Array();

    class DetalleConfigHoras {
        constructor(intIdRegNegHE , HorarioNorm, HorarioNoct, TipoDia, strHorarioNorm, strHorarioNoct, strTipoDia, TimeConfigHE, clave) {

            this.intIdRegNegHE = intIdRegNegHE
            this.HorarioNorm = HorarioNorm
            this.HorarioNoct = HorarioNoct
            this.TipoDia = TipoDia
            this.strHorarioNorm = strHorarioNorm
            this.strHorarioNoct = strHorarioNoct
            this.strTipoDia = strTipoDia
            this.TimeConfigHE = TimeConfigHE
            this.clave = clave


        }

    }


    var d = new Date();
    var n = d.getTime()



        var IDREGNEG = $('#IdRegNeg').val();

        $.post(
            '/Asistencia/ObtenerRegistroReglaNedocioConfigHE',
            { intIdReglaNeg: IDREGNEG },
            (response) => {

                console.log(response);
                response.forEach(element => {


                    DetalleHorasExtras.push(new DetalleConfigHoras(element.intIdRegNegHE,element.intIdConceptoDiurno, element.intIdConceptoNocturno, element.intTipoDia, element.strDesConcepto1, element.strDesConcepto2, element.strTipoDia, element.timeTiempo, n));

                    n = n + 2;

               if (typeof _varTablaConfigHECD !== 'undefined') {
        _varTablaConfigHECD.destroy();
    }


               _varTablaConfigHECD = $('#Config_Detalle_HESSS').DataTable({
        data: DetalleHorasExtras,
        columns: [

            { data: 'HorarioNorm' },
            { data: 'HorarioNoct' },
            { data: 'TipoDia' },
            { data: 'strTipoDia' },
            { data: 'strHorarioNorm' },
            { data: 'strHorarioNoct' },
            { data: 'TimeConfigHE' },
            { data: null },
            { data: 'clave' },


        ],
        order: [3, 'asc'],
        sDom: '',
        responsive: true,
        language: {
            lengthMenu: '',
            info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
            infoEmpty: 'No hay Items para mostrar',
            search: '',
            sSearchPlaceholder: '',
            zeroRecords: '',
            infoFiltered: 'No hay Items para mostrar',
            paginate: {
                previous: 'Anterior',
                next: 'Siguiente'
            }
        },
        columnDefs: [//ocultar y definir columnas
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
                targets: [2],
                visible: false,
                searchable: false
            },

            {
                targets: [7],
                data: null,
                defaultContent: '<input  type="button" class="btn btn-danger btn-xs btn-delete"  value="Quitar" />'
            },
            {
                targets: [8],
                visible: false,
                searchable: false
            }
        ],

        });

                    if (typeof _varTablaConfigHECDD !== 'undefined') {
                        _varTablaConfigHECDD.destroy();
                    }


                    _varTablaConfigHECDD = $('#Config_Detalle_HES').DataTable({
                        data: DetalleHorasExtras,
                        columns: [

                            { data: 'HorarioNorm' },
                            { data: 'HorarioNoct' },
                            { data: 'TipoDia' },
                            { data: 'TimeConfigHE' },
                            { data: 'intIdRegNegHE' },
                            { data: 'TimeConfigHE' },



                        ],
                        order: [0, 'asc'],
                        sDom: '',
                        responsive: true,
                        language: {
                            lengthMenu: '',
                            info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                            infoEmpty: 'No hay Items para mostrar',
                            search: '',
                            sSearchPlaceholder: '',
                            zeroRecords: '',
                            infoFiltered: '',
                            paginate: {
                                previous: 'Anterior',
                                next: 'Siguiente'
                            }
                        },
                        columnDefs: [//ocultar y definir columnas


                            {
                                targets: [5],
                                visible: false,
                                searchable: false
                            }
                        ],

                    });


                });


                $('#Config_Detalle_HESSS  tbody').on('click', 'tr input.btn-delete', function () {




                    var data = $(this).parents('li').next().html();


                    for (var i = 0; i < DetalleHorasExtras.length; i++) {

                        if (DetalleHorasExtras[i].clave == data * 1) {

                            DetalleHorasExtras.splice(i, 1);
                            //var claveInter = DetalleHorasExtras[i].clave;

                            //if (claveInter == detalleHoras[i].clave) {

                            //    detalleHoras.splice(i, 1);

                            //}
                        }

                    }





                    var data2 = $(this).parents('td').next().html();


                    for (var i = 0; i < DetalleHorasExtras.length; i++) {

                        if (DetalleHorasExtras[i].clave == data2 * 1) {

                            DetalleHorasExtras.splice(i, 1);
                            //////var claveInter = n;

                            //////if (claveInter == DetalleHorasExtras[i].clave) {

                            //////    detalleHoras.splice(i, 1);

                            //////}
                        }
                    }


                    if (typeof _varTablaConfigHECD !== 'undefined') {
                        _varTablaConfigHECD.destroy();
                    }


                    _varTablaConfigHECD = $('#Config_Detalle_HESSS').DataTable({
                        data: DetalleHorasExtras,
                        columns: [

                            { data: 'HorarioNorm' },
                            { data: 'HorarioNoct' },
                            { data: 'TipoDia' },
                            { data: 'strTipoDia' },
                            { data: 'strHorarioNorm' },
                            { data: 'strHorarioNoct' },
                            { data: 'TimeConfigHE' },
                            { data: null },
                            { data: 'clave' },


                        ],
                        order: [3, 'asc'],
                        sDom: '',
                        responsive: true,
                        language: {
                            lengthMenu: '',
                            info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                            infoEmpty: 'No hay Items para mostrar',
                            search: '',
                            sSearchPlaceholder: '',
                            zeroRecords: '',
                            infoFiltered: '',
                            paginate: {
                                previous: 'Anterior',
                                next: 'Siguiente'
                            }
                        },
                        columnDefs: [//ocultar y definir columnas
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
                                targets: [2],
                                visible: false,
                                searchable: false
                            },

                            {
                                targets: [7],
                                data: null,
                                defaultContent: '<input  type="button" class="btn btn-danger btn-xs btn-delete"  value="Quitar" />'
                            },
                            {
                                targets: [8],
                                visible: false,
                                searchable: false
                            }
                        ],

                    });



                    if (typeof _varTablaConfigHECDD !== 'undefined') {
                        _varTablaConfigHECDD.destroy();
                    }


                    _varTablaConfigHECDD = $('#Config_Detalle_HES').DataTable({
                        data: DetalleHorasExtras,
                        columns: [

                            { data: 'HorarioNorm' },
                            { data: 'HorarioNoct' },
                            { data: 'TipoDia' },
                            { data: 'TimeConfigHE' },
                            { data: 'intIdRegNegHE' },
                            { data: 'TimeConfigHE' },



                        ],
                        order: [0, 'asc'],
                        sDom: '',
                        responsive: true,
                        language: {
                            lengthMenu: '',
                            info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                            infoEmpty: 'No hay Items para mostrar',
                            search: '',
                            sSearchPlaceholder: '',
                            zeroRecords: '',
                            infoFiltered: '',
                            paginate: {
                                previous: 'Anterior',
                                next: 'Siguiente'
                            }
                        },
                        columnDefs: [//ocultar y definir columnas


                            {
                                targets: [5],
                                visible: false,
                                searchable: false
                            }
                        ],

                    });




                });



            });

    console.log(DetalleHorasExtras);


    ///Despues de Listado
        $('#UsoTolera').on('change', function () {
            var TipoDiaV = $('#UsoTolera option:selected').val();

            $.post(
                '/Asistencia/LlenarTipoUM',
                { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'REGNEG', strSubGrupo: 'HE' },
                (response) => {
                    $('#strTipoDiaV').empty();
                    response.forEach(element => {


                        if (element.intidTipo == TipoDiaV) {

                            $('#strTipoDiaV').val(element.strDeTipo);


                        }


                    });

                });
        });

        $('#chck_no_time').on('ifChanged', function () {

            if ($('#chck_no_time').is(':checked') == true) {

                $('#time_config_he').attr('disabled', true);
                $('#time_config_he').val('00:00');

            } else if ($('#chck_no_time').is(':checked') == false) {

                $('#time_config_he').attr('disabled', false);


            }
        });
        var escape_delete = 0;
        $('#btn_save_congig_he').on('click', function () {


            var HorarioNormV = $('#HorasExtras option:selected').val();
            var HorarioNoctV = $('#HorasExtrase option:selected').val();
            var TipoDiaV = $('#UsoTolera option:selected').val();
            var TimeConfigHEV = $('#time_config_he').val();



            var d = new Date();
            var n = d.getTime()

            if (HorarioNormV == 'Seleccione' || HorarioNoctV == 'Seleccione' || TipoDiaV == 'Seleccione' || TimeConfigHEV == '00:00') {

                if ($('#chck_no_time').is(':checked') == true) {

                } else if ($('#chck_no_time').is(':checked') == false) {

                    new PNotify({
                        title: 'Regla de Negocio',
                        text: 'Llene los campos Obligatorios',
                        type: 'info',
                        delay: 1000,
                        styling: 'bootstrap3',
                        addclass: 'dark'

                    });
                    return;
                }
            }

            if (HorarioNormV == 'Seleccione' || HorarioNoctV == 'Seleccione') {

                new PNotify({
                    title: 'Regla de Negocio',
                    text: 'Los Horarios no pueden estar vacios',
                    type: 'info',
                    delay: 1000,
                    styling: 'bootstrap3',
                    addclass: 'dark'

                });
                return;

            }

            class DetalleConfigHoras {
                constructor(intIdRegNegHE , HorarioNorm, HorarioNoct, TipoDia, strHorarioNorm, strHorarioNoct, strTipoDia, TimeConfigHE, clave) {

                    this.intIdRegNegHE = intIdRegNegHE
                    this.HorarioNorm = HorarioNorm
                    this.HorarioNoct = HorarioNoct
                    this.TipoDia = TipoDia
                    this.strHorarioNorm = strHorarioNorm
                    this.strHorarioNoct = strHorarioNoct
                    this.strTipoDia = strTipoDia
                    this.TimeConfigHE = TimeConfigHE
                    this.clave = clave


                }

            }

            //DetalleHorasExtras.filter(function (dato) {

            //    //if (_bitDiaSiq == false) {

            //    if (TipoDiaV == dato.TipoDia && dato.TimeConfigHE == '00:00') {

            //        //if (TimeConfigHE == '00:00') {

            //        //    if (MiniFin > MiniIni) {

            //        //    } else if (MiniIni > MiniFin) {
            //        //        Notify = 1;
            //        //        Valdes = 2;


            //        //        return;

            //        //    }

            //        //}

            //    }

            //});

            $('#strsalir').empty();


            for (var i = 0; i < DetalleHorasExtras.length; i++) {

                if (DetalleHorasExtras[i].TipoDia == TipoDiaV) {

                    if (DetalleHorasExtras[i].TimeConfigHE !== '00:00') {


                    } else if (DetalleHorasExtras[i].TimeConfigHE == '00:00') {



                        new PNotify({
                            title: 'Regla de Negocio',
                            text: 'Intervalo anterior Indefinido',
                            type: 'info',
                            delay: 1000,
                            styling: 'bootstrap3'

                        });
                        return;
                    }

                }

            }






            $.post(
                '/Asistencia/LlenarTipoUM',
                { strEntidad: 'TGHEXTRAS', intIdFiltroGrupo: 0, strGrupo: '', strSubGrupo: '' },
                (response) => {


                    response.forEach(element => {

                        if (element.intidTipo == HorarioNormV) {

                            $('#strHorarioNormV').val(element.strDeTipo);



                        } if (element.intidTipo == HorarioNoctV) {

                            $('#strHorarioNoctV').val(element.strDeTipo);



                        }

                    });




                    var strHorarioNormV = $('#strHorarioNormV').val();
                    var strHorarioNoctV = $('#strHorarioNoctV').val();
                    var strTipoDiaV = $('#strTipoDiaV').val();

                    DetalleHorasExtras.push(new DetalleConfigHoras(null,HorarioNormV, HorarioNoctV, TipoDiaV, strHorarioNormV, strHorarioNoctV, strTipoDiaV, TimeConfigHEV, n));




                    if (typeof _varTablaConfigHECD !== 'undefined') {
                        _varTablaConfigHECD.destroy();
                    }


                    _varTablaConfigHECD = $('#Config_Detalle_HESSS').DataTable({
                        data: DetalleHorasExtras,
                        columns: [

                            { data: 'HorarioNorm' },
                            { data: 'HorarioNoct' },
                            { data: 'TipoDia' },
                            { data: 'strTipoDia' },
                            { data: 'strHorarioNorm' },
                            { data: 'strHorarioNoct' },
                            { data: 'TimeConfigHE' },
                            { data: null },
                            { data: 'clave' },


                        ],
                        order: [3, 'asc'],
                        sDom: '',
                        responsive: true,
                        language: {
                            lengthMenu: '',
                            info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                            infoEmpty: 'No hay Items para mostrar',
                            search: '',
                            sSearchPlaceholder: '',
                            zeroRecords: '',
                            infoFiltered: '',
                            paginate: {
                                previous: 'Anterior',
                                next: 'Siguiente'
                            }
                        },
                        columnDefs: [//ocultar y definir columnas
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
                                targets: [2],
                                visible: false,
                                searchable: false
                            },

                            {
                                targets: [7],
                                data: null,
                                defaultContent: '<input  type="button" class="btn btn-danger btn-xs btn-delete"  value="Quitar" />'
                            },
                            {
                                targets: [8],
                                visible: false,
                                searchable: false
                            }
                        ],

                    });



                    if (typeof _varTablaConfigHECDD !== 'undefined') {
                        _varTablaConfigHECDD.destroy();
                    }


                    _varTablaConfigHECDD = $('#Config_Detalle_HES').DataTable({
                        data: DetalleHorasExtras,
                        columns: [

                            { data: 'HorarioNorm' },
                            { data: 'HorarioNoct' },
                            { data: 'TipoDia' },
                            { data: 'TimeConfigHE' },
                            { data: 'intIdRegNegHE' },
                            { data: 'TimeConfigHE' },



                        ],
                        order: [0, 'asc'],
                        sDom: '',
                        responsive: true,
                        language: {
                            lengthMenu: '',
                            info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                            infoEmpty: 'No hay Items para mostrar',
                            search: '',
                            sSearchPlaceholder: '',
                            zeroRecords: '',
                            infoFiltered: '',
                            paginate: {
                                previous: 'Anterior',
                                next: 'Siguiente'
                            }
                        },
                        columnDefs: [//ocultar y definir columnas


                            {
                                targets: [5],
                                visible: false,
                                searchable: false
                            }
                        ],

                    });



                });




            $('#Config_Detalle_HESSS  tbody').on('click', 'tr input.btn-delete', function () {





                var data = $(this).parents('li').next().html();


                for (var i = 0; i < DetalleHorasExtras.length; i++) {

                    if (DetalleHorasExtras[i].clave == data * 1) {

                        DetalleHorasExtras.splice(i, 1);
                        //var claveInter = DetalleHorasExtras[i].clave;

                        //if (claveInter == detalleHoras[i].clave) {

                        //    detalleHoras.splice(i, 1);

                        //}
                    }

                }





                var data2 = $(this).parents('td').next().html();


                for (var i = 0; i < DetalleHorasExtras.length; i++) {

                    if (DetalleHorasExtras[i].clave == data2 * 1) {

                        DetalleHorasExtras.splice(i, 1);
                        //////var claveInter = n;

                        //////if (claveInter == DetalleHorasExtras[i].clave) {

                        //////    detalleHoras.splice(i, 1);

                        //////}
                    }
                }



                if (typeof _varTablaConfigHECD !== 'undefined') {
                    _varTablaConfigHECD.destroy();
                }


                _varTablaConfigHECD = $('#Config_Detalle_HESSS').DataTable({
                    data: DetalleHorasExtras,
                    columns: [

                        { data: 'HorarioNorm' },
                        { data: 'HorarioNoct' },
                        { data: 'TipoDia' },
                        { data: 'strTipoDia' },
                        { data: 'strHorarioNorm' },
                        { data: 'strHorarioNoct' },
                        { data: 'TimeConfigHE' },
                        { data: null },
                        { data: 'clave' },


                    ],
                    order: [3, 'asc'],
                    sDom: '',
                    responsive: true,
                    language: {
                        lengthMenu: '',
                        info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                        infoEmpty: 'No hay Items para mostrar',
                        search: '',
                        sSearchPlaceholder: '',
                        zeroRecords: '',
                        infoFiltered: '',
                        paginate: {
                            previous: 'Anterior',
                            next: 'Siguiente'
                        }
                    },
                    columnDefs: [//ocultar y definir columnas
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
                            targets: [2],
                            visible: false,
                            searchable: false
                        },

                        {
                            targets: [7],
                            data: null,
                            defaultContent: '<input  type="button" class="btn btn-danger btn-xs btn-delete"  value="Quitar" />'
                        },
                        {
                            targets: [8],
                            visible: false,
                            searchable: false
                        }
                    ],

                });



                if (typeof _varTablaConfigHECDD !== 'undefined') {
                    _varTablaConfigHECDD.destroy();
                }


                _varTablaConfigHECDD = $('#Config_Detalle_HES').DataTable({
                    data: DetalleHorasExtras,
                    columns: [

                        { data: 'HorarioNorm' },
                        { data: 'HorarioNoct' },
                        { data: 'TipoDia' },
                        { data: 'TimeConfigHE' },
                        { data: 'intIdRegNegHE' },
                        { data: 'TimeConfigHE' },



                    ],
                    order: [0, 'asc'],
                    sDom: '',
                    responsive: true,
                    language: {
                        lengthMenu: '',
                        info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                        infoEmpty: 'No hay Items para mostrar',
                        search: '',
                        sSearchPlaceholder: '',
                        zeroRecords: '',
                        infoFiltered: '',
                        paginate: {
                            previous: 'Anterior',
                            next: 'Siguiente'
                        }
                    },
                    columnDefs: [//ocultar y definir columnas


                        {
                            targets: [5],
                            visible: false,
                            searchable: false
                        }
                    ],

                });




            });





        });



        $('#btn-delete-all').on('click', function () {

            if (DetalleHorasExtras.length > 0) {


            swal({
                title: "Eliminar Configuraciones ",
                text: "¿Está seguro de eliminar Todas las Configuraciones'?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "No, cancelar",
            }).then(function (isConfirm) {
                if (isConfirm) {


                    DetalleHorasExtras.length = 0;

                    if (typeof _varTablaConfigHECD !== 'undefined') {
                        _varTablaConfigHECD.destroy();
                    }


                    _varTablaConfigHECD = $('#Config_Detalle_HESSS').DataTable({
                        data: DetalleHorasExtras,
                        columns: [

                            { data: 'HorarioNorm' },
                            { data: 'HorarioNoct' },
                            { data: 'TipoDia' },
                            { data: 'strHorarioNorm' },
                            { data: 'strHorarioNoct' },
                            { data: 'strTipoDia' },
                            { data: 'TimeConfigHE' },
                            { data: null },
                            { data: 'clave' },


                        ],
                        order: [3, 'asc'],
                        sDom: '',
                        responsive: true,
                        language: {
                            lengthMenu: '',
                            info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                            infoEmpty: 'No hay Items para mostrar',
                            search: '',
                            sSearchPlaceholder: '',
                            zeroRecords: '',
                            infoFiltered: '',
                            paginate: {
                                previous: 'Anterior',
                                next: 'Siguiente'
                            }
                        },
                        columnDefs: [//ocultar y definir columnas
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
                                targets: [2],
                                visible: false,
                                searchable: false
                            },

                            {
                                targets: [7],
                                data: null,
                                defaultContent: '<input  type="button" class="btn btn-danger btn-xs btn-delete"  value="Quitar" />'
                            },
                            {
                                targets: [8],
                                visible: false,
                                searchable: false
                            }
                        ],

                    });



                    if (typeof _varTablaConfigHECDD !== 'undefined') {
                        _varTablaConfigHECDD.destroy();
                    }


                    _varTablaConfigHECDD = $('#Config_Detalle_HES').DataTable({
                        data: DetalleHorasExtras,
                        columns: [

                            { data: 'HorarioNorm' },
                            { data: 'HorarioNoct' },
                            { data: 'TipoDia' },
                            { data: 'TimeConfigHE' },
                            { data: 'intIdRegNegHE' },
                            { data: 'TimeConfigHE' },



                        ],
                        order: [0, 'asc'],
                        sDom: '',
                        responsive: true,
                        language: {
                            lengthMenu: '',
                            info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                            infoEmpty: 'No hay Items para mostrar',
                            search: '',
                            sSearchPlaceholder: '',
                            zeroRecords: '',
                            infoFiltered: '',
                            paginate: {
                                previous: 'Anterior',
                                next: 'Siguiente'
                            }
                        },
                        columnDefs: [//ocultar y definir columnas


                            {
                                targets: [5],
                                visible: false,
                                searchable: false
                            }
                        ],

                    });


                    return;

                } else {
                    swal("Cancelado", "La Operación fue cancelada", "error");
                }
            });


            } else if (DetalleHorasExtras.length  == 0) {

            }

        });





}

    function CamposAdicionalesReglaNegocio() {

    $.post(
        '/Asistencia/CamposAdicionales',
        { strEntidad: 'TGREGLANEG' },
        (response) => {

            console.log(response);
            $('#containerCampose').empty();
            response.forEach(element => {

                $('#containerCampose').append(
                    ' <div class="col-md-6 col-sm-6 col-xs-6"><div class="form-group"><label> ' + element.strTitulo
                    + '</label><input id="' + element.strNomCampo + '" type="text" class="form-control " placeholder="Campo Adicional" maxlength="255"/>' + '</div></div>');


            });
        });
}

    var _varTablaConfigHE;

    var _varTablaConfigHES;

    $('#btn-new-ReglaNegocio').click('click', function () {
        $('.form-hide-ReglaNegocio').show();
        $('#btn-update-ReglaNegocio').hide();
        $('#btn-save-change-ReglaNegocio').show();
        var escape_delete = 0;
        $.post(
            '/Asistencia/NuevoReglaNegocio',
            {},
            (response) => {
                if (response !== '') {
                    $('.form-hide-ReglaNegocio .x_content').empty();
                    $('.form-hide-ReglaNegocio .x_content').html(response);
                    $('.form-hide-ReglaNegocio').show();

                    init_checkBox_styles();
                    init_SmartWizard();


                    var DetalleHorasExtras = new Array();


                }

                var intidRegNeg = 1;

                $.post(
                    '/Asistencia/ObtenerRegistroReglaNedocio',
                    { intIdReglaNeg: intidRegNeg},
                    (response) => {
                        console.log(response);
                        response.forEach(element => {


                            // 1.-Bloque  A.1.1
                            if (element.strCoReglaDet == 'AVPM') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_valid_pri_marca').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_valid_pri_marca').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'PVALIDREF') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_valid_marca_refri').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_valid_marca_refri').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'PASMAREF') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_asumir_Marcar_MI').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_asumir_Marcar_MI').iCheck('uncheck');

                                }
                            }

                            //2.-Bloque A.1.1


                            if (element.strCoReglaDet == 'TMINHTREF') {


                                $('#TimeMinHTDsctRefri').val(element.strPosibValor);

                            }


                            if (element.strCoReglaDet == 'TVALIDREF') {


                                $('#TimeMinValidMarCRefri').val(element.strPosibValor);

                            }


                            if (element.strCoReglaDet == 'TREFDIADES') {


                                $('#TimeDsctRefriDiaDesca').val(element.strPosibValor);

                            }

                            //3.-Bloque A.1.1

                            if (element.strCoReglaDet == 'ABO') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_Valida_Bon').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_Valida_Bon').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'DINIPLANHO') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_config_dia_ini').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_config_dia_ini').iCheck('uncheck');
                                }
                            }


                            if (element.strCoReglaDet == 'ASIGM') {

                                if (element.strPosibValor == "true") {

                                    $('#Vali_Asig_marc').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#Vali_Asig_marc').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'PEXCEP') {

                                if (element.strPosibValor == "true") {

                                    $('#Cons_Exc_SinCargo').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#Cons_Exc_SinCargo').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'FSH') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_cons_fer_hor').iCheck('check');

                                }
                                else if (element.strPosibValor == "false") {

                                    $('#chck_cons_fer_hor').iCheck('uncheck');
                                }
                            }


                                $('#chck_cons_fer_hor').on('ifchange', function () {



                                    if ($('#chck_cons_fer_hor').is(':checked') == false) {

                                        $('#ConsFal').attr('disabled', true);

                                        $('#ConsFal').iCheck('uncheck');

                                    } if ($('#chck_cons_fer_hor').is(':checked') == true) {

                                        $('#ConsFal').attr('disabled', false);


                                    }

                                });

                                if ($('#chck_cons_fer_hor').is(':checked') == false) {

                                    $('#ConsFal').attr('disabled', true);

                                    $('#ConsFal').iCheck('uncheck');

                                } if ($('#chck_cons_fer_hor').is(':checked') == true) {

                                    $('#ConsFal').attr('disabled', false);


                                }





                            if (element.strCoReglaDet == 'FEF') {

                                if (element.strPosibValor == "true") {

                                    $('#ConsFal').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#ConsFal').iCheck('uncheck');

                                }
                            }


                            //4.-Bloque A.1.2


                            if (element.strCoReglaDet == 'TING') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_Tar_Ing_Tole').iCheck('check');
                                    $('#chck_Tar_Tole').iCheck('uncheck');


                                } else if (element.strPosibValor == "false") {


                                    $('#chck_Tar_Tole').iCheck('check');
                                    $('#chck_Tar_Ing_Tole').iCheck('UNcheck');



                                }
                            }


                            if (element.strCoReglaDet == 'TREF') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_Tar_Refr_Tole').iCheck('check');
                                    $('#chck_Tar_Tole_xd').iCheck('uncheck');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_Tar_Refr_Tole').iCheck('check');
                                    $('#chck_Tar_Tole_xd').iCheck('uncheck');

                                }

                            }

                            //5.-Bloque A.1.2

                            if (element.strCoReglaDet == 'TIPOTOL') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_PorSemana').iCheck('check');
                                    $('#chck_PorPeriodo').iCheck('uncheck');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_PorPeriodo').iCheck('check');
                                    $('#chck_PorSemana').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'FORMTOL') {

                                $('#UsoTole').val(element.strPosibValor);
                                $('#UsoTole').on('change', function () {

                                    var VARI = $('#UsoTole').val();

                                    if (VARI == 107) {

                                        $('#change_state_TipoTole').html('<input type="time" id="DscTole" class="form-control" min="00:00" max="24:00" accept="hh:mm" value="00:00">');

                                    } else if (VARI == 108) {

                                        $('#change_state_TipoTole').html('<input type="number" id="DscTole" class="form-control" value="0">');


                                    }

                                });

                                var VARI = $('#UsoTole').val();

                                if (VARI == 107) {

                                    $('#change_state_TipoTole').html('<input type="time" id="DscTole" class="form-control" min="00:00" max="24:00" accept="hh:mm" value="00:00">');

                                } else if (VARI == 108) {

                                    $('#change_state_TipoTole').html('<input type="number" id="DscTole" class="form-control" value="0">');


                                }
                            }

                            if (element.strCoReglaDet == 'TMAXTOL') {

                                $('#DscTole').val(element.strPosibValor);



                            }

                            if (element.strCoReglaDet == 'GENTOLTAR') {

                                if (element.strPosibValor == "on") {

                                    $('#chck_GeneTar_MaxTol').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_GeneTar_MaxTol').iCheck('uncheck');

                                }
                            }

                            //6.-Bloque A.1.2

                            if (element.strCoReglaDet == 'CJD') {

                                if (element.strPosibValor == "true") {

                                    $('#ConsAusJustDiaria').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#ConsAusJustDiaria').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'CDF') {

                                if (element.strPosibValor == "true") {

                                    $('#ConsFeriSinAsis').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#ConsFeriSinAsis').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'HTDOM') {

                                if (element.strPosibValor > '00:00') {

                                    $('#chk_cons_dom').iCheck('check');

                                } else if (element.strPosibValor == '00:00') {

                                    $('#chk_cons_dom').iCheck('uncheck');

                                }


                                $('#time_chk_cons_dom').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TMAXREF') {



                                if (element.strPosibValor > '00:00') {

                                    $('#chck_con_refr_max').iCheck('check');

                                } else if (element.strPosibValor == '00:00') {

                                    $('#chck_con_refr_max').iCheck('uncheck');

                                }

                                $('#time_chck_con_refr_max').val(element.strPosibValor);


                            }

                            if (element.strCoReglaDet == 'TCASTMIREF') {


                                if (element.strPosibValor > '00:00') {

                                    $('#chck_dsct_no_marcar').iCheck('check');

                                } else if (element.strPosibValor == '00:00') {

                                    $('#chck_dsct_no_marcar').iCheck('uncheck');

                                }


                                $('#time_chck_dsct_no_marcar').val(element.strPosibValor);

                            }


                            //7.-Bloque A.1.3

                            if (element.strCoReglaDet == 'TMAH') {

                                $('#time_min_antes_hor').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TMDH') {

                                $('#time_min_despues_hor').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TMDNL') {

                                $('#time_min_durante_diaslab').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'PHAJUST') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_dias_just').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_dias_just').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'PREF') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_per_refr').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_per_refr').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'TMREF') {

                                $('#time_chck_per_refr').val(element.strPosibValor);
                            }

                            //8.-Bloque A.1.3

                            if (element.strCoReglaDet == 'DTR') {

                                $('#Time_TE_ConsiDTrab').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TMHADT') {

                                $('#Time_HA_Efect_ConsDT').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'ADTRAB') {

                                $('#chck_Sabado').iCheck('uncheck');
                                $('#chck_Domingo').iCheck('uncheck');
                                $('#chck_DiaFer').iCheck('uncheck');
                                $('#chck_DiaDesc').iCheck('uncheck');

                                if (element.strPosibValor.includes('SAB') == true) {

                                    $('#chck_Sabado').iCheck('check');

                                } if (element.strPosibValor.includes('DOM') == true) {

                                    $('#chck_Domingo').iCheck('check');

                                } if (element.strPosibValor.includes('FER') == true) {

                                    $('#chck_DiaFer').iCheck('check');

                                } if (element.strPosibValor.includes('DESC') == true) {

                                    $('#chck_DiaDesc').iCheck('check');

                                }

                            }



                            //9.-Bloque A.1.4

                            if (element.strCoReglaDet == 'CHORARIO') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_Con_Hor').iCheck('check');
                                    $('#chck_Sin_Hor').iCheck('uncheck');


                                } else if (element.strPosibValor == "false") {

                                    $('#chck_Con_Hor').iCheck('uncheck');
                                    $('#chck_Sin_Hor').iCheck('check');

                                }
                            }


                            if (element.strCoReglaDet == 'TRABAMA') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_trab_amanecida').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_trab_amanecida').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'PTAREOS') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_proc_tareo').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_proc_tareo').iCheck('uncheck');

                                }
                            }

                            //10.-Bloque A.1.4

                            if (element.strCoReglaDet == 'HGESMIREF') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_marc_incom_refr').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_marc_incom_refr').iCheck('uncheck');

                                }
                            }


                            if (element.strCoReglaDet == 'THOLINIREF') {

                                $('#time_ini_chck_marc_incom_refr').val(element.strPosibValor);

                            }


                            if (element.strCoReglaDet == 'THOLFINREF') {

                                $('#time_fin_chck_marc_incom_refr').val(element.strPosibValor);

                            }

                            //11.-Bloque A.1.4

                            if (element.strCoReglaDet == 'ACASTXTI') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_apli_catigo').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_apli_catigo').iCheck('uncheck');

                                }
                            }

                            /************************************************/
                            $('#chck_apli_catigo').on('ifChanged', function () {

                                if ($('#chck_apli_catigo').is(':checked') == false) {

                                    $('#time_ini_cast1').attr('disabled', true);
                                    $('#time_ini_cast1').val('00:00');
                                    $('#time_ini_cast2').attr('disabled', true);
                                    $('#time_ini_cast2').val('00:00');
                                    $('#time_ini_cast3').attr('disabled', true);
                                    $('#time_ini_cast3').val('00:00');
                                    $('#time_fin_cast1').attr('disabled', true);
                                    $('#time_fin_cast1').val('00:00');
                                    $('#time_fin_cast2').attr('disabled', true);
                                    $('#time_fin_cast2').val('00:00');
                                    $('#time_apli_cast1').attr('disabled', true);
                                    $('#time_apli_cast1').val('00:00');
                                    $('#time_apli_cast2').attr('disabled', true);
                                    $('#time_apli_cast2').val('00:00');
                                    $('#time_apli_cast3').attr('disabled', true);
                                    $('#time_apli_cast3').val('00:00');

                                } if ($('#chck_apli_catigo').is(':checked') == true) {

                                    $('#time_ini_cast1').attr('disabled', false);
                                    $('#time_ini_cast2').attr('disabled', false);
                                    $('#time_ini_cast3').attr('disabled', false);
                                    $('#time_fin_cast1').attr('disabled', false);
                                    $('#time_fin_cast2').attr('disabled', false);
                                    $('#time_apli_cast1').attr('disabled', false);
                                    $('#time_apli_cast2').attr('disabled', false);
                                    $('#time_apli_cast3').attr('disabled', false);


                                }
                            });
                            if ($('#chck_apli_catigo').is(':checked') == false) {

                                $('#time_ini_cast1').attr('disabled', true);
                                $('#time_ini_cast1').val('00:00');
                                $('#time_ini_cast2').attr('disabled', true);
                                $('#time_ini_cast2').val('00:00');
                                $('#time_ini_cast3').attr('disabled', true);
                                $('#time_ini_cast3').val('00:00');
                                $('#time_fin_cast1').attr('disabled', true);
                                $('#time_fin_cast1').val('00:00');
                                $('#time_fin_cast2').attr('disabled', true);
                                $('#time_fin_cast2').val('00:00');
                                $('#time_apli_cast1').attr('disabled', true);
                                $('#time_apli_cast1').val('00:00');
                                $('#time_apli_cast2').attr('disabled', true);
                                $('#time_apli_cast2').val('00:00');
                                $('#time_apli_cast3').attr('disabled', true);
                                $('#time_apli_cast3').val('00:00');

                            }


                            $('#time_apli_cast1').on('change', function () {
                                var _HoraIni = $('#time_ini_cast1').val();
                                var _HoraFin = $('#time_fin_cast1').val();

                                if (_HoraFin == '00:00') {

                                } else if (_HoraFin !== '00:00') {
                                    if (_HoraIni <= _HoraFin) {
                                        return;
                                    } else if (_HoraIni > _HoraFin) {

                                        new PNotify({
                                            title: 'Configuración de Horas Extras',
                                            text: 'Ingrese un Intervalo Correcto del Castigo #1',
                                            type: 'info',
                                            delay: 3000,
                                            styling: 'bootstrap3',
                                        });
                                        $('#time_ini_cast1').val('00:00');
                                        $('#time_fin_cast1').val('00:00');

                                        return;
                                    }
                                }
                            });


                            $('#time_apli_cast2').on('change', function () {
                                var _HoraIni = $('#time_ini_cast2').val();
                                var _HoraFin = $('#time_fin_cast2').val();
                                var _HoraFinAnt = $('#time_fin_cast1').val();

                                if (_HoraFin == '00:00') {

                                } else if (_HoraFin !== '00:00') {
                                    if (_HoraIni <= _HoraFin) {
                                        return;
                                    } else if (_HoraIni > _HoraFin) {

                                        new PNotify({
                                            title: 'Configuración de Horas Extras',
                                            text: 'Ingrese un Intervalo Correcto del Castigo #2',
                                            type: 'info',
                                            delay: 3000,
                                            styling: 'bootstrap3',
                                        });
                                        $('#time_ini_cast2').val('00:00');
                                        $('#time_fin_cast2').val('00:00');
                                        return;
                                    } else if (_HoraIni < _HoraFinAnt) {

                                        new PNotify({
                                            title: 'Configuración de Horas Extras',
                                            text: 'Ingrese un Intervalo Correcto del Castigo #2',
                                            type: 'info',
                                            delay: 3000,
                                            styling: 'bootstrap3',
                                        });
                                        $('#time_ini_cast2').val('00:00');
                                        $('#time_fin_cast2').val('00:00');
                                        return;
                                    }
                                }
                            });

                            $('#time_apli_cast3').on('change', function () {
                                var _HoraIni = $('#time_ini_cast3').val();
                                var _HoraFinAnt = $('#time_fin_cast2').val();

                                if (_HoraIni == '00:00') {

                                } else if (_HoraIni < _HoraFinAnt) {

                                    new PNotify({
                                        title: 'Configuración de Horas Extras',
                                        text: 'Ingrese un Intervalo Correcto del Castigo #3',
                                        type: 'info',
                                        delay: 3000,
                                        styling: 'bootstrap3',
                                    });
                                    $('#time_ini_cast2').val('00:00');
                                    $('#time_ini_cast3').val('00:00');
                                    return;

                                }
                            });


                            /************************************************/



                            if (element.strCoReglaDet == 'TINICAST1') {

                                $('#time_ini_cast1').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TINICAST2') {

                                $('#time_ini_cast2').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TFINCAST1') {

                                $('#time_fin_cast1').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TFINCAST2') {

                                $('#time_fin_cast2').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TCASTMAS') {

                                $('#time_ini_cast3').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TCASTAPL1') {

                                $('#time_apli_cast1').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TCASTAPL2') {

                                $('#time_apli_cast2').val(element.strPosibValor);

                            }

                            if (element.strCoReglaDet == 'TCASTAPL3') {

                                $('#time_apli_cast3').val(element.strPosibValor);

                            }

                            //12.-Bloque A.2.1

                            ///FUNCION CRREADA PARA LLENAR LA TABLA DE CONFIG H.E  => LlenarTablaHE() ,FUERA DEL CARGAR DATOS

                            //13.-Bloque  A.2.2

                            if (element.strCoReglaDet == "FCCD") {

                                if (element.strValorRegla == "1") {

                                    $('#chck_FechaProc').iCheck('check');
                                    $('#chck_FechaReal').iCheck('uncheck');


                                } else if (element.strValorRegla == "0") {



                                    $('#chck_FechaProc').iCheck('uncheck');
                                    $('#chck_FechaReal').iCheck('check');


                                }
                            }

                            if (element.strCoReglaDet == "MCHE") {

                                $('#MetCal').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == "MCHE") {

                                $('#MetCal').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == "TMEAH") {

                                $('#time_HE_antes_hor').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == "TMEDH") {

                                $('#time_HE_despues_hor').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == "TMEDNL") {

                                $('#time_HE_durante_diasnolab').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == "TMAXHE") {

                                $('#time_Max_HE_Diario').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == 'ASUMHDES') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_asu_hora_ultdialab').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_asu_hora_ultdialab').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'QTREFHE') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_qui_time_refri').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_qui_time_refri').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'HEAUTOFERI') {

                                if (element.strPosibValor == "true") {

                                    $('#Hab_HE_AutoFer').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#Hab_HE_AutoFer').iCheck('uncheck');

                                }
                            }

                            if (element.strCoReglaDet == 'GENHEDN') {

                                if (element.strPosibValor == "true") {

                                    $('#chck_HE_Diu_Noct').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#chck_HE_Diu_Noct').iCheck('uncheck');

                                }
                            }

                            //14.-Bloque  A.2.2
                            if (element.strCoReglaDet == "HNHI") {

                                $('#time_HN_HI').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == "HNHF") {

                                $('#time_HN_HF').val(element.strPosibValor);
                            }

                            if (element.strCoReglaDet == 'HNHTRAB') {

                                if (element.strPosibValor == "true") {

                                    $('#time_HN_HT').iCheck('check');

                                } else if (element.strPosibValor == "false") {

                                    $('#time_HN_HT').iCheck('uncheck');

                                }
                            }

                            //15.-Bloque  A.3.1
                            if (element.strCoReglaDet == "AHE") {

                                $('#MetCalc').val(element.strPosibValor);
                            }
                            if (element.strCoReglaDet == 'PAHECOMP') {


                                if (element.strPosibValor == "true") {

                                    $('#chk_priori_change').iCheck('check');

                                    $('#chk_priori_change_A').iCheck('UNcheck');


                                } else if (element.strPosibValor == "false") {

                                    $('#chk_priori_change_A').iCheck('check');
                                    $('#chk_priori_change').iCheck('UNcheck');


                                }



                            }
                            $('#CHCK_BLOQUEO_CONFIG_HOR').iCheck('uncheck');

                            if ($('#CHCK_BLOQUEO_CONFIG_HOR').is(':checked') == false) {

                                $('#time_HN_HI').attr('disabled', true);
                                $('#time_HN_HI_DIA_SIG').attr('disabled', true);
                                $('#time_HN_HF').attr('disabled', true);
                                $('#time_HN_HF_DIA_SIG').attr('disabled', true);
                                $('#time_HN_HT').attr('disabled', true);


                            } else if ($('#CHCK_BLOQUEO_CONFIG_HOR').is(':checked') == true) {

                                $('#time_HN_HI').attr('disabled', false);
                                $('#time_HN_HI_DIA_SIG').attr('disabled', false);
                                $('#time_HN_HF').attr('disabled', false);
                                $('#time_HN_HF_DIA_SIG').attr('disabled', false);
                                $('#time_HN_HT').attr('disabled', false);
                            }

                            $('#CHCK_BLOQUEO_CONFIG_HOR').on('ifChanged', function () {



                                if ($('#CHCK_BLOQUEO_CONFIG_HOR').is(':checked') == false) {

                                    $('#time_HN_HI').attr('disabled', true);
                                    $('#time_HN_HI_DIA_SIG').attr('disabled', true);
                                    $('#time_HN_HF').attr('disabled', true);
                                    $('#time_HN_HF_DIA_SIG').attr('disabled', true);
                                    $('#time_HN_HT').attr('disabled', true);


                                    $('#time_HN_HI').val('00:00');
                                    $('#time_HN_HI_DIA_SIG').iCheck('uncheck');
                                    $('#time_HN_HF').val('00:00');
                                    $('#time_HN_HF_DIA_SIG').iCheck('uncheck');
                                    $('#time_HN_HT').iCheck('uncheck');


                                } else if ($('#CHCK_BLOQUEO_CONFIG_HOR').is(':checked') == true) {

                                    $('#time_HN_HI').attr('disabled', false);
                                    $('#time_HN_HI_DIA_SIG').attr('disabled', false);
                                    $('#time_HN_HF').attr('disabled', false);
                                    $('#time_HN_HF_DIA_SIG').attr('disabled', false);
                                    $('#time_HN_HT').attr('disabled', false);

                                }

                            });


                        });
                        switcheryLoad();




                    });


                $('#UsoTolera').on('change', function () {
                    var TipoDiaV = $('#UsoTolera option:selected').val();

                    $.post(
                        '/Asistencia/LlenarTipoUM',
                        { strEntidad: 'TGTIPO', intIdFiltroGrupo: 0, strGrupo: 'REGNEG', strSubGrupo: 'HE' },
                        (response) => {
                            $('#strTipoDiaV').empty();
                            response.forEach(element => {


                                if (element.intidTipo == TipoDiaV) {

                                    $('#strTipoDiaV').val(element.strDeTipo);


                                }


                            });

                        });
                });

                $('#chck_cons_fer_hor').on('ifChanged', function () {


                    if ($('#chck_cons_fer_hor').is(':checked') == true) {

                                  $('#ConsFal').attr('disabled', false);

                             }


                    if ($('#chck_cons_fer_hor').is(':checked') == false) {


                                 $('#ConsFal').iCheck('uncheck');
                                 $('#ConsFal').attr('disabled', true);


                              }



                        });

                $('#chck_no_time').on('ifChanged', function () {

                    if ($('#chck_no_time').is(':checked') == true) {

                        $('#time_config_he').attr('disabled', true);
                        $('#time_config_he').val('00:00');

                    } else if ($('#chck_no_time').is(':checked') == false) {

                        $('#time_config_he').attr('disabled', false);


                    }
                });

                $('#btn_save_congig_he').click('click', function () {
                   var escape_delete = 0;

                 var HorarioNormV  =   $('#HorasExtras option:selected').val();
                 var HorarioNoctV =   $('#HorasExtrase option:selected').val();
                 var TipoDiaV      =   $('#UsoTolera option:selected').val();
                 var TimeConfigHEV = $('#time_config_he').val();



                    var d = new Date();
                    var n = d.getTime()

                    if (HorarioNormV == 'Seleccione' || HorarioNoctV == 'Seleccione' || TipoDiaV == 'Seleccione' || TimeConfigHEV == '00:00')  {

                        if ($('#chck_no_time').is(':checked') == true) {

                        } else if ($('#chck_no_time').is(':checked') == false) {

                            new PNotify({
                                title: 'Regla de Negocio',
                                text: 'Llene los campos Obligatorios',
                                type: 'info',
                                delay: 1000,
                                styling: 'bootstrap3',
                                addclass: 'dark'

                            });


                            return;
                        }
                    }

                    if (HorarioNormV == 'Seleccione' || HorarioNoctV == 'Seleccione') {

                        new PNotify({
                            title: 'Regla de Negocio',
                            text: 'Los Horarios no pueden estar vacios',
                            type: 'info',
                            delay: 1000,
                            styling: 'bootstrap3',
                                addclass: 'dark'
                        });
                        return;

                    }

                    class DetalleConfigHoras {
                        constructor(intIdRegNegHE,HorarioNorm, HorarioNoct, TipoDia, strHorarioNorm, strHorarioNoct, strTipoDia, TimeConfigHE, clave) {

                            this.intIdRegNegHE = intIdRegNegHE
                            this.HorarioNorm = HorarioNorm
                            this.HorarioNoct = HorarioNoct
                            this.TipoDia = TipoDia
                            this.strHorarioNorm = strHorarioNorm
                            this.strHorarioNoct = strHorarioNoct
                            this.strTipoDia = strTipoDia
                            this.TimeConfigHE = TimeConfigHE
                            this.clave = clave


                        }

                    }

                    $('#strsalir').empty();


                    for (var i = 0; i < DetalleHorasExtras.length; i++) {

                        if (DetalleHorasExtras[i].TipoDia == TipoDiaV) {

                            if (DetalleHorasExtras[i].TimeConfigHE !== '00:00') {


                            } else if (DetalleHorasExtras[i].TimeConfigHE == '00:00') {



                                new PNotify({
                                    title: 'Regla de Negocio',
                                    text: 'Intervalo anterior Indefinido',
                                    type: 'info',
                                    delay: 1000,
                                    styling: 'bootstrap3'

                                });
                                return;
                            }

                        }

                    }

                           $.post(
                               '/Asistencia/LlenarTipoUM',
                        { strEntidad: 'TGHEXTRAS', intIdFiltroGrupo: 0, strGrupo: '', strSubGrupo: '' },
                               (response) => {
                                  response.forEach(element => {

                                      if (element.intidTipo == HorarioNormV) {

                                          $('#strHorarioNormV').val(element.strDeTipo);



                                      }  if (element.intidTipo == HorarioNoctV) {

                                          $('#strHorarioNoctV').val(element.strDeTipo);



                                      }

                            });


                                   //$.post(
                                   //    '/Asistencia/LlenarTipoUM',
                                   //    { strEntidad: 'TGHEXTRAS', intIdFiltroGrupo: 0, strGrupo: '', strSubGrupo: '' },
                                   //    (response) => {
                                   //        response.forEach(element => {{}}

                            var strHorarioNormV = $('#strHorarioNormV').val();
                            var strHorarioNoctV = $('#strHorarioNoctV').val();
                            var strTipoDiaV = $('#strTipoDiaV').val();

                            DetalleHorasExtras.push(new DetalleConfigHoras(null,HorarioNormV, HorarioNoctV, TipoDiaV, strHorarioNormV, strHorarioNoctV, strTipoDiaV, TimeConfigHEV, n));




                                   if (typeof _varTablaConfigHE !== 'undefined') {
                                       _varTablaConfigHE.destroy();
                                   }


                                   _varTablaConfigHE = $('#Config_Detalle_HE').DataTable({
                                       data: DetalleHorasExtras,
                                       columns: [

                                           { data: 'HorarioNorm' },
                                           { data: 'HorarioNoct' },
                                           { data: 'TipoDia' },
                                           { data: 'strTipoDia' },
                                           { data: 'strHorarioNorm' },
                                           { data: 'strHorarioNoct' },
                                           { data: 'TimeConfigHE' },
                                           { data: null },
                                           { data: 'clave' },


                                       ],
                                       order: [3, 'asc'],
                                       sDom: '',
                                       responsive: true,
                                       language: {
                                           lengthMenu: '',
                                           info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                           infoEmpty: 'No hay Items para mostrar',
                                           search: '',
                                           sSearchPlaceholder: '',
                                           zeroRecords: '',
                                           infoFiltered: '',
                                           paginate: {
                                               previous: 'Anterior',
                                               next: 'Siguiente'
                                           }
                                       },
                                       columnDefs: [//ocultar y definir columnas
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
                                               targets: [2],
                                               visible: false,
                                               searchable: false
                                           },

                                           {
                                               targets: [7],
                                               data: null,
                                               defaultContent: '<input  type="button" class="btn btn-danger btn-xs btn-delete"  value="Quitar" />'
                                           },
                                           {
                                               targets: [8],
                                               visible: false,
                                               searchable: false
                                           }
                                       ],

                                   });



                                   if (typeof _varTablaConfigHES !== 'undefined') {
                                       _varTablaConfigHES.destroy();
                                   }


                                   _varTablaConfigHES = $('#Config_Detalle_HES').DataTable({
                                       data: DetalleHorasExtras,
                                       columns: [

                                           { data: 'HorarioNorm' },
                                           { data: 'HorarioNoct' },
                                           { data: 'TipoDia' },
                                           { data: 'TimeConfigHE' },
                                           { data: 'TimeConfigHE' },
                                           { data: 'TimeConfigHE' },



                                       ],
                                       order: [0, 'asc'],
                                       sDom: '',
                                       responsive: true,
                                       language: {
                                           lengthMenu: '',
                                           info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                           infoEmpty: 'No hay Items para mostrar',
                                           search: '',
                                           sSearchPlaceholder: '',
                                           zeroRecords: '',
                                           infoFiltered: '',
                                           paginate: {
                                               previous: 'Anterior',
                                               next: 'Siguiente'
                                           }
                                       },
                                       columnDefs: [//ocultar y definir columnas


                                           {
                                               targets: [5],
                                               visible: false,
                                               searchable: false
                                           }
                                       ],

                                   });



                        });







                    $('#Config_Detalle_HE  tbody').on('click','tr .btn-delete' ,function () {



                        var data = $(this).parents('li').next().html();


                        for (var i = 0; i < DetalleHorasExtras.length; i++) {

                            if (DetalleHorasExtras[i].clave == data * 1) {

                                DetalleHorasExtras.splice(i, 1);
                                //var claveInter = DetalleHorasExtras[i].clave;

                                //if (claveInter == detalleHoras[i].clave) {

                                //    detalleHoras.splice(i, 1);

                                //}
                            }

                        }





                        var data2 = $(this).parents('td').next().html();


                        for (var i = 0; i < DetalleHorasExtras.length; i++) {

                            if (DetalleHorasExtras[i].clave == data2 * 1) {

                                DetalleHorasExtras.splice(i, 1);
                                //////var claveInter = n;

                                //////if (claveInter == DetalleHorasExtras[i].clave) {

                                //////    detalleHoras.splice(i, 1);

                                //////}
                            }
                        }



                        //////var data1 = _varTablaConfigHES.row($(this).parents('tr')).data();



                        ////////if (escape_delete == '0') {
                        //////    for (var i = 0; i < DetalleHorasExtras.length; i++) {

                        //////        if (DetalleHorasExtras[i].clave == data1.clave) {

                        //////            DetalleHorasExtras.splice(i, 1);

                        //////            //escape_delete = 4;

                        //////            return;
                        //////        }
                        //////    }
                        ////////}



                        if (typeof _varTablaConfigHE !== 'undefined') {
                            _varTablaConfigHE.destroy();
                        }


                        _varTablaConfigHE = $('#Config_Detalle_HE').DataTable({
                            data: DetalleHorasExtras,
                            columns: [

                                { data: 'HorarioNorm' },
                                { data: 'HorarioNoct' },
                                { data: 'TipoDia' },
                                { data: 'strTipoDia' },
                                { data: 'strHorarioNorm' },
                                { data: 'strHorarioNoct' },
                                { data: 'TimeConfigHE' },
                                { data: null },
                                { data: 'clave' },


                            ],
                            order: [3, 'asc'],
                            sDom: '',
                            responsive: true,
                            language: {
                                lengthMenu: '',
                                info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                infoEmpty: 'No hay Items para mostrar',
                                search: '',
                                sSearchPlaceholder: '',
                                zeroRecords: '',
                                infoFiltered: '',
                                paginate: {
                                    previous: 'Anterior',
                                    next: 'Siguiente'
                                }
                            },
                            columnDefs: [//ocultar y definir columnas
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
                                    targets: [2],
                                    visible: false,
                                    searchable: false
                                },

                                {
                                    targets: [7],
                                    data: null,
                                    defaultContent: '<input  type="button" class="btn btn-danger btn-xs btn-delete"  value="Quitar" />'
                                },
                                {
                                    targets: [8],
                                    visible: false,
                                    searchable: false
                                }
                            ],

                        });



                        if (typeof _varTablaConfigHES !== 'undefined') {
                            _varTablaConfigHES.destroy();
                        }


                        _varTablaConfigHES = $('#Config_Detalle_HES').DataTable({
                            data: DetalleHorasExtras,
                            columns: [

                                { data: 'HorarioNorm' },
                                { data: 'HorarioNoct' },
                                { data: 'TipoDia' },
                                { data: 'TimeConfigHE' },
                                { data: 'TimeConfigHE' },
                                { data: 'TimeConfigHE' },



                            ],
                            order: [0, 'asc'],
                            sDom: '',
                            responsive: true,
                            language: {
                                lengthMenu: '',
                                info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                infoEmpty: 'No hay Items para mostrar',
                                search: '',
                                sSearchPlaceholder: '',
                                zeroRecords: '',
                                infoFiltered: '',
                                paginate: {
                                    previous: 'Anterior',
                                    next: 'Siguiente'
                                }
                            },
                            columnDefs: [//ocultar y definir columnas


                                {
                                    targets: [5],
                                    visible: false,
                                    searchable: false
                                }
                            ],

                        });










                    });



                });

                $('#btn-delete-all').on('click', function () {

                    if (DetalleHorasExtras.length > 0) {



                    swal({
                        title: "Eliminar Configuraciones ",
                        text: "¿Está seguro de eliminar Todas las Configuraciones'?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "No, cancelar",
                    }).then(function (isConfirm) {
                        if (isConfirm) {


                            DetalleHorasExtras.length = 0;


                            if (typeof _varTablaConfigHE !== 'undefined') {
                                _varTablaConfigHE.destroy();
                            }


                            _varTablaConfigHE = $('#Config_Detalle_HE').DataTable({
                                data: DetalleHorasExtras,
                                columns: [

                                    { data: 'HorarioNorm' },
                                    { data: 'HorarioNoct' },
                                    { data: 'TipoDia' },
                                    { data: 'strTipoDia' },
                                    { data: 'strHorarioNorm' },
                                    { data: 'strHorarioNoct' },
                                    { data: 'TimeConfigHE' },
                                    { data: null },
                                    { data: 'clave' },


                                ],
                                order: [3, 'asc'],
                                sDom: '',
                                responsive: true,
                                language: {
                                    lengthMenu: '',
                                    info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                    infoEmpty: 'No hay Items para mostrar',
                                    search: '',
                                    sSearchPlaceholder: '',
                                    zeroRecords: '',
                                    infoFiltered: '',
                                    paginate: {
                                        previous: 'Anterior',
                                        next: 'Siguiente'
                                    }
                                },
                                columnDefs: [//ocultar y definir columnas
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
                                        targets: [2],
                                        visible: false,
                                        searchable: false
                                    },

                                    {
                                        targets: [7],
                                        data: null,
                                        defaultContent: '<input  type="button" class="btn btn-danger btn-xs btn-delete"  value="Quitar" />'
                                    },
                                    {
                                        targets: [8],
                                        visible: false,
                                        searchable: false
                                    }
                                ],

                            });



                            if (typeof _varTablaConfigHES !== 'undefined') {
                                _varTablaConfigHES.destroy();
                            }


                            _varTablaConfigHES = $('#Config_Detalle_HES').DataTable({
                                data: DetalleHorasExtras,
                                columns: [

                                    { data: 'HorarioNorm' },
                                    { data: 'HorarioNoct' },
                                    { data: 'TipoDia' },
                                    { data: 'TimeConfigHE' },
                                    { data: 'TimeConfigHE' },
                                    { data: 'TimeConfigHE' },



                                ],
                                order: [0, 'asc'],
                                sDom: '',
                                responsive: true,
                                language: {
                                    lengthMenu: '',
                                    info: 'Mostrar _START_ a _END_ de _TOTAL_ Items',
                                    infoEmpty: 'No hay Items para mostrar',
                                    search: '',
                                    sSearchPlaceholder: '',
                                    zeroRecords: '',
                                    infoFiltered: '',
                                    paginate: {
                                        previous: 'Anterior',
                                        next: 'Siguiente'
                                    }
                                },
                                columnDefs: [//ocultar y definir columnas


                                    {
                                        targets: [5],
                                        visible: false,
                                        searchable: false
                                    }
                                ],

                            });


                            return;

                            } else {
                                swal("Cancelado", "La Operación fue cancelada", "error");
                            }
                        });


                    } else if (DetalleHorasExtras.length == 0) {

                    }

                });

                $('#chk_priori_change').on('ifChanged', function () {

                    if ($('#chk_priori_change').is(':checked') == true) {

                        $('#Change_state').html('<br /><br />  Prioridad Hora Extra');

                    }


                if ($('#chk_priori_change').is(':checked') == false) {

                    $('#Change_state').html('<br /><br />Prioridad Conpensación');

                    }
                });

            });


    });

    $('#btn-save-change-ReglaNegocio').on('click', function () {

    //Datos Cabecera

        var chckactivo = null;
        if ($('#chk-activo-JO').is(':checked') == false) {
            chckactivo = false;
        } if ($('#chk-activo-JO').is(':checked') == true) {
            chckactivo = true;
        }

        var _UnidadOrg = $('#cboUndOrg option:selected').val();
        var _Codigo = $('#txt_codigo_RN').val();
        var _Descripcion = $('#txt_descripcion_RN').val();
        var _strRegNegCampo1 = $('#strRegNegCampo1').val();
        var _strRegNegCampo2 = $('#strRegNegCampo2').val();
        var _strRegNegCampo3 = $('#strRegNegCampo3').val();
        var _strRegNegCampo4 = $('#strRegNegCampo4').val();
        var _strRegNegCampo5 = $('#strRegNegCampo5').val();


        if (_UnidadOrg === '' || _Codigo === '' || _Descripcion === '') {
            new PNotify({
                title: 'Nuevo Regla de Negocio',
                text: 'Complete los campos obligatorios',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3',
                addclass: 'dark'
            });
            $('#notifry_error').html('');
            $('#notifry_errordes').html('');
            return;
        }


        //Clases

        class TGREGNEG_DET {

            constructor(intIdRegNegDet, intIdReglaNeg, strCoReglaDet, strDesReglaDet, strValorRegla, strPosibValor, bitFlActivo) {

                this.intIdRegNegDet = intIdRegNegDet
                this.intIdReglaNeg = intIdReglaNeg
                this.strCoReglaDet = strCoReglaDet
                this.strDesReglaDet = strDesReglaDet
                this.strValorRegla = strValorRegla
                this.strPosibValor = strPosibValor
                this.bitFlActivo = bitFlActivo


            }
        }

        class TGREGLANEG_HE_DET {

            constructor(intIdRegNegHE, intIdReglaNeg, intIdConceptoDiurno, intIdConceptoNocturno, intTiempo, timeTiempo, intSecuencia, intTipoDia, intTipoHorario, bitFlEliminado, intIdUsuarReg) {

                this.intIdRegNegHE = intIdRegNegHE
                this.intIdReglaNeg = intIdReglaNeg
                this.intIdConceptoDiurno = intIdConceptoDiurno
                this.intIdConceptoNocturno = intIdConceptoNocturno
                this.intTiempo = intTiempo
                this.timeTiempo = timeTiempo
                this.intSecuencia = intSecuencia
                this.intTipoDia = intTipoDia
                this.intTipoHorario = intTipoHorario
                this.bitFlEliminado = bitFlEliminado
                this.intIdUsuarReg = intIdUsuarReg


            }
        }

        var ListasDeReglas = new Array();
        var ListasConfigHE = new Array();


        var _HoraIni = $('#time_HN_HI').val();
        var _HoraFin = $('#time_HN_HF').val();
        var error =  0;
        var HoraIni = parseInt(_HoraIni.substring(0, 2));
        var MiniIni = parseInt(_HoraIni.substring(5, 3));
        var HoraFin = parseInt(_HoraFin.substring(0, 2));
        var MiniFin = parseInt(_HoraFin.substring(5, 3));

        if ($('#CHCK_BLOQUEO_CONFIG_HOR').is(':checked') == true) {



        if ($('#time_HN_HI_DIA_SIG').is(':checked') == true && $('#time_HN_HF_DIA_SIG').is(':checked') == false) {

            error = 3;

        }


        if ($('#time_HN_HI_DIA_SIG').is(':checked') == false && $('#time_HN_HF_DIA_SIG').is(':checked') == true) {

            if (HoraIni == HoraFin) {

                if (MiniIni > MiniFin) {
                    error = 2;
                }

                if (MiniIni == MiniFin) {
                    error = 2;
                }


            }

        }


        if ($('#time_HN_HI_DIA_SIG').is(':checked') == true && $('#time_HN_HF_DIA_SIG').is(':checked') == true) {


            if (HoraIni > HoraFin) {

                error = 1;
            }

            if (HoraIni == HoraFin) {

                if (MiniIni > MiniFin) {
                    error = 1;
                }

                if (MiniIni == MiniFin) {
                    error = 1;
                }


            }
        }


        if ($('#time_HN_HI_DIA_SIG').is(':checked') == false && $('#time_HN_HF_DIA_SIG').is(':checked') == false) {


            if (HoraIni > HoraFin) {

                error = 1;
            }

            if (HoraIni == HoraFin) {

                if (MiniIni > MiniFin) {
                    error = 1;
                }

                if (MiniIni == MiniFin) {
                    error = 1;
                }


            }
        }



        if (error == 1) {
            new PNotify({
                title: 'Configuración de Horario Nocturno',
                text: 'Hora Fin debe ser mayor al inicio',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3'
            });
            error = 0;
            return;
        } else if (error == 2) {
            new PNotify({
                title: 'Configuración de Horario Nocturno',
                text: 'Hora Fin debe ser menor al inicio',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3'
            });
            error = 0;
            return;
        } else if (error == 3) {
            new PNotify({
                title: 'Configuración de Horario Nocturno',
                text: 'Configuración del dia Siguiente invalida',
                type: 'info',
                delay: 3000,
                styling: 'bootstrap3'
            });
            error = 0;
            return;
        }

        }
        else if ($('#CHCK_BLOQUEO_CONFIG_HOR').is(':checked') == false) {

        }

    //Datos Asitencia 1.1
        var ValidarPrimerMarca = 0;

        if ($('#chck_valid_pri_marca').is(':checked') == true) {

            ValidarPrimerMarca = 1 ;

        }
        else if ($('#chck_valid_pri_marca').is(':checked') == false) {
            ValidarPrimerMarca = 0;
        }


        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'AVPM', null , ValidarPrimerMarca, ValidarPrimerMarca, true));


        var AsumirMarcasPorMI = 0;

        if ($('#chck_valid_marca_refri').is(':checked') == true) {

            AsumirMarcasPorMI = 1;

        }
        else if ($('#chck_valid_marca_refri').is(':checked') == false) {
            AsumirMarcasPorMI = 0;
        }


        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PVALIDREF', null , AsumirMarcasPorMI, AsumirMarcasPorMI, true));


        var ValidarMarcasRefri = 0;

        if ($('#chck_asumir_Marcar_MI').is(':checked') == true) {

            ValidarMarcasRefri = 1;

        }
        else if ($('#chck_asumir_Marcar_MI').is(':checked') == false) {
            ValidarMarcasRefri = 0;
        }



        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PASMAREF', null , ValidarMarcasRefri, ValidarMarcasRefri, true));


        var TimeMinHTDsctRefri = $('#TimeMinHTDsctRefri').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMINHTREF', null , null, TimeMinHTDsctRefri, true));


        var TimeMinValidMarCRefri = $('#TimeMinValidMarCRefri').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TVALIDREF', null , null, TimeMinValidMarCRefri, true));

        var TimeDsctRefriDiaDesca = $('#TimeDsctRefriDiaDesca').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TREFDIADES', null , null, TimeDsctRefriDiaDesca, true));

        var ValidaBoniAuto = 0;

        if ($('#chck_Valida_Bon').is(':checked') == true) {

            ValidaBoniAuto = 1;

        }
        else if ($('#chck_Valida_Bon').is(':checked') == false) {
            ValidaBoniAuto = 0;
        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'ABO', null , ValidaBoniAuto, ValidaBoniAuto, true));


        var HorApliDiaIni = 0;

        if ($('#chck_config_dia_ini').is(':checked') == true) {

            HorApliDiaIni = 1;

        }
        else if ($('#chck_config_dia_ini').is(':checked') == false) {
            HorApliDiaIni = 0;
        }


        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'DINIPLANHO', null , HorApliDiaIni, HorApliDiaIni, true));




        var ValidarAsigMarc = 0;

        if ($('#Vali_Asig_marc').is(':checked') == true) {


            ValidarAsigMarc = 1;

        }

        else if ($('#Vali_Asig_marc').is(':checked') == false) {

            ValidarAsigMarc = 0;
        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'ASIGM', null , ValidarAsigMarc, ValidarAsigMarc, true));


        var ConsExcePersoNoEje = 0;

        if ($('#chck_cons_fer_hor').is(':checked') == true) {

            ConsExcePersoNoEje = 1;

        }
        else if ($('#chck_cons_fer_hor').is(':checked') == false) {
            ConsExcePersoNoEje = 0;
        }


        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'FSH', null , ConsExcePersoNoEje, ConsExcePersoNoEje, true));



        var ConsFerSobreHor = 0;

        if ($('#Cons_Exc_SinCargo').is(':checked') == true) {

            ConsFerSobreHor = 1;

        }
        else if ($('#Cons_Exc_SinCargo').is(':checked') == false) {

            ConsFerSobreHor = 0;
        }



        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PEXCEP', null , ConsFerSobreHor, ConsFerSobreHor, true));


        var ConsFalNoAsisFeri = 0;

        if ($('#ConsFal').is(':checked') == true) {

            ConsFalNoAsisFeri = 1;

        }
        else if ($('#ConsFal').is(':checked') == false) {
            ConsFalNoAsisFeri = 0;
        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'FEF', null , ConsFalNoAsisFeri, ConsFalNoAsisFeri, true));




    //Datos Asitencia 1.2

        var TardIngTol;

        if ($('#chck_Tar_Ing_Tole').is(':checked') == true) {

            TardIngTol = 1;

        }
        else if ($('#chck_Tar_Ing_Tole').is(':checked') == false) {
            TardIngTol = 0;
        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TING', null, TardIngTol, TardIngTol, true));


        var TardRefTol;

        if ($('#chck_Tar_Refr_Tole').is(':checked') == true) {

            TardRefTol = 1;

        } else if ($('#chck_Tar_Refr_Tole').is(':checked') == false) {

            TardRefTol = 0;

        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TREF',null, TardRefTol, TardRefTol, true));



        var TipoTole;

        if ($('#chck_PorSemana').is(':checked') == true) {
            TipoTole = 1;
        } else if ($('#chck_PorPeriodo').is(':checked') == true) {
            TipoTole = 0;
        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TIPOTOL', null, TipoTole, TipoTole, true));



        var UsoTole = $('#UsoTole option:selected').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'FORMTOL', null, null, UsoTole, true));


        var DscTole = $('#DscTole').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMAXTOL', null, null, DscTole, true));




        var GeneTMaxTol = 0;

        if ($('#chck_GeneTar_MaxTol').is(':checked') == true) {

            GeneTMaxTol = 1;

        } else if ($('#chck_GeneTar_MaxTol').is(':checked') == false) {
            GeneTMaxTol = 0;
        }


        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'GENTOLTAR', null, GeneTMaxTol, GeneTMaxTol, true));


        var ConsAusJustDiaria = 0;

        if ($('#ConsAusJustDiaria').is(':checked') == true) {

            ConsAusJustDiaria = 1;

        } else if ($('#ConsAusJustDiaria').is(':checked') == false) {
            ConsAusJustDiaria = 0;
        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'CJD', null, ConsAusJustDiaria, ConsAusJustDiaria, true));




        var ConsFeriSinAsis = 0;

        if ($('#ConsFeriSinAsis').is(':checked') == true) {

            ConsFeriSinAsis = 1;

        } else if ($('#ConsFeriSinAsis').is(':checked') == false) {
            ConsFeriSinAsis = 0;
        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'CDF', null, ConsFeriSinAsis, ConsFeriSinAsis, true));







        var ConsDomiTieDefec = $('#chk_cons_dom').is(':checked');
        var TimeConsDomiTieDefec = $('#time_chk_cons_dom').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'HTDOM', null, null, TimeConsDomiTieDefec, true));


        var ConsTiempoRef = $('#chck_con_refr_max').is(':checked');
        var TimeConsTiempoRef = $('#time_chck_con_refr_max').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMAXREF', null, null, TimeConsTiempoRef, true));


        var DsctNoMarcSalRef = $('#chck_dsct_no_marcar').is(':checked');
        var TimeDsctNoMarcSalRef = $('#time_chck_dsct_no_marcar').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TCASTMIREF', null, null, TimeDsctNoMarcSalRef, true));



    //Datos Asitencia 1.3

        var PermiteAntesHor = $('#time_min_antes_hor').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMAH', null, null, PermiteAntesHor, true));



        var PermiteDespHor = $('#time_min_despues_hor').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMDH', null, null, PermiteDespHor, true));



        var DuranteDiasNoLab = $('#time_min_durante_diaslab').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMDNL', null, null, DuranteDiasNoLab, true));


        var PerDiasJusti = 0;

        if ($('#chck_dias_just').is(':checked') == true) {

            PerDiasJusti = 1;

        } else if ($('#chck_dias_just').is(':checked') == false) {
            PerDiasJusti = 0;
        }


        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PHAJUST', null, PerDiasJusti, PerDiasJusti, true));



        var PerRefri = 0;

        if ($('#chck_per_refr').is(':checked') == true) {

            PerRefri = 1;

        } else if ($('#chck_per_refr').is(':checked') == false) {
            PerRefri = 0;
        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PREF', null, PerRefri, PerRefri, true));


        var timePerRefri = $('#time_chck_per_refr').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMREF', null, null, timePerRefri, true));




        var timeEfecConsDTrab = $('#Time_TE_ConsiDTrab').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'DTR', null, null, timeEfecConsDTrab, true));


        var timeHAEfecConsDTrab = $('#Time_HA_Efect_ConsDT').val();

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMHADT', null, null, timeHAEfecConsDTrab, true));




        var valor1 = 0;
        var valor2 = 0;
        var valor3 = 0;
        var valor4 = 0;
        var TrabajoCons = 0;
        var strDescValor1 = null;
        var strDescValor2 = null;
        var strDescValor3 = null;
        var strDescValor4 = null;
        var strDescValortOTAL = null;

        if ($('#chck_Sabado').is(':checked') == true) {

            valor1 = 32;
            strDescValor1 = 'SAB';
        }
        if ($('#chck_Domingo').is(':checked') == true) {

            valor2 = 64;
            strDescValor2 = 'DOM';

        }
        if ($('#chck_DiaDesc').is(':checked') == true) {

            valor3 = 128;
            strDescValor3 = 'DESC';

        }
        if ($('#chck_DiaFer').is(':checked') == true) {

            valor4 = 512;
            strDescValor4 = 'FER';

        }

        TrabajoCons = valor1 + valor2 + valor3 + valor4;
        strDescValortOTAL = strDescValor1 +' '+ strDescValor2 +' '+strDescValor3 +' '+strDescValor4;

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'ADTRAB', null , TrabajoCons, strDescValortOTAL, true));





    //Datos Asitencia 1.4

        var SinHorario = 0;

        if ($('#chck_Con_Hor').is(':checked') == true) {

            SinHorario = 1;

        } else if ($('#chck_Sin_Hor').is(':checked') == true) {
            SinHorario = 0;
        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'CHORARIO', null , SinHorario, SinHorario, true));


        var PersTrabAman = 0;

        if ($('#chck_trab_amanecida').is(':checked') == true) {

            PersTrabAman = 1;

        } else if ($('#chck_trab_amanecida').is(':checked') == false) {
            PersTrabAman = 0;
        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TRABAMA', null , PersTrabAman, PersTrabAman, true));


        var ProcesAsistTar = 0;

        if ($('#chck_proc_tareo').is(':checked') == true) {

            ProcesAsistTar = 1;

        } else if ($('#chck_proc_tareo').is(':checked') == false) {
            ProcesAsistTar = 0;
        }


        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PTAREOS', null , ProcesAsistTar, PersTrabAman, true));






        var HabiliGestMIRefri = 0;

        if ($('#chck_marc_incom_refr').is(':checked') == true) {

            HabiliGestMIRefri = 1;

        } else if ($('#chck_marc_incom_refr').is(':checked') == false) {
            HabiliGestMIRefri = 0;
        }

        var TimeHolguraIR = $('#time_ini_chck_marc_incom_refr').val();
        var TimeHolguraFR = $('#time_fin_chck_marc_incom_refr').val();
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'HGESMIREF', null , HabiliGestMIRefri, HabiliGestMIRefri, true));
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'THOLINIREF', null , null, TimeHolguraIR, true));
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'THOLFINREF', null , null, TimeHolguraFR, true));



        var CastTardaIngr = 0;

        if ($('#chck_apli_catigo').is(':checked') == true) {

            CastTardaIngr = 1;

        } else if ($('#chck_apli_catigo').is(':checked') == false) {
            CastTardaIngr = 0;
        }


        var TimeIniCast1 = $('#time_ini_cast1').val();
        var TimeIniCast2 = $('#time_ini_cast2').val();
        var TimeIniCast3 = $('#time_ini_cast3').val();
        var TimeFinCast1 = $('#time_fin_cast1').val();
        var TimeFinCast2 = $('#time_fin_cast2').val();
        var Cast1 = $('#time_apli_cast1').val();
        var Cast2 = $('#time_apli_cast2').val();
        var Cast3 = $('#time_apli_cast3').val();



        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'ACASTXTI', null , CastTardaIngr, CastTardaIngr, true ));
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TINICAST1', null , null, TimeIniCast1, true ));
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TINICAST2', null , null, TimeIniCast2, true));
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TCASTMAS', null , null, TimeIniCast3, true ));
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TFINCAST1', null , null, TimeFinCast1, true));
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TFINCAST2', null , null, TimeFinCast2, true ));
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TCASTAPL1', null , null, Cast1, true ));
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TCASTAPL2', null , null, Cast2, true ));
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TCASTAPL3', null , null, Cast3, true ));



        //Datos Horas Extras 2.1

        var CNN = 1;

        $('#Config_Detalle_HES tr').each((index, item) => {



           //for (var y = 0; y <= index; y++) {

               var    HEHNorm= $(item).find('td').first().html();
             var HEHNoct= $(item).find('td').next().html();
            var intTipoDia= $(item).find('td').next().next().html();
                var Tiempo = $(item).find('td').next().next().next().html();

            if (Tiempo == null || Tiempo == 'undefined') {


            } else if (Tiempo !== null) {


                ListasConfigHE.push(new TGREGLANEG_HE_DET(0, 0, HEHNorm, HEHNoct, 0, Tiempo, CNN, intTipoDia, 1, false, 1));

                CNN = CNN+1;
            }

            //}

        });




        //Datos Horas Extras 2.2

        var MetodoCalc = $('#MetCal').val();
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'MCHE', null, null, MetodoCalc, true));


        var SegunFechaProceso;

        if ($('#chck_FechaProc').is(':checked') == true) {

            SegunFechaProceso = 1;

        } else if ($('#chck_FechaProc').is(':checked') == false) {

            SegunFechaProceso = 0;

        }
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'FCCD', null, SegunFechaProceso, SegunFechaProceso, true));


        var PermAntesHor = $('#time_HE_antes_hor').val();
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMEAH', null , null, PermAntesHor, true));


        var PermDespHor = $('#time_HE_despues_hor').val();
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMEDH', null , null, PermDespHor, true));


        var DurDiasNoLab = $('#time_HE_durante_diasnolab').val();
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMEDNL', null , null, DurDiasNoLab, true));


        var MaximoHEDiario = $('#time_Max_HE_Diario').val();
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMAXHE', null , null, MaximoHEDiario, true));



        var AsuHorUltDiaLab=0;

        if ($('#chck_asu_hora_ultdialab').is(':checked') == true) {

            AsuHorUltDiaLab = 1;

        } else if ($('#chck_asu_hora_ultdialab').is(':checked') == false) {

            AsuHorUltDiaLab = 0;

        }
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'ASUMHDES', null , AsuHorUltDiaLab, AsuHorUltDiaLab, true));



        var QuitarTiempRefr = 0;

        if ($('#chck_qui_time_refri').is(':checked') == true) {

            QuitarTiempRefr = 1;

        } else if ($('#chck_qui_time_refri').is(':checked') == false) {

            QuitarTiempRefr = 0;

        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'QTREFHE', null , QuitarTiempRefr, QuitarTiempRefr, true));


       var HabHEAutoFeri = 0;

        if ($('#Hab_HE_AutoFer').is(':checked') == true) {

            HabHEAutoFeri = 1;

        } else if ($('#Hab_HE_AutoFer').is(':checked') == false) {

            HabHEAutoFeri = 0;

        }
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'HEAUTOFERI', null , HabHEAutoFeri, HabHEAutoFeri, true));

        var GeneHEDiuNoct = 0;

        if ($('#chck_HE_Diu_Noct').is(':checked') == true) {

            GeneHEDiuNoct = 1;

        } else if ($('#chck_HE_Diu_Noct').is(':checked') == false) {

            GeneHEDiuNoct = 0;

        }
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'GENHEDN', null , GeneHEDiuNoct, GeneHEDiuNoct, true));





        var ConfHorNoctHF;

        if ($('#time_HN_HI_DIA_SIG').is(':checked') == true) {

             ConfHorNoctHI = '+'+$('#time_HN_HI').val();

        } else if ($('#time_HN_HI_DIA_SIG').is(':checked') == false) {

            ConfHorNoctHI = $('#time_HN_HI').val();

        }

        var ConfHorNoctHF;

        if ($('#time_HN_HF_DIA_SIG').is(':checked') == true) {

            ConfHorNoctHF = '+' + $('#time_HN_HF').val();

        } else if ($('#time_HN_HF_DIA_SIG').is(':checked') == false) {

            ConfHorNoctHF = $('#time_HN_HF').val();

        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'HNHI', null , null, ConfHorNoctHI, true));
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'HNHF', null , null, ConfHorNoctHF, true));



        var ConsHNdentroHT = 0;

        if ($('#time_HN_HT').is(':checked') == true) {

            ConsHNdentroHT = 1;

        } else if ($('#time_HN_HT').is(':checked') == false) {

            ConsHNdentroHT = 0;

        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'HNHTRAB', null , ConsHNdentroHT, ConsHNdentroHT, true));




        //Datos Horas Extras 2.3


        var TipoCalulo = $('#MetCalc').val();
        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'AHE', null , null, TipoCalulo, true));





        var Prioridad = 0;

        if ($('#chk_priori_change').is(':checked') == true) {

            Prioridad = 1;

        } else if ($('#chk_priori_change_A').is(':checked') == true) {

            Prioridad = 0;

        }

        ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PAHECOMP', null , Prioridad, Prioridad,true));



        console.log(ListasDeReglas);

        console.log(ListasConfigHE);




    ///Validar CAMPOS EN Blanco

    if (_Codigo === '' || _Descripcion === '' || _UnidadOrg == '0' ) {

        new PNotify({
            title: 'Nueva Regla de Negocio',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');


        return;
    }

    //OBJETO REGLA NUEVO

    var ReglaNegocio = {

        strCoRegNeg: _Codigo,
        strDesRegNeg: _Descripcion,
        IntIdUniOrg: _UnidadOrg,
        bitFlInterna: 0,
        strRegNegCampo1: _strRegNegCampo1,
        strRegNegCampo2: _strRegNegCampo2,
        strRegNegCampo3: _strRegNegCampo3,
        strRegNegCampo4: _strRegNegCampo4,
        strRegNegCampo5: _strRegNegCampo5,
        bitFlActivo: chckactivo,

    }




    $.post(
        '/Asistencia/RegistrarNuevaRegla',
        { ObjReglaNeg: ReglaNegocio, listaReglaNegDet: ListasDeReglas, listaReglaNegHEDet: ListasConfigHE },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    new PNotify({
                        title: 'Reistro de Nueva Regla de Negocio',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                    TablarReglaNeg();
                    $('.form-hide-ReglaNegocio').hide();
                } else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Regla de Negocio';
                        var campo = 'txt_codigo_RN';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {

                            var nomMantemiento = 'Regla de Negocio';
                            var campo = 'txt_descripcion_RN';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);

                            return;
                        } else {
                            if (response.type === 'alert') {

                                var nomMantemiento = 'Regla de Negocio';
                                var campo = 'txt_codPla_Var';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errorpla';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;

                            } else if (response.type === 'externo') {

                                var nomMantemiento = 'Jornada';
                                var campo = 'txt_codExte_Var';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errorext';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            } else {

                            }
                        }

                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });

    });

    $('#btn-cancel-ReglaNegocio').on('click', function () {
        $('.form-hide-ReglaNegocio').hide();
    });

    $('#btn-update-ReglaNegocio').on('click', function () {



    var _HoraIni = $('#time_HN_HI').val();
    var _HoraFin = $('#time_HN_HF').val();
    var error = 0;
    var HoraIni = parseInt(_HoraIni.substring(0, 2));
    var MiniIni = parseInt(_HoraIni.substring(5, 3));
    var HoraFin = parseInt(_HoraFin.substring(0, 2));
    var MiniFin = parseInt(_HoraFin.substring(5, 3));



        if ($('#CHCK_BLOQUEO_CONFIG_HOR').is(':checked') == true) {



            if ($('#time_HN_HI_DIA_SIG').is(':checked') == true && $('#time_HN_HF_DIA_SIG').is(':checked') == false) {

                error = 3;

            }


            if ($('#time_HN_HI_DIA_SIG').is(':checked') == false && $('#time_HN_HF_DIA_SIG').is(':checked') == true) {

                if (HoraIni == HoraFin) {

                    if (MiniIni > MiniFin) {
                        error = 2;
                    }

                    if (MiniIni == MiniFin) {
                        error = 2;
                    }


                }

            }


            if ($('#time_HN_HI_DIA_SIG').is(':checked') == true && $('#time_HN_HF_DIA_SIG').is(':checked') == true) {


                if (HoraIni > HoraFin) {

                    error = 1;
                }

                if (HoraIni == HoraFin) {

                    if (MiniIni > MiniFin) {
                        error = 1;
                    }

                    if (MiniIni == MiniFin) {
                        error = 1;
                    }


                }
            }


            if ($('#time_HN_HI_DIA_SIG').is(':checked') == false && $('#time_HN_HF_DIA_SIG').is(':checked') == false) {


                if (HoraIni > HoraFin) {

                    error = 1;
                }

                if (HoraIni == HoraFin) {

                    if (MiniIni > MiniFin) {
                        error = 1;
                    }

                    if (MiniIni == MiniFin) {
                        error = 1;
                    }


                }
            }



            if (error == 1) {
                new PNotify({
                    title: 'Configuración de Horario Nocturno',
                    text: 'Hora Fin debe ser mayor al inicio',
                    type: 'info',
                    delay: 3000,
                    styling: 'bootstrap3'
                });
                error = 0;
                return;
            } else if (error == 2) {
                new PNotify({
                    title: 'Configuración de Horario Nocturno',
                    text: 'Hora Fin debe ser menor al inicio',
                    type: 'info',
                    delay: 3000,
                    styling: 'bootstrap3'
                });
                error = 0;
                return;
            } else if (error == 3) {
                new PNotify({
                    title: 'Configuración de Horario Nocturno',
                    text: 'Configuración del día siguiente inválida',
                    type: 'info',
                    delay: 3000,
                    styling: 'bootstrap3'
                });
                error = 0;
                return;
            }

        }
        else if ($('#CHCK_BLOQUEO_CONFIG_HOR').is(':checked') == false) {

        }

    //Datos Cabecera
        swal({
            title: "Actualizar Regla de Negocio",
            text: "¿Está seguro de actualizar la regla de Negocio ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Actualizar",
            cancelButtonText: "No, cancelar",
        }).then(function (isConfirm) {
            if (isConfirm) {
    var chckactivo = null;
    if ($('#chk-activo-JO').is(':checked') == false) {
        chckactivo = false;
    } if ($('#chk-activo-JO').is(':checked') == true) {
        chckactivo = true;
    }

    var _UnidadOrg = $('#cboUndOrg option:selected').val();
    var _Codigo = $('#txt_codigo_RN').val();
    var _Descripcion = $('#txt_descripcion_RN').val();
    var _strRegNegCampo1 = $('#strRegNegCampo1').val();
    var _strRegNegCampo2 = $('#strRegNegCampo2').val();
    var _strRegNegCampo3 = $('#strRegNegCampo3').val();
    var _strRegNegCampo4 = $('#strRegNegCampo4').val();
    var _strRegNegCampo5 = $('#strRegNegCampo5').val();
    var _idRegNeg = $('#IdRegNeg').val();




                if (_UnidadOrg === '' || _Codigo === '' || _Descripcion === '') {
                    new PNotify({
                        title: 'Actualizar Regla de Negocio',
                        text: 'Complete los campos obligatorios',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });

                    $('#notifry_error').html('');
                    $('#notifry_errordes').html('');
                    return;
                }



    //Clases

    class TGREGNEG_DET {

        constructor(intIdRegNegDet, intIdReglaNeg, strCoReglaDet, strDesReglaDet, strValorRegla, strPosibValor, bitFlActivo) {

            this.intIdRegNegDet = intIdRegNegDet
            this.intIdReglaNeg = intIdReglaNeg
            this.strCoReglaDet = strCoReglaDet
            this.strDesReglaDet = strDesReglaDet
            this.strValorRegla = strValorRegla
            this.strPosibValor = strPosibValor
            this.bitFlActivo = bitFlActivo


        }
    }


    var ListasDeReglas = new Array();
    var ListasConfigHE = new Array();


                //Datos Asitencia 1.1
                var ValidarPrimerMarca = 0;

                if ($('#chck_valid_pri_marca').is(':checked') == true) {

                    ValidarPrimerMarca = 1;

                } else if ($('#chck_valid_pri_marca').is(':checked') == false) {
                    ValidarPrimerMarca = 0;
                }


                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'AVPM', null , ValidarPrimerMarca, ValidarPrimerMarca, true));


                var AsumirMarcasPorMI = 0;

                if ($('#chck_valid_marca_refri').is(':checked') == true) {

                    AsumirMarcasPorMI = 1;

                } else if ($('#chck_valid_marca_refri').is(':checked') == false) {
                    AsumirMarcasPorMI = 0;
                }


                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PVALIDREF', null , AsumirMarcasPorMI, AsumirMarcasPorMI, true));


                var ValidarMarcasRefri = 0;

                if ($('#chck_asumir_Marcar_MI').is(':checked') == true) {

                    ValidarMarcasRefri = 1;

                } else if ($('#chck_asumir_Marcar_MI').is(':checked') == false) {
                    ValidarMarcasRefri = 0;
                }



                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PASMAREF', null , ValidarMarcasRefri, ValidarMarcasRefri, true));



                var TimeMinHTDsctRefri = $('#TimeMinHTDsctRefri').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMINHTREF', null , null, TimeMinHTDsctRefri, true));


                var TimeMinValidMarCRefri = $('#TimeMinValidMarCRefri').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TVALIDREF', null , null, TimeMinValidMarCRefri, true));

                var TimeDsctRefriDiaDesca = $('#TimeDsctRefriDiaDesca').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TREFDIADES', null , null, TimeDsctRefriDiaDesca, true));

                var ValidaBoniAuto = 0;

                if ($('#chck_Valida_Bon').is(':checked') == true) {

                    ValidaBoniAuto = 1;

                } else if ($('#chck_Valida_Bon').is(':checked') == false) {
                    ValidaBoniAuto = 0;
                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'ABO', null , ValidaBoniAuto, ValidaBoniAuto, true));


                var HorApliDiaIni = 0;

                if ($('#chck_config_dia_ini').is(':checked') == true) {

                    HorApliDiaIni = 1;

                } else if ($('#chck_config_dia_ini').is(':checked') == false) {
                    HorApliDiaIni = 0;
                }


                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'DINIPLANHO', null , HorApliDiaIni, HorApliDiaIni, true));




                var ValidarAsigMarc = 0;

                if ($('#Vali_Asig_marc').is(':checked') == true) {

                    ValidarAsigMarc = 1;

                } else if ($('#Vali_Asig_marc').is(':checked') == false) {
                    ValidarAsigMarc = 0;
                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'ASIGM', null , ValidarAsigMarc, ValidarAsigMarc, true));


                var ConsExcePersoNoEje = 0;

                if ($('#chck_cons_fer_hor').is(':checked') == true) {

                    ConsExcePersoNoEje = 1;

                } else if ($('#chck_cons_fer_hor').is(':checked') == false) {
                    ConsExcePersoNoEje = 0;
                }


                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'FSH', null , ConsExcePersoNoEje, ConsExcePersoNoEje, true));



                var ConsFerSobreHor = 0;

                if ($('#Cons_Exc_SinCargo').is(':checked') == true) {

                    ConsFerSobreHor = 1;

                } else if ($('#Cons_Exc_SinCargo').is(':checked') == false) {
                    ConsFerSobreHor = 0;
                }



                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PEXCEP', null , ConsFerSobreHor, ConsFerSobreHor, true));


                var ConsFalNoAsisFeri = 0;

                if ($('#ConsFal').is(':checked') == true) {

                    ConsFalNoAsisFeri = 1;

                } else if ($('#ConsFal').is(':checked') == false) {
                    ConsFalNoAsisFeri = 0;
                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'FEF', null , ConsFalNoAsisFeri, ConsFalNoAsisFeri, true));




                //Datos Asitencia 1.2

                var TardIngTol;

                if ($('#chck_Tar_Ing_Tole').is(':checked') == true) {

                    TardIngTol = 1;

                }
                else if ($('#chck_Tar_Tole').is(':checked') == true) {
                    TardIngTol = 0;
                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TING', null , TardIngTol, TardIngTol, true));


                var TardRefTol;

                if ($('#chck_Tar_Refr_Tole').is(':checked') == true) {

                    TardRefTol = 1;

                } else if ($('#chck_Tar_Tole_xd').is(':checked') == true) {

                    TardRefTol = 0;

                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TREF', null , TardRefTol, TardRefTol, true));



                var TipoTole;
                if ($('#chck_PorSemana').is(':checked') == true) {
                    TipoTole = 1;
                } else if ($('#chck_PorPeriodo').is(':checked') == true) {
                    TipoTole = 0;
                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TIPOTOL', null , TipoTole, TipoTole, true));



                var UsoTole = $('#UsoTole option:selected').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'FORMTOL', null , null, UsoTole, true));


                var DscTole = $('#DscTole').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMAXTOL', null , null, DscTole, true));




                var GeneTMaxTol = 0;

                if ($('#chck_GeneTar_MaxTol').is(':checked') == true) {

                    GeneTMaxTol = 1;

                } else if ($('#chck_GeneTar_MaxTol').is(':checked') == false) {
                    GeneTMaxTol = 0;
                }


                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'GENTOLTAR', null , GeneTMaxTol, GeneTMaxTol, true));


                var ConsAusJustDiaria = 0;

                if ($('#ConsAusJustDiaria').is(':checked') == true) {

                    ConsAusJustDiaria = 1;

                } else if ($('#ConsAusJustDiaria').is(':checked') == false) {
                    ConsAusJustDiaria = 0;
                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'CJD', null , ConsAusJustDiaria, ConsAusJustDiaria, true));




                var ConsFeriSinAsis = 0;

                if ($('#ConsFeriSinAsis').is(':checked') == true) {

                    ConsFeriSinAsis = 1;

                } else if ($('#ConsFeriSinAsis').is(':checked') == false) {
                    ConsFeriSinAsis = 0;
                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'CDF', null , ConsFeriSinAsis, ConsFeriSinAsis, true));



                var ConsDomiTieDefec = $('#chk_cons_dom').val();
                var TimeConsDomiTieDefec = $('#time_chk_cons_dom').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'HTDOM', null , null, TimeConsDomiTieDefec, true));


                var ConsTiempoRef = $('#chck_con_refr_max').is(':checked');
                var TimeConsTiempoRef = $('#time_chck_con_refr_max').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMAXREF', null , null, TimeConsTiempoRef, true));


                var DsctNoMarcSalRef = $('#chck_dsct_no_marcar').is(':checked');
                var TimeDsctNoMarcSalRef = $('#time_chck_dsct_no_marcar').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TCASTMIREF', null , null, TimeDsctNoMarcSalRef, true));



                //Datos Asitencia 1.3

                var PermiteAntesHor = $('#time_min_antes_hor').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMAH', null , null, PermiteAntesHor, true));



                var PermiteDespHor = $('#time_min_despues_hor').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMDH', null , null, PermiteDespHor, true));



                var DuranteDiasNoLab = $('#time_min_durante_diaslab').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMDNL', null , null, DuranteDiasNoLab, true));


                var PerDiasJusti = 0;

                if ($('#chck_dias_just').is(':checked') == true) {

                    PerDiasJusti = 1;

                } else if ($('#chck_dias_just').is(':checked') == false) {
                    PerDiasJusti = 0;
                }


                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PHAJUST', null , PerDiasJusti, PerDiasJusti, true));



                var PerRefri = 0;

                if ($('#chck_per_refr').is(':checked') == true) {

                    PerRefri = 1;

                } else if ($('#chck_per_refr').is(':checked') == false) {
                    PerRefri = 0;
                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PREF', null , PerRefri, PerRefri, true));


                var timePerRefri = $('#time_chck_per_refr').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMREF', null , null, timePerRefri, true));




                var timeEfecConsDTrab = $('#Time_TE_ConsiDTrab').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'DTR', null , null, timeEfecConsDTrab, true));


                var timeHAEfecConsDTrab = $('#Time_HA_Efect_ConsDT').val();

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMHADT', null , null, timeHAEfecConsDTrab, true));




                var valor1 = 0;
                var valor2 = 0;
                var valor3 = 0;
                var valor4 = 0;
                var TrabajoCons = 0;
                var strDescValor1 = null;
                var strDescValor2 = null;
                var strDescValor3 = null;
                var strDescValor4 = null;
                var strDescValortOTAL = null;

                if ($('#chck_Sabado').is(':checked') == true) {

                    valor1 = 32;
                    strDescValor1 = 'SAB';
                }
                if ($('#chck_Domingo').is(':checked') == true) {

                    valor2 = 64;
                    strDescValor2 = 'DOM';

                }
                if ($('#chck_DiaDesc').is(':checked') == true) {

                    valor3 = 128;
                    strDescValor3 = 'DESC';

                }
                if ($('#chck_DiaFer').is(':checked') == true) {

                    valor4 = 512;
                    strDescValor4 = 'FER';

                }

                TrabajoCons = valor1 + valor2 + valor3 + valor4;
                strDescValortOTAL = strDescValor1 + ' ' + strDescValor2 + ' ' + strDescValor3 + ' ' + strDescValor4;

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'ADTRAB', null , TrabajoCons, strDescValortOTAL, true));





                //Datos Asitencia 1.4
                var SinHorario = 0;

                if ($('#chck_Con_Hor').is(':checked') == true) {

                    SinHorario = 1;

                } else if ($('#chck_Sin_Hor').is(':checked') == true) {
                    SinHorario = 0;
                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'CHORARIO', null , SinHorario, SinHorario, true));

                var PersTrabAman = 0;

                if ($('#chck_trab_amanecida').is(':checked') == true) {

                    PersTrabAman = 1;

                } else if ($('#chck_trab_amanecida').is(':checked') == false) {
                    PersTrabAman = 0;
                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TRABAMA', null , PersTrabAman, PersTrabAman, true));


                var ProcesAsistTar = 0;

                if ($('#chck_proc_tareo').is(':checked') == true) {

                    ProcesAsistTar = 1;

                } else if ($('#chck_proc_tareo').is(':checked') == false) {
                    ProcesAsistTar = 0;
                }


                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PTAREOS', null , ProcesAsistTar, PersTrabAman, true));





                var HabiliGestMIRefri = 0;

                if ($('#chck_marc_incom_refr').is(':checked') == true) {

                    HabiliGestMIRefri = 1;

                } else if ($('#chck_marc_incom_refr').is(':checked') == false) {
                    HabiliGestMIRefri = 0;
                }

                var TimeHolguraIR = $('#time_ini_chck_marc_incom_refr').val();
                var TimeHolguraFR = $('#time_fin_chck_marc_incom_refr').val();
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'HGESMIREF', null , HabiliGestMIRefri, HabiliGestMIRefri, true));
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'THOLINIREF', null , null, TimeHolguraIR, 1));
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'THOLFINREF', null , null, TimeHolguraFR, 1));



                var CastTardaIngr = 0;

                if ($('#chck_apli_catigo').is(':checked') == true) {

                    CastTardaIngr = 1;

                } else if ($('#chck_apli_catigo').is(':checked') == false) {
                    CastTardaIngr = 0;
                }


                var TimeIniCast1 = $('#time_ini_cast1').val();
                var TimeIniCast2 = $('#time_ini_cast2').val();
                var TimeIniCast3 = $('#time_ini_cast3').val();
                var TimeFinCast1 = $('#time_fin_cast1').val();
                var TimeFinCast2 = $('#time_fin_cast2').val();
                var Cast1 = $('#time_apli_cast1').val();
                var Cast2 = $('#time_apli_cast2').val();
                var Cast3 = $('#time_apli_cast3').val();



                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'ACASTXTI', null , CastTardaIngr, CastTardaIngr, true));
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TINICAST1', null , null, TimeIniCast1, true));
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TINICAST2', null , null, TimeIniCast2, true));
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TCASTMAS', null , null, TimeIniCast3, true));
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TFINCAST1', null , null, TimeFinCast1, true));
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TFINCAST2', null , null, TimeFinCast2, true));
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TCASTAPL1', null , null, Cast1, true));
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TCASTAPL2', null , null, Cast2, true));
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TCASTAPL3', null , null, Cast3, true));



                //Datos Horas Extras 2.1

                var CNN = 1;






                $('#Config_Detalle_HES tr').each((index, item) => {


                    class TGREGLANEG_HE_DET_XD {

                        constructor(intIdRegNegHE, intIdReglaNeg, intIdConceptoDiurno, intIdConceptoNocturno, intTiempo, timeTiempo, intSecuencia, intTipoDia, intTipoHorario, bitFlEliminado, intIdUsuarReg) {

                            this.intIdRegNegHE = intIdRegNegHE
                            this.intIdReglaNeg = intIdReglaNeg
                            this.intIdConceptoDiurno = intIdConceptoDiurno
                            this.intIdConceptoNocturno = intIdConceptoNocturno
                            this.intTiempo = intTiempo
                            this.timeTiempo = timeTiempo
                            this.intSecuencia = intSecuencia
                            this.intTipoDia = intTipoDia
                            this.intTipoHorario = intTipoHorario
                            this.bitFlEliminado = bitFlEliminado
                            this.intIdUsuarReg = intIdUsuarReg


                        }
                    }


                    //for (var y = 0; y <= index; y++) {

                    var HEHNorm = $(item).find('td').first().html();
                    var HEHNoct = $(item).find('td').next().html();
                    var intTipoDia = $(item).find('td').next().next().html();
                    var Tiempo = $(item).find('td').next().next().next().html();
                    var idRegNeg = $(item).find('td').next().next().next().next().html();

                    if (Tiempo == null || Tiempo == 'undefined') {


                    } else if (Tiempo !== null) {


                        ListasConfigHE.push(new TGREGLANEG_HE_DET_XD(idRegNeg, 0, HEHNorm, HEHNoct, 0, Tiempo, CNN, intTipoDia, 1,false, 1));

                        CNN = CNN + 1;
                    }

                    //}

                });




                //Datos Horas Extras 2.2

                var MetodoCalc = $('#MetCal').val();
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'MCHE', null , null, MetodoCalc, true));


                var SegunFechaProceso;

                if ($('#chck_FechaProc').is(':checked') == true) {

                    SegunFechaProceso = 1;

                } else if ($('#chck_FechaProc').is(':checked') == false) {

                    SegunFechaProceso = 0;

                }
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'FCCD', null , SegunFechaProceso, SegunFechaProceso, true));


                var PermAntesHor = $('#time_HE_antes_hor').val();
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMEAH', null , null, PermAntesHor, true));


                var PermDespHor = $('#time_HE_despues_hor').val();
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMEDH', null , null, PermDespHor, true));


                var DurDiasNoLab = $('#time_HE_durante_diasnolab').val();
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMEDNL', null , null, DurDiasNoLab, true));


                var MaximoHEDiario = $('#time_Max_HE_Diario').val();
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'TMAXHE', null , null, MaximoHEDiario, true));



                var AsuHorUltDiaLab = 0;

                if ($('#chck_asu_hora_ultdialab').is(':checked') == true) {

                    AsuHorUltDiaLab = 1;

                } else if ($('#chck_asu_hora_ultdialab').is(':checked') == false) {

                    AsuHorUltDiaLab = 0;

                }
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'ASUMHDES', null , AsuHorUltDiaLab, AsuHorUltDiaLab, true));



                var QuitarTiempRefr = 0;

                if ($('#chck_qui_time_refri').is(':checked') == true) {

                    QuitarTiempRefr = 1;

                } else if ($('#chck_qui_time_refri').is(':checked') == false) {

                    QuitarTiempRefr = 0;

                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'QTREFHE', null , QuitarTiempRefr, QuitarTiempRefr, true));


                var HabHEAutoFeri = 0;

                if ($('#Hab_HE_AutoFer').is(':checked') == true) {

                    HabHEAutoFeri = 1;

                } else if ($('#Hab_HE_AutoFer').is(':checked') == false) {

                    HabHEAutoFeri = 0;

                }
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'HEAUTOFERI',null, HabHEAutoFeri, HabHEAutoFeri, true));

                var GeneHEDiuNoct = 0;

                if ($('#chck_HE_Diu_Noct').is(':checked') == true) {

                    GeneHEDiuNoct = 1;

                } else if ($('#chck_HE_Diu_Noct').is(':checked') == false) {

                    GeneHEDiuNoct = 0;

                }
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'GENHEDN', null , GeneHEDiuNoct, GeneHEDiuNoct, true));





                var ConfHorNoctHF;

                if ($('#time_HN_HI_DIA_SIG').is(':checked') == true) {

                    ConfHorNoctHI = '+' + $('#time_HN_HI').val();

                } else if ($('#time_HN_HI_DIA_SIG').is(':checked') == false) {

                    ConfHorNoctHI = $('#time_HN_HI').val();

                }

                var ConfHorNoctHF;

                if ($('#time_HN_HF_DIA_SIG').is(':checked') == true) {

                    ConfHorNoctHF = '+' + $('#time_HN_HF').val();

                } else if ($('#time_HN_HF_DIA_SIG').is(':checked') == false) {

                    ConfHorNoctHF = $('#time_HN_HF').val();

                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'HNHI', null, null, ConfHorNoctHI, true));
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'HNHF', null, null, ConfHorNoctHF, true));




                var ConsHNdentroHT = 0;

                if ($('#time_HN_HT').is(':checked') == true) {

                    ConsHNdentroHT = 1;

                } else if ($('#time_HN_HT').is(':checked') == false) {

                    ConsHNdentroHT = 0;

                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'HNHTRAB', null , ConsHNdentroHT, ConsHNdentroHT, true));




                //Datos Horas Extras 2.3


                var TipoCalulo = $('#MetCalc').val();
                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'AHE', null , null, TipoCalulo, true));





                var Prioridad = 0;

                if ($('#chk_priori_change').is(':checked') == true) {

                    Prioridad = 1;

                } else if ($('#chk_priori_change_A').is(':checked') == true) {

                    Prioridad = 0;

                }

                ListasDeReglas.push(new TGREGNEG_DET(null, null, 'PAHECOMP', null , Prioridad, Prioridad, true));



    console.log(ListasDeReglas);

    console.log(ListasConfigHE);





    ///Validar CAMPOS EN Blanco

    if (_Codigo === '' || _Descripcion === '' || _UnidadOrg == '0') {

        new PNotify({
            title: 'Nueva Regla de Negocio',
            text: 'Complete los campos obligatorios',
            type: 'info',
            delay: 3000,
            styling: 'bootstrap3',
            addclass: 'dark'
        });
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');


        return;
    }

    //OBJETO REGLA NUEVO

    var ReglaNegocio = {

        strCoRegNeg: _Codigo,
        strDesRegNeg: _Descripcion,
        IntIdUniOrg: _UnidadOrg,
        bitFlInterna: 0,
        strRegNegCampo1: _strRegNegCampo1,
        strRegNegCampo2: _strRegNegCampo2,
        strRegNegCampo3: _strRegNegCampo3,
        strRegNegCampo4: _strRegNegCampo4,
        strRegNegCampo5: _strRegNegCampo5,
        bitFlActivo: chckactivo,
        intIdReglaNeg: _idRegNeg,

    }





    $.post(
        '/Asistencia/ActualizarNuevaRegla',
        { ObjReglaNeg: ReglaNegocio, listaReglaNegDet: ListasDeReglas, listaReglaNegHEDet: ListasConfigHE },
        (response) => {
            console.log(response);
            if (response.type !== '') {

                if (response.type === 'success') {
                    new PNotify({
                        title: 'Actualización de Nueva Regla de Negocio',
                        text: response.message,
                        type: response.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                    TablarReglaNeg();
                    $('.form-hide-ReglaNegocio').hide();
                    return;
                } else {

                    if (response.type === 'info') {
                        var nomMantemiento = 'Regla de Negocio';
                        var campo = 'txt_codigo_RN';
                        var msj = response.message;
                        var response = response.type;
                        var deta = 'notifry_error';
                        INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                        return;

                    } else {

                        if (response.type === 'error') {

                            var nomMantemiento = 'Regla de Negocio';
                            var campo = 'txt_descripcion_RN';
                            var msj = response.message;
                            var response = 'info';
                            var deta = 'notifry_errordes';
                            INFO_MSJ(nomMantemiento, campo, response, msj, deta);

                            return;
                        } else {
                            if (response.type === 'alert') {

                                var nomMantemiento = 'Regla de Negocio';
                                var campo = 'txt_codPla_Var';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errorpla';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                                return;

                            } else if (response.type === 'externo') {

                                var nomMantemiento = 'Jornada';
                                var campo = 'txt_codExte_Var';
                                var msj = response.message;
                                var response = 'info';
                                var deta = 'notifry_errorext';
                                INFO_MSJ(nomMantemiento, campo, response, msj, deta);
                            } else {

                            }
                        }

                    }
                }

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });


                } else {
                    swal("Cancelado", "La Operación fue cancelada", "error");
                }
            });



});


    /**------------------------------------------------------ */
    /**24. Cálculo Manual*/
    /**------------------------------------------------------- */

    function SinDetalle() {
        $('#DetalleTex1').attr('hidden', false);
        $('#DetalleTex2').attr('hidden', false);
        $('#DetalleTex3').attr('hidden', false);
        $('#DetalleTex4').attr('hidden', false);
        $('#DetalleTex5').attr('hidden', false);
        $('#DetalleTex6').attr('hidden', false);
    }
    function calcu_one() {
        $('#cboPlanilla').on('change', function () {
            var id = $('#cboPlanilla').val();
            if (id) {
                $('#Periodo_Pago').attr('disabled', false);

                return;
            }
        });

    }
    function calcu_two() {
        $('.chekeamePeriodos').on('click', function () {
            var n = $('.checky:checked').length;
            if (n > 0) {
                $('#GrupoLiqui').attr('disabled', false);


            }
            if (n == 0) {
                //$('#precheck').prop('hidden', false);
                $('#GrupoLiqui').attr('disabled', true);
            }
        });
    }
    function calcu_third() {
        $('#checkliqui').on('click', function () {
            var m = $('#checkliqui:checked').length;
            if (m == 1) {
                $('#GrupoLiqui').attr('disabled', false);
            }
            if (m == 0) {
                $('#GrupoLiqui').attr('disabled', true);
            }
        });
    };
    function LlenarPeriodo() {
    $('#cboPlanilla').on('change', function () {
        var id = $('#cboPlanilla option:selected').val();
        if (id == 0 || !id) {

            $('#Periodo_Pago').attr('disabled', true);
            return;
        }

        $.post(
            '/Proceso/GetCampPeriodo',
            { intIdPlanilla: id },

            (response) => {

                console.log(response);
                response.forEach(element => {

                    $('#chekeamePeriodos').append('<li role="presentation"><label>' +
                        '<input id="' + element.intIdPeriodo + '"type="checkbox" class= "flat" name="restore">' + element.dttFeIniPerio + '-' + element.dttFeFinPerio +
                        '</label></li >');
                    init_checkBox_styles();

                });


            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });
        $('#chekeamePeriodos').empty();

    });


}
    function init_compose() {

        if (typeof ($.fn.slideToggle) === 'undefined') { return; }
        console.log('init_compose');

        init_EasyPieChart();
        $('#compose, .compose-close').click(function () {
            $('.compose').slideToggle();
        });
    };
    function init_EasyPieChart() {

        if (typeof ($.fn.easyPieChart) === 'undefined') { return; }
        console.log('init_EasyPieChart');

        $('.chart').easyPieChart({
            easing: 'easeOutElastic',
            delay: 3000,
            barColor: '#26B99A',
            trackColor: '#fff',
            scaleColor: false,
            lineWidth: 20,
            trackWidth: 16,
            lineCap: 'butt',
            onStep: function (from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });
        var chart = window.chart = $('.chart').data('easyPieChart');
        $('.js_update').on('click', function () {
            chart.update(Math.random() * 200 - 100);
        });

        //hover and retain popover when on popover content
        var originalLeave = $.fn.popover.Constructor.prototype.leave;
        $.fn.popover.Constructor.prototype.leave = function (obj) {
            var self = obj instanceof this.constructor ?
                obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
            var container, timeout;

            originalLeave.call(this, obj);

            if (obj.currentTarget) {
                container = $(obj.currentTarget).siblings('.popover');
                timeout = self.timeout;
                container.one('mouseenter', function () {
                    //We entered the actual popover – call off the dogs
                    clearTimeout(timeout);
                    //Let's monitor popover content instead
                    container.one('mouseleave', function () {
                        $.fn.popover.Constructor.prototype.leave.call(self, self);
                    });
                });
            }
        };

        $('body').popover({
            selector: '[data-popover]',
            trigger: 'click hover',
            delay: {
                show: 50,
                hide: 400
            }
        });

    };
    function init_charts() {

        console.log('run_charts  typeof [' + typeof (Chart) + ']');

        if (typeof (Chart) === 'undefined') { return; }

        console.log('init_charts');


        Chart.defaults.global.legend = {
            enabled: false
        };



        if ($('#canvas_line').length) {

            var canvas_line_00 = new Chart(document.getElementById("canvas_line"), {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: "rgba(38, 185, 154, 0.31)",
                        borderColor: "rgba(38, 185, 154, 0.7)",
                        pointBorderColor: "rgba(38, 185, 154, 0.7)",
                        pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointBorderWidth: 1,
                        data: [31, 74, 6, 39, 20, 85, 7]
                    }, {
                        label: "My Second dataset",
                        backgroundColor: "rgba(3, 88, 106, 0.3)",
                        borderColor: "rgba(3, 88, 106, 0.70)",
                        pointBorderColor: "rgba(3, 88, 106, 0.70)",
                        pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(151,187,205,1)",
                        pointBorderWidth: 1,
                        data: [82, 23, 66, 9, 99, 4, 2]
                    }]
                },
            });

        }


        if ($('#canvas_line1').length) {

            var canvas_line_01 = new Chart(document.getElementById("canvas_line1"), {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: "rgba(38, 185, 154, 0.31)",
                        borderColor: "rgba(38, 185, 154, 0.7)",
                        pointBorderColor: "rgba(38, 185, 154, 0.7)",
                        pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointBorderWidth: 1,
                        data: [31, 74, 6, 39, 20, 85, 7]
                    }, {
                        label: "My Second dataset",
                        backgroundColor: "rgba(3, 88, 106, 0.3)",
                        borderColor: "rgba(3, 88, 106, 0.70)",
                        pointBorderColor: "rgba(3, 88, 106, 0.70)",
                        pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(151,187,205,1)",
                        pointBorderWidth: 1,
                        data: [82, 23, 66, 9, 99, 4, 2]
                    }]
                },
            });

        }


        if ($('#canvas_line2').length) {

            var canvas_line_02 = new Chart(document.getElementById("canvas_line2"), {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: "rgba(38, 185, 154, 0.31)",
                        borderColor: "rgba(38, 185, 154, 0.7)",
                        pointBorderColor: "rgba(38, 185, 154, 0.7)",
                        pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointBorderWidth: 1,
                        data: [31, 74, 6, 39, 20, 85, 7]
                    }, {
                        label: "My Second dataset",
                        backgroundColor: "rgba(3, 88, 106, 0.3)",
                        borderColor: "rgba(3, 88, 106, 0.70)",
                        pointBorderColor: "rgba(3, 88, 106, 0.70)",
                        pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(151,187,205,1)",
                        pointBorderWidth: 1,
                        data: [82, 23, 66, 9, 99, 4, 2]
                    }]
                },
            });

        }


        if ($('#canvas_line3').length) {

            var canvas_line_03 = new Chart(document.getElementById("canvas_line3"), {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: "rgba(38, 185, 154, 0.31)",
                        borderColor: "rgba(38, 185, 154, 0.7)",
                        pointBorderColor: "rgba(38, 185, 154, 0.7)",
                        pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointBorderWidth: 1,
                        data: [31, 74, 6, 39, 20, 85, 7]
                    }, {
                        label: "My Second dataset",
                        backgroundColor: "rgba(3, 88, 106, 0.3)",
                        borderColor: "rgba(3, 88, 106, 0.70)",
                        pointBorderColor: "rgba(3, 88, 106, 0.70)",
                        pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(151,187,205,1)",
                        pointBorderWidth: 1,
                        data: [82, 23, 66, 9, 99, 4, 2]
                    }]
                },
            });

        }


        if ($('#canvas_line4').length) {

            var canvas_line_04 = new Chart(document.getElementById("canvas_line4"), {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: "rgba(38, 185, 154, 0.31)",
                        borderColor: "rgba(38, 185, 154, 0.7)",
                        pointBorderColor: "rgba(38, 185, 154, 0.7)",
                        pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointBorderWidth: 1,
                        data: [31, 74, 6, 39, 20, 85, 7]
                    }, {
                        label: "My Second dataset",
                        backgroundColor: "rgba(3, 88, 106, 0.3)",
                        borderColor: "rgba(3, 88, 106, 0.70)",
                        pointBorderColor: "rgba(3, 88, 106, 0.70)",
                        pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(151,187,205,1)",
                        pointBorderWidth: 1,
                        data: [82, 23, 66, 9, 99, 4, 2]
                    }]
                },
            });

        }


        // Line chart

        if ($('#lineChart').length) {

            var ctx = document.getElementById("lineChart");
            var lineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: "rgba(38, 185, 154, 0.31)",
                        borderColor: "rgba(38, 185, 154, 0.7)",
                        pointBorderColor: "rgba(38, 185, 154, 0.7)",
                        pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointBorderWidth: 1,
                        data: [31, 74, 6, 39, 20, 85, 7]
                    }, {
                        label: "My Second dataset",
                        backgroundColor: "rgba(3, 88, 106, 0.3)",
                        borderColor: "rgba(3, 88, 106, 0.70)",
                        pointBorderColor: "rgba(3, 88, 106, 0.70)",
                        pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(151,187,205,1)",
                        pointBorderWidth: 1,
                        data: [82, 23, 66, 9, 99, 4, 2]
                    }]
                },
            });

        }

        // Bar chart

        if ($('#mybarChart').length) {

            var ctx = document.getElementById("mybarChart");
            var mybarChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: '# of Votes 1',
                        backgroundColor: "#26B99A",
                        data: [51, 30, 40, 28, 92, 50, 45]
                    }, {
                        label: '# of Votes',
                        backgroundColor: "#03586A",
                        data: [41, 56, 25, 48, 72, 34, 12]
                    }]
                },

                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

        }


        // Doughnut chart

        if ($('#canvasDoughnut').length) {

            var ctx = document.getElementById("canvasDoughnut");
            var data = {
                labels: [
                    "Dark Grey",
                    "Purple Color",
                    "Gray Color",
                    "Green Color",
                    "Blue Color"
                ],
                datasets: [{
                    data: [120, 50, 140, 180, 100],
                    backgroundColor: [
                        "#455C73",
                        "#9B59B6",
                        "#BDC3C7",
                        "#26B99A",
                        "#3498DB"
                    ],
                    hoverBackgroundColor: [
                        "#34495E",
                        "#B370CF",
                        "#CFD4D8",
                        "#36CAAB",
                        "#49A9EA"
                    ]

                }]
            };

            var canvasDoughnut = new Chart(ctx, {
                type: 'doughnut',
                tooltipFillColor: "rgba(51, 51, 51, 0.55)",
                data: data
            });

        }

        // Radar chart

        if ($('#canvasRadar').length) {

            var ctx = document.getElementById("canvasRadar");
            var data = {
                labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.2)",
                    borderColor: "rgba(3, 88, 106, 0.80)",
                    pointBorderColor: "rgba(3, 88, 106, 0.80)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.80)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    data: [65, 59, 90, 81, 56, 55, 40]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.2)",
                    borderColor: "rgba(38, 185, 154, 0.85)",
                    pointColor: "rgba(38, 185, 154, 0.85)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 96, 27, 100]
                }]
            };

            var canvasRadar = new Chart(ctx, {
                type: 'radar',
                data: data,
            });

        }


        // Pie chart
        if ($('#pieChart').length) {

            var ctx = document.getElementById("pieChart");
            var data = {
                datasets: [{
                    data: [120, 50, 140, 180, 100],
                    backgroundColor: [
                        "#455C73",
                        "#9B59B6",
                        "#BDC3C7",
                        "#26B99A",
                        "#3498DB"
                    ],
                    label: 'My dataset' // for legend
                }],
                labels: [
                    "Dark Gray",
                    "Purple",
                    "Gray",
                    "Green",
                    "Blue"
                ]
            };

            var pieChart = new Chart(ctx, {
                data: data,
                type: 'pie',
                otpions: {
                    legend: false
                }
            });

        }


        // PolarArea chart

        if ($('#polarArea').length) {

            var ctx = document.getElementById("polarArea");
            var data = {
                datasets: [{
                    data: [120, 50, 140, 180, 100],
                    backgroundColor: [
                        "#455C73",
                        "#9B59B6",
                        "#BDC3C7",
                        "#26B99A",
                        "#3498DB"
                    ],
                    label: 'My dataset'
                }],
                labels: [
                    "Dark Gray",
                    "Purple",
                    "Gray",
                    "Green",
                    "Blue"
                ]
            };

            var polarArea = new Chart(ctx, {
                data: data,
                type: 'polarArea',
                options: {
                    scale: {
                        ticks: {
                            beginAtZero: true
                        }
                    }
                }
            });

        }
    }

/****---------------------------------------------------------**/
 /**25. Reportes */
/**------------------------------------------------------- */

function SinDetalle_reportes() {
    $('#DetalleTex1').attr('hidden', false);
    $('#DetalleTex2').attr('hidden', false);
    $('#DetalleTex3').attr('hidden', false);
    $('#DetalleTex4').attr('hidden', false);
    $('#DetalleTex5').attr('hidden', false);
    $('#DetalleTex6').attr('hidden', false);
}

function calcu_one_reportes() {
    $('#cboJerarquia').on('change', function () {
        var id = $('#cboJerarquia').val();
        if (id) {
            $('#UnidadesOrganizacionales').attr('disabled', false);
            return;
        }
    });
}

function calcu_two_reportes() {
    $('#chekeame').on('click', function () {
        var n = $('.checky:checked').length;
        if (n > 0) {
            $('#Planilla').attr('disabled', false);


        }
        if (n == 0) {

            $('#Planilla').attr('disabled', true);
        }
    });

    alert('TGREPORTESC002');
    LlenarFizcalizacion();
}

function DescargarUnidades() {
    $('#cboJerarquia').on('change', function () {
        var id = $('#cboJerarquia option:selected').val();

        if (id == 0 || !id) {
            $('#cbounidsupe').empty();
            $('#cbounidsupe').attr('disabled', true);

            return;
        }
        $.post(
            '/Organizacion/getUnidxJerarquia',
            { IntIdJerOrg: id },
            (response) => {
                if (true) {
                    console.log(response);
                    response.forEach(element => {

                        $('#chekeame').append('<li role="presentation"><label class= "checkbox-inline" >' +
                            '<input id="' + element.intIdUniOrg + '"type="checkbox" class="checky" name="responsive">' + element.strDescripcion +
                        '</label></li >');
                    });

                }
                $('.checky').click(function () {
                    var lstIntIdUniOrg = new Array();
                    $('.checky:checked').each(function () {
                        lstIntIdUniOrg.push($(this).prop('id') * 1);
                    });
                    console.log('clickeado');
                    console.log(this);
                    console.log($(this).prop('checked'));
                    console.log(lstIntIdUniOrg);


                    $.post(
                        '/Reportes/GetCampPlanilla',
                        { lstIntIdUniOrg: lstIntIdUniOrg },
                        (response) => {
                            if (true) {
                                console.log(response);
                                response.forEach(element => {

                                    $('#chekeamePlanilla').append('<li role="presentation"><label class= "checkbox-inline" >' +
                                        '<input id="' + element.intIdPlanilla + '"type="checkbox" class="checkyPlanilla" name="responsive">' + element.strDesPlani +
                                        '</label></li >');
                                });

                            }
                        }
                    ).fail(function (result) {
                        alert('ERROR ' + result.status + ' ' + result.statusText);
                    });
                    $('#chekeamePlanilla').empty();

                })
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });
        $('#chekeame').empty();
    });

    $('#chekeame').on('click', function () {
        return;
        console.log(this);
        var id = $('.checky ').val();
        //if (id == 0 || !id) {
        //    $('#cbounidsupe').empty();
        //    $('#cbounidsupe').attr('disabled', true);

        //    return;
        //}

        $.post(
            '/Reportes/GetCampPlanilla',
            { intIdUniOrg: id },
            (response) => {
                if (true) {
                    console.log(response);
                    response.forEach(element => {

                        $('#chekeamePlanilla').append('<li role="presentation"><label class= "checkbox-inline" >' +
                            '<input id="' + element.intIdPlanilla + '"type="checkbox" class="icheckbox_flat-blue checkyPlanilla" name="responsive">' + element.strDesPlani +
                            '</label></li >');
                        init_checkBox_styles();
                    });

                }
            }
        ).fail(function (result) {
            alert('ERROR ' + result.status + ' ' + result.statusText);
        });
        $('#chekeamePlanilla').empty();
    });
}

function LlenarFizcalizacion() {

    $.post(
        '/Reportes/GetCampFizcalizacion',
        {},
        (response) => {


                response.forEach(element => {

                    $('#Fizcalizacion').append('<li role="presentation"><label class= "checkbox-inline" >' +
                        '<input id="' + element.intIdTipo + '"type="checkbox"  name="responsive">' + element.strDeTipo +
                        '</label></li >');
                });


        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
    $('#Fizcalizacion').empty();

}


//function habilitar_check() {
//    $('#chekeamePlanilla').on('click', function () {
//        var n = $('.checkyPlanilla:checked').length;
//        if (n > 0) {

//            $('#Periodo').prop('hidden', false);
//            init_checkBox_styles();
//        }
//        if (n == 0) {

//            $('#Periodo').prop('hidden', true);
//        }
//    });
//}
//function calcu_third_reportes() {

//    var m = $('#Periodo:checked').val();
//    alert(m);
//        if (m == 'on') {
//            $('#ValidacionPeriodo').attr('disabled', false);

//        }
//        if (m == undefined) {
//            $('#ValidacionPeriodo').attr('disabled', true);
//        }

//};

function allchecks() {


        var estado = $('#idcheck').is(':checked');

    if (estado == false) {
            $('#checking').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" checked />')
            $('#checking1').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" checked />')
            $('#checking2').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" checked />')
            $('#checking3').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" checked />')
            $('#checking4').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" checked />')
            $('#checking5').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" checked />')
            $('#checking6').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" checked />')



        } else {
            $('#checking').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" unchecked />')
            $('#checking1').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" unchecked />')
            $('#checking2').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" unchecked />')
            $('#checking3').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" unchecked />')
            $('#checking4').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" unchecked />')
            $('#checking5').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" unchecked />')
            $('#checking6').append('<input type="checkbox" id="idcheck1" style="float:right !important;" class="flat" unchecked />')

        }

}


function GetCampEntidades() {
    $.post(
        '/Configuracion/GetCampEntidades',
        {},
        (response) => {
            response.forEach(element => {
                $('#campEnt').append(
                    ' <option value="' + element.intIdEntid + '">' + element.strNomEntid + '</option>'
                );

            });
        }
    );
}

/***********************************/
/**Campos Adicionales
 /**********************************/

$('#btn-new-CamposAdicionales').on('click', function () {
    $('#btn-save-change-CamposAdicionales').show();
    $('#btn-update-CamposAdicionales').hide();
    $('.form-hide-CamposAdicionales').show();
    $.post(
        '/Configuracion/NuevoCamposAdicionales',
        {},
        (response) => {
            if (response !== '') {
                $('.form-hide-CamposAdicionales .x_content').empty();
                $('.form-hide-CamposAdicionales .x_content').html(response);
                $('.form-hide-CamposAdicionales').show();

            }
        }
    ).fail(function (result) {
        alert('ERROR ' + result.status + ' ' + result.statusText);
    });
});

/**************/
function INFO_MSJ(nomMantemiento, campo, response, msj, deta) {

    if ($('#cboJerarquia option:selected').val() !== '') {

        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        $('#notifry_errorpla').html('');
        $('#notifry_errorext').html('');
        new PNotify({
            title: 'Información de ' + nomMantemiento + '',
            text: msj,
            type: response,
            delay: 3000,
            styling: 'bootstrap3'
        });

        $('#' + campo + '').focus();
        $('#' + deta + '').html('' + msj + '');
        $('#' + campo + '').val('');

    }

    else {
        $('#notifry_error').html('');
        $('#notifry_errordes').html('');
        $('#notifry_errorpla').html('');
        $('#notifry_errorext').html('');
        new PNotify({
            title: 'Información de ' + nomMantemiento + '',
            text: msj,
            type: response,
            delay: 3000,
            styling: 'bootstrap3',

        });

        $('#' + deta + '').html('');

    }
}


$(function () {
    $('#datetimepicker3').datetimepicker({
        format: 'LT'
    });
});