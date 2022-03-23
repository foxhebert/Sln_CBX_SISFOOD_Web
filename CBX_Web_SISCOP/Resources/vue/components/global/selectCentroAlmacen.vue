<template>
    <select class="form-control" id="CboCampTipo"  v-model="localState" :required="required" >
        <option  value="0" selected>Seleccione</option>
        <option v-for="(item, key) in data" :value="item.intIdCentroAlm" :key="key">{{item.strDesCentroAlm}}</option>
    </select>
</template>

<script>
    export default {
        props: {
            value:{required:false},
            strEntidad: { type: String, require: false, default: 'TGTIPO' },
            intIdFiltroGrupo: { type: Number, require: false, default: 0 },
            strGrupo: { type: String, require: false, default: 'EMP' },
            strSubGrupo: { type: String, require: false, default: 'TIPO' },
            required: { type: Boolean, require: false, default: true },
        },
        data(){
            return{
                data:[],
                errors:[],
                intIdMenu:this.getSubMenuIdMix()
            }
        },
        computed: {
            localState: {
                get() {
                    return this.value
                },
                set(localState) {
                    this.$emit('input', localState)
                }
            },
        },
        methods:{
            getDataTipo(){
                const url = "/Cliente/ListarCombosCentroAlmacen";
                const params = { 
                        intIdMenu:this.intIdMenu,
                        strEntidad: 'CENTROALM15',
                        intIdFiltroGrupo: 0,
                        strGrupo: 'CENTROALM15',
                        strSubGrupo: ''
                    };

                axios.post(url,params)
                    .then(resp => {
                    this.data = resp.data;
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