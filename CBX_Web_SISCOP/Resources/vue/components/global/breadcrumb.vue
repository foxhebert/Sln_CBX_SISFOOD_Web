<template>
    <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="breadcrumb d-flex">
                <a class="breadcrumb__step breadcrumb__step--active" href="#" id="PadreMenu_txt">{{breadTitle}}</a>
                <a class="breadcrumb__step" @click="limpiarControlHeader()" id="HijoMenu_txt">{{subTitle}}</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            breadTitle: { type: String, require: false, default: 'Mantenimiento' },
            subTitle: { type: String, require: false, default: '' },
        },
        methods:{
            limpiarControlHeader(){
               EventBus.$emit('clickHeaderLink',"click")
            }
        }
    }
</script>
<style lang="css">
    .breadcrumb__step{
        cursor: pointer;
    }
    .breadcrumb__step.breadcrumb__step--active{
            width: auto !important;
    }
    .breadcrumb__step:last-child {
    width: 100% !important;
}
</style>
