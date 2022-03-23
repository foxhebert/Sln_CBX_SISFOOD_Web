<template>
    <div class="row">
        <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Listado de Clientes</h2>
                    <ul class="nav navbar-right panel_toolbox">
                        <li>
                            <button type="button" id="btnNewRegister" @click="showFormRegister(true)" class="btn btn-primary">Nuevo Cliente</button>
                        </li>
                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">

                    <table id="tablaClienteData" class="table table-striped table-bordered table-responsive nowrap " cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descripción</th>
                                <th>Centro de almacenamiento</th>
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
                        <h2>Información del Cliente</h2>
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
                                            <input type="text" v-model="regCodigo" class="form-control" placeholder="Código" @keydown.space.prevent :maxlength="getColumnLength('strCoCliente')">
                                            <div class="notifry_error_div" >{{codigoError}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative">
                                            <label>Descripción (*)</label>
                                            <input type="text" v-model="regDescripcion" class="form-control" placeholder="Descripción " :maxlength="getColumnLength('strDesCliente')">
                                            <div class="notifry_error_div" >{{descripcionError}}</div>
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative">
                                            <label>Centro de Almacenamiento (*)</label>
                                            <select-centro-almacen v-model="regCentroAlm"  :int-id-filtro-grupo="0" :register="true" />
                                            <div class="notifry_error_div" ></div>
                                        </div>
                                    </div>
                                     <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative">
                                            <label>LPN Raíz (*)</label>
                                            <input type="text" v-model="regLpn"  class="form-control" placeholder="LPN" :maxlength="getColumnLength('strLPNRaiz')" @keypress="isNumberKeyMix">
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
                controllerName:'Cliente',
                cbxTipo:0,
                cbxEstado:1,
                querySearch:'',
                registerState:false,
                editState:false,
                
                tableId:'tablaClienteData',
                dataTableDraw: null,
                loadinTableData:false,
                tableData:[],
                editData:{},
                errors:[],

                //campos
                regEstado:true,
                regCodigo:'',
                regDescripcion:'',
                regCentroAlm:0,
                regLpn:'',
                dataCaractere:[],

                codigoError:'',
                descripcionError:'',

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
            EventBus.$on('cboTipoSelect', (data) => {
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
                this.querySearch=''
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
                    this.regCentroAlm=0;

                    this.codigoError='';
                    this.descripcionError='';

                    this.regEstado=true;
            },
            setErrorForm(response){
                this.codigoError='';
                this.descripcionError='';

                if (response.type === 'codigo') {
                    this.codigoError=response.message;
                }
                if (response.type === 'descripcion') {
                    this.descripcionError=response.message;
                }
            },
            registerAction(){

                if(this.regCodigo.length <=2  || this.regDescripcion.length <=3 || this.regCentroAlm=='0' || this.regLpn <= 3 ){
                    new PNotify({
                        title: 'Nuevo Cliente',
                        text: 'Complete los campos obligatorios',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    return  false;
                }
            
                let me = this;
                const ObjClienteData = {
                    intIdCliente:0,
                    strCoCliente:this.regCodigo,
                    strDesCliente:this.regDescripcion,
                    strLPNRaiz:this.regLpn,
                    intIdCentroAlm:this.regCentroAlm,
                    strClienteCampo1:null,
                    strClienteCampo2:null,
                    strClienteCampo3:null,
                    strClienteCampo4:null,
                    strClienteCampo5:null,
                    bitFlActivo:this.regEstado ? true:false,
                    bitFlEliminado:0,
                    intIdUsuarReg:0,
                    intIdUsuarModif:0,
                }

                   $.post('/Cliente/RegistrarNuevoCliente',{intIdMenu:this.intIdMenu, ObjCliente: ObjClienteData },
                    (response) => {
                        me.messageResponse(response,"Nuevo cliente")
                        if (response.type === 'success') {
                            me.getTableData();
                            me.cleanControl();
                            this.editState=false;
                            this.registerState=false;
                        }
                       me.setErrorForm(response);
                    }).fail((result) => {
                        alert('ERROR ' + result.status + ' ' + result.statusText);
                    });
            },
            getTableData(){
                let me = this;
                const url = `/Cliente/GetTablaCliente`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intActivo: this.cbxEstado,
                    strDescripcion: this.querySearch,
                    intCentroAlm: this.cbxTipo
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
                            { data: 'strCoCliente' },
                            { data: 'strDesCliente' },
                            { data: 'strDesCentroAlm' },
                            { data: 'FlActivo.strEstadoActivo' },
                            {data:null}
                        ], 
                        columnDefs: [            
                            {
                                targets: 4,
                                render: function (data, type, item) {
                                    return `<button class="btn btn-success btn-xs btn-edit-event" dataid="${item.intIdCliente}" ><i class="fa fa-pencil"></i> Editar </button> 
                                            <button class="btn btn-primary btn-xs btn-delete-event" dataid="${item.intIdCliente}" strdescripcion="${item.strDesCliente}" data="${item}" ><i class="fa fa-trash-o"></i> Eliminar </button>`;
                                }
                            }
                        ],
                        order: [[3, 'asc'], [1, 'asc']]
                    })
                })
                .catch(error => {
                    console.log(error)
                    this.loadinTableData=false;
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });

                
            },
            getDataEdit(data){
                
                this.editData = {};

                const url = `/${this.controllerName}/GetClientePorId`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intIdCliente: data.idItem,
                }
                axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    this.editData = resp.data[0];
                    this.editState=true;
                    this.errors = []

                    this.cleanControl();
                    let dataInfo = this.editData;
                    this.regCodigo=dataInfo.strCoCliente;
                    this.regDescripcion=dataInfo.strDesCliente;
                    this.regLpn=dataInfo.strLPNRaiz;
                    this.regCentroAlm=dataInfo.intIdCentroAlm;
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


                if(this.regCodigo.length <=2  || this.regDescripcion.length <=3 || this.regCentroAlm=='0' || this.regLpn <= 3 ){
                    new PNotify({
                        title: 'Actualizar Cliente',
                        text: 'Complete los campos obligatorios',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    return  false;
                }

                const ObjClienteData = {
                    intIdCliente:data.intIdCliente,
                    strCoCliente:this.regCodigo,
                    strDesCliente:this.regDescripcion,
                    strLPNRaiz:this.regLpn,
                    intIdCentroAlm:this.regCentroAlm,
                    strClienteCampo1:data.strClienteCampo1,
                    strClienteCampo2:data.strClienteCampo2,
                    strClienteCampo3:data.strClienteCampo3,
                    strClienteCampo4:data.strClienteCampo4,
                    strClienteCampo5:data.strClienteCampo5,
                    bitFlActivo:this.regEstado ? true:false,
                    bitFlEliminado:data.bitFlEliminado,
                    intIdUsuarReg:data.intIdUsuarReg,
                    intIdUsuarModif:data.intIdUsuarModif,
                }

                   $.post(
                    '/Cliente/UpdateCliente',
                            {intIdMenu:this.intIdMenu, ObjCliente: ObjClienteData },
                    (response) => {
                        me.messageResponse(response,"Actualizar Cliente")
                        if (response.type === 'success') {
                            me.getTableData();
                            me.cleanControl();
                            this.editState=false;
                            this.registerState=false;
                        }
                       me.setErrorForm(response);
                    }).fail((result) => {
                        alert('ERROR ' + result.status + ' ' + result.statusText);
                    });
 
            },
            deleteShowModal(data){
                let me = this;
                    swal({
                        title: "Eliminar Cliente",
                        text: `¿Está seguro de eliminar el cliente "${data.strDescription}"?`,
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
                let me = this;
                const url = `/${this.controllerName}/EliminarCliente`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intIdCliente: data.idItem,
                }
                axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    this.messageResponse(resp.data,'Eliminar cliente') ;
                    this.errors = []
                    me.getTableData();
                    me.cleanControl(); 
                })
                .catch(error => {
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