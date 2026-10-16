import styles from './TelegramMessenger.module.scss'
import { TelegramMessengerProps } from './types'
import { ActiveChat } from '@/widgets/Chat/ActiveChat/ActiveChat'
import { ChatSidebar } from '@/widgets/Chat/ChatSidebar/ChatSidebar'
import { GreenApiCredentialsDialog } from '@/shared/ui/GreenApiCredentialsDialog/GreenApiCredentialsDialog'
import { WelcomePanel } from '@/shared/ui/WelcomePanel/WelcomePanel'

export function TelegramMessenger({
  credentials,
  idInstanceInput,
  setIdInstanceInput,
  apiTokenInput,
  setApiTokenInput,
  showCredentials,
  setShowCredentials,
  phoneInput,
  setPhoneInput,
  activePhone,
  messages,
  draft,
  setDraft,
  error,
  isSending,
  connectionState,
  messageListRef,
  phoneInputRef,
  createChat,
  saveCredentials,
  sendMessage,
  openCredentials,
  closeChat,
  focusPhoneInput,
  formatTime,
}: TelegramMessengerProps) {
  return (
    <div className={styles.root}>
      <div className={styles.root__container}>
        <main className={styles.root__messenger}>
          <ChatSidebar
            credentials={credentials}
            activePhone={activePhone}
            messages={messages}
            phoneInput={phoneInput}
            setPhoneInput={setPhoneInput}
            phoneInputRef={phoneInputRef}
            createChat={createChat}
            openCredentials={openCredentials}
            formatTime={formatTime}
          />
          <section className={styles.root__chatPanel} aria-label='Чат'>
            {activePhone ? (
              <ActiveChat
                activePhone={activePhone}
                connectionState={connectionState}
                messages={messages}
                messageListRef={messageListRef}
                formatTime={formatTime}
                draft={draft}
                setDraft={setDraft}
                sendMessage={sendMessage}
                isSending={isSending}
                error={error}
                onClose={closeChat}
              />
            ) : (
              <WelcomePanel
                isConnected={Boolean(credentials)}
                error={error}
                onConnect={openCredentials}
                onCreateChat={focusPhoneInput}
              />
            )}
          </section>
          {showCredentials && (
            <GreenApiCredentialsDialog
              idInstance={idInstanceInput}
              setIdInstance={setIdInstanceInput}
              apiTokenInstance={apiTokenInput}
              setApiTokenInstance={setApiTokenInput}
              error={error}
              onSubmit={saveCredentials}
              onClose={() => setShowCredentials(false)}
            />
          )}
        </main>
      </div>
    </div>
  )
}
