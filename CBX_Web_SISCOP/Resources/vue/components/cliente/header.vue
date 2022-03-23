<template>
    <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="control-label col-md-4 col-sm-4 col-xs-12">
                    <input type="text" class="form-control" v-model="querySearch" @keyup="onChange($event)" id="strBusquedaGeneral" placeholder="Buscar por Código o Descripción">
                </div>

                <div class="">
                    <label class="control-label col-md-1 col-sm-1 col-xs-12">Centro de Almacenamiento</label>
                    <div class="col-md-2 col-sm-2 col-xs-12 form-group has-feedback">
                        <select-tipo  :int-id-filtro-grupo="0"/>
                    </div>
                </div>

                <div class="">
                    <label style="text-align:right !important;" class="control-label col-md-1 col-sm-1 col-xs-12">Estado</label>
                    <div class="col-md-2 col-sm-2 col-xs-12 form-group has-feedback">
                        <select-estado/>
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
                querySearch:'',
            }
        },
         created() {
            EventBus.$on('clickHeaderLink', (data) => {
                this.querySearch = '';
                //this.emitQuerySearch(this.querySearch)
            })
        },
        methods:{
            onChange(event) {
                this.emitQuerySearch(this.querySearch)
            },
            emitQuerySearch(data){
                EventBus.$emit('querySearchMain',data)
            },
        },
        mounted() {
           // this.emitQuerySearch(this.querySearch)
        }
    }
</script>