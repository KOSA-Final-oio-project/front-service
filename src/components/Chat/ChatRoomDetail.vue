<!-- 셍나 해야할 것. 새로고침 안해도 바로바로 채팅 내역 끌고 와서 보여줄 수 있게 코드 수정ㅇ해야함
지금은 새로 고침해야지 보낸 내역이 보임. -->
<template>
    <div class="container" v-cloak>
        <div class="chat-header-container">
            <!-- 채팅방 이름 -->
            <div class="chat-name">
                <h2>✉️ {{ room.name }} ✉️</h2>
            </div>

            <!-- rentStartDate & rendEndDate  -->
            <!-- 2023-12-16 12:00 -->
            <div class="deal-start-btn">
                <button class="btn deal-start-btn" type="button" @click="openDateSelectionPopup">
                    거래하기
                </button>
            </div>
        </div>

        <div class="chat-product-container">
            <div class="product-img">사진</div>
            <div class="product-info">
                <p>상품명</p>
                <p>상품가격</p>
                <p>대여상태</p>
            </div>
        </div>

        <!-- 채팅 영역 -->
        <!-- 채팅 내역들 스크롤 가능하게 -->
        <div class="chat-main" ref="chatMain">
            <!-- 채팅 날짜 -->
            <!-- 아직 안함!!!!!!!!!!!!! -->
            <div class="chat-header">{{ chatStartDate }}</div>

            <!-- 메시지 내역들 출력 -->
            <div class="messages-container">
                <!-- 메시지 리스트 그룹 -->
                <ul class="list-group">
                    <li
                        v-for="message in filteredMessages"
                        :key="message.id"
                        :class="{
                            'sent-container': message.sender === sender,
                            'received-container': message.sender !== sender
                        }"
                    >
                        <!-- 보낸 메시지의 시간 -->
                        <div v-if="message.sender === sender" class="sendDate">
                            {{ message.sendDate }}
                        </div>

                        <!-- 메시지 말풍선 -->
                        <div
                            :class="{
                                'list-group-item': true,
                                sent: message.sender === sender,
                                received: message.sender !== sender
                            }"
                        >
                            {{ message.message }}
                        </div>

                        <!-- 읽음 표시 -->
                        <div class="read-sign">
                            1
                            <!-- {{ message.isRead }} -->
                        </div>

                        <!-- 받은 메시지의 시간 -->
                        <div v-if="message.sender !== sender" class="sendDate">
                            {{ message.sendDate }}
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 채팅 입력 영역 -->
        <div class="input-group">
            <!-- 채팅 입력창 -->
            <input
                type="text"
                class="form-control"
                v-model="message"
                @keypress.enter="sendMessage"
                placeholder="메시지를 입력해주세요."
            />

            <!-- 전송 버튼 -->
            <div class="input-group-append">
                <button class="btn btn-primary" type="button" @click="sendMessage">전송</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

