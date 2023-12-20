<template>
    <div class="rent-list-outer-container">
        <div class="rent-list-container">
            <ul class="rented-list-ul">
                <li v-for="item in list" :key="item.id" class="rented-item" @click="openProductDetailModal(item)">
                    <div class="left">
                        <img class="product-img" :src="findThumbnail(item.productNo)" />
                    </div>
                    <div class="right">
                        <p><img src="../../../assets/package.png" /> {{ truncateText(getProductTitle(item.productNo), 10)
                        }}<br /></p>
                        <p><img src="../../../assets/user-profile.png" /> {{ item.borrowerNickname }}<br /></p>
                        <p><img src="../../../assets/calendar.png" /> {{ item.rentStartDate }} ~{{ item.rentEndDate }}<br />
                        </p>
                        <img src="../../../assets/status.png" /> {{ item.status }}
                        <span class="button-container">
                            <button v-if="showReviewButton(item.reviewStatus, item.status)" @click="openModal(item)"
                                class="review-button">
                                리뷰 작성
                            </button>
                            <button v-if="showEndRentButton(item.status)" @click="openConfirmationModal(item)"
                                class="rent-button">
                                대여 완료
                            </button>
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

        <div class="product-detail-modal" v-if="showProductDetailModal">
            <transition name="modal-fade" mode="out-in">
                <ProductDetail :ProductList="ProductList" @close="closeProductDetailModal" class="modal-wrapper" />
            </transition>
            <button @click="closeProductDetailModal" class="close-button">닫기</button>
        </div>

        <transition name="modal-fade" mode="out-in">
            <div v-if="showConfirmationModal" class="modal-wrapper">
                <div class="confirmation-modal">
                    <div class="modal-content">
                        <p>대여를 완료 하시겠습니까?</p>
                        <p class="warnig-text">※완료된 대여는 취소 불가합니다.※</p>
                        <div class="modal-buttons">
                            <button @click="confirmEndRent" class="confirm-button">예</button>
                            <button @click="closeConfirmationModal" class="cancel-button">
                                아니오
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

    </div>
</template>

<script>
import axios from 'axios'
import WriteReview from './WriteReview.vue'
import ProductDetail from '../../Product/ProductDetail.vue'
export default {
    components: {
        WriteReview,
        ProductDetail
    },
    name: 'RentedList',
    data() {
        return {
            list: [],
            data: [],
            showModal: false,
            ReviewList: null,
            ProductList: null,
            showConfirmationModal: false,
            showProductDetailModal: false,
            selectedRentedItem: null,
            product: '',
            review: ''
        }
    },
    methods: {
        async getRentedList() {
            try {
                const nickname = localStorage.getItem('nickname')

                // 데이터를 가져오는 데 필요한 API 호출
                const [rentedListResponse, myProductResponse] = await Promise.all([
                    axios.get(`http://192.168.1.86:7575/rent/0?nickname=${nickname}`),
                    axios.get(`http://192.168.1.86:8889/product/myProduct/${nickname}/0`)
                ])

                const rentedList = rentedListResponse.data
                const myProductData = myProductResponse.data

                this.list = rentedList
                this.data = myProductData

                console.log(this.data)
            } catch (error) {
                console.error('데이터 가져오기 에러: ', error)
            }
        },

        openConfirmationModal(item) {
            this.selectedRentedItem = item
            this.showConfirmationModal = true // 모달 열기
        },

        closeConfirmationModal() {
            this.showConfirmationModal = false // 모달 닫기
            this.selectedRentedItem = null // 선택된 대여 상품 정보 초기화
        },

        async confirmEndRent() {
            if (this.selectedRentedItem) {
                const rentedProductNo = this.selectedRentedItem.rentedProductNo
                const url = `http://192.168.1.86:7575/rent/${rentedProductNo}`

                try {
                    // 모달 창 닫기
                    this.closeConfirmationModal()

                    // API 호출
                    await axios.put(url)

                    // 리스트 다시 불러오기
                    await this.getRentedList()
                } catch (error) {
                    console.log(error)
                }
            }
        },

        getProductTitle(productNo) {
            const matchingProduct = this.data.find((item) => item.productNo === productNo)
            return matchingProduct ? matchingProduct.title : '상품명을 찾을 수 없습니다.'
        },

        openModal(item) {
            this.ReviewList = item
            this.showModal = true
        },

        closeModal() {
            this.showModal = false
        },

        showReviewButton(reviewStatus, status) {
            return reviewStatus !== '대여해준사람' && reviewStatus !== '모두' && status !== '대여중'
        },

        showEndRentButton(status) {
            return status !== '대여완료'
        },

        openProductDetailModal(item) {
            this.ProductList = item; // 선택된 상품 정보를 저장
            this.showProductDetailModal = true; // ProductDetail 모달 표시 상태를 true로 변경
        },

        // ProductDetail 모달 닫기 메서드
        closeProductDetailModal() {
            this.showProductDetailModal = false; // ProductDetail 모달 표시 상태를 false로 변경
            this.$emit('close');
        },

        findThumbnail(productNo) {
            const matchingProduct = this.data.find(item => item.productNo === productNo);
            return matchingProduct ? matchingProduct.thumbnail : ''; // 해당 제품의 thumbnail 반환 또는 빈 문자열 반환
        },

        refreshData() {
            this.getRentedList()
        },

        truncateText(text, maxLength) {
            if (text.length > maxLength) {
                return text.slice(0, maxLength) + '...'
            } else {
                return text
            }
        }
    },

    mounted() {
        this.getRentedList()
    }
}
</script>

