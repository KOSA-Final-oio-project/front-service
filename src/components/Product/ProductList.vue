<template lang="">
  <body>
    <section>
      <div class="productContainer">
        <div class="dropdown">
          <div class="dropdown category">
            <select v-model="selectedCategory" name="category">
              <option value="" selected disabled hidden>상품카테고리</option>
              <option value="">전체</option>
              <option :value="item" v-for="(item, index) in categoryList" :key="index">
                {{ item }}
              </option>
            </select>
          </div>
          <select
            v-model="selectedSido"
            name="region siDo"
            @change="resetSelections('siGunGuList', 'eupMyeonRoList')"
          >
            <option value="" selected disabled hidden>시/도</option>
            <option value="">전체</option>
            <option :value="item" v-for="(item, index) in siDoList" :key="index">
              {{ item }}
            </option>
          </select>
          <select
            v-model="selectedSiGunGu"
            @click="getSiGunGu()"
            name="region siGunGu"
            @change="resetEupMyeonRo()"
            :disabled="selectedSido === ''"
          >
            <option value="" selected disabled hidden>시/군/구</option>
            <option value="">전체</option>
            <option :value="item" v-for="(item, index) in siGunGuList" :key="index">
              {{ item }}
            </option>
          </select>
          <select
            v-model="selectedEupMyeonRo"
            @click="getEupMyeonRo()"
            name="region eupMyeonRo"
            :disabled="selectedSido === '' || selectedSiGunGu === ''"
          >
            <option value="" selected disabled hidden>읍/면/로</option>
            <option value="">전체</option>
            <option :value="item" v-for="(item, index) in eupMyeonRoList" :key="index">
              {{ item }}
            </option>
          </select>
          <button @click="selectProduct()" class="selectBt">조회</button>
          <router-link :to="'/product/writeProduct'"><p class="regist">상품등록</p></router-link>
        </div>
        <div class="productList">
          <div class="products">
            <div class="product" v-for="(item, index) in products" :key="index">
              <router-link :to="`/product/productDetail/${item.productNo}`">
                <div class="productImg">
                  <span :class="{ rented: item.status === 1, expired: item.status === 2 }">
                    {{ item.status === 0 ? '미대여' : item.status === 1 ? '대여중' : '기간만료' }}
                  </span>
                  <img :src="item.thumbnail ? item.thumbnail : sampleImage" />
                </div>
                <p class="title">{{ item.title }}</p>
                <p class="date">
                  {{ formatDate(item.startDate) }} ~ {{ formatDate(item.endDate) }}
                </p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </body>
</template>
<script>
import axios from 'axios'
import sampleImage from '@/assets/sample.png'

