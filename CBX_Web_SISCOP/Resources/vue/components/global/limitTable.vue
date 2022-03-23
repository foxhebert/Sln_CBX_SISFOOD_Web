<template>
    <div v-show="setLimitSelect" class="form-group form-inline pull-right VueTables__limit">
        <div class="VueTables__limit-field">
            <label for="VueTables__limit_Tb3bm">Mostrar:</label>
            <select  class="form-control">
                <option value="10" >10</option>
                <option value="25">25</option>
                <option value="50">50</option>
            </select>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        data:{type:Array,required:true, default:[]}
    },
    data(){
        return{
            options:{
                ...this.configDataTableMix()
            }
        }
    },
    computed: {
        setLimitSelect(){
            return !!(this.data.length <= this.options.perPage || this.data.length==0);
        }
    },
}
</script>