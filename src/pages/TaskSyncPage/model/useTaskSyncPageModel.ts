import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { ChatMessage } from '@/entities/Chat'
import { GreenApiCredentials } from '@/shared/api/greenApi'
import { useReceiveChatMessages } from '@/features/receiveChatMessages'
import { useSendChatMessage } from '@/features/sendChatMessage'

export function useTaskSyncPageModel() {
  const [credentials, setCredentials] = useState<GreenApiCredentials | null>(
    null,
  )
  const [idInstanceInput, setIdInstanceInput] = useState('')
  const [apiTokenInput, setApiTokenInput] = useState('')
  const [showCredentials, setShowCredentials] = useState(false)
  const [phoneInput, setPhoneInput] = useState('')
  const [activePhone, setActivePhone] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const messageListRef = useRef<HTMLDivElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  const connectionState = useReceiveChatMessages({
    credentials,
    activePhone,
    setMessages,
    setError,
  })

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((current) => [...current, message])
    setDraft('')
  }, [])

  const {
    sendMessage: sendChatMessage,
    isSending,
    sendError,
  } = useSendChatMessage({
    credentials,
    activePhone,
    onMessageSent: appendMessage,
  })

  const createChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedPhone = phoneInput.replace(/\D/g, '')
    if (normalizedPhone.length < 7 || normalizedPhone.length > 15) {
      setError('Введите корректный номер телефона с кодом страны')
      return
    }
    if (!credentials) {
      setError('Сначала подключите GREEN-API')
      setShowCredentials(true)
      return
    }
    setActivePhone(normalizedPhone)
    setPhoneInput('')
    setMessages([])
    setError('')
  }

  const saveCredentials = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const idInstance = idInstanceInput.trim()
    const apiTokenInstance = apiTokenInput.trim()
    if (!idInstance || !apiTokenInstance) {
      setError('Укажите idInstance и apiTokenInstance')
      return
    }
    setCredentials({ idInstance, apiTokenInstance })
    setShowCredentials(false)
    setError('')
  }

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await sendChatMessage(draft)
  }

  const openCredentials = () => {
    setIdInstanceInput(credentials?.idInstance ?? '')
    setApiTokenInput(credentials?.apiTokenInstance ?? '')
    setShowCredentials(true)
  }

  const closeChat = () => {
    setActivePhone('')
    setError('')
  }

  const focusPhoneInput = () => phoneInputRef.current?.focus()

  const formatTime = (timestamp: number) =>
    new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp)

  return {
    credentials,
    idInstanceInput,
    setIdInstanceInput,
    apiTokenInput,
    setApiTokenInput,
    showCredentials,
    setShowCredentials,
    phoneInput,
    setPhoneInput,
    activePhone,
    messages,
    draft,
    setDraft,
    error: error || sendError,
    isSending,
    connectionState,
    messageListRef,
    phoneInputRef,
    createChat,
    saveCredentials,
    sendMessage,
    openCredentials,
    closeChat,
    focusPhoneInput,
    formatTime,
  }
}
