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
              <span class="input-group-text">Images</span>
              <div class="float-end uploadHidden">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  ADD Files
                </button>
              </div>
            </div>

            <div class="my-4">
              <div class="float-end">
                <button type="submit" class="btn btn-primary submitBtn">Submit</button>
                <button type="reset" class="btn btn-secondary">Reset</button>
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

  <div class="row mt-3">
    <div class="col">
      <div class="container-fluid d-flex uploadResult" style="flex-wrap: wrap">
        <template v-for="file in fileData" :key="file.uuid">
          <div v-if="!file.deleted" class="card col-4">
            <div class="card-header d-flex justify-content-center">
              {{ file.fileName }}
              <button class="btn-sm btn-danger" @click="removeBtn(file.uuid, file.fileName)">
                X
              </button>
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
import { uploadImage, removeImage, postRegister } from './post'
import { ref } from 'vue'

const setCategory = ref('')
const setTitle = ref('')
const setContent = ref('')
const setPassword = ref('')
const setFileNames = ref([])

const showPasswordInput = ref(false)
const formObj = new FormData()
const fileData = ref([])

const handleFileChange = (event) => {
  const files = event.target.files
  for (let i = 0; i < files.length; i++) {
    formObj.append('files', files[i])
  }
}

const uploadBtn = async () => {
  const response = await uploadImage(formObj)
  console.log(response.data)
  fileData.value = response.data
}

const removeBtn = (uuid, fileName) => {
  console.log(uuid)
  const index = fileData.value.findIndex((file) => file.uuid === uuid)
  if (index !== -1) {
    fileData.value[index].deleted = true
  }

  removeImage(uuid, fileName)
}

const submitForm = async () => {
  fileData.value = fileData.value.filter((item) => !item.deleted)

  for (let i = 0; i < fileData.value.length; i++) {
    setFileNames.value.push(fileData.value[i].uuid + '_' + fileData.value[i].fileName)
  }

  const data = {
    category: setCategory.value,
    key: showPasswordInput.value === true ? 1 : 0,
    password: setPassword.value,
    title: setTitle.value,
    content: setContent.value,
    fileNames: setFileNames.value
  }
  console.log(data)

  postRegister(data).then(response => {
    console.log(response)
  }).catch(error => {
    console.log(error)
  })
  


}
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
