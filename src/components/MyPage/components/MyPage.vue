<template>
    <div class="side-bar">
        <div class="profile">
            <img class="profile-image" src="../../../../assets/8.jpg" />
        </div>
        <p class="nickname">{{ nickname }}</p>
        <p class="heart-count"><i class="bi bi-heart-fill"></i> {{ heart }}</p>
        <nav class="menu-nav">
            <p>정보 수정</p>
            <router-link to="/mypage/needrent">
                <p>빌려드려요</p>
            </router-link>
            <router-link to="/mypage/needborr">
                <p>빌려주세요</p>
            </router-link>
            <router-link to="/mypage/rent">
                <p>대여해준 목록</p>
            </router-link>
            <router-link to="/mypage/borrow">
                <p>대여한 목록</p>
            </router-link>
            <router-link to="/mypage/receive">
                <p>받은 후기</p>
            </router-link>
            <router-link to="/mypage/write">
                <p>남긴 후기</p>
            </router-link>
            <router-link to="/mypage/qna">
                <p>Q&A 목록</p>
            </router-link>
            <p>회원 탈퇴</p>
        </nav>
    </div>
    <div class="section">
        <transition name="fade" mode="out-in">
            <router-view />
        </transition>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'MyPage',

    data() {
        return {
            nickname: '',
            heart: 0
        }
    },

    methods: {
        getHeart() {
            const nickname = localStorage.getItem('nickname')
            const url = `http://192.168.1.86:7575/review/heart?nickname=${nickname}`

            axios
                .get(url)
                .then((response) => {
                    console.log(response.data)
                    this.heart = response.data.msg
                })
                .catch((error) => {
                    console.log(error.data)
                })
        }
    },

    mounted() {
        this.getHeart()
        this.nickname = localStorage.getItem('nickname')
    }
}
</script>

<style scoped>
.side-bar {
    margin-top: 150px;
    background-color: #18b7be;
    width: 15%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-top: 20px;
    /* border-right: 2px solid #ffffff; */
}

.profile {
    border-radius: 50%;
    border: 3px solid #ffffff;
    overflow: hidden;
    width: 100px;
    height: 100px;
    margin-top: 0px;
}

.profile-image {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.nickname {
    margin-top: 10px;
    color: #333333;
    font-weight: bold;
    font-size: 18px;
}

.heart-count {
    color: #333333;
    font-weight: bold;
    font-size: 16px;
}

.menu-nav {
    margin-top: 20px;
}

.menu-nav p {
    margin-bottom: 25px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
}

.menu-nav p:hover {
    font-weight: bold;
}

a {
    text-decoration: none;
    color: inherit;
}

.menu-nav p:hover {
    color: #ffffff;
}

.bi-heart-fill {
    color: red;
}

.section {
    margin-top: 150px;
    width: 85%;
    height: 100%;
    /* border-radius: 30px; */
    border: 3px solid #18b7be;
    /* flex-grow: 1; */
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
