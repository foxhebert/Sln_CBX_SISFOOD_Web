<template>
    <div>
        <dropdown :data="data" multiple :cbChanged="changedSelectMultipleCliente" placeholder="Clientes" :width="207" class="cboMultipleHeader" ></dropdown>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                cboCliente:'',
                cboCentro:'',
                data:[],
                errors:[],
                intIdMenu:this.getSubMenuIdMix()
            }
        },
        created() {
            EventBus.$on('clickHeaderLink', (data) => {
                this.cboCliente = '';
                this.cboCentro = '';
                this.getDataTipo();
            })
            EventBus.$on('eventCboCentroAlmacenSelectMultiple', (data) => {
                this.cboCentro=data;
                this.getDataTipo();
            })
        },
        methods:{
            changedSelectMultipleCliente(select) {
                let dataSelect = select;
                let dataCheck=[];
                dataSelect.forEach(item => {
                    dataCheck.push(item.value)
                });
                if(dataCheck.length>0){
                    this.cboCliente= dataCheck.join(",");
                }else{
                    this.cboCliente= '';
                }
                this.emitEventCombo(this.cboCliente)
            },
            emitEventCombo(data){
                EventBus.$emit('eventCboClienteSelectMultiple',data)
            },
            getDataTipo(){
                const url = "/Tienda/ListarCombosCliente";
                let params = {};
                if(this.cboCentro==''){
                    params = { 
                        intIdMenu:this.intIdMenu,
                        strEntidad: 'CBOCLIENTE16',
                        intIdFiltroGrupo: 0,
                        strGrupo: 'CBOCLIENTE16',
                        strSubGrupo: ''
                    };
                }else{
                    params = { 
                        intIdMenu:this.intIdMenu,
                        strEntidad: 'CBOCLIENTE18DEPENMULTIPLE',
                        intIdFiltroGrupo: 0,
                        strGrupo: 'CBOCLIENTE18DEPENMULTIPLE',
                        strSubGrupo: this.cboCentro
                    };
                }

                axios.post(url,params)
                .then(resp => {
                    let response = resp.data;
                    let dataInfo = [];
                    response.forEach(item => {
                        dataInfo.push({value:item.intIdCliente, label:item.strDesCliente,})
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