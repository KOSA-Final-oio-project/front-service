<template>
    <h2>회원가입</h2>
    <!-- 회원가입 폼 컨테이너 -->
    <div class="form-container">
        <!-- 서버단에 전송할 데이터 작성 구역 (폼) -->
        <form @submit.prevent="submitForm">
            <div class="form-container">
                <div class="form-group">
                    <label for="profile-image">프로필 이미지</label>
                    <div class="flex-container">
                        <input
                            type="file"
                            id="profile-image"
                            @change="handleImageUpload"
                            accept="image/*"
                        />
                        <!-- 프로필 이미지 미리보기 -->
                        <div v-if="user.profileImage" class="profile-preview">
                            <img :src="testFile" alt="프로필 이미지" />
                            <!-- <img
                                src="https://oio-bucket.s3.ap-northeast-2.amazonaws.com/logo.png"
                                alt=""
                            /> -->
                        </div>
                    </div>
                </div>

                <!-- 이메일 -->
                <div class="form-group">
                    <label for="email">이메일</label>
                    <!-- 인풋창이랑 버튼 수평정렬 -->
                    <div class="flex-container">
                        <input type="email" id="email" v-model="user.email" required />

                        <!-- 중복확인 -> 인증요청 -->
                        <button
                            :class="{ 'dup-chk-btn': true, isActive: !isActive }"
                            @click="emailDuplicateCheck"
                        >
                            중복확인
                        </button>
                        <div
                            class="button"
                            :class="{ 'certificate-btn': true, isActive: isActive }"
                            @click="requestEmailCertificate"
                        >
                            인증요청
                        </div>
                        <!-- <button class="certificate-btn" @click="requestEmailCertificate">
                            인증요청
                        </button> -->
                    </div>
                </div>

                <!-- 이메일 인증번호 입력 -->
                <div :class="{ 'form-group': true, isActive: isActive }">
                    <label for="email-certificate">인증번호</label>
                    <div class="flex-container">
                        <input
                            required
                            v-model="user.emailCheckNumber"
                            type="email-certificate"
                            id="email-certificate"
                        />
                        <div
                            :class="{
                                'confirm-btn': true,
                                button: true,
                                showActive: showActive
                            }"
                            @click="confirmEmailCertificate"
                        >
                            확인
                        </div>
                    </div>
                </div>

                <!-- 비밀번호 -->
                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <div class="flex-container">
                        <input type="password" id="password" v-model="user.password" required />
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
                        <div
                            :class="{ 'confirm-btn': true, button: true }"
                            @click="confirmPassword"
                            :style="{
                                backgroundColor: isConfirmButtonActive ? '#18b7be' : '#D1D1D1'
                            }"
                        >
                            확인
                        </div>
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
                        <input required type="nickname" id="nickname" v-model="user.nickname" />
                        <div
                            :class="{
                                'dup-chk-btn': true,
                                nicknameActive: nicknameActive,
                                button: true
                            }"
                            @click="nicknameDuplicateCheck"
                        >
                            중복확인
                        </div>
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
                        <div
                            :class="{ 'certificate-btn': true, button: true }"
                            @click="requestPhoneCertificate"
                        >
                            인증요청
                        </div>
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
                    <button type="submit" class="submit-btn">가입하기</button>
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
                name: undefined,
                email: undefined,
                password: undefined,
                nickname: undefined,
                phone: undefined,
                emailCheckNumber: undefined,
                profileImage: undefined
            },

            testFile: '',
            nicknameActive: false,
            showActive: false,
            isActive: true,
            emailCheckNumber: '',
            emailChkMessage: '',
            passwordCheckMessage: '',
            emailStatus: 0,
            showModal: false,
            alertMessage: '',
            location: ''
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
        isEmpty(value) {
            // 빈 값인 경우 true 반환
            return value === undefined || value === null || value.trim() === ''
        },
        handleImageUpload(event) {
            const file = event.target.files[0]
            this.user.profileImage = file
            console.log(this.user.profileImage)
            if (file) {
                const reader = new FileReader()
                reader.onload = () => {
                    this.testFile = reader.result
                }
                reader.readAsDataURL(file)

                console.log(this.user.profileImage)
            }
        },

        // 이메일 중복확인
        emailDuplicateCheck() {
            console.log('ddd')
            axios
                .post('http://localhost:9999/oio/email-chk', {
                    email: this.user.email
                })
                .then((result) => {
                    if (result.data == '사용가능한 이메일입니다.') {
                        this.emailStatus = 1
                        this.isActive = false
                        alert('사용가능한 이메일입니다.')
                    } else {
                        alert('이미 사용중인 이메일입니다.')
                        this.user.email = ''
                    }
                    this.emailChkMessage = result
                })
        },

        // 이메일 인증요청
        requestEmailCertificate() {
            alert('이메일로 인증번호가 발송되었습니다.')
            axios
                .post('http://localhost:9999/oio/send-email', {
                    email: this.user.email
                })
                .then((result) => {
                    console.log(result.data.code)
                    this.emailCheckNumber = result.data.code
                })
        },

        // 이메일 인증번호 확인
        confirmEmailCertificate() {
            if (this.user.emailCheckNumber == this.emailCheckNumber) {
                alert('일치합니다')
                this.showActive = true
            } else {
                alert('일치하지않습니다')
            }
        },

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
        nicknameDuplicateCheck() {
            axios
                .post('http://localhost:9999/oio/nickname-chk', {
                    nickname: this.user.nickname
                })
                .then((result) => {
                    if (result.data == '이미 사용중인 닉네임입니다.') {
                        alert('이미 사용중인 닉네임입니다.')
                        this.user.nickname = ''
                    } else {
                        alert('사용가능한 닉네임입니다.')
                    }
                })
        },

        // 핸드폰 인증요청
        requestPhoneCertificate() {},

        // 핸드폰 인증번호 확인
        confirmPhoneCertificate() {},

        // 가입하기
        submitForm() {
            // FormData에 이미지 데이터 및 다른 필드들 추가
            console.log(this.user.profileImage)
            const formData = new FormData()
            formData.append('file', this.user.profileImage)
            formData.append('email', this.user.email)
            formData.append('password', this.user.password)
            formData.append('nickname', this.user.nickname)

            // 서버로 데이터 전송
            axios
                .post('http://192.168.1.37:9999/oio/signup', formData, {
                    contentType: false,
                    processData: false
                })
                .then((response) => {
                    console.log(response.data)
                    window.location = '/'
                })
                .catch((error) => {
                    console.error('요청 실패:', error)
                    // 실패 시 추가로 실행할 로직 작성
                })
        }
    }
}
</script>

<style scoped>
.button {
    margin-left: 3%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.error-message {
    color: red;
    font-size: 12px;
}
.profile-preview {
    margin-left: 30px;
}
.profile-preview > img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.showActive {
    display: none;
}
.isActive {
    display: none;
}
.btn {
    width: 100%;
    margin-left: 0;
    border-radius: 0;
    border: none;
    background-color: #178ca4;
}
.modal {
    display: none;
    text-align: center;
}

.modal.show {
    margin-top: 12%;
    display: block;
}
/* 제목 타이틀 */
h2 {
    margin-top: 200px;
    text-align: center;
    margin-bottom: 50px;
}
.form-container {
    /* 폼 컨테이너 너비 조절용 */
    max-width: 80%;
    margin-left: 21%;
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
