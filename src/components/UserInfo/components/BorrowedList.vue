<template>
    <div class="borrowed-list-outer-container">
        <div class="borrowed-list-container">
            <ul class="borrowed-list-ul">
                <li v-for="item in list" :key="item.id" class="borrowed-item" @click="openProductDetailModal(item)">
                    <div class="left">
                        <img class="product-img" :src="findThumbnail(item.productNo)">
                    </div>
                    <div class="right">
                        <p><img src="../../../assets/package.png"> {{ truncateText(getProductTitle(item.productNo), 3)
                        }}<br>
                        </p>
                        <p><img src="../../../assets/user-profile.png"> {{ item.ownerNickname }}<br></p>
                        <p><img src="../../../assets/calendar.png"> {{ item.rentStartDate }} ~ {{ item.rentEndDate }}<br>
                        </p>
                        <img src="../../../assets/status.png"> {{ item.status }}
                    </div>
                </li>
            </ul>
        </div>

        <div class="product-detail-modal" v-if="showProductDetailModal">
            <button @click="closeProductDetailModal" class="close-button">닫기</button>
            <transition name="modal-fade" mode="out-in">
                <ProductDetail :ProductList="ProductList" @close="closeProductDetailModal" class="modal-wrapper" />
            </transition>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import ProductDetail from '../../Product/ProductDetail.vue'
export default {
    name: 'BorrowedList',
    components: {
        ProductDetail
    },
    data() {
        return {
            list: [],
            data: [],
            nickname: '',
            showModal: false,
            ReviewList: null,
            showProductDetailModal: false,
        }
    },
    methods: {
        getBorrowedList() {
            const nickname = localStorage.getItem("user")
            const url = `http://192.168.1.86:9797/oio/rent/1?nickname=${nickname}`;
            axios.get(url)
                .then(response => {
                    const list = response.data;
                    this.list = list;

                    const ownerNickname = [...new Set(list.map(item => item.ownerNickname))];

                    const requests = ownerNickname.map(owner => {
                        const url2 = `http://192.168.1.86:9797/product-service/product/myProduct/${owner}/0`;
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

.borrowed-item {
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

.borrowed-item:hover {
    cursor: pointer;
    background-color: #f0f0f0;
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

.product-detail-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    /* 기존 modal-wrapper(z-index: 999)보다 더 위에 표시될 수 있도록 설정 */
    background-color: #ffffff;
    border: 1px solid #ccc;
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

.modal-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    /* 배경 오버레이보다 더 앞에 표시되도록 설정 */
}
</style>
