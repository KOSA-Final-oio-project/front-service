<template>
  <div class="page-container">
    <div class="admin-container">
      <div class="row mt-3">
        <div class="col">
          <div class="card">
            <div class="card-header">회원신고</div>
            <div class="card-body">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">번호</th>
                    <th scope="col">제목</th>
                    <th scope="col">작성자</th>
                    <th scope="col">신고된 유저</th>
                    <th scope="col">날짜</th>
                    <th scope="col">처리</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>
                      <RouterLink :to="`/admin/view/1`"> <a> 제목 </a></RouterLink>
                    </td>
                    <td>작성자</td>
                    <td>신고된 유저</td>
                    <td>날짜</td>
                    <td><button @click="dropoutBtn">강퇴</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminList } from './admin'

const adminList = ref([])

// 신고 목록 불러오기
const getList = async () => {
  await getAdminList()
    .then(({ data }) => {
      adminList.value = data
    })
    .catch((error) => {
      console.log(error)
    })
}

const dropoutBtn = () => {
  console.log('눌림')
}

onMounted(() => {
  // getList()
})

// 신고된 회원 강퇴 처리
</script>

<style scoped>
@import './AdminList.css';
</style>
