<template>
  <div class="home-page">
    <DeckList />
    <LobbyPanel />
  </div>
</template>

<script setup lang="ts">
import DeckList from '@/components/DeckList.vue'
import LobbyPanel from '@/components/game/LobbyPanel.vue'
</script>

<style scoped>
.home-page {
  max-width: 900px;
  margin: 24px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
