<template>
     <select class="form-control min-with-select" id="CboCampTipo" @change="onChange($event)" v-model="cboTipo"  >
        <option  value="0" selected>Todos</option>
        <option v-for="(item, key) in data" :value="item.intIdCliente" :key="key">{{item.strDesCliente}}</option>
    </select>
</template>


<script>
    export default {
        data(){
            return{
                cboTipo:0,
                cboCentro:0,
                data:[],
                errors:[],
                intIdMenu:this.getSubMenuIdMix()
            }
        },
        created() {
            EventBus.$on('clickHeaderLink', (data) => {
                this.cboTipo = 0;
                this.cboCentro = 0;
                this.getDataTipo()
            })
            EventBus.$on('eventCboAlmacenSelect', (data) => {
                this.cboCentro = data;
                this.getDataTipo()
            })
        },
        methods:{
            onChange(event) {
                this.cboTipo=event.target.value;
                this.emitEventCombo(event.target.value)
            },
            emitEventCombo(data){
                EventBus.$emit('cboClienteSelect',data)
                // EventBus.$emit('cboClienteSelectDependiente',data)
            },
            getDataTipo(){
                const url = "/Tienda/ListarCombosCliente";
                let params = {};
                if(this.cboCentro==0){
                     params = { 
                        intIdMenu:this.intIdMenu,
                        strEntidad: 'CBOCLIENTE16',
                        intIdFiltroGrupo: 0,
                        strGrupo: 'CBOCLIENTE16',
                        strSubGrupo: ''
                    }
                }else{
                     params = { 
                        intIdMenu:this.intIdMenu,
                        strEntidad: 'CBOCLIENTE17DEPEN',
                        intIdFiltroGrupo: this.cboCentro,
                        strGrupo: 'CBOCLIENTE17DEPEN',
                        strSubGrupo: ''
                    }
                }
                
                axios.post(url,params)
                    .then(resp => {
                    this.data = resp.data;
                    this.cboTipo = 0;
                })
                .catch(error => {
                    this.emitEventCombo(this.cboTipo)
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

<style lang="css">
    .min-with-select{
        min-width: 213px;
    }
</style>