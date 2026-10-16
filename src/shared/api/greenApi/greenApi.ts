import {
  GreenApiCredentials,
  GreenApiNotification,
  GreenApiSendMessageResponse,
} from './types'

const API_ORIGIN = 'https://api.green-api.com'

function getInstanceUrl(credentials: GreenApiCredentials) {
  const idInstance = encodeURIComponent(credentials.idInstance)
  const apiTokenInstance = encodeURIComponent(credentials.apiTokenInstance)
  return {
    base: `${API_ORIGIN}/waInstance${idInstance}`,
    token: apiTokenInstance,
  }
}

async function readResponse<T>(response: Response): Promise<T | null> {
  const text = await response.text()
  const body = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'message' in body
        ? String(body.message)
        : `Ошибка GREEN-API (${response.status})`
    throw new Error(message)
  }

  return body as T | null
}

export async function sendGreenApiMessage(
  credentials: GreenApiCredentials,
  chatId: string,
  message: string
) {
  const { base, token } = getInstanceUrl(credentials)
  const response = await fetch(`${base}/sendMessage/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })

  return readResponse<GreenApiSendMessageResponse>(response)
}

export async function receiveGreenApiNotification(
  credentials: GreenApiCredentials,
  signal?: AbortSignal,
) {
  const { base, token } = getInstanceUrl(credentials)
  const response = await fetch(
    `${base}/receiveNotification/${token}?receiveTimeout=20`,
    { signal },
  )

  return readResponse<GreenApiNotification>(response)
}

export async function deleteGreenApiNotification(
  credentials: GreenApiCredentials,
  receiptId: number
) {
  const { base, token } = getInstanceUrl(credentials)
  const response = await fetch(
    `${base}/deleteNotification/${token}/${receiptId}`,
    { method: 'DELETE' }
  )

  await readResponse(response)
}
