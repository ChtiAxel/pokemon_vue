<template>
  <NModal :show="show" :mask-closable="false">
    <NCard style="max-width: 400px" :bordered="false" title="Partie terminee">
      <NSpace vertical>
        <NText strong>
          {{ didWin ? 'Victoire !' : 'Defaite !' }}
        </NText>
        <NText v-if="reason" depth="3">{{ reason }}</NText>
        <NButton type="primary" @click="$emit('backToLobby')">
          Retourner au lobby
        </NButton>
      </NSpace>
    </NCard>
  </NModal>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  didWin: boolean
  reason: string | null
}>()

defineEmits<{
  backToLobby: []
}>()
</script>
