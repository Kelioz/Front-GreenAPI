import { useState } from 'react'

interface IUseIsBoolean {
  value: boolean
  setIs: (bool: boolean) => void
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

export function useIsBoolean(init: boolean = false): IUseIsBoolean {
  const [value, setValue] = useState(init)

  function setIs(bool: boolean) {
    setValue(bool)
  }
  function setTrue() {
    setValue(true)
  }
  function setFalse() {
    setValue(false)
  }
  function toggle() {
    setValue((prev) => !prev)
  }

  return {
    value,
    setIs,
    setTrue,
    setFalse,
    toggle,
  }
}
