<template>
  <NCard title="Lobby" :bordered="false">
    <NSpace vertical :size="16">
      <NAlert v-if="gameStore.errorMessage" type="error" :show-icon="true">
        {{ gameStore.errorMessage }}
      </NAlert>

      <NAlert type="info" :show-icon="true">
        Socket: {{ gameStore.isSocketConnected ? 'connecte' : 'deconnecte' }}
      </NAlert>

      <NAlert v-if="myDecks.length === 0" type="warning" :show-icon="true">
        Chargement des decks...
      </NAlert>

      <NForm @submit.prevent>
        <NFormItem label="Deck selectionne" required>
          <NSelect
            v-model:value="selectedDeckId"
            :options="deckOptions"
            placeholder="Choisissez un deck"
          />
        </NFormItem>
      </NForm>

      <NSpace>
        <NButton
          type="primary"
          :disabled="!selectedDeckId"
          @click="handleCreateRoom"
        >
          Creer une room
        </NButton>
        <NButton @click="gameStore.loadRooms">Rafraichir la liste</NButton>
      </NSpace>

      <NDivider title-placement="left">Rooms disponibles</NDivider>

      <NEmpty
        v-if="gameStore.rooms.length === 0"
        description="Aucune room disponible"
      />

      <NList v-else bordered>
        <NListItem v-for="room in gameStore.rooms" :key="room.id">
          <NSpace justify="space-between" style="width: 100%" align="center">
            <NSpace vertical :size="2">
              <NText strong>{{ room.id }}</NText>
              <NText depth="3" style="font-size: 12px">
                Host: {{ room.hostUsername || 'Inconnu' }} | Joueurs:
                {{ room.playersCount ?? 0 }}/2
              </NText>
            </NSpace>
            <NButton
              type="success"
              :disabled="!selectedDeckId"
              @click="handleJoinRoom(room.id)"
            >
              Rejoindre
            </NButton>
          </NSpace>
        </NListItem>
      </NList>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref, watch } from 'vue'

import { useApi } from '@/composables/useApi'
import { useGameStore } from '@/stores/game.store'

const gameStore = useGameStore()
const api = useApi()
const message = useMessage()

const selectedDeckId = ref<number | null>(null)
const myDecks = ref<{ id: number; name: string }[]>([])

const deckOptions = computed(() => {
  return myDecks.value.map((deck) => ({
    label: deck.name,
    value: deck.id,
  }))
})

const loadDecks = async () => {
  try {
    const decks = await api.getMyDecks()
    myDecks.value = decks.map((deck) => ({ id: deck.id, name: deck.name }))
  } catch (error) {
    message.error(
      `Erreur API: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
    )
    myDecks.value = []
    throw error
  }
}

const handleCreateRoom = async () => {
  if (!selectedDeckId.value) {
    message.error('Veuillez sélectionner un deck.')
    return
  }

  const deckExists = myDecks.value.some((d) => d.id === selectedDeckId.value)
  if (!deckExists) {
    message.error("Ce deck n'existe plus. Veuillez en sélectionner un autre.")
    await loadDecks()
    selectedDeckId.value = null
    return
  }

  const loadingId = message.loading('Création de la room...', { duration: 0 })

  gameStore.createRoom(selectedDeckId.value)

  // Attendre un bit pour voir si une erreur arrive
  setTimeout(() => {
    loadingId.destroy()
    if (gameStore.errorMessage) {
      message.error(`Erreur: ${gameStore.errorMessage}`)
    }
  }, 3000)
}

const handleJoinRoom = async (roomId: string) => {
  if (!selectedDeckId.value) {
    message.error('Veuillez sélectionner un deck.')
    return
  }

  const deckExists = myDecks.value.some((d) => d.id === selectedDeckId.value)
  if (!deckExists) {
    message.error("Ce deck n'existe plus. Veuillez en sélectionner un autre.")
    await loadDecks()
    selectedDeckId.value = null
    return
  }

  gameStore.joinRoom(roomId, selectedDeckId.value)
}

const validateSelectedDeck = async () => {
  if (!selectedDeckId.value) {
    return
  }

  const deckExists = myDecks.value.some((d) => d.id === selectedDeckId.value)

  if (!deckExists) {
    message.error("Ce deck n'existe plus. Veuillez en sélectionner un autre.")
    selectedDeckId.value = null
    await loadDecks()
  }
}

watch(
  () => gameStore.errorMessage,
  (newError) => {
    if (
      newError &&
      (newError.toLowerCase().includes('deck') ||
        newError.toLowerCase().includes('not found'))
    ) {
      selectedDeckId.value = null
      void validateSelectedDeck()
    }
  },
)

onMounted(async () => {
  // Force un nettoyage complet au montage
  localStorage.removeItem('myDecks')
  localStorage.removeItem('decks')
  localStorage.removeItem('selectedDeck')

  // Charger les decks depuis l'API (pas de try/catch ici, laisse loadDecks gérer)
  await loadDecks()

  // Réinitialiser la sélection
  selectedDeckId.value = null

  gameStore.ensureConnected()
  gameStore.loadRooms()
})
</script>
