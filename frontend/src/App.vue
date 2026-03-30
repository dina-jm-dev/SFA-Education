<script setup>
import { ref } from 'vue';
import GSAPLoader from './components/GSAPLoader.vue';

const isAppReady = ref(false);

const handleLoaderLoaded = () => {
    isAppReady.value = true;
};
</script>

<template>
  <GSAPLoader @loaded="handleLoaderLoaded" />
  <router-view v-if="isAppReady" />
</template>

<style scoped>
</style>