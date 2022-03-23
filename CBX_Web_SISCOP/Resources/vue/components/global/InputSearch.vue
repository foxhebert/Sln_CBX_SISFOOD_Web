<template>
    <div>
        <div v-click-outside="mouseLeaveBusqueda" class="header-search-wrapper p-relative">
            <div class="header-search">
                <div class="header-search-input-wrapper">
                    <input type="search" v-model="searchQuery" @keyup="searchData()" @focus="focusInput()" name="search" autocomplete="off" :placeholder="textSearch" class="header-search-input">
                    <i class="material-icons icons-search-header">search</i>
                </div>
            </div>
            <div class="search-container" :class="{'active':active}">
                <div class="p-top-search">
                    <div>
                        <div v-for="(item, keylist) in data" :key="keylist" class="result-div result-course">
                            <a>
                                <div class="search-item__with-image">
                                    <div class="mr-2">
                                        <div>
                                            <img src="https://malconga.dev/storage/course/Vue-JS.png">
                                        </div>
                                    </div>
                                    <div class="tw-ellipsis d-flex">
                                        <p class="tw-ellipsis">
                                            {{item.title}}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import vClickOutside from 'v-click-outside'
import {mapState} from 'vuex'
export default {
    directives: {
      clickOutside: vClickOutside.directive
    },
    data() {
        return {
            textSearch:'¿Qué estás buscando?',
            active:false,
            searchQuery:'',
            data:[],
            errors:[],
        }
    },
    computed:{
        ...mapState(['isAuthenticaded']),
        ...mapState('user', ['user']),
    },
    methods:{
        searchData(){
            if(this.searchQuery && this.searchQuery.length > 0){
                this.active=true;
                // aqui hacer peticion al servidor de busueda
            }else{
                this.active=false;
            }
        },
        focusInput(){
            if(this.searchQuery.length > 0){
                this.active=true;
            }else{
                this.active=false;
            }
        },
        mouseLeaveBusqueda(){
           this.active = false
        },
        setTextTitleSearch(){
            if(this.isAuthenticaded){
                const name = this.user.name;
                const nameArray = name.trim().split(' ');
                this.textSearch=`¿Qué estás buscando, ${nameArray[0]}?`;
            }
        }
    },
    mounted(){
        this.setTextTitleSearch()
    }
}
</script>
