import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import styles from './MainPage.module.scss'

type GreenApiCredentials = {
  idInstance: string
  apiTokenInstance: string
}

type ChatMessage = {
  id: string
  text: string
  direction: 'incoming' | 'outgoing'
  timestamp: number
}

type GreenApiNotification = {
  receiptId?: number
  body?: {
    typeWebhook?: string
    idMessage?: string
    timestamp?: number
    senderData?: {
      chatId?: string
      senderName?: string
      chatName?: string
    }
    messageData?: {
      typeMessage?: string
      textMessageData?: {
        textMessage?: string
      }
    }
  }
}

const API_ORIGIN = 'https://api.green-api.com'
const POLL_INTERVAL = 1500

function getPhoneChatId(phone: string) {
  return `${phone.replace(/\D/g, '')}@c.us`
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Не удалось выполнить запрос'
}

async function readApiResponse<T>(response: Response): Promise<T> {
  const body: unknown = await response.json()
  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'message' in body
        ? String(body.message)
        : `Ошибка GREEN-API (${response.status})`
    throw new Error(message)
  }
  return body as T
}

export default function MainPage() {
  const [credentials, setCredentials] = useState<GreenApiCredentials | null>(null)
  const [idInstanceInput, setIdInstanceInput] = useState('')
  const [apiTokenInput, setApiTokenInput] = useState('')
  const [showCredentials, setShowCredentials] = useState(false)
  const [phoneInput, setPhoneInput] = useState('')
  const [activePhone, setActivePhone] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'connected'>('idle')
  const messageListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  useEffect(() => {
    if (!credentials || !activePhone) {
      setConnectionState('idle')
      return
    }

    let isActive = true
    let timeoutId: number | undefined
    const chatId = getPhoneChatId(activePhone)
    const encodedId = encodeURIComponent(credentials.idInstance)
    const encodedToken = encodeURIComponent(credentials.apiTokenInstance)
    const baseUrl = `${API_ORIGIN}/waInstance${encodedId}`

    const receiveNext = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/receiveNotification/${encodedToken}`,
        )
        const notification =
          await readApiResponse<GreenApiNotification | null>(response)

        if (!isActive) return
        if (notification?.receiptId !== undefined) {
          const body = notification.body
          const messageText = body?.messageData?.textMessageData?.textMessage
          if (
            body?.typeWebhook === 'incomingMessageReceived' &&
            body.senderData?.chatId === chatId &&
            body.messageData?.typeMessage === 'textMessage' &&
            messageText
          ) {
            const timestamp = (body.timestamp ?? Date.now() / 1000) * 1000
            setMessages((current) => {
              if (current.some((message) => message.id === body.idMessage)) {
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

          const deleteResponse = await fetch(
            `${baseUrl}/deleteNotification/${encodedToken}/${notification.receiptId}`,
            { method: 'DELETE' },
          )
          await readApiResponse<unknown>(deleteResponse)
        }
        if (isActive) {
          setConnectionState('connected')
          setError('')
          timeoutId = window.setTimeout(receiveNext, POLL_INTERVAL)
        }
      } catch (requestError) {
        if (!isActive) return
        setConnectionState('idle')
        setError(`Не удалось получить сообщения: ${getErrorMessage(requestError)}`)
        timeoutId = window.setTimeout(receiveNext, 5000)
      }
    }

    setConnectionState('connecting')
    void receiveNext()
    return () => {
      isActive = false
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [credentials, activePhone])

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

  const sendMessage = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const text = draft.trim()
      if (!credentials || !activePhone || !text || isSending) return
      if (text.length > 4000) {
        setError('Сообщение не должно превышать 4000 символов')
        return
      }

      setIsSending(true)
      setError('')
      try {
        const response = await fetch(
          `${API_ORIGIN}/waInstance${encodeURIComponent(credentials.idInstance)}/sendMessage/${encodeURIComponent(credentials.apiTokenInstance)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chatId: getPhoneChatId(activePhone),
              message: text,
            }),
          },
        )
        const result = await readApiResponse<{ idMessage?: string }>(response)
        setMessages((current) => [
          ...current,
          {
            id: result?.idMessage ?? `outgoing-${Date.now()}`,
            text,
            direction: 'outgoing',
            timestamp: Date.now(),
          },
        ])
        setDraft('')
      } catch (sendError) {
        setError(`Не удалось отправить сообщение: ${getErrorMessage(sendError)}`)
      } finally {
        setIsSending(false)
      }
    },
    [activePhone, credentials, draft, isSending],
  )

  const formatTime = (timestamp: number) =>
    new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp)

  return (
    <main className={styles.messenger}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon} aria-hidden='true'>
            <span />
          </div>
          <div>
            <div className={styles.brandName}>telegram</div>
            <div className={styles.brandCaption}>GREEN-API messenger</div>
          </div>
        </div>

        <div className={styles.sidebarHeading}>
          <span>Сообщения</span>
          <span className={styles.headingCount}>{activePhone ? '1' : '0'}</span>
        </div>

        <form className={styles.newChatForm} onSubmit={createChat}>
          <label className={styles.fieldLabel} htmlFor='phone-number'>
            Новый чат
          </label>
          <div className={styles.phoneField}>
            <span className={styles.phonePrefix} aria-hidden='true'>
              +
            </span>
            <input
              id='phone-number'
              type='tel'
              inputMode='tel'
              autoComplete='tel'
              placeholder='Номер телефона'
              value={phoneInput}
              onChange={(event) => setPhoneInput(event.target.value)}
            />
            <button
              className={styles.addChatButton}
              type='submit'
              aria-label='Создать чат'
              title='Создать чат'
            >
              +
            </button>
          </div>
          <p className={styles.fieldHint}>Укажите номер в международном формате</p>
        </form>

        {activePhone ? (
          <button className={styles.chatItem} type='button'>
            <span className={styles.avatar}>
              {activePhone.slice(-2)}
              <i />
            </span>
            <span className={styles.chatPreview}>
              <span className={styles.chatName}>+{activePhone}</span>
              <span className={styles.lastMessage}>
                {messages.length
                  ? messages[messages.length - 1].text
                  : 'Начните переписку'}
              </span>
            </span>
            <span className={styles.chatMeta}>
              {messages.length > 0 && formatTime(messages[messages.length - 1].timestamp)}
            </span>
          </button>
        ) : (
          <div className={styles.emptyList}>
            <span className={styles.emptyListIcon}>✳</span>
            <span>Здесь появятся ваши чаты</span>
          </div>
        )}

        <div className={styles.sidebarFooter}>
          <div className={styles.accountBadge}>
            <span className={styles.accountIcon}>G</span>
            <span className={styles.accountInfo}>
              <span className={styles.accountLabel}>Аккаунт</span>
              <span className={styles.accountStatus}>
                <i className={credentials ? styles.statusOn : ''} />
                {credentials ? 'Подключен' : 'Не подключен'}
              </span>
            </span>
          </div>
          <button
            className={styles.settingsButton}
            type='button'
            onClick={() => {
              setIdInstanceInput(credentials?.idInstance ?? '')
              setApiTokenInput(credentials?.apiTokenInstance ?? '')
              setShowCredentials(true)
            }}
          >
            <span aria-hidden='true'>⚙</span>
            {credentials ? 'Настройки API' : 'Подключить API'}
          </button>
        </div>
      </aside>

      <section className={styles.chatPanel} aria-label='Чат'>
        {activePhone ? (
          <>
            <header className={styles.chatHeader}>
              <span className={`${styles.avatar} ${styles.headerAvatar}`}>
                {activePhone.slice(-2)}
                <i />
              </span>
              <div className={styles.headerContact}>
                <strong>+{activePhone}</strong>
                <span>
                  <i className={connectionState === 'connected' ? styles.statusOn : ''} />
                  {connectionState === 'connected'
                    ? 'в сети'
                    : connectionState === 'connecting'
                      ? 'подключение…'
                      : 'ожидание соединения'}
                </span>
              </div>
              <div className={styles.headerActions}>
                <span className={styles.encryptedLabel}>GREEN-API</span>
                <span className={styles.headerDots}>···</span>
              </div>
            </header>

            <div className={styles.messagesArea} ref={messageListRef}>
              <div className={styles.datePill}>Сегодня</div>
              {messages.length === 0 ? (
                <div className={styles.startChat}>
                  <span className={styles.startChatIcon}>✦</span>
                  <strong>Ваш чат начинается здесь</strong>
                  <span>Отправьте первое сообщение — оно появится в этом окне</span>
                </div>
              ) : (
                <div className={styles.messageStack}>
                  {messages.map((message) => (
                    <div
                      className={`${styles.messageRow} ${
                        message.direction === 'outgoing' ? styles.outgoingRow : ''
                      }`}
                      key={message.id}
                    >
                      <div
                        className={`${styles.messageBubble} ${
                          message.direction === 'outgoing'
                            ? styles.outgoingBubble
                            : styles.incomingBubble
                        }`}
                      >
                        <p>{message.text}</p>
                        <span className={styles.messageTime}>
                          {formatTime(message.timestamp)}
                          {message.direction === 'outgoing' && (
                            <span className={styles.messageCheck}>✓✓</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <div className={styles.errorBanner}>{error}</div>}
            <form className={styles.composer} onSubmit={sendMessage}>
              <div className={styles.composerBox}>
                <textarea
                  aria-label='Текст сообщения'
                  placeholder='Написать сообщение…'
                  rows={1}
                  maxLength={4000}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      event.currentTarget.form?.requestSubmit()
                    }
                  }}
                />
                <span className={styles.composerHint}>Enter — отправить</span>
                <button
                  className={styles.sendButton}
                  type='submit'
                  disabled={!draft.trim() || isSending}
                  aria-label='Отправить сообщение'
                  title='Отправить'
                >
                  <svg viewBox='0 0 24 24' aria-hidden='true'>
                    <path d='M21.7 2.3a1 1 0 0 0-1.05-.23l-18 7a1 1 0 0 0 .1 1.9l7.7 2.58 2.58 7.7a1 1 0 0 0 .92.68h.05a1 1 0 0 0 .93-.74l7-18a1 1 0 0 0-.23-.89ZM13.66 18l-1.72-5.16 4.77-4.77-1.42-1.42-4.77 4.77L5.36 9.7 19.05 4.4Z' />
                  </svg>
                </button>
              </div>
              {error && <span className={styles.errorInline}>{error}</span>}
            </form>
          </>
        ) : (
          <div className={styles.welcome}>
            <div className={styles.welcomeArtwork}>
              <div className={styles.artworkOrbit} />
              <div className={styles.artworkBubble}>
                <svg viewBox='0 0 64 64' aria-hidden='true'>
                  <path d='M53.8 10.2 45 52c-.7 3-2.4 3.8-4.9 2.4l-13.5-9.9-6.5 6.3c-.7.7-1.3 1.3-2.7 1.3l1-13.8 25.1-22.7c1.1-1-.2-1.6-1.7-.6L10.8 35.2-2.5 31c-2.9-.9-3-2.9.6-4.3L50.3 6.6c2.4-.9 4.5.6 3.5 3.6Z' />
                </svg>
              </div>
              <span className={styles.artworkSparkle}>✦</span>
              <span className={styles.artworkDot} />
            </div>
            <span className={styles.welcomeEyebrow}>ВАШИ СООБЩЕНИЯ — В ОДНОМ МЕСТЕ</span>
            <h1>Ближе, чем кажется</h1>
            <p>
              Подключите GREEN-API и начните переписку в Telegram — просто и
              удобно.
            </p>
            <button
              className={styles.welcomeButton}
              type='button'
              onClick={() => setShowCredentials(true)}
            >
              Подключить GREEN-API
              <span aria-hidden='true'>→</span>
            </button>
            <div className={styles.welcomeNote}>
              <span>✳</span> Только текстовые сообщения. Ваши данные хранятся только
              в этой вкладке.
            </div>
            {error && <div className={styles.errorBanner}>{error}</div>}
          </div>
        )}
      </section>

      {showCredentials && (
        <div
          className={styles.modalBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowCredentials(false)
          }}
        >
          <section
            className={styles.credentialsDialog}
            role='dialog'
            aria-modal='true'
            aria-labelledby='credentials-title'
          >
            <button
              className={styles.closeButton}
              type='button'
              aria-label='Закрыть'
              onClick={() => setShowCredentials(false)}
            >
              ×
            </button>
            <div className={styles.dialogIcon}>G</div>
            <span className={styles.dialogEyebrow}>ПОДКЛЮЧЕНИЕ</span>
            <h2 id='credentials-title'>Подключить GREEN-API</h2>
            <p className={styles.dialogDescription}>
              Введите учетные данные из личного кабинета GREEN-API. Они не
              сохраняются на сервере. Для получения ответов включите входящие
              уведомления и оставьте webhookUrl пустым в настройках инстанса.
            </p>
            <form className={styles.credentialsForm} onSubmit={saveCredentials}>
              <label htmlFor='instance-id'>idInstance</label>
              <input
                id='instance-id'
                autoComplete='off'
                placeholder='Например, 7105284912'
                value={idInstanceInput}
                onChange={(event) => setIdInstanceInput(event.target.value)}
                required
              />
              <label htmlFor='api-token'>apiTokenInstance</label>
              <input
                id='api-token'
                type='password'
                autoComplete='new-password'
                placeholder='Ваш токен доступа'
                value={apiTokenInput}
                onChange={(event) => setApiTokenInput(event.target.value)}
                required
              />
              {error && <div className={styles.dialogError}>{error}</div>}
              <button className={styles.connectButton} type='submit'>
                Сохранить и продолжить
              </button>
            </form>
            <div className={styles.secureNote}>
              <span>▣</span> Подключение напрямую к api.green-api.com
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
