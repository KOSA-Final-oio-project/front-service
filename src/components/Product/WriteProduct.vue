<template>
    <section>
        <div class="productContainer">
            <form @submit.prevent="registProduct">
                <div class="product">
                    <div class="flex-container">
                        <div class="title">
                            <input class="title-input" type="text" placeholder="제목을 입력해주세요." v-model="title" required />
                        </div>
                        <div class="postCategory">
                            <input type="radio" id="select" name="post" value="0" v-model="postCategory" />
                            <label for="select" class="label-style">빌려드립니다</label>
                            <input type="radio" id="select2" name="post" value="1" v-model="postCategory" />
                            <label for="select2" class="label-style">빌려주세요</label>
                        </div>
                    </div>
                    <div class="dropdown">
                        <p class="category">카테고리를 선택해주세요.</p>
                        <select v-model="selectedSido" name="region siDo" required>
                            <option value="" selected disabled hidden>시/도</option>
                            <option :value="item" v-for="(item, index) in siDoList" :key="index">
                                {{ item }}
                            </option>
                        </select>
                        <select v-model="selectedSiGunGu" @click="getSiGunGu()" name="region siGunGu" required>
                            <option value="" selected disabled hidden>시/군/구</option>
                            <option :value="item" v-for="(item, index) in siGunGuList" :key="index">
                                {{ item }}
                            </option>
                        </select>
                        <select v-model="selectedEupMyeonRo" @click="getEupMyeonRo()" name="region eupMyeonRo" required>
                            <option value="" selected disabled hidden>읍/면/로</option>
                            <option :value="item" v-for="(item, index) in eupMyeonRoList" :key="index">
                                {{ item }}
                            </option>
                        </select>
                    </div>
                    <div class="dropdown">
                        <select v-model="selectedCategory" name="category" required>
                            <option value="" selected disabled hidden>상품카테고리</option>
                            <option :value="item" v-for="(item, index) in categoryList" :key="index">
                                {{ item }}
                            </option>
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
                    <div class="imageUpload">
                        <input class="file-Btn" type="file" ref="imageInput" multiple @change="handleImageChange" />
                        <div class="imagePreview" v-if="images2.length > 0">
                            <div v-for="(image, index) in images2" :key="index" class="previewItem">
                                <img :src="image" alt="Preview" />
                            </div>
                        </div>
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
            if (!this.dateRange || this.dateRange.length !== 2) {
                this.isDateRangeValid = false
                alert('대여기간을 선택해주세요')
                return
            } else {
                this.isDateRangeValid = true
            }

            if (!this.postCategory) {
                alert("빌려드립니다 빌려주세요 중에서 하나를 선택해주세요");
                return;
            }

            const currentDate = new Date();
            if(currentDate > this.dateRange[0]) {
                alert("대여기간은 오늘 이후로 선택가능합니다")
            }
            

            const formData = new FormData()
            formData.append('title', this.title)
            formData.append('content', this.content)
            formData.append('priceCategory', this.priceCategory)
            formData.append('price', this.price)
            formData.append('startDate', this.dateRange[0])
            formData.append('endDate', this.dateRange[1])
            formData.append('postCategory', this.postCategory)

            console.log(this.images)
            for (let i = 0; i <= this.images.length; i++) {
                formData.append('files', this.images[i])
            }

            const nickname = localStorage.getItem('nickname')

            axios
                .post(
                    `http://192.168.1.86:9797/product-service/product/writeProduct/${this.selectedSido}/${this.selectedSiGunGu}/${this.selectedEupMyeonRo}/${this.selectedCategory}/주소수`,
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

    handleImageChange(event) {
        // Update the images array with selected image files
        this.images2 = Array.from(event.target.files).map((file) => URL.createObjectURL(file))
        const file = event.target.files
        this.images = file
    },

    getSiDo() {
        axios.get('http://192.168.1.86:9797/product-service/address/siDoList').then((result) => {
            this.siDoList = result.data
        })
    },
    getSiGunGu() {
        axios.get(`http://192.168.1.86:9797/product-service/address/siGunGuList/${this.selectedSido}`).then((result) => {
            this.siGunGuList = result.data
        })
    },
    getEupMyeonRo() {
        axios
            .get(
                `http://192.168.1.86:9797/product-service/address/eupMyeonRoList/${this.selectedSido}/${this.selectedSiGunGu}`
            )
            .then((result) => {
                this.eupMyeonRoList = result.data
            })
    },
    getCategory() {
        axios.get('http://192.168.1.86:9797/product-service/category/categoryList').then((result) => {
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

.product input[type='radio']+label {
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

.product input[type='radio']:checked+label {
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