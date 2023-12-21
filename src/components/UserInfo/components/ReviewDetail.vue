<template>
    <div class="review-container">
        <div class="product-detail">
            <div class="product-info">
                <img alt="대여 물품 사진" :src="thumbnail" />
                <div class="product-text">
                    <span v-if="review.heart === 0"><i class="bi bi-heart"></i></span>
                    <span v-else-if="review.heart === 1"><i class="bi bi-heart-fill"></i></span>
                    <p><img src="../../../assets/package.png" />{{ title }}</p>
                    <p>
                        <img src="../../../assets/calendar.png" />{{ product.rentStartDate }} ~
                        {{ product.rentEndDate }}
                    </p>
                </div>
            </div>
        </div>
        <div class="review-detail">
            <img :src=profile />
            <div class="detail-info">
                <p class="post-date">
                    <img src="../../../assets/wall-clock.png" />{{ review.postDate }}
                </p>
            </div>
        </div>
        <div class="review-content">
            <p>{{ review.content }}</p>
        </div>
        <button @click="closeModal" class="close-button">닫기</button>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'ReviewDetail',
    props: {
        ReviewData: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            review: '',
            product: '',
            title: '',
            profile: '',
            thumbnail:'',
        }
    },
    methods: {
        getRentedProduct() {
            const useReviewdata = this.ReviewData
            const rentedProductNo = useReviewdata.rentedProductNo

            const url = `http://192.168.1.86:9797/transaction-service/rent/detail/${rentedProductNo}`
            axios
                .get(url)
                .then((response) => {
                    const responseProduct = response.data
                    console.log(responseProduct)
                    this.product = responseProduct
                    this.thumbnail = useReviewdata.rentedProduct.product.thumbnail
                })
                .catch((error) => {
                    console.error('error : ', error)
                })
        },
        getReviewDetail() {
            const useReviewdata = this.ReviewData
            const reviewNo = useReviewdata.reviewNo

            const url = `http://192.168.1.86:9797/transaction-service/review/${reviewNo}`
            axios
                .get(url)
                .then((response) => {
                    const responseReview = response.data
                    console.log(responseReview)
                    this.review = responseReview
                })
                .catch((error) => {
                    console.error('error : ', error)
                })
        },

        getProductTitle() {
            const useReviewdata = this.ReviewData
            this.title = useReviewdata.rentedProduct.product.title
            console.log(this.title)
        },

        getProfile() {
            const useReviewdata = this.ReviewData
            const nickname = useReviewdata.writerNickname
            const url = `http://192.168.1.86:9797/member-service/member/${nickname}`

            axios.get(url)
                .then((response) => {
                    this.profile = response.data.result.profile
                })
        },

        closeModal() {
            this.$emit('close-modal')
        },

    },

    mounted() {
        this.getProfile()
        this.getReviewDetail()
        this.getRentedProduct()
        this.getProductTitle()
    }
}
</script>

<style scoped>
.review-container {
    width: 450px;
    /* height: auto; */
    padding-left: 20px;
    background-color: #f8f8f8;
    border-radius: 10px;
    border: 1px solid #ccc;
}

.product-info {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    margin-top: 20px;
}

.product-text p {
    align-items: center;
}

.product-text p img {
    width: 20px;
    height: 20px;
}

.product-info img {
    width: 90px;
    height: 90px;
    margin-right: 10px;
}

.review-content {
    background-color: #ffffff;
    padding-left: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    width: 408px;
    height: 200px;
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    position: relative;
}

.review-detail {
    display: flex;
    align-items: center;
}

.review-detail p {
    margin: 5px 0;
}

.review-detail span {
    font-size: 20px;
}

.review-detail img {
    width: 90px;
}

.detail-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 15px;
}

.detail-info p {
    margin-left: auto;
    margin-right: 20px;
}

.detail-info p img {
    width: 20px;
}

.post-date {
    margin: 0;
    text-align: right;
}

.post-date img {
    margin-right: 10px;
}

.close-button {
    border: 2px solid #d9d9d9;
    border-radius: 30px;
    background-color: #d9d9d9;
    color: #ffffff;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    float: right;
    margin: 10px 20px 10px 0px;
}

.close-button:hover {
    background-color: #ffffff;
    color: #d9d9d9;
}

.bi-heart-fill {
    color: red;
    float: right;
}

.bi-heart {
    float: right;
}
</style>
