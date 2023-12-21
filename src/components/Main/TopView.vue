<template>
    <div class="topProduct">
        <router-link to="/top-view"
            ><div @click="getTopView()" class="view"><span>최다 조회수</span></div></router-link
        >
        <router-link to="/top-rental"
            ><div class="rent"><span>최다 대여수</span></div></router-link
        >

        <div class="top" v-for="(item, index) in topViews" :key="index">
            <div class="topImg">
                <span class="rented"> {{ item.status === 1 ? '대여중' : '미대여' }}</span>
                <img class="product-img" :src=item.thumbnail />
            </div>
            <p class="count">{{ item.view }}</p>
            <p class="title">{{ item.title }}</p>
            <p class="date">{{ formatDate(item.startDate) }} ~ {{ formatDate(item.endDate) }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            topViews: [],
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
        getTopView() {
            // const url = this.$backURL + 'product/productList/v'
            const url = 'http://192.168.1.86:9797/product-service/product/productList/v'

            axios.get(url).then((result) => {
                console.log(result)
                console.log(result.data.productList)
                this.topViews = result.data.productList
                this.thumbnail = result.data.productList.thumbnail
            })
        }
    },
    created() {
        this.getTopView()
    }
}
</script>

<style scoped>
section {
    margin-top: 150px;
}
body {
    margin: 0px;
    /* overflow-x: hidden; */
    /* position: relative; */
}

header {
    background-color: #18b7be;
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
    content: '';
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
    margin-top: 150px;
    background-color: #18b7be;
    display: flex;
    justify-content: center;
    position: relative;
}

.view {
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    position: absolute;
    top: 90%;
    right: 46%;
    transform: translate(-50%, -50%);
    height: 50px;
    width: 8%;
    background-color: #178ca4;
    border-top: 4px solid #ffffff;
    border-bottom: 4px solid #ffffff;
    border-left: 4px solid #ffffff;
    border-right: 2px solid #ffffff;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    color: #ffffff;
}

.rent {
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    position: absolute;
    top: 90%;
    left: 54%;
    transform: translate(-50%, -50%);
    height: 50px;
    width: 8%;
    background-color: #d1d1d1;
    border-top: 4px solid #ffffff;
    border-bottom: 4px solid #ffffff;
    border-right: 4px solid #ffffff;
    border-left: 2px solid #ffffff;
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
    border: 3px solid #178ca4;
    border-radius: 30px;
    color: #072a40;
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
    background-color: #072a40;
    border: 3px solid #072a40;
    border-radius: 20px;
    color: #ffffff;
}

.unrented {
    background-color: #178ca4;
    border: 3px solid #178ca4;
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
    font-size: 15px;
}

.count {
    font-size: 15px;
}

.searchBar {
    width: 50%;
    height: 50px;
    border-radius: 48px;
    border: 5px solid #178ca4;
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translate(-50%, -50%);
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
    margin: 50px 0px; /* 간격을 조절 */
}

.products {
    width: 1130px;
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
footer > p {
    margin-left: 10px;
}
</style>

