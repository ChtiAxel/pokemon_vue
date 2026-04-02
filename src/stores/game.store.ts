import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import { computed, ref } from 'vue'

import router, { ROUTES } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import type {
  ActiveCardInPlay,
  Card,
  GameResult,
  GameState,
  LobbyRoom,
  PlayerBoard,
  PlayerRole,
} from '@/types'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string

const createInitialBoard = (): PlayerBoard => ({
  userId: null,
  username: '',
  score: 0,
  deckRemaining: 0,
  hand: [],
  activeCard: null,
})

const createInitialGameState = (): GameState => ({
  roomId: null,
  hostId: null,
  guestId: null,
  turnPlayerId: null,
  turnRole: null,
  host: createInitialBoard(),
  guest: createInitialBoard(),
})

const toRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>
  }

  return {}
}

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return fallback
}

const toString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return fallback
}

const normalizeCard = (value: unknown): Card | null => {
  const source = toRecord(value)
  const id = toNumber(source.id, -1)

  if (id < 0) {
    return null
  }

  return {
    id,
    name: toString(source.name, 'Carte inconnue'),
    hp: toNumber(source.hp, 0),
    attack: toNumber(source.attack, 0),
    type: toString(source.type, 'Normal') as Card['type'],
    pokedexNumber: toNumber(source.pokedexNumber, 0),
    imgUrl: toString(source.imgUrl, ''),
  }
}

const normalizeActiveCard = (value: unknown): ActiveCardInPlay | null => {
  const source = toRecord(value)
  const maybeCard = normalizeCard(value)

  if (!maybeCard) {
    return null
  }

  return {
    ...maybeCard,
    currentHp: toNumber(source.currentHp ?? source.hp, maybeCard.hp),
  }
}

const normalizeCards = (value: unknown): Card[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((cardValue) => normalizeCard(cardValue))
    .filter((card): card is Card => card !== null)
}

const normalizePlayerBoard = (value: unknown): PlayerBoard => {
  const source = toRecord(value)

  return {
    userId:
      source.userId !== null && source.userId !== undefined
        ? toNumber(source.userId, 0)
        : null,
    username: toString(source.username, ''),
    score: toNumber(source.score ?? source.koCount ?? source.kos, 0),
    deckRemaining: toNumber(
      source.deckRemaining ?? source.deckCount ?? source.deckCardsLeft,
      0,
    ),
    hand: normalizeCards(source.hand ?? source.cardsInHand),
    activeCard: normalizeActiveCard(
      source.activeCard ?? source.currentCard ?? source.inPlayCard,
    ),
  }
}

const normalizeRooms = (value: unknown): LobbyRoom[] => {
  let roomsSource: unknown = value

  if (!Array.isArray(roomsSource)) {
    const payload = toRecord(value)
    const nested =
      payload.rooms ??
      payload.lobbies ??
      payload.availableRooms ??
      payload.items

    if (Array.isArray(nested)) {
      roomsSource = nested
    } else if (nested && typeof nested === 'object') {
      roomsSource = Object.values(toRecord(nested))
    }
  }

  if (!Array.isArray(roomsSource)) {
    return []
  }

  const normalizedRooms: LobbyRoom[] = []

  for (const roomValue of roomsSource) {
    const room = toRecord(roomValue)
    const roomId = toString(room.id ?? room.roomId)

    if (!roomId) {
      continue
    }

    normalizedRooms.push({
      id: roomId,
      hostUsername: toString(room.hostUsername ?? room.hostName),
      playersCount: toNumber(room.playersCount ?? room.currentPlayers, 0),
    })
  }

  return normalizedRooms
}

