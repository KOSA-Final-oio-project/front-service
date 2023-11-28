import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/pages/Home.vue';
// import ChatList from '@/pages/ChatList.vue'
// import Chats from '@/pages/Chats.vue'

const router = createRouter({
    history: createWebHistory(), // 라우팅 모드 설정
    // 라우터에 등록할 컴포넌트들
    routes: [
        { path: '/', component: Home },
        // { path: '/login', component: Login },
    ],
});

export default router;
