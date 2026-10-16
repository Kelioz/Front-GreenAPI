import type {
  Dispatch,
  RefObject,
  SetStateAction,
  SubmitEventHandler,
} from 'react'
import type { ChatConnectionState, ChatMessage } from '@/entities/Chat'

export type ActiveChatProps = {
  activePhone: string
  connectionState: ChatConnectionState
  messages: ChatMessage[]
  messageListRef: RefObject<HTMLDivElement | null>
  formatTime: (timestamp: number) => string
  draft: string
  setDraft: Dispatch<SetStateAction<string>>
  sendMessage: SubmitEventHandler<HTMLFormElement>
  isSending: boolean
  error: string
  onClose: () => void
}
