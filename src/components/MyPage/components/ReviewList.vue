<template lang="">
    <div>
        <ul>
            <li v-for="review in reviews" :key="review.id">
                <p>상품명: {{ productNo }}<br /></p>
                <p>작성자: {{ review.writerNickname }}<br /></p>
                <p>내용: {{ review.content }}<br /></p>
                작성시간: {{ review.postDate }}
            </li>
        </ul>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'ReviewList',
    data() {
        return {
            productNo: '2',
            reviews: []
        }
    },
    methods: {
        getProductReviews(productNo) {
            const url = this.$backURL + `review/reviews/${productNo}`
            // GET 요청 보내기
            axios
                .get(url)
                .then((response) => {
                    const responseReview = response.data
                    console.log(responseReview)
                    this.reviews = responseReview
                })
                .catch((error) => {
                    console.error('error : ', error)
                })
        }
    },
    mounted() {
        this.getProductReviews(this.productNo)
    }
}
</script>
<style lang=""></style>
