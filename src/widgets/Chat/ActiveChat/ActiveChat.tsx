import { ChatAvatar } from '../../../shared/ui/ChatAvatar/ChatAvatar'
import { ActiveChatProps } from './types'

import styles from './ActiveChat.module.scss'
import { ChatMessages } from '../../../shared/ui/ChatMessages/ChatMessages'
import { MessageComposer } from '../../../shared/ui/MessageComposer/MessageComposer'

export function ActiveChat({
  activePhone,
  connectionState,
  messages,
  messageListRef,
  formatTime,
  draft,
  setDraft,
  sendMessage,
  isSending,
  error,
  onClose,
}: ActiveChatProps) {
  return (
    <>
      <header className={styles.root__chatHeader}>
        <ChatAvatar initials={activePhone.slice(-2)} isLarge />
        <div className={styles.root__headerContact}>
          <strong>+{activePhone}</strong>
          <span>
            <i
              className={
                connectionState === 'connected' ? styles.root__statusOn : ''
              }
            />
            {connectionState === 'connecting'
              ? 'подключение…'
              : 'ожидание соединения'}
          </span>
        </div>
        <div className={styles.root__headerActions}>
          <button
            className={styles.root__closeChatButton}
            type='button'
            aria-label='Закрыть чат'
            title='Закрыть чат'
            onClick={onClose}
          >
            <svg viewBox='0 0 24 24' aria-hidden='true'>
              <path d='m18.3 5.7-1.4-1.4L12 9.2 7.1 4.3 5.7 5.7l4.9 4.9-4.9 4.9 1.4 1.4 4.9-4.9 4.9 4.9 1.4-1.4-4.9-4.9z' />
            </svg>
          </button>
        </div>
      </header>

      <ChatMessages
        messages={messages}
        messageListRef={messageListRef}
        formatTime={formatTime}
      />
      <MessageComposer
        draft={draft}
        setDraft={setDraft}
        sendMessage={sendMessage}
        isSending={isSending}
        error={error}
      />
    </>
  )
}
