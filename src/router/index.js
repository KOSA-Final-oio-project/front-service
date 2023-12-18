import { createRouter, createWebHistory } from 'vue-router'

import Signup from '@/components/Member/Signup.vue'
import Login from '@/components/Member/Login.vue'
import ChatRoomList from '@/components/Chat/ChatRoomList.vue'
import ChatRoomDetail from '@/components/Chat/ChatRoomDetail.vue'
import SelectDatePopup from '@/components/Chat/SelectDatePopup.vue'
import TopView from '@/components/Main/TopView.vue'
import TopRental from '@/components/Main/TopRental.vue'
import AllProduct from '@/components/Main/AllProduct.vue'
import FindPassword from '@/components/Member/FindPassword.vue'
import MyPageMain from '@/components/MyPage/page/Main.vue'
import NeedRent from '@/components/MyPage/components/NeedRent.vue'
import NeedBorrow from '@/components/MyPage/components/NeedBorrow.vue'
import Receive from '@/components/MyPage/components/ReceiveReviewList.vue'
import Write from '@/components/MyPage/components/WriteReviewList.vue'
import Rent from '@/components/MyPage/components/RentedList.vue'
import Borrow from '@/components/MyPage/components/BorrowedList.vue'
import Location from '@/components/Member/Location.vue'

const router = createRouter({
    history: createWebHistory(),

    routes: [
        { path: '/', components: { default: TopView, TopRental, AllProduct } },
        { path: '/top-view', components: { default: TopView, AllProduct } },
        { path: '/top-rental', components: { default: TopRental, AllProduct } },
        { path: '/member-service/login', name: 'Login', component: Login },
        { path: '/member-service/signup', component: Signup },
        { path: '/chat-service/chat', component: ChatRoomList }, // ChatRoomList 컴포넌트가 열리는 경로
        { path: '/chat-service/chat/room/enter/:roomId', component: ChatRoomDetail }, // ChatRoomDetail 컴포넌트가 열리는 경로
        { path: '/chat-service/chat/date', component: SelectDatePopup }, // SelectDatePopup 컴포넌트가 열리는 경로
        { path: '/findPassword', component: FindPassword },
        {
            path: '/mypage',
            component: MyPageMain,
            children: [
                { path: 'needrent', component: NeedRent },
                { path: 'needborr', component: NeedBorrow },
                { path: 'receive', component: Receive },
                { path: 'write', component: Write },
                { path: 'rent', component: Rent },
                { path: 'borrow', component: Borrow }
            ]
        },
        { path: '/location', component: Location }
    ]
})

export default router
