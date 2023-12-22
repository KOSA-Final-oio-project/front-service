<template>
    <div class="footer_container">
      <div class="footer">
        <div class="footer_content">
          <h2>Contact</h2>
          <p>Email: jjdb9758@naver.com</p>
          <p>Phone: 010-2708-9349</p>
          <!-- 기타 연락처 정보 -->
        </div>
        <div class="footer_social">
          <ul class="social_media_icons">
            <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
            <li><a href="#"><i class="fab fa-twitter"></i></a></li>
            <!-- 기타 소셜 미디어 아이콘 -->
          </ul>
        </div>
        
      </div>
    </div>
  </template>
  
  <script>
  export default {
    // 해당 컴포넌트의 나머지 옵션들
  };
  </script>
  
  <style scoped>
  .footer_container {
    /* 화면 높이의 최소 30%를 차지하도록 설정 */
    min-height: 30vh;
    position: relative;
    /* height: 25vh; */
    z-index: -1;
  }
  
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #072a40; /* 배경색 변경 */
    color: #fff; /* 텍스트 색상 변경 */
    padding: 30px 0;
  }
  
  .footer_content,
  .footer_social,
  .footer_links {
    width: 30%;
    display: inline-block;
    vertical-align: top;
    padding: 0 20px;
  }
  
  .footer h2 {
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  .footer p,
  .footer ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .footer ul li {
    margin-bottom: 10px;
  }
  
  .footer ul li a {
    color: #fff;
    text-decoration: none;
  }
  
  .social_media_icons li {
    display: inline-block;
    margin-right: 10px;
  }
  
  .social_media_icons li a {
    color: #fff;
    font-size: 20px;
  }
  
  </style>
  