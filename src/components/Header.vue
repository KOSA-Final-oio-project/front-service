<template>
  <body class="header-container">
    <div class="header">
      <div class="logo-container"><img src="../assets/logo.png" alt="Logo" class="logo" /></div>

      <div class="input-container">
        <div class="search-icon">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        </div>
        <router-link :to="`/product/searchProduct/${searchValue}`">
          <input type="text" class="search-input" v-model="searchValue" placeholder="Search..."  @keyup.enter="searchOnEnter"/>
        </router-link>
      </div>

      <div class="icons-container">
        <router-link to="/member/signup" :class="{ icons: true, loginCheck: loginCheck }" v-if="!loginChk()">
          <font-awesome-icon :icon="['fas', 'user-plus']" />
          <span>join</span>
        </router-link>
        <div @click="logout()" :class="{ icons: true, loginCheck: loginCheck }" v-if="loginChk()">
          <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
          <span>logout</span>
        </div>

        <router-link :class="{ icons: true, loginCheck: loginCheck }" to="/member/login" v-if="!loginChk()">
          <font-awesome-icon :icon="['fas', 'right-to-bracket']" />
          <span>login</span>
        </router-link>
        <a href="/mypage" class="icons" v-if="loginChk()">
          <font-awesome-icon :icon="['fas', 'user']" />
          <span>my</span>
        </a>
      </div>
    </div>
    <div class="nav-container">
      <nav>
        <ul class="nav">
          <li><router-link to="/">홈</router-link></li>
          <li>
            <router-link :to="`/post/list/${encodeURIComponent('공지사항')}`">게시판</router-link>
          </li>
          <li><router-link to="/product/productList">대여</router-link></li>
          <li><router-link to="/chat">채팅</router-link></li>
        </ul>
      </nav>
    </div>
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
    searchProducts() {
      this.$router.push(`/product/searchProduct/${this.searchValue}`);
    },
    // 엔터 키 입력 시 검색 기능이 동작하도록 하는 메소드입니다.
    searchOnEnter() {
      this.searchProducts();
    },
      enterJoin() {
          this.$router.push(`/member/signup`)
      },
      loginChk() {
          if (localStorage.getItem('nickname')) {
              return true
          }
      },
      logout() {
          localStorage.clear()
          window.location = '/'
      },
      
  }
}
</script>
<style scoped>
@font-face {
    font-family: 'NotoSansKR-VariableFont_wght';
    src: url(/fonts/NotoSansKR-VariableFont_wght.ttf);
}

* {
    font-family: 'NotoSansKR-VariableFont_wght';
}

.welcome {
  display: flex;
  /* Add this line to make it a flex container */
  text-align: right;
  padding: 0;
}

.header {
  margin-bottom: 3px;
  display:flex;
}

.loginCheck {
  display: none;
}

.header-container {
  position: fixed;
  margin-bottom: 10px;
  width: 100%;
  height: 22.5%;
  top: 0;
  z-index: 1000;
  background-color: white;
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

.icons>div {
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
  /* padding: 10px 20px; */
}

.logo {
  width: 130px;
  margin-top: 20px;
  margin-left: 50px;
}

.logo:hover {
  cursor: pointer;
}

nav {
  display: flex;
  justify-content: center;
  /* margin-bottom: 5%; */
  /* margin-top: 35px; */
}

.nav {
  display: flex;
  list-style-type: none;
}

.nav-container{
  margin-bottom: 150px;
}
.nav>li>a {

  font-size: 22px;
  font-weight: 500;
}

.nav li {
  padding: 0 15px;
}

.nav li:hover {
  cursor: pointer;
}

.nav li:hover a {
  color: #18B7BE; /* 호버 시 텍스트 색상 변경 */
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