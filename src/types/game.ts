import type { Card } from './card.js'

export interface LobbyRoom {
  id: string
  hostUsername?: string
  playersCount?: number
}

export interface ActiveCardInPlay extends Card {
  currentHp: number
}

export interface PlayerBoard {
  userId: number | null
  username: string
  score: number
  deckRemaining: number
  hand: Card[]
  activeCard: ActiveCardInPlay | null
}

export type PlayerRole = 'host' | 'guest' | null

export interface GameState {
  roomId: string | null
  hostId: number | null
  guestId: number | null
  turnPlayerId: number | null
  turnRole: PlayerRole
  host: PlayerBoard
  guest: PlayerBoard
}

export interface GameResult {
  winnerId: number | null
  loserId: number | null
  reason: string | null
}
