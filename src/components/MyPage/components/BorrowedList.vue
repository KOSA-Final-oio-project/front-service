<template>
    <div class="borrowed-list-outer-container">
        <div class="borrowed-list-container">
            <ul class="borrowed-list-ul">
                <li v-for="item in list" :key="item.id" class="borrowed-item">
                    <div class="left">
                        <img class="product-img" src="../../../assets/oio.png">
                    </div>
                    <div class="right">
                        <p><img src="../../../assets/package.png"> {{ truncateText(getProductTitle(item.productNo), 3) }}<br>
                        </p>
                        <p><img src="../../../assets/user-profile.png"> {{ item.ownerNickname }}<br></p>
                        <p><img src="../../../assets/calendar.png"> {{ item.rentStartDate }} ~ {{ item.rentEndDate }}<br></p>
                        <img src="../../../assets/status.png"> {{ item.status }}
                        <span>
                            <button v-if="showReviewButton(item.reviewStatus, item.status)" @click="openModal(item)"
                                class="review-button">리뷰 작성</button>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
        <transition name="overlay-fade">
            <div v-if="showModal || showConfirmationModal" class="modal-overlay" @click="closeModal"></div>
        </transition>
        <transition name="modal-fade" mode="out-in">
            <WriteReview v-if="showModal" @close="closeModal" @reviewSubmitted="refreshData" :ReviewList="ReviewList"
                class="modal-wrapper" />
        </transition>
    </div>
</template>

<script>
import axios from 'axios'
import WriteReview from './WriteReview.vue';
export default {
    components: {
        WriteReview
    },
    name: 'BorrowedList',
    data() {
        return {
            list: [],
            data: [],
            showModal: false,
            ReviewList: null,
        }
    },
    methods: {
        getBorrowedList() {
            const nickname = localStorage.getItem('nickname');
            const url = `http://192.168.1.86:7575/rent/1?nickname=${nickname}`;
            axios.get(url)
                .then(response => {
                    const list = response.data;
                    this.list = list;

                    const ownerNickname = [...new Set(list.map(item => item.ownerNickname))];

                    const requests = ownerNickname.map(owner => {
                        const url2 = `http://192.168.1.86:8889/product/myProduct/${owner}/0`;
                        return axios.get(url2);
                    });

                    this.loadingProducts = true;

                    Promise.all(requests)
                        .then(responses => {
                            this.loadingProducts = false;

                            responses.forEach(response => {
                                const data = response.data;
                                this.data = this.data.concat(data);
                                console.log(data)
                            });
                        })
                        .catch(error => {
                            this.loadingProducts = false;
                            console.error('error: ', error.response.data);
                        });
                })
                .catch(error => {
                    console.error('error : ', error.response.data);
                });
        },

        getProductTitle(productNo) {
            const matchingProduct = this.data.find(item => item.productNo === productNo);
            return matchingProduct ? matchingProduct.title : '상품명을 찾을 수 없습니다.';
        },

        openModal(item) {
            this.ReviewList = item;
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
        },

        showReviewButton(reviewStatus, status) {
            return reviewStatus !== "대여받은사람" && reviewStatus !== "모두" && status !== "대여중";
        },

        refreshData() {
            this.getBorrowedList();
        },

        truncateText(text, maxLength) {
            if (text.length > maxLength) {
                return text.slice(0, maxLength) + '...';
            } else {
                return text;
            }
        },

    },
    mounted() {
        this.getBorrowedList();
    }
};
</script>

<style>
.borrowed-list-outer-container {
    width: 100%;
    overflow-y: auto;
    max-height: 100%;
}

.borrowed-list-container {
    width: calc(100% - 20px);
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
}

.product-img {
    margin-top: 30px;
    width: 90px;
}

.borrowed-item {
    display: flex;
    justify-content: space-between;
    width: 30%;
    margin-top: 20px;
    margin-left: 30px;
    list-style: none;
    border: 2px solid #18B7BE;
    border-radius: 5px;
    padding: 10px;
}

.left {
    width: 110px;
    text-align: center;
    margin-bottom: 10px;
}

.right {
    position: relative;
    margin: auto;
    margin-left: 20px;
    flex-grow: 1;
}

.right img {
    width: 20px;
}

.borrowed-item p {
    /* margin-top: 10px; */
    /* height: 15px; */
}


.borrowed-list-ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.review-button {
    border: 2px solid #19cad3;
    border-radius: 30px;
    background-color: #19cad3;
    color: #ffffff;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    float: right;
}

.review-button:hover {
    background-color: #FFFFFF;
    color: #19cad3;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
    opacity: 0;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: opacity 0.3s ease;
}

.overlay-fade-enter,
.overlay-fade-leave-to {
    opacity: 0;
}
</style>
