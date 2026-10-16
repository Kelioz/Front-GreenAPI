import { MessageComposerProps } from './types'
import styles from './MessageComposer.module.scss'

export function MessageComposer({
  draft,
  setDraft,
  sendMessage,
  isSending,
  error,
}: MessageComposerProps) {
  return (
    <>
      {error && <div className={styles.root__errorBanner}>{error}</div>}
      <form className={styles.root__composer} onSubmit={sendMessage}>
        <div className={styles.root__composerBox}>
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
          <span className={styles.root__composerHint}>Enter — отправить</span>
          <button
            className={styles.root__sendButton}
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
        {error && <span className={styles.root__errorInline}>{error}</span>}
      </form>
    </>
  )
}
