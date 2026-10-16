import type { Dispatch, SetStateAction, SubmitEventHandler } from 'react'

export type MessageComposerProps = {
  draft: string
  setDraft: Dispatch<SetStateAction<string>>
  sendMessage: SubmitEventHandler<HTMLFormElement>
  isSending: boolean
  error: string
}
