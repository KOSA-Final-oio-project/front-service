<template>
  <div class="row mt-3">
    <div class="col">
      <div class="card">
        <div class="card-header">게시글</div>
        <div class="card-body">
          <div class="select-wrapper">
            <select
              class="form-select form-select-sm mb-3"
              v-model="setCategory"
              aria-label="Small select example"
            >
              <option value="공지사항">공지사항</option>
              <option value="Q&A">Q&A</option>
            </select>
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text">Title</span>
            <input type="text" v-model="setTitle" class="form-control" />
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text">Content</span>
            <textarea class="form-control col-sm-5" rows="5" v-model="setContent"></textarea>
          </div>

          <div class="my-4">
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-outline-info" @click="test">확인</button>
              <button type="button" class="btn btn-outline-info mx-2">수정</button>
              <button type="button" class="btn btn-outline-info">삭제</button>
            </div>
          </div>
        </div>
        <!--end card body-->
      </div>
      <!--end card-->
    </div>
    <!-- end col-->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const 안녕 = route.params.id

const test = () => {
  console.log(안녕)
}

const setCategory = ref('')
const setTitle = ref('')
const setContent = ref('')
const setFileNames = ref([])
</script>

<style scoped>
.select-check-wrapper {
  display: flex;
}
.select-wrapper {
  width: 120px;
  margin-right: 40px;
}
</style>
