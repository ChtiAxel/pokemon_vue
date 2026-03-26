<template>
  <NCard title="Mes decks">
    <template #header-extra>
      <RouterLink to="/decks/new">
        <NButton type="primary">Créer un deck</NButton>
      </RouterLink>
    </template>

    <NSpin :show="isLoading">
      <NEmpty
        v-if="!isLoading && decks.length === 0"
        description="Aucun deck"
      />

      <NList v-else>
        <NListItem v-for="deck in decks" :key="deck.id">
          <NThing :title="deck.name">
            <template #description>{{ deck.cards.length }} cartes</template>

            <NSpace>
              <RouterLink :to="`/decks/${deck.id}`">
                <NButton size="small">Voir</NButton>
              </RouterLink>
              <RouterLink :to="`/decks/${deck.id}/edit`">
                <NButton size="small">Modifier</NButton>
              </RouterLink>
              <NButton
                size="small"
                type="error"
                ghost
                :loading="deletingDeckId === deck.id"
                @click="handleDelete(deck.id)"
              >
                Supprimer
              </NButton>
            </NSpace>
          </NThing>
        </NListItem>
      </NList>
    </NSpin>
  </NCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import type { Deck } from '@/types'

const api = useApi()

const decks = ref<Deck[]>([])
const isLoading = ref(false)
const deletingDeckId = ref<number | null>(null)

const loadDecks = async () => {
  isLoading.value = true
  try {
    decks.value = await api.getMyDecks()
  } finally {
    isLoading.value = false
  }
}

const handleDelete = async (deckId: number) => {
  deletingDeckId.value = deckId
  try {
    await api.deleteDeck(deckId)
    await loadDecks()
  } finally {
    deletingDeckId.value = null
  }
}

onMounted(loadDecks)
</script>
