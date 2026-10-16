import type { Dispatch, SetStateAction, SubmitEventHandler } from 'react'

export type GreenApiCredentialsDialogProps = {
  idInstance: string
  setIdInstance: Dispatch<SetStateAction<string>>
  apiTokenInstance: string
  setApiTokenInstance: Dispatch<SetStateAction<string>>
  error: string
  onSubmit: SubmitEventHandler<HTMLFormElement>
  onClose: () => void
}
