<template lang="">
    <body>
        <section>
            <div class="productContainer">
                <div class="dropdown">
                    <select v-model="selectedSido" name="region siDo" @change="resetSelections('siGunGuList', 'eupMyeonRoList')">
                        <option value="">전체</option>
                        <option :value="item" v-for="(item, index) in siDoList" :key="index">
                            {{ item }}
                        </option>
                    </select>
                    <select v-model="selectedSiGunGu" @click="getSiGunGu()" name="region siGunGu" @change="resetEupMyeonRo()" :disabled="selectedSido === ''">
                        <option value="">전체</option>
                        <option :value="item" v-for="(item, index) in siGunGuList" :key="index">
                            {{ item }}
                        </option>
                    </select>
                    <select
                        v-model="selectedEupMyeonRo"
                        @click="getEupMyeonRo()"
                        name="region eupMyeonRo"
                        :disabled="selectedSido === '' || selectedSiGunGu === ''">
                        <option value="">전체</option>
                        <option :value="item" v-for="(item, index) in eupMyeonRoList" :key="index" >
                            {{ item }}
                        </option>
                    </select>
                    <button @click="selectProduct()" class="selectBt">조회</button>
                </div>
                <div class="productList">
                    <div class="products">
                        <div class="product" v-for="(item, index) in products" :key="index">
                            <div class="productImg">
                                <span :class="{ 'rented': item.status === 1, 'expired': item.status === 2 }">
                                    {{ item.status === 0 ? '미대여' : (item.status === 1 ? '대여중' : '기간만료') }}
                                </span>
                                <img
                                    src="https://oio-bucket.s3.ap-northeast-2.amazonaws.com/logo.png"
                                />
                            </div>
                            <p class="title">{{ item.content }}</p>
                            <p class="date">
                                {{ formatDate(item.startDate) }} ~ {{ formatDate(item.endDate) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </body>
</template>
<script>
import axios from 'axios'
export default {
    data() {
        return {
            products: [],
            siDoList: [],
            siGunGuList: [],
            eupMyeonRoList: [],
            selectedSido: '',
            selectedSiGunGu: '',
            selectedEupMyeonRo: ''
        }
    },

    methods: {
        formatDate(dateString) {
            const parsedDate = new Date(dateString)
            const year = parsedDate.getFullYear()
            const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0')
            const day = parsedDate.getDate().toString().padStart(2, '0')
            return `${year}-${month}-${day}`
        },
        selectProduct() {
            if (this.selectedSido == '') {
                axios.get('http://localhost:8889/product/productList/n').then((result) => {
                    this.products = result.data.productList
                })
            } else if (this.selectedSiGunGu == '') {
                axios
                    .get('http://localhost:8889/product/productList/n?siDo=' + this.selectedSido)
                    .then((result) => {
                        this.products = result.data.productList
                    })
            } else if (this.selectedEupMyeonRo == '') {
                axios
                    .get('http://localhost:8889/product/productList/n', {
                        params: {
                            siDo: this.selectedSido,
                            siGunGu: this.selectedSiGunGu
                        }
                    })
                    .then((result) => {
                        this.products = result.data.productList
                    })
            } else {
                axios
                    .get('http://localhost:8889/product/productList/n', {
                        params: {
                            siDo: this.selectedSido,
                            siGunGu: this.selectedSiGunGu,
                            eupMyeonRo: this.selectedEupMyeonRo
                        }
                    })
                    .then((result) => {
                        this.products = result.data.productList
                    })
            }
        },
        getSiDo() {
            axios.get('http://localhost:8889/address/siDoList').then((result) => {
                this.siDoList = result.data
            })
        },
        getSiGunGu() {
            axios
                .get(`http://localhost:8889/address/siGunGuList/${this.selectedSido}`)
                .then((result) => {
                    this.siGunGuList = result.data
                })
        },
        getEupMyeonRo() {
            axios
                .get(
                    `http://localhost:8889/address/eupMyeonRoList/${this.selectedSido}/${this.selectedSiGunGu}`
                )
                .then((result) => {
                    this.eupMyeonRoList = result.data
                })
        },
        get() {
            axios.get('http://localhost:8889/product/productList/n').then((result) => {
                this.products = result.data.productList
            })
        },

        resetSelections() {
            this.selectedSiGunGu = '';
            this.selectedEupMyeonRo = '';

            if (this.selectedSido !== '') {
                this.getSiGunGu();
            }
        },

        resetEupMyeonRo() {
            if (this.selectedSiGunGu === '') {
                // '전체'를 선택하면 읍면동 선택 초기화
                this.selectedEupMyeonRo = '';
            } else {
                // 시군구를 선택했을 때 읍면동을 업데이트합니다.
                this.selectedEupMyeonRo = ''; // 읍면동 선택 초기화
                this.getEupMyeonRo(); // 읍면동 리스트를 업데이트할 수 있도록 해당 메서드를 호출합니다.
            }
        },

    },
    created() {
        this.get()
        this.getSiDo()
    }
}
</script>
<style scoped>
body {
    margin: 0px;
    /* overflow-x: hidden; */
    /* position: relative; */
}

/* Basic styling for the dropdown container */
.dropdown {
    display: flex;
    align-items: center;
    margin-top: 1%;
    justify-content: right;
    margin-right: 1%;
}

/* Styling for the individual selects */
select {
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
}

/* Styling for the button */
.selectBt {
    padding: 8px 15px;
    background-color: #18b7be;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

/* Hover effect for the button */
.selectBt:hover {
    background-color: #0056b3;
}

/* Optional: Style the options within the dropdown */
option {
    background-color: #fff;
    color: #333;
}

li {
    list-style-type: none;
}

a {
    text-decoration: none;
}

.title {
    font-weight: bold;
    font-size: 20px;
}

.date {
    font-size: 15px;
}

.count {
    font-size: 15px;
}

.productContainer {
    position: relative;
}

.searchBt {
    border: none;
    background-color: transparent;
    position: absolute;
    top: 0%;
    left: 73%;
    transform: translate(-50%, -50%);
}

.searchBt img {
    height: 40px;
}

.productList {
    display: flex;
    justify-content: center;
    position: relative;
    margin-left: 5%;
    /* 간격을 조절 */
}

.products {
    width: 1130px;
    /* display: flex; */
    justify-content: center;
    /* position: relative; */
    flex-wrap: wrap;
    gap: 20px;
    /* 간격을 조절 */
}

.product {
    display: inline-block;
    width: 250px;
    height: 270px;
    flex-basis: 200px;
    text-align: center;
    margin: 20px 10px;
    background-color: #ffffff;
    border: 3px solid #178ca4;
    border-radius: 30px;
    color: #072a40;
}

.product span {
    position: absolute;
    right: 0;
}

.productImg {
    margin-top: 15px;
    position: relative;
    height: 180px;
    width: 180px;
    display: inline-block;
}
.productImg span {
    margin-left: 5px;
    color: #ffffff;
    background-color: #178CA4;
    padding: 3px 5px;
    border-radius: 10px;
}

.productImg span.rented {
    background-color: red;
}

.productImg span.expired {
    background-color: #d1d1d1;
}

.product img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
}

.product p {
    margin: 3px;
}

.product p:last-child {
    margin-bottom: 20px;
}

footer {
    width: 100%;
    height: 50px;
    display: flex;
    background-color: #072a40;
    color: white;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    overflow: hidden;
}

footer>p {
    margin-left: 10px;
}
</style>
