<template lang="">
    <section>
            <div class="productContainer">
            
                <div class="dropdown">
                    <select name="region siDo">
                        <option value="">전체</option>
                        <option value="">서울</option>
                        <option value="">부산</option>
                    </select>
                    <select name="region siGunGu">
                        <option value="">전체</option>
                        <option value="">강남구</option>
                        <option value="">강서구</option>
                    </select>
                    <select name="region eupMyeonRo">
                        <option value="">전체</option>
                        <option value="">당산동</option>
                        <option value="">역삼동</option>
                    </select>
                    <button @click='get()' class="selectBt">
                        조회
                    </button>
                </div>
                <div class="productList">
                    <div class="products">
                        <div class="product">
                            <div class="productImg">
                                <span class="rented">대여중</span>
                                <img src="src/assets/oio.png">
                            </div>
                            <p class="title">노트북 빌려드림</p>
                            <p class="date">2023-10-11 ~ 2024-10-13</p>
                        </div>
                        <div class="product">
                            <div class="productImg">
                                <span class="rented">대여중</span>
                                <img src="src/assets/oio.png">
                            </div>
                            <p class="title">노트북 빌려드림</p>
                            <p class="date">2023-10-11 ~ 2024-10-13</p>
                        </div>
                        <div class="product">
                            <div class="productImg">
                                <span class="rented">대여중</span>
                                <img src="src/assets/oio.png">
                            </div>
                            <p class="title">노트북 빌려드림</p>
                            <p class="date">2023-10-11 ~ 2024-10-13</p>
                        </div>
                        <div class="product">
                            <div class="productImg">
                                <span class="rented">대여중</span>
                                <img src="src/assets/oio.png">
                            </div>
                            <p class="title">노트북 빌려드림</p>
                            <p class="date">2023-10-11 ~ 2024-10-13</p>
                        </div>
                        <div class="product">
                            <div class="productImg">
                                <span class="rented">대여중</span>
                                <img src="src/assets/oio.png">
                            </div>
                            <p class="title">노트북 빌려드림</p>
                            <p class="date">2023-10-11 ~ 2024-10-13</p>
                        </div>
                        <div class="product">
                            <div class="productImg">
                                <span class="rented">대여중</span>
                                <img src="src/assets/oio.png">
                            </div>
                            <p class="title">노트북 빌려드림</p>
                            <p class="date">2023-10-11 ~ 2024-10-13</p>
                        </div>
                    </div>
                </div>

            </div>

        </section>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return{

        };
    },
    methods: {
    get() {
      axios
        .get(`https://localhost:9999/oio/productList`)
        .then((result) => {
          console.log(result.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          console.log("finally");
        });
    },
  },
}
</script>
<style scoped>
    .section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding: 20px;
  border-top: 1px solid #ccc;
}
body {
    margin: 0px;
    /* overflow-x: hidden; */
    /* position: relative; */
}

header {
    background-color: #18B7BE;
}

ul {
    margin: 0px;
}

li {
    list-style-type: none;
}

a {
    text-decoration: none;
}


.container {
    /* font-size: 2em; */
    padding-top: 10px;
    padding-left: 10px;
    display: flex;
}

.container img {
    /* padding-left: 1px; */
    height: 50px;
}

.container a {
    font-size: 30px;
    height: 50px;
    /* font-weight: bold; */
    color: #ffffff;

}

.menu {
    display: flex;
    padding: 0;
    position: absolute;
    right: 0;
}

.menu img {
    height: 40px;
}

.menu li:not(:last-child) {
    margin-right: 10px;
}

.menu a {
    display: inline-block;
    vertical-align: middle;
    /* -webkit-transform: perspective(1px) translateZ(0); */
    transform: perspective(1px) translateZ(0);
    /* position: relative; */
    -webkit-transition-property: color;
    transition-property: color;
    -webkit-transition-duration: 0.5s;
    transition-duration: 0.5s;
}

.menu a:before {
    content: "";
    position: absolute;
    z-index: -1;
    height: 3px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff;
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

.menu a:hover:before,
.menu a:focus:before,
.menu a:active:before {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
    -webkit-transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
    transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
}

.topProduct {
    background-color: #18B7BE;
    display: flex;
    justify-content: center;
    position: relative;
}

.view {
    outline: none;
    position: absolute;
    top: 85%;
    left: 47.9%;
    transform: translate(-50%, -50%);
    height: 50px;
    width: 80px;
    background-color: #178CA4;
    border-top:4px solid #ffffff;
    border-bottom:4px solid #ffffff;
    border-left:4px solid #ffffff;
    border-right:2px solid #ffffff;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    color: #ffffff;
}

.rent {
    outline: none;
    position: absolute;
    top: 85%;
    left: 52.1%;
    transform: translate(-50%, -50%);
    height: 50px;
    width: 80px;
    background-color: #D1D1D1;
    border-top:4px solid #ffffff;
    border-bottom:4px solid #ffffff;
    border-right:4px solid #ffffff;
    border-left:2px solid #ffffff;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    color: #ffffff;
}

.crown {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 60px;
    width: 80px;
}

.top {
    flex-basis: 250px;
    text-align: center;
    margin: 120px 50px;
    background-color: #ffffff;
    border: 3px solid #178CA4;
    border-radius: 30px;
    color: #072A40;
}

.top span {
    position: absolute;
    right: 0;
}

.topImg {
    margin-top: 20px;
    position: relative;
    height: 200px;
    width: 200px;
    display: inline-block;
}

.rented {   
    background-color: #072A40;
    border: 3px solid #072A40;
    border-radius: 20px;
    color: #ffffff;
}

.unrented {
    background-color: #178CA4;
    border: 3px solid #178CA4;
    border-radius: 20px;
    color: #ffffff;
}

.top img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
}

.top p {
    margin: 3px;
}

.top p:last-child {
    margin-bottom: 20px;
}

.title {
    font-weight: bold;
    font-size: 20px;
}

.date {
    font-size:15px;
}

.count {
    font-size:15px;
}

.searchBar {
    width: 50%;
    height: 50px;
    border-radius: 48px;
    border: 5px solid #178CA4;
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.productContainer {
    position:relative;
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
    margin: 50px 0px; /* 간격을 조절 */
}

.products {
    width:1130px;
    /* display: flex; */
    justify-content: center;
    /* position: relative; */
    flex-wrap: wrap;
    gap: 20px; /* 간격을 조절 */
}

.product {
    display: inline-block;
    width: 250px;
    height: 270px;
    flex-basis: 200px;
    text-align: center;
    margin: 20px 10px;
    background-color: #ffffff;
    border: 3px solid #178CA4;
    border-radius: 30px;
    color: #072A40;
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

footer{
    width: 100%;
    height: 50px;
    display: flex;
    background-color : #072A40;
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