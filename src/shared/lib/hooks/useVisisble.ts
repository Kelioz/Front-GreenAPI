import { useIsBoolean } from './useIsBoolean'

export const useVisible = (initial: boolean = false) => {
  const { value, setFalse, setTrue, toggle, setIs } = useIsBoolean(initial)
  return {
    isVisible: value,
    show: setTrue,
    hide: setFalse,
    toggleVisibility: toggle,
    setIs,
  }
}
