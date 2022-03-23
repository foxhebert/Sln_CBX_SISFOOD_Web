<template>
    <div class="row">
        <!-- PANEL TABLA -->
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <div class="col-md-8 col-sm-8 col-xs-8">
                        <h2>Listado de LPNs</h2>
                    </div>
                    <div class="col-md-4 col-sm-4 col-xs-4">
                        <div class="dropdown pull-right">
                            <button class="btn btn-primary demo-nmg" :disabled="!buttomExportDisable" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Exportar
                                <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dLabel">

                                <li class="mt-1"><a @click="export2Excel" class="cursor-pointer">Consolidado</a></li>
                                <li role="separator" class="divider"></li>
                                <li><a @click="export2ExcelLpn()" class="cursor-pointer">LPNs</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <table id="tablalpnData" class="table table-striped table-bordered table-responsive nowrap " cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>LPN</th>
                                <th>Materia</th>
                                <th>Denominación</th>
                                <th>Cantidad</th>
                                <th>U.M</th>
                                <th>Folio (Entrega)</th>
                                <th>Destinatario</th>
                                <th>Doc.Compra</th>
                                <th>N° de Pedido</th>
                                <th>Centro</th>
                                <th>Estado</th>
                                <th>Usuario Reg.</th>
                                <th>Fecha Reg.</th>
                                <th>Observación</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loadinTableData">
                                <td colspan="15" class="">
                                    <div class="min-height-300">
                                        <loading-general />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>


                </div>

                <!--Modal para el Editar-->

            </div>


        </div>
        <div class="modal fade bs-example-modal-sm" id="modalEditarLpn" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Editar Código LPN </h4>
                    </div>

                    <div class="modal-body">

                        <div class="form-group">
                            <label>Código (*)</label>
                            <br />
                            <input  v-model="descripcionUp" class="form-control"  placeholder="Escribe el Código" oninput ="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" type = "number"  maxlength = "18" />

                            
                           
                        </div>
                      
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success" @click="updateData()" id="SaveLPN">Actualizar</button>
                        <button class="btn btn-primary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>


        </div>

    </div>
</template>
<script>

