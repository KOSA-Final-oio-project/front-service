<template>
  <div class="page-container">
    <div class="post-container">
      <div class="sidebar">
        <nav class="nav flex-column">
          <RouterLink :to="`/post/list/${encodeURIComponent('공지사항')}`" class="nav-link">
            <p>공지사항</p></RouterLink
          >
          <RouterLink
            :to="`/post/list/${encodeURIComponent('Q&A').replace(/%26/g, '&')}`"
            class="nav-link"
          >
            <p>Q&A</p></RouterLink
          >
          <RouterLink to="/post/register/" class="nav-link"> <p>글쓰기</p></RouterLink>
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

<script setup></script>

<style scoped>
@import './MainPost.css';
</style>
