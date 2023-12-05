import { createRouter, createWebHistory } from 'vue-router';

import ChatRoomList from '@/components/Chat/ChatRoomList.vue';
import ChatRoomDetail from '@/components/Chat/ChatRoomDetail.vue';

const router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: '/chat', // ChatRoomList 컴포넌트가 열리는 경로
            name: 'ChatRoomList',
            component: ChatRoomList,
        },
        // {
        //     path: '/chat/room',
        //     name: 'ChatRoomDetail',
        //     component: ChatRoomDetail,
        // },
        {
            path: '/chat/room/enter/:roomId',
            name: 'ChatRoomEnter',
            component: ChatRoomDetail,
        },
    ],
});

export default router;
