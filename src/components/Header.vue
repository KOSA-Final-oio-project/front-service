<template lang="">
  <body class="header-container">
    <div class="header">
  <div><img src="../assets/oio.png" alt="Logo" class="logo"></div>
  
  <div class="input-container">
    <div class="search-icon"><font-awesome-icon :icon="['fas', 'magnifying-glass']" /></div>
    <input type="text" class="search-input" placeholder="Search...">
  </div>

  <div class="icons-container">
    <div class="icons"><font-awesome-icon :icon="['fas', 'user-plus']" /><span>join</span></div>
    <div class="icons"><font-awesome-icon :icon="['fas', 'right-to-bracket']" /><span>login</span></div>
    <div class="icons"><font-awesome-icon :icon="['fas', 'user']" /><span>my</span></div>
    <div class="icons"><font-awesome-icon :icon="['fas', 'bag-shopping']" />0</div>
  </div>

</div>
<nav>
    <ul class="nav">
      <li><a href="#">홈</a></li>
      <li><a href="#">게시판</a></li>
      <li><a href="#">대여</a></li>
      <li><a href="#">채팅</a></li>
    </ul>
  </nav>
</body>
</template>
<script>
export default {
}
</script>
<style scoped>
.header-container{
  height: auto;
}
.icons-container{
  display: flex;
  position: relative;
  margin-right: 4%;

}
.icons{
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding:0px 8%;
  position: relative;
  top: 5px;
}
.icons > span{
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
.search-icon{
  margin:0px 10px;
}
.search-input {
    border: none;
    width: 80%;
  }
.search-input:focus {
  border-style: none;
  }
.header{
    display: flex;
}
body, html {
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
    width: 70px; /* Replace with actual size */
  }

  nav{
    display: flex;
    justify-content: center;
    margin-bottom: 2%;
  }
  .nav {
    display: flex;
    list-style-type: none;
  }
  .nav>li>a{
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
