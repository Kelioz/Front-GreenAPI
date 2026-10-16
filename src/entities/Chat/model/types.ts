export type ChatMessage = {
  id: string
  text: string
  direction: 'incoming' | 'outgoing'
  timestamp: number
}

export type ChatConnectionState = 'idle' | 'connecting' | 'connected'
