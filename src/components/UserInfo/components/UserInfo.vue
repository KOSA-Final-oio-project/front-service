<template>
    <div class="side-bar">
        <div class="profile">
            <img class="profile-image" src="../../../../assets/8.jpg" />
            <div class="profile-info">
                <p class="nickname">{{ nickname }}</p>
                <p class="heart-count"><i class="bi bi-heart-fill"></i> {{ heart }}</p>
            </div>
        </div>
        <nav class="menu-nav">
            <router-link to="/userinfo/needrent">
                <p>빌려드려요</p>
            </router-link>
            <router-link to="/userinfo/needborr">
                <p>빌려주세요</p>
            </router-link>
            <router-link to="/userinfo/rent">
                <p>대여해준 목록</p>
            </router-link>
            <router-link to="/userinfo/borrow">
                <p>대여한 목록</p>
            </router-link>
            <router-link to="/userinfo/receive">
                <p>받은 후기</p>
            </router-link>
            <p>회원 신고</p>
        </nav>
    </div>
    <div class="section">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'UserInfo',
    data() {
        return {
            nickname: '',
            heart: 0,
            review: '',
            product: ''
        }
    },

    methods: {
        getHeart() {
            let nickname = localStorage.getItem('user')
           
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
        },

    },

    mounted() {
        const productDataString = this.$route.query.productData;
        const productData = JSON.parse(productDataString);
        const reviewDataString = this.$route.query.reviewData;
        const reviewData = JSON.parse(reviewDataString);
        this.review = reviewData
        this.product = productData

        let nickname = ''

        if (localStorage.getItem('nickname') === this.review.writerNickname) {
            nickname = this.review.receiverNickname;
        } else {
            nickname = this.review.writerNickname;
        }

        this.nickname = nickname;

        localStorage.setItem("user", nickname)

        console.log(this.review)
        console.log(productData)
        console.log(reviewData)
        this.getHeart();
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
}

.profile {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.profile-image {
    border-radius: 50%;
    border: 2px solid #ffffff;
    overflow: hidden;
    object-fit: cover;
    width: 100px;
    height: 100px;
}

.profile-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 20px;

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
    margin-top: 5px;
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
    border: 3px solid #18b7be;
    flex: 1;
    /* 남은 공간을 모두 차지하도록 설정 */
    overflow-y: auto;
    /* 섹션 내부에 스크롤 생성 */
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
