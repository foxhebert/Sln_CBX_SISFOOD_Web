<template>
    <div>
        <dropdown :data="data" multiple :cbChanged="changedSelectMultipleTienda" placeholder="Tiendas" :width="207" class="cboMultipleHeader" ></dropdown>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                nameController:"Tienda",
                cboTienda:'',
                cboCliente:'',
                data:[],
                errors:[],
                intIdMenu:this.getSubMenuIdMix()
            }
        },
        created() {
            EventBus.$on('clickHeaderLink', (data) => {
                this.cboTienda = '';
                this.cboCliente = '';
                this.getDataTipo();
            })

            EventBus.$on('eventCboClienteSelectMultiple', (data) => {
                this.cboCliente = data;
                this.getDataTipo();
            })
            EventBus.$on('eventCboCentroAlmacenSelectMultiple', (data) => {
                this.cboTienda = 0;
                this.cboCliente = 0;
                this.getDataTipo();
            })
        },
        methods:{
            changedSelectMultipleTienda(select) {
                let dataSelect = select;
                let dataCheck=[];
                dataSelect.forEach(item => {
                    dataCheck.push(item.value)
                });
                if(dataCheck.length>0){
                    this.cboTienda= dataCheck.join(",");
                }else{
                    this.cboTienda= '';
                }
                this.emitEventCombo(this.cboTienda)
            },
            emitEventCombo(data){
                EventBus.$emit('eventCboTiendaSelectMultiple',data)
            },
            getDataTipo(){
                const url = `/${this.nameController}/ListarCombosTienda`;
                let params = {};
                if(this.cboCliente==''){
                    params = { 
                        intIdMenu:this.intIdMenu,
                       strEntidad: 'CBOTIENDA17',
                        intIdFiltroGrupo: 0,
                        strGrupo: 'CBOTIENDA17',
                        strSubGrupo: ''
                    };
                }else{
                    params = { 
                        intIdMenu:this.intIdMenu,
                       strEntidad: 'CBOTIENDA19DEPENMULTIPLE',
                        intIdFiltroGrupo: 0,
                        strGrupo: 'CBOTIENDA19DEPENMULTIPLE',
                        strSubGrupo: this.cboCliente
                    };
                }


                axios.post(url,params)
                .then(resp => {
                    let response = resp.data;
                    let dataInfo = [];
                    response.forEach(item => {
                        dataInfo.push({value:item.intIdTienda, label:item.strDesTienda,})
                    });
                    this.data = dataInfo;
                })
                .catch(error => {
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors;
                    }
                });
            }
        },
        mounted() {
            this.getDataTipo();
        }
    }
</script>