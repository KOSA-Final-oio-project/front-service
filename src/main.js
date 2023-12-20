if (typeof global === 'undefined') {
    window.global = window
}
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

import 'bootstrap/dist/css/bootstrap.css'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Vue Router 사용
app.use(router)
// DatePicker 라이브러리 사용
app.component('VueDatePicker', VueDatePicker)
//fontawesome 라이브러리 사용
app.component('font-awesome-icon', FontAwesomeIcon)

// 전역변수 설정
app.config.globalProperties.$backURL = 'http://192.168.1.86:9797/oio/'

// 앱 마운트
app.mount('#app')
