<template>
    <!-- 타이틀 -->
    <div class="title">거래하기</div>

    <!-- info -->
    <div class="info-container">
        <p class="info">※ 1. 거래 시작날짜와 시간을 선택해주세요. ※</p>
        <p class="info">※ 2. 거래 종료날짜와 시간을 선택해주세요. ※</p>
        <p class="info">※ 3. 대여시작 버튼을 클릭하면 대여가 시작됩니다. ※</p>
    </div>

    <!-- 달력 -->
    <div class="date-pick-container">
        <VueDatePicker
            class="date-pick"
            v-model="date"
            :config="datePickerConfig"
            :min-date="minDate"
            inline
            range
            auto-apply
        />
    </div>

    <!-- 시작&종료 날짜 및 시간 확인용 -->
    <div class="selected-info">
        <span class="selected-start">시작: {{ rentStartDate }}</span>
        <span class="tilde">~</span>
        <span class="selected-end">종료: {{ rentEndDate }}</span>
    </div>

    <!-- 대여시작 버튼 -->
    <div class="button-container">
        <button class="start-btn" type="submit" @click="startRent">대여시작</button>
    </div>
</template>

<script>
import axios from 'axios'
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    components: {
        VueDatePicker
    },

    data() {
        return {
            date: [new Date(), null],
            minDate: new Date(),
            datePickerConfig: {},
            message: ''
        }
    },

    computed: {
        rentStartDate() {
            return this.formatDate(this.date[0])
        },
        rentEndDate() {
            return this.formatDate(this.date[1])
        }
    },

    methods: {
        // 프론트에서 보여줄 데이터 포매팅
        formatDate(dateValue) {
            if (!dateValue) return '날짜를 선택해주세요'
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }
            return new Date(dateValue).toLocaleDateString('ko-KR', options)
        },

        // {
        //     "ownerNickname" : "아무개",
        //     "borrowerNickname" : "김학윤",
        //     "rentStartDate" : "2023-12-12 11:00",
        //     "rentEndDate" : "2023-12-15 12:00"
        // }

        // 백엔드로 보낼 데이터 포매팅
        formatDateForRent(dateValue) {
            if (!dateValue) return ''
            const date = new Date(dateValue)

            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')

            return `${year}-${month}-${day} ${hours}:${minutes}`
        },

        // 거래 시작 메서드
        startRent() {

            const roomDataJson = JSON.parse(localStorage.getItem('roomData'))
            console.log(roomDataJson)

            // 날짜 데이터 포맷팅 (YYYY-MM-DD HH:mm 형식)
            const rentStartDate = this.formatDateForRent(this.date[0])
            const rentEndDate = this.formatDateForRent(this.date[1])

            console.log(rentStartDate)
            console.log(rentEndDate)

            // 대여자 및 소유자 닉네임 임시로
            const ownerNickname = roomDataJson.receiver
            const borrowerNickname = roomDataJson.sender

            // 백엔드로 전송할 데이터 구성
            const rentData = {
                ownerNickname,
                borrowerNickname,
                rentStartDate,
                rentEndDate
            }
            const productNo = roomDataJson.productNo

            console.log(productNo)

            // 백엔드로 데이터 전송
            axios
                .post(this.$backURL + `${productNo}`, rentData)
                .then(response => {
                    // 성공시 로직
                    console.log('거래 시작 데이터 전송 성공:', response);
                })
                .catch(error => {
                    // 실패시 로직
                    console.error('거래 시작 데이터 전송 실패:', error);
                });

            // -------------------------------------------------------------------

            // 웹소켓 연결
            const refer = this // Vue 인스턴스의 this를 변수에 저장
            const sock = new SockJS('http://192.168.1.93:9712/ws-stomp')
            const ws = Stomp.over(sock, { protocols: ['v1.2'] }) // 버전 명시 안하면 deprecated 뜸 6-6... 안해도 되긴 하는데 말이쥐,,,

            this.roomId = localStorage.getItem('wschat.roomId')
            this.sender = localStorage.getItem('wschat.sender')
            const sender = this.sender
            const message = this.message

            const roomData = JSON.parse(localStorage.getItem('roomData'))

            if (roomData) {
                this.roomId = roomData.roomId
                this.roomName = roomData.roomName
                this.productName = roomData.productName
                this.productPrice = roomData.productPrice
            }

            alert(rentData.rentStartDate + ' + ' + rentData.rentEndDate)

            ws.connect({}, function () {
                // 전송할 때 시간도 같이 보내기
                const sendDate = new Date().toISOString()

                ws.send(
                    '/pub/chat/message',
                    JSON.stringify({
                        messageType: 'ALERT',
                        roomId: roomData.roomId,
                        sender: sender, // 웹소켓 열릴 때 sender로 설정
                        roomName: roomData.roomName,
                        productName: roomData.productName,
                        productPrice: roomData.productPrice,
                        sendDate: sendDate,
                        message: message,
                        rentStartDate: rentData.rentStartDate,
                        rentEndDate: rentData.rentEndDate
                    })
                )

                // refer.closePopup()
            })
        },
        closePopup() {
            window.close() // 현재 팝업 창 닫기
        }
    }
}
</script>

<style scoped>
@font-face {
    font-family: 'NotoSansKR-VariableFont_wght';
    src: url(../../../public/fonts/NotoSansKR-VariableFont_wght.ttf);
}

* {
    font-family: 'NotoSansKR-VariableFont_wght';
}

section {
    padding-top: 150px;
}

/* 거래하기 타이틀 */
.title {
    font-size: 25px;
    text-align: center;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 30px;
}

/* 인포들 컨테이너 */
.info-container {
    text-align: center;
    margin-bottom: 25px;
}

/* 인포 세부 설정 */
.info {
    font-weight: bold;
    font-size: 17px;
    margin-bottom: 0.5rem;
}

/* 달력 컨테이너 */
.date-pick-container {
    text-align: center;
}

/* 달력 크기 */
.date-pick {
    display: inline-block;
    margin: auto;
    width: 450px;
    /* width: auto; */
    margin-bottom: 20px;
}

/* 날짜 정보 */
.selected-info {
    text-align: center;
    margin-top: 5px;
}

/* 시작 ~ 종료 사이 물결 */
.tilde {
    margin: 10px;
}

/* 시작&종료 시간 및 날짜 표시 */
.selected-start,
.selected-end {
    font-weight: bold;
}

/* 버튼 영역 */
.button-container {
    margin-top: 30px;
    text-align: center;
}

/* 버튼 */
.start-btn {
    color: white;
    font-weight: 800;
    background-color: #18b7be;
    border-radius: 30px;
    padding: 10px 20px;
    transition:
        background-color 0.3s,
        transform 0.2s;
    cursor: pointer;
    border: none;
    outline: none;
}

/* 버튼 호버 */
.start-btn:hover {
    color: white;
    border-radius: 30px;
    background-color: #178ca4; /* 호버 시 배경색 변경 */
}

.start-btn:active {
    transform: translateY(2px);
}

.start-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px #aaa;
}
</style>
