import { useCallback, useState } from 'react'
import { ChatMessage, getPhoneChatId } from '@/entities/Chat'
import {
  GreenApiCredentials,
  sendGreenApiMessage,
} from '@/shared/api/greenApi'

type UseSendChatMessageParams = {
  credentials: GreenApiCredentials | null
  activePhone: string
  onMessageSent: (message: ChatMessage) => void
}

export function useSendChatMessage({
  credentials,
  activePhone,
  onMessageSent,
}: UseSendChatMessageParams) {
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = useCallback(
    async (text: string) => {
      if (!credentials || !activePhone || !text.trim() || isSending) return
      if (text.trim().length > 4000) {
        setError('Сообщение не должно превышать 4000 символов')
        return
      }

      setIsSending(true)
      setError('')
      try {
        const result = await sendGreenApiMessage(
          credentials,
          getPhoneChatId(activePhone),
          text.trim(),
        )
        onMessageSent({
          id: result?.idMessage ?? `outgoing-${Date.now()}`,
          text: text.trim(),
          direction: 'outgoing',
          timestamp: Date.now(),
        })
      } catch (sendError) {
        setError(
          `Не удалось отправить сообщение: ${
            sendError instanceof Error
              ? sendError.message
              : 'Неизвестная ошибка'
          }`,
        )
      } finally {
        setIsSending(false)
      }
    },
    [activePhone, credentials, isSending, onMessageSent],
  )

  return { sendMessage, isSending, sendError: error }
}
