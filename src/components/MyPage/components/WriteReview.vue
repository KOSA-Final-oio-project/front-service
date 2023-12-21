<template>
    <div class="review">
        <form @submit.prevent="submitReview" id="createReviewForm">
            <button
                type="button"
                class="heart-button"
                :class="{ liked: isLiked }"
                @click="clickHeart"
            >
                <i class="bi bi-heart"></i>
            </button>
            <label class="content" for="content">거래에 대한 후기를 남겨주세요.</label><br />
            <textarea
                v-model="content"
                id="content"
                name="content"
                rows="4"
                cols="50"
                placeholder="한번 작성된 후기는 수정이 불가합니다. 신중한 의견을 남겨주세요!"
            ></textarea
            ><br /><br />
            <button type="submit" class="submit-button">작성</button>
            <button type="button" class="cancel-button" @click="closeModal">취소</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'WriteReview',
    props: {
        ReviewList: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            writerNickname: '',
            receiverNickname: '',
            reviewContent: '',
            heart: 0,
            isLiked: false
        }
    },
    methods: {
        submitReview() {
            const writerNickname = localStorage.getItem('nickname')
            let receiverNickname
            const ownerNickname = this.ReviewList.ownerNickname
            const borrowerNickname = this.ReviewList.borrowerNickname
            const productNo = this.ReviewList.productNo
            const rentedProductNo = this.ReviewList.rentedProductNo
            const url = `http://192.168.1.86:9797/transaction-service/review/${productNo}/${rentedProductNo}`

            if (writerNickname == ownerNickname) {
                receiverNickname = borrowerNickname
            } else {
                receiverNickname = ownerNickname
            }

            const requestData = {
                writerNickname: writerNickname,
                receiverNickname: receiverNickname,
                content: this.content,
                heart: this.heart
            }

            axios
                .post(url, requestData)
                .then((response) => {
                    console.log(response.data)
                    console.log(requestData)
                    this.$emit('reviewSubmitted')
                    this.closeModal()
                })
                .catch((error) => {
                    console.log(error.data)
                })
        },

        clickHeart() {
            this.isLiked = !this.isLiked
            this.heart = this.isLiked ? 1 : 0
        },

        closeModal() {
            this.$emit('close')
        }
    }
}
</script>
<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css');

.review {
    position: fixed;
    width: 400px;
    background-color: #f8f8f8;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

label {
    color: #000000;
}

textarea {
    width: 360px;
    height: 180px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 15px;
    resize: none;
}

.submit-button {
    border: 2px solid #19cad3;
    border-radius: 30px;
    background-color: #19cad3;
    color: #ffffff;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
}

.submit-button:hover {
    background-color: #ffffff;
    color: #19cad3;
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
}

.cancel-button:hover {
    background-color: #ffffff;
    color: #d9d9d9;
}

.heart-button {
    position: absolute;
    top: 10px;
    right: 15px;
    border: none;
    background-color: transparent;
    font-size: 24px;
    color: #000000;
    cursor: pointer;
    outline: none;
}

.heart-button:hover .bi-heart::before {
    content: '\F415';
    transition: all 0.3s ease;
    color: #ff0000;
}

.liked .bi-heart::before {
    content: '\F415';
    color: #ff0000;
}
</style>
