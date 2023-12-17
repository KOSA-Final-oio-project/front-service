<template>
  <div class="page-container">
    <div class="post-container">
      <div class="sidebar">
        <nav class="nav flex-column ">
          <a class="nav-link" href="#">공지사항</a>
          <a class="nav-link" href="#">Q&A</a>
          <a class="nav-link" href="#">글쓰기</a>
        </nav>
      </div><!--sidebar-->
      <div class="section">
        <div class="row mt-3">
          <form action="/board/list" method="get" >
            <div class="col-4  ms-auto">
              <input type="hidden" name="size" th:value="${pageRequestDTO.size}" />
              <div class="input-group">
                <div class="input-group-prepend">
                  <select class="form-select" name="type">
                    <option value="">---</option>
                    <option value="t" th:selected="${pageRequestDTO.type =='t'}">제목</option>
                    <option value="w" th:selected="${pageRequestDTO.type =='w'}">작성자</option>
                  </select>
                </div>
                <input
                  type="text"
                  class="form-control"
                  name="keyword"
                  th:value="${pageRequestDTO.keyword}"
                />
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary searchBtn" type="submit">Search</button>
                </div>
              </div>
            </div>
          </form>
        </div> <!--searchBar-->

        <div class="row mt-3">
          <div class="col">
            <div class="card">
              <div class="card-header">공지사항</div>
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">번호</th>
                      <th scope="col">제목</th>
                      <th scope="col">작성자</th>
                      <th scope="col">날짜</th>
                    </tr>
                  </thead>

                  <tbody th:with="link = ${pageRequestDTO.getLink()}">
                    <tr vue-for="dto:${responseDTO.dtoList}">
                      <th scope="row">[[${dto.bno}]]</th>
                      <td>
                        <a href="|@{/board/read(bno =${dto.bno})}&${link}|"> [[${dto.title}]] </a>
                      </td>
                      <td>[[${dto.writer}]]</td>
                      <td>[[${#temporals.format(dto.regDate, 'yyyy-MM-dd')}]]</td>
                    </tr>
                  </tbody>
                </table>

                <div class="float-end">
                  <ul class="pagination flex-wrap">
                    <li class="page-item" vue-if="${responseDTO.prev}">
                      <a class="page-link" data-num="${responseDTO.start -1}">Previous</a>
                    </li>

                    <th:block th:each="i: ${#numbers.sequence(responseDTO.start, responseDTO.end)}">
                      <li th:class="${responseDTO.page == i}?'page-item active':'page-item'">
                        <a class="page-link" data-num="${i}">[[${i}]]</a>
                      </li>
                    </th:block>

                    <li class="page-item" vue-if="${responseDTO.next}">
                      <a class="page-link" data-num="${responseDTO.end + 1}">Next</a>
                    </li>
                  </ul>
                </div><!--paging-->
              </div>
            </div>
          </div>
        </div> <!--post-->
      </div><!--section-->
    </div><!--post-container-->
  </div> <!--page-container-->
</template>

<script>
import axios from 'axios';
import {onMounted, ref} from 'vue'

export default {
  setup () {

    const category = ref('Q&A')

    const getPostAll = async () => {
      await axios
      .get(`http://127.0.0.1:8889/posts/${category.value}`, {params:{page, size}})
      .then(response => {
        console.log(response.data);
      })
      .catch(error=>{
        console.log(error);
      })
    }
    
    onMounted(()=>{
      getPostAll();
    })
    
    return {getPostAll, category}
  },
  
}
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

ul,
ol,
li {
  list-style: none;
}

a {
  text-decoration: none;
  outline: 0;
  color: black;
}
.page-container {
  width: 100%;
  height: 100vh;
  padding-top: 150px;
}
.post-container {
  width: 98%;
  height: 100vh;
  display: flex;
}
.sidebar {
  width: 13%;
  height: 100vh;
  padding-top: 4vw ;
  padding-left:3vw ;
  /* border-right: 1px solid black; */
  /* background: aqua; */
}

.section {
  width: 87%;
  height: 100vh;
  /* background: orange; */
}
</style>