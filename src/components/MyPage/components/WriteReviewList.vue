<template>
    <div class="reviews-outer-container">
        <div class="reviews-container">
            <div class="review-list">
                <ul class="reviews-list-ul">
                    <li
                        v-for="review in reviews"
                        :key="review.id"
                        class="review-item"
                        @click="openReviewDetailModal(review)"
                    >
                        <p>
                            <img src="../../../assets/package.png" />
                            {{ review.rentedProduct.product.title }}<br />
                        </p>
                        <p>
                            <img src="../../../assets/user-profile.png" />
                            {{ review.receiverNickname }}<br />
                        </p>
                        <p>
                            <img src="../../../assets/content.png" />
                            {{ truncateText(review.content, 10) }}<br />
                        </p>
                        <p><img src="../../../assets/wall-clock.png" /> {{ review.postDate }}</p>
                    </li>
                </ul>
                <transition name="modal-fade">
                    <ReviewDetail
                        v-if="showModal"
                        :ReviewData="ReviewData"
                        class="modal-wrapper"
                        @close-modal="closeModal"
                    />
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import ReviewDetail from './ReviewDetail.vue'
export default {
    name: 'WriteReviewList',
    components: {
        ReviewDetail
    },
    data() {
        return {
            reviews: [],
            rentedProduct: [],
            product: [],
            showModal: false,
            ReviewData: null
        }
    },
    methods: {
        async getWriteReviews() {
            try {
                const nickname = localStorage.getItem('nickname')
                const url = `http://192.168.1.86:9797/oio/myreviews/0`
                const response = await this.$axiosInstance.get(url)
                const responseReview = response.data

                const updatedReviews = []

                for (const review of responseReview) {
                    const rentedProductNo = review.rentedProductNo
                    const url2 = `http://192.168.1.86:9797/oio/rentedProduct/${rentedProductNo}`

                    
                    const responseRentedProduct = await axios.get(url2)
                    const ownerNickname = responseRentedProduct.data.ownerNickname

                    const url3 = `http://192.168.1.86:9797/product-service/product/myProduct/${ownerNickname}/0`
                    const responseProduct = await axios.get(url3)
                    const productData = responseProduct.data

                    const receiverNickname = review.receiverNickname
                    const url4 = `http://192.168.1.86:9797/oio/member/${receiverNickname}`
                    const responseProfile = await axios.get(url4)
                    const profileData = responseProfile.data
                    console.log(profileData)

                    // productNo가 일치하는 경우에만 리뷰를 추가합니다.
                    if (Array.isArray(productData)) {
                        productData.forEach((product) => {
                            const rentedProductCopy = { ...responseRentedProduct.data }
                            const profileCopy = { ...responseProfile.data }
                            if (product.productNo === rentedProductCopy.productNo) {
                                rentedProductCopy.product = product

                                const updatedReview = { ...review }
                                updatedReview.rentedProduct = rentedProductCopy
                                updatedReview.profile = profileCopy

                                updatedReviews.push(updatedReview)
                            }
                        })
                    } else {
                        if (
                            productData.productNo === responseRentedProduct.data.product.productNo
                        ) {
                            responseRentedProduct.data.product = productData

                            const updatedReview = { ...review }
                            updatedReview.rentedProduct = responseRentedProduct.data

                            updatedReviews.push(updatedReview)
                        }
                    }
                }

                this.reviews = updatedReviews
            } catch (error) {
                console.error('에러 발생: ', error)
            }
        },

        truncateText(text, maxLength) {
            if (text && text.length > maxLength) {
                return text.slice(0, maxLength) + '...'
            }
            return text
        },

        openReviewDetailModal(review) {
            this.ReviewData = review // 선택한 리뷰를 저장
            this.showModal = true // 모달 창을 엽니다.
        },

        closeModal() {
            this.showModal = false // 모달 창을 닫습니다.
        }
    },

    mounted() {
        this.getWriteReviews()
    }
}
</script>
<style scoped>
.reviews-outer-container {
    width: 100%;
    overflow-y: auto;
    max-height: 100%;
}

.reviews-container {
    width: calc(100% - 20px);
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
}

.review-item {
    width: 250px;
    margin: 20px 10px 20px 35px;
    list-style: none;
    border: 1px solid #ccc;
    background-color: #ffffff;
    border: 2px solid #18b7be;
    border-radius: 5px;
    padding: 10px;
    transition: all 0.3s ease;
}

.reviews-list-ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.reviews-list-ul img {
    width: 20px;
}

.review-item:hover {
    cursor: pointer;
    background-color: #f0f0f0;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* 배경 오버레이를 어둡게 설정 */
    z-index: 998;
    /* 모달보다 앞에 표시되도록 설정 */
}

.modal-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    /* 배경 오버레이보다 더 앞에 표시되도록 설정 */
}
</style>
