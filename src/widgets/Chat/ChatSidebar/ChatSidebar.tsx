import { ChatAvatar } from '../../../shared/ui/ChatAvatar/ChatAvatar'
import { ChatSidebarProps } from './types'
import styles from './ChatSidebar.module.scss'

export function ChatSidebar({
  credentials,
  activePhone,
  messages,
  phoneInput,
  setPhoneInput,
  phoneInputRef,
  createChat,
  openCredentials,
  formatTime,
}: ChatSidebarProps) {
  const lastMessage = messages[messages.length - 1]

  return (
    <aside className={styles.root__sidebar}>
      <div className={styles.root__brand}>
        <div className={styles.root__brandIcon} aria-hidden='true'>
          <span />
        </div>
        <div>
          <div className={styles.root__brandName}>telegram</div>
          <div className={styles.root__brandCaption}>GREEN-API messenger</div>
        </div>
      </div>

      <div className={styles.root__sidebarHeading}>
        <span>Сообщения</span>
        <span className={styles.root__headingCount}>
          {activePhone ? '1' : '0'}
        </span>
      </div>

      <form className={styles.root__newChatForm} onSubmit={createChat}>
        <label className={styles.root__fieldLabel} htmlFor='phone-number'>
          Новый чат
        </label>
        <div className={styles.root__phoneField}>
          <span className={styles.root__phonePrefix} aria-hidden='true'>
            +
          </span>
          <input
            id='phone-number'
            ref={phoneInputRef}
            type='tel'
            inputMode='tel'
            autoComplete='tel'
            placeholder='Номер телефона'
            value={phoneInput}
            onChange={(event) => setPhoneInput(event.target.value)}
          />
          <button
            className={styles.root__addChatButton}
            type='submit'
            aria-label='Создать чат'
            title='Создать чат'
          >
            +
          </button>
        </div>
        <p className={styles.root__fieldHint}>
          Укажите номер в международном формате
        </p>
      </form>

      {activePhone ? (
        <button className={styles.root__chatItem} type='button'>
          <ChatAvatar initials={activePhone.slice(-2)} />
          <span className={styles.root__chatPreview}>
            <span className={styles.root__chatName}>+{activePhone}</span>
            <span className={styles.root__lastMessage}>
              {lastMessage?.text ?? 'Начните переписку'}
            </span>
          </span>
          <span className={styles.root__chatMeta}>
            {lastMessage && formatTime(lastMessage.timestamp)}
          </span>
        </button>
      ) : (
        <div className={styles.root__emptyList}>
          <span className={styles.root__emptyListIcon}>✳</span>
          <span>Здесь появятся ваши чаты</span>
        </div>
      )}

      <div className={styles.root__sidebarFooter}>
        <div className={styles.root__accountBadge}>
          <span className={styles.root__accountIcon}>G</span>
          <span className={styles.root__accountInfo}>
            <span className={styles.root__accountLabel}>Аккаунт</span>
            <span className={styles.root__accountStatus}>
              <i className={credentials ? styles.root__statusOn : ''} />
              {credentials ? 'Подключен' : 'Не подключен'}
            </span>
          </span>
        </div>
        <button
          className={styles.root__settingsButton}
          type='button'
          onClick={openCredentials}
        >
          <span aria-hidden='true'>⚙</span>
          {credentials ? 'Настройки API' : 'Подключить API'}
        </button>
      </div>
    </aside>
  )
}
