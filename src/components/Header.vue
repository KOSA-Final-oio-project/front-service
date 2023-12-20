<template>
  <body class="header-container">
      <div class="header">
          <div><img src="../assets/sample.png" alt="Logo" class="logo" /></div>

          <div class="input-container">
              <div class="search-icon">
                  <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
              </div>
              <router-link :to="`/product/searchProduct/${searchValue}`">
    <input type="text" class="search-input" v-model="searchValue" placeholder="Search..." />
</router-link>
          </div>

          <div class="icons-container">
              <router-link
                  to="/member-service/signup"
                  :class="{ icons: true, loginCheck: loginCheck }"
                  v-if="!loginChk()"
              >
                  <font-awesome-icon :icon="['fas', 'user-plus']" />
                  <span>join</span>
              </router-link>
              <div
                  @click="logout()"
                  :class="{ icons: true, loginCheck: loginCheck }"
                  v-if="loginChk()"
              >
                  <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
                  <span>logout</span>
              </div>

              <router-link
                  :class="{ icons: true, loginCheck: loginCheck }"
                  to="/member-service/login"
                  v-if="!loginChk()"
              >
                  <font-awesome-icon :icon="['fas', 'right-to-bracket']" />
                  <span>login</span>
              </router-link>
              <a href="/mypage" class="icons" v-if="loginChk()">
                  <font-awesome-icon :icon="['fas', 'user']" />
                  <span>my</span>
              </a>
          </div>
      </div>
      <nav>
          <ul class="nav">
              <li><router-link to="/">홈</router-link></li>
              <li><router-link to="/">게시판</router-link></li>
              <li><router-link to="/product/productList">대여</router-link></li>
              <li><a href="#">채팅</a></li>
          </ul>
      </nav>
  </body>
</template>
<script>
export default {
  data() {
      return {
          loginCheck: false,
          searchValue: ''
      }
  },

  methods: {
      enterJoin() {
          this.$router.push(`/member-service/signup`)
      },
      loginChk() {
          if (localStorage.getItem('nickname')) {
              return true
          }
      },
      logout() {
          localStorage.removeItem('nickname')
          window.location = '/'
      }
  }
}
</script>
<style scoped>
.loginCheck {
  display: none;
}
.header-container {
  position: fixed;
  width: 100%;
  height: 150px;
  top: 0;
  z-index: 1000;
  background-color: white; /* Add background color if needed */
}
.icons-container {
  display: flex;
  position: relative;
  margin-right: 4%;
}
.icons {
  color: black;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 8%;
  position: relative;
  top: 5px;
}
.icons > div {
  text-align: center;
}
.input-container {
  display: flex;
  border: solid black 1px;
  text-align: center;
  align-items: center;
  border-radius: 30px;
  width: 44%;
  height: 6vh;
  margin-left: 7%;
}
.search-icon {
  margin: 0px 10px;
}
.search-input {
  outline: none;
  border: none;
  width: 80%;
}
.search-input:focus {
  border-style: none;
}
.header {
  display: flex;
}
body,
html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.logo {
  width: 90px; /* Replace with actual size */
}

nav {
  display: flex;
  justify-content: center;
  margin-bottom: 2%;
}
.nav {
  display: flex;
  list-style-type: none;
}
.nav > li > a {
  font-size: 20px;
}

.nav li {
  padding: 0 15px;
}

.nav li a {
  text-decoration: none;
  color: black;
}

.main {
  padding: 20px;
}

.section {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
}

.footer {
  text-align: center;
  padding: 10px 0;
  background: #f1f1f1;
}
</style>