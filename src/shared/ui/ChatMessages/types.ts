import type { RefObject } from 'react'
import type { ChatMessage } from '@/entities/Chat'

export type ChatMessagesProps = {
  messages: ChatMessage[]
  messageListRef: RefObject<HTMLDivElement | null>
  formatTime: (timestamp: number) => string
}
