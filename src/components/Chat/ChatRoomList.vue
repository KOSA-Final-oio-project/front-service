<template>
    <section class="section">
        <div class="container" v-cloak>
            <!-- 타이틀 -->
            <div class="row">
                <div class="chat-list-title">
                    <h3>채팅방 리스트</h3>
                </div>
            </div>

            <!-- 방 리스트 출력 -->
            <div class="input-and-list-container">
                <ul class="list-group">
                    <li
                        class="list-group-item list-group-item-action"
                        v-for="item in chatRooms"
                        :key="item.roomId"
                        @click="enterRoom(item.roomId)"
                    >
                        <div class="list-container">
                            <p class="chat-room-entry">
                                참여자: {{ item.receiver }} & {{ item.sender }}
                            </p>
                            <div class="flex-container">
                                <!-- 채팅방 제목 -->
                                <span class="chat-room-name">방제목: {{ item.roomName }}</span>

                                <!-- 채팅방 생성일자 -->
                                <span class="chat-room-date"
                                    >생성일자: {{ formatDate(item.createDate) }}</span
                                >
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            sender: '',
            name: '',
            chatRooms: []
        }
    },

    created() {
        this.sender = this.getUserNickname() // 현재 사용자의 닉네임 가져오기
        this.findRoomByNickname() // 해당 이메일의 채팅방 목록을 불러옴
        // this.findChatRoomInfo()
    },

    methods: {
        // email 가져오기
        getUserNickname() {
            this.sender = localStorage.getItem('nickname')
        },

        // 해당 이메일로 생성된 채팅방의 목록을 가져옴
        findRoomByNickname() {
            this.getUserNickname()

            alert('현재 닉네임은: ' + this.sender)

            axios
                .get('http://192.168.1.93:9712/chat/rooms/' + this.sender)
                .then((response) => {
                    this.chatRooms = response.data
                    console.log('response.data = ' + response.data) // 서버 응답 확인
                })
                .catch((error) => {
                    console.error('방을 찾는데 실패했습니다. 오류 원인은:', error)
                })
        },

        // 채팅방을 입장 - 특정 채팅방을 클릭하면 호출
        // 채팅방에서 사용할 이름 입력 요청 이후 입력된 이름 및 방 ID를 로컬 스토리지에 저장
        enterRoom(roomId) {
            console.log('>>>>>>>>>>>>>>> enterRoom called with roomId:', roomId)

            if (this.sender) {
                localStorage.setItem('wschat.sender', this.sender)
                localStorage.setItem('wschat.roomId', roomId)
            }

            alert('전달하는 url은 ' + 'http://192.168.1.93:9712/chat/roominfo/' + roomId)
            // API 호출하여 채팅방 정보 가져오기
            axios.get('http://192.168.1.93:9712/chat/roominfo/' + roomId).then((response) => {
                alert(this.roomId)
                console.log('&&&&&&&&&&&&&&&&&&&&&&&&&7 ' + response.data)
                localStorage.setItem(
                    'roomData',
                    JSON.stringify({
                        roomName: response.data.roomName,
                        createDate: response.data.createDate,
                        roomId: response.data.roomId,
                        productName: response.data.productName,
                        productPrice: response.data.productPrice,
                        receiver: response.data.receiver,
                        sender: response.data.sender,
                        prodnctNo: response.data.productNo
                    })
                )
            })

            this.$router.push({ name: 'ChatRoomEnter', params: { roomId, name } })
        },

        // 채팅방 생성 일자 날짜 형식을 변환
        formatDate(dateString) {
            // 날짜와 시간을 분리
            const datePart = dateString.substring(0, 10) // 년월일 분리
            const timePart = dateString.substring(10) // 시간 분리

            // 시간을 HH:MM:SS 형식으로 변환
            const timeFormatted = timePart.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3')

            // 날짜와 시간을 결합
            const dateTime = datePart + ' ' + timeFormatted

            // Date 객체 생성
            const date = new Date(dateTime)

            // 날짜 포매팅
            return (
                date.getFullYear() +
                '년 ' +
                (date.getMonth() + 1) +
                '월 ' +
                date.getDate() +
                '일 ' +
                (date.getHours() < 12 ? '오전 ' : '오후 ') +
                (date.getHours() % 12 || 12) +
                '시 ' +
                date.getMinutes() +
                '분'
            )
        }
    }
}
</script>

<style scoped>
/* ========= 폰트 설정 ========= */
@font-face {
    font-family: 'NotoSansKR-VariableFont_wght';
    src: url(/fonts/NotoSansKR-VariableFont_wght.ttf);
}

* {
    font-family: 'NotoSansKR-VariableFont_wght';
}

/* ========= v-cloak = 초기 렌더링 시에 잠시 숨겨진 상태로 표시될 요소들을 관리 ========= */
[v-cloak] {
    display: none;
}

section {
    padding-top: 200px;
    width: 100%;
    height: 100%;
}

/* 채팅방 리스트 타이틀 */
.chat-list-title {
    text-align: center;
    padding: 30px 0px 30px 0px;
}

/* 채팅방 개별 리스트 */
.list-group-item {
    margin-top: 20px;
    display: flex;
}

/* 채팅방 제목 & 생성 시간 flex 정렬 */
.flex-container {
    display: flex;
    justify-content: space-between; /* 아이템들을 양쪽으로 정렬 */
    width: 100%; /* 너비를 100%로 설정 */
}

/* 채팅방 이름 스타일 */
.chat-room-name {
    margin-right: 10px; /* 오른쪽 여백 추가 */
    white-space: nowrap;
}

/* 채팅방 생성 일자 스타일 */
.chat-room-date {
    flex-shrink: 0;
    margin-left: 10px; /* 필요한 경우 왼쪽 여백 추가 */
    white-space: nowrap;
}
</style>
