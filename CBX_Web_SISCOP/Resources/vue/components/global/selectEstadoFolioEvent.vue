<template>
    <select class="form-control"  @change="onChange($event)" v-model="cboEstadoFolio"  >
        <option value="0" selected>Todos</option>
        <option v-for="(item, key) in data" :value="item.intIdEstad" :key="key">{{item.strDeEstad}}</option>
    </select>
</template>

<script>
    export default {
        data(){
            return{
                nameController:"Folio",
                cboEstadoFolio:0,
                data:[],
                errors:[],
                intIdMenu:this.getSubMenuIdMix()
            }
        },
        created() {
            EventBus.$on('clickHeaderLink', (data) => {
                this.cboEstadoFolio = 0;
                //this.emitEventCombo(this.cboEstadoFolio)
            })
        },
        methods:{
            onChange(event) {
                this.cboEstadoFolio=event.target.value;
                this.emitEventCombo(event.target.value)
            },
            emitEventCombo(data){
                EventBus.$emit('eventCboEstadoFolio',data)
            },
            getDataTipo(){
                const url = `/${this.nameController}/ListarCombosFolioEstado`;
                const params = { 
                        intIdMenu:this.intIdMenu,
                       strEntidad: 'CBOESTADOFOLIO18',
                        intIdFiltroGrupo: 0,
                        strGrupo: 'CBOESTADOFOLIO18',
                        strSubGrupo: ''
                    };

                axios.post(url,params)
                    .then(resp => {
                    this.data = resp.data;
                })
                .catch(error => {
                    this.emitEventCombo(this.cboEstadoFolio)
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
