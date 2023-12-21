<template>
  <div class="row mt-3">
    <div class="col">
      <div class="card">
        <div class="card-header">게시글 등록</div>
        <div class="card-body">
          <form @submit.prevent="submitForm">
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

            <div class="form-check mb-3">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexCheckDefault"
                v-model="showPasswordInput"
              />
              <label class="form-check-label" for="flexCheckDefault"> 비공개 </label>
            </div>

            <div class="input-group mb-3">
              <span class="input-group-text">제목</span>
              <input type="text" v-model="setTitle" class="form-control" />
            </div>

            <div class="input-group mb-3">
              <span class="input-group-text">내용</span>
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
                <button type="submit" class="btn btn-outline-info">등록</button>
                <button type="button" class="btn btn-outline-info mx-2">취소</button>
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
import { uploadImage, postRegister } from './post'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const setCategory = ref('')
const setTitle = ref('')
const setContent = ref('')
const setPassword = ref('')
const setFileNames = ref([])

const showPasswordInput = ref(false)
const formObj = new FormData()
const fileOriginal = ref([])
const fileCopy = ref([])
const fileImage = ref([])

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

const registerApi = async (formdata) => {
  await postRegister(formdata)
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
}

const submitForm = async () => {
  for (let i = 0; i < fileOriginal.value.length; i++) {
    formObj.append('files', fileOriginal.value[i])
  }

  await uploadImage(formObj).then(({ data }) => {
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      setFileNames.value.push(data[i].fileName)
    }
    const formdata = {
      category: setCategory.value,
      key: showPasswordInput.value === true ? 1 : 0,
      password: setPassword.value,
      title: setTitle.value,
      content: setContent.value,
      fileNames: setFileNames.value
    }

    registerApi(formdata)
    
    router.push('/post/list/공지사항');
  })
}
</script>

<style scoped>
@import './PostRegister.css';
</style>
