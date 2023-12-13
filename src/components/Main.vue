<template>
  <div>
    <Header />
    <div class="section">
    <routerView></routerView>
    </div>
    <div class="head">
      <router-link to="/top-view"><div class="views">최다 조회수</div></router-link>
      <router-link to="/top-rental"><div class="views">최다 대여수</div></router-link>
    </div>

    <TopSection/>
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import TopSection from '../components/Main/TopSection.vue'

export default {
  name: 'mainComponent',
  components: {
    Header,
    Footer,
    TopSection
  },
}
</script>

<style scoped>
.head {
  padding-bottom:3%;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(0,0,0,0.5);
}

.views {
  text-decoration: none;
  border: 1px solid black;
  border-radius: 20px;
  padding: 10px;
  margin: 0 10px;
}

.views:focus {
  background-color: blue;
}

.section {
  margin-top: 150px;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding: 20px;
  border-top: 1px solid #ccc;
}

</style>
