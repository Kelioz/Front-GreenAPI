import type { Dispatch, FormEventHandler, RefObject, SetStateAction } from 'react'
import type { ChatMessage } from '@/entities/Chat'
import type { GreenApiCredentials } from '@/shared/api/greenApi'

export type ChatSidebarProps = {
  credentials: GreenApiCredentials | null
  activePhone: string
  messages: ChatMessage[]
  phoneInput: string
  setPhoneInput: Dispatch<SetStateAction<string>>
  phoneInputRef: RefObject<HTMLInputElement | null>
  createChat: FormEventHandler<HTMLFormElement>
  openCredentials: () => void
  formatTime: (timestamp: number) => string
}
