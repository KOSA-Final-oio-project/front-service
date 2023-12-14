<template>
    <div>
        <!-- 채팅하기 버튼 -->
        <button @click="createRoom">채팅하기</button>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            productName: '',
            productPrice: '',
            receiver: '',
            email: '',
            roomName: ''
        }
    },

    methods: {
        getProductInfo() {
            this.productName = '감자'
            this.productPrice = '1000원'
        },

        getReceiverEmail() {
            this.receiver = 'chan@oio.com'
        },

        getUserEmail() {
            this.email = 'sengna@oio.com'
        },

        createRoom() {
            // 제품 정보, 수신자 이메일, 사용자 이메일 가져오기
            this.getProductInfo()
            this.getReceiverEmail()
            this.getUserEmail()

            // 채팅방 제목 입력
            const roomName = prompt('생성하실 채팅방의 제목을 입력해주세요.')

            // 채팅방 제목 입력 필수로
            if (!roomName) {
                alert('채팅방 제목을 입력해야 합니다.')
                return
            }
            console.log('입력된 채팅방 제목:', roomName)

            // 현재 날짜와 시간을 생성
            const createDate = new Date().toISOString()
            console.log('방 생성 시도 시간:', createDate)

            // 전송할 데이터 객체 생성
            const dataToSend = {
                roomName,
                createDate,
                productName: this.productName,
                productPrice: this.productPrice,
                receiver: this.receiver,
                email: this.email
            }
            console.log('전송할 데이터 객체 확인', dataToSend)

            // URL 경로에 데이터 포함
            const url = `${this.$backURL}/chat-service/chat/room/${encodeURIComponent(
                roomName
            )}/${encodeURIComponent(createDate)}/${encodeURIComponent(
                this.productName
            )}/${encodeURIComponent(this.productPrice)}/${encodeURIComponent(
                this.receiver
            )}/${encodeURIComponent(this.email)}`

            // 채팅방 생성 요청
            axios
                // requestBody로 보내면 CORS 오류 개쩔게남
                // .post(this.$backURL + '/chat-service/chat/room', dataToSend)
                .post(url)
                .then((response) => {
                    console.log('response.data: ', response.data)
                    alert(' "' + response.data.roomName + '" 방 개설에 성공하였습니다.')

                    // localStorage에 데이터 저장
                    localStorage.setItem(
                        'roomData',
                        JSON.stringify({
                            roomName: response.data.roomName,
                            createDate: response.data.createDate,
                            productName: this.productName,
                            productPrice: this.productPrice,
                            receiver: this.receiver,
                            email: this.email
                        })
                    )

                    // ChatRoomDetail로 라우팅
                    this.$router.push({
                        name: 'ChatRoomEnter',
                        params: { roomId: response.data.roomId }
                    })
                    // this.enterRoom(roomId) // 채팅방 입장 메소드 호출
                })
                .catch((error) => {
                    console.log('채팅방 개설에 실패하였습니다. 오류 원인은: ' + error.message)
                })
        }

        // enterRoom(roomId) {
        //     this.getUserEmail()

        //     console.log('입장할 채팅방 ID:', roomId)
        //     console.log('사용자 이메일:', this.email)

        //     if (this.email) {
        //         localStorage.setItem('wschat.sender', this.email)
        //         localStorage.setItem('wschat.roomId', roomId)

        //         this.$router.push({ name: 'ChatRoomEnter', params: { roomId: roomId } })
        //     } else {
        //         alert('사용자 이메일을 가져오는 데 실패했습니다.')
        //     }
        // }
    }
}
</script>

<style></style>