<style scoped>
.rent-list-outer-container {
    width: 100%;
    overflow-y: auto;
    max-height: 100%;
}

.rent-list-container {
    width: calc(100% - 20px);
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
}

.product-img {
    width: 90px;
}

.rented-item {
    display: flex;
    justify-content: space-between;
    width: 30%;
    margin-top: 20px;
    margin-left: 30px;
    list-style: none;
    border: 2px solid #18b7be;
    border-radius: 5px;
    padding: 10px;
    transition: all 0.3s ease;
}

.rented-item:hover {
    cursor: pointer;
    background-color: #f0f0f0;
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

.rented-item p {
    /* margin-top: 10px; */
    /* height: 30px; */
}

.rented-list-ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.rent-button {
    border: 2px solid #18b7be;
    border-radius: 30px;
    background-color: #18b7be;
    color: #ffffff;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    float: right;
}

.rent-button:hover {
    background-color: #ffffff;
    color: #18b7be;
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
    background-color: #ffffff;
    color: #19cad3;
}

.confirmation-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f8f8f8;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    width: 400px;
    height: auto;
}

.modal-content {
    color: #000000;
    text-align: center;
    font-size: 18px;
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

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 998;
}

.modal-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    /* 배경 오버레이보다 더 앞에 표시되도록 설정 */
}

.confirm-button {
    border: 2px solid #18b7be;
    border-radius: 13px;
    background-color: #18b7be;
    color: #ffffff;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    font-size: 16px;
}

.confirm-button:hover {
    background-color: #ffffff;
    color: #18b7be;
}

.cancel-button {
    border: 2px solid #d9d9d9;
    border-radius: 30px;
    background-color: #d9d9d9;
    color: #ffffff;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    margin-left: 10px;
    font-size: 16px;
}

.cancel-button:hover {
    background-color: #ffffff;
    color: #d9d9d9;
}

.warnig-text {
    font-size: 12px;
}

.product-detail-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    /* 기존 modal-wrapper(z-index: 999)보다 더 위에 표시될 수 있도록 설정 */
    background-color: #ffffff;
    border: 4px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    width: 80%;
    /* 수정: 모달의 너비 조정 */
    height: 80%;

    overflow-y: auto;
    /* 내용이 모달 밖으로 넘칠 경우 스크롤 표시 */
}

.close-button {
    border: 2px solid #d9d9d9;
    border-radius: 30px;
    background-color: #d9d9d9;
    color: #ffffff;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    margin-left: 10px;
}

.close-button:hover {
    background-color: #ffffff;
    color: #d9d9d9;
}
</style>
