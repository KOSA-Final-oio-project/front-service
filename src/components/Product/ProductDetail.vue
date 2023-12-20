<template>
  <div class="container">
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
          <li>
            <a :href="getActionLink()" :class="{ 'report': status === 1 }">
              {{ status === 1 ? '신고' : '수정' }}
            </a>
          </li>
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
          <p class="content">{{ product.content }}</p>
        </div>

        <div class="userInfo">
          <span>{{ product.nickname }}</span>
          <button @click="createRoom">채팅하기</button>
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
        <div class="reviewContent">{{ review.content }}</div>
      </div>
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
      //상품 디테일
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

      ProductList: {
        productNo: '',
        nickname: '',
      },

      //채팅
      productName: '',
      productPrice: '',
      receiver: '',
      sender: '',
      roomName: ''
    };
  },

  props: {
    ProductList: {
      type: Object,
      default: null
    }
  },

  mounted() {
    this.getProductDetail();
    this.getReviews();
  },
  created() {
    this.ProductList.productNo = this.$route.params.id
    this.ProductList.nickname = localStorage.getItem('nickname')
  },

  methods: {
    //상품 디테일
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.productImages.length;
    },
    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.productImages.length) % this.productImages.length;
    },
    getProductDetail() {
      let nickname

      if (this.ProductList.nickname == null) {
        nickname = this.ProductList.ownerNickname;
      } else {
        nickname = this.ProductList.nickname;
      }

      console.log(nickname)

      const productNo = this.ProductList.productNo

      const url = this.$backURL + `product/productDetail/${productNo}/${nickname}`;

      axios.get(url)
        .then(response => {
          const data = response.data;
          this.product = data.product;
          this.productImgs = data.productImgs;
          const nickname = localStorage.getItem('nickname');

          if (response.data.product.nickname !== nickname) {
            this.status = 1;
          } else {
            this.status = 0;
          }

        })
        .catch(error => {
          console.error('상품 정보를 불러오는데 실패했습니다.', error);
        });
    },
    getReviews() {
      const productNo = this.ProductList.productNo
      const url = this.$backURL + `review/reviews/${productNo}`;

      axios.get(url)
        .then(response => {
          const data = response.data;
          console.log(data)
          this.reviews = data;
        })
        .catch(error => {
          console.error('리뷰를 불러오는데 실패했습니다.', error);
        });
    },
    formatDate(dateString) {
      const dateWithoutTime = dateString.split('T')[0];
      return dateWithoutTime;
    },
    getActionLink() {
      // status에 따라 다른 URL을 반환
      return this.status === 1 ? '신고 URL' : '수정 URL';
    },

    //채팅
    createRoom() {
      // 제품 정보, 수신자 닉네임, 사용자 닉네임 가져오기
      console.log(this.ProductList)
      const productNo = this.ProductList.productNo
      const productName = this.product.title
      const productPrice = this.product.price

      const receiver = this.product.nickname
    
      const sender = localStorage.getItem('nickname')

      // 채팅방 제목 입력
      const roomName = prompt('생성하실 채팅방의 제목을 입력해주세요. (20자 이내)')

      // 채팅방 제목 입력 필수로
      if (!roomName) {
        alert('채팅방 제목을 입력해주세요.')
        return
      } else if (roomName.length > 20) {
        alert('채팅방 제목은 20자를 초과할 수 없습니다.')
        return
      }
      console.log('입력된 채팅방 제목:', roomName)
      console.log(receiver)
      // 현재 날짜와 시간을 생성
      const createDate = new Date().toISOString()
      console.log('방 생성 시도 시간:', createDate)

      // 전송할 데이터 객체 생성
      const dataToSend = {
        roomName: roomName,
        createDate: createDate,
        productName: productName,
        productPrice: productPrice,
        receiver: receiver,
        sender: sender,
        productNo: productNo
      }
      console.log('전송할 데이터 객체 확인', dataToSend)

      // 파라미터로 보낼 데이터 생성
      const data = new URLSearchParams(dataToSend)

      // 채팅방 생성 요청
      axios
        .post(this.$backURL + 'chat-service/chat/room', data)
        .then((response) => {
          console.log('response.data: ', response.data)
          alert(' "' + response.data.roomName + '" 방 개설에 성공하였습니다.')

          // localStorage에 데이터 저장
          localStorage.setItem(
            'roomData',
            JSON.stringify({
              roomName: response.data.roomName,
              createDate: response.data.createDate,
              roomId: response.data.roomId,
              productName: this.product.title,
              productPrice: this.product.price,
              receiver: receiver,
              sender: sender,
              productNo: productNo
            })
          )

          localStorage.setItem('wschat.sender', sender)
          localStorage.setItem('wschat.roomId', response.data.roomId)

          // ChatRoomDetail로 라우팅
          this.$router.push({
            name: 'ChatRoomEnter',
            params: { roomId: response.data.roomId }
          })
        })
        .catch((error) => {
          console.log('채팅방 개설에 실패하였습니다. 오류 원인은: ' + error.message)
        })
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
  max-width: 450px;
  max-height: 550px;
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
  padding-left: 10px;
}

li {
  list-style-type: none;
}

.productInfo a {
  margin-left: 750px;
  padding-bottom: 5px;
  color: #178CA4;
  display: inline-block;
  vertical-align: middle;
  transform: perspective(1px) translateZ(0);
  -webkit-transition-property: color;
  transition-property: color;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
}

.productInfo a.report {
  color: red;
}

.productInfo a.report::before {
  background-color: red;
}

.productInfo a:before {
  content: "";
  position: absolute;
  z-index: -1;
  height: 1px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #178CA4;
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
  -webkit-transform-origin: 0 50%;
  transform-origin: 0 50%;
  -webkit-transition-property: transform;
  transition-property: transform;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
  -webkit-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
}

.productInfo a:hover:before,
.productInfo a:focus:before,
.productInfo a:active:before {
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
  -webkit-transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
  transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
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