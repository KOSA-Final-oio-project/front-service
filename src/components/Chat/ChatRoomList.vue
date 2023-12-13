<template>
    <div class="container" v-cloak>
        <!-- 타이틀 -->
        <div class="row">
            <div class="chat-list-title">
                <h3>채팅방 리스트</h3>
            </div>
        </div>

        <!-- 방 생성과 방 리스트가 수직 정렬되도록 flex 컨테이너를 적용 -->
        <div class="input-and-list-container">
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
                    <!-- 채팅방 제목 -->
                    <span class="chat-room-name">{{ item.name }}</span>

                    <!-- 채팅방 생성일자 -->
                    생성일자:&nbsp;
                    <span class="chat-room-date">{{
                        formatDate(item.createDate)
                    }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            roomName: '',
            chatRooms: [],
        };
    },

    created() {
        // this.findAllRoom();
        // ---------------
        this.email = this.getCurrentUserEmail(); // 현재 사용자의 이메일 가져오기
        this.findRoomByEamil(); // 해당 이메일의 채팅방 목록을 불러옴
    },

    methods: {
        // 모든 채팅방의 목록 가져옴
        findAllRoom() {
            axios
                .get(this.$backURL + '/chat-service/chat/rooms')
                .then(response => {
                    this.chatRooms = response.data;
                    //역순 정렬 .reverse()
                    console.log(response.data); // 서버 응답 확인
                })
                .catch(error => {
                    console.error(
                        '방을 찾는데 실패했습니다. 오류 원인은: ',
                        error,
                    );
                });
        },

        // // email 가져오기
        getCurrentUserEmail() {
            return 'sengna@oio.com'; // 임시
        },

        // 해당 이메일로 생성된 채팅방의 목록을 가져옴
        findRoomByEamil() {
            // alert('현재 이메일은: ' + this.email);
            axios
                .get(this.$backURL + '/chat-service/chat/rooms/' + this.email)
                .then(response => {
                    this.chatRooms = response.data;
                    console.log(response.data); // 서버 응답 확인
                })
                .catch(error => {
                    console.error(
                        '방을 찾는데 실패했습니다. 오류 원인은:',
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
                .post(
                    this.$backURL + '/chat-service/chat/room/' + this.roomName,
                )
                .then(response => {
                    alert(
                        ' "' +
                            response.data.name +
                            '" 방 개설에 성공하였습니다.',
                    );

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

        // 채팅방 생성 일자 날짜 형식을 변환
        formatDate(dateString) {
            const date = new Date(dateString);

            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
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

/* 채팅방 개별 리스트 */
.list-group-item {
    margin-top: 20px;
    display: flex;
}

/* 채팅방 이름 스타일 */
.chat-room-name {
    flex-grow: 1; /* 왼쪽으로 정렬되도록 공간 차지 */
}

/* 채팅방 생성 일자 스타일 */
.chat-room-date {
    flex-shrink: 0; /* 오른쪽으로 정렬되도록 공간을 유지 */
}
</style>
