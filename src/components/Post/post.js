import axios from 'axios'

const apiUrl = 'http://127.0.0.1:8889';


export function getAllPost(category, page, type, keyword) {
  return axios.get(apiUrl + `/posts/${category}`, { params: { page, type, keyword } })
}

export function searchAllPost(category,  type, keyword) {
  return axios.get(apiUrl + `/posts/${category}`, { params: { type, keyword } })
}

export function uploadImage(formObj) {
  return axios.post(apiUrl+'/upload', formObj, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export function removeImage(uuid, fileName) {
  return axios.delete(apiUrl+`/remove/${uuid}_${fileName}`)
}

export function postRegister(formdata){
  return axios.post(apiUrl+'/post/register/테스트', formdata, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getPost(postId) {
  return axios.get(apiUrl+`/post/${postId}/테스트`)
}
