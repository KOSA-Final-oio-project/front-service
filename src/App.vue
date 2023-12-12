<template>
    <Main/>
    <section></section>
    <router-view></router-view>
</template>

<script>
import Main from './components/Main.vue'
export default {
    name: 'App',
    components:{Main},
};
</script>

<style></style>
