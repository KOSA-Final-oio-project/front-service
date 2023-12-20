<template>
    <div class="footer_container">
        <div class="footer">Footer Content</div>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.footer_container {
    min-height: 30vh; /* Use min-height to ensure the container takes at least the full viewport height */
    position: relative;
}

.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 10px 0;
    background: #f1f1f1;
}
</style>
