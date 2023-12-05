<template>
    <div class="container" v-cloak>
        <!-- 채팅방 이름 -->
        <div>
            <h2>{{ room.name }}</h2>
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
            '>>>>>>>>>>>>>>>>>>>>>>>>>> ChatRoomDetail component created',
        );

        this.roomId = localStorage.getItem('wschat.roomId');
        this.sender = localStorage.getItem('wschat.sender');

        this.findRoom();
        this.connectWebSocket();
    },

    methods: {
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

        sendMessage() {
            this.ws.send(
                '/pub/chat/message',
                {},
                JSON.stringify({
                    type: 'TALK',
                    roomId: this.roomId,
                    sender: this.sender,
                    message: this.message,
                }),
            );
            this.message = '';
        },

        recvMessage(recv) {
            this.messages.unshift({
                type: recv.type,
                sender: recv.type == 'ENTER' ? '[알림]' : recv.sender,
                message: recv.message,
            });
        },

        connectWebSocket() {
            const vm = this;
            const sock = new SockJS(this.$backURL + '/ws-stomp');
            const ws = Stomp.over(sock);

            ws.connect(
                {},
                function (frame) {
                    ws.subscribe(
                        '/sub/chat/room/' + vm.roomId,
                        function (message) {
                            var recv = JSON.parse(message.body);
                            vm.recvMessage(recv);
                        },
                    );
                    ws.send(
                        '/pub/chat/message',
                        {},
                        JSON.stringify({
                            type: 'ENTER',
                            roomId: vm.roomId,
                            sender: vm.sender,
                        }),
                    );
                },
                function (error) {},
            );

            this.ws = ws;
        },
    },
};
</script>

<style scoped>
[v-cloak] {
    display: none;
}
</style>
