<template>
  <div class="slide-container">
    다른 분들이 많이 보는 상품이에요
    <div class="slides" ref="slides">
      <div
        class="slide"
        v-for="(movie, index) in movies"
        :key="index"
        :class="{ 'active-slide': index === currentIndex }"
      >
        <img :src="movie.image" alt="Movie Slide" class="movie-poster">
        <div class="movie-info">
          <h3 class="movie-title">{{ movie.title }}</h3>
          <p class="movie-rating">{{ movie.rating }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      movies: [
        { title: '영화 제목 1', rating: '평점 9.0', image: 'src/assets/d.png' },
        { title: '영화 제목 2', rating: '평점 8.5', image: 'src/assets/d.png' },
        { title: '영화 제목 3', rating: '평점 8.2', image: 'src/assets/d.png' },
        { title: '영화 제목 4', rating: '평점 8.2', image: 'src/assets/d.png' },
        { title: '영화 제목 5', rating: '평점 8.2', image: 'src/assets/d.png' },
        // Add more movies as needed
      ],
      currentIndex: 0,
      intervalId: null,
    };
  },
  mounted() {
    this.startHighlighting();
  },
  destroyed() {
    clearInterval(this.intervalId);
  },
  methods: {
    startHighlighting() {
      this.intervalId = setInterval(() => {
        this.nextSlide();
      }, 2000);
    },
    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.movies.length - 1;
      }
    },
    nextSlide() {
      if (this.currentIndex < this.movies.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
    },
  },
};
</script>

<style scoped>
.slide-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.slides {
  display: flex;
  justify-content: center;
  width: 91%;
}

.slide {
  margin:0  1%;
  flex: 0 0 calc(100% / 5);
  position: relative;
  transition: transform 0.5s ease-in-out;
}

.active-slide {
  transform: scale(0.5.0.5);
  z-index: 1;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.movie-poster {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.movie-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  color: white;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  text-align: center;
}

.movie-title {
  margin: 0;
  font-size: 16px;
}

.movie-rating {
  margin: 5px 0;
  font-size: 12px;
}
</style>
