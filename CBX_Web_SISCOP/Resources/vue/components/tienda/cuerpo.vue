<template>
    <div class="row">
        <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Listado de Tiendas</h2>
                    <ul class="nav navbar-right panel_toolbox">
                        <li>
                            <button type="button" id="btnNewRegister" @click="showFormRegister(true)" class="btn btn-primary">Nueva Tienda</button>
                        </li>
                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    
                     <table id="tablaTiendaData" class="table table-striped table-bordered table-responsive nowrap " cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descripción</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loadinTableData">
                                <td colspan="5" class="">
                                    <div class="min-height-300">
                                        <loading-general/>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>


                </div>
            </div>
        </div>


        <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
            <div class="form-hide-Empresa" v-if="registerState || editState">

                <div class="x_panel">

                    <div class="x_title">
                        <h2>Información de Tienda</h2>
                        <ul class="nav navbar-right panel_toolbox">
                            <li>
                                <button type="button" class="btn btn-primary" v-if="!editState" @click="registerAction()" >Guardar</button>
                                <button type="button" class="btn btn-success" v-if="editState" @click="updateData(editData)" >Actualizar</button>
                            </li>
                            <li>
                                <button type="button" id="btnCancelRegister" @click="showFormRegister(false)" class="btn btn-dark" >Cancelar</button>
                            </li>
                        </ul>
                        <div class="clearfix"></div>
                    </div>

                    <div class="x_content">
      
                        <form ref="formControl" class="form-horizontal form-label-left">
                            
                            <div class="row">
                                <div class="col-md-12 col-sm-12 col-xs-12">
                                   <div class="flex-end-form-switcher">
                                        <div class="flex-form-switcher">
                                            <div class="form-switcher">
                                                <input type="checkbox" name="switcher-c" id="switcher-c" v-model="regEstado" checked="">
                                                <label class="switcher" for="switcher-c"></label>
                                            </div>
                                            <label class="mr-l-5">Activo</label>
                                        </div>
                                   </div>
                                </div>
                            </div>


                            <div class="row">
                                <div class="border-section">
                                    <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative">
                                            <label>Código (*)</label>
                                            <input type="text" v-model="regCodigo" class="form-control" placeholder="Código" @keydown.space.prevent  :maxlength="getColumnLength('strCoTienda')">
                                            <div class="notifry_error_div" >{{codigoError}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative">
                                            <label>Descripción (*)</label>
                                            <input type="text" v-model="regDescripcion" class="form-control" placeholder="Descripción " :maxlength="getColumnLength('strDesTienda')">
                                            <div class="notifry_error_div" >{{descripcionError}}</div>
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative">
                                            <label>Cliente (*)</label>
                                            <select-cliente-input v-model="regIdCliente"  :register="true" />
                                            <div class="notifry_error_div" ></div>
                                        </div>
                                    </div>
                                     <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative">
                                            <label>Código externo (*)</label>
                                            <input type="text" v-model="regLpn"  class="form-control" placeholder="Código externo" :maxlength="getColumnLength('strCoTDA')">
                                            <div class="notifry_error_div" ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </form>
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
                controllerName:'Tienda',
                cbxTipo:0,
                cbxEstado:1,
                querySearch:'',
                registerState:false,
                editState:false,

                tableId:'tablaTiendaData',
                loadinTableData:false,
                dataTableDraw: null,
                tableData:[],
                editData:{},
                errors:[],

                //campos
                regEstado:true,
                regCodigo:'',
                regDescripcion:'',
                regIdCliente:0,
                regLpn:'',
                dataCaractere:[],

                codigoError:'',
                descripcionError:'',
                
                columns: ['strCoTienda', 'strDesTienda', 'strDesCliente','FlActivo.strEstadoActivo','opciones'],
                options: {
                    headings: {
                        strCoTienda: 'Código',
                        strDesTienda: 'Descripción',
                        strDesCliente: 'Cliente',
                        'FlActivo.strEstadoActivo': 'Estado',
                        opciones:'Acción'
                    },
                    filterable: ['strCoTienda', 'strDesTienda', 'strCoTienda'],
                    ...this.configDataTableMix(),
                    orderBy: {
                        column: 'strDesTienda',
                        ascending: true
                    }
                },

                intIdMenu:this.getSubMenuIdMix()
            }
        },
        created() {
            EventBus.$on('clickHeaderLink', (data) => {
                this.restControlInicial();
                this.editState=false;
                this.registerState=false;
                this.getTableData();
            })
            EventBus.$on('cboClienteSelect', (data) => {
                this.cbxTipo = data;
                this.getTableData();
            })
            EventBus.$on('cboEstadoSelect', (data) => {
                this.cbxEstado = data;
                this.getTableData();
            })
            EventBus.$on('querySearchMain', (data) => {
                this.querySearch = data;
                this.getTableData();
            })
        },
        methods:{
            restControlInicial(){
                this.cbxTipo=0;
                this.cbxEstado=1;
                this.querySearch='';
            },
            showFormRegister(state){
                this.editState=false;
                this.registerState=state;
                this.cleanControl();
            },
            cleanControl(){
                    this.regCodigo='';
                    this.regDescripcion='';
                    this.regLpn='';

                    this.codigoError='';
                    this.descripcionError='';

                    this.regIdCliente=0;
                    this.regEstado=true;
            },
            setErrorForm(response){
                this.codigoError='',
                this.descripcionError='';

                if (response.type === 'codigo') {
                    this.codigoError=response.message;
                }
                if (response.type === 'descripcion') {
                    this.descripcionError=response.message;
                }
            },
            registerAction(){
                
                if(this.regCodigo.length <1  || this.regDescripcion.length <1 || this.regIdCliente=='0' || this.regLpn <1 ){
                    new PNotify({
                            title: 'Nueva Tienda',
                            text: 'Complete los campos obligatorios',
                            type: 'info',
                            delay: 3000,
                            styling: 'bootstrap3',
                            addclass: 'dark'
                        });
                        return  false;
                }
            
                const ObjTiendaData = {
                    intIdTienda:0,
                    strCoTienda:this.regCodigo,
                    strDesTienda:this.regDescripcion,
                    strCoTDA:this.regLpn,
                    intIdCliente:this.regIdCliente,
                    strTiendaCampo1:null,
                    strTiendaCampo2:null,
                    strTiendaCampo3:null,
                    strTiendaCampo4:null,
                    strTiendaCampo5:null,
                    bitFlActivo:this.regEstado ? true:false,
                }

                axios.post(`/${this.controllerName}/RegistrarNuevoTienda`,  { intIdMenu:this.intIdMenu, ObjTienda: ObjTiendaData })
                .then(resp => {
                    let response = resp.data;
                    this.messageResponse(response,"Nueva Tienda")
                    if (response.type === 'success') {
                        this.getTableData();
                        this.cleanControl();
                        this.editState=false;
                        this.registerState=false;
                    }
                    this.setErrorForm(response);
                })
                .catch(error => {
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                })
            },
            getTableData(){
                let me = this;
                const url = `/${this.controllerName}/GetTablaTienda`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intActivo: this.cbxEstado,
                    strDescripcion: this.querySearch,
                    intIdCliente: this.cbxTipo
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
                            { data: 'strCoTienda' },
                            { data: 'strDesTienda' },
                            { data: 'strDesCliente' },
                            { data: 'FlActivo.strEstadoActivo' },
                            {data:null}
                        ], 
                        columnDefs: [            
                            {
                                targets: 4,
                                render: function (data, type, item) {
                                    return `<button class="btn btn-success btn-xs btn-edit-event" dataid="${item.intIdTienda}" ><i class="fa fa-pencil"></i> Editar </button> 
                                            <button class="btn btn-primary btn-xs btn-delete-event" dataid="${item.intIdTienda}" strdescripcion="${item.strDesTienda}" data="${item}" ><i class="fa fa-trash-o"></i> Eliminar </button>`;
                                }
                            }
                        ],
                        order: [[3, 'asc'], [1, 'asc']]
                    })
                })
                .catch(error => {
                    this.loadinTableData=false;
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });
            },
            getDataEdit(data){
                
                this.editData = {};

                const url = `/${this.controllerName}/GetTiendaPorId`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intIdTienda: data.idItem,
                }
                axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    this.editData = resp.data[0];
                    this.editState=true;
                    this.errors = []

                    this.cleanControl();
                    let dataInfo = this.editData;
                    this.regCodigo=dataInfo.strCoTienda;
                    this.regDescripcion=dataInfo.strDesTienda;
                    this.regLpn=dataInfo.strCoTDA;
                    this.regIdCliente=dataInfo.intIdCliente;
                    this.regEstado=dataInfo.FlActivo.bitFlActivo ;
                })
                .catch(error => {
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });
            
            },
            updateData(data){
                let me = this;

                if(this.regCodigo.length <1  || this.regDescripcion.length <1 || this.regIdCliente=='0' || this.regLpn <1 ){
                    new PNotify({
                            title: 'Actualizar Tienda',
                            text: 'Complete los campos obligatorios',
                            type: 'info',
                            delay: 3000,
                            styling: 'bootstrap3',
                            addclass: 'dark'
                        });
                        return  false;
                }

                const ObjTienda = {
                    intIdTienda:data.intIdTienda,
                    strCoTienda:this.regCodigo,
                    strDesTienda:this.regDescripcion,
                    strCoTDA:this.regLpn,
                    intIdCliente:this.regIdCliente,
                    strTiendaCampo1:data.strTiendaCampo1,
                    strTiendaCampo2:data.strTiendaCampo2,
                    strTiendaCampo3:data.strTiendaCampo3,
                    strTiendaCampo4:data.strTiendaCampo4,
                    strTiendaCampo5:data.strTiendaCampo5,
                    bitFlActivo:this.regEstado ? true:false,
                    bitFlEliminado:data.bitFlEliminado,
                    intIdUsuarReg:data.intIdUsuarReg,
                    intIdUsuarModif:data.intIdUsuarModif,
                }

                axios.post(`/${this.controllerName}/UpdateTienda`,  {intIdMenu:this.intIdMenu, ObjTienda: ObjTienda })
                .then(resp => {
                    let response = resp.data;
                    this.messageResponse(response,"Actualizar Tienda")
                    if (response.type === 'success') {
                        this.getTableData();
                        this.cleanControl();
                        this.editState=false;
                        this.registerState=false;
                    }
                    this.setErrorForm(response);
                })
                .catch(error => {
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                })

 
            },
            deleteShowModal(data){
                let me = this;
                swal({
                    title: "Eliminar Tienda",
                    text: `¿Está seguro de eliminar la tienda "${data.strDescription}"?`,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "No, cancelar",
                }).then(isConfirm=> {
                    me.deleteItemBD(data);
                }).catch(err=>{
                    <!--swal("Cancelado", "La Operación fue cancelada", "error");-->
                })
            },
            deleteItemBD(data){
                const url = `/${this.controllerName}/EliminarTienda`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intIdTienda: data.idItem,
                }
                axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    this.messageResponse(resp.data,'Eliminar Tienda') ;
                    this.errors = []
                    this.getTableData();
                    this.cleanControl();
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });

                
            },
            getMaestroCaracteres(){
                const url = `/${this.controllerName}/getMaestroCaracteres`;
                axios.post(url)
                .then(resp => {
                    this.dataCaractere = resp.data;
                    this.errors = []
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });
            },
            getColumnLength(name){
                if (this.dataCaractere.find(e => e.strColumnName == name)){
                   let position= this.dataCaractere.findIndex(e=> e.strColumnName==name);
                    if(!isNaN(position)){
                        let dataColumn = this.dataCaractere[position];
                        return dataColumn.intMaxLength;
                    }
                }
                return 0;
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
            initAcctionButtom(){
                let me = this;
                $(`#${this.tableId} tbody`).on('click', 'tr button.btn-edit-event', function () {
                    let idEdit = $(this).attr("dataid")
                    if (!isNaN(idEdit)) {
                        me.getDataEdit({idItem:idEdit})
                    }
                }) 
                $(`#${this.tableId} tbody`).on('click', 'tr button.btn-delete-event', function () {
                    let idDelete = $(this).attr("dataid")
                    let strDescription = $(this).attr("strdescripcion")
                    if (!isNaN(idDelete)) {
                        let dataDelete ={strDescription:strDescription,idItem:idDelete}
                        me.deleteShowModal(dataDelete)
                    }
                })
            }
           
        },
        mounted() {
           this.getTableData();
           this.initAcctionButtom();
           this.getMaestroCaracteres();
        }
    }
</script>