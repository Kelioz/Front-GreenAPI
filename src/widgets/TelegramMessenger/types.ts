import type {
  Dispatch,
  SubmitEventHandler,
  RefObject,
  SetStateAction,
} from 'react'
import type { ChatMessage, ChatConnectionState } from '@/entities/Chat'
import type { GreenApiCredentials } from '@/shared/api/greenApi'

export type TelegramMessengerProps = {
  credentials: GreenApiCredentials | null
  idInstanceInput: string
  setIdInstanceInput: Dispatch<SetStateAction<string>>
  apiTokenInput: string
  setApiTokenInput: Dispatch<SetStateAction<string>>
  showCredentials: boolean
  setShowCredentials: Dispatch<SetStateAction<boolean>>
  phoneInput: string
  setPhoneInput: Dispatch<SetStateAction<string>>
  activePhone: string
  messages: ChatMessage[]
  draft: string
  setDraft: Dispatch<SetStateAction<string>>
  error: string
  isSending: boolean
  connectionState: ChatConnectionState
  messageListRef: RefObject<HTMLDivElement | null>
  phoneInputRef: RefObject<HTMLInputElement | null>
  createChat: SubmitEventHandler<HTMLFormElement>
  saveCredentials: SubmitEventHandler<HTMLFormElement>
  sendMessage: SubmitEventHandler<HTMLFormElement>
  openCredentials: () => void
  closeChat: () => void
  focusPhoneInput: () => void
  formatTime: (timestamp: number) => string
}
