<template>
    <div class="row">
        <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Listado de Motivos</h2>
                    <ul class="nav navbar-right panel_toolbox">
                        <li>
                            <button type="button" id="btnNewRegister" @click="showFormRegister(true)" class="btn btn-primary">Nuevo Motivo</button>
                        </li>
                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">

                    <table id="tablaMotivo" class="table table-striped table-bordered table-responsive nowrap " cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loadinTableData">
                                <td colspan="4" class="">
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
                        <h2>Información del Motivo</h2>
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
                                            <input type="text" v-model="regCodigo" class="form-control" placeholder="Código" @keydown.space.prevent :maxlength="getColumnLength('strCoMotivo')">
                                            <div class="notifry_error_div">{{codigoError}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative">
                                            <label>Descripción (*)</label>
                                            <input type="text" v-model="regDescripcion" class="form-control" placeholder="Descripción " :maxlength="getColumnLength('strDeMotivo')">
                                            <div class="notifry_error_div">{{descripcionError}}</div>
                                        </div>
                                    </div>

                                    <div class="col-md-12 col-sm-12 col-xs-12">
                                        <div class="form-group p-relative">
                                            <label>Detalles o comentarios</label>
                                            <textarea rows="4" class="form-control" v-model="detalles"  ></textarea>
                                            
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
                controllerName:'Motivo',
                cbxTipo:0,
                cbxEstado:1,
                querySearch:'',
                registerState:false,
                editState:false,

                tableId:'tablaMotivo',
                loadinTableData:false,
                dataTableDraw: null,
                tableData:[],
                editData:{},
                errors:[],

                codigoError:'',
                descripcionError:'',

                //campos
                regEstado:true,
                regCodigo:'',
                regDescripcion:'',
                detalles:'',
                dataCaractere:[],

                intIdMenu:this.getSubMenuIdMix()
            }
        },
        created() {
            EventBus.$on('clickHeaderLink', (data) => {
                this.restControlInicial();
                this.editState=false;
                this.registerState=false;
                this.getDataTables();
            })
            EventBus.$on('cboEstadoSelect', (data) => {
                this.cbxEstado = data;
                this.getDataTables();
            })
            EventBus.$on('querySearchMain', (data) => {
                this.querySearch = data;
                this.getDataTables();
            })
        },
        methods:{
            restControlInicial(){
                this.cbxTipo=0
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
                    this.detalles = '';

                    this.codigoError='';
                    this.descripcionError='';

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

                if(this.regCodigo.length <=2  || this.regDescripcion.length <=3 ){
                new PNotify({
                        title: 'Nuevo Motivo',
                        text: 'Complete los campos obligatorios',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    return  false;
                }
            
                let me = this;
                const ObjMotivo = {
                    intidMotivo:0,
                    strCoMotivo:this.regCodigo,
                    strDeMotivo:this.regDescripcion,
                    strDeDetalle:this.detalles,
                    strGrupo:'null',
                    strSubGrupo:null,
                    intNuOrden:0,
                    bitFlActivo:this.regEstado ? true:false,
                }

                   $.post(
                    `/${this.controllerName}/RegistrarNuevoMotivo`,
                            {intIdMenu:this.intIdMenu, ObjMotivo: ObjMotivo },
                    (response) => {
                        me.messageResponse(response,"Nuevo Motivo")
                         if (response.type === 'success') {
                            me.getDataTables()
                            me.cleanControl();
                            this.editState=false;
                            this.registerState=false;
                        }
                        me.setErrorForm(response);
                    }).fail((result) => {
                        alert('ERROR ' + result.status + ' ' + result.statusText);
                    });
            },
            getDataTables(){
                let me = this;
                const url = `/${this.controllerName}/GetTablaMotivo`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intActivo: this.cbxEstado,
                    strDescripcion: this.querySearch,
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
                            { data: 'strCoMotivo' },
                            { data: 'strDeMotivo' },
                            { data: 'FlActivo.strEstadoActivo' },
                            {data:null}
                        ], 
                        columnDefs: [            
                            {
                                targets: 3,
                                render: function (data, type, item) {
                                    let strDeFeriado = item.strCoMotivo;
                                    return `<button class="btn btn-success btn-xs btn-edit-event" dataid="${item.intidMotivo}" ><i class="fa fa-pencil"></i> Editar </button> 
                                            <button class="btn btn-primary btn-xs btn-delete-event" dataid="${item.intidMotivo}" strdescripcion="${item.strDeMotivo}" data="${item}" ><i class="fa fa-trash-o"></i> Eliminar </button>`;
                                }
                            }
                        ],
                        order: [[2, 'asc'], [1, 'asc']]
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

                const url = `/${this.controllerName}/GetMotivoPorId`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intidMotivo: data.intidMotivo,
                }
                axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    this.editData = resp.data[0];
                    this.editState=true;
                    this.errors = []

                    this.cleanControl();
                    let dataInfo = this.editData;
                    this.regCodigo=dataInfo.strCoMotivo;
                    this.regDescripcion=dataInfo.strDeMotivo;
                    this.detalles=dataInfo.strDeDetalle;
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

                if(this.regCodigo.length <=2  || this.regDescripcion.length <=3 ){
                    new PNotify({
                        title: 'Actualizar Motivo',
                        text: 'Complete los campos obligatorios',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    return  false; 
                }

                const ObjMotivo = {
                    intidMotivo:data.intidMotivo,
                    strCoMotivo:this.regCodigo,
                    strDeMotivo:this.regDescripcion,
                    strDeDetalle:this.detalles,
                    strGrupo:data.strGrupo,
                    strSubGrupo:data.strSubGrupo,
                    intNuOrden:data.intNuOrden,
                    bitFlActivo:this.regEstado ? true:false,
                }

                   $.post(
                    `/${me.controllerName}/UpdateMotivo`,{intIdMenu:this.intIdMenu, ObjMotivo: ObjMotivo },
                    (response) => {
                        me.messageResponse(response,"Actualizar Motivo")
                        if (response.type === 'success') {
                            me.getDataTables()
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
                        title: "Eliminar Motivo",
                        text: `¿Está seguro de eliminar el motivo "${data.strDescription}"?`,
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
                const url = `/${this.controllerName}/EliminarMotivo`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intidMotivo: data.idItem,
                }
                axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    this.messageResponse(resp.data,'Eliminar Motivo') ;
                    this.errors = []
                    me.getDataTables()
                    me.cleanControl();
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
                        me.getDataEdit({intidMotivo:idEdit})
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
            this.getDataTables();
            this.getMaestroCaracteres();
            this.initAcctionButtom();
        }
    }
</script>