<template>
    <select class="form-control" id="CboCampTipo" @change="onChange($event)" v-model="cboTipo" :required="required" >
        <option v-if="!register" value="0" selected>Todos</option>
        <option v-if="register" value="0" selected>Seleccione</option>
        <option v-for="(item, key) in data" :value="item.intIdCliente" :key="key">{{item.strDesCliente}}</option>
    </select>
</template>

<script>
    export default {
        props: {
            strEntidad: { type: String, require: false, default: 'CBOCLIENTE16' },
            intIdFiltroGrupo: { type: Number, require: false, default: 0 },
            strGrupo: { type: String, require: false, default: 'EMP' },
            strSubGrupo: { type: String, require: false, default: 'CBOCLIENTE16' },
            register: { type: Boolean, require: false, default: false },
            required: { type: Boolean, require: false, default: true },
        },
        data(){
            return{
                cboTipo:0,
                data:[],
                errors:[],
                intIdMenu:this.getSubMenuIdMix()
            }
        },
        created() {
            EventBus.$on('clickHeaderLink', (data) => {
                this.cboTipo = 0;
                //this.emitEventCombo(this.cboTipo)
            })
        },
        methods:{
            onChange(event) {
                this.cboTipo=event.target.value;
                this.emitEventCombo(event.target.value)
            },
            emitEventCombo(data){
                EventBus.$emit('cboClienteSelect',data)
            },
            getDataTipo(){
                const url = "/Tienda/ListarCombosCliente";
                const params = { 
                        intIdMenu:this.intIdMenu,
                        strEntidad: 'CBOCLIENTE16',
                        intIdFiltroGrupo: 0,
                        strGrupo: 'CBOCLIENTE16',
                        strSubGrupo: ''
                    };

                axios.post(url,params)
                    .then(resp => {
                    this.data = resp.data;
                    //this.emitEventCombo(this.cboTipo)
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