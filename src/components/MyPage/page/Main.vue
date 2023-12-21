<template>
    <div class="main">
        <div class="main-container">
            <MyPage></MyPage>
        </div>
    </div>
</template>

<script>
import MyPage from '../components/MyPage.vue'
export default {
    name: 'Main',
    components: {
        MyPage
    }
}
</script>

<style scoped>
@font-face {
    font-family: 'NotoSansKR-VariableFont_wght';
    src: url(/fonts/NotoSansKR-VariableFont_wght.ttf);
}

* {
    font-family: 'NotoSansKR-VariableFont_wght';
}

.main {
    height: 100%;
    margin-top: 150px;
}

.main-container {
    /* margin-top: 150px; */
    width: 100%;
    height: 65vh;
    margin: auto;
    /* overflow: auto; */
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
