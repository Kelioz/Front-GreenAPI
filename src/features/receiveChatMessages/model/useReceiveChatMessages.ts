import {
  deleteGreenApiNotification,
  GreenApiCredentials,
  receiveGreenApiNotification,
} from '@/shared/api/greenApi'
import {
  ChatMessage,
  ChatConnectionState,
  getPhoneChatId,
  isActiveChatNotification,
} from '@/entities/Chat'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type UseReceiveChatMessagesParams = {
  credentials: GreenApiCredentials | null
  activePhone: string
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
  setError: Dispatch<SetStateAction<string>>
}

export function useReceiveChatMessages({
  credentials,
  activePhone,
  setMessages,
  setError,
}: UseReceiveChatMessagesParams) {
  const [connectionResult, setConnectionResult] = useState<{
    key: string
    state: ChatConnectionState
  } | null>(null)

  useEffect(() => {
    if (!credentials || !activePhone) {
      return
    }

    let isActive = true
    let timeoutId: number | undefined
    const chatId = getPhoneChatId(activePhone)
    const connectionKey = `${credentials.idInstance}:${activePhone}`

    const receiveNext = async () => {
      try {
        const notification = await receiveGreenApiNotification(credentials)
        if (!isActive) return

        if (notification?.receiptId !== undefined) {
          const body = notification.body
          const messageText = body?.messageData?.textMessageData?.textMessage

          if (
            body?.typeWebhook === 'incomingMessageReceived' &&
            isActiveChatNotification(body.senderData, chatId, activePhone) &&
            body.messageData?.typeMessage === 'textMessage' &&
            messageText
          ) {
            const timestamp = (body.timestamp ?? Date.now() / 1000) * 1000
            setMessages((current) => {
              if (
                body.idMessage &&
                current.some((message) => message.id === body.idMessage)
              ) {
                return current
              }
              return [
                ...current,
                {
                  id: body.idMessage ?? `incoming-${timestamp}-${messageText}`,
                  text: messageText,
                  direction: 'incoming',
                  timestamp,
                },
              ]
            })
          }

          await deleteGreenApiNotification(credentials, notification.receiptId)
        }

        if (isActive) {
          setConnectionResult({ key: connectionKey, state: 'connected' })
          timeoutId = window.setTimeout(receiveNext, 1000)
        }
      } catch (error) {
        if (!isActive) return
        setConnectionResult({ key: connectionKey, state: 'idle' })
        setError(
          `Не удалось получить сообщения: ${
            error instanceof Error ? error.message : 'Неизвестная ошибка'
          }`,
        )
        timeoutId = window.setTimeout(receiveNext, 5000)
      }
    }

    void receiveNext()

    return () => {
      isActive = false
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [activePhone, credentials, setError, setMessages])

  if (!credentials || !activePhone) return 'idle'
  const connectionKey = `${credentials.idInstance}:${activePhone}`
  return connectionResult?.key === connectionKey
    ? connectionResult.state
    : 'connecting'
}
