export type GreenApiCredentials = {
  idInstance: string
  apiTokenInstance: string
}

export type GreenApiSendMessageResponse = {
  idMessage?: string
}

export type GreenApiSenderData = {
  chatId?: string
  senderPhoneNumber?: number | string
  senderName?: string
  chatName?: string
}

export type GreenApiNotification = {
  receiptId?: number
  body?: {
    typeWebhook?: string
    idMessage?: string
    timestamp?: number
    senderData?: GreenApiSenderData
    messageData?: {
      typeMessage?: string
      textMessageData?: {
        textMessage?: string
      }
    }
  }
}
