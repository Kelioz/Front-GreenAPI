import type { Dispatch, FormEventHandler, SetStateAction } from 'react'

export type GreenApiCredentialsDialogProps = {
  idInstance: string
  setIdInstance: Dispatch<SetStateAction<string>>
  apiTokenInstance: string
  setApiTokenInstance: Dispatch<SetStateAction<string>>
  error: string
  onSubmit: FormEventHandler<HTMLFormElement>
  onClose: () => void
}
