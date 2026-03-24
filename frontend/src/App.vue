<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Redirection simple (exemple)
  router.push('/')
})
</script>

<template>
  <router-view />
</template>

<style scoped>
  
</style>