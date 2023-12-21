import axios from 'axios'

const apiUrl = 'http://192.168.1.86:9797/content-service'

export function getAllPost(category, page, type, keyword) {
  return axios.get(apiUrl + `/posts/${category}`, { params: { page, type, keyword } })
}

export function searchAllPost(category, type, keyword) {
  return axios.get(apiUrl + `/posts/${category}`, { params: { type, keyword } })
}

export function uploadImage(formObj) {
  return axios.post(apiUrl + '/upload', formObj, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function removeImage(uuid, fileName) {
  return axios.delete(apiUrl + `/remove/${uuid}_${fileName}`)
}

export function postRegister(formdata) {
  return axios.post(apiUrl + '/post/register/테스트', formdata, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// composition 에서는 nickname 제거
export function getPost(postId) {
  return axios.get(apiUrl + `/post/${postId}/테스트`)
}

export function deletePost(postId, fileNames) {
  return axios.delete(apiUrl + `/post/${postId}`, { data: { fileNames } })
}

export function putPost(postId, formdata) {
  return axios.put(apiUrl + `/post/${postId}`, formdata)
}

export function S3removeFile(fileName) {
  return axios.delete(apiUrl + `/remove/${fileName}`)
}

// composition 에서는 nickname 제거
export function getReply(postId) {
  return axios.get(apiUrl + `/replies/${postId}/관리자`)
}
// composition 에서는 nickname 제거
export function replyRegister(formdata) {
  return axios.post(apiUrl + `/reply/register/관리자`, formdata)
}

export function deleteReply(replyId, postId) {
  return axios.delete(apiUrl + `/reply/${replyId}/${postId}`)
}

export function putReply(rno, formdata) {
  return axios.put(apiUrl + `/reply/${rno}`, formdata)
}
