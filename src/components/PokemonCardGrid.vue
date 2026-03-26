<template>
  <div class="pokemon-card-grid" role="list">
    <PokemonCard
      v-for="card in cards"
      :key="card.id"
      role="listitem"
      :card="card"
      :size="size"
      :selectable="selectable"
      :selected="isSelected(card.id)"
      :disabled="isCardDisabled(card.id)"
      @click="toggleCard"
    />
  </div>
</template>

<script setup lang="ts">
import PokemonCard from '@/components/PokemonCard.vue'
import type { Card } from '@/types'

const props = withDefaults(
  defineProps<{
    cards: Card[]
    selectedIds?: number[]
    selectable?: boolean
    maxSelected?: number
    size?: 'sm' | 'md'
  }>(),
  {
    selectedIds: () => [],
    selectable: false,
    maxSelected: undefined,
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:selectedIds': [ids: number[]]
}>()

const isSelected = (cardId: number) => props.selectedIds.includes(cardId)

const isCardDisabled = (cardId: number) => {
  if (!props.selectable || typeof props.maxSelected !== 'number') return false

  const hasReachedMax = props.selectedIds.length >= props.maxSelected

  return hasReachedMax && !isSelected(cardId)
}

const toggleCard = (card: Card) => {
  if (!props.selectable) return

  const alreadySelected = isSelected(card.id)

  if (alreadySelected) {
    emit(
      'update:selectedIds',
      props.selectedIds.filter((id) => id !== card.id),
    )
    return
  }

  if (
    typeof props.maxSelected === 'number' &&
    props.selectedIds.length >= props.maxSelected
  ) {
    return
  }

  emit('update:selectedIds', [...props.selectedIds, card.id])
}
</script>

<style scoped>
.pokemon-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

@media (min-width: 992px) {
  .pokemon-card-grid {
    gap: 16px;
  }
}
</style>
