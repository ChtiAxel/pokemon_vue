<template>
  <NSpace vertical :size="16" class="game-page">
    <GameZone title="Zone adversaire" :board="gameStore.opponentBoard" />

    <GameActionsBar
      :is-my-turn="gameStore.isMyTurn"
      :is-draw-disabled="isDrawDisabled"
      :is-attack-disabled="isAttackDisabled"
      :message="gameStore.realtimeMessage"
      @draw="gameStore.drawCards"
      @attack="gameStore.attack"
      @end-turn="gameStore.endTurn"
    />

    <GameZone title="Votre zone" :board="gameStore.myBoard">
      <PlayerHand
        :board="gameStore.myBoard"
        :is-my-turn="gameStore.isMyTurn"
        @play-card="gameStore.playCard"
      />
    </GameZone>

    <GameOverModal
      :show="Boolean(gameStore.gameResult)"
      :did-win="didWin"
      :reason="gameStore.gameResult?.reason ?? null"
      @back-to-lobby="handleBackToLobby"
    />
  </NSpace>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import GameActionsBar from '@/components/game/GameActionsBar.vue'
import GameOverModal from '@/components/game/GameOverModal.vue'
import GameZone from '@/components/game/GameZone.vue'
import PlayerHand from '@/components/game/PlayerHand.vue'
import { ROUTES } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { useGameStore } from '@/stores/game.store'

const router = useRouter()
const authStore = useAuthStore()
const gameStore = useGameStore()

const didWin = computed(() => {
  const winnerId = gameStore.gameResult?.winnerId
  return (
    winnerId !== null &&
    winnerId !== undefined &&
    winnerId === authStore.user?.id
  )
})

const isDrawDisabled = computed(() => {
  return (
    !gameStore.isMyTurn ||
    gameStore.myBoard.hand.length >= 5 ||
    gameStore.myBoard.deckRemaining <= 0
  )
})

const isAttackDisabled = computed(() => {
  return (
    !gameStore.isMyTurn ||
    !gameStore.myBoard.activeCard ||
    !gameStore.opponentBoard.activeCard
  )
})

const handleBackToLobby = async () => {
  gameStore.resetGame()
  await router.push(ROUTES.HOME)
}

onMounted(() => {
  gameStore.ensureConnected()
})
</script>

<style scoped>
.game-page {
  width: 100%;
  max-width: 1100px;
  margin: 24px auto;
}
</style>
