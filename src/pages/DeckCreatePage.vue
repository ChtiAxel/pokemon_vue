<template>
  <main class="deck-page">
    <NCard title="Créer un deck">
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

        <NSpin :show="isLoadingCards">
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
          Créer le deck
        </NButton>
      </NSpace>
    </NCard>
  </main>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import PokemonCardGrid from '@/components/PokemonCardGrid.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import type { Card } from '@/types'

const api = useApi()
const authStore = useAuthStore()
const message = useMessage()
const router = useRouter()

const name = ref('')
const cards = ref<Card[]>([])
const selectedIds = ref<number[]>([])
const isLoadingCards = ref(false)
const isSubmitting = ref(false)

const canSubmit = computed(() => {
  return name.value.trim().length > 0 && selectedIds.value.length === 10
})

const loadCards = async () => {
  isLoadingCards.value = true
  try {
    cards.value = await api.getCards()
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Impossible de charger les cartes disponibles.'
    message.error(errorMessage)
  } finally {
    isLoadingCards.value = false
  }
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true
  try {
    await api.createDeck({
      name: name.value.trim(),
      cards: selectedIds.value,
    })
    message.success('Deck créé avec succès.')
    await router.push(ROUTES.HOME)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Impossible de créer le deck.'

    if (errorMessage.toLowerCase().includes('failed to create deck')) {
      authStore.signOut()
      message.error('Session invalide. Reconnectez-vous puis réessayez.')
      await router.push(ROUTES.SIGN_IN)
      return
    }

    message.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadCards)
</script>

<style scoped>
.deck-page {
  max-width: 1120px;
  margin: 20px auto;
}
</style>
