import axios from 'axios'

const apiUrl = axios.create({
  baseURL: 'http://192.168.1.86:9797/member/'
});

export function getAdminList() {
  return apiUrl.get('/memeber/')
}
