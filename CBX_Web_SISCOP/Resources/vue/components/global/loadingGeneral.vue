<template>
   <div class="container-loadin">
        <div class="loading-circle-app-div">
            <div class="loading-circle-app"></div>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style  scoped>

        .loading-circle-app-div{
            --theme-color-success:#1abb9c;
            left: calc(50% - 22px);
            top: calc(50% - 22px);
            border: 2px solid var(--theme-color-success);
            border-radius: 50%;
            height: 44px;
            width: 44px;
            pointer-events: none;
            position: absolute;
            -webkit-transition: opacity .2s cubic-bezier(.35,0,.25,1) 0s;
            transition: opacity .2s cubic-bezier(.35,0,.25,1) 0s;
            margin: 0;
            padding: 0;
            -webkit-animation: _animation-circle-loading .8s linear infinite;
            animation: _animation-circle-loading .8s linear infinite;
            opacity: 1;
            -webkit-transition-delay: 1s;
            transition-delay: 1s;
        }
        .loading-circle-app{
            --theme-color-success:#1abb9c;
            border-radius: 50%;
            box-sizing: border-box;
            height: calc(100% + 4px);
            width: calc(100% + 4px);
            border-top: 0 solid transparent;
            border-right: 4px solid var(--theme-color-success);
            border-bottom: 4px solid transparent;
        }
        @-webkit-keyframes _animation-circle-loading{
    0%{
        -webkit-transform:rotate(-45deg);
        transform:rotate(-45deg)
    }
    to{
        -webkit-transform:rotate(315deg);
        transform:rotate(315deg)
    }
}
@keyframes _animation-circle-loading{
    0%{
        -webkit-transform:rotate(-45deg);
        transform:rotate(-45deg)
    }
    to{
        -webkit-transform:rotate(315deg);
        transform:rotate(315deg)
    }
}

.loading-circle-app label{
    font-size: 12px;
}
</style>
