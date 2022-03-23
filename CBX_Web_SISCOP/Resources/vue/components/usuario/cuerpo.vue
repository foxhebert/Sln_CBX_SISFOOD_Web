<template>
    <div class="row">
        <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Listado de Usuarios</h2>
                    <ul class="nav navbar-right panel_toolbox">
                        <li>
                            <button type="button" id="btnNewRegister" @click="showFormRegister(true)" class="btn btn-primary">Nuevo Usuario</button>
                        </li>
                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">

                    <table id="tablaUsuarioData" class="table table-striped table-bordered table-responsive nowrap " cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Nombre</th>
                                <th>Perfil</th>
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
                        <h2>Información del Usuario</h2>
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
      
                        <div ref="formControl" class="form-horizontal form-label-left">


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
                                <div class="border-section mb-4">
                                    <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative">
                                            <label>Usuario (*)</label>
                                            <input type="text" v-model="regUsuario" class="form-control text-lowercase" placeholder="Usuario" :maxlength="getColumnLength('strUsUsuar')" @keydown.space.prevent>
                                            <div  class="notifry_error_div">{{usuarioError}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative" >
                                            <label>Contraseña (*)</label>
                                            <input :type="typeInputPassword" v-model="regContrasena" ref="contrasenaUser" class="form-control" placeholder="Contraseña " @keydown.space.prevent @keyup="validarContrasena" @focus="mostrarPanelContrasena()" @blur="ocultarPanelContrasena()"  :maxlength="getColumnLength('strCoPassw')">
                                            <div class="notifry_error_div"></div>
                                            <div id="contraneValidate" v-show="estadoContrasena">
                                                <h5>La contraseña debería cumplir con las siguientes políticas:</h5>
                                                <ul>
                                                    <li v-show="estadoContrasenaLetraMayuscula">Debe tener al menos <strong>una Mayúscula</strong></li>
                                                    <li v-show="estadoContrasenaMinUnaLetra">Debe tener al menos <strong>una Minúscula</strong></li>
                                                    <li v-show="estadoContrasenaUnNumero">Debe tener al menos <strong>un Número</strong></li>
                                                    <li v-show="estadoContrasenaCaracterEspecial">Debe tener al menos <strong>un Caracter Especial (@ # $ % () * - _ / .)</strong></li>
                                                    <li v-show="estadoContrasenaLength">Debe ser como mínimo <strong>8 dígitos</strong> </li>
                                                </ul>
                                            </div>
                                            <button class="buttom-show-clave" @click="showContrasena()">
                                                <i v-if="isActiveClave" class="fa fa-eye-slash"></i>
                                                <i v-else class="fa fa-eye"></i>
                                            </button>
                                        </div>
                                    </div>

                                   
                                     <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative">
                                            <label>Nombre (*)</label>
                                            <input type="text" v-model="regNombre"  class="form-control" placeholder="Nombre" :maxlength="getColumnLength('strNoUsuar')" >
                                            <div class="notifry_error_div"></div>
                                        </div>
                                    </div>

                                     <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative">
                                            <label>Perfil (*)</label>
                                            <select-perfil-input v-model="regPerfil"  :int-id-filtro-grupo="0" :register="true" />
                                            <div class="notifry_error_div"></div>
                                        </div>
                                    </div>
                                    <div class="col-md-12 col-sm-12 col-xs-12"><br><br><br></div>
                                </div>
                            </div>

                        </div>
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
                controllerName:'Seguridad',
                cbxTipo:0,
                cbxEstado:1,
                querySearch:'',
                registerState:false,
                editState:false,
                isActiveClave:false,
                typeInputPassword:'password',

                tableId:'tablaUsuarioData',
                loadinTableData:false,
                dataTableDraw: null, 
                tableData:[],
                editData:{}, 
                errors:[],

                //campos
                regEstado:true,
                regUsuario:'',
                regContrasena:'',
                regPerfil:0,
                regNombre:'',
                dataCaractere:[],

                usuarioError:'',

                estadoContrasena:false,
                estadoContrasenaLength:true,
                estadoContrasenaMinUnaLetra:true,
                estadoContrasenaLetraMayuscula:true,
                estadoContrasenaUnNumero:true,
                estadoContrasenaCaracterEspecial:true,

                estadoValidadoContrasena:false,

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
            EventBus.$on('cboPerfilSelect', (data) => {
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
                    this.regUsuario='';
                    this.regContrasena='';
                    this.regNombre='';
                    this.regPerfil=0;
                    this.regEstado=true;

                    this.usuarioError=''
                    this.estadoContrasena=false,
                    this.estadoContrasenaLength=true,
                    this.estadoContrasenaMinUnaLetra=true,
                    this.estadoContrasenaLetraMayuscula=true,
                    this.estadoContrasenaUnNumero=true,
                    this.estadoContrasenaCaracterEspecial=true,
                    this.estadoValidadoContrasena= false;
                    this.isActiveClave=false;
                    this.typeInputPassword='password';
                    this.validarContrasenaBoolean('')
            },
            registerAction(){
                this.usuarioError=''
                if(this.regUsuario.length <=2  || this.regContrasena.length <=3 || this.regPerfil=='0' || this.regNombre <= 3 ){
                    new PNotify({
                        title: 'Nuevo Usuario',
                        text: 'Complete los campos obligatorios',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    return  false;
                }
                
                if(this.estadoValidadoContrasena==false){
                    new PNotify({
                        title: 'Nuevo Usuario',
                        text: 'Su contraseña no cumple con la política.',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    this.$refs.contrasenaUser.focus()
                    return  false;
                }
                let me = this;
                const ObjUsuario = {
                    strUsUsuar: this.eliminarEspaciosBlancoMix(this.regUsuario).toString().toLowerCase(),
                    strCoPassw: this.eliminarEspaciosBlancoMix(this.regContrasena),
                    strNoUsuar: this.regNombre,
                    tinFlEstado: 1,
                    bitFlActivo: this.regEstado ? true:false,
                    strMotivoEst: 'N.H.M',
                    dttFchBloqueo: '24/03/2000',
                    dttFchUltPass: '24/03/2000',
                    dttFchCaduca: '24/03/2000',
                    intIdPersonal: 1,
                }

                const listaDetallesUsuarioPerfil = [
                        {
                        intIdUsPerf:null,
                        intIdUsuar:null,
                        intIdPerfil: this.regPerfil,
                        bitFlPrincipal:1,
                        bitFlActivo:1,
                        bitFlEliminado:0,
                    }
                ]

                $.post('/Seguridad/InsertUpdateUsuario', { intIdMenu: this.intIdMenu, ObjUsuario: ObjUsuario, listaDetallesUsuarioPerfil: listaDetallesUsuarioPerfil, intTipoOperacion: 1 },
                    (response) => {
                        me.messageResponse(response,"Nuevo Usuario")
                        if (response.type === 'success') {
                            me.getTableData();
                            me.cleanControl();
                            this.editState=false;
                            this.registerState=false;
                        }
                        if (response.type === 'usuario') {
                            this.usuarioError=response.message;
                        }
                       
                    }).fail((result) => {
                        alert('ERROR ' + result.status + ' ' + result.statusText);
                    });
            },
            getTableData(){ 
                let me = this;
                const url = `/${this.controllerName}/GetTablaUsuario`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intActivo: this.cbxEstado,
                    strDescripcion: this.querySearch,
                    intPerfil: this.cbxTipo
                }
                this.loadinTableData = true;
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
                            { data: 'strUsUsuar' },
                            { data: 'strNoUsuar' },
                            { data: 'strstrDesPerfil' },
                            { data: 'strEstadoActivo' },
                            {data:null}
                        ], 
                        columnDefs: [            
                            {
                                targets: 4,
                                render: function (data, type, item) {
                                    return `<button class="btn btn-success btn-xs btn-edit-event" dataid="${item.intIdUsuar}" ><i class="fa fa-pencil"></i> Editar </button> 
                                            <button class="btn btn-primary btn-xs btn-delete-event" dataid="${item.intIdUsuar}" strdescripcion="${item.strNoUsuar}" data="${item}" ><i class="fa fa-trash-o"></i> Eliminar </button>`;
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
                const url = `/${this.controllerName}/ObtenerRegistroUsuario`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    IntIdUsuar: data.idItem,
                }
                axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    this.editData = resp.data[0];
                    this.editState=true;
                    this.errors = []

                    this.cleanControl();
                    let dataInfo = this.editData;
                    this.regUsuario=dataInfo.strUsUsuar;
                    this.regContrasena=dataInfo.strCoPassw;
                    this.regNombre=dataInfo.strNoUsuar;
                     this.regPerfil=dataInfo.intIdPerfil;
                    this.regEstado=dataInfo.bitFlActivo ;
                    this.validarContrasenaBoolean(this.regContrasena)
                })
                .catch(error => {
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });
            
            },
            updateData(data){
                let me = this;

                if(this.regUsuario.length <=2  || this.regContrasena.length <=3 || this.regPerfil=='0' || this.regNombre <= 3 ){
                    new PNotify({
                        title: 'Actualizar Usuario',
                        text: 'Complete los campos obligatorios',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    return  false;
                }

                if(this.estadoValidadoContrasena==false){
                    new PNotify({
                        title: 'Actualizar Usuario',
                        text: 'Su contraseña no cumple con la política.',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    this.$refs.contrasenaUser.focus()
                    return  false;
                }

                const ObjUsuario = {
                    intIdUsuar: data.intIdUsuar,
                    strUsUsuar: this.eliminarEspaciosBlancoMix(this.regUsuario).toString().toLowerCase(),
                    strCoPassw: this.eliminarEspaciosBlancoMix(this.regContrasena),
                    strNoUsuar: this.regNombre,
                    tinFlEstado: 1,
                    bitFlActivo: this.regEstado ? true:false,
                    strMotivoEst: 'N.H.M',
                    dttFchBloqueo: '24/03/2000',
                    dttFchUltPass: '24/03/2000',
                    dttFchCaduca: '24/03/2000',
                    intIdPersonal: 1,
                }

                const listaDetallesUsuarioPerfil = [
                        {
                        intIdUsPerf:null,
                        intIdUsuar:null,
                        intIdPerfil: this.regPerfil,
                        bitFlPrincipal:1,
                        bitFlActivo:1,
                        bitFlEliminado:0,
                    }
                ]

                $.post(
                '/Seguridad/InsertUpdateUsuario',
                    { intIdMenu: this.intIdMenu, ObjUsuario: ObjUsuario, listaDetallesUsuarioPerfil: listaDetallesUsuarioPerfil, intTipoOperacion: 2 },
                (response) => {
                    me.messageResponse(response,"Actualizar Usuario")
                    if (response.type === 'success') {
                        me.getTableData();
                        me.cleanControl();
                        this.editState=false;
                        this.registerState=false;
                    }
                    if (response.type === 'usuario') {
                        this.usuarioError=response.message;
                    }
                    
                }).fail((result) => {
                    alert('ERROR ' + result.status + ' ' + result.statusText);
                });
 
            },
            deleteShowModal(data){
                let me = this;
                    swal({
                        title: "Eliminar Usuario",
                        text: `¿Está seguro de eliminar el usuario "${data.strDescription}"?`,
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
                const url = `/${this.controllerName}/EliminarUsuario`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intIdUsu: data.idItem,
                }
                axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    this.messageResponse(resp.data,'Eliminar Usuario') ;
                    this.errors = []
                    me.getTableData();
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
                const url = `/${this.controllerName}/getMaestroCaracteresUsuario`;
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
            validarContrasena(evt){
                this.regContrasena = this.eliminarEspaciosBlancoMix(evt.target.value);
                let pswd = this.regContrasena;
                let estateEspecial = false;

                if(pswd.length > 0){
                     //this.estadoContrasena=true;
                }

                if (pswd.length < 8) {
                    this.estadoContrasenaLength = true;
                }else{
                    this.estadoContrasenaLength = false;
                }

                //validate letra
                if (pswd.match(/[a-z]/)) {
                    this.estadoContrasenaMinUnaLetra= false;
                }else{
                    this.estadoContrasenaMinUnaLetra= true;
                } 

                 //validate capital letter
                if (pswd.match(/[A-Z]/)) {
                    this.estadoContrasenaLetraMayuscula = false;
                } else{
                    this.estadoContrasenaLetraMayuscula = true;
                }

                 //validate number
                if (pswd.match(/\d/)) {
                    this.estadoContrasenaUnNumero=false;
                } else {
                    this.estadoContrasenaUnNumero=true;
                }

                 if (pswd.includes('@') || pswd.includes('#') || pswd.includes('$') || pswd.includes('%') || pswd.includes('/') || pswd.includes('_') || pswd.includes('-') || pswd.includes('.') || pswd.includes('(') || pswd.includes(')') || pswd.includes('*') || pswd.includes('+')) {
                    this.estadoContrasenaCaracterEspecial = false;
                    estateEspecial = true;
                } else {
                    this.estadoContrasenaCaracterEspecial = true
                }
        

                if (pswd.length >= 8 && pswd.match(/[a-z]/) && pswd.match(/[A-Z]/) && pswd.match(/\d/) && estateEspecial) {
                    this.estadoContrasena=false;
                    this.estadoValidadoContrasena = true;
                }else{
                    this.estadoValidadoContrasena= false;
                    this.estadoContrasena=true;
                }
                return this.estadoContrasena;
            },
            validarContrasenaBoolean(strContrasena){
                this.regContrasena = this.eliminarEspaciosBlancoMix(strContrasena);
                let pswd = this.regContrasena;
                let estateEspecial = false;

                if(pswd.length > 0){
                     //this.estadoContrasena=true;
                }

                if (pswd.length < 8) {
                    this.estadoContrasenaLength = true;
                }else{
                    this.estadoContrasenaLength = false;
                }

                //validate letra
                if (pswd.match(/[A-z]/)) {
                    this.estadoContrasenaMinUnaLetra= false;
                }else{
                    this.estadoContrasenaMinUnaLetra= true;
                } 

                 //validate capital letter
                if (pswd.match(/[A-Z]/)) {
                    this.estadoContrasenaLetraMayuscula = false;
                } else{
                    this.estadoContrasenaLetraMayuscula = true;
                }

                 //validate number
                if (pswd.match(/\d/)) {
                    this.estadoContrasenaUnNumero=false;
                } else {
                    this.estadoContrasenaUnNumero=true;
                }

                 if (pswd.includes('@') || pswd.includes('#') || pswd.includes('$') || pswd.includes('%') || pswd.includes('/') || pswd.includes('_') || pswd.includes('-') || pswd.includes('.') || pswd.includes('(') || pswd.includes(')') || pswd.includes('*') || pswd.includes('+')) {
                    this.estadoContrasenaCaracterEspecial = false;
                    estateEspecial = true;
                } else {
                    this.estadoContrasenaCaracterEspecial = true
                }
        

                if (pswd.length >= 8 && pswd.match(/[A-z]/) && pswd.match(/[A-Z]/) && pswd.match(/\d/) && estateEspecial) {
                    this.estadoValidadoContrasena = true;
                }else{
                    this.estadoValidadoContrasena= false;
                }
                return this.estadoValidadoContrasena;
            },
            ocultarPanelContrasena(){
                
                this.estadoContrasena=false;
            },
            mostrarPanelContrasena(){
                if(this.estadoContrasena){
                    this.estadoContrasena=true;
                }else{
                    this.estadoContrasena=false;
                }
                
            },
            showContrasena() {
                this.isActiveClave = !this.isActiveClave;
                if(this.isActiveClave){
                    this.typeInputPassword='text';
                }else{
                     this.typeInputPassword='password';
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


<style lang="css">
.text-lowercase{
    text-transform: lowercase !important;
}
.buttom-show-clave{
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    right: 3px;
    top: 25px;
}
</style>
