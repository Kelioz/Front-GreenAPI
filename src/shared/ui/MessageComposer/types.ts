import type { Dispatch, FormEventHandler, SetStateAction } from 'react'

export type MessageComposerProps = {
  draft: string
  setDraft: Dispatch<SetStateAction<string>>
  sendMessage: FormEventHandler<HTMLFormElement>
  isSending: boolean
  error: string
}
