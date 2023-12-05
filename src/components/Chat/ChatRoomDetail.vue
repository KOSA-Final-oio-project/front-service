<template>
    <div class="container" v-cloak>
        <!-- 채팅방 이름 -->
        <div>
            <h2>채팅방 이름: {{ room.name }}</h2>
        </div>

        <!-- 채팅 영역 -->
        <div class="input-group">
            <div class="input-group-prepend">
                <label class="input-group-text">내용</label>
            </div>

            <!-- 채팅 입력창 -->
            <input
                type="text"
                class="form-control"
                v-model="message"
                @keypress.enter="sendMessage"
            />

            <!-- 보내기 버튼 -->
            <div class="input-group-append">
                <button
                    class="btn btn-primary"
                    type="button"
                    @click="sendMessage"
                >
                    보내기
                </button>
            </div>
        </div>
        <ul class="list-group">
            <!-- 메시지 내역들 출력 -->
            <li
                class="list-group-item"
                v-for="message in messages"
                :key="message.id"
            >
                {{ message.sender }} - {{ message.message }}
            </li>
        </ul>
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

                            console.log(
                                '>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + receive,
                            );
                        },
                    );
                    // 전송
                    ws.send(
                        '/pub/chat/message',
                        // {},
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
                // {},
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
            this.messages.unshift({
                messageType: receive.type,
                sender: receive.type == 'ENTER' ? '[알림]' : receive.sender,
                message: receive.message,
            });
        },
    },
};
</script>

<style scoped>
[v-cloak] {
    display: none;
}
</style>
