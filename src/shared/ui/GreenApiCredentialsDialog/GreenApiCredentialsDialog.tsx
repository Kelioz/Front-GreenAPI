import { GreenApiCredentialsDialogProps } from './types'
import styles from './GreenApiCredentialsDialog.module.scss'

export function GreenApiCredentialsDialog({
  idInstance,
  setIdInstance,
  apiTokenInstance,
  setApiTokenInstance,
  error,
  onSubmit,
  onClose,
}: GreenApiCredentialsDialogProps) {
  return (
    <div
      className={styles.root__modalBackdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className={styles.root__credentialsDialog}
        role='dialog'
        aria-modal='true'
        aria-labelledby='credentials-title'
      >
        <button
          className={styles.root__closeButton}
          type='button'
          aria-label='Закрыть'
          onClick={onClose}
        >
          ×
        </button>
        <div className={styles.root__dialogIcon}>G</div>
        <span className={styles.root__dialogEyebrow}>ПОДКЛЮЧЕНИЕ</span>
        <h2 id='credentials-title'>Подключить GREEN-API</h2>
        <p className={styles.root__dialogDescription}>
          Введите учетные данные из личного кабинета GREEN-API. Они не
          сохраняются на сервере. Для получения ответов включите входящие
          уведомления и оставьте webhookUrl пустым в настройках инстанса.
        </p>
        <form className={styles.root__credentialsForm} onSubmit={onSubmit}>
          <label htmlFor='instance-id'>idInstance</label>
          <input
            id='instance-id'
            autoComplete='off'
            placeholder='Например, 7105284912'
            value={idInstance}
            onChange={(event) => setIdInstance(event.target.value)}
            required
          />
          <label htmlFor='api-token'>apiTokenInstance</label>
          <input
            id='api-token'
            type='password'
            autoComplete='new-password'
            placeholder='Ваш токен доступа'
            value={apiTokenInstance}
            onChange={(event) => setApiTokenInstance(event.target.value)}
            required
          />
          {error && <div className={styles.root__dialogError}>{error}</div>}
          <button className={styles.root__connectButton} type='submit'>
            Сохранить и продолжить
          </button>
        </form>
        <div className={styles.root__secureNote}>
          <span>▣</span> Подключение напрямую к api.green-api.com
        </div>
      </section>
    </div>
  )
}
