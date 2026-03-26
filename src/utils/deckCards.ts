import type { Card, Deck } from '@/types'

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const hasCardShape = (value: unknown): value is Card => {
  return (
    isObject(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.hp === 'number' &&
    typeof value.attack === 'number' &&
    typeof value.pokedexNumber === 'number' &&
    typeof value.imgUrl === 'string' &&
    typeof value.type === 'string'
  )
}

const hasDeckCardShape = (
  value: unknown,
): value is { cardId: number; id: number; deckId: number } => {
  return (
    isObject(value) &&
    typeof value.cardId === 'number' &&
    typeof value.id === 'number' &&
    typeof value.deckId === 'number'
  )
}

export const extractCardIds = (deck: Deck): number[] => {
  const ids = deck.cards
    .map((item) => {
      if (hasDeckCardShape(item)) {
        return item.cardId
      }

      if (hasCardShape(item)) {
        return item.id
      }

      return null
    })
    .filter((id): id is number => typeof id === 'number')

  return Array.from(new Set(ids))
}

export const extractResolvedCards = (deck: Deck): Card[] => {
  return deck.cards.filter((item): item is Card => hasCardShape(item))
}

export const resolveDeckCards = (deck: Deck, allCards: Card[]): Card[] => {
  const embeddedCards = extractResolvedCards(deck)

  if (embeddedCards.length > 0) {
    return embeddedCards
  }

  const ids = extractCardIds(deck)

  return ids
    .map((id) => allCards.find((card) => card.id === id))
    .filter((card): card is Card => Boolean(card))
}
