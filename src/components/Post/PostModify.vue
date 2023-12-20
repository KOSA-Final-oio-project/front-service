<template>
  <div class="row mt-3">
    <div class="col">
      <div class="card">
        <div class="card-header">게시글 수정</div>
        <div class="card-body">
          <form @submit.prevent="submitForm">
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

            <div class="form-check mb-3">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexCheckDefault"
                v-model="showPasswordInput"
                disabled
              />
              <label class="form-check-label" for="flexCheckDefault"> 비공개 </label>
            </div>

            <div class="input-group mb-3">
              <span class="input-group-text">Title</span>
              <input type="text" v-model="setTitle" class="form-control" />
            </div>

            <div class="input-group mb-3">
              <span class="input-group-text">Content</span>
              <textarea class="form-control col-sm-5" rows="5" v-model="setContent"></textarea>
            </div>

            <div v-if="showPasswordInput" class="pwd-wrapper mb-3">
              <div class="col-auto">
                <label for="inputPassword" class="visually-hidden">Password</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="setPassword"
                  id="inputPassword"
                  placeholder="Password"
                />
              </div>
            </div>

            <div class="input-group mb-3">
              <div class="float-end uploadHidden">
                <button
                  type="button"
                  class="btn btn-outline-info"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  ADD Files
                </button>
              </div>
            </div>

            <div class="my-4">
              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-outline-info">수정</button>
                <button type="button" class="btn btn-outline-info mx-2" @click="cancelBtn">
                  취소
                </button>
              </div>
            </div>
          </form>
        </div>
        <!--end card body-->
      </div>
      <!--end card-->
    </div>
    <!-- end col-->
  </div>
  <!-- end row-->
  <span class="input-group-text">Images</span>

  <div class="row mt-3">
    <div class="col">
      <div class="container-fluid d-flex uploadResult" style="flex-wrap: wrap">
        <template v-if="isFiles">
          <button @click="revokeFile">원본 파일</button>
        </template>
        <template v-for="(file, index) in setFiles" :key="index">
          <div class="card col-2">
            <div class="card-header d-flex justify-content-center">
              원본파일
              <button class="btn-sm btn-danger" @click="removeOriginalBtn(index)">X</button>
            </div>
            <div class="card-body">
              <img :src="setUrl + file" alt="image" height="150" width="150" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>

  <div class="row mt-3">
    <div class="col">
      <div class="container-fluid d-flex uploadResult" style="flex-wrap: wrap">
        <template v-for="(file, index) in fileImage" :key="index">
          <div class="card col-2">
            <div class="card-header d-flex justify-content-center">
              <button class="btn-sm btn-danger" @click="removeBtn(file)">X</button>
            </div>
            <div class="card-body">
              <img :src="file" alt="image" height="150" width="150" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>

  <!-- 첨부파일 추가를 위한 모달창 -->
  <div class="modal uploadModal" id="exampleModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Upload File</h5>
        </div>
        <div class="modal-body">
          <div class="input-group mb-3">
            <input
              type="file"
              name="files"
              class="form-control"
              multiple
              @change="handleFileChange"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="uploadBtn" data-bs-dismiss="modal">
            Upload
          </button>
          <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <!-- register modal -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost, uploadImage, putPost } from './post'

const router = useRouter()
const route = useRoute()
const postId = route.params.id

const post = ref([])
const formObj = new FormData()
const setCategory = ref('')
const setTitle = ref('')
const setContent = ref('')
const isWriter = ref(false)
const setFiles = ref([])
const setPassword = ref('')
const fileOriginal = ref([])
const fileCopy = ref([])
const fileImage = ref([])
const s3OriginalFile = ref([])
const isFiles = ref(false)
const setFileNames = ref([])

const showPasswordInput = ref(false)
const setUrl = 'https://oioproject-bucket.s3.ap-northeast-2.amazonaws.com/'

const getPostOne = async (postId) => {
  const { data } = await getPost(postId)
  console.log(data)
  post.value = data
  setCategory.value = post.value.postDto.category
  setTitle.value = post.value.postDto.title
  setContent.value = post.value.postDto.content
  isWriter.value = post.value.isEquals
  setFiles.value = post.value.postDto.fileNames
  setPassword.value = post.value.postDto.password
}

const handleFileChange = (event) => {
  const files = event.target.files
  for (let i = 0; i < files.length; i++) {
    // fileImage.value.push(URL.createObjectURL(files[i]))
    fileCopy.value.push(files[i])
  }
}
const uploadBtn = async () => {
  // const response = await uploadImage(formObj)
  fileOriginal.value.push(...fileCopy.value)
  fileImage.value = fileCopy.value.map((file) => URL.createObjectURL(file))

  fileCopy.value = []
}

const removeBtn = (file) => {
  const index = fileImage.value.findIndex((fileName) => fileName === file)
  if (index !== -1) {
    fileImage.value.splice(index, 1)
    fileOriginal.value.splice(index, 1)
  }
  console.log(fileImage.value)
}

const removeOriginalBtn = (index) => {
  s3OriginalFile.value.push(setFiles.value[index])
  setFiles.value.splice(index, 1)
  if (setFiles.value.length <= 0) {
    isFiles.value = true
  }
  console.log(s3OriginalFile.value)
}

const revokeFile = () => {
  isFiles.value = false
  setFiles.value = s3OriginalFile.value
  s3OriginalFile.value = []
}

const modifyApi = async (postId, formdata) => {
  await putPost(postId, formdata)
    .then(() => {})
    .catch(() => {})
}

const submitForm = async () => {
  for (let i = 0; i < fileOriginal.value.length; i++) {
    formObj.append('files', fileOriginal.value[i])
  }
  // 삭제된 원본 파일 완전 삭제 api

  //
  await uploadImage(formObj).then(({ data }) => {
    for (let i = 0; i < data.length; i++) {
      setFileNames.value.push(data[i].fileName)
    }

    if (setFiles.value.length > 0) {
      for (let i = 0; i < setFiles.value.length; i++) {
        setFileNames.value.push(setFiles.value[i])
      }
    }

    const formdata = {
      title: setTitle.value,
      content: setContent.value,
      fileNames: setFileNames.value
    }

    modifyApi(postId, formdata)

    router.push('/post/list/공지사항')
  })
}

const cancelBtn = () => {
  router.push(`/post/view/${postId}`)
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
.pwd-wrapper {
  width: 150px;
}
</style>
