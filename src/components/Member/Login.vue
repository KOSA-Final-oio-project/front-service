<template>
  <h2>로그인</h2>
  <!-- 회원가입 폼 컨테이너 -->
  <div class="form-container">
    <!-- 서버단에 전송할 데이터 작성 구역 (폼) -->
    <form @submit.prevent="submitForm">
      <div class="form-container">
        <!-- 비밀번호 일치 & 불일치 메시지 표시 -->

        <!-- 닉네임 -->
        <div class="form-group">
          <label for="nickname">이메일</label>
          <div class="flex-container">
            <input type="nickname" v-model="this.user.email" id="nickname" />
          </div>
        </div>

        <!-- 핸드폰 인증번호 입력 -->
        <div class="form-group">
          <label for="phone-certificate">비밀번호</label>
          <div class="flex-container">
            <input type="password" v-model="this.user.password" id="phone-certificate" />
          </div>
        </div>

        <a class="findPassword" href="/FindId">아이디 찾기 </a>
        <a class="findPassword" href="/FindPassword">| 비밀번호 찾기</a>

        <!-- 가입하기 버튼 -->
        <div class="btn-container">
          <button type="submit" class="submit-btn" @click="login">로그인</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['loginChk'],
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      loginChk: false
    }
  },
  methods: {
    login() {
      axios
        // .post(this.$backURL + 'login', {
        .post('http://192.168.1.86:9797/oio/login', {
          email: this.user.email,
          password: this.user.password
        })
        .then((response) => {
          if (response.data.result == 'withdrawal') {
            alert('탈퇴한 회원입니다.')
          } else if (response.data.result == 'fail') {
            alert('아이디와 패스워드가 일치하지않습니다.')
          } else {
            let token = response.headers['accesstoken']
            console.log(token)
            const base64Payload = token.split('.')[1]
            const utf8DecodedPayload = decodeURIComponent(escape(atob(base64Payload)))
            const jsonObject = JSON.parse(utf8DecodedPayload)
            localStorage.setItem('accessToken', token)

            localStorage.setItem('nickname', jsonObject.nickname)

            window.location.href = '/'
          }
        })
        .error((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
h2 {
  margin-top: 150px;
}
@font-face {
  font-family: 'NotoSansKR-VariableFont_wght';
  src: url(/fonts/NotoSansKR-VariableFont_wght.ttf);
}

* {
  font-family: 'NotoSansKR-VariableFont_wght';
}
.findPassword {
  text-decoration: none;
}
.btn-container {
  margin-right: 20%;
}
/* 제목 타이틀 */
h2 {
  margin-top: 260px;
  text-align: center;
  margin-bottom: 50px;
}
.form-container {
  margin-left: 22%;
  /* 폼 컨테이너 너비 조절용 */
  max-width: 80%;
}

/* 각 입력창 영역 공통 스타일 */
.form-group {
  align-items: center;
  justify-content: space-between;
  margin-top: 50px;
  margin-bottom: 20px;
}

/* 폼들 위치 정렬을 위한 컨테이너 */
.form-container {
  width: 60%;
}

/* 인풋창이랑 버튼 수평정렬 하기 위해서 */
.flex-container {
  align-items: flex-start;
  display: flex;
}

/* 인풋창 왼쪽 텍스트들 (ex. 이메일 인증번호 등) */
form label {
  font-size: 18px;
  font-weight: bold;
  display: block;
  flex-basis: 20%;
  text-align: left;
  margin-top: 15px;
  margin-bottom: 0; /* 수평 정렬을 위해 하단 마진 제거 */
}

/* 입력창들 스타일 */
input {
  width: 80%;
  padding: 10px;
  border: none;
  border-bottom: 3px solid #ccc;
}

/* 추가: 포커스 시 스타일 변경 방지 */
input:focus {
  outline: none;
}

/* 버튼 공통 스타일 */
button {
  white-space: nowrap;
  margin-left: 20px;
  font-weight: bold;
}

/* 인증요청 & 중복확인 버튼 */
.certificate-btn,
.dup-chk-btn {
  width: 90px;
  height: 40px;
  border-radius: 30px;
  border: none;
  background-color: #18b7be;
  color: white;
}

/* 확인 버튼 */
.confirm-btn {
  width: 90px;
  height: 40px;
  border-radius: 30px;
  border: none;
  background-color: #18b7be;
  color: white;
}

/* 인풋창 아래 정보 */
.info {
  display: block;
  margin-top: 10px;
  color: #d1d1d1;
  font-weight: 700;
  font-size: 16px;
}

/* 비밀번호 유효성 표시 스타일 */
.password-valid {
  display: block;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #178ca4;
}

.password-invalid {
  display: block;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #dd4848;
}

/* 비밀번호 일치 */
.password-match {
  display: block;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #178ca4;
}

/* 비밀번호 불일치 */
.password-mismatch {
  display: block;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #dd4848;
}

/* 버튼 위치 정렬을 위한 컨테이너 */
.btn-container {
  text-align: center;
  margin-top: 80px;
  margin-bottom: 50px;
}

/* 가입하기 버튼 */
.submit-btn {
  width: 40%;
  height: 50px;
  padding: 10px;
  border: none;
  background-color: #18b7be;
  color: white;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
}
</style>