export const useGameStore = defineStore('game', () => {
  const authStore = useAuthStore()

  const socket = ref<Socket | null>(null)
  const isSocketConnected = ref(false)

  const rooms = ref<LobbyRoom[]>([])
  const currentRoomId = ref<string | null>(null)

  const gameState = ref<GameState>(createInitialGameState())
  const gameResult = ref<GameResult | null>(null)

  const errorMessage = ref<string>('')
  const realtimeMessage = ref<string>('')

  const playerRole = computed<PlayerRole>(() => {
    const currentUserId = authStore.user?.id

    if (!currentUserId) {
      return null
    }

    if (gameState.value.hostId === currentUserId) {
      return 'host'
    }

    if (gameState.value.guestId === currentUserId) {
      return 'guest'
    }

    return null
  })

  const isHost = computed(() => playerRole.value === 'host')

  const isMyTurn = computed(() => {
    const currentUserId = authStore.user?.id

    if (!currentUserId) {
      return false
    }

    if (gameState.value.turnPlayerId !== null) {
      return gameState.value.turnPlayerId === currentUserId
    }

    if (gameState.value.turnRole !== null) {
      return gameState.value.turnRole === playerRole.value
    }

    return false
  })

  const myBoard = computed<PlayerBoard>(() => {
    if (playerRole.value === 'host') {
      return gameState.value.host
    }

    if (playerRole.value === 'guest') {
      return gameState.value.guest
    }

    return createInitialBoard()
  })

  const opponentBoard = computed<PlayerBoard>(() => {
    if (playerRole.value === 'host') {
      return gameState.value.guest
    }

    if (playerRole.value === 'guest') {
      return gameState.value.host
    }

    return createInitialBoard()
  })

  const handleSocketError = (payload: unknown) => {
    const source = toRecord(payload)
    const message = toString(
      source.message ?? payload,
      'Une erreur est survenue.',
    )
    errorMessage.value = message
    realtimeMessage.value = message
  }

  const applyGameState = (payload: unknown) => {
    const source = toRecord(payload)

    gameState.value = {
      roomId: toString(source.roomId, currentRoomId.value ?? '') || null,
      hostId:
        source.hostId !== null && source.hostId !== undefined
          ? toNumber(source.hostId, 0)
          : null,
      guestId:
        source.guestId !== null && source.guestId !== undefined
          ? toNumber(source.guestId, 0)
          : null,
      turnPlayerId:
        source.turnPlayerId !== null && source.turnPlayerId !== undefined
          ? toNumber(source.turnPlayerId, 0)
          : source.currentTurnPlayerId !== null &&
              source.currentTurnPlayerId !== undefined
            ? toNumber(source.currentTurnPlayerId, 0)
            : null,
      turnRole:
        source.turnRole === 'host' || source.currentTurn === 'host'
          ? 'host'
          : source.turnRole === 'guest' || source.currentTurn === 'guest'
            ? 'guest'
            : null,
      host: normalizePlayerBoard(source.host),
      guest: normalizePlayerBoard(source.guest),
    }

    if (gameState.value.roomId) {
      currentRoomId.value = gameState.value.roomId
    }
  }

  const ensureConnected = () => {
    if (socket.value) {
      if (!socket.value.connected) {
        socket.value.connect()
      }
      return
    }

    const token = authStore.token

    if (!token) {
      errorMessage.value = 'Vous devez etre connecte pour acceder au lobby.'
      return
    }

    const client = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: {
        token,
        bearerToken: `Bearer ${token}`,
      },
    })

    client.on('connect', () => {
      isSocketConnected.value = true
      errorMessage.value = ''
    })

    client.on('disconnect', () => {
      isSocketConnected.value = false
    })

    client.on('roomsList', (payload: unknown) => {
      rooms.value = normalizeRooms(payload)
    })

    client.on('roomsListUpdated', (payload: unknown) => {
      const updatedRooms = normalizeRooms(payload)

      if (updatedRooms.length > 0) {
        rooms.value = updatedRooms
        return
      }

      client.emit('getRooms')
    })

    client.on('roomCreated', (payload: unknown) => {
      const source = toRecord(payload)
      const roomId = toString(source.roomId ?? source.id)

      if (!roomId) {
        return
      }

      currentRoomId.value = roomId
      realtimeMessage.value = `Room ${roomId} creee, en attente d'un adversaire.`

      const hostUsername = toString(
        source.hostUsername ?? source.hostName,
        authStore.user?.username ?? '',
      )
      const playersCount = toNumber(
        source.playersCount ?? source.currentPlayers,
        1,
      )

      const alreadyInList = rooms.value.some((room) => room.id === roomId)
      if (!alreadyInList) {
        rooms.value = [
          {
            id: roomId,
            hostUsername,
            playersCount,
          },
          ...rooms.value,
        ]
      }

      client.emit('getRooms')
    })

    client.on('gameStarted', (payload: unknown) => {
      const source = toRecord(payload)
      const gameStatePayload = source.gameState ?? payload

      if (gameStatePayload) {
        applyGameState(gameStatePayload)
      }

      realtimeMessage.value = 'La partie commence.'
      void router.push(ROUTES.GAME)
    })

    client.on('gameStateUpdated', (payload: unknown) => {
      const source = toRecord(payload)
      applyGameState(source.gameState ?? payload)
    })

    client.on('gameEnded', (payload: unknown) => {
      const source = toRecord(payload)
      gameResult.value = {
        winnerId:
          source.winnerId !== null && source.winnerId !== undefined
            ? toNumber(source.winnerId, 0)
            : null,
        loserId:
          source.loserId !== null && source.loserId !== undefined
            ? toNumber(source.loserId, 0)
            : null,
        reason: typeof source.reason === 'string' ? source.reason : null,
      }

      realtimeMessage.value = 'La partie est terminee.'
    })

    client.on('opponentDisconnected', () => {
      realtimeMessage.value = "Votre adversaire s'est deconnecte."
    })

    client.on('error', handleSocketError)

    socket.value = client
  }

  const loadRooms = () => {
    socket.value?.emit('getRooms')
  }

  const createRoom = (deckId: number) => {
    errorMessage.value = ''
    realtimeMessage.value = ''
    socket.value?.emit('createRoom', { deckId })
  }

  const joinRoom = (roomId: string, deckId: number) => {
    errorMessage.value = ''
    realtimeMessage.value = ''
    socket.value?.emit('joinRoom', { roomId, deckId })
  }

  const drawCards = () => {
    if (!currentRoomId.value) {
      return
    }

    socket.value?.emit('drawCards', { roomId: currentRoomId.value })
  }

  const playCard = (cardId: number) => {
    if (!currentRoomId.value) {
      return
    }

    const cardIndex = myBoard.value.hand.findIndex((card) => card.id === cardId)

    if (cardIndex < 0) {
      return
    }

    socket.value?.emit('playCard', {
      roomId: currentRoomId.value,
      cardIndex,
    })
  }

  const attack = () => {
    if (!currentRoomId.value) {
      return
    }

    socket.value?.emit('attack', { roomId: currentRoomId.value })
  }

  const endTurn = () => {
    if (!currentRoomId.value) {
      return
    }

    socket.value?.emit('endTurn', { roomId: currentRoomId.value })
  }

  const resetGame = () => {
    gameState.value = createInitialGameState()
    gameResult.value = null
    currentRoomId.value = null
    realtimeMessage.value = ''
    errorMessage.value = ''
  }

  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
    isSocketConnected.value = false
  }

  return {
    isSocketConnected,
    rooms,
    currentRoomId,
    gameState,
    gameResult,
    playerRole,
    isHost,
    isMyTurn,
    myBoard,
    opponentBoard,
    errorMessage,
    realtimeMessage,
    ensureConnected,
    loadRooms,
    createRoom,
    joinRoom,
    drawCards,
    playCard,
    attack,
    endTurn,
    resetGame,
    disconnect,
  }
})
