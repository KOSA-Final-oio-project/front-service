<template>
  <!--searchBar-->
  <div class="row mt-3">
    <form @submit.prevent="submitForm">
      <div class="col-4 ms-auto">
        <div class="input-group">
          <div class="input-group-prepend">
            <select class="form-select" v-model="setType">
              <option value="">---</option>
              <option value="t">제목</option>
              <option value="w">작성자</option>
            </select>
          </div>
          <input type="text" class="form-control" v-model="setKeyword" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary searchBtn" type="submit">Search</button>
          </div>
        </div>
      </div>
    </form>
  </div>
  <!--searchBar-->

  <!--post-->
  <div class="row mt-3">
    <div class="col">
      <div class="card">
        <div class="card-header">{{ categoryName }}</div>
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">번호</th>
                <th scope="col">제목</th>
                <th scope="col">작성자</th>
                <th scope="col">카테고리</th>
                <template v-if="categoryName === 'Q&A'">
                  <th scope="col">공개/비공개</th>
                  <th scope="col">답변여부</th>
                </template>
                <th scope="col">날짜</th>
              </tr>
            </thead>


            <tbody>
                <tr v-for="dto in post.dtoList" :key="dto.pno">
                  <th scope="row">{{ dto.pno }}</th>
                  <td>
                    <RouterLink :to="`/post/view/${dto.pno}`"> <a> {{ dto.title }} </a></RouterLink>
                  </td>
                  <td>{{ dto.nickName }}</td>
                  <td>{{ dto.category }}</td>
                  <template v-if="categoryName === 'Q&A'">
                    <td>{{ dto.key === 0 ? '공개' : '비공개' }}</td>
                    <td>{{ dto.status === 0 ? '답변대기' : '답변완료' }}</td>
                  </template>
                  <td>{{ dto.createdAt }}</td>
                </tr>
            </tbody>
          </table>
          <!--post-->

          <!--paging-->
          <div class="float-end">
            <ul class="pagination flex-wrap">
              <li class="page-item" v-if="post.prev">
                <a
                  class="page-link"
                  :data-num="post.start - 1"
                  @click.prevent.stop="pagingClick(post.start - 1)"
                  >Previous</a
                >
              </li>

              <template v-for="i in getPaging(post.start, post.end)" :key="i">
                <li :class="'page-item' + (post.page === i ? ' active' : '')">
                  <a class="page-link" :data-num="i" @click.prevent.stop="pagingClick(i)">{{
                    i
                  }}</a>
                </li>
              </template>

              <li class="page-item" v-if="post.next">
                <a
                  class="page-link"
                  :data-num="post.end + 1"
                  @click.prevent.stop="pagingClick(post.end + 1)"
                  >Next</a
                >
              </li>
            </ul>
          </div>
          <!--paging-->
        </div>
      </div>
    </div>
  </div>
  <!--post-->

  <!--section-->
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { getAllPost, searchAllPost } from './post'
import { useRoute } from 'vue-router'

const route = useRoute()

const categoryName = ref(route.params.id)
const post = ref([])

watch(() => route.params.id, (newId) => {
  categoryName.value = newId
  getPostAll(categoryName.value)
})

const setType = ref('')
const setKeyword = ref('')

const getPostAll = async (category) => {
  const { data } = await getAllPost(category)
  post.value = data
}

const getPaging = (start, end) => {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

const pagingClick = async (page) => {
  const { data } = await getAllPost(categoryName.value, page, setType.value, setKeyword.value)
  post.value = data
}

const submitForm = async () => {
  const { data } = await searchAllPost(categoryName.value, setType.value, setKeyword.value)
  console.log(data)
  post.value = data
}

onMounted(() => {
  getPostAll(categoryName.value)
})
</script>

<style scoped></style>
