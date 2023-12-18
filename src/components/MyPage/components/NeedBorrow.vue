<template>
    <div class="need-borrow-outer-container">
        <div class="need-borrow-container">
            <ul class="need-borrow-ul">
                <li v-for="item in data" :key="item.id" class="need-borrow-item">
                    <div class="left">
                        <img class="product-img" src="../../../assets/oio.png" />
                    </div>
                    <div class="right">
                        <p><img src="../../../assets/package.png" /> {{ item.title }}<br /></p>
                        <p>
                            <img src="../../../assets/calendar.png" />
                            {{ formatDate(item.startDate) }} ~ {{ formatDate(item.endDate) }}<br />
                        </p>
                        <p>
                            <img src="../../../assets/status.png" />
                            {{ getStatusText(item.status) }}
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'NeedRent',
    data() {
        return {
            data: []
        }
    },
    methods: {
        getBorrowProduct() {
            const nickname = localStorage.getItem('nickname')
            const url = `http://192.168.1.86:8889/product/myProduct/${nickname}/1`
            axios
                .get(url)
                .then((response) => {
                    console.log(response.data)
                    this.data = response.data
                })
                .catch((error) => {
                    console.log(error.data)
                })
        },
        getStatusText(status) {
            if (status === 0) {
                return '제의 가능'
            } else if (status === 1) {
                return '대여중'
            } else if (status === 2) {
                return '기간만료'
            } else {
                return '알 수 없음'
            }
        },

        formatDate(dateString) {
            const date = new Date(dateString)
            const formattedDate = date.toISOString().split('T')[0]
            return formattedDate
        }
    },

    mounted() {
        this.getBorrowProduct()
    }
}
</script>
<style scoped>
.need-borrow-outer-container {
    width: 100%;
    overflow-y: auto;
    max-height: 100%;
}

.need-borrow-container {
    width: calc(100% - 20px);
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
}

.need-borrow-ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.product-img {
    margin-top: 10px;
    width: 90px;
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

.need-borrow-item {
    display: flex;
    justify-content: space-between;
    width: 24%;
    margin-top: 20px;
    margin-left: 10px;
    /* margin-bottom: 35px; */
    list-style: none;
    border: 2px solid #18b7be;
    border-radius: 5px;
    padding: 10px;
}
</style>
