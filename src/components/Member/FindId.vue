<template>
  <h2>아이디 찾기</h2>
  <!-- 회원가입 폼 컨테이너 -->
  <div class="form-container">
    <!-- 서버단에 전송할 데이터 작성 구역 (폼) -->
    <form @submit.prevent="submitForm">
      <div class="form-container">
        <!-- 비밀번호 일치 & 불일치 메시지 표시 -->

        <!-- 닉네임 -->
        <div class="form-group">
          <label for="nickname">전화번호</label>
          <div class="flex-container">
            <input
              v-model="phone"
              type="nickname"
              id="nickname"
              placeholder="가입 시 등록하신 번호로 아이디를 발송해드립니다."
            />
          </div>
        </div>

        <div class="btn-container">
          <button type="submit" class="submit-btn" @click="findId">아이디 찾기</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      phone: ''
    }
  },
  methods: {
    findId() {
      console.log(this.phone)
      axios
        .post(`http://localhost:9999/oio/find-email`, {
          phoneNumber: this.phone
        })
        .then((result) => {
          alert('해당 전화번호로 이메일이 발송되었습니다.')
          console.log(result)
        })
        .catch(() => {
          alert('없는 전화번호입니다.')
        })
    }
  }
}
</script>
<style scoped>
.findPassword {
  text-decoration: none;
}

.btn-container {
  margin-right: 20%;
}

/* 제목 타이틀 */
h2 {
  margin-top: 300px;
  text-align: center;
  margin-bottom: 50px;
}

.form-container {
  margin-left: 22%;
  /* 폼 컨테이너 너비 조절용 */
  max-width: 80%;
  margin-bottom: 225px;
}

/* 각 입력창 영역 공통 스타일 */
.form-group {
  align-items: center;
  justify-content: space-between;
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
  margin-bottom: 0;
  /* 수평 정렬을 위해 하단 마진 제거 */
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
