<template>
    <div class="row">
        <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Listado de Perfil</h2>
                    <ul class="nav navbar-right panel_toolbox">
                        <li>
                            <button type="button" id="btnNewRegister" @click="showFormRegister(true),nuevoRegistroForm(true)" class="btn btn-primary">Nuevo Perfil</button>
                        </li>
                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">

                    <table id="tablaPerdilData" class="table table-striped table-bordered table-responsive nowrap " cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descripción</th>
                                <th>Tipo Admin</th>
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
                        <h2>Información del Perfil</h2>
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
                                            <input type="text" v-model="regCodigo" class="form-control" placeholder="Código" @keydown.space.prevent :maxlength="getColumnLength('strCoPerfil')">
                                            <div  class="notifry_error_div">{{usuarioError}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6 col-xs-6">
                                        <div class="form-group p-relative">
                                            <label>Descripción (*)</label>
                                            <input type="text" v-model="regDescripcion" class="form-control" placeholder="Descripción " :maxlength="getColumnLength('strDesPerfil')">
                                            <div class="notifry_error_div">{{descripcionError}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="mt-3">
                                    <form class="form-horizontal form-label-left">
                                         <ul class="nav nav-tabs" role="tablist">
                                            <li v-for="(menu, indexKey) in getMenuPadre" role="presentation" :class="{active:indexKey==0}" :key="indexKey">
                                                <a v-if="getSubMenu(menu.strCoMenu).length" :href="'#menuId'+menu.intIdMenu" aria-controls="home" role="tab" data-toggle="tab">{{menu.strNomMenu}}</a>
                                            </li>
                                        </ul>

                                        <div class="tab-content">
                                            <div role="tabpanel" v-for="(menuPadre, index) in getMenuPadre" class="tab-pane" :class="{active:index==0}" :id="'menuId'+menuPadre.intIdMenu" :key="index">
                                                <div class="p-2">
                                                    <div class="mb-3" v-if="getSubMenu(menuPadre.strCoMenu).length">
                                                        <div v-show="getSubMenu(menuPadre.strCoMenu).length > 1" class="icheck-material-blue">
                                                            <input type="checkbox"  :id="'checkall'+menuPadre.intIdMenu"  @click="checAllItems(menuPadre)"  class="checbokmenuitem">
                                                            <label :for="'checkall'+menuPadre.intIdMenu">Seleccionar Todos</label>
                                                        </div>
                                                    </div>
                                                    <div class="mt-4 d-flex">
                                                        <div v-for="(item, index) in getSubMenu(menuPadre.strCoMenu)" :key="index" class="icheck-material-blue mr-3 mb-2">
                                                            <input type="checkbox" :id="'submenuid'+item.intIdMenu"  :value="valueChecBox(item.intIdMenu)" v-model="dataCheck" @change="checkSelectAll(menuPadre)" >
                                                            <label :for="'submenuid'+item.intIdMenu"> {{item.strNomMenu}}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                            
                                        </div>
                                    </form>
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
                controllerName:'Seguridad',
                cbxEstado:1,
                querySearch:'',
                registerState:false,
                editState:false,

                intIdEdit:0,

                tableId:'tablaPerdilData',
                dataTableDraw: null, 
                loadinTableData:false,
                tableData:[], 
                subMenuData:[],
                editData:{},
                errors:[],

                //campos
                regEstado:true,
                regCodigo:'',
                regDescripcion:'',
                dataCaractere:[],
                dataCheck:[],

                usuarioError:'',
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
            EventBus.$on('cboEstadoSelect', (data) => {
                this.cbxEstado = data;
                this.getTableData();
            })
            EventBus.$on('querySearchMain', (data) => {
                this.querySearch = data;
                this.getTableData();
            })
        },
        computed: {
            getMenuPadre(){
                return this.subMenuData.filter((item, keyIndex)=> {
                    return item.strCoMenuRela=="";
                })
            },
            cantidadCheckCompu(){
                return this.dataCheck.length;
            }
        },
        methods:{
            restControlInicial(){
                this.cbxEstado=1;
                this.querySearch='';
            },
            getSubMenu(strCoMenu){
                return this.subMenuData.filter((item, keyIndex)=> {
                    return (item.strCoMenuRela!=="" && item.strCoMenuRela==strCoMenu);
                })
            },
            valueChecBox(intIdMenu){
                return {intIdPerfM:0, intIdPerfil:0, intIdSoft:4, intIdMenu:intIdMenu, bitFlEliminado:0};
            },
            checAllItems(data){
                let el = 'checkall'+data.intIdMenu;
                let checkBox = document.getElementById(el);

                let strCoMenu = data.strCoMenu;
                const listaMenu = this.subMenuData.filter((item, keyIndex)=> {
                    return (item.strCoMenuRela!=="" && item.strCoMenuRela==strCoMenu);
                })

                let dataChekItem = this.dataCheck;

                if (checkBox.checked == true){
                    listaMenu.forEach((item,key)=>{
                        if (this.dataCheck.find(e => e.intIdMenu == item.intIdMenu)){
                            let position= this.dataCheck.findIndex(e => e.intIdMenu == item.intIdMenu);
                            if(!isNaN(position)){
                                dataChekItem.splice(position, 1); 
                            }
                        }
                    })

                    listaMenu.forEach((item,key)=>{
                        dataChekItem.push(this.valueChecBox(item.intIdMenu))
                    })
                }else{
                    listaMenu.forEach((item,key)=>{
                        if (this.dataCheck.find(e => e.intIdMenu == item.intIdMenu)){
                            let position= this.dataCheck.findIndex(e => e.intIdMenu == item.intIdMenu);
                            if(!isNaN(position)){
                                dataChekItem.splice(position, 1); 
                            }
                        }
                    })
                }
               
                this.dataCheck = dataChekItem;

            },
            async getSubMenuRegister(){
                await axios.post(`/${this.controllerName}/ObtenerListadoSubMenus`, { intIdMenu:this.intIdMenu, intActivo: 1, strDescripcion: '' })
                .then(resp => {
                    this.subMenuData=resp.data;
                    this.errors = []
                })
                .catch(error => {
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                }); 
            },
            showFormRegister(state){
                let checkboxes = document.querySelectorAll('.checbokmenuitem');
                if(checkboxes.length){
                    for (var i = 0; i < checkboxes.length; i++) {
                        checkboxes[i].checked = false;
                    }
                }
            
                this.editState=false;
                this.registerState=state;
                this.cleanControl();
                 
            },
            cleanControl(){
                    this.regCodigo='';
                    this.regDescripcion='';
                    this.regEstado=true;
                    this.usuarioError = '';
                    this.descripcionError = '';
                    this.dataCheck=[];
            },
            registerAction(){
                this.usuarioError = '';
                this.descripcionError = '';

                if(this.regCodigo.length <=2  || this.regDescripcion.length <=3 ){
                    new PNotify({
                        title: 'Nuevo Perfil',
                        text: 'Complete los campos obligatorios',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    return  false;
                }

                if(this.dataCheck.length ==0){
                    new PNotify({
                        title: 'Nuevo Perfil',
                        text: 'Debe seleccionar al menos un menú',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    return  false;
                }
            
                let me = this;
                const ObjPerfil = {
                    strCoPerfil:this.regCodigo,
                    strDesPerfil:this.regDescripcion,
                    bitFlActivo:this.regEstado ? true:false,
                }

                let hash = {};
                let dataMenuIndo = this.dataCheck.filter(o => hash[o.intIdMenu] ? false : hash[o.intIdMenu] = true);


                //const dataMenuIndo = this.eliminarObjetosDuplicadosMix(this.dataCheck,'intIdMenu') 

                $.post('/Seguridad/InsertUpdatePerfil', { intIdMenu: this.intIdMenu, ObjPerfil: ObjPerfil, listaDetallesPerfil: dataMenuIndo, intTipoOperacion: 1 },
                       //$.post('/Seguridad/RegistrarNuevoPerfil',{ intIdMenu:this.intIdMenu, ObjPerfil: ObjPerfil,listaDetallesPerfil:dataMenuIndo },
                    (response) => {
                        me.messageResponse(response,"Nuevo Perfil")
                        if (response.type === 'success') {
                            me.getTableData();
                            me.cleanControl();
                            this.editState=false;
                            this.registerState=false;
                        }
                        if (response.type === 'codigo') {
                            this.usuarioError=response.message;
                        }
                        if (response.type === 'descripcion') {
                            this.descripcionError=response.message;
                        }
                    }).fail((result) => {
                        alert('ERROR ' + result.status + ' ' + result.statusText);
                    });
            },
            getTableData(){
                let me = this;
                const url = `/${this.controllerName}/GetTablaPerfil`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intActivo: this.cbxEstado,
                    strDescripcion: this.querySearch,
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
                            { data: 'strCoPerfil' },
                            { data: 'strDesPerfil' },
                            { data: 'strTipoPerfil' },
                            { data: 'strFlActivo' },
                            {data:null}
                        ], 
                        columnDefs: [            
                            {
                                targets: 4,
                                render: function (data, type, item) {
                                    return `<button class="btn btn-success btn-xs btn-edit-event" dataid="${item.intIdPerfil}" ><i class="fa fa-pencil"></i> Editar </button> 
                                            <button class="btn btn-primary btn-xs btn-delete-event" dataid="${item.intIdPerfil}" strdescripcion="${item.strDesPerfil}" data="${item}" ><i class="fa fa-trash-o"></i> Eliminar </button>`;
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

                const url = `/${this.controllerName}/ObtenerRegistroPerfil`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intIdPerfil: data.idItem,
                }
                this.intIdEdit = data.idItem;
                axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    this.editData = resp.data[0];
                    this.editState=true;
                    this.errors = []

                    this.cleanControl();
                    let dataInfo = this.editData;
                    this.regCodigo=dataInfo.strCoPerfil;
                    this.regDescripcion=dataInfo.strDesPerfil;
                    this.regEstado=dataInfo.bitFlActivo ;
                   this.getSubMenuActivo(data.idItem);
                })
                .catch(error => {
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });
            
            },
            async getSubMenuActivo(intIdPerfil){
                const url = "/Personal/ListarCombosPersonal";
                    await axios.post(url,{ intIdMenu:this.intIdMenu, strEntidad: 'TGPERFIL_MENU', intIdFiltroGrupo: intIdPerfil, strGrupo: 'CHECK', strSubGrupo: '' } )
                    .then(resp => {
                        this.dataCheck=[];
                        const dataBD = resp.data;

                        const listaMenu = this.subMenuData.filter((item, keyIndex)=> {
                            return item.strCoMenuRela == "";
                        })

                        
                        
                        let dataSubMenuFor = [];

                        listaMenu.forEach((valor, indice)=> {
                            dataSubMenuFor = dataSubMenuFor.concat(this.getSubMenu(valor.strCoMenu))
                        });

                        
                        
                        let dataInfo = [];
                        dataBD.forEach((valor, indice)=> {
                            if (dataSubMenuFor.find(e => e.intIdMenu == valor.intidTipo)){
                            let position= dataSubMenuFor.findIndex(e=> e.intIdMenu==valor.intidTipo);
                                if(!isNaN(position)){
                                    dataInfo.push(this.valueChecBox(valor.intidTipo));
                                }
                            }
                        });

                        let hash = {};
                        let arrayQuitado = dataInfo.filter(o => hash[o.intIdMenu] ? false : hash[o.intIdMenu] = true);


                        //this.dataCheck=this.eliminarObjetosDuplicadosMix(dataInfo,'intIdMenu');
                        this.dataCheck=arrayQuitado;
                        this.errors = []

                        this.getMenuPadre.forEach((itemx,keyx)=>{{
                            this.checkSelectAll(itemx)
                        }})
                        //console.log(this.getMenuPadre)
                        //checkSelectAll(data)

                    })
                    .catch(error => {
                        if (error.response.status == 422) {
                            this.errors = error.response.data.errors;
                        }
                    });
            },
            updateData(data){
                let me = this;
                this.usuarioError = '';
                this.descripcionError = '';

                if(this.regCodigo.length <=2  || this.regDescripcion.length <=3 ){
                    new PNotify({
                        title: 'Actualizar Perfil',
                        text: 'Complete los campos obligatorios',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    return  false;
                }

                

                if(this.dataCheck.length ==0){
                    new PNotify({
                        title: 'Actualizar Perfil',
                        text: 'Debe seleccionar al menos un menú',
                        type: 'info',
                        delay: 3000,
                        styling: 'bootstrap3',
                        addclass: 'dark'
                    });
                    return  false;
                }

                const ObjPerfil = {
                    intIdPerfil:this.intIdEdit,
                    strCoPerfil:this.regCodigo,
                    strDesPerfil:this.regDescripcion,
                    bitFlActivo:this.regEstado ? true:false,
                }

                let hash = {};
                let dataMenuIndo = this.dataCheck.filter(o => hash[o.intIdMenu] ? false : hash[o.intIdMenu] = true);


               // const dataMenuIndo = this.eliminarObjetosDuplicadosMix(this.dataCheck,'intIdMenu') 

                console.log(dataMenuIndo)

                   $.post(
                    '/Seguridad/InsertUpdatePerfil',
                       { intIdMenu: this.intIdMenu, ObjPerfil: ObjPerfil, listaDetallesPerfil: dataMenuIndo, intTipoOperacion: 2 },
                    (response) => {
                         me.messageResponse(response,"Actualizar Perfil")
                        if (response.type === 'success') {
                            me.getTableData();
                            me.cleanControl();
                            this.editState=false;
                            this.registerState=false;
                        }
                        if (response.type === 'codigo') {
                            this.usuarioError=response.message;
                        }
                        if (response.type === 'descripcion') {
                            this.descripcionError=response.message;
                        }
                       
                    }).fail((result) => {
                        alert('ERROR ' + result.status + ' ' + result.statusText);
                    });
 
            },
            deleteShowModal(data){
                let me = this;
                    swal({
                        title: "Eliminar Perfil",
                        text: `¿Está seguro de eliminar el perfil "${data.strDescription}"?`,
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
                const url = `/${this.controllerName}/EliminarPerfil`;
                const params = { 
                    intIdMenu:this.intIdMenu,
                    intIdPerfil: data.idItem,
                }
                axios.post(url, this.getFormDataMix(params))
                .then(resp => {
                    this.messageResponse(resp.data,'Eliminar Perfil') ;
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
            async getMaestroCaracteres(){
                const url = `/${this.controllerName}/getMaestroCaracteres`;
                await axios.post(url)
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
            checkSelectAll(data){
                let el = 'checkall'+data.intIdMenu;
                let checkBox = document.getElementById(el);

                let strCoMenu = data.strCoMenu;
                const listaMenu = this.subMenuData.filter((item, keyIndex)=> {
                    return (item.strCoMenuRela!=="" && item.strCoMenuRela==strCoMenu);
                })

                const checkInput = [];
                
                listaMenu.forEach((valor, indice)=> {
                    if(strCoMenu==valor.strCoMenuRela){
                        this.dataCheck.forEach((item,key)=>{
                            if(valor.intIdMenu == item.intIdMenu){
                               checkInput.push(valor)
                            }
                        })
                    }
                });

                if(listaMenu.length>0){
                    if(listaMenu.length == checkInput.length){
                        checkBox.checked= true;
                    }else{
                        checkBox.checked= false;
                    }
                }
                
            },
            updatePanel(){
                this.$forceUpdate();
            },
            async nuevoRegistroForm(state){
                try {
                    await this.getSubMenuRegister()
                    await this.getMaestroCaracteres()
                } catch (error) {
                    
                }finally{

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
           this.getSubMenuRegister();
        }
    }
</script>
