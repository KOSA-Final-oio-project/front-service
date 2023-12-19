<template>
    <!-- 회원가입 폼 컨테이너 -->
    <div class="form-container">
        <!-- 서버단에 전송할 데이터 작성 구역 (폼) -->
        <form @submit.prevent="submitForm">
            <div class="form-container">
                <div class="form-group">
                    <div class="flex-container">
                        <label for="profile-image">프로필</label>
                        <input type="file" id="profile-image" @change="handleImageUpload" accept="image/*" />
                        <!-- 프로필 이미지 미리보기 -->
                        <div v-if="user.profileImage2" class="profile-preview">
                            <img :src="user.profileImage2" alt="프로필 이미지" />
                        </div>
                    </div>
                </div>

                <!-- 이메일 -->
                <div class="form-group" v-if="userData.result">
                    <div class="flex-container">
                        <label for="email">이메일</label>
                        <p>{{ userData.result.email }}</p>
                    </div>
                </div>

                <!-- 닉네임 -->
                <div class="form-group" v-if="userData.result">
                    <div class="flex-container">
                        <label for="nickname">닉네임</label>
                        <p>{{ userData.result.nickname }}</p>
                    </div>
                </div>

                <!-- 비밀번호 -->
                <div class="form-group">

                    <div class="flex-container">
                        <label for="password">비밀번호</label>
                        <input type="password" id="password" v-model="user.password" />
                    </div>
                    <span class="info" :class="{
                        'password-valid': isPasswordValid,
                        'password-invalid': !isPasswordValid
                    }">
                        🙋🏻‍♀️ 영문/숫자/특수문자(!,@,#,$,%) 2개 이상 포함 / 8~16자
                    </span>
                </div>

                <!-- 비밀번호 확인 -->
                <div class="form-group">
                    <div class="flex-container">
                        <label for="nickname">비밀번호 확인</label>
                        <input type="password" id="check-password" v-model="user.checkPassword" @input="confirmPassword" />
                    </div>
                    <!-- 비밀번호 일치 & 불일치 메시지 표시 -->
                    <span v-if="passwordCheckMessage" :class="passwordCheckClass">{{ passwordCheckMessage }}</span>
                </div>

                <!-- 가입하기 버튼 -->
                <div class="btn-container">
                    <button type="submit" class="submit-btn" @click="submitForm">변경</button>
                    <button class="delete-btn" @click="showModal = true">회원 탈퇴</button>
                </div>
            </div>
        </form>
    </div>
    
    <div class="modal" :class="{ 'show': showModal }">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">회원 탈퇴</h5>
                    <button type="button" class="close" @click="showModal = false">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>정말 탈퇴하시겠습니까?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="confirm-button" @click="confirmDelete">예</button>
                    <button type="button" class="cancel-button" @click="cancelDelete">아니오</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            user: {
                password: '',
                nickname: '',
                profileImage: '',
                profileImage2: ''
            },
            showActive: false,
            isActive: true,
            passwordCheckMessage: '',
            emailStatus: 0, // 비밀번호 일치&불일치 여부 결과값 메시지
            showModal: false,
            alertMessage: '',
            userData: '',
            showModal: false
        }
    },

    watch: {
        // 사용자가 입력한 값과 비밀번호 일치 여부 실시간 확인
        'user.checkPassword': function (newVal) {
            this.confirmPassword();
        }
    },

    computed: {
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
        'user.password': function () {
            this.checkPasswordValidity()
        }
    },

    methods: {
        handleImageUpload(event) {
            const file = event.target.files[0]
            this.user.profileImage = file
            if (file) {
                const reader = new FileReader()
                reader.onload = () => {
                    this.user.profileImage2 = reader.result
                }
                reader.readAsDataURL(file)
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
                this.passwordCheckMessage = '🙆🏻‍♀️ 비밀번호가 일치합니다.';
            } else {
                this.passwordCheckMessage = '🙅🏻‍♀️ 비밀번호가 일치하지 않습니다.';
            }
        },

        // 수정하기
        submitForm() {
            // FormData에 이미지 데이터 및 다른 필드들 추가
            console.log(this.user.profileImage)
            const formData = new FormData()
            formData.append('file', this.user.profileImage)
            formData.append('password', this.user.password)


            const nickname = localStorage.getItem('nickname')
            // 서버로 데이터 전송
            axios
                .put(`http://192.168.1.37:9999/oio/member/${nickname}`, formData, {
                    contentType: false,
                    processData: false
                })
                .then((response) => {
                    console.log(response.data)
                })
                .catch((error) => {
                    console.error('요청 실패:', error)
                    // 실패 시 추가로 실행할 로직 작성
                })
        },

        getUserInfo() {
            const nickname = localStorage.getItem("nickname")
            const url = `http://192.168.1.37:9999/oio/member/${nickname}`

            axios.get(url)
                .then((response) => {
                    this.userData = response.data
                    console.log(this.userData)
                    this.profileImage = this.userData.result.profile
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        cancelDelete() {
            this.showModal = false;
        },

        confirmDelete() {

            this.showModal = false;
        }

    },
    mounted() {
        this.getUserInfo()
    },
}
</script>

<style scoped>
.profile-preview {
    margin-left: 30px;
    border-radius: 50%;
    border: 2px solid #18b7be;
}

.profile-preview>img {
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

.form-container {
    /* 폼 컨테이너 너비 조절용 */
    max-width: 80%;
    margin-top: 3%;
    margin-left: 18%;
}

/* 각 입력창 영역 공통 스타일 */
.form-group {
    align-items: center;
    justify-content: space-between;
    /* margin-top: 50px; */
    /* margin-bottom: 20px; */
}

/* 폼들 위치 정렬을 위한 컨테이너 */
.form-container {
    width: 65%;
}

.form-container p {
    margin-top: 20px;
}

/* 인풋창이랑 버튼 수평정렬 하기 위해서 */
.flex-container {
    align-items: flex-start;
    display: flex;
    margin-top: 15px;
}

.flex-container p {
    margin-left: 10px;
}

/* 인풋창 왼쪽 텍스트들 (ex. 이메일 인증번호 등) */
form label {
    font-size: 18px;
    font-weight: bold;
    display: flex;
    flex-basis: 20%;
    text-align: left;
    margin-top: 15px;
    margin-bottom: 0;
    /* 수평 정렬을 위해 하단 마진 제거 */
}

/* 입력창들 스타일 */
input {
    width: 50%;
    padding: 10px;
    margin-left: 10px;
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
    /* margin-left: 20px; */
    /* font-weight: bold; */
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
    width: 70px;
    height: 40px;
    margin-left: 20px;
    border: 2px solid #18b7be;
    background-color: #18b7be;
    color: white;
    border-radius: 30px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
}

.confirm-btn:hover {
    background-color: #ffffff;
    color: #18b7be;
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
    /* position: relative; */
    text-align: center;
    margin-top: 50px;
    /* margin-bottom: 50px; */
}

/* 가입하기 버튼 */
.submit-btn {
    width: 70px;
    height: 40px;
    margin-right: 40px;
    border: 2px solid #18b7be;
    background-color: #18b7be;
    color: white;
    border-radius: 30px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
}

.submit-btn:hover {
    background-color: #ffffff;
    color: #18b7be;
}

.delete-btn {
    width: 100px;
    height: 40px;
    margin-right: 20px;
    float: right;
    border: 2px solid #dd4848;
    background-color: #dd4848;
    color: white;
    border-radius: 30px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
}

.delete-btn:hover {
    background-color: #ffffff;
    color: #dd4848;
}

/* 모달 */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050;
    width: 100%;
    height: 100%;
    overflow: auto;
}

.modal.show {
    display: block;
}

.modal-dialog {
    margin: 5% auto;
    width: 80%;
    max-width: 600px;
}

.modal-content {
    color: #000000;
    text-align: center;
    /* font-size: 18px; */
    font-weight: bold
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    margin: 0;
}

.modal-body {
    margin-bottom: 20px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
}

.close {
    background: none;
    border: none;
    padding: 0;
    font-size: 1.5rem;
    cursor: pointer;
}

.confirm-button {
    width: 70px;
    height: 40px;
    border: 2px solid #18b7be;
    background-color: #18b7be;
    color: white;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold
}

.confirm-button:hover {
    background-color: #ffffff;
    color: #18b7be;
}


.cancel-button {
    width: 70px;
    height: 40px;
    border: 2px solid #d9d9d9;
    background-color: #d9d9d9;
    color: white;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold
}

.cancel-button:hover {
    background-color: #ffffff;
    color: #d9d9d9;
}
</style>
