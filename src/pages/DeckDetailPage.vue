<template>
  <main class="deck-page">
    <NSpin :show="isLoading">
      <NCard v-if="deck" :title="deck.name">
        <template #header-extra>
          <NButton type="primary" @click="goToEdit">Modifier</NButton>
        </template>

        <PokemonCardGrid :cards="deckCards" size="sm" />
      </NCard>
    </NSpin>
  </main>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PokemonCardGrid from '@/components/PokemonCardGrid.vue'
import { useApi } from '@/composables/useApi'
import type { Card, Deck } from '@/types'
import { resolveDeckCards } from '@/utils/deckCards'

const api = useApi()
const message = useMessage()
const route = useRoute()
const router = useRouter()

const deck = ref<Deck | null>(null)
const deckCards = ref<Card[]>([])
const isLoading = ref(false)

const deckId = route.params.id as string

const loadDeck = async () => {
  isLoading.value = true
  try {
    const [deckResponse, cardsResponse] = await Promise.all([
      api.getDeck(deckId),
      api.getCards(),
    ])

    deck.value = deckResponse
    deckCards.value = resolveDeckCards(deckResponse, cardsResponse)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Impossible de charger ce deck.'
    message.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const goToEdit = async () => {
  await router.push(`/decks/${deckId}/edit`)
}

onMounted(loadDeck)
</script>

<style scoped>
.deck-page {
  max-width: 1120px;
  margin: 20px auto;
}
</style>
