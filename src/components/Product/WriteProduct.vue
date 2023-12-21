<template>
    <div class="productContainer">
        <form @submit.prevent="registProduct">
            <div class="product">
                <div class="title">
                    <input type="text" placeholder="제목" v-model="title">
                </div>
                <div class="postCategory">
                    <input type="radio" id="select" name="post" value="0" v-model="postCategory">
                    <label for="select">빌려드립니다</label>
                    <input type="radio" id="select2" name="post" value="1" v-model="postCategory">
                    <label for="select2">빌려주세요</label>
                </div>
                <div class="dropdown">
                    <select v-model="selectedSido" name="region siDo">
                        <option value="" selected disabled hidden>시/도</option>
                        <option :value="item" v-for="(item, index) in siDoList" :key="index">
                            {{ item }}
                        </option>
                    </select>
                    <select v-model="selectedSiGunGu" @click="getSiGunGu()" name="region siGunGu">
                        <option value="" selected disabled hidden>시/군/구</option>
                        <option :value="item" v-for="(item, index) in siGunGuList" :key="index">
                            {{ item }}
                        </option>
                    </select>
                    <select
                        v-model="selectedEupMyeonRo"
                        @click="getEupMyeonRo()"
                        name="region eupMyeonRo"
                    >
                    <option value="" selected disabled hidden>읍/면/로</option>
                        <option :value="item" v-for="(item, index) in eupMyeonRoList" :key="index">
                            {{ item }}
                        </option>
                    </select>
                </div>
                <div class="dropdown">
                    <select v-model="selectedCategory" name="category">
                        <option value="" selected disabled hidden>상품카테고리</option>
                        <option :value="item" v-for="(item, index) in categoryList" :key="index">
                            {{ item }}
                        </option>
                    </select>
                </div>
                <div class="dropdown">
                    <select name="priceCategory" v-model="priceCategory">
                        <option value="" selected disabled hidden>시간단위</option>
                        <option value="시간">시간</option>
                        <option value="일">일</option>
                        <option value="주">주</option>
                        <option value="월">월</option>
                    </select>
                    <input type="text" placeholder="가격" v-model="price">
                </div>
                <div class="content">
                    <input type="text" placeholder="상세정보" v-model="content">
                </div>
                <div class="imageUpload">
                    <input type="file" ref="imageInput" multiple @change="handleImageChange">
                    <div class="imagePreview" v-if="images2.length > 0">
                        <div v-for="(image, index) in images2" :key="index" class="previewItem">
                            <img :src="image" alt="Preview">
                            <button @click="removeImage(index)">삭제</button>
                        </div>
                    </div>
                </div>
                <button class="registBt">
                    등록
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
import VueDatePicker from '@vuepic/vue-datepicker'

export default {
    name: 'WriteProduct',
    components: {
        VueDatePicker
    },
    data() {
        return {
            title: '',
            postCategory: '',
            category: '',
            priceCategory: '',
            price: '',
            content: '',
            images: [],
            images2: [], // Array to store selected image files
            startDate: null,
            endDate: null,
            dateRange: null,
            siDoList: [],
            siGunGuList: [],
            eupMyeonRoList: [],
            selectedSido: '',
            selectedSiGunGu: '',
            selectedEupMyeonRo: '',
            categoryList: [],
            selectedCategory: ''
        }
    },
    methods: {
        registProduct() {
            const formData = new FormData();
            formData.append("title",this.title);
            formData.append("content",this.content);
            formData.append("priceCategory",this.priceCategory);
            formData.append("price",this.price)
            formData.append("startDate","2023-12-19");
            formData.append("endDate","2023-12-20");
            formData.append("postCategory",this.postCategory);

            console.log(this.images)
            for (let i = 0; i <= this.images.length; i++) {
                formData.append('files', this.images[i])
            }

            const nickname = localStorage.getItem('nickname')

            // 서버로 전송
            axios.post(`http://192.168.1.86:9797/oio/product/writeProduct/${this.selectedSido}/${this.selectedSiGunGu}/${this.selectedEupMyeonRo}/${this.selectedCategory}/${nickname}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        handleImageChange(event) {
            // Update the images array with selected image files
            this.images2 = Array.from(event.target.files).map((file) => URL.createObjectURL(file))
            const file = event.target.files
            this.images = file
        },

        removeImage(index) {
            // Remove the selected image from the images array
            this.images.splice(index, 1);
            this.images2.splice(index, 1);
        },

        getSiDo() {
            axios.get('http://192.168.1.86:9797/oio/address/siDoList').then((result) => {
                this.siDoList = result.data
            })
        },
        getSiGunGu() {
            axios.get(`http://192.168.1.86:9797/oio/address/siGunGuList/${this.selectedSido}`).then((result) => {
                this.siGunGuList = result.data
            })
        },
        getEupMyeonRo() {
            axios
                .get(
                    `http://192.168.1.86:9797/oio/address/eupMyeonRoList/${this.selectedSido}/${this.selectedSiGunGu}`
                )
                .then((result) => {
                    this.eupMyeonRoList = result.data
                })
        },
        getCategory() {
            axios.get('http://192.168.1.86:9797/oio/category/categoryList').then((result) => {
                this.categoryList = result.data
            })
        }
    },
    created() {
        this.getCategory()
        this.getSiDo()
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
    margin-top: auto;
    display: flex;
    align-items: center;
}

.product input[type='radio'] {
    display: none;
}

.product input[type=radio]+label {
    display: inline-block;
    cursor: pointer;
    height: 40px;
    width: 150px;
    border: 1px solid #18b7be;
    line-height: 35px;
    text-align: center;
    font-weight: bold;
    background-color: #fff;
    color: #18b7be;
}

.product input[type=radio]:checked+label {
    background-color: #18B7BE;
    color: #ffffff;
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
  