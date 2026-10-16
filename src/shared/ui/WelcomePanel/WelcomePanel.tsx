import { WelcomePanelProps } from './types'
import styles from './WelcomePanel.module.scss'

export function WelcomePanel({
  isConnected,
  error,
  onConnect,
  onCreateChat,
}: WelcomePanelProps) {
  return (
    <div className={styles.root__welcome}>
      <div
        className={`${styles.root__welcomeArtwork} ${
          isConnected ? styles.root__connectedArtwork : ''
        }`}
      >
        <div className={styles.root__artworkOrbit} />
        <div
          className={`${styles.root__artworkBubble} ${
            isConnected ? styles.root__connectedBubble : ''
          }`}
        >
          {isConnected ? (
            <svg
              className={styles.root__connectedCheckIcon}
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path d='m9.55 18-5.7-5.7 1.4-1.4 4.3 4.28 9.2-9.18 1.4 1.42z' />
            </svg>
          ) : (
            <svg viewBox='0 0 64 64' aria-hidden='true'>
              <path d='M53.8 10.2 45 52c-.7 3-2.4 3.8-4.9 2.4l-13.5-9.9-6.5 6.3c-.7.7-1.3 1.3-2.7 1.3l1-13.8 25.1-22.7c1.1-1-.2-1.6-1.7-.6L10.8 35.2-2.5 31c-2.9-.9-3-2.9.6-4.3L50.3 6.6c2.4-.9 4.5.6 3.5 3.6Z' />
            </svg>
          )}
        </div>
        {isConnected ? (
          <span className={styles.root__connectedBadge} aria-hidden='true'>
            ✓
          </span>
        ) : (
          <>
            <span className={styles.root__artworkSparkle}>✦</span>
            <span className={styles.root__artworkDot} />
          </>
        )}
      </div>
      <span className={styles.root__welcomeEyebrow}>
        {isConnected
          ? 'ПОДКЛЮЧЕНИЕ GREEN-API'
          : 'ВАШИ СООБЩЕНИЯ — В ОДНОМ МЕСТЕ'}
      </span>
      <h1>{isConnected ? 'Всё готово!' : 'Ближе, чем кажется'}</h1>
      <p>
        {isConnected
          ? 'GREEN-API подключен. Создайте чат, чтобы начать переписку в Telegram.'
          : 'Подключите GREEN-API и начните переписку в Telegram — просто и удобно.'}
      </p>
      <button
        className={styles.root__welcomeButton}
        type='button'
        onClick={isConnected ? onCreateChat : onConnect}
      >
        {isConnected ? 'Создать чат' : 'Подключить GREEN-API'}
        <span aria-hidden='true'>→</span>
      </button>
      <div className={styles.root__welcomeNote}>
        <span>{isConnected ? '✓' : '✳'}</span>
        {isConnected
          ? 'Учетные данные сохранены до закрытия вкладки.'
          : 'Только текстовые сообщения. Ваши данные хранятся только в этой вкладке.'}
      </div>
      {error && <div className={styles.root__errorBanner}>{error}</div>}
    </div>
  )
}
