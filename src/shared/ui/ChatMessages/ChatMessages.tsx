import { ChatMessagesProps } from './types'
import styles from './ChatMessages.module.scss'

export function ChatMessages({
  messages,
  messageListRef,
  formatTime,
}: ChatMessagesProps) {
  return (
    <div className={styles.root__messagesArea} ref={messageListRef}>
      <div className={styles.root__datePill}>Сегодня</div>
      {messages.length === 0 ? (
        <div className={styles.root__startChat}>
          <span className={styles.root__startChatIcon}>✦</span>
          <strong>Ваш чат начинается здесь</strong>
          <span>Отправьте первое сообщение — оно появится в этом окне</span>
        </div>
      ) : (
        <div className={styles.root__messageStack}>
          {messages.map((message) => (
            <div
              className={`${styles.root__messageRow} ${
                message.direction === 'outgoing' ? styles.root__outgoingRow : ''
              }`}
              key={message.id}
            >
              <div
                className={`${styles.root__messageBubble} ${
                  message.direction === 'outgoing'
                    ? styles.root__outgoingBubble
                    : styles.root__incomingBubble
                }`}
              >
                <p>{message.text}</p>
                <span className={styles.root__messageTime}>
                  {formatTime(message.timestamp)}
                  <span
                    className={`${styles.root__messageCheck} ${
                      message.direction === 'incoming'
                        ? styles.root__incomingCheck
                        : ''
                    }`}
                    title={
                      message.direction === 'incoming'
                        ? 'Прочитано в этом чате'
                        : undefined
                    }
                    aria-label={
                      message.direction === 'incoming'
                        ? 'Прочитано в этом чате'
                        : undefined
                    }
                  >
                    ✓✓
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
