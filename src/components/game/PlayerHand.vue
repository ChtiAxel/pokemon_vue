<template>
  <NSpace vertical :size="8">
    <NText strong>Main ({{ visibleCards.length }} / 5)</NText>
    <NText depth="3"
      >Cartes restantes dans le deck: {{ board.deckRemaining }}</NText
    >

    <NSpace>
      <NCard
        v-for="card in visibleCards"
        :key="card.id"
        class="hand-card"
        size="small"
        hoverable
        @click="onCardClick(card.id)"
      >
        <NSpace vertical :size="4">
          <NImage
            width="90"
            :src="card.imgUrl"
            :alt="card.name"
            preview-disabled
          />
          <NText>{{ card.name }}</NText>
        </NSpace>
      </NCard>
    </NSpace>
  </NSpace>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { PlayerBoard } from '@/types'

const props = defineProps<{
  board: PlayerBoard
  isMyTurn: boolean
}>()

const emit = defineEmits<{
  playCard: [cardId: number]
}>()

const visibleCards = computed(() => props.board.hand.slice(0, 5))

const canPlayCard = computed(() => {
  return props.isMyTurn && !props.board.activeCard
})

const onCardClick = (cardId: number) => {
  if (!canPlayCard.value) {
    return
  }

  emit('playCard', cardId)
}
</script>

<style scoped>
.hand-card {
  width: 120px;
  cursor: pointer;
}
</style>
