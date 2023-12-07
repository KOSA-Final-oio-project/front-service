<template>
    <div class="container" v-cloak>
        <!-- 타이틀 -->
        <div class="row">
            <div class="chat-list-title">
                <h3>채팅방 리스트</h3>
            </div>
        </div>

        <!-- 방 생성 -->
        <div class="input-group">
            <!-- 방제목 입력창 -->
            <input
                type="text"
                class="form-control"
                v-model="roomName"
                @keyup.enter="createRoom"
                placeholder="생성하실 채팅방의 제목을 입력해주세요."
            />
            <!-- 채팅방 개설 버튼 -->
            <div class="input-group-append">
                <button
                    class="btn btn-primary"
                    type="button"
                    @click="createRoom"
                >
                    채팅하기
                </button>
            </div>
        </div>

        <!-- 방 리스트 출력 -->
        <ul class="list-group">
            <li
                class="list-group-item list-group-item-action"
                v-for="item in chatRooms"
                :key="item.roomId"
                @click="enterRoom(item.roomId)"
            >
                <!-- {{ item.name }} -->
                {{ item.name }} - {{ formatDate(item.createdAt) }}
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            roomName: '',
            chatRooms: [],
        };
    },

    created() {
        this.findAllRoom();
    },

    methods: {
        // 모든 채팅방의 목록 가져옴
        findAllRoom() {
            axios
                .get(this.$backURL + '/chat/rooms')
                .then(response => {
                    this.chatRooms = response.data.reverse();
                })
                .catch(error => {
                    console.error(
                        '방을 찾는데 실패했습니다. 오류 원인은: ',
                        error,
                    );
                });
        },

        // 새 채팅방을 생성
        createRoom() {
            // 방 제목 입력 X
            if (!this.roomName) {
                alert('방 제목을 입력해 주십시요.');
                return;
            }

            alert('입력한 방 제목은: ' + this.roomName);

            axios
                .post(this.$backURL + '/chat/room/' + this.roomName)
                .then(response => {
                    alert(response.data.name + ' 방 개설에 성공하였습니다.');

                    this.roomName = '';
                    this.findAllRoom(); // 채팅방 목록 다시 불러옴
                })
                .catch(error => {
                    alert(
                        '채팅방 개설에 실패하였습니다. 오류 원인은: ' +
                            error.message,
                    );
                });
        },

        // 채팅방을 입장 - 특정 채팅방을 클릭하면 호출
        // 채팅방에서 사용할 이름 입력 요청 이후 입력된 이름 및 방 ID를 로컬 스토리지에 저장
        enterRoom(roomId) {
            const sender = prompt('대화명을 입력해 주세요.');

            // 대화명 입력해야만! => 나중에 JWT 토큰으로 받아와서 하기
            if (!sender) {
                alert('대화명을 입력해주세요!');
                return; // 함수 실행 종료
            } else {
                alert('입력한 대화명은: ' + sender + '입니다.');
            }

            console.log(
                '>>>>>>>>>>>>>>> enterRoom called with roomId:',
                roomId,
            );

            if (sender) {
                localStorage.setItem('wschat.sender', sender);
                localStorage.setItem('wschat.roomId', roomId);
            }

            this.$router.push({ name: 'ChatRoomEnter', params: { roomId } });
        },

        // 채팅방 생성 시각 표시
        formatDate(dateString) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
    },
};
</script>

<style scoped>
/* v-cloak = 초기 렌더링 시에 잠시 숨겨진 상태로 표시될 요소들을 관리 */
[v-cloak] {
    display: none;
}

/* 채팅방 리스트 타이틀 */
.chat-list-title {
    text-align: center;
    padding: 30px 0px 30px 0px;
}

.input-group {
    margin-bottom: 20px;
}
</style>
