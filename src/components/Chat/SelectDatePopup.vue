<template>
  <!-- 타이틀 -->
  <div class="title">거래하기</div>

  <!-- info -->
  <div class="info-container">
    <p class="info">※ 1. 거래 시작날짜와 시간을 선택해주세요. ※</p>
    <p class="info">※ 2. 거래 종료날짜와 시간을 선택해주세요. ※</p>
    <p class="info">※ 3. 대여시작 버튼을 클릭하면 대여가 시작됩니다. ※</p>
  </div>

  <!-- 달력 -->
  <div class="date-pick-container">
    <VueDatePicker
      class="date-pick"
      v-model="date"
      :config="datePickerConfig"
      :min-date="minDate"
      inline
      range
      auto-apply
    />
  </div>

  <!-- 시작&종료 날짜 및 시간 확인용 -->
  <div class="selected-info">
    <span class="selected-start">시작: {{ startDate }}</span>
    <span class="tilde">~</span>
    <span class="selected-end">종료: {{ endDate }}</span>
  </div>

  <!-- 대여시작 버튼 -->
  <div class="button-container">
    <button class="start-btn" type="submit">대여시작</button>
  </div>
</template>

<script>
// import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  components: {
    VueDatePicker
  },
  data() {
    return {
      date: [new Date(), null],
      minDate: new Date()
    }
  },
  computed: {
    startDate() {
      return this.formatDate(this.date[0])
    },
    endDate() {
      return this.formatDate(this.date[1])
    }
  },
  methods: {
    formatDate(dateValue) {
      if (!dateValue) return '날짜를 선택해주세요'
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
      return new Date(dateValue).toLocaleDateString('ko-KR', options)
    }
  }
}
</script>

<style scoped>
/* 거래하기 타이틀 */
.title {
  font-size: 25px;
  text-align: center;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 30px;
}

/* 인포들 컨테이너 */
.info-container {
  text-align: center;
  margin-bottom: 25px;
}

/* 인포 세부 설정 */
.info {
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 0.5rem;
}

.date-pick-container {
  text-align: center;
}

/* 달력 크기 */
.date-pick {
  display: inline-block;
  margin: auto;
  width: 450px;
  /* width: auto; */
  margin-bottom: 20px;
}

/*  */
.selected-info {
  text-align: center;
  margin-top: 5px;
}

/* 시작 ~ 종료 사이 물결 */
.tilde {
  margin: 10px;
}

/* 시작&종료 시간 및 날짜 표시 */
.selected-start,
.selected-end {
  font-weight: bold;
}

/* 버튼 영역 */
.button-container {
  margin-top: 30px;
  text-align: center;
}

/* 버튼 */
.start-btn {
  color: white;
  font-weight: 800;
  background-color: #18b7be;
  border-radius: 30px;
  padding: 10px 20px;
  transition:
    background-color 0.3s,
    transform 0.2s;
  cursor: pointer;
  border: none;
  outline: none;
}

/* 버튼 호버 */
.start-btn:hover {
  color: white;
  border-radius: 30px;
  background-color: #178ca4; /* 호버 시 배경색 변경 */
}

.start-btn:active {
  transform: translateY(2px);
}

.start-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px #aaa;
}
</style>
