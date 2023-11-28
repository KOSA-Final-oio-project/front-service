import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/pages/Home.vue';
import Chats from '@/pages/Chats.vue';

const router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
        },
        {
            path: '/chats',
            name: 'Chats',
            component: Chats,
        },
    ],
});

export default router;
