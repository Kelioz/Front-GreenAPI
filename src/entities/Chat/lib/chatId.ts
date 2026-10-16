import { GreenApiSenderData } from '@/shared/api/greenApi'

export function getPhoneChatId(phone: string) {
  return `${phone.replace(/\D/g, '')}@c.us`
}

function normalizeChatId(chatId: string | undefined) {
  return chatId?.split('@')[0].replace(/\D/g, '') ?? ''
}

export function isActiveChatNotification(
  senderData: GreenApiSenderData | undefined,
  chatId: string,
  phone: string,
) {
  if (!senderData) return false

  const senderPhone =
    senderData.senderPhoneNumber === undefined
      ? ''
      : String(senderData.senderPhoneNumber).replace(/\D/g, '')
  const normalizedChatId = normalizeChatId(senderData.chatId)

  return (
    senderData.chatId === chatId ||
    (normalizedChatId !== '' && normalizedChatId === phone) ||
    (senderPhone !== '' && senderPhone === phone)
  )
}
