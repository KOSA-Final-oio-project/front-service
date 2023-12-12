<template lang="">
    <Header/>
    <div class="main">
  <div class="section">Content for section</div>
  <div class="section">Content for another section</div>
  <!-- Add more sections as needed -->
</div>
    <Footer/>
</template>
<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
export default {
    name:'main',
    components:{Header,Footer}
}
</script>
<style scoped>
    .section {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #ccc;
  }
</style>