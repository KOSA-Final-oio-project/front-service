<template>
    <Header />
    <div>
        <router-view></router-view>
        <router-view name="AllProduct"></router-view>
    </div>
    <Footer />
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
export default {
    name: 'mainComponent',
    components: {
        Header,
        Footer
    }
}
</script>

<style scoped>
.header {
    margin-top: 150px;
}
</style>