export default {
    data() {
        return {
            roomId: '',
            room: {},
            roomName: '',
            email: '',
            sender: '',
            message: '',
            sendDate: '',
            messages: [],
            chatStartDate: ''
            // websocketConnectedAt: null // 웹소켓 연결 시간
        }
    },

    created() {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>> ChatRoomDetail component created! :-)')

        this.roomId = localStorage.getItem('wschat.roomId')
        this.sender = localStorage.getItem('wschat.sender')

        this.findRoom()
        this.findChatRoomLogs()
        this.connectWebSocket()
    },

    beforeUnmount() {
        window.removeEventListener('beforeunload', this.closeWebSocket)
        this.closeWebSocket()
    },

    computed: {
        filteredMessages() {
            return this.messages.filter(
                (m) => m.messageType !== 'ENTER' && m.messageType !== 'QUIT'
            )
        }
    },

    methods: {
        // 방 조회
        findRoom() {
            console.log(this.$backURL + '/chat-service/chat/room/' + this.roomId)

            axios
                .get(this.$backURL + '/chat-service/chat/room/' + this.roomId)
                .then((response) => {
                    this.room = response.data
                })
                .catch((error) => {
                    alert('채팅방 조회에 실패했습니다. 오류 원인은: ' + error.message)
                })
        },

        // 채팅방 로그 불러오기
        findChatRoomLogs() {
            axios
                .get(this.$backURL + '/chat-service/chat/room/enter/' + this.roomId)
                .then((response) => {
                    if (Array.isArray(response.data)) {
                        // 서버로부터 받은 데이터를 sendDate 기준으로 오름차순 정렬
                        const sortedMessages = response.data.sort((a, b) => {
                            return new Date(a.sendDate) - new Date(b.sendDate)
                        })

                        // 각 메시지의 sendDate를 포매팅
                        this.messages = sortedMessages.map((message) => {
                            return {
                                ...message,
                                sendDate: this.formatTime(message.sendDate)
                            }
                        })
                    }
                })
                .catch((error) => {
                    console.error('Failed to load chat logs: ', error)
                })
        },

        // 웹소켓 연결
        connectWebSocket() {
            const refer = this // Vue 인스턴스 참조를 변수에 저장
            const sock = new SockJS(this.$backURL + '/chat-service/ws-stomp')
            // const sock = new SockJS('http://localhost:57625' + '/chat-service/ws-stomp')
            const ws = Stomp.over(sock, { protocols: ['v1.2'] }) // 버전 명시 안하면 deprecated 뜸 6-6... 안해도 되긴 하는데 말이쥐,,,
            // const ws = Stomp.over(sock)

            // roomData 불러오기
            const roomData = JSON.parse(localStorage.getItem('roomData'))

            console.log(roomData)
            if (!roomData || !roomData.roomId) {
                console.error('채팅 내역이 존재하지 않습니다.')
                return
            }

            ws.connect(
                {},
                function () {
                    // 구독
                    ws.subscribe('/sub/chat/room/' + roomData.roomId, function (message) {
                        var receive = JSON.parse(message.body)
                        refer.receiveMessage(receive)
                    })

                    // 전송할 때 시간도 같이 보내기
                    const sendDate = new Date().toISOString()

                    ws.send(
                        '/pub/chat/message',
                        JSON.stringify({
                            messageType: 'ENTER',
                            roomId: roomData.roomId,
                            sender: refer.sender, // 웹소켓 열릴 때 sender로 설정
                            roomName: roomData.roomName,
                            sendDate: sendDate
                        })
                    )
                },
                function (error) {
                    alert(error.message)
                }
            )

            this.ws = ws
        },

        // 웹소켓 닫히는
        closeWebSocket() {
            const sendDate = new Date().toISOString()

            // QUIT 메시지 전송
            this.ws.send(
                '/pub/chat/message',
                JSON.stringify({
                    messageType: 'QUIT',
                    roomId: this.roomId,
                    sender: this.sender,
                    roomName: this.roomName,
                    sendDate: sendDate
                })
            )

            if (this.ws) {
                this.ws.disconnect()
            }
        },

        // 메시지 발신
        sendMessage() {
            // 입력창 비어있으면 전송 X
            if (!this.message.trim()) {
                alert('내용을 입력해주세요.')
                return
            }

            // 현재 시간을 ISO 형식으로 설정
            const sendDate = new Date().toISOString()

            this.ws.send(
                '/pub/chat/message',
                JSON.stringify({
                    messageType: 'TALK',
                    roomId: this.roomId,
                    sender: this.sender,
                    roomName: this.roomName,
                    message: this.message,
                    sendDate: sendDate
                })
            )

            // 입력 필드 초기화
            this.message = ''
        },

        // 메시지 수신
        receiveMessage(receive) {
            const formattedSendDate = this.formatTime(receive.sendDate)

            if (receive.messageType !== 'ENTER' && receive.messageType !== 'QUIT') {
                this.messages.push({
                    messageType: receive.type,
                    sender: receive.sender,
                    roomName: receive.name,
                    message: receive.message,
                    sendDate: formattedSendDate
                })
            }

            // 스크롤바가 최신 메시지 따라갈 수 있도록
            this.$nextTick(() => {
                const chatContainer = this.$refs.chatMain
                chatContainer.scrollTop = chatContainer.scrollHeight
            })
        },

        // 시간 포매팅 함수
        formatTime(dateString) {
            const date = new Date(dateString)
            return date
                .toLocaleTimeString('ko-KR', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                })
                .replace('오전', '오전 ')
                .replace('오후', '오후 ')
        },

        // 달력 뉴 팝업창
        openDateSelectionPopup() {
            // 팝업창 크기 설정
            const popupWidth = 500
            const popupHeight = 680
            // 팝업창 위치 설정
            const left = screen.width / 2 - popupWidth / 2
            const top = screen.height / 2 - popupHeight / 2

            // Datepicker 컴포넌트가 포함된 페이지로 팝업창 열기
            const popup = window.open(
                '/chat-service/chat/date', // Datepicker 컴포넌트가 있는 경로
                'DateSelectionPopup',
                `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
            )

            if (popup) {
                popup.focus()
            } else {
                alert('팝업창이 차단되었습니다. 팝업 차단을 해제해주세요.')
            }
        }
    },

    // 라우터 떠날 때 호출
    beforeRouteLeave(to, from, next) {
        if (to.path !== 'http://localhost:5173/chat-service/chat/date') {
            this.closeWebSocket()
        }
        next()
    }
}
</script>

<style scoped>
/* ========= 폰트 설정 ========= */
@font-face {
    font-family: 'NotoSansKR-VariableFont_wght';
    src: url(../../../public/fonts/NotoSansKR-VariableFont_wght.ttf);
}

* {
    font-family: 'NotoSansKR-VariableFont_wght';
}

/* ========= 채팅 전체 영역 ========= */
.container {
    height: 100vh; /* 높이 100% */
    display: flex; /* 내부 요소들을 수직정렬 */
    flex-direction: column; /* 내부 요소들을 수직정렬 */
    overflow: hidden; /* 컨테이너 밖으로 내용 못나감 */
}

/* ========= 채팅 헤더 영역 ========= */

.chat-header-container {
    display: flex;
    justify-content: space-between; /* 아이템들을 양쪽 끝에 배치 */
    align-items: center;
    width: 100%; /* 컨테이너의 전체 너비 */
}

/* 채팅방 제목 */
.chat-name {
    margin-top: 50px;
    margin-bottom: 30px;
    text-align: center;
    font-weight: bold;
    flex-grow: 1; /* 중앙에 위치하도록 공간 확장 */
}

/* 거래하기 버튼 */
.btn.deal-start-btn {
    color: white;
    font-weight: bold;
    border-radius: 30px;
    background-color: #178ca4;
    margin-right: 20px;
}

/* ========= 상품 정보 영역 ========= */

/* 상품 정보 */
.chat-product-container {
    border: solid black 1px;
    margin-bottom: 40px;
    width: 80%;
    /* max-width: 600px; */
    margin: 0 auto 40px; /* 위 아래 여백은 0, 좌우는 자동으로 설정하여 중앙 정렬 */
    border: solid black 1px;
    align-self: center; /* Flexbox 아이템을 가로 방향으로 중앙에 배치 */
}

/* ========= 채팅 영역 ========= */

/* 채팅창 말풍선 공통 스타일 */
.list-group-item {
    border: none;
    padding: 10px 20px;
    margin-bottom: 15px;
    word-wrap: break-word; /* 줄바꿈 - 단어 기준 */
}

/* 현재 사용자가 보낸 메시지 */
.sent {
    max-width: 70%; /* 긴 메시지가 화면 안넘어가게 */
    border-radius: 20px; /* 말풍선 상단 보더 */
    background-color: #18b7be;
    margin-left: auto;
    margin-right: 0;
    justify-content: flex-end;
    font-weight: 500;
    color: #072a40;
    order: 2; /* 말풍선을 오른쪽으로 정렬 (flex 컨테이너 내에서) */
    margin-left: 10px; /* 시간과 메시지 사이 간격 */
}

/* 메시지 아이템을 감싸는 컨테이너 */
.sent-container {
    border-radius: 20px; /* 말풍선 하단 보더만 맞춰짐.. 머지 */
    display: flex; /* 내부 아이템들을 수평으로 정렬 */
    align-items: center; /* 아이템들을 수직 중앙에 정렬 */
    justify-content: flex-end; /* 오른쪽 정렬 */
}

/* 다른 사용자가 보낸 메시지 */
.received {
    border-radius: 20px; /* 말풍선 상단 보더 */
    background-color: #f9f7f0; /* 받은 메시지 말풍선 색상 */
    margin-right: 10px; /* 시간과 메시지 사이 간격 */
    border-radius: 18px; /* 둥근 모서리 */
}

/* 받은 메시지 컨테이너 */
.received-container {
    max-width: 70%; /* 긴 메시지가 화면 안넘어가게 */
    border-radius: 20px; /* 말풍선 하단 보더만 맞춰짐.. 머지 */
    display: flex;
    align-items: center; /* 시간과 말풍선을 수직 중앙 정렬 */
    justify-content: flex-start; /* 왼쪽 정렬 */
    margin-bottom: 10px; /* 수신 & 발신 메시지 간 간격 */
}

/* 메시지 내용 */
.message-content {
    display: flex; /* 수평 정렬을 위해 flex 컨테이너로 설정 */
    justify-content: space-between; /* 메시지와 시간 사이에 공간을 최대한 배분 */
    align-items: center; /* 수직 중앙 정렬 */
    max-width: 100%;
}

/* 채팅 시작 날짜 */
.chat-header {
    text-align: center;
    font-size: 1.2em;
}

/* 채팅 메시지가 실제로 표시되는 영역 div */
/* 채팅 메시지만 */
.chat-main {
    overflow-y: auto; /* 스크롤 가능하게 설정 */
    flex-grow: 1;
    margin-bottom: 60px;
}

/* 채팅 메시지 리스트를 감싸는 컨테이너 */
.messages-container {
    /* 스크롤바랑 간격 띄우려고 */
    padding-right: 25px;
    /* 가능한 모든 공간을 차지하도록 설정 */
    flex-grow: 1;
}

/* 채팅 읽음 표시 */
.read-sign {
}

/* 채팅 전송 시간 */
.sendDate {
    margin-top: auto;
    margin-bottom: 15px;
    /* 시간을 한 줄로 표시 */
    white-space: nowrap;
    font-size: 0.75em;
}

/* 텍스트 기본 스타일 */
.text {
    margin-left: auto; /* 메시지 내용을 왼쪽으로 밀기 */
    margin: 5px 0;
}

/* ========= 입력창 영역 ========= */

/* 입력창 */
.input-group {
    padding: 0 15px;
    margin-bottom: 30px;
    box-sizing: border-box;
}

/* 전송 버튼 */
.btn.btn-primary {
    background-color: #178ca4;
    border-color: #178ca4;
}
</style>
