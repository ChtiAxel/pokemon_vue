<template>
  <article
    class="pokemon-card"
    :class="[
      `pokemon-card--${size}`,
      {
        'pokemon-card--clickable': selectable && !disabled,
        'pokemon-card--selected': selected,
        'pokemon-card--disabled': disabled,
      },
    ]"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <div class="pokemon-card__image-wrap">
      <img :src="card.imgUrl" :alt="card.name" class="pokemon-card__image" />
    </div>

    <div class="pokemon-card__content">
      <p class="pokemon-card__number">#{{ card.pokedexNumber }}</p>
      <h3 class="pokemon-card__name">{{ card.name }}</h3>

      <span class="pokemon-card__type" :style="{ backgroundColor: typeColor }">
        {{ card.type }}
      </span>

      <dl class="pokemon-card__stats">
        <div>
          <dt>HP</dt>
          <dd>{{ card.hp }}</dd>
        </div>
        <div>
          <dt>ATK</dt>
          <dd>{{ card.attack }}</dd>
        </div>
      </dl>

      <div v-if="hasCurrentHp" class="pokemon-card__hp-current">
        <div class="pokemon-card__hp-track">
          <div
            class="pokemon-card__hp-fill"
            :style="{
              width: `${currentHpPercent}%`,
              backgroundColor: hpFillColor,
            }"
          />
        </div>
        <p class="pokemon-card__hp-label">
          {{ clampedCurrentHp }} / {{ card.hp }}
        </p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useColors } from '@/composables/useColors'
import type { Card } from '@/types'

const props = withDefaults(
  defineProps<{
    card: Card
    size?: 'sm' | 'md'
    selectable?: boolean
    selected?: boolean
    disabled?: boolean
    currentHp?: number | null
  }>(),
  {
    size: 'md',
    selectable: false,
    selected: false,
    disabled: false,
    currentHp: null,
  },
)

const emit = defineEmits<{
  click: [card: Card]
}>()

const { getTypeColor, hpColor } = useColors()

const typeColor = computed(() => getTypeColor(props.card.type))
const hasCurrentHp = computed(() => typeof props.currentHp === 'number')
const clampedCurrentHp = computed(() => {
  if (typeof props.currentHp !== 'number') return 0

  return Math.max(0, Math.min(props.currentHp, props.card.hp))
})

const currentHpPercent = computed(() => {
  if (!hasCurrentHp.value || props.card.hp <= 0) return 0

  return Math.round((clampedCurrentHp.value / props.card.hp) * 100)
})

const hpFillColor = computed(() => hpColor(currentHpPercent.value))

const handleClick = () => {
  if (props.disabled || !props.selectable) return

  emit('click', props.card)
}
</script>

<style scoped>
.pokemon-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 2px solid #d9d9df;
  border-radius: 12px;
  background: #fff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.pokemon-card--sm {
  padding: 10px;
}

.pokemon-card--md {
  padding: 14px;
}

.pokemon-card--clickable {
  cursor: pointer;
}

.pokemon-card--clickable:hover {
  border-color: #5d6bf2;
  box-shadow: 0 6px 16px rgb(21 39 130 / 12%);
}

.pokemon-card--selected {
  border-color: #2f54eb;
  box-shadow: 0 0 0 2px rgb(47 84 235 / 18%);
}

.pokemon-card--disabled {
  opacity: 0.45;
}

.pokemon-card__image-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: linear-gradient(180deg, #f7f8ff 0%, #eef1ff 100%);
  overflow: hidden;
}

.pokemon-card--sm .pokemon-card__image-wrap {
  min-height: 90px;
}

.pokemon-card--md .pokemon-card__image-wrap {
  min-height: 128px;
}

.pokemon-card__image {
  width: 100%;
  object-fit: contain;
}

.pokemon-card__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pokemon-card__number {
  margin: 0;
  color: #69707d;
  font-size: 12px;
}

.pokemon-card__name {
  margin: 0;
  color: #1f2430;
}

.pokemon-card--sm .pokemon-card__name {
  font-size: 15px;
}

.pokemon-card--md .pokemon-card__name {
  font-size: 18px;
}

.pokemon-card__type {
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  color: #fff;
  font-weight: 600;
  font-size: 12px;
}

.pokemon-card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
}

.pokemon-card__stats div {
  border-radius: 8px;
  background: #f6f8fb;
  padding: 6px 8px;
}

.pokemon-card__stats dt {
  margin: 0;
  color: #69707d;
  font-size: 11px;
}

.pokemon-card__stats dd {
  margin: 0;
  color: #1f2430;
  font-weight: 700;
  font-size: 14px;
}

.pokemon-card__hp-current {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pokemon-card__hp-track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #e7e9f1;
  overflow: hidden;
}

.pokemon-card__hp-fill {
  height: 100%;
  transition: width 0.2s ease;
}

.pokemon-card__hp-label {
  margin: 0;
  font-size: 12px;
  color: #69707d;
  text-align: right;
}
</style>
