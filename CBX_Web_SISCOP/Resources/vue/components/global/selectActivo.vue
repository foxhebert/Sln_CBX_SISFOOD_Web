<template>
    <select class="form-control" @change="onChange($event)" v-model="cboEstado">
        <option value="2" selected>Todos</option>
        <option value="1">Activo</option>
        <option value="0">Inactivo</option>
    </select>
</template>

<script>
    export default {
        data(){
            return{
                cboEstado:2,
            }
        },
        created() {
            EventBus.$on('clickHeaderLink', (data) => {
                this.cboEstado = 2;
                //this.emitEventCombo(this.cboEstado)
            })
        },
        methods:{
            onChange(event) {
                this.cboEstado=event.target.value;
                this.emitEventCombo(event.target.value)
            },
            emitEventCombo(data){
                EventBus.$emit('cboEstadoSelect',data)
            },
        },
        mounted() {
            //EventBus.$emit('cboEstadoSelect',this.cboEstado)
        }
    }
</script>
