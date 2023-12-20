<template>
  <div class="page-container">
    <div class="post-container">
    
      <div class="sidebar">
        <nav class="nav flex-column">
          <RouterLink :to="`/post/list/${encodeURIComponent('공지사항')}`"> <p class="nav-link">공지사항</p></RouterLink>
          <RouterLink :to="`/post/list/${encodeURIComponent('Q&A').replace(/%26/g, '&')}`"> <p class="nav-link">Q&A</p></RouterLink>
          <RouterLink to="/post/register/"> <p class="nav-link">글쓰기</p></RouterLink>
        </nav>
      </div>
      
      <div class="section">
        <RouterView></RouterView>
      </div>
      
    </div>
    <!--post-container-->
  </div>
  <!--page-container-->
</template>

<script setup>
</script>

<style scoped>
@import './MainPost.css';
</style>
