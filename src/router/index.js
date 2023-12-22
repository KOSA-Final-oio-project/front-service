import { createRouter, createWebHistory } from 'vue-router'

//MAIN
import TopView from '@/components/Main/TopView.vue'
import TopRental from '@/components/Main/TopRental.vue'
import AllProduct from '@/components/Main/AllProduct.vue'

//USER
import Signup from '@/components/Member/Signup.vue'
import Login from '@/components/Member/Login.vue'
import FindPassword from '@/components/Member/FindPassword.vue'
import FindId from '@/components/Member/FindId.vue'
import ModifyUser from '@/components/Member/ModifyUser.vue'

//USER-INFO
import UserInfoMain from '@/components/UserInfo/page/UserInfoMain.vue'
import UserInfoNeedRent from '@/components/UserInfo/components/NeedRent.vue'
import UserInfoNeedBorrow from '@/components/UserInfo/components/NeedBorrow.vue'
import UserInfoReceive from '@/components/UserInfo/components/ReceiveReviewList.vue'
import UserInfoBorrow from '@/components/UserInfo/components/BorrowedList.vue'
import UserInfoRent from '@/components/UserInfo/components/RentedList.vue'

//CHAT
import ChatRoomList from '@/components/Chat/ChatRoomList.vue'
import ChatRoomDetail from '@/components/Chat/ChatRoomDetail.vue'
import SelectDatePopup from '@/components/Chat/SelectDatePopup.vue'

//MYPAGE
import MyPageMain from '@/components/MyPage/page/Main.vue'
import NeedRent from '@/components/MyPage/components/NeedRent.vue'
import NeedBorrow from '@/components/MyPage/components/NeedBorrow.vue'
import Receive from '@/components/MyPage/components/ReceiveReviewList.vue'
import Write from '@/components/MyPage/components/WriteReviewList.vue'
import Rent from '@/components/MyPage/components/RentedList.vue'
import Borrow from '@/components/MyPage/components/BorrowedList.vue'

//PRODUCT
import ProductDetail from '@/components/Product/ProductDetail.vue'
import ProductList from '@/components/Product/ProductList.vue'
import SearchProduct from '@/components/Product/SearchProduct.vue'
import WriteProduct from '@/components/Product/WriteProduct.vue'
import ModifyProduct from '@/components/Product/ModifyProduct.vue'

//POST
import MainPost from '@/components/Post/MainPost.vue'
import PostList from '@/components/Post/PostList.vue'
import PostView from '@/components/Post/PostView.vue'
import PostRegister from '@/components/Post/PostRegister.vue'
import PostModify from '@/components/Post/PostModify.vue'

//ADMIN
import AdminList from '@/components/ADMIN/AdminList.vue'
import AdminView from '@/components/ADMIN/AdminView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    { path: '/', components: { default: TopView, TopRental, AllProduct } },
    { path: '/top-view', components: { default: TopView, AllProduct } },
    { path: '/top-rental', components: { default: TopRental, AllProduct } },
    { path: '/member/login', name: 'Login', component: Login },
    { path: '/member/signup', component: Signup },
    { path: '/findPassword', component: FindPassword },
    {
      path: '/chat', // ChatRoomList 컴포넌트가 열리는 경로
      name: 'ChatRoomList',
      component: ChatRoomList,
      beforeEnter: (to, from, next) => {
        const loggedIn = localStorage.getItem('nickname');
        if (!loggedIn) {
          alert('로그인 후 이용 가능합니다.');
          // 로그인되지 않은 경우 다른 경로로 리디렉션 또는 기타 작업 수행 가능
          next('/');
        } else {
          next(); // 로그인되어 있으면 다음 라우트로 이동
        }
      }
    },
    {
      path: '/chat/room/enter/:roomId', // ChatRoomDetail 컴포넌트가 열리는 경로
      name: 'ChatRoomEnter',
      component: ChatRoomDetail,
      props: true
    },
    {
      path: '/chat/date', // SelectDatePopup 컴포넌트가 열리는 경로
      name: 'SelectDatePopup',
      component: SelectDatePopup,
      meta: { hideHeader: true, hideFooter: true }
    },
    {
      path: '/mypage',
      component: MyPageMain,
      children: [
        { path: '', component: ModifyUser },
        { path: 'needrent', component: NeedRent },
        { path: 'needborr', component: NeedBorrow },
        { path: 'receive', component: Receive },
        { path: 'write', component: Write },
        { path: 'rent', component: Rent },
        { path: 'borrow', component: Borrow },
        { path: 'modify', component: ModifyUser }
      ]
    },
    {
      path: '/userinfo',
      component: UserInfoMain,
      children: [
        { path: 'needrent', component: UserInfoNeedRent },
        { path: 'needborr', component: UserInfoNeedBorrow },
        { path: 'receive', component: UserInfoReceive },
        { path: 'borrow', component: UserInfoBorrow },
        { path: 'rent', component: UserInfoRent }
      ]
    },
    {
      path: '/product/productDetail/:id', component: ProductDetail, beforeEnter: (to, from, next) => {
        const loggedIn = localStorage.getItem('nickname');
        if (!loggedIn) {
          alert('로그인 후 이용 가능합니다.');
          next('/');
        } else {
          next();
        }
      }
    },
    {
      path: '/product/productList', component: ProductList, beforeEnter: (to, from, next) => {
        const loggedIn = localStorage.getItem('nickname');
        if (!loggedIn) {
          alert('로그인 후 이용 가능합니다.');
          next('/');
        } else {
          next();
        }
      }
    },
    {
      path: '/product/searchProduct/:searchWord', component: SearchProduct,
    },
    { path: '/product/writeProduct', component: WriteProduct },
    { path: '/product/modifyProduct/:id', component: ModifyProduct },
    {
      path: '/product/productDetail/:id?/:ni?',
      component: ProductDetail,
      beforeEnter: (to, from, next) => {
        const loggedIn = localStorage.getItem('nickname');
        if (!loggedIn) {
          alert('로그인 후 이용 가능합니다.');
          // 로그인되지 않은 경우 다른 경로로 리디렉션 또는 기타 작업 수행 가능
          next('/');
        } else {
          next(); // 로그인되어 있으면 다음 라우트로 이동
        }
      }
    },
    {
      path: '/post',
      component: MainPost,
      children: [
        {
          path: 'list/:id', component: PostList,
          beforeEnter: (to, from, next) => {
            const loggedIn = localStorage.getItem('nickname');
            if (!loggedIn) {
              alert('로그인 후 이용 가능합니다.');
              // 로그인되지 않은 경우 다른 경로로 리디렉션 또는 기타 작업 수행 가능
              next('/');
            } else {
              next(); // 로그인되어 있으면 다음 라우트로 이동
            }
          }
        },
        { path: 'view/:id', component: PostView },
        { path: 'modify/:id', component: PostModify },
        { path: 'register', component: PostRegister }
      ]
    },

    { path: '/admin', component: AdminList },
    { path: '/admin/view/:id', component: AdminView }
  ]
})

export default router