<template>
    <select class="form-control" id="CboCampTipo"  v-model="localState" :required="required" >
        <option  value="0" selected>Seleccione</option>
        <option v-for="(item, key) in data" :value="item.intidTipo" :key="key">{{item.strDeTipo}}</option>
    </select>
</template>

<script>
    export default {
        props: {
            value:{required:false},
            required: { type: Boolean, require: false, default: true },
        },
        data(){
            return{
                nameController:"Personal",
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
                const url = `/${this.nameController}/ListarCombosPersonal`;
                const params = { 
                        intIdMenu:this.intIdMenu,
                        strEntidad: 'EMPRESA',
                        intIdFiltroGrupo: 0,
                        strGrupo: 'EMPRESA',
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
