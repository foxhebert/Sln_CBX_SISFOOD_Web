<template>
    <div class="table-loading">
        <v-client-table 
            :data="data"
            :columns="columns" 
            :options="options">
            
            <template  slot="afterFilterWrapper">
                <limit-table :data="data"/>
            </template> 
             
              <template slot="beforeTable">
                    <div v-if="checkboxshow" class="ml-3">
                        <div class="icheck-material-blue">
                            <input type="checkbox" disabled="disabled" id="selecionartodoasrows"  >
                            <label for="selecionartodoasrows">Seleccionar Todos (0)</label>
                        </div>
                    </div>
                </template>

            <template slot="appendBody">
                <tr class="VueTables__no-resultsm-loading">
                    <td tabindex="0" :colspan="columns.length" class="text-center">{{msg}}</td>
                </tr>
            </template>
        </v-client-table>
    </div>
</template>

<script>
export default {
    props:{
        data:{type:Array,default:()=>[],required:false},
        columns:{type:Array,default:[], required:true},
        options:{type:Object,default:{}, required:true},
        msg:{type:String,default:"Cargando...", required:false},
        checkboxshow:{type:Boolean,default:false, required:false},
    }
}
</script>

<style lang="css" >
.table-loading tbody tr{
    display: none;
}
.VueTables__no-resultsm-loading{
    display: table-row !important;
    visibility: visible !important;
    background-color: #f9f9f9;
}
</style>