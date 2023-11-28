// import 'bootstrap/dist/css/bootstrap.css'
import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';

import router from './router/index.js';

createApp(App).mount('#app');

const app = createApp(App);

//router에 등록된 컴포넌트들은 전역컴포넌트로 등록되기 때문에
// 앱 내부의 모든 컴포넌트에서 사용할 수 있습니다
app.use(router);

// 전역변수 선언
app.config.globalProperties.backURL = 'http://localhost:8761';

app.mount('#app');
