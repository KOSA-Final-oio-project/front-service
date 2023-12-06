<template>
    <div class="container" v-cloak>
        <!-- 채팅방 이름 -->
        <div class="chat-name">
            <h2>{{ room.name }}</h2>
        </div>

        <!-- 채팅 영역 -->
        <div class="chat-main" ref="chatMain">
            <!-- 채팅 날짜 -->
            <div class="chat-header">{{ chatStartDate }}</div>

            <!-- 채팅 내역들 스크롤 가능하게 -->
            <div class="messages-container">
                <ul class="list-group">
                    <!-- 메시지 내역들 출력 -->
                    <!-- 현재 채팅을 보내는 사람은 오른쪽으로 정렬할 수 있도록 (말풍선 위치 구분) -->
                    <li
                        v-for="message in messages"
                        :key="message.id"
                        :class="[
                            'list-group-item',
                            message.sender === sender ? 'sent' : 'received',
                        ]"
                    >
                        <!-- 메시지 내용 -->
                        <div class="message-content" ref="messageContent">
                            <div class="text">{{ message.message }}</div>
                            <div class="timestamp">{{ message.timestamp }}</div>
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
            />

            <!-- 전송 버튼 -->
            <div class="input-group-append">
                <button
                    class="btn btn-primary"
                    type="button"
                    @click="sendMessage"
                >
                    전송
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

export default {
    data() {
        return {
            roomId: '',
            room: {},
            sender: '',
            message: '',
            messages: [],
        };
    },

    created() {
        console.log(
            '>>>>>>>>>>>>>>>>>>>>>>>>>> ChatRoomDetail component created! :-)',
        );

        this.roomId = localStorage.getItem('wschat.roomId');
        this.sender = localStorage.getItem('wschat.sender');

        this.findRoom();
        this.connectWebSocket();
    },

    methods: {
        // 방 조회
        findRoom() {
            console.log(this.$backURL + '/chat/room/' + this.roomId);

            axios
                .get(this.$backURL + '/chat/room/' + this.roomId)
                .then(response => {
                    this.room = response.data;
                })
                .catch(error => {
                    alert(
                        '채팅방 조회에 실패했습니다. 오류 원인은: ' +
                            error.message,
                    );
                });
        },

        // 웹소켓 연결
        connectWebSocket() {
            const refer = this; // Vue 인스턴스 참조를 변수에 저장
            const sock = new SockJS(this.$backURL + '/ws-stomp');
            const ws = Stomp.over(sock, { protocols: ['v1.2'] }); // 버전 명시 안하면 deprecated 뜸 6-6... 안해도 되긴 하는데 말이쥐,,,

            ws.connect(
                {},
                function (frame) {
                    // 구독
                    ws.subscribe(
                        '/sub/chat/room/' + refer.roomId,
                        function (message) {
                            var receive = JSON.parse(message.body);
                            refer.receiveMessage(receive);
                        },
                    );
                    // 전송
                    ws.send(
                        '/pub/chat/message',
                        JSON.stringify({
                            messageType: 'ENTER',
                            roomId: refer.roomId,
                            sender: refer.sender,
                        }),
                    );
                },
                function (error) {
                    alert('엉엉엉엉엉ㅠㅠㅠㅠㅠㅠㅠㅠㅠ');
                },
            );

            refer.ws = ws;
        },

        // 메시지 발신
        sendMessage() {
            this.ws.send(
                '/pub/chat/message',
                JSON.stringify({
                    messageType: 'TALK',
                    roomId: this.roomId,
                    sender: this.sender,
                    message: this.message,
                }),
            );
            this.message = '';
        },

        // 메시지 수신
        receiveMessage(receive) {
            this.messages.push({
                messageType: receive.type,
                sender: receive.type == 'ENTER' ? '[알림]' : receive.sender,
                message: receive.message,
                timestamp: new Date().toLocaleTimeString(),
            });

            // 스크롤바가 최신 메시지 따라갈 수 있도록
            this.$nextTick(() => {
                const chatContainer = this.$refs.chatMain;
                chatContainer.scrollTop = chatContainer.scrollHeight;
            });
        },
    },
};
</script>

<style scoped>
/* 채팅 전체 영역 감싸는 div */
.container {
    height: 100vh; /* 높이 100% */
    display: flex; /* 내부 요소들을 수직정렬 */
    flex-direction: column; /* 내부 요소들을 수직정렬 */
    overflow: hidden; /* 컨테이너 밖으로 내용 못나감 */
}

/* 채팅방 제목 */
.chat-name {
    margin-top: 50px;
    margin-bottom: 30px;
    text-align: center;
    font-weight: bold;
}

/* 채팅창 공통 스타일 */
.list-group-item {
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    margin-bottom: 10px;
    max-width: 80%; /* 긴 메시지가 화면 안넘어가게 */
    word-wrap: break-word; /* 줄바꿈 - 단어 기준 */
    display: flex; /* 수평 중앙 정렬 */
    align-items: center; /* 수평 중앙 정렬 */
}

/* 현재 사용자가 보낸 메시지 */
.sent {
    background-color: #18b7be;
    margin-left: auto;
    margin-right: 0;
    justify-content: flex-end;
    font-weight: 500;
    color: #072a40;
}

/* 다른 사용자가 보낸 메시지 */
.received {
    background-color: #f9f7f0;
    margin-left: 0;
    margin-right: auto;
    justify-content: flex-start;
    font-weight: 500;
    color: #072a40;
}

/* 메시지 내용 */
.message-content {
    max-width: 100%;
}

/* 전송 버튼 */
.btn.btn-primary {
    background-color: #18b7be;
    border-color: #18b7be;
}

.chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

/* 채팅 시작 날짜 */
.chat-header {
    text-align: center;
    font-size: 1.2em;
}

.chat-main {
    overflow-y: auto;
    flex-grow: 1;
    margin-bottom: 60px;
}

.messages-container {
    flex-grow: 1;
}

.input-group {
    padding: 0 15px;
    margin-bottom: 30px;
    box-sizing: border-box;
}

/* 채팅 전송 시간 */
.timestamp {
    font-size: 0.75em;
    text-align: right;
}

.sender {
    font-weight: bold;
}

.text {
    margin: 5px 0;
}
</style>
