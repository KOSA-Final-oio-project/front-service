<template>
    <div class="modals" v-if="isActive">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h2>신고하기</h2>
            <div class="category-container">
                <label for="category" class="category-label">카테고리:</label>
                <select v-model="selectedCategory" id="category" class="category-select">
                    <option value="욕설">욕설</option>
                    <option value="스팸">스팸</option>
                    <option value="inappropriate_content">부적절한 콘텐츠</option>
                    <!-- Add more categories as needed -->
                </select>
            </div>
            <textarea
                v-model="reportText"
                rows="4"
                placeholder="사용자를 신고하는 내용을 작성해주세요"
            ></textarea>
            <input type="file" multiple @change="handleImageUpload" />
            <button @click="submitReport" style="margin-top: 10px">제출</button>
        </div>
    </div>
    <div class="side-bar">
        <div class="profile">
            <img class="profile-image" :src="userProfile" />
            <div class="profile-info">
                <p class="nickname">
                    {{ nickname }} <img src="../../../assets/siren.png" @click="openModal" />
                </p>
                <p class="heart-count"><i class="bi bi-heart-fill"></i> {{ heart }}</p>
            </div>
        </div>

        <nav class="menu-nav">
            <router-link :to="{
                path: '/userinfo/needrent',
                query: {
                    owner: product.owner,
                    borrower: product.borrower,
                    writer: review.writer,
                    receiver: review.receiver
                }
            }">
                <p>빌려드려요</p>
            </router-link>
            <router-link :to="{
                path: '/userinfo/needborr',
                query: {
                    owner: product.owner,
                    borrower: product.borrower,
                    writer: review.writer,
                    receiver: review.receiver
                }
            }">
                <p>빌려주세요</p>
            </router-link>
            <router-link :to="{
                path: '/userinfo/rent',
                query: {
                    owner: product.owner,
                    borrower: product.borrower,
                    writer: review.writer,
                    receiver: review.receiver
                }
            }">
                <p>대여해준 목록</p>
            </router-link>
            <router-link :to="{
                path: '/userinfo/borrow',
                query: {
                    owner: product.owner,
                    borrower: product.borrower,
                    writer: review.writer,
                    receiver: review.receiver
                }
            }">
                <p>대여한 목록</p>
            </router-link>
            <router-link :to="{
                path: '/userinfo/receive',
                query: {
                    owner: product.owner,
                    borrower: product.borrower,
                    writer: review.writer,
                    receiver: review.receiver
                }
            }">
                <p>받은 후기</p>
            </router-link>
        </nav>
    </div>
    <div class="section">
        <router-view></router-view>
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
            product: '',
            userProfile: '',
            isActive: false,
            reportText: '',
            selectedFiles: []
        }
    },

    methods: {

        getUserInfo() {
            const nickname = localStorage.getItem('user')

            const url = `http://192.168.1.37:9999/oio/member/${nickname}`
            
            axios.get(url).then((result) => {
                this.userProfile = result.data.result.profile
            })
        },
        submitReport() {
            const reporterNickname = localStorage.getItem('nickname')
            const reportedNickname = localStorage.getItem('user')
            const formData = new FormData()

            for (let i = 0; i <= this.selectedFiles.length; i++) {
                formData.append(`photos`, this.selectedFiles[i])
            }
            // formData.append('photos', this.selectedFiles)
            formData.append('category', '욕설')
            formData.append('reporterNickname', reporterNickname)
            formData.append('reportedNickname', reportedNickname)

            axios
                .post(`http://192.168.1.37:9999/oio/member/${reportedNickname}/report`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(alert('신고가 접수되었습니다.'))

            this.isActive = false
        },
        handleImageUpload(event) {
            const file = event.target.files
            this.selectedFiles = file
        },
        openModal() {
            this.isActive = true
        },
        closeModal() {
            this.isActive = false
        },
        getHeart() {
            const nickname = localStorage.getItem('user')

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

        receiveData() {
            const productData = this.$route.query
            const reviewData = this.$route.query
            this.review = reviewData
            this.product = productData

            let nickname = '';

            if (localStorage.getItem('nickname') === this.review.writer) {
                nickname = this.review.receiver;
            } else {
                nickname = this.review.writer;
            }
            localStorage.setItem('user', nickname);

            this.nickname = nickname
        },

        declareUser() { }
    },

    mounted() {
        this.receiveData()
        this.getUserInfo()
        this.getHeart()
    }
}
</script>

<style scoped>
.modal-content {
    /* Add your existing modal styles here */
}

.category-container {
    margin-bottom: 15px;
}

.category-label {
    font-size: 16px;
    margin-right: 10px;
    color: #333;
}

.category-select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
}

.modals {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 150px;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: 10% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 60%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    position: relative;
}

.close {
    margin-bottom: 10px;
    color: #aaa;
    float: right;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
}

h2 {
    color: #333;
    font-size: 24px;
    margin-bottom: 10px;
}

textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical; /* 수직 리사이징 허용 */
}

button {
    background-color: #18b7be;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #15585f;
}
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

.profile-info img {
    width: 20px;
    margin-left: 10px;
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
