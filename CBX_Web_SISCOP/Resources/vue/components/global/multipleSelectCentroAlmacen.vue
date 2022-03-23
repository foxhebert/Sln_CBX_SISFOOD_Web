<template>
    <div>
        <dropdown :data="data" multiple :cbChanged="changedSelectMultipleCentroAlmacen" placeholder="Centros" :width="207" class="cboMultipleHeader" ></dropdown>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                cboCentroAlmacen:'',
                data:[],
                errors:[],
                intIdMenu:this.getSubMenuIdMix()
            }
        },
        created() {
            EventBus.$on('clickHeaderLink', (data) => {
                this.cboCentroAlmacen = '';
                this.getDataTipo();
                //this.emitEventCombo(this.cboCentroAlmacen)
            })
        },
        methods:{
            changedSelectMultipleCentroAlmacen(select) {
                let dataSelect = select;
                let dataCheck=[];
                dataSelect.forEach(item => {
                    dataCheck.push(item.value)
                });
                if(dataCheck.length>0){
                    this.cboCentroAlmacen= dataCheck.join(",");
                }else{
                    this.cboCentroAlmacen= '';
                }
                this.emitEventCombo(this.cboCentroAlmacen)
            },
            emitEventCombo(data){
                EventBus.$emit('eventCboCentroAlmacenSelectMultiple',data)
            },
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
                    let response = resp.data;
                    let dataInfo = [];
                    response.forEach(item => {
                        dataInfo.push({value:item.intIdCentroAlm, label:item.strDesCentroAlm,})
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