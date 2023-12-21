<template>
  <div class="productContainer">
    <div class="imageContainer">
      <a class="prev" @click="prev" href="#">❮</a>
      <transition-group>
        <div v-for="(img, index) in productImages" :key="index">
          <img class="slider-image" :src="img" alt="Slide Image" v-show="currentIndex === index" />
        </div>
      </transition-group>
      <a class="next" @click="next" href="#">❯</a>
    </div>

    <div v-if="product" class="product">
      <div class="productInfo">
        <router-link v-if="status === 0 && product.status === 0" :to="`/product/modifyProduct/${product.productNo}`">
          <p class="modify">수정</p>
        </router-link>
        <span>{{ product.postCategory === 0 ? '빌려드려요' : '빌려주세요' }}</span>
        <span :class="{ 'rented': product.status === 1, 'expired': product.status === 2 }">
          {{ product.status === 0 ? '미대여' : (product.status === 1 ? '대여중' : '기간만료') }}
        </span>
        <p>조회수:{{ product.viewCount }} 대여수:{{ product.rentCount }} 작성일:{{ formatDate(product.postDate) }}</p>
        <h2>{{ product.title }}</h2>
        <p>{{ product.address.siDo }} {{ product.address.siGunGu }} {{ product.address.eupMyeonRo }}</p>
        <p>카테고리:{{ product.category.categoryName }}</p>
        <p>{{ product.priceCategory }}: {{ product.price }}원</p>
        <p>대여 기간: {{ formatDate(product.startDate) }} ~ {{ formatDate(product.endDate) }}</p>
        <p>{{ product.content }}</p>
      </div>

      <div class="userInfo">
        <span>{{ product.nickname }}</span>
        <button>채팅하기</button>
      </div>
    </div>
  </div>
  <div class="reviewContainer">
    <p>리뷰</p>
    <div v-for="review in reviews" :key="review.id" class="review">
      <div class="info">
        <div class="writer">{{ review.writerNickname }}</div>
        <div class="reviewDate">{{ review.postDate }}</div>
      </div>
      <div class="reviewContent">{{ review.postDate }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import sampleImage from "@/assets/sample.png";

export default {
  name: 'ProductDatail',
  data() {
    return {
      product: {
        productNo: '',
        nickname: '',
        title: '',
        content: '',
        price: 0,
        startDate: '',
        endDate: '',
        status: 0,
        postDate: '',
        viewCount: 0,
        rentCount: 0,
        postCategory: 0,
        priceCategory: '',
        thumbnail: '',
        address: {
          addressNo: 0,
          siDo: '',
          siGunGu: '',
          eupMyeonRo: '',
        },
        category: {
          categoryNo: 0,
          categoryName: '',
        },
      },
      productImgs: [],
      status: 0,
      reviews: [],
      currentIndex: 0,
    };
  },
  mounted() {
    this.getProductDetail(41);
    this.getReviews(41);
  },
  methods: {
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.productImages.length;
    },
    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.productImages.length) % this.productImages.length;
    },
    getProductDetail(productNo) {
      const nickname = localStorage.getItem('nickname');
      const pno = this.$route.params.id
      const url = `http://192.168.1.86:9797/product-service/product/productDetail/${pno}/주소수`;

      axios.get(url)
        .then(response => {
          const data = response.data;
          this.product = data.product;
          this.productImgs = data.productImgs;
          this.status = data.status;
        })
        .catch(error => {
          console.error('상품 정보를 불러오는데 실패했습니다.', error);
        });
    },
    getReviews(productNo) {
      const url = `http://localhost:8889/review/reviews/3`;

      axios.get(url)
        .then(response => {
          const data = response.data;
          this.reviews = data;
        })
        .catch(error => {
          console.error('리뷰를 불러오는데 실패했습니다.', error);
        });
    },
    formatDate(dateString) {
      const dateWithoutTime = dateString.split('T')[0];
      return dateWithoutTime;
    }
  },
  computed: {
    productImages() {
      if (this.product.thumbnail === null) {
        return [sampleImage]
      } else {
        return [this.product.thumbnail, ...this.productImgs];
      }

    },
    currentImage() {
      return this.productImages[this.currentIndex];
    },
  },
};
</script>

<style scoped>
@font-face {
  font-family: 'NotoSansKR-VariableFont_wght';
  src: url(/fonts/NotoSansKR-VariableFont_wght.ttf);
}

* {
  font-family: 'NotoSansKR-VariableFont_wght';
}

a {
  text-decoration: none;
}

.productContainer {
  display: flex;
  justify-content: center;
  position: relative;
  margin-top: 200px;
}

.imageContainer {
  width: 500px;
  min-height: 650px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-image {
  max-width: 500px;
  max-height: 650px;
}

.prev,
.next {
  font-size: 24px;
  color: #18B7BE;
  /* border: 1px solid #18B7BE;
  border-radius: 10px; */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.prev {
  left: 0;
}

.next {
  right: 0;
}

.product {
  width: 800px;
  min-height: 650px;
}

.productInfo {
  border-bottom: 5px solid #18B7BE;
  width: 800px;
  min-height: 570px;
}

p.modify {
  margin-left: auto;
  margin-right: calc(1% + 70px);
  margin-top: 10px;
  width: 60px;
  padding: 8px 15px;
  background-color: #18b7be;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

p.modify:hover {
  background-color: #178ca4;
}

.productInfo span {
  margin-left: 5px;
  color: #ffffff;
  background-color: #178CA4;
  padding: 3px 5px;
  border-radius: 10px;
}

.productInfo span.rented {
  background-color: red;
}

.productInfo span.expired {
  background-color: #d1d1d1;
}

.userInfo {
  width: 800px;
  min-height: 80px;
  display: flex;
  align-items: center;
}

.userInfo span {
  color: #072A40;
  margin-right: 600px;
}

.userInfo button {
  background-color: #18B7BE;
  border-radius: 13px;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;

}

.reviewContainer {
  margin-bottom: 50px;
}

.reviewContainer p {
  width: 1300px;
  margin: 0 auto;
  border-top: 5px solid #18B7BE;
  padding: 20px 0;
  font-weight: bold;
  font-size: large;
}

.review {
  width: 1250px;
  margin: 0 auto;
  flex-direction: column;
}

.review .info {
  padding-top: 10px;
  display: flex;
  align-items: flex-end;
}

.review .writer {
  font-size: 14px;
  font-weight: bold;
  color: #072A40;
  vertical-align: bottom;
  margin-right: 5px;
}

.review .reviewDate {
  font-size: 12px;
  color: #d1d1d1;
  vertical-align: bottom;
}

.review .reviewContent {
  padding-bottom: 10px;
  font-size: 16px;
  color: #072A40;
  border-bottom: 1px solid #18B7BE;
}

.review:last-child .reviewContent {
  border-bottom: none;
}
</style>