<template>
  <div class="row mt-3">
    <div class="col">
      <div class="card">
        <div class="card-header">게시글</div>
        <div class="card-body">
          <div class="select-wrapper">
            <select class="form-select form-select-sm mb-3" aria-label="Small select example">
              <option
                value="공지사항"
                :disabled="setCategory !== '공지사항'"
                :selected="setCategory == '공지사항'"
              >
                공지사항
              </option>
              <option
                value="Q&A"
                :disabled="setCategory !== 'Q&A'"
                :selected="setCategory == 'Q&A'"
              >
                Q&A
              </option>
            </select>
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text">Title</span>
            <input type="text" v-model="setTitle" class="form-control" readonly />
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text">Content</span>
            <textarea
              class="form-control col-sm-5"
              rows="5"
              v-model="setContent"
              readonly
            ></textarea>
          </div>

          <div class="my-4">
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-outline-info" @click="confirmBtn">확인</button>
              <template v-if="isWriter">
                <button type="button" class="btn btn-outline-info mx-2">
                  <RouterLink :to="`/post/modify/${postId}`" class="link">수정</RouterLink>
                </button>
                <button type="button" class="btn btn-outline-info" @click="removeBtn">삭제</button>
              </template>
            </div>
          </div>
        </div>
        <!--end card body-->
      </div>
      <!--end card-->
    </div>
    <!-- end col-->
  </div>

  <div class="row mt-3">
    <div class="col">
      <div class="container-fluid d-flex uploadResult" style="flex-wrap: wrap">
        <template v-for="file in setFiles" :key="file">
          <div class="card col-2">
            <div class="card-header d-flex justify-content-center"></div>
            <div class="card-body">
              <img :src="setUrl + file" alt="image" height="150" width="150" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPost, deletePost } from './post'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const postId = route.params.id
const post = ref([])
const setCategory = ref('')
const setTitle = ref('')
const setContent = ref('')
const isWriter = ref(false)
const setFiles = ref([])
const setUrl = 'https://oioproject-bucket.s3.ap-northeast-2.amazonaws.com/'

const getPostOne = async (postId) => {
  const { data } = await getPost(postId)
  post.value = data
  setCategory.value = post.value.postDto.category
  setTitle.value = post.value.postDto.title
  setContent.value = post.value.postDto.content
  isWriter.value = post.value.isEquals
  setFiles.value = post.value.postDto.fileNames
}

const confirmBtn = () => {
  router.push('/post/list/Q&A')
}

const removeBtn = async () => {
  await deletePost(postId, setFiles.value).then((response) => {
    console.log(response)
    router.push('/post/list/공지사항')
  })
}

onMounted(() => {
  getPostOne(postId)
})
</script>

<style scoped>
.select-check-wrapper {
  display: flex;
}
.select-wrapper {
  width: 120px;
  margin-right: 40px;
}
.link{
  text-decoration: none;
  color:#0dcaf0;
}
.link:hover{
  color:black;
}
</style>
