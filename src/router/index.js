import { createRouter, createWebHistory } from 'vue-router';

import ChatRoomList from '@/components/Chat/ChatRoomList.vue';
import ChatRoomDetail from '@/components/Chat/ChatRoomDetail.vue';
import SelectDatePopup from '@/components/Chat/SelectDatePopup.vue';
import TopView from '@/components/Main/TopView.vue';
import TopRental from '@/components/Main/TopRental.vue';


const router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: '/top-view',
            name: 'TopView',
            component: TopView
        },
        {
            path: '/top-rental',
            name: 'TopRental',
            component: TopRental
        },
        {
            path: '/chat-service/chat', // ChatRoomList 컴포넌트가 열리는 경로
            name: 'ChatRoomList',
            component: ChatRoomList,
        },
        {
            path: '/chat-service/chat/room/enter/:roomId', // ChatRoomDetail 컴포넌트가 열리는 경로
            name: 'ChatRoomEnter',
            component: ChatRoomDetail,
        },
        {
            path: '/chat-service/chat/date', // SelectDatePopup 컴포넌트가 열리는 경로
            name: 'SelectDatePopup',
            component: SelectDatePopup,
        },
    ],
});

export default router;
