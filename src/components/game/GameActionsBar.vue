<template>
  <NCard :bordered="false">
    <NSpace vertical>
      <NText strong>
        {{ isMyTurn ? "C'est votre tour" : "Tour de l'adversaire" }}
      </NText>

      <NSpace>
        <NButton type="info" :disabled="isDrawDisabled" @click="$emit('draw')">
          Piocher
        </NButton>

        <NButton
          type="warning"
          :disabled="isAttackDisabled"
          @click="$emit('attack')"
        >
          Attaquer
        </NButton>

        <NButton type="primary" :disabled="!isMyTurn" @click="$emit('endTurn')">
          Fin de tour
        </NButton>
      </NSpace>

      <NAlert v-if="message" type="info" :show-icon="true">
        {{ message }}
      </NAlert>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
defineProps<{
  isMyTurn: boolean
  isDrawDisabled: boolean
  isAttackDisabled: boolean
  message: string
}>()

defineEmits<{
  draw: []
  attack: []
  endTurn: []
}>()
</script>
