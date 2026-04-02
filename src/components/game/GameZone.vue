<template>
  <NCard :title="title" :bordered="false" class="zone-card">
    <NSpace vertical :size="12">
      <NText strong>Score: {{ board.score }} / 3 KOs</NText>

      <div v-if="board.activeCard" class="active-card-wrapper">
        <NImage
          width="120"
          :src="board.activeCard.imgUrl"
          :alt="board.activeCard.name"
          preview-disabled
        />
        <div class="card-meta">
          <NText strong>{{ board.activeCard.name }}</NText>
          <NProgress
            type="line"
            :percentage="hpPercentage"
            :height="12"
            :show-indicator="false"
            :status="hpPercentage <= 25 ? 'error' : 'success'"
          />
          <NText depth="3">
            HP: {{ board.activeCard.currentHp }} / {{ board.activeCard.hp }}
          </NText>
        </div>
      </div>

      <NEmpty v-else description="Aucune carte active" />

      <slot />
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { PlayerBoard } from '@/types'

const props = defineProps<{
  title: string
  board: PlayerBoard
}>()

const hpPercentage = computed(() => {
  if (!props.board.activeCard || props.board.activeCard.hp <= 0) {
    return 0
  }

  const ratio =
    (props.board.activeCard.currentHp / props.board.activeCard.hp) * 100
  return Math.max(0, Math.min(100, Math.round(ratio)))
})
</script>

<style scoped>
.zone-card {
  min-height: 220px;
}

.active-card-wrapper {
  display: flex;
  gap: 16px;
  align-items: center;
}

.card-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