export default {
    data(){
        return{
            controllerName:'Lpn',

            dttFeIni:moment().format('YYYY-MM-DD'),
            dttFeFin:moment().format('YYYY-MM-DD'),
            strCoFolio:'',
            strOrdPedi:'',
            strLPNMateria:'',
            strIDCentros:'',
            strIDClientes:'',
            strIDTiendas:'',
            bitObservados:true,
            strSoloExportable:'',

            codSoloExportable:'03',

            tableId:'tablalpnData',
            loadinTableData:false,
            dataTableDraw: null,
            tableData:[],
            editData:{},
            errors: [],

            descripcionUp: '',
            intIdLpnUp:null,

            loadinTableDataExport:false,

            styleHeaderTitle: {
                fill: {
                    fgColor : {
                        theme : 8,
                        tint : 0.3999755851924192,
                        rgb : 'B8CCE4'
                    }
                },
                font: {
                    sz: 13,
                    bold: true,
                    color: {
                        rgb: "#FF000000"
                    }
                },
                alignment: {
                    vertical: "center",
                    horizontal: "left",
                    indent: 0,
                    wrapText: false
                },
                numFmt:'@'
            },
             styleHeaderTitleTotal: {
                fill: {
                    fgColor : {
                        theme : 8,
                        tint : 0.3999755851924192,
                        rgb : 'B8CCE4'
                    }
                },
                font: {
                    sz: 13,
                    bold: true,
                    color: {
                        rgb: "#FF000000"
                    }
                },
                alignment: {
                    vertical: "center",
                    horizontal: "left",
                    indent: 0,
                    wrapText: false
                },
                numFmt:'@'
            },

            styleHeaderTitleRight: {
                alignment: {
                    vertical: "center",
                    horizontal: "right",
                    indent: 0,
                    wrapText: false
                }
            },
            styleHeaderTitleRightTotalNegrita: {
                //fill: {
                //    fgColor : {
                //        theme : 8,
                //        tint : 0.3999755851924192,
                //        rgb : 'B8CCE4'
                //    }
                //},
                //font: {
                //    sz: 13,
                //    bold: true,
                //    color: {
                //        rgb: "#FF000000"
                //    }
                //},
                alignment: {
                    vertical: "center",
                    horizontal: "right",
                    indent: 0,
                    wrapText: false
                }
            },
            styleHeaderTitleRightNegrita: {
                font: {
                   // sz: 13,
                    bold: true,
                    color: {
                        rgb: "#FF000000"
                    }
                },
                alignment: {
                    vertical: "center",
                    horizontal: "right",
                    indent: 0,
                    wrapText: false
                }
            },
            styleHeaderTitleRightNegritaLeft: {
                font: {
                   // sz: 13,
                    bold: true,
                    color: {
                        rgb: "#FF000000"
                    }
                },
                alignment: {
                    vertical: "center",
                    horizontal: "left",
                    indent: 0,
                    wrapText: false
                }
            },

            dataArrayPorTiendaShow:[],

            intIdMenu:this.getSubMenuIdMix()
        }
    },
    created() {
        EventBus.$on('clickHeaderLink', (data) => {
            this.restControlInicial();
            this.getTableData();
        })
        EventBus.$on('eventRagoFechaFolioSearch', (data) => {
            this.dttFeIni = data.dttFechIniControl;
            this.dttFeFin = data.dttFechFinControl;
            this.getTableData();
        })
        EventBus.$on('eventfiltroLpnOMateria', (data) => {
            this.strLPNMateria = data;
            this.getTableData();
        })
        EventBus.$on('eventEmitNumeroDeFolio', (data) => {
            this.strCoFolio = data;
            this.getTableData();
        })
        EventBus.$on('eventSoloFolioExportable', (data) => {
            if(data){
                this.strSoloExportable ='03';
            }else{
                this.strSoloExportable ='';
            }
            this.getTableData();
        })
        EventBus.$on('eventSoloObservados', (data) => {
            this.bitObservado=data;
            this.getTableData();
        })
        EventBus.$on('NumeroDePedidoOC', (data) => {
            this.strOrdPedi = data;
            this.getTableData();
        })
        EventBus.$on('eventCboCentroAlmacenSelectMultiple', (data) => {
            this.strIDCentros = data;
            this.strIDClientes = '';
            this.strIDTiendas = '';
            this.getTableData();
        })
        EventBus.$on('eventCboClienteSelectMultiple', (data) => {
            this.strIDClientes = data;
            this.strIDTiendas = '';
            this.getTableData();
        })
        EventBus.$on('eventCboTiendaSelectMultiple', (data) => {
            this.strIDTiendas = data;
            this.getTableData();
        })


    },
    computed:{
        dataSoloExportables(){
            return  this.tableData.filter((item, keyIndex)=> {
                return item.strCodEstadFOLIO==this.codSoloExportable
            })
        },
        buttomExportDisable(){
            if(this.dataSoloExportables.length){
                return true
            }
            return false
        }
    },
    methods:{
        restControlInicial(){
            this.dttFeIni=moment().format('YYYY-MM-DD');
            this.dttFeFin=moment().format('YYYY-MM-DD');
            this.strCoFolio='';
            this.strOrdPedi='';
            this.strLPNMateria='';
            this.strIDCentros='';
            this.strIDClientes='';
            this.strIDTiendas='';
            this.bitObservados=true;
            this.strSoloExportable='';
            this.codSoloExportable='03';
        },
        getTableData(){
            let me = this;
            const url = `/${this.controllerName}/GetTablaLpn`;
            const params = {
                intIdMenu:this.intIdMenu,
                dttFeIni:this.dttFeIni,
                dttFeFin:this.dttFeFin,
                strCoFolio:this.strCoFolio,
                strOrdPedi:this.strOrdPedi,
                strLPNMateria:this.strLPNMateria,
                strIDCentros:this.strIDCentros,
                strIDClientes:this.strIDClientes,
                strIDTiendas:this.strIDTiendas,
                bitObservados:this.bitObservado ? true : false,
                strSoloExportable:this.strSoloExportable,
            }
            this.loadinTableData=true;

            axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    let response = resp.data;
                    this.loadinTableData=false;

                    if(!this.isArrayObjectMix(response)) {
                        return false;
                    }

                    this.tableData = response;
                    this.errors = []

                    if (this.dataTableDraw !== null) {
                        this.dataTableDraw.destroy();
                    }


                    this.dataTableDraw = $(`#${this.tableId}`).DataTable({
                        ...me.dataTableLanguajeMix(),
                        data: response,
                        columns: [
                            { data: 'strCoLpn' },
                            { data: 'strCoMateria' },
                            { data: 'strDeMateria' },
                            { data: 'nmCantidad' },
                            { data: 'strUniMed' },
                            { data: 'strCoFolio' },
                            { data: 'strDestinatario' },
                            { data: 'strOrdCli' },
                            { data: 'strNroPedido' },
                            { data: 'strCoCentroAlm' },
                            { data: 'strDeEstadLPN' },
                            { data: 'strUsUsuar' },
                            { data: 'dttFeReg' },
                            { data: 'strDeMotivoObs' },
                            { data: null},

                        ],
                          columnDefs: [
                            {
                                targets: 14,
                                render: function (data, type, item) {
                                    return `<button class="btn btn-success btn-xs btn-edit-event" dataid="${item.intIdLpn}" strdescripcion="${item.strCoLpn}"><i class="fa fa-pencil"></i> Editar </button>
                                            <button class="btn btn-primary btn-xs btn-delete-event" dataid="${item.intIdLpn}" strdescripcion="${item.strCoLpn}"><i class="fa fa-trash-o"></i> Eliminar </button>`;
                                }
                            }
                        ],
                  order: [],
                    });
                })
                .catch(error => {
                    this.loadinTableData=false;
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });
        },
        generarTotalPorTienda(lpnDataArray,CodTiendaGroup){
            let totaTienda = null;
            const dataTotalPorTiendaArray =  lpnDataArray.filter((item, keyIndex)=> {
                return item.CodTiendaGroup===CodTiendaGroup
            })
            totaTienda = dataTotalPorTiendaArray.sumaTotal('nmCantidad');
            return totaTienda
        },
        export2Excel() {
            let me= this;
            let filename = "Consolidados_"+moment().format('DDMMYYYYhmmss')

            const url = `/${this.controllerName}/ListarLpnDetExportConsolidado`;
            const params = {
                intIdMenu:this.intIdMenu,
                dttFeIni:this.dttFeIni,
                dttFeFin:this.dttFeFin,
                strCoFolio:this.strCoFolio,
                strOrdPedi:this.strOrdPedi,
                strLPNMateria:this.strLPNMateria,
                strIDCentros:this.strIDCentros,
                strIDClientes:this.strIDClientes,
                strIDTiendas:this.strIDTiendas,
                bitObservados:this.bitObservado ? true : false,
                strSoloExportable:this.strSoloExportable,
            }

            this.loadinTableDataExport=true;

            axios.post(url, this.getFormDataMix(params))
            .then(resp => {
                let dataExport = resp.data;

                const dataRaw = this.formatJsonExcel(dataExport)
                const dataAgrupadoExportar = []
                if(dataRaw.length<=0){
                    return false
                }

                //const grpData = _.groupBy(_.sortBy(dataRaw, "CodTiendaGroup"), 'CodTiendaGroup');


                let grupoTienda = _.chain(dataRaw)
                .groupBy('CodTiendaGroup')
                .value();

                //INICIO 03/07/2020
                me.forEachObjectMix(grupoTienda, (valueTienda, propTienda, objTienda)=> {
                    me.forEachObjectMix(valueTienda,(valuePedido, propPedido, objPedido)=> {
                       // comentado ES 05.07.2020
                        dataAgrupadoExportar.push(this.returtNuevoObjeto(valuePedido))
                    })
                    let totalTienda = this.generarTotalPorTienda(dataRaw,propTienda)
                    //comentado ES 03.07.2020
                    //dataAgrupadoExportar.push(this.returtTotalObjeto(propTienda, totalTienda.toFixed(2)))
                })


                //if(dataAgrupadoExportar.length>0){
                //    //comentado ES 03.07.2020
                //    //dataAgrupadoExportar.push(this.returtTotalObjeto('general', ""+dataRaw.sumaTotal('nmCantidad')))
                //}
                //FIN

                let lpnWS = this.$xlsx.utils.json_to_sheet(dataAgrupadoExportar)

                let range = this.$xlsx.utils.decode_range(lpnWS['!ref']);

                lpnWS["A1"].s = this.styleHeaderTitle
                lpnWS["B1"].s = this.styleHeaderTitle
                lpnWS["C1"].s = this.styleHeaderTitle
                lpnWS["D1"].s = this.styleHeaderTitle
                lpnWS["E1"].s = this.styleHeaderTitle
                lpnWS["F1"].s = this.styleHeaderTitle
                lpnWS["G1"].s = this.styleHeaderTitle

                let contadorParaEstiloTotalGeneral=1;
                dataAgrupadoExportar.forEach((element, key) => {
                    var str = element.TDA;
                    let nEncontrado = str.includes("Total");


                    if(key==0){
                        lpnWS["H1"].s = this.styleHeaderTitle
                    }else{
                        lpnWS[`A${key+1}`].s = this.styleHeaderTitleRightNegritaLeft
                        lpnWS[`B${key+1}`].s = this.styleHeaderTitleRightNegrita
                        lpnWS[`F${key+1}`].s = this.styleHeaderTitleRightNegrita
                        lpnWS[`D${key+1}`].s = this.styleHeaderTitleRightNegrita
                        lpnWS[`C${key+1}`].s = this.styleHeaderTitleRight
                        lpnWS[`E${key+1}`].s = this.styleHeaderTitleRight

                    }

                    if(nEncontrado){
                        lpnWS[`H${key+2}`].s = this.styleHeaderTitleRightNegrita
                    }else{
                        lpnWS[`H${key+2}`].s = this.styleHeaderTitleRight
                    }

                    contadorParaEstiloTotalGeneral+=1;
                })

                lpnWS[`A${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleRightNegritaLeft
                lpnWS[`B${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleRightNegrita
                lpnWS[`C${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleRight
                lpnWS[`D${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleRightNegrita
                lpnWS[`E${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleRight
                lpnWS[`F${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleRightNegrita
                //lpnWS[`G${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleTotal
                lpnWS[`H${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleRight

                //lpnWS[`A${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleTotal
                //lpnWS[`B${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleTotal
                //lpnWS[`C${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleTotal
                //lpnWS[`D${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleTotal
                //lpnWS[`E${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleTotal
                //lpnWS[`F${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleTotal
                //lpnWS[`G${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleTotal
                //lpnWS[`H${contadorParaEstiloTotalGeneral}`].s = this.styleHeaderTitleRightTotalNegrita

                let wscols = [
                    {wch:22},
                    {wch:20},
                    {wch:20},
                    {wch:10},
                    {wch:15},
                    {wch:12},
                    {wch:40},
                    {wch:10},
                ]

                lpnWS['!cols'] = wscols

                var wb = this.$xlsx.utils.book_new()
                this.$xlsx.utils.book_append_sheet(wb, lpnWS, 'Hoja 1')

                var wbout = this.$xlsxStyle.write(wb,{ bookType: 'xlsx', type: 'binary' });
                this.$fileSaver.saveAs(new Blob([this.s2ab(wbout)], { type: "" }), `${filename}.xlsx`);


                this.loadinTableDataExport=false;
            })
            .catch(error => {
                console.log(error)
                this.loadinTableDataExport=false;
                if (error.response.status == 422) {
                    this.errors = error.response.data.errors;
                }
            })

        },
        formatJsonExcel(jsonData) {
            return jsonData.map(obj=> {
                return {
                    CodTiendaGroup: obj.CodTiendaGroup,
                    strCoTienda: obj.strCoTienda,
                    strDesTienda: obj.strDesTienda,
                    strNroPedido: obj.strNroPedido,
                    strCoEntrega: obj.strCoEntrega,
                    strCoLpn: obj.strCoLpn,
                    strCoMateria: obj.strComateria,
                    strDeMateria: obj.strDeMateria,
                    nmCantidad: obj.nmCantidad,
                    cantidadString: obj.cantidadString
                }
            });
        },
        returtNuevoObjeto(obj){
             return {
                    'TDA': obj.strCoTienda,
                    'Nom.dest.mercancías': obj.strDesTienda,
                    'Nº de pedido':obj.strNroPedido ,
                    'Entrega': obj.strCoEntrega,
                    'LPN': obj.strCoLpn,
                    'Materia': obj.strCoMateria,
                    'Denominación': obj.strDeMateria,
                    'Total': obj.cantidadString
            }
        },
        returtTotalObjeto(strCoTienda, total){
             return {
                    'TDA': 'Total '+strCoTienda,
                    'Nom.dest.mercancías':'',
                    'Nº de pedido': '',
                    'Entrega':  '',
                    'LPN': '',
                    'Materia': '',
                    'Denominación': '',
                    'Total': total
            }
        },
        export2ExcelLpn(){
            let filename = "LPN_"+moment().format('DDMMYYYYhmmss');

            const dataExport =  this.tableData.filter((item, keyIndex)=> {
                return item.strCodEstadFOLIO=="03";
            })

            const dataNotDuplicado = this.eliminarObjetosDuplicadosMix(dataExport,'strCoLpn')

            const data = this.formatJsonExcelLpn(dataNotDuplicado);

            let lpnWS = this.$xlsx.utils.json_to_sheet(data)

            let range = this.$xlsx.utils.decode_range(lpnWS['!ref']);



            lpnWS["A1"].s = this.styleHeaderTitle
            lpnWS["B1"].s = this.styleHeaderTitle
            lpnWS["C1"].s = this.styleHeaderTitle
            lpnWS["D1"].s = this.styleHeaderTitle
            lpnWS["E1"].s = this.styleHeaderTitle
            lpnWS["F1"].s = this.styleHeaderTitle
            lpnWS["G1"].s = this.styleHeaderTitle

            var wscols = [
                {wch:8},
                {wch:15},
                {wch:20},
                {wch:30},
                {wch:25},
                {wch:12},
                {wch:12},
            ];

            lpnWS['!cols'] = wscols;


            var wb = this.$xlsx.utils.book_new()
            this.$xlsx.utils.book_append_sheet(wb, lpnWS, 'Hoja 1')
            var wbout = this.$xlsxStyle.write(wb,{ bookType: 'xlsx', type: 'binary' });
            this.$fileSaver.saveAs(new Blob([this.s2ab(wbout)], { type: "" }), `${filename}.xlsx`);
        },
        formatJsonExcelLpn(jsonData){
            return jsonData.map(obj=> {
                return {
                    'Centro': obj.strCoCentroAlm,
                    'Cliente': obj.strDesCliente,
                    'TDA': obj.strCoTienda,
                    'Nom.dest.mercancías': obj.strDesTienda,
                    'Nº de pedido': obj.strNroPedido,
                    'Entrega': obj.strCoFolio,
                    'LPN': obj.strCoLpn
                }
            });
        },
        s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        },
        getDataEdit(data) {

            $('#modalEditarLpn').modal('show');
            this.descripcionUp = data.strDescription
            this.intIdLpnUp = data.idItem
            //$('#txtcodigoLPN').val(strDescription);
        },
        updateData() {
            let me = this;
            if (this.intIdLpnUp === null) {
                new PNotify({
                    title: 'Actualizar LPN',
                    text: '',
                    type: 'info',
                    delay: 3000,
                    styling: 'bootstrap3',
                    addclass: 'dark'
                });
                return false;
            }



            if (this.descripcionUp.length <= 2 ) {
                new PNotify({
                    title: 'Actualizar LPN',
                    text: 'Complete los campos obligatorios',
                    type: 'info',
                    delay: 3000,
                    styling: 'bootstrap3',
                    addclass: 'dark'
                });
                return false;
            }



            $.post(
                '/Lpn/EditarLpn',
                { intIdMenu: this.intIdMenu, strCoLpn: this.descripcionUp, intIdLpn: this.intIdLpnUp },
                (response) => {
                    me.messageResponse(response, "Actualizar LPN")
                    if (response.type === 'success') {

                        me.getTableData();
                        $('#modalEditarLpn').modal('hide');
                    }

                }).fail((result) => {
                    alert('ERROR ' + result.status + ' ' + result.statusText);
                });

        },

        deleteShowModal(data) {
            let me = this;
            swal({
                title: "Eliminar LPN",
                text: `¿Está seguro de eliminar el LPN "${data.strDescription}"?`,
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "No, cancelar",
            }).then(isConfirm => {
                me.deleteItemBD(data);
            }).catch(err => {
                <!--swal("Cancelado", "La Operación fue cancelada", "error");-->
            })
        },
        deleteItemBD(data) {
            let me = this;
            const url = `/${this.controllerName}/EliminarLpn`;
            const params = {
                intIdMenu: this.intIdMenu,
                intIdLpn: data.idItem,
            }
            axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    console.log(resp);
                    this.messageResponse(resp.data, 'Eliminar LPN');
                    this.errors = []
                    me.getTableData();

                })
                .catch(error => {
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });


        },
        messageResponse(data, title) {
            if (data.type === 'success') {
                new PNotify({
                    title: title,
                    text: data.message,
                    type: data.type,
                    delay: 3000,
                    styling: 'bootstrap3'
                });
            } else {
                if (data.type === 'error') {
                    new PNotify({
                        title: title,
                        text: data.message,
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                }
            }
        },
        initAcctionButtom() {
            let me = this;
            $(`#${this.tableId} tbody`).on('click', 'tr button.btn-edit-event', function () {
                let idEdit = $(this).attr("dataid")
                let strDescription = $(this).attr("strdescripcion")
                if (!isNaN(idEdit)) {
                    me.getDataEdit({ idItem: idEdit, strDescription: strDescription })
                }
            })
            $(`#${this.tableId} tbody`).on('click', 'tr button.btn-delete-event', function () {
                let idDelete = $(this).attr("dataid")

                let strDescription = $(this).attr("strdescripcion")

                if (!isNaN(idDelete)) {
                    let dataDelete = { strDescription: strDescription, idItem: idDelete }
                    me.deleteShowModal(dataDelete)
                }
            })

        }

    },
    mounted(){
        this.getTableData()
        this.initAcctionButtom()
    }
}
</script>