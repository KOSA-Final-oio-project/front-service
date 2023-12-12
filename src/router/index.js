import { createRouter, createWebHistory } from 'vue-router';

import ChatRoomList from '@/components/Chat/ChatRoomList.vue';
import ChatRoomDetail from '@/components/Chat/ChatRoomDetail.vue';
import SelectDatePopup from '@/components/Chat/SelectDatePopup.vue';
import TopSection from '@/components/Main/TopSection.vue';

const router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: '/main',
            name: 'TopSection',
            component: TopSection
        },
        {
            path: '/chat', // ChatRoomList 컴포넌트가 열리는 경로
            name: 'ChatRoomList',
            component: ChatRoomList,
        },
        {
            path: '/chat/room/enter/:roomId', // ChatRoomDetail 컴포넌트가 열리는 경로
            name: 'ChatRoomEnter',
            component: ChatRoomDetail,
        },
        {
            path: '/chat/date', // SelectDatePopup 컴포넌트가 열리는 경로
            name: 'SelectDatePopup',
            component: SelectDatePopup,
        },
    ],
});

export default router;
