if (typeof global === 'undefined') {
    window.global = window;
}

import 'bootstrap/dist/css/bootstrap.css';
// import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';

const app = createApp(App);

// Vue Router 사용
app.use(router);

// 전역변수 설정
app.config.globalProperties.$backURL = 'http://localhost:9797/chat-service';

// 앱 마운트
app.mount('#app');
