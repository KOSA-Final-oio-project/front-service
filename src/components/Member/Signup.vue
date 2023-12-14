<template>
    <h2>회원가입</h2>
    <!-- 회원가입 폼 컨테이너 -->
    <div class="form-container">
        <!-- 서버단에 전송할 데이터 작성 구역 (폼) -->
        <form @submit.prevent="submitForm">
            <div class="form-container">
                <!-- 이메일 -->
                <div class="form-group">
                    <label for="email">이메일</label>
                    <!-- 인풋창이랑 버튼 수평정렬 -->
                    <div class="flex-container">
                        <input type="email" id="email" v-model="user.email" />

                        <!-- 중복확인 -> 인증요청 -->
                        <button class="dup-chk-btn" @click="emailDuplicateCheck">중복확인</button>
                        <!-- <button class="certificate-btn" @click="requestEmailCertificate">
                            인증요청
                        </button> -->
                    </div>
                </div>

                <!-- 이메일 인증번호 입력 -->
                <div class="form-group">
                    <label for="email-certificate">인증번호</label>
                    <div class="flex-container">
                        <input type="email-certificate" id="email-certificate" />
                        <button class="confirm-btn" @click="confirmEmailCertificate">확인</button>
                    </div>
                </div>

                <!-- 비밀번호 -->
                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <div class="flex-container">
                        <input type="password" id="password" v-model="user.password" />
                    </div>

                    <span
                        class="info"
                        :class="{
                            'password-valid': isPasswordValid,
                            'password-invalid': !isPasswordValid
                        }"
                    >
                        🙋🏻‍♀️ 영문/숫자/특수문자(!,@,#,$,%) 2개 이상 포함 / 8~16자
                    </span>
                </div>

                <!-- 비밀번호 확인 -->
                <div class="form-group">
                    <label for="nickname">비밀번호 확인</label>
                    <div class="flex-container">
                        <input type="password" id="check-password" v-model="user.checkPassword" />
                        <!-- 이거 확인 버튼 active 상태 안되게 아예 막아야댐!!!!!!!!!!!! 색깔만 바뀐거임 지금  -->
                        <button
                            class="confirm-btn"
                            @click="confirmPassword"
                            :style="{
                                backgroundColor: isConfirmButtonActive ? '#18b7be' : '#D1D1D1'
                            }"
                        >
                            확인
                        </button>
                    </div>
                    <!-- 비밀번호 일치 & 불일치 메시지 표시 -->
                    <span v-if="passwordCheckMessage" :class="passwordCheckClass">{{
                        passwordCheckMessage
                    }}</span>
                </div>

                <!-- 닉네임 -->
                <div class="form-group">
                    <label for="nickname">닉네임</label>
                    <div class="flex-container">
                        <input type="nickname" id="nickname" v-model="user.nickname" />
                        <button class="dup-chk-btn" @click="nicknameDuplicateCheck">
                            중복확인
                        </button>
                    </div>
                </div>

                <!-- 핸드폰 -->
                <div class="form-group">
                    <label for="phone">핸드폰 번호</label>
                    <div class="flex-container">
                        <input
                            type="tel"
                            id="phone"
                            v-model="user.phone"
                            placeholder="010-0000-0000"
                        />
                        <button class="certificate-btn" @click="requestPhoneCertificate">
                            인증요청
                        </button>
                    </div>
                </div>

                <!-- 핸드폰 인증번호 입력 -->
                <div class="form-group">
                    <label for="phone-certificate">인증번호</label>
                    <div class="flex-container">
                        <input type="phone-certificate" id="phone-certificate" />
                        <button class="confirm-btn" @click="confirmPhoneCertificate">확인</button>
                    </div>
                </div>

                <!-- 가입하기 버튼 -->
                <div class="btn-container">
                    <button type="submit" class="submit-btn" @click="submitForm">가입하기</button>
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
            user: {
                name: '',
                email: '',
                password: '',
                nickname: '',
                phone: ''
            },
            passwordCheckMessage: '' // 비밀번호 일치&불일치 여부 결과값 메시지
        }
    },

    computed: {
        // 비밀번호 확인 버튼 활성화
        isConfirmButtonActive() {
            return this.user.password && this.user.checkPassword
        },

        // 비밀번호 일치 여부에 따라 클래스명을 동적으로 결정해줌!! (텍스트 문구 변경 및 색깔 변경)
        passwordCheckClass() {
            if (this.passwordCheckMessage === '🙆🏻‍♀️ 비밀번호가 일치합니다.') {
                return 'password-match'
            } else if (this.passwordCheckMessage === '🙅🏻‍♀️ 비밀번호가 일치하지 않습니다.') {
                return 'password-mismatch'
            }
            return ''
        }
    },

    watch: {
        // 비밀번호가 변경될 때마다 유효성 검사 해줘야 해서 watch 줌
        'user.password': function () {
            this.checkPasswordValidity()
        }
    },

    methods: {
        // 이메일 중복확인
        emailDuplicateCheck() {
            // axios
            //     .post(this.$backURL + '/member-service/~' + )
            //     .then((response) => {성공로직})
            //     .catch((error) => {실패로직})
        },

        // 이메일 인증요청
        requestEmailCertificate() {},

        // 이메일 인증번호 확인
        confirmEmailCertificate() {},

        // 비밀번호 유효성 검사
        checkPasswordValidity() {
            const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,16}$/
            this.isPasswordValid = regex.test(this.user.password)
        },

        // 비밀번호 중복 확인
        confirmPassword() {
            if (this.user.password === this.user.checkPassword) {
                this.passwordCheckMessage = '🙆🏻‍♀️ 비밀번호가 일치합니다.'
            } else {
                this.passwordCheckMessage = '🙅🏻‍♀️ 비밀번호가 일치하지 않습니다.'
            }
        },

        // 닉네임 중복확인
        nicknameDuplicateCheck() {},

        // 핸드폰 인증요청
        requestPhoneCertificate() {},

        // 핸드폰 인증번호 확인
        confirmPhoneCertificate() {},

        // 가입하기
        submitForm() {}
    }
}
</script>

<style scoped>
/* 제목 타이틀 */
h2 {
    text-align: center;
    margin-top: 50px;
    margin-bottom: 50px;
}
.form-container {
    /* 폼 컨테이너 너비 조절용 */
    max-width: 80%;
    margin: auto;
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
