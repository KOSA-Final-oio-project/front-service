<template>
    <section>
        <!-- 채팅하기 버튼 -->
        <!-- 이미 채팅 내역 있는 앤지 아닌지 확인하기 -->
        <button class="chat-btn" @click="createRoom">채팅하기</button>
    </section>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            productName: '',
            productPrice: '',
            receiver: '',
            sender: '',
            roomName: ''
        }
    },

    methods: {
        getProductInfo() {
            this.productName = '감자'
            this.productPrice = '1000원'
            // this.productStatus = '대여대기'
        },

        getReceiverNickname() {
            // this.receiver = 'test1'
            // this.receiver = 'test2'
            this.receiver = 'test3'
            // this.receiver = 'test4'
            // this.receiver = 'test5'
            // this.receiver = 'sengna'
            // this.receiver = 'chan'
        },

        getUserNickname() {
            // this.sender = 'sengna'
            this.sender = 'chan'
            // this.sender = 'test1'
            // this.sender = 'test2'
            // this.sender = 'test3'
            // this.sender = 'test4'
            // this.sender = 'test5'
        },

        createRoom() {
            // 제품 정보, 수신자 닉네임, 사용자 닉네임 가져오기
            this.getProductInfo()
            this.getReceiverNickname()
            this.getUserNickname()

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

            // 현재 날짜와 시간을 생성
            const createDate = new Date().toISOString()
            console.log('방 생성 시도 시간:', createDate)

            // 전송할 데이터 객체 생성
            const dataToSend = {
                roomName: roomName,
                createDate: createDate,
                productName: this.productName,
                productPrice: this.productPrice,
                receiver: this.receiver,
                sender: this.sender
            }
            console.log('전송할 데이터 객체 확인', dataToSend)

            // 파라미터로 보낼 데이터 생성
            const data = new URLSearchParams(dataToSend)

            // 채팅방 생성 요청
            axios
                .post(this.$backURL + '/chat-service/chat/room', data)
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
                            productName: this.productName,
                            productPrice: this.productPrice,
                            receiver: this.receiver,
                            sender: this.sender
                        })
                    )

                    localStorage.setItem('wschat.sender', this.sender)
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
    }
}
</script>

<style scoped>
section {
    margin-top: 200px;
    height: 100%;
}

.chat-btn {
    width: 100px;
    height: 40px;
    border-radius: 30px;
    background-color: #178ca4;
    color: white;
    font-weight: bold;
    border: none;
    font-size: 15px;
}
</style>
