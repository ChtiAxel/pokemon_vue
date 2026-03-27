<template>
  <main class="deck-page">
    <NCard title="Modifier le deck">
      <NSpace vertical :size="16">
        <NInput
          v-model:value="name"
          placeholder="Nom du deck"
          maxlength="40"
          show-count
        />

        <NAlert type="info" :show-icon="false">
          {{ selectedIds.length }} / 10 cartes sélectionnées
        </NAlert>

        <NSpin :show="isLoading">
          <PokemonCardGrid
            :cards="cards"
            :selected-ids="selectedIds"
            :max-selected="10"
            selectable
            size="sm"
            @update:selected-ids="selectedIds = $event"
          />
        </NSpin>

        <NButton
          type="primary"
          :loading="isSubmitting"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >
          Enregistrer les modifications
        </NButton>
      </NSpace>
    </NCard>
  </main>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PokemonCardGrid from '@/components/PokemonCardGrid.vue'
import { useApi } from '@/composables/useApi'
import type { Card } from '@/types'
import { extractCardIds } from '@/utils/deckCards'

const api = useApi()
const message = useMessage()
const route = useRoute()
const router = useRouter()

const deckId = route.params.id as string

const name = ref('')
const cards = ref<Card[]>([])
const selectedIds = ref<number[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)

const canSubmit = computed(() => {
  return name.value.trim().length > 0 && selectedIds.value.length === 10
})

const loadData = async () => {
  isLoading.value = true
  try {
    const [deckResponse, cardsResponse] = await Promise.all([
      api.getDeck(deckId),
      api.getCards(),
    ])

    cards.value = cardsResponse
    name.value = deckResponse.name
    selectedIds.value = extractCardIds(deckResponse)
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Impossible de charger ce deck pour édition.'
    message.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true
  try {
    await api.updateDeck(deckId, {
      name: name.value.trim(),
      cards: selectedIds.value,
    })
    message.success('Deck mis à jour.')
    await router.push(`/decks/${deckId}`)
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Impossible de mettre à jour le deck.'
    message.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.deck-page {
  max-width: 1120px;
  margin: 20px auto;
}
</style>