export default {
  data() {
    return {
      sampleImage: sampleImage,
      products: [],
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
    formatDate(dateString) {
      const dateWithoutTime = dateString.split('T')[0]
      return dateWithoutTime
    },
    selectProduct() {
      if (this.selectedCategory == '') {
        if (this.selectedSido == '') {
          axios
            .get('http://192.168.1.86:9797/product-service/product/productList/n')
            .then((result) => {
              this.products = result.data.productList
              console.log(result.data)
            })
        } else if (this.selectedSiGunGu == '') {
          axios
            .get('http://192.168.1.86:9797/product-service/product/productList/n', {
              params: {
                siDo: this.selectedSido
              }
            })
            .then((result) => {
              this.products = result.data.productList
            })
        } else if (this.selectedEupMyeonRo == '') {
          axios
            .get('http://192.168.1.86:9797/product-service/product/productList/n', {
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
            .get('http://192.168.1.86:9797/product-service/product/productList/n', {
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
      } else {
        if (this.selectedSido == '') {
          axios
            .get('http://192.168.1.86:9797/product-service/product/productList/n', {
              params: {
                categoryName: this.selectedCategory
              }
            })
            .then((result) => {
              this.products = result.data.productList
              console.log(result.data)
            })
        } else if (this.selectedSiGunGu == '') {
          axios
            .get('http://192.168.1.86:9797/product-service/product/productList/n', {
              params: {
                siDo: this.selectedSido,
                categoryName: this.selectedCategory
              }
            })
            .then((result) => {
              this.products = result.data.productList
            })
        } else if (this.selectedEupMyeonRo == '') {
          axios
            .get('http://192.168.1.86:9797/product-service/product/productList/n', {
              params: {
                siDo: this.selectedSido,
                siGunGu: this.selectedSiGunGu,
                categoryName: this.selectedCategory
              }
            })
            .then((result) => {
              this.products = result.data.productList
            })
        } else {
          axios
            .get('http://192.168.1.86:9797/product-service/product/productList/n', {
              params: {
                siDo: this.selectedSido,
                siGunGu: this.selectedSiGunGu,
                eupMyeonRo: this.selectedEupMyeonRo,
                categoryName: this.selectedCategory
              }
            })
            .then((result) => {
              this.products = result.data.productList
            })
        }
      }
    },
    getSiDo() {
      axios.get('http://192.168.1.86:9797/product-service/address/siDoList').then((result) => {
        this.siDoList = result.data
      })
    },
    getSiGunGu() {
      axios
        .get(`http://192.168.1.86:9797/product-service/address/siGunGuList/${this.selectedSido}`)
        .then((result) => {
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
    },
    get() {
      axios.get('http://192.168.1.86:9797/product-service/product/productList/n').then((result) => {
        this.products = result.data.productList
      })
    },

    resetSelections() {
      this.selectedSiGunGu = ''
      this.selectedEupMyeonRo = ''

      if (this.selectedSido !== '') {
        this.getSiGunGu()
      }
    },

    resetEupMyeonRo() {
      if (this.selectedSiGunGu === '') {
        // '전체'를 선택하면 읍면동 선택 초기화
        this.selectedEupMyeonRo = ''
      } else {
        // 시군구를 선택했을 때 읍면동을 업데이트합니다.
        this.selectedEupMyeonRo = '' // 읍면동 선택 초기화
        this.getEupMyeonRo() // 읍면동 리스트를 업데이트할 수 있도록 해당 메서드를 호출합니다.
      }
    },
    truncateTitle(title, maxLength) {
      if (title.length > maxLength) {
        return title.substring(0, maxLength) + '...'
      } else {
        return title
      }
    }
  },
  created() {
    this.get()
    this.getSiDo()
    this.getCategory()
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
span {
  z-index: 1000;
}

.product p.title {
  margin: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 텍스트가 넘칠 경우 '...'으로 표시 */
  white-space: nowrap;
  /* 텍스트가 한 줄로만 표시되도록 설정 */
  max-width: 100%;
}

section {
  padding-top: 80px;
}

body {
  margin: 0px;
  /* overflow-x: hidden; */
  /* position: relative; */
}

/* Basic styling for the dropdown container */
.dropdown {
  display: flex;
  align-items: center;
  /* margin-top: 1%; */
  justify-content: left;
  /* margin-right: 1%; */
  margin-left: 13%;
}

.dropdown.category {
  /* margin-right: calc(1% + 60px); */
}

.dropdown.category {
  /* margin-right: calc(1% + 60px); */
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
  background-color: #178ca4;
}

p.regist {
  margin-top: 16px;
  margin-left: 350px;
  /* margin-right: 50px; */
  padding: 8px 15px;
  background-color: #18b7be;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

p.regist:hover {
  background-color: #178ca4;
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
  color: #072a40;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

.date {
  font-size: 15px;
  color: #072a40;
}

.count {
  font-size: 15px;
}

.productContainer {
  margin-top: 150px;
  position: relative;
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
  background-color: #178ca4;
  padding: 3px 5px;
  border-radius: 10px;
  z-index: 1;
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
</style>
