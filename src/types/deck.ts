import type { Card, DeckCard } from './card.js'

export type DeckCardItem = DeckCard | Card

export interface Deck {
  id: number
  name: string
  userId: number
  cards: DeckCardItem[]
}

export interface DeckPayload {
  name: string
  cards: number[] // tableau de 10 cardId
}
