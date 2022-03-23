<template>
    <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel_flex flex-wrap">
                <div class="mr-3">
                    <div class="control-label ">
                        <input type="text" v-model="numeroDeFolio" @keyup="onChange($event)" class="form-control"   placeholder="Número de Folio " maxlength="50" @keydown.space.prevent>
                    </div>
                </div>
                <div class="mr-3">
                    <div class="control-label ">
                        <input type="text" v-model="numeroDePedido" @keyup="onChangeNumPedido($event)" class="form-control"   placeholder="Número de Pedido " maxlength="100" @keydown.space.prevent>
                    </div>
                </div>
                <div class="mr-3">
                    <div class="d-flex">
                        <label class="mr-2 mt-2 pt-1">Estado</label>
                        <div class="form-group has-feedback">
                            <select-estado-folio-event />
                        </div>
                    </div>
                </div>
                <div class="mr-3">
                    <div class="control-label ">
                        <div class="">
                            <div id="fitroFechaFolio" class="pull-left range-datepicker-general form-control" style="background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc">
                                <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>
                                <span>January 01, 2019 - January 28, 2019</span> <b class="caret"></b>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mr-3">
                    <div class="d-flex">
                        <label class="mr-2 mt-2 pt-1" >Centro</label>
                        <div class="form-group has-feedback">
                            <select-tipo  :int-id-filtro-grupo="0"/>
                        </div>
                    </div>
                </div>
                 <div class="mr-3">
                    <div class="d-flex">
                        <label class="mr-2 mt-2 pt-1" >Cliente</label>
                        <div class="form-group has-feedback">
                            <select-cliente-depen-event />
                            <!-- <select-cliente  :int-id-filtro-grupo="0"/> -->
                        </div>
                    </div>
                </div>
                  <div class="mr-3">
                    <div class="d-flex">
                        <label class="mr-2 mt-2 pt-1" >Tienda</label>
                        <div class="form-group has-feedback">
                            <!-- <select-tienda-event/> -->
                            <select-tienda-depen-event />
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
            numeroDeFolio:'',
            numeroDePedido:'',

            dttFechIni:null,
            dttFechFin:null,
        }
    },
    created() {
        EventBus.$on('clickHeaderLink', (data) => {
            this.numeroDeFolio = '';
            this.numeroDePedido = '';
            this.restDatePicker();
            //this.emitNumeroDeFolioSearch(this.numeroDeFolio)
            //this.emitNumeroDePedidoSearch(this.numeroDePedido)
        })
    },
    methods:{
        onChange(event) {
            this.emitNumeroDeFolioSearch(this.numeroDeFolio)
        },
        onChangeNumPedido(event){
            this.emitNumeroDePedidoSearch(this.numeroDePedido)
        },
        emitNumeroDeFolioSearch(data){
            EventBus.$emit('eventNumeroDeFolioSearch',data)
        },
        emitNumeroDePedidoSearch(data){
            EventBus.$emit('eventNumeroDePedidoSearch',data)
        },
        emitRagoFechaFolioSearch(data){
            EventBus.$emit('eventRagoFechaFolioSearch',data)
        },
        getDateRangePickerFeriado() {
            const idRange = ".range-datepicker";
            const fechaInicio = $(idRange).data('daterangepicker').startDate.format('DD/MM/YYYY');
            const fechaFin = $(idRange).data('daterangepicker').endDate.format('DD/MM/YYYY');
            return { fInicio: fechaInicio, fFin: fechaFin }
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
            const dttFechIniControl = picker.startDate.format('DD-MM-YYYY');
            const dttFechFinControl = picker.endDate.format('DD-MM-YYYY');
            me.dttFechIni = dttFechIniControl;
            me.dttFechFin = dttFechFinControl;
            me.emitRagoFechaFolioSearch({dttFechIniControl,dttFechFinControl})
        });
    }
}

</script>