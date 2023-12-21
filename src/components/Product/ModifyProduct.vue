<template>
    <section>
        <div class="productContainer">
            <form @submit.prevent="registProduct">
                <div class="product">
                    <div class="flex-container">
                        <div class="title">
                            <input class="title-input" type="text" v-model="title" required />
                        </div>
                        <div class="postCategory">
                            <p>{{ postCategory === 0 ? '빌려드려요' : '빌려주세요' }}</p>
                        </div>
                    </div>
                    <div class="dropdown">
                        <p class="category">카테고리를 선택해주세요.</p>
                        <select v-model="siDo" name="region siDo" disabled>
                            <option :value="siDo">{{ siDo }}</option>
                        </select>
                        <select v-model="siGunGu" name="region siGunGu" disabled>
                            <option :value="siGunGu">{{ siGunGu }}</option>
                        </select>
                        <select v-model="eupMyeonRo" name="region eupMyeonRo" disabled>
                            <option :value="eupMyeonRo">{{ eupMyeonRo }}</option>
                        </select>
                    </div>
                    <div class="dropdown">
                        <select v-model="category" name="category" disabled>
                            <option :value="category">{{ category }}</option>
                        </select>
                    </div>
                    <div class="dropdown">
                        <select name="priceCategory" v-model="priceCategory" required>
                            <option value="" selected disabled hidden>시간단위</option>
                            <option value="시간">시간</option>
                            <option value="일">일</option>
                            <option value="주">주</option>
                            <option value="월">월</option>
                        </select>
                        <input type="text" placeholder="가격" v-model="price" required />
                    </div>
                    <div class="datePicker">
                        <p class="rent-date">대여기간을 선택해주세요.</p>
                        <VueDatePicker v-model="dateRange" type="date" range placeholder="YYYY-MM-DD"></VueDatePicker>
                    </div>
                    <div class="content">
                        <p class="product-content">상품의 상세정보를 입력해주세요.</p>
                        <!-- <input type="text" class="product-info" placeholder="상세정보" maxlength="500" v-model="content" required /> -->
                        <textarea class="product-info" placeholder="상품의 상세정보는 최대 500자까지 입력이 가능합니다." maxlength="500"
                            v-model="content" required></textarea>
                    </div>

                    <div class="button-container">
                        <button class="registBt">등록</button>
                    </div>
                </div>
            </form>
        </div>
    </section>
</template>

<script>
import axios from 'axios'
import VueDatePicker from '@vuepic/vue-datepicker'

export default {
    name: 'ModifyProduct',
    components: {
        VueDatePicker
    },
    data() {
        return {
            title: '',
            postCategory: 0,
            siDo: '',
            siGunGu: '',
            eupMyeonRo: '',
            category: '',
            startDate: null,
            endDate: null,
            dateRange: null,
        }
    },
    methods: {
        getProductDetail(productNo) {
            const nickname = localStorage.getItem('nickname');
            const pno = this.$route.params.id
            const url = `http://192.168.1.86:9797/oio/product/productDetail/103/${nickname}`;

            axios.get(url)
                .then(response => {
                    const data = response.data;
                    this.title = data.product.title;
                    this.postCategory = data.postCategory;
                    this.content = data.product.content;
                    this.priceCategory = data.product.priceCategory;
                    this.price = data.product.price;
                    this.startDate = data.product.startDate;
                    this.endDate = data.product.endDate;
                    this.category = data.product.category.categoryName;
                    this.siDo = data.product.address.siDo;
                    this.siGunGu = data.product.address.siGunGu;
                    this.eupMyeonRo = data.product.address.eupMyeonRo;

                    console.log('eupMyeonRo 값:', data.product.address.eupMyeonRo);

                })
                .catch(error => {
                    console.error('상품 정보를 불러오는데 실패했습니다.', error);
                });
        },
        registProduct() {
            const nickname = localStorage.getItem('nickname');
            const formData = new FormData()
            formData.append('title', this.title)
            formData.append('content', this.content)
            formData.append('priceCategory', this.priceCategory)
            formData.append('price', this.price)
            formData.append('endDate', this.dateRange[1])

            // 서버로 전송
            axios
                .post(
                    `http://192.168.1.86:9797/oio/${this.siDo}/${this.siGunGu}/${this.eupMyeonRo}/${this.category}/${nickname}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )
                .then((response) => {
                    console.log(response.data)
                    window.location = '/product/productList'
                })
                .catch((error) => {
                    console.log(error)
                })
        },
    },
    created() {
        this.getProductDetail()
    }
}
</script>

<style scoped>
@font-face {
    font-family: 'NotoSansKR-VariableFont_wght';
    src: url(/fonts/NotoSansKR-VariableFont_wght.ttf);
}

* {
    font-family: 'NotoSansKR-VariableFont_wght';
}

section {
    margin-top: 150px;
    border: 1px solid black;
}

.productContainer {
    position: relative;
    width: 80%;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-radius: 10px;
}

.product {
    align-items: center;
    width: 100%;
}

.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.title {
    margin-top: 50px;
    width: 70%;
}

.title-input {
    border: none;
    border-bottom: 2px solid #18b7be;
    font-size: 18px;
    padding: 5px 0;
    width: 100%;
}

.label-style {
    font-size: 17px;
    border-radius: 30px;
    color: #333;
    margin-left: 10px;
}

.postCategory {
    /* margin-top: auto;
    display: flex;
    align-items: center; */
}

.postCategory p {
    display: inline-block;
    height: 40px;
    width: 150px;
    border: 1px solid #18b7be;
    border-radius: 30px;
    line-height: 35px;
    text-align: center;
    font-weight: bold;
    background-color: #18b7be;
    color: #ffffff;
}


.category {
    margin-top: 40px;
    font-size: 18px;
    font-weight: bold;
}

.dropdown select,
.dropdown input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.rent-date {
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
}

.product-info {
    width: 100%;
    height: 200px;
}

.product-info {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    resize: none;
    /* 사용자가 크기 조절 못하게 함 */
    text-align: left;
    /* 텍스트 좌측 정렬 */
    vertical-align: top;
    /* 텍스트 상단 정렬 */
}

.product-content {
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
}

.button-container {
    text-align: center;
    /* 버튼을 중앙 정렬 */
    margin-bottom: 20px;
}

.registBt {
    display: inline-block;
    margin-top: 60px;
    background-color: #18b7be;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: background-color 0.3s;
}

.registBt:hover {
    background-color: #15a2b8;
}

.file-Btn {
    margin-top: 30px;
}

.imageUpload {
    margin-top: 20px;
}

.imagePreview {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.previewItem {
    position: relative;
}

.previewItem img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
}

.previewItem button {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 5px;
    background-color: #ff0000;
    color: #fff;
    border: none;
    cursor: pointer;
}
</style>