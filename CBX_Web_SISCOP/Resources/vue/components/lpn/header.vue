<template>
    <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel_flex flex-wrap">
                <div class="mr-3">
                    <div class="control-label ">
                        <div class="">
                            <div id="fitroFechaFolio" class="pull-left range-datepicker-general form-control" alinform="true" style="background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc">
                                <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>
                                <span>January 01, 2019 - January 28, 2019</span> <b class="caret"></b>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mr-3">
                    <div class="d-flex">
                        <div class="form-group has-feedback">
                            <select-multiple-centroal-event/>
                        </div>
                    </div>
                </div>

                <div class="mr-3">
                    <div class="d-flex">
                        <div class="form-group has-feedback">
                            <select-multiple-cliente-event/>
                        </div>
                    </div>
                </div>

                <div class="mr-3">
                    <div class="d-flex">
                        <div class="form-group has-feedback">
                            <select-multiple-tienda-event/>
                        </div>
                    </div>
                </div>
               
                <div class="mr-3">
                    <div class="control-label ">
                        <input type="text" v-model="filtroLpnOMateria" @keyup="onChange($event)" class="form-control"   placeholder="LPN o Materia " maxlength="50" @keydown.space.prevent>
                    </div>
                </div>
                <div class="mr-3">
                    <div class="control-label ">
                        <input type="text" v-model="numeroDeFolio" @keyup="onChangeNumFolio($event)" class="form-control"   placeholder="N° de Folio " maxlength="100" @keydown.space.prevent>
                    </div>
                </div>

                <div class="mr-3">
                    <div class="control-label ">
                        <input type="text" v-model="numeroDePedidoOC" @keyup="onChangeNumPedido($event)" class="form-control"   placeholder="O/C o N° de Pedido" maxlength="100" @keydown.space.prevent>
                    </div>
                </div>

                 <div class="mr-3">
                    <div class="control-label ">
                         <div class="icheck-material-blue">
                            <input type="checkbox" v-model="soloObservados" @change="emitSoloObservados()"  id="soloobservados"  >
                            <label for="soloobservados">Solo Observados</label>
                        </div>
                    </div>
                </div>
        
                 <div class="mr-3" hidden>
                     <div class="control-label ">
                         <div class="icheck-material-blue">
                             <input type="checkbox" v-model="soloFoloExportable" @change="emitSoloFolioExportable()" id="solofoliosexportables">
                             <label for="solofoliosexportables">Solo Folios Exportables</label>
                         </div>
                     </div>
                 </div>
              
               
                
            </div>
        </div>
    </div>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker'
    //import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
export default {
    components: { DateRangePicker },
    data(){
        return{
            filtroLpnOMateria:'',
            numeroDeFolio:'',
            numeroDePedidoOC:'',

            dttFechIni:null,
            dttFechFin:null,

            soloFoloExportable:false,
            soloObservados:false,

   
        }
    },
    created() {
        EventBus.$on('clickHeaderLink', (data) => {
            this.filtroLpnOMateria = '';
            this.numeroDeFolio = '';
            this.numeroDePedidoOC = '';
            this.soloFoloExportable=false;
            this.soloObservados=false;
            this.restDatePicker();
            //this.emitfiltroLpnOMateria(this.filtroLpnOMateria)
           // this.emitNumeroDeFolio(this.numeroDeFolio)
            //this.emitNumeroDePedidoOC(this.numeroDePedidoOC)
            //this.emitSoloFolioExportable();
            //this.emitSoloObservados();
        })
    },
    methods:{
        onChange(event) {
            this.emitfiltroLpnOMateria(this.filtroLpnOMateria)
        },
        onChangeNumFolio(event){
            this.emitNumeroDeFolio(this.numeroDeFolio)
        },
         onChangeNumPedido(event){
            this.emitNumeroDePedidoOC(this.numeroDeFolio)
        },
        emitfiltroLpnOMateria(data){
            EventBus.$emit('eventfiltroLpnOMateria',data)
        },
        emitNumeroDeFolio(data){
            EventBus.$emit('eventEmitNumeroDeFolio',data)
        },
        emitNumeroDePedidoOC(data){
            EventBus.$emit('NumeroDePedidoOC',data)
        },

        emitRagoFechaFolioSearch(data){
            EventBus.$emit('eventRagoFechaFolioSearch',data)
        },
        emitSoloFolioExportable() {
          EventBus.$emit('eventSoloFolioExportable',this.soloFoloExportable)
        },
        emitSoloObservados() {
          EventBus.$emit('eventSoloObservados',this.soloObservados)
        },
        restDatePicker(){
            let dateCurrent = moment().format('DD-MM-YYYY')
            $('.range-datepicker-general span').html(dateCurrent + ' - ' + dateCurrent)
            let acitveClass = 'data-range-key';
        }
    },
    mounted(){
        let me = this;
        $('.range-datepicker-general').on('apply.daterangepicker', function (ev, picker) {
            const dttFechIniControl = picker.startDate.format('YYYY-MM-DD');
            const dttFechFinControl = picker.endDate.format('YYYY-MM-DD');
            // const dttFechIniControl = picker.startDate.format('DD-MM-YYYY');
            // const dttFechFinControl = picker.endDate.format('DD-MM-YYYY');
            me.dttFechIni = dttFechIniControl;
            me.dttFechFin = dttFechFinControl;
            me.emitRagoFechaFolioSearch({dttFechIniControl,dttFechFinControl})
        });
    }
}

</script>
