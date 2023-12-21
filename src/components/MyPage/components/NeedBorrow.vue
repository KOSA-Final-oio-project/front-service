<template>
    <div class="need-borrow-outer-container">
        <div class="need-borrow-container">
            <ul class="need-borrow-ul">
                <li v-for="item in data" :key="item.id" class="need-borrow-item" @click="openProductDetailModal(item)">
                    <div class="left">
                        <img class="product-img" :src="findThumbnail(item.productNo)" />
                    </div>
                    <div class="right">
                        <p><img src="../../../assets/package.png" /> {{ item.title }}<br /></p>
                        <p>
                            <img src="../../../assets/calendar.png" />
                            {{ formatDate(item.startDate) }} ~ {{ formatDate(item.endDate) }}<br />
                        </p>
                        <p>
                            <img src="../../../assets/status.png" />
                            {{ getStatusText(item.status) }}
                        </p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="product-detail-modal" v-if="showProductDetailModal">
            <transition name="modal-fade" mode="out-in">
                <ProductDetail :ProductList="ProductList" @close="closeProductDetailModal" class="modal-wrapper" />
            </transition>
            <button @click="closeProductDetailModal" class="close-button">닫기</button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import ProductDetail from '../../Product/ProductDetail.vue'
export default {
    name: 'NeedRent',
    components: {
        ProductDetail
    },
    data() {
        return {
            data: [],
            ProductList: null,
            showProductDetailModal: false,
        }
    },
    methods: {
        getBorrowProduct() {
            const nickname = localStorage.getItem('nickname')
            const url = `http://192.168.1.86:9797/product-service/product/myProduct/${nickname}/1`
            axios
                .get(url)
                .then((response) => {
                    console.log(response.data)
                    this.data = response.data
                })
                .catch((error) => {
                    console.log(error.data)
                })
        },
        getStatusText(status) {
            if (status === 0) {
                return '제의 가능'
            } else if (status === 1) {
                return '대여중'
            } else if (status === 2) {
                return '기간만료'
            } else {
                return '알 수 없음'
            }
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

        formatDate(dateString) {
            const date = new Date(dateString)
            const formattedDate = date.toISOString().split('T')[0]
            return formattedDate
        }
    },

    mounted() {
        this.getBorrowProduct()
    }
}
</script>
<style scoped>
.need-borrow-outer-container {
    width: 100%;
    overflow-y: auto;
    max-height: 100%;
}

.need-borrow-container {
    width: calc(100% - 20px);
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
}

.need-borrow-ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.product-img {
    margin-top: 10px;
    width: 90px;
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

.need-borrow-item {
    display: flex;
    justify-content: space-between;
    width: 24%;
    margin-top: 20px;
    margin-left: 10px;
    /* margin-bottom: 35px; */
    list-style: none;
    border: 2px solid #18b7be;
    border-radius: 5px;
    padding: 10px;
    transition: all 0.3s ease;
}

.need-borrow-item:hover {
    cursor: pointer;
    background-color: #f0f0f0;
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
