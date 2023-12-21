<template>
    <div class="review-container">
        <div class="product-detail">
            <div class="product-info">
                <router-link :to="productDetailLink">
                    <img alt="대여 물품 사진" :src="thumbnail" />
                </router-link>
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
            <router-link :to="{
                path: '/userinfo',
                query: {
                    owner: product.ownerNickname,
                    borrower: product.borrowerNickname,
                    writer: review.writerNickname,
                    receiver: review.receiverNickname
                }
            }">
                <img :src="profile" />
            </router-link>
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
            thumbnail: '',
        }
    },
    computed: {
        productDetailLink() {
            const useReviewdata = this.ReviewData;
            const productNickname = useReviewdata.rentedProduct.product.nickname;
            const productNo = useReviewdata.rentedProduct.product.productNo;

            return {
                path: `http://192.168.1.86:9797/product-service/product/productDetail/${productNo}/${productNickname}`,
                // 다른 라우터 속성들을 설정할 수 있음
            };
        },
    },

    methods: {
        getRentedProduct() {
            const useReviewdata = this.ReviewData
            const rentedProductNo = useReviewdata.rentedProductNo
            console.log(useReviewdata)

            const url = `http://192.168.1.86:9797/oio/rentedProduct/${rentedProductNo}`

            axios
                .get(url)
                .then((response) => {
                    const responseProduct = response.data
                    console.log(responseProduct)
                    this.product = responseProduct
                    this.thumbnail = useReviewdata.rentedProduct.product.thumbnail
                    this.ProductList = responseProduct
                    console.log(this.ProductList)
                })
                .catch((error) => {
                    console.error('error : ', error)
                })
        },
        getReviewDetail() {
            const useReviewdata = this.ReviewData
            const reviewNo = useReviewdata.reviewNo

            const url = `http://192.168.1.86:9797/oio/review/${reviewNo}`

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

        getProfile() {
            const useReviewdata = this.ReviewData

            const nickname = useReviewdata.profile.result.nickname

            const url = `http://192.168.1.86:9797/oio/member/${nickname}`

            axios.get(url).then((response) => {
                this.profile = response.data.result.profile
            })
        },

        getProductTitle() {
            const useReviewdata = this.ReviewData
            this.title = useReviewdata.rentedProduct.product.title
            console.log(this.title)
        },

        closeModal() {
            this.$emit('close-modal')
        },

    },

    mounted() {
        this.getReviewDetail()
        this.getRentedProduct()
        this.getProductTitle()
        this.getProfile()
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
    width: 100px
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
    margin-right: 20px;
}

.bi-heart {
    float: right;
    margin-right: 20px;
}
</style>
