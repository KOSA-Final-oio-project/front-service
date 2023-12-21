<template>
  <div class="page-container">
    <div class="admin-container">
      <div class="row mt-3">
        <div class="col">
          <div class="card">
            <div class="card-header"></div>
            <div class="card-body">
              <div class="input-group mb-3">
                <span class="input-group-text">제목</span>
                <input type="text" v-model="setTitle" class="form-control" readonly />
              </div>

              <div class="input-group mb-3">
                <span class="input-group-text">내용</span>
                <textarea
                  class="form-control col-sm-5"
                  rows="5"
                  v-model="setContent"
                  readonly
                ></textarea>
              </div>

              <div class="my-4">
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-outline-info" @click="confirmBtn">
                    확인
                  </button>
                  <button type="button" class="btn btn-outline-info" @click="removeBtn">
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col">
          <div class="container-fluid d-flex uploadResult" style="flex-wrap: wrap">
            <template v-for="file in setFiles" :key="file">
              <div class="card col-2">
                <div class="card-header d-flex justify-content-center"></div>
                <div class="card-body">
                  <img :src="file" alt="image" height="150" width="150" />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const adminId = route.params.id
const setTitle = ref()
const setContent = ref()
const setFiles = ref([])

const confirmBtn = () => {}

const removeBtn = () => {}

onMounted(() => {})
</script>

<style scoped>
@import './AdminView.css';
</style>
