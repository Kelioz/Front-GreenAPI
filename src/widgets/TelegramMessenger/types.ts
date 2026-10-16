import {
  Dispatch,
  FormEventHandler,
  RefObject,
  SetStateAction,
} from 'react'
import { ChatMessage, ChatConnectionState } from '@/entities/Chat'
import { GreenApiCredentials } from '@/shared/api/greenApi'

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
  createChat: FormEventHandler<HTMLFormElement>
  saveCredentials: FormEventHandler<HTMLFormElement>
  sendMessage: FormEventHandler<HTMLFormElement>
  openCredentials: () => void
  closeChat: () => void
  focusPhoneInput: () => void
  formatTime: (timestamp: number) => string
}
