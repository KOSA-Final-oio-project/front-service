<template>
    <div class="container" v-cloak>
        <!-- 채팅방 이름 -->
        <div class="chat-name">
            <h2>✉️ {{ room.name }} ✉️</h2>
        </div>

        <!-- 채팅 영역 -->
        <!-- 채팅 내역들 스크롤 가능하게 -->
        <div class="chat-main" ref="chatMain">
            <!-- 채팅 날짜 -->
            <div class="chat-header">{{ chatStartDate }}</div>

            <!-- 메시지 내역들 출력 -->
            <div class="messages-container">
                <!-- 메시지 리스트 그룹 -->
                <ul class="list-group">
                    <li
                        v-for="message in messages"
                        :key="message.id"
                        :class="{
                            'sent-container': message.sender === sender,
                            'received-container': message.sender !== sender,
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
                                received: message.sender !== sender,
                            }"
                        >
                            {{ message.message }}
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
            sendDate: '',
            messages: [],
        };
    },

    created() {
        localStorage.setItem('sender', '홍식시치');

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
                function () {
                    // 구독
                    ws.subscribe(
                        '/sub/chat/room/' + refer.roomId,
                        function (message) {
                            var receive = JSON.parse(message.body);
                            refer.receiveMessage(receive);
                        },
                    );

                    // 전송할 때 시간도 같이 보내기
                    const sendDate = new Date().toISOString();
                    // 전송
                    ws.send(
                        '/pub/chat/message',
                        JSON.stringify({
                            messageType: 'ENTER',
                            roomId: refer.roomId,
                            sender: refer.sender,
                            sendDate: sendDate,
                        }),
                    );
                },
                function (error) {
                    alert(error.message);
                },
            );

            refer.ws = ws;
        },

        // 메시지 발신
        sendMessage() {
            // 입력창 비어있으면 전송 X
            if (!this.message.trim()) {
                alert('내용을 입력해주세요.');
                return;
            }

            // 현재 시간을 ISO 형식으로 설정
            const sendDate = new Date().toISOString();

            this.ws.send(
                '/pub/chat/message',
                JSON.stringify({
                    messageType: 'TALK',
                    roomId: this.roomId,
                    sender: this.sender,
                    message: this.message,
                    sendDate: sendDate,
                }),
            );
            this.message = '';
        },

        // 메시지 수신
        receiveMessage(receive) {
            const formattedSendDate = this.formatTime(receive.sendDate);

            this.messages.push({
                messageType: receive.type,
                sender: receive.type == 'ENTER' ? '[알림]' : receive.sender,
                message: receive.message,
                sendDate: formattedSendDate,
            });

            // 스크롤바가 최신 메시지 따라갈 수 있도록
            this.$nextTick(() => {
                const chatContainer = this.$refs.chatMain;
                chatContainer.scrollTop = chatContainer.scrollHeight;
            });
        },

        // 시간 포매팅 함수
        formatTime(dateString) {
            const date = new Date(dateString);

            return date.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                // second: '2-digit',
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
