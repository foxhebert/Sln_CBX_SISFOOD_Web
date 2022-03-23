<template>
    <select class="form-control"  @change="onChange($event)" v-model="cboTienda"  >
        <option value="0" selected>Todos</option>
        <option v-for="(item, key) in data" :value="item.intIdTienda" :key="key">{{item.strDesTienda}}</option>
    </select>
</template>

<script>
    export default {
        data(){
            return{
                nameController:"Tienda",
                cboTienda:0,
                data:[],
                errors:[],
                intIdMenu:this.getSubMenuIdMix()
            }
        },
        created() {
            EventBus.$on('clickHeaderLink', (data) => {
                this.cboTienda = 0;
                //this.emitEventCombo(this.cboTienda)
            })
        },
        methods:{
            onChange(event) {
                this.cboTienda=event.target.value;
                this.emitEventCombo(event.target.value)
            },
            emitEventCombo(data){
                EventBus.$emit('eventCboTiendaSelect',data)
            },
            getDataTipo(){
                const url = `/${this.nameController}/ListarCombosTienda`;
                const params = { 
                         intIdMenu:this.intIdMenu,
                       strEntidad: 'CBOTIENDA17',
                        intIdFiltroGrupo: 0,
                        strGrupo: 'CBOTIENDA17',
                        strSubGrupo: ''
                    };

                axios.post(url,params)
                    .then(resp => {
                    this.data = resp.data;
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