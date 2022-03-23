<template>
    <div class="row">
    <!-- PANEL TABLA -->
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
            <div class="x_title">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <h2>Listado de Folios</h2>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="x_content">
                <div>
                    <table-loading v-if="loadinTableData" :columns="columns" :options="options" msg="Cargando folios" :checkboxshow="true" />
                    <v-client-table v-else
                        ref="tableGrid"
                        :data="tableData"
                        :columns="columns" 
                        :options="options">

                        <template slot="beforeTable">
                            <div class="ml-3">
                                <div class="icheck-material-blue">
                                    <input type="checkbox" :disabled="dataFolioPendiente.length==0" id="selecionartodoasrows" @click="checkSelecionarTodos()" >
                                    <label for="selecionartodoasrows">Seleccionar Todos ({{dataCheck.length}})</label>
                                </div>
                            </div>
                        </template>

                        <template  slot="afterFilterWrapper">
                            <div v-if="dataCheck.length>0" class="form-group form-inline pull-right">
                                <button type="buttom" class="btn btn-danger" @click="anularShowModalTodos()" :disabled="anularBtnDisable" >{{anularText}}</button>
                            </div>
                        </template> 
                         <template  slot="afterFilterWrapper">
                            <limit-table :data="tableData" />
                        </template> 
                        <template slot="check" slot-scope="props" >
                            <div v-if="props.row.strCoEstad=='01'" class="icheck-material-blue">
                                <input type="checkbox" v-model="dataCheck" :id="'tablerow'+props.row.intIdFolio" :value="props.row" @change="seleccionarPorItems(props.row)" >
                                <label :for="'tablerow'+props.row.intIdFolio"></label>
                            </div>
                        </template>
                        <template slot="opciones" slot-scope="props" >
                            <button  class="btn btn-success btn-xs" @click="getListarFolioDetalle(props.row)" >Ver</button>
                            <button v-if="props.row.strCoEstad=='02' || props.row.strCoEstad=='03'" class="btn btn-primary btn-xs" @click="getListarFolioLpn(props.row)" >LPN</button>
                            <button v-if="props.row.strCoEstad=='01'" @click="anularShowModal(props.row)" class="btn btn-danger btn-xs" ><i class="fa fa-trash-o"></i></button>
                        </template>
                        <template slot="strDeEstad" slot-scope="props">
                                <span v-if="props.row.strCoEstad=='01'" class="label label-danger">{{props.row.strDeEstad}}</span>
                                <span v-if="props.row.strCoEstad=='02'" class="label label-warning">{{props.row.strDeEstad}}</span>
                                <span v-if="props.row.strCoEstad=='03'"  class="label label-success">{{props.row.strDeEstad}}</span>
                                <span v-if="props.row.strCoEstad=='04'" class="label badge-light-label">{{props.row.strDeEstad}}</span>
                                <span v-if="props.row.strCoEstad!='01' && props.row.strCoEstad!='02' && props.row.strCoEstad!='03' && props.row.strCoEstad!='04'" class="label badge-light-primary">{{props.row.strDeEstad}}</span>
                        </template>

                    </v-client-table>
                </div>
            </div>

        </div>
        </div>

        <div class="modal fade bs-example-modal-lg" id="modaldetalle" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" >
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" ><span  >&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel" >Detalle del Folio N° {{dataFolioDetalleInfo.strCoFolio}}</h4>
                    </div>
                    <div class="modal-body mb-4 pb-4 min-height-350">
                          <table  id="tablaDetalleFolioData" class="table table-striped table-bordered table-responsive nowrap " cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Materia</th>
                                        <th>Cantidad</th>
                                        <th>Und. Medida</th>
                                        <th>Peso Total</th>
                                        <th>Almacén</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="loadinDetalleFolio">
                                        <td colspan="6" class="">
                                            <div class="min-height-300">
                                                <loading-general/>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>
                                <br><br><br>
                            </div>

                    </div>
                    <div class="modal-footer mt-4">
                        <button class="btn btn-default" data-dismiss="modal" >Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade bs-example-modal-lg" id="modaldetalleLpn" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" >
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" ><span  >&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Detalle LPN del Folio N° {{dataFolioDetalleInfo.strCoFolio}}</h4>
                    </div>

                    <div class="modal-body mb-4 pb-4 min-height-350">

                          <table  id="tablaDetalleLPNData" class="table table-striped table-bordered table-responsive nowrap " cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>LPN</th>
                                        <th>Cantidad</th>
                                        <th>Peso Total</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="loadinDetalleLPN">
                                        <td colspan="6" class="">
                                            <div class="min-height-300">
                                                <loading-general/>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>
                                <br><br><br>
                            </div>

                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-default" data-dismiss="modal" >Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import { Event } from 'vue-tables-2'
    export default {
        
        data(){
            return{
                controllerName:'Folio',
                
                strFiltro:'',
                intIdEstad:0,
                intIdCentroAlm:0,
                strNroPedido:'',
                intIdTienda:0,
                intIdTipoUso:5, 
                dttFechIni:moment().format('DD-MM-YYYY'),
                dttFechFin:moment().format('DD-MM-YYYY'),
                intIdCliente:0,
                bitObservado:0,

                loadinTableData:false,
                tableData:[],
                editData:{},
                errors:[],

                columns: ['check','opciones', 'strCoFolio', 'strTienda', 'strNroPedido','strOrdCli', 'strDeEstad','strUbiDestino', 'strCoCentroAlm', 'strNomSolic', 'strSitMater', 'strCreaFe','strCreaUsuar', 'dttFeReg'],
                options: {
                    columnsDropdown: true,
                    headings: {
                        check:'',
                        opciones:'Acción',
                        strCoFolio: 'Folio',
                        strTienda: 'Tienda',
                        strNroPedido: 'N° Pedido',
                        strOrdCli: 'Orden Cliente',
                        strDeEstad: 'Estado',
                        strUbiDestino: 'Destino',
                        strCoCentroAlm: 'Centro Alm.',
                        strNomSolic: 'Solicitante',
                        strSitMater: 'Sit',
                        strCreaFe: 'Fecha Creac',
                        strCreaUsuar: 'Usuario Creac',
                        dttFeReg: 'Fecha de Registro',
                    },
                    filterable: ['strCoFolio', 'strTienda', 'strNroPedido','strOrdCli', 'strDeEstad','strUbiDestino', 'strCoCentroAlm', 'strNomSolic', 'strSitMater', 'strCreaFe','strCreaUsuar', 'dttFeReg'],
                    ...this.configDataTableMix(),
                    orderBy: {
                        column: 'strCoFolio',
                        ascending: false
                    },
                    sortIcon:{ 
                        base:'glyphicon',
                        up:'glyphicon-chevron-up',
                        down:'glyphicon-chevron-down',
                        is:'glyphicon-sort' 
                    }
                },

                dataFolioDetalleInfo:{},

                loadinDetalleFolio:false,
                tableIdDetalleFolio:'tablaDetalleFolioData',
                dataTableDrawDetalleFolio: null, 
                dataDetalleModal:[],

                loadinDetalleLPN:false,
                tableIdDetalleLPN:'tablaDetalleLPNData',
                dataTableDrawDetalleLPN: null, 
                dataDetalleLPNModal:[],


                dataCheck:[],
                anularText:'Anular Todos',
                anularBtnDisable:false,

                dataFilter:[],
                dataIsFiltradoTable:false,

                intIdMenu:this.getSubMenuIdMix()
            }
        },
        created() {
            EventBus.$on('clickHeaderLink', (data) => {
                this.restControlInicial();
                this.getTableData();
                this.$refs.tableGrid.resetQuery()
            })
            EventBus.$on('eventNumeroDeFolioSearch', (data) => {
                this.strFiltro = data;
                this.getTableData();
            })
            EventBus.$on('eventNumeroDePedidoSearch', (data) => {
                this.strNroPedido = data;
                this.getTableData();
            })
            EventBus.$on('eventCboEstadoFolio', (data) => {
                this.intIdEstad = data;
                this.getTableData();
            })

            EventBus.$on('eventCboAlmacenSelect', (data) => {
                this.intIdCentroAlm = data;
                this.intIdCliente = 0;
                this.intIdTienda = 0;
                this.getTableData();
            })

            EventBus.$on('cboClienteSelect', (data) => {
                this.intIdCliente = data;
                this.intIdTienda = 0;
                this.getTableData();
            })
           
            EventBus.$on('eventCboTiendaSelect', (data) => {
                this.intIdTienda = data;
                this.getTableData();
            })
          
            EventBus.$on('eventRagoFechaFolioSearch', (data) => {
                this.dttFechIni = data.dttFechIniControl;
                this.dttFechFin = data.dttFechFinControl;
                this.getTableData();
            })
            Event.$on('vue-tables.filter', (data) => {
                this.filtroTableInput()
            })
        },
        computed: {
            dataFolioPendiente(){
                return this.tableData.filter((item, keyIndex)=> {
                    return item.strCoEstad=="01";
                })
            },
        },
        methods:{
            restControlInicial(){
                this.strFiltro='';
                this.intIdEstad=0;
                this.intIdCentroAlm=0;
                this.strNroPedido='';
                this.intIdTienda=0;
                this.intIdTipoUso=5; 
                this.dttFechIni=moment().format('DD-MM-YYYY');
                this.dttFechFin=moment().format('DD-MM-YYYY');
                this.intIdCliente=0;
                this.bitObservado=0;
            },
            getTableData(){
                this.dataIsFiltradoTable=false;
                const url = `/${this.controllerName}/GetTablaFolio`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    strFiltro:this.strFiltro,
                    intIdEstad:this.intIdEstad,
                    intIdCentroAlm:this.intIdCentroAlm,
                    strNroPedido:this.strNroPedido,
                    intIdTienda:this.intIdTienda,
                    intIdTipoUso:this.intIdTipoUso,
                    dttFechIni:this.dttFechIni,
                    dttFechFin:this.dttFechFin,
                    intIdCliente:this.intIdCliente,
                    bitObservado:this.bitObservado ? true : false
                }
                this.loadinTableData=true;
                axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    this.tableData = resp.data;
                    this.errors = []
                    this.loadinTableData=false;
                })
                .catch(error => {
                    this.loadinTableData=false;
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });
            },
            anularShowModal(data){
                let me = this;
                swal({
                    title: "Anular Folio",
                    text: "¿Está seguro de anular el Folio Nº " + data.strCoFolio + "?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, anular",
                    cancelButtonText: "No, cancelar",
                }).then(isConfirm=> {
                    me.actualizarEsadoFolioDB(data);
                }).catch(err=>{
                    <!--swal("Cancelado", "La Operación fue cancelada", "error");-->
                })
            },
            actualizarEsadoFolioDB(data){
                let me = this;
                const url = `/${this.controllerName}/ActualizarEstadoFolio`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intIdFolio: data.intIdFolio,
                    intIdEstad: 4
                }
                axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    this.messageResponse(resp.data,'Anular Folio') ;
                    this.errors = []
                    me.getTableData();
                })
                .catch(error => {
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });
            },
            messageResponse(data, title){
                if (data.type === 'success') {
                    new PNotify({
                        title: title,
                        text: data.message,
                        type: data.type,
                        delay: 3000,
                        styling: 'bootstrap3'
                    });
                }else {
                    if (data.type === 'error') {
                            new PNotify({
                                title: title,
                                text: data.message,
                                type: data.type,
                                delay: 3000,
                                styling: 'bootstrap3'
                            });
                    }
                }
            },
            getListarFolioDetalle(data){
                this.dataFolioDetalleInfo=data;
                let me = this;
                this.loadinDetalleFolio=true;
                $("#modaldetalle").modal('show');
                this.dataDetalleModal=[]

                const params = { 
                    intIdMenu:this.intIdMenu,
                    strFiltro:'',
                    intIdFolio:data.intIdFolio,
                }

                axios.post(`/${this.controllerName}/ListarFolioDetalle`, this.getFormDataMix(params))
                .then(resp => {
                    let response = resp.data;
                    this.loadinDetalleFolio=false;

                    if(!this.isArrayObjectMix(response)) {
                        return false;
                    }

                    this.dataDetalleModal = response;
                    this.errors = []
                    
                    if (this.dataTableDrawDetalleFolio !== null) {
                        this.dataTableDrawDetalleFolio.destroy();
                    }

                    this.dataTableDrawDetalleFolio = $(`#${this.tableIdDetalleFolio}`).DataTable({
                        ...me.dataTableLanguajeMix(),
                        data: response,
                        columns: [
                            { data: 'strCoMateria' },
                            { data: 'strDeMateria' },
                            { data: 'nmCantidad' },
                            { data: 'strUM' },
                            {data:'nmPesoTotal'},
                            {data:'strCoAlmac'}
                        ], 
                        order: [[1, 'asc']]
                    })
                })
                .catch(error => {
                    this.loadinDetalleFolio=false;
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });

            },
            getListarFolioLpn(data){
                this.dataFolioDetalleInfo=data;
                let me = this;
                this.loadinDetalleLPN=true;
                $("#modaldetalleLpn").modal('show');
                this.dataDetalleLPNModal=[]

                const params = { 
                    //data.intIdFolio,
                    intIdMenu:this.intIdMenu,
                    intIdFolio:data.intIdFolio
                }

                
                axios.post(`/${this.controllerName}/ListarFolioLpn`, this.getFormDataMix(params))
                .then(resp => {
                    let response = resp.data;
                    this.dataDetalleLPNModal=false;

                    if(!this.isArrayObjectMix(response)) {
                        return false;
                    }

                    this.dataDetalleLPNModal = response;
                    this.errors = []
                    
                    if (this.dataTableDrawDetalleLPN !== null) {
                        this.dataTableDrawDetalleLPN.destroy();
                    }
                    this.dataTableDrawDetalleLPN = $(`#${this.tableIdDetalleLPN}`).DataTable({
                        ...me.dataTableLanguajeMix(),
                        data: response,
                        columns: [
                            { data: 'strCoLpn' },
                            { data: 'nmCantidadTotal' },
                            { data: 'nmPesoTotal' },
                            { data: 'strDeEstad' },
                        ], 
                        order: [[0, 'desc']]
                    })
                })
                .catch(error => {
                    this.dataDetalleLPNModal=false;
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });
            },
            valueChecBox(data){
                return {intIdFolio:data.intIdFolio, intIdEstad:data.intIdEstad, strCoEstad:data.strCoEstad, strCoFolio:data.strCoFolio, strOrdCli:data.strOrdCli, bitFlEliminado:data.bitFlEliminado  };
            },
            seleccionarPorItems(data){
                let el = 'selecionartodoasrows';
                let checkBox = document.getElementById(el);

                let dataPendiente = this.dataFolioPendiente;

                if(this.dataIsFiltradoTable){

                    let dataTotal = this.$refs.tableGrid.allFilteredData;
                    let dataFiltrado = dataTotal.filter((item, keyIndex)=> {
                        return item.strCoEstad=="01";
                    })

                    this.dataFilter = dataFiltrado;

                    if(this.dataCheck.length === dataFiltrado.length){
                        checkBox.checked= true;
                    }else{
                        if(this.dataCheck.length==0){
                            checkBox.checked= false;
                        }
                    }
                }else{
                    if(this.dataCheck.length === dataPendiente.length){
                        checkBox.checked= true;
                    }else{
                        if(this.dataCheck.length==0){
                            checkBox.checked= false;
                        }
                        
                    }
                }
            },
            checkSelecionarTodos(){
                let el = 'selecionartodoasrows';
                let checkBox = document.getElementById(el);

                let dataPendiente = this.dataFolioPendiente;

                let dataTotal = this.$refs.tableGrid.allFilteredData;
                let dataFiltrado = dataTotal.filter((item, keyIndex)=> {
                    return item.strCoEstad=="01";
                })

                this.dataFilter = dataFiltrado;


                if(this.dataIsFiltradoTable){ // cuando es por filtro
                    let dataFiltrado = this.dataFilter;
                    if (checkBox.checked == true){
                        this.dataCheck=dataFiltrado;
                    }else{
                        this.dataCheck=[];
                        
                    }
                }else{
                    if (checkBox.checked == true){
                        this.dataCheck=dataPendiente;
                    }else{
                        this.dataCheck=[];
                    }
                }
               
            },
            anularShowModalTodos(){
                let me = this;
                swal({
                    title: "Anular Folio",
                    text: "¿Está seguro de anular todos los folios seleccionados?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, anular",
                    cancelButtonText: "No, cancelar",
                }).then(isConfirm=> {
                    me.anularFolioTodos();
                }).catch(err=>{
                    <!--swal("Cancelado", "La Operación fue cancelada", "error");-->
                })
            },
            anularFolioTodos(){
                let me = this;
                let el = 'selecionartodoasrows';
                let checkBox = document.getElementById(el);

                this.anularText='Anulando...';
                this.anularBtnDisable=true;

                let dataAnular = [];
                this.dataCheck.forEach((item, key) => {
                    dataAnular.push(this.valueChecBox(item))
                });

                if(dataAnular.length>0){
                    const url = `/${this.controllerName}/AnularFolioFor`;
                    $.post(url,{ intIdMenu:this.intIdMenu, objFolio: dataAnular },
                    (response) => {
                        me.anularText='Anular Todos';
                        me.anularBtnDisable=false;
                        me.messageResponse(response,"Anular Folio")
                        if (response.type === 'success') {
                            me.getTableData();
                            me.dataCheck=[];
                            let checkBoxinfo = document.getElementById("selecionartodoasrows");
                            checkBoxinfo.checked= false;
                        }
                       
                    }).fail((result) => {
                        me.anularBtnDisable=false;
                        me.anularText='Anular Todos';
                        alert('ERROR ' + result.status + ' ' + result.statusText);
                    });
                    
                }
                
            },
            filtroTableInput(){
                this.dataIsFiltradoTable=true;
                let el = 'selecionartodoasrows';
                let checkBox = document.getElementById(el);
                checkBox.checked = false;
                this.dataCheck=[]
                let dataTotal = this.$refs.tableGrid.allFilteredData;
                let dataFiltrado = dataTotal.filter((item, keyIndex)=> {
                    return item.strCoEstad=="01";
                })
                this.dataFilter = dataFiltrado;
            }
        },
        mounted() {
           this.getTableData();
        }
    }

</script>

<style >
.badge-light-label {
    color: #212529;
    background-color: #f8f9fa;
}
.daterangepicker td.active, .daterangepicker td.active:hover {
    background-color: #536A7F !important;
    color: #fff !important;
}
</style>