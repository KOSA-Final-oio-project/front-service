import { createRouter, createWebHistory } from 'vue-router';

import ChatRoom from '@/components/Chat/ChatRoom.vue';
import ChatRoomDetail from '@/components/Chat/ChatRoomDetail.vue';

const router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: '/chat', // ChatRoom 컴포넌트가 열리는 경로
            name: 'ChatRoom',
            component: ChatRoom,
        },
        {
            path: '/chat/room', // ChatRoomDetail 컴포넌트가 열리는 경로
            name: 'ChatRoomDetail',
            component: ChatRoomDetail,
        },
    ],
});

export default router;
